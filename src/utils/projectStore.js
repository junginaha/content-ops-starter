const DB_NAME = 'onedaybooks-os';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';

function ensureBrowser() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    throw new Error('이 브라우저에서는 로컬 버전 저장소를 사용할 수 없습니다.');
  }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function openDb() {
  ensureBrowser();

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('projectId', 'projectId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB를 열지 못했습니다.'));
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('로컬 저장소 작업에 실패했습니다.'));
  });
}

export async function saveSnapshot({
  projectId,
  label = '수동 저장',
  project,
  manuscript = '',
  processedManuscript = '',
  aiDraft = '',
  engineAnalysis = null
} = {}) {
  if (!projectId) throw new Error('프로젝트 ID가 없습니다.');

  const db = await openDb();
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record = {
      id: newId(),
      projectId,
      label,
      createdAt: Date.now(),
      project,
      manuscript,
      processedManuscript,
      aiDraft,
      engineAnalysis
    };
    await requestToPromise(store.add(record));
    return record;
  } finally {
    db.close();
  }
}

export async function listSnapshots(projectId, limit = 12) {
  if (!projectId) return [];
  const db = await openDb();

  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('projectId');
    const rows = await requestToPromise(index.getAll(IDBKeyRange.only(projectId)));
    return (rows || [])
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, limit);
  } finally {
    db.close();
  }
}

export async function getSnapshot(id) {
  if (!id) return null;
  const db = await openDb();

  try {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return (await requestToPromise(store.get(id))) || null;
  } finally {
    db.close();
  }
}

export async function deleteSnapshot(id) {
  if (!id) return;
  const db = await openDb();

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await requestToPromise(store.delete(id));
  } finally {
    db.close();
  }
}
