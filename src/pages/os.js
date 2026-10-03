import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyzeManuscript,
  buildPrintProofHtml,
  buildProductionReport,
  safeAutoFix
} from '../utils/onedaybooksEngine';
import { extractDocx } from '../utils/docxReader';
import { buildEpub } from '../utils/epubBuilder';
import { buildReleaseBundle } from '../utils/releaseBuilder';
import {
  deleteSnapshot,
  listSnapshots,
  saveSnapshot
} from '../utils/projectStore';
import { evaluateReleaseReadiness } from '../utils/preflight';
import { evaluatePrintPdf, inspectPdfFile } from '../utils/pdfPreflight';

const STAGES = [
  { key: 'intake', label: '접수', note: '원고·저자·목적 확인' },
  { key: 'scope', label: '범위확정', note: '작업 범위·권리·산출물 확정' },
  { key: 'production', label: '제작', note: '편집·교정·디자인·파일 제작' },
  { key: 'qa', label: 'QA', note: '편집·권리·프리플라이트·버전 검수' },
  { key: 'approval', label: '승인', note: '저자 최종 승인' },
  { key: 'release', label: '출간', note: 'ISBN·서점·인쇄 등 외부 절차 연결' },
  { key: 'measure', label: '실측', note: '시간·개입·오류·재작업 기록' }
];

const QA_GATES = [
  { key: 'editorial', label: 'Editorial', note: '문장·구조·편집 기준 통과' },
  { key: 'rights', label: 'Rights', note: '텍스트·이미지·폰트 권리 확인' },
  { key: 'preflight', label: 'Preflight', note: '출력·전자책 파일 사전검사' },
  { key: 'version', label: 'Version', note: '최종 승인본과 배포본 버전 일치' }
];

const EMPTY_PROJECT = {
  projectId: '',
  title: '',
  author: '',
  objective: '전자책',
  isbn: '',
  printSpec: {
    expectedPages: '',
    trimWidthMm: 140,
    trimHeightMm: 210,
    bleedMm: 3
  },
  stageIndex: 0,
  startedAt: null,
  internalCompletedAt: null,
  humanMinutes: 0,
  interventionCount: 0,
  qa: {
    editorial: false,
    rights: false,
    preflight: false,
    version: false
  },
  notes: '',
  fileName: '',
  charCount: 0
};

function createProjectId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `project-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fmtSnapshotTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function fmtDuration(ms) {
  if (!ms || ms < 0) return '0분';
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  if (min >= 60) return `${Math.floor(min / 60)}시간 ${min % 60}분`;
  return `${min}분 ${sec}초`;
}

function splitTextIntoChunks(text, maxChars = 8500) {
  const paragraphs = String(text || '').split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  const pushCurrent = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  paragraphs.forEach((paragraph) => {
    const value = paragraph.trim();
    if (!value) return;

    if (value.length > maxChars) {
      pushCurrent();
      for (let offset = 0; offset < value.length; offset += maxChars) {
        chunks.push(value.slice(offset, offset + maxChars));
      }
      return;
    }

    const candidate = current ? `${current}\n\n${value}` : value;
    if (candidate.length > maxChars) {
      pushCurrent();
      current = value;
    } else {
      current = candidate;
    }
  });

  pushCurrent();
  return chunks;
}

export default function OneDayBooksOS() {
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [now, setNow] = useState(Date.now());
  const [loaded, setLoaded] = useState(false);
  const [manuscript, setManuscript] = useState('');
  const [processedManuscript, setProcessedManuscript] = useState('');
  const [engineAnalysis, setEngineAnalysis] = useState(null);
  const [engineRunAt, setEngineRunAt] = useState(null);
  const [fileError, setFileError] = useState('');
  const [aiAccessKey, setAiAccessKey] = useState('');
  const [aiMode, setAiMode] = useState('proofread');
  const [aiStatus, setAiStatus] = useState('idle');
  const [aiProgress, setAiProgress] = useState({ current: 0, total: 0 });
  const [aiDraft, setAiDraft] = useState('');
  const [aiChanges, setAiChanges] = useState([]);
  const [aiWarnings, setAiWarnings] = useState([]);
  const [aiError, setAiError] = useState('');
  const [aiHealth, setAiHealth] = useState({ status: 'checking', gatewayAuthAvailable: null, model: '' });
  const [printPdfReport, setPrintPdfReport] = useState(null);
  const [printPdfError, setPrintPdfError] = useState('');
  const [epubResult, setEpubResult] = useState(null);
  const [epubError, setEpubError] = useState('');
  const [releaseResult, setReleaseResult] = useState(null);
  const [releaseError, setReleaseError] = useState('');
  const [releaseBuilding, setReleaseBuilding] = useState(false);
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotError, setSnapshotError] = useState('');
  const [snapshotSaving, setSnapshotSaving] = useState(false);
  const autoRestoreRef = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('onedaybooks-os-project');
      if (saved) {
        const parsed = { ...EMPTY_PROJECT, ...JSON.parse(saved) };
        if (!parsed.projectId) parsed.projectId = createProjectId();
        setProject(parsed);
      } else {
        setProject({ ...EMPTY_PROJECT, projectId: createProjectId() });
      }
      const sessionKey = window.sessionStorage.getItem('onedaybooks-os-access-key');
      if (sessionKey) setAiAccessKey(sessionKey);
    } catch (_) {
      setProject({ ...EMPTY_PROJECT, projectId: createProjectId() });
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem('onedaybooks-os-project', JSON.stringify(project));
  }, [project, loaded]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (aiAccessKey) window.sessionStorage.setItem('onedaybooks-os-access-key', aiAccessKey);
      else window.sessionStorage.removeItem('onedaybooks-os-access-key');
    } catch (_) {}
  }, [aiAccessKey, loaded]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/editorial-ai')
      .then((response) => response.json())
      .then((payload) => {
        if (cancelled) return;
        setAiHealth({
          status: payload?.ok ? 'ready' : 'error',
          gatewayAuthAvailable: !!payload?.gatewayAuthAvailable,
          model: payload?.model || ''
        });
      })
      .catch(() => {
        if (!cancelled) {
          setAiHealth({ status: 'error', gatewayAuthAvailable: null, model: '' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loaded || !project.projectId || autoRestoreRef.current) return;

    let cancelled = false;
    listSnapshots(project.projectId, 12)
      .then((rows) => {
        if (cancelled) return;
        setSnapshots(rows);
        const latest = rows[0];
        if (latest && !manuscript) {
          setProject({ ...EMPTY_PROJECT, ...(latest.project || {}), projectId: latest.projectId });
          setManuscript(latest.manuscript || '');
          setProcessedManuscript(latest.processedManuscript || '');
          setAiDraft('');
          setEngineAnalysis(latest.engineAnalysis || analyzeManuscript(latest.processedManuscript || latest.manuscript || ''));
          setEngineRunAt(latest.processedManuscript ? latest.createdAt : null);
        }
        autoRestoreRef.current = true;
      })
      .catch((error) => {
        if (!cancelled) setSnapshotError(error?.message || '버전 기록을 불러오지 못했습니다.');
        autoRestoreRef.current = true;
      });

    return () => {
      cancelled = true;
    };
  }, [loaded, project.projectId]);

  const internalElapsed = useMemo(() => {
    if (!project.startedAt) return 0;
    const end = project.internalCompletedAt || now;
    return Math.max(0, end - project.startedAt);
  }, [project.startedAt, project.internalCompletedAt, now]);

  const qaCount = Object.values(project.qa).filter(Boolean).length;
  const printPdfEvaluation = useMemo(
    () => evaluatePrintPdf(printPdfReport, project.printSpec || EMPTY_PROJECT.printSpec),
    [printPdfReport, project.printSpec]
  );
  const releaseReadiness = useMemo(() => evaluateReleaseReadiness({
    project,
    manuscript,
    processedManuscript,
    engineAnalysis,
    aiStatus,
    aiWarnings,
    epubResult,
    releaseResult,
    printPdfEvaluation
  }), [
    project,
    manuscript,
    processedManuscript,
    engineAnalysis,
    aiStatus,
    aiWarnings,
    epubResult,
    releaseResult,
    printPdfEvaluation
  ]);
  const publicationReady =
    project.stageIndex >= 4 &&
    qaCount === QA_GATES.length &&
    releaseReadiness.ready;
  const withinTarget = internalElapsed > 0 && internalElapsed <= 60 * 60 * 1000;

  function updateField(key, value) {
    setProject((p) => ({ ...p, [key]: value }));
  }

  function updatePrintSpec(key, value) {
    setProject((p) => ({
      ...p,
      printSpec: {
        ...(p.printSpec || EMPTY_PROJECT.printSpec),
        [key]: value
      }
    }));
  }

  function startProject() {
    setProject((p) => ({
      ...p,
      startedAt: p.startedAt || Date.now(),
      stageIndex: Math.max(p.stageIndex, 0)
    }));
  }

  function moveStage(nextIndex) {
    setProject((p) => {
      const internalDone = nextIndex >= 4 && !p.internalCompletedAt
        ? Date.now()
        : p.internalCompletedAt;
      return {
        ...p,
        stageIndex: Math.max(0, Math.min(STAGES.length - 1, nextIndex)),
        internalCompletedAt: internalDone
      };
    });
  }

  function addHumanMinutes(minutes) {
    setProject((p) => ({
      ...p,
      humanMinutes: p.humanMinutes + minutes,
      interventionCount: p.interventionCount + 1
    }));
  }

  function toggleQa(key) {
    setProject((p) => ({
      ...p,
      qa: { ...p.qa, [key]: !p.qa[key] }
    }));
  }

  function resetProject() {
    if (!window.confirm('현재 프로젝트 기록을 초기화할까요?')) return;
    const newProject = { ...EMPTY_PROJECT, projectId: createProjectId() };
    setProject(newProject);
    setManuscript('');
    setProcessedManuscript('');
    setEngineAnalysis(null);
    setEngineRunAt(null);
    setFileError('');
    setAiStatus('idle');
    setAiProgress({ current: 0, total: 0 });
    setPrintPdfReport(null);
    setPrintPdfError('');
    setAiDraft('');
    setAiChanges([]);
    setAiWarnings([]);
    setAiError('');
    setEpubResult(null);
    setEpubError('');
    setReleaseResult(null);
    setReleaseError('');
    setReleaseBuilding(false);
    setSnapshots([]);
    setSnapshotError('');
    setSnapshotSaving(false);
    autoRestoreRef.current = true;
  }

  async function persistVersion(label = '수동 저장', overrides = {}) {
    setSnapshotSaving(true);
    setSnapshotError('');

    try {
      const nextProject = {
        ...(overrides.project || project),
        projectId: (overrides.project || project).projectId || createProjectId()
      };

      if (!project.projectId) setProject(nextProject);

      await saveSnapshot({
        projectId: nextProject.projectId,
        label,
        project: nextProject,
        manuscript: overrides.manuscript ?? manuscript,
        processedManuscript: overrides.processedManuscript ?? processedManuscript,
        aiDraft: overrides.aiDraft ?? aiDraft,
        engineAnalysis: overrides.engineAnalysis ?? engineAnalysis
      });

      const rows = await listSnapshots(nextProject.projectId, 12);
      setSnapshots(rows);
    } catch (error) {
      setSnapshotError(error?.message || '버전 저장에 실패했습니다.');
    } finally {
      setSnapshotSaving(false);
    }
  }

  function restoreVersion(snapshot) {
    if (!snapshot) return;
    setProject({ ...EMPTY_PROJECT, ...(snapshot.project || {}), projectId: snapshot.projectId });
    setManuscript(snapshot.manuscript || '');
    setProcessedManuscript(snapshot.processedManuscript || '');
    setAiDraft('');
    setAiChanges([]);
    setAiWarnings([]);
    setAiError('');
    setEngineAnalysis(snapshot.engineAnalysis || analyzeManuscript(snapshot.processedManuscript || snapshot.manuscript || ''));
    setEngineRunAt(snapshot.processedManuscript ? snapshot.createdAt : null);
    setReleaseResult(null);
    setEpubResult(null);
  }

  async function removeVersion(snapshotId) {
    try {
      await deleteSnapshot(snapshotId);
      setSnapshots((rows) => rows.filter((row) => row.id !== snapshotId));
    } catch (error) {
      setSnapshotError(error?.message || '버전 삭제에 실패했습니다.');
    }
  }

  function downloadBlob(name, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadText(name, content, type = 'text/plain;charset=utf-8') {
    downloadBlob(name, new Blob([content], { type }));
  }

  function runProductionEngine() {
    if (!manuscript) return;
    const result = safeAutoFix(manuscript);
    setProcessedManuscript(result.text);
    setEngineAnalysis(result.analysis);
    setEngineRunAt(Date.now());
    setProject((p) => ({
      ...p,
      stageIndex: Math.max(p.stageIndex, 3),
      notes: p.notes
    }));
  }

  function exportCleanManuscript() {
    if (!processedManuscript) return;
    const safeTitle = (project.title || 'manuscript').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    downloadText(`${safeTitle}_clean.txt`, processedManuscript);
  }

  function exportPrintProof() {
    if (!processedManuscript) return;
    const safeTitle = (project.title || 'book').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    const html = buildPrintProofHtml({
      title: project.title || '제목 없음',
      author: project.author || '',
      manuscript: processedManuscript
    });
    downloadText(`${safeTitle}_140x210_proof.html`, html, 'text/html;charset=utf-8');
  }

  function exportEpub() {
    const source = processedManuscript || manuscript;
    if (!source) return;
    setEpubError('');

    try {
      const result = buildEpub({
        title: project.title,
        author: project.author,
        manuscript: source,
        isbn: project.isbn,
        publisher: 'OneDayBooks'
      });

      const safeTitle = (project.title || 'book').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
      downloadBlob(`${safeTitle}.epub`, result.blob);

      const checksPassed = Object.values(result.technicalChecks).every(Boolean);
      setEpubResult({
        identifier: result.identifier,
        metadata: result.metadata,
        technicalChecks: result.technicalChecks,
        checksPassed,
        generatedAt: Date.now()
      });

      setProject((p) => ({
        ...p,
        stageIndex: Math.max(p.stageIndex, 3)
      }));
    } catch (error) {
      setEpubError(error?.message || 'EPUB 생성 중 오류가 발생했습니다.');
    }
  }

  async function exportReleaseBundle() {
    if (!processedManuscript) return;

    setReleaseBuilding(true);
    setReleaseError('');

    try {
      const result = await buildReleaseBundle({
        title: project.title,
        author: project.author,
        objective: project.objective,
        isbn: project.isbn,
        originalText: manuscript,
        processedText: processedManuscript
      });

      downloadBlob(result.fileName, result.blob);
      setReleaseResult({
        generatedAt: result.generatedAt,
        files: result.files,
        epubIdentifier: result.epubIdentifier,
        checksPassed: Object.values(result.technicalChecks).every(Boolean)
      });

      setProject((p) => ({
        ...p,
        stageIndex: Math.max(p.stageIndex, 3)
      }));
    } catch (error) {
      setReleaseError(error?.message || '출간 패키지 생성 중 오류가 발생했습니다.');
    } finally {
      setReleaseBuilding(false);
    }
  }

  function exportProductionReport() {
    if (!manuscript) return;
    const report = buildProductionReport({
      title: project.title,
      author: project.author,
      objective: project.objective,
      originalText: manuscript,
      processedText: processedManuscript || manuscript
    });
    const safeTitle = (project.title || 'project').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    downloadText(
      `onedaybooks_${safeTitle}_production_report.json`,
      JSON.stringify(report, null, 2),
      'application/json;charset=utf-8'
    );
  }

  function exportJson() {
    const payload = {
      product: 'OneDayBooks AI Publishing OS',
      measurement_scope: 'internal-production-only',
      external_exclusions: ['ISBN 발급', '서점 검수·등록', '인쇄', '배송'],
      exported_at: new Date().toISOString(),
      project: {
        ...project,
        internalElapsedMs: internalElapsed,
        internalElapsedMinutes: Math.round((internalElapsed / 60000) * 100) / 100,
        qaPassed: qaCount,
        publicationReady
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (project.title || 'project').replace(/[^0-9a-zA-Z가-힣_-]+/g, '_');
    a.href = url;
    a.download = `onedaybooks_${safeTitle}_metrics.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function readPrintPdf(file) {
    if (!file) return;
    setPrintPdfError('');

    try {
      const report = await inspectPdfFile(file);
      setPrintPdfReport(report);
    } catch (error) {
      setPrintPdfReport(null);
      setPrintPdfError(error?.message || '인쇄 PDF를 검사하지 못했습니다.');
    }
  }

  async function readManuscriptFile(file) {
    if (!file) return;
    setFileError('');
    setAiDraft('');
    setAiChanges([]);
    setAiWarnings([]);
    setAiError('');

    try {
      let text = '';
      let metadata = {};

      if (/\.docx$/i.test(file.name || '')) {
        const extracted = await extractDocx(file);
        text = extracted.text;
        metadata = extracted.metadata || {};
      } else if (/\.(txt|md)$/i.test(file.name || '') || /^text\//i.test(file.type || '')) {
        text = await file.text();
      } else {
        throw new Error('현재는 DOCX, TXT, MD 원고를 지원합니다. PDF 원고 입력은 다음 단계에서 추가합니다.');
      }

      setManuscript(text);
      setProcessedManuscript('');
      setEngineAnalysis(analyzeManuscript(text));
      setEngineRunAt(null);
      const nextProject = {
        ...project,
        projectId: project.projectId || createProjectId(),
        title: project.title || metadata.title || '',
        author: project.author || metadata.creator || '',
        fileName: file.name,
        charCount: text.length,
        startedAt: project.startedAt || Date.now()
      };
      setProject(nextProject);
      await persistVersion('원고 접수', {
        project: nextProject,
        manuscript: text,
        processedManuscript: '',
        aiDraft: '',
        engineAnalysis: analyzeManuscript(text)
      });
    } catch (error) {
      setFileError(error?.message || '원고 파일을 읽지 못했습니다.');
    }
  }

  async function runAiEditorial() {
    const baseText = processedManuscript || manuscript;
    if (!baseText) return;

    if (!aiAccessKey.trim()) {
      setAiError('AI 교정을 사용하려면 OneDayBooks OS 접근키를 입력해 주세요.');
      return;
    }

    const chunks = splitTextIntoChunks(baseText);
    if (!chunks.length) return;
    if (chunks.length > 24) {
      setAiError('현재 AI 교정 MVP는 약 20만 자 이하 원고를 권장합니다. 원고를 분권하거나 나눠 처리해 주세요.');
      return;
    }

    setAiStatus('running');
    setAiError('');
    setAiDraft('');
    setAiChanges([]);
    setAiWarnings([]);
    setAiProgress({ current: 0, total: chunks.length });

    const revisedChunks = [];
    const changes = [];
    const warnings = [];

    try {
      for (let index = 0; index < chunks.length; index += 1) {
        const response = await fetch('/api/editorial-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-onedaybooks-key': aiAccessKey.trim()
          },
          body: JSON.stringify({
            text: chunks[index],
            mode: aiMode
          })
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload?.error || `AI 교정 ${index + 1}/${chunks.length} 처리에 실패했습니다.`);
        }

        revisedChunks.push(payload.revised_text || chunks[index]);
        if (Array.isArray(payload.changes)) changes.push(...payload.changes);
        if (Array.isArray(payload.warnings)) warnings.push(...payload.warnings);
        setAiProgress({ current: index + 1, total: chunks.length });
      }

      setAiDraft(revisedChunks.join('\n\n'));
      setAiChanges(changes);
      setAiWarnings(warnings);
      setAiStatus('review');
    } catch (error) {
      setAiStatus('error');
      setAiError(error?.message || 'AI 교정 중 오류가 발생했습니다.');
    }
  }

  async function applyAiDraft() {
    if (!aiDraft) return;
    const analysis = analyzeManuscript(aiDraft);
    const nextProject = {
      ...project,
      projectId: project.projectId || createProjectId(),
      stageIndex: Math.max(project.stageIndex, 3),
      interventionCount: project.interventionCount + 1
    };

    setProcessedManuscript(aiDraft);
    setEngineAnalysis(analysis);
    setEngineRunAt(Date.now());
    setProject(nextProject);
    setAiStatus('applied');

    await persistVersion('AI 교정 적용', {
      project: nextProject,
      processedManuscript: aiDraft,
      aiDraft: '',
      engineAnalysis: analysis
    });
  }

  function discardAiDraft() {
    setAiDraft('');
    setAiChanges([]);
    setAiWarnings([]);
    setAiError('');
    setAiStatus('idle');
    setAiProgress({ current: 0, total: 0 });
  }

  return (
    <>
      <Head>
        <title>OneDayBooks OS | 원고에서 출간 가능한 책까지</title>
        <meta
          name="description"
          content="원고 접수부터 편집·디자인·QA·승인·출간 연결까지 통제하고 실측하는 OneDayBooks AI Publishing OS MVP."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="os-shell">
        <header className="hero">
          <div className="eyebrow">ONEDAYBOOKS · AI PUBLISHING OS / MVP</div>
          <h1>원고 하나가 들어오면<br />출간 가능한 책으로 나온다.</h1>
          <p className="hero-copy">
            지금은 딱 하나에 집중합니다. 최소한의 인간 개입으로
            <strong> 원고 → 제작 → QA → 승인</strong> 흐름을 반복 가능하게 만들고,
            그 시간을 실제 데이터로 남깁니다.
          </p>
          <div className="scope-note">
            내부 제작 목표: 60분 이내 · ISBN 발급, 서점 검수·등록, 인쇄·배송은 외부 일정으로 별도 측정
          </div>
        </header>

        <section className="metrics">
          <Metric label="내부 제작 시간" value={fmtDuration(internalElapsed)} emphasis={withinTarget} />
          <Metric label="인간 개입 시간" value={`${project.humanMinutes}분`} />
          <Metric label="인간 개입 횟수" value={`${project.interventionCount}회`} />
          <Metric label="QA 통과" value={`${qaCount}/${QA_GATES.length}`} emphasis={qaCount === QA_GATES.length} />
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">01 · INPUT</div>
              <h2>프로젝트 접수</h2>
            </div>
            <button className="ghost" onClick={resetProject}>초기화</button>
          </div>

          <div className="form-grid">
            <label>
              <span>책 제목</span>
              <input
                value={project.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="예: 나의 첫 번째 책"
              />
            </label>
            <label>
              <span>저자</span>
              <input
                value={project.author}
                onChange={(e) => updateField('author', e.target.value)}
                placeholder="저자명"
              />
            </label>
            <label>
              <span>출간 목표</span>
              <select value={project.objective} onChange={(e) => updateField('objective', e.target.value)}>
                <option>전자책</option>
                <option>종이책</option>
                <option>전자책 + 종이책</option>
                <option>출판사 투고</option>
              </select>
            </label>
            <label>
              <span>ISBN (선택)</span>
              <input
                value={project.isbn || ''}
                onChange={(e) => updateField('isbn', e.target.value)}
                placeholder="예: 979-11-..."
              />
            </label>
            <label>
              <span>원고 파일</span>
              <input
                className="file"
                type="file"
                accept=".docx,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                onChange={(e) => readManuscriptFile(e.target.files?.[0])}
              />
            </label>
          </div>

          {project.fileName && (
            <div className="file-info">
              {project.fileName} · 약 {project.charCount.toLocaleString()}자 · DOCX/TXT/MD 입력 지원
            </div>
          )}
          {fileError && <div className="error-box">{fileError}</div>}

          <button className="primary" onClick={startProject} disabled={!!project.startedAt}>
            {project.startedAt ? '측정 중' : '제작 타이머 시작'}
          </button>
        </section>


        <section className="panel engine-panel">
          <div className="section-head">
            <div>
              <div className="kicker">02 · PRODUCTION ENGINE</div>
              <h2>원고를 자동으로 정리하고 검사</h2>
            </div>
            <span className={`status-pill ${engineRunAt ? 'ready' : ''}`}>
              {engineRunAt ? 'ENGINE RUN' : '대기'}
            </span>
          </div>

          <p className="muted">
            현재 v0.1은 사람 판단이 필요 없는 안전한 작업만 자동화합니다.
            줄바꿈·탭·연속 공백·문장부호 앞 공백을 정리하고,
            구조와 기계적 오류를 검사합니다. 내용·사실·권리는 임의로 바꾸지 않습니다.
          </p>

          <div className="engine-actions">
            <button className="primary" onClick={runProductionEngine} disabled={!manuscript}>
              원고 자동 정리 실행
            </button>
            <button className="secondary" onClick={exportCleanManuscript} disabled={!processedManuscript}>
              정리 원고 받기
            </button>
            <button className="secondary" onClick={exportPrintProof} disabled={!processedManuscript}>
              140×210 내지 프루프
            </button>
            <button className="secondary" onClick={exportEpub} disabled={!manuscript}>
              전자책 EPUB 생성
            </button>
            <button className="secondary" onClick={exportProductionReport} disabled={!manuscript}>
              제작 리포트
            </button>
            <button
              className="secondary"
              onClick={exportReleaseBundle}
              disabled={!processedManuscript || releaseBuilding}
            >
              {releaseBuilding ? '출간 패키지 생성 중…' : '출간 패키지 ZIP'}
            </button>
          </div>

          {/종이책/.test(project.objective || '') && (
            <div className="print-preflight-card">
              <div className="print-preflight-head">
                <div>
                  <strong>종이책 인쇄 PDF 프리플라이트</strong>
                  <small>쪽수 · 짝수 제본 · 판면/도련 · 암호화 여부를 자동 검사합니다.</small>
                </div>
                <span className={`status-pill ${printPdfEvaluation.ready ? 'ready' : ''}`}>
                  {printPdfEvaluation.ready ? 'PRINT PASS' : '검사 필요'}
                </span>
              </div>

              <div className="print-spec-grid">
                <label>
                  <span>기준 쪽수</span>
                  <input
                    inputMode="numeric"
                    value={project.printSpec?.expectedPages ?? ''}
                    onChange={(e) => updatePrintSpec('expectedPages', e.target.value)}
                    placeholder="예: 168"
                  />
                </label>
                <label>
                  <span>재단 가로 mm</span>
                  <input
                    inputMode="decimal"
                    value={project.printSpec?.trimWidthMm ?? 140}
                    onChange={(e) => updatePrintSpec('trimWidthMm', e.target.value)}
                  />
                </label>
                <label>
                  <span>재단 세로 mm</span>
                  <input
                    inputMode="decimal"
                    value={project.printSpec?.trimHeightMm ?? 210}
                    onChange={(e) => updatePrintSpec('trimHeightMm', e.target.value)}
                  />
                </label>
                <label>
                  <span>도련 mm</span>
                  <input
                    inputMode="decimal"
                    value={project.printSpec?.bleedMm ?? 3}
                    onChange={(e) => updatePrintSpec('bleedMm', e.target.value)}
                  />
                </label>
              </div>

              <label className="print-pdf-input">
                <span>최종 인쇄용 PDF</span>
                <input
                  className="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => readPrintPdf(e.target.files?.[0])}
                />
              </label>

              {printPdfError && <div className="error-box">{printPdfError}</div>}

              {printPdfReport && (
                <>
                  <div className="engine-metrics">
                    <MiniMetric label="실제 PDF 쪽수" value={printPdfReport.pageCount ? `${printPdfReport.pageCount}쪽` : '확인 필요'} />
                    <MiniMetric
                      label="PDF 판면"
                      value={printPdfReport.mediaBox ? `${printPdfReport.mediaBox.widthMm}×${printPdfReport.mediaBox.heightMm}mm` : '확인 필요'}
                    />
                    <MiniMetric label="PDF 버전" value={printPdfReport.pdfVersion || '확인 필요'} />
                    <MiniMetric label="암호화" value={printPdfReport.encrypted ? '있음' : '없음'} />
                  </div>

                  <div className="preflight-grid print-check-grid">
                    {printPdfEvaluation.checks.map((check) => (
                      <div className={`preflight-check ${check.passed ? 'passed' : 'blocked'}`} key={check.key}>
                        <span className="preflight-icon">{check.passed ? '✓' : '!'}</span>
                        <span className="preflight-body">
                          <strong>{check.label}</strong>
                          <small>{check.detail}</small>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {engineAnalysis && (
            <>
              <div className="engine-metrics">
                <MiniMetric label="글자 수" value={engineAnalysis.charCount.toLocaleString()} />
                <MiniMetric label="문단" value={engineAnalysis.paragraphCount.toLocaleString()} />
                <MiniMetric label="감지 목차/장" value={engineAnalysis.headingCount.toLocaleString()} />
                <MiniMetric label="예상 내지 쪽수" value={`약 ${engineAnalysis.estimatedPrintPages}쪽`} />
              </div>

              <div className="issue-list">
                {engineAnalysis.issues.map((issue) => (
                  <div className="issue" key={issue.key}>
                    <span>{issue.label}</span>
                    <strong>{issue.count === 0 ? '통과' : `${issue.count}건`}</strong>
                  </div>
                ))}
              </div>

              <div className="human-boundary">
                <strong>사람 승인 유지:</strong>
                저자 의도 · 사실/인용 · 저작권 · 최종 편집디자인 · 최종 출간 승인
              </div>
            </>
          )}

          {epubError && <div className="error-box">{epubError}</div>}

          {epubResult && (
            <div className="epub-result">
              <div className="review-summary">
                <MiniMetric label="EPUB 기술검사" value={epubResult.checksPassed ? '6/6 통과' : '확인 필요'} />
                <MiniMetric label="식별자" value={epubResult.metadata?.isbn ? 'ISBN 적용' : 'UUID 생성'} />
                <MiniMetric label="언어" value={epubResult.metadata?.language || 'ko'} />
              </div>
              <div className="file-info">
                EPUB 3 패키지 생성 완료 · {epubResult.identifier}
              </div>
            </div>
          )}

          {releaseError && <div className="error-box">{releaseError}</div>}

          {releaseResult && (
            <div className="release-result">
              <div className="review-summary">
                <MiniMetric label="출간 묶음" value={`${releaseResult.files.length}개 파일`} />
                <MiniMetric label="EPUB 검사" value={releaseResult.checksPassed ? '통과' : '확인 필요'} />
                <MiniMetric label="상태" value="QA 대기" />
              </div>
              <div className="file-info">
                출간 패키지 ZIP 생성 완료 · 원고 + EPUB + 140×210 프루프 + 제작리포트 + 메타데이터
              </div>
            </div>
          )}
        </section>

        <section className="panel ai-panel">
          <div className="section-head">
            <div>
              <div className="kicker">03 · AI EDITORIAL</div>
              <h2>AI 교정은 초안을 만들고 사람이 승인</h2>
            </div>
            <span className={`status-pill ${aiStatus === 'review' || aiStatus === 'applied' ? 'ready' : ''}`}>
              {aiStatus === 'running'
                ? `${aiProgress.current}/${aiProgress.total}`
                : aiStatus === 'review'
                  ? '검토 대기'
                  : aiStatus === 'applied'
                    ? '반영 완료'
                    : '대기'}
            </span>
          </div>

          <p className="muted">
            AI는 맞춤법·띄어쓰기·문법·문장부호 교정 초안만 만듭니다.
            원문은 자동 덮어쓰기하지 않습니다. 실행 시 해당 원고 조각이 Vercel AI Gateway를 통해 AI 모델로 전송됩니다.
          </p>

          <div className="ai-health">
            <span className={`health-dot ${aiHealth.gatewayAuthAvailable ? 'ready' : aiHealth.status === 'checking' ? 'checking' : 'blocked'}`} />
            <span>
              {aiHealth.status === 'checking'
                ? 'AI Gateway 연결 확인 중'
                : aiHealth.gatewayAuthAvailable
                  ? `AI Gateway 준비됨 · ${aiHealth.model || 'model ready'}`
                  : 'AI Gateway 인증 확인 필요'}
            </span>
          </div>

          <div className="ai-settings">
            <label>
              <span>OS 접근키</span>
              <input
                type="password"
                value={aiAccessKey}
                onChange={(e) => setAiAccessKey(e.target.value)}
                placeholder="이 브라우저 세션에만 저장"
                autoComplete="off"
              />
            </label>
            <label>
              <span>교정 수준</span>
              <select value={aiMode} onChange={(e) => setAiMode(e.target.value)}>
                <option value="proofread">보수적 교정</option>
                <option value="copyedit">문장 다듬기</option>
              </select>
            </label>
          </div>

          <div className="engine-actions">
            <button
              className="primary"
              onClick={runAiEditorial}
              disabled={!manuscript || aiStatus === 'running'}
            >
              {aiStatus === 'running' ? 'AI 교정 중…' : 'AI 교정 초안 만들기'}
            </button>
            <button
              className="secondary"
              onClick={applyAiDraft}
              disabled={!aiDraft || aiStatus === 'running'}
            >
              검토 후 작업본에 반영
            </button>
            <button
              className="secondary"
              onClick={discardAiDraft}
              disabled={!aiDraft && !aiError}
            >
              AI 초안 버리기
            </button>
          </div>

          {aiStatus === 'running' && (
            <div className="progress-track" aria-label="AI 교정 진행률">
              <span
                style={{
                  width: aiProgress.total
                    ? `${Math.round((aiProgress.current / aiProgress.total) * 100)}%`
                    : '0%'
                }}
              />
            </div>
          )}

          {aiError && <div className="error-box">{aiError}</div>}

          {aiDraft && (
            <div className="ai-review">
              <div className="review-summary">
                <MiniMetric label="제안 변경" value={aiChanges.length.toLocaleString()} />
                <MiniMetric label="사람 확인 경고" value={aiWarnings.length.toLocaleString()} />
                <MiniMetric label="AI 초안 글자 수" value={aiDraft.length.toLocaleString()} />
              </div>

              {aiChanges.length > 0 && (
                <div className="change-list">
                  {aiChanges.slice(0, 8).map((change, index) => (
                    <div className="change-card" key={`${index}-${change.before}`}>
                      <div><strong>전</strong> {change.before}</div>
                      <div><strong>후</strong> {change.after}</div>
                      <small>{change.reason}</small>
                    </div>
                  ))}
                  {aiChanges.length > 8 && (
                    <div className="more-note">외 {aiChanges.length - 8}건 · 제작 리포트 단계에서 전체 기록 가능</div>
                  )}
                </div>
              )}

              {aiWarnings.length > 0 && (
                <div className="warning-list">
                  {aiWarnings.slice(0, 8).map((warning, index) => (
                    <div key={`${index}-${warning}`}>확인 · {warning}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">04 · CONTROL PLANE</div>
              <h2>7단계 제작 흐름</h2>
            </div>
            <span className="status-pill">{STAGES[project.stageIndex].label}</span>
          </div>

          <div className="stage-list">
            {STAGES.map((stage, index) => {
              const done = index < project.stageIndex;
              const active = index === project.stageIndex;
              return (
                <button
                  key={stage.key}
                  className={`stage ${done ? 'done' : ''} ${active ? 'active' : ''}`}
                  onClick={() => moveStage(index)}
                >
                  <span className="stage-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="stage-body">
                    <strong>{stage.label}</strong>
                    <small>{stage.note}</small>
                  </span>
                  <span className="stage-state">{done ? '완료' : active ? '진행' : '대기'}</span>
                </button>
              );
            })}
          </div>

          <div className="stage-actions">
            <button
              className="secondary"
              disabled={!project.startedAt || project.stageIndex === 0}
              onClick={() => moveStage(project.stageIndex - 1)}
            >
              이전 단계
            </button>
            <button
              className="primary"
              disabled={!project.startedAt || project.stageIndex === STAGES.length - 1}
              onClick={() => moveStage(project.stageIndex + 1)}
            >
              다음 단계 완료
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">05 · HUMAN-IN-THE-LOOP</div>
              <h2>인간 개입을 숨기지 않고 측정</h2>
            </div>
          </div>
          <p className="muted">
            수정, 판단, 권리 확인, 예외처리처럼 사람이 실제로 개입한 시간만 누적합니다.
          </p>
          <div className="button-row">
            <button className="secondary" onClick={() => addHumanMinutes(1)}>+1분</button>
            <button className="secondary" onClick={() => addHumanMinutes(5)}>+5분</button>
            <button className="secondary" onClick={() => addHumanMinutes(15)}>+15분</button>
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <div className="kicker">06 · QUALITY GATES</div>
              <h2>출간 가능 판정</h2>
            </div>
            <span className={`status-pill ${publicationReady ? 'ready' : ''}`}>
              {publicationReady ? 'PUBLICATION-READY' : '검수 필요'}
            </span>
          </div>

          <div className="auto-preflight">
            <div className="preflight-head">
              <strong>자동 프리플라이트</strong>
              <span className={`status-pill ${releaseReadiness.ready ? 'ready' : ''}`}>
                {releaseReadiness.ready ? '자동검사 통과' : `${releaseReadiness.blockers.length}개 확인`}
              </span>
            </div>

            <div className="preflight-grid">
              {releaseReadiness.checks.map((check) => (
                <div className={`preflight-check ${check.passed ? 'passed' : 'blocked'}`} key={check.key}>
                  <span className="preflight-icon">{check.passed ? '✓' : '!'}</span>
                  <span className="preflight-body">
                    <strong>{check.label}</strong>
                    <small>{check.detail}</small>
                  </span>
                </div>
              ))}
            </div>

            {releaseReadiness.warnings.length > 0 && (
              <div className="warning-list">
                {releaseReadiness.warnings.map((warning, index) => (
                  <div key={`${index}-${warning}`}>참고 · {warning}</div>
                ))}
              </div>
            )}
          </div>

          <div className="manual-qa-label">사람 승인 게이트</div>

          <div className="qa-grid">
            {QA_GATES.map((gate) => (
              <button
                key={gate.key}
                className={`qa-card ${project.qa[gate.key] ? 'passed' : ''}`}
                onClick={() => toggleQa(gate.key)}
              >
                <span className="qa-check">{project.qa[gate.key] ? '✓' : '○'}</span>
                <span>
                  <strong>{gate.label}</strong>
                  <small>{gate.note}</small>
                </span>
              </button>
            ))}
          </div>

          <label className="notes">
            <span>오류·재작업·예외 메모</span>
            <textarea
              value={project.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="무엇이 멈췄고, 왜 사람이 개입했는지 기록"
              rows={4}
            />
          </label>
        </section>

        <section className="panel version-panel">
          <div className="section-head">
            <div>
              <div className="kicker">07 · VERSION HISTORY</div>
              <h2>원고와 작업본을 버전으로 보존</h2>
            </div>
            <span className="status-pill">{snapshots.length} versions</span>
          </div>

          <p className="muted">
            원고 접수와 AI 교정 적용 시 브라우저의 IndexedDB에 자동 저장합니다.
            서버 업로드 없이 이 기기에서 이전 작업본을 복구할 수 있습니다.
          </p>

          <div className="engine-actions">
            <button
              className="primary"
              onClick={() => persistVersion('수동 저장')}
              disabled={!manuscript || snapshotSaving}
            >
              {snapshotSaving ? '버전 저장 중…' : '현재 버전 저장'}
            </button>
          </div>

          {snapshotError && <div className="error-box">{snapshotError}</div>}

          {snapshots.length > 0 && (
            <div className="version-list">
              {snapshots.slice(0, 8).map((snapshot) => (
                <div className="version-row" key={snapshot.id}>
                  <div className="version-main">
                    <strong>{snapshot.label || '버전'}</strong>
                    <small>
                      {fmtSnapshotTime(snapshot.createdAt)} · {(snapshot.processedManuscript || snapshot.manuscript || '').length.toLocaleString()}자
                    </small>
                  </div>
                  <div className="version-actions">
                    <button className="secondary compact" onClick={() => restoreVersion(snapshot)}>복구</button>
                    <button className="ghost compact" onClick={() => removeVersion(snapshot.id)}>삭제</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel result-panel">
          <div>
            <div className="kicker">08 · EVIDENCE</div>
            <h2>감이 아니라 실측값으로 남깁니다.</h2>
            <p className="muted">
              이 기록이 쌓이면 ‘빠른 출판 서비스’가 아니라
              반복 가능한 Publishing OS라는 것을 증명할 수 있습니다.
            </p>
          </div>
          <div className="result-actions">
            <button className="primary" onClick={exportJson}>측정 데이터 내보내기</button>
          </div>
        </section>

        <footer>
          <strong>OneDayBooks</strong>
          <span>Service → Control Plane → Publishing OS</span>
        </footer>
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #f5f1e8; color: #171714; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", "Segoe UI", sans-serif; }
        button, input, select, textarea { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>

      <style jsx>{`
        .os-shell {
          width: min(100% - 28px, 980px);
          margin: 0 auto;
          padding: 28px 0 72px;
        }
        .hero {
          padding: 34px 4px 28px;
          border-bottom: 1px solid #cfc7b8;
        }
        .eyebrow, .kicker {
          font-size: 12px;
          letter-spacing: .12em;
          font-weight: 800;
          text-transform: uppercase;
          color: #7a321f;
        }
        h1 {
          margin: 14px 0 16px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 1.06;
          letter-spacing: -.045em;
          font-weight: 700;
        }
        .hero-copy {
          max-width: 760px;
          margin: 0;
          font-size: clamp(17px, 2.3vw, 22px);
          line-height: 1.62;
        }
        .scope-note {
          margin-top: 20px;
          display: inline-block;
          border: 1px solid #b9ae9d;
          background: rgba(255,255,255,.36);
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin: 20px 0;
        }
        .panel {
          background: rgba(255,255,255,.55);
          border: 1px solid #d2c9ba;
          border-radius: 18px;
          padding: 22px;
          margin: 14px 0;
          box-shadow: 0 8px 30px rgba(55,40,22,.04);
        }
        .section-head {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        h2 {
          margin: 5px 0 0;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -.035em;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        label span {
          display: block;
          margin-bottom: 7px;
          font-size: 13px;
          font-weight: 800;
        }
        input, select, textarea {
          width: 100%;
          border: 1px solid #bdb4a5;
          border-radius: 11px;
          background: #fffdf7;
          padding: 12px 13px;
          color: #171714;
          outline: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #7a321f;
          box-shadow: 0 0 0 3px rgba(122,50,31,.08);
        }
        .file { padding: 9px; }
        .file-info {
          margin: 12px 0 0;
          padding: 10px 12px;
          border-radius: 9px;
          background: #eee8dd;
          font-size: 13px;
        }
        .error-box {
          margin-top: 12px;
          padding: 11px 12px;
          border: 1px solid #bb7567;
          border-radius: 10px;
          background: #fff0eb;
          color: #762f24;
          font-size: 13px;
          line-height: 1.5;
        }
        .primary, .secondary, .ghost {
          min-height: 44px;
          border-radius: 10px;
          padding: 10px 15px;
          font-weight: 800;
          cursor: pointer;
        }
        .primary {
          margin-top: 16px;
          border: 1px solid #171714;
          background: #171714;
          color: #fffdf7;
        }
        .secondary {
          border: 1px solid #a99f90;
          background: transparent;
          color: #171714;
        }
        .ghost {
          min-height: auto;
          padding: 7px 9px;
          border: 0;
          background: transparent;
          text-decoration: underline;
        }
        button:disabled { opacity: .42; cursor: not-allowed; }
        .stage-list { display: grid; gap: 8px; }
        .stage {
          width: 100%;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr) auto;
          gap: 11px;
          align-items: center;
          text-align: left;
          border: 1px solid #d5ccbe;
          border-radius: 12px;
          padding: 12px;
          background: rgba(255,255,255,.35);
          color: inherit;
          cursor: pointer;
        }
        .stage.active { border-color: #7a321f; background: #fff8ed; }
        .stage.done { opacity: .72; }
        .stage-num { font: 700 13px/1 Georgia, serif; color: #7a321f; }
        .stage-body strong, .stage-body small { display: block; }
        .stage-body strong { font-size: 16px; }
        .stage-body small { margin-top: 3px; color: #6d675e; line-height: 1.4; }
        .stage-state { font-size: 12px; font-weight: 800; }
        .stage-actions, .button-row, .engine-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .stage-actions .primary, .engine-actions .primary { margin-top: 0; }
        .engine-actions { align-items: stretch; }
        .print-preflight-card {
          margin-top: 18px;
          padding: 15px;
          border: 1px solid #cfc5b6;
          border-radius: 13px;
          background: #fffaf2;
        }
        .print-preflight-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .print-preflight-head strong,
        .print-preflight-head small {
          display: block;
        }
        .print-preflight-head small {
          margin-top: 4px;
          color: #6d675e;
          font-size: 12px;
          line-height: 1.45;
        }
        .print-spec-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 14px;
        }
        .print-pdf-input {
          display: block;
          margin-top: 12px;
        }
        .print-check-grid {
          margin-top: 14px;
        }
        .engine-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          margin-top: 18px;
        }
        .issue-list {
          display: grid;
          gap: 7px;
          margin-top: 14px;
        }
        .issue {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #ddd4c7;
          padding: 9px 2px;
          font-size: 13px;
        }
        .human-boundary {
          margin-top: 15px;
          padding: 12px;
          border-left: 3px solid #7a321f;
          background: #f6eee5;
          font-size: 13px;
          line-height: 1.55;
        }
        .ai-health {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 12px;
          color: #6d675e;
        }
        .health-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #a99f90;
          flex: 0 0 auto;
        }
        .health-dot.ready { background: #4f7b56; }
        .health-dot.blocked { background: #a14d3f; }
        .health-dot.checking { background: #a87421; }
        .ai-settings {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(170px, .45fr);
          gap: 12px;
          margin-top: 16px;
        }
        .progress-track {
          height: 8px;
          overflow: hidden;
          margin-top: 14px;
          border-radius: 999px;
          background: #dfd6c8;
        }
        .progress-track span {
          display: block;
          height: 100%;
          background: #171714;
          transition: width .2s ease;
        }
        .ai-review, .epub-result, .release-result { margin-top: 18px; }
        .review-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }
        .change-list, .warning-list {
          display: grid;
          gap: 8px;
          margin-top: 14px;
        }
        .change-card {
          padding: 12px;
          border: 1px solid #d7cdbf;
          border-radius: 10px;
          background: #fffdf7;
          font-size: 13px;
          line-height: 1.55;
          overflow-wrap: anywhere;
        }
        .change-card strong {
          display: inline-block;
          min-width: 26px;
          color: #7a321f;
        }
        .change-card small {
          display: block;
          margin-top: 6px;
          color: #6d675e;
        }
        .warning-list > div {
          padding: 9px 11px;
          border-left: 3px solid #a87421;
          background: #fff7df;
          font-size: 13px;
          line-height: 1.5;
        }
        .more-note {
          color: #6d675e;
          font-size: 12px;
        }
        .version-list {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }
        .version-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid #ddd4c7;
        }
        .version-main {
          min-width: 0;
        }
        .version-main strong, .version-main small {
          display: block;
        }
        .version-main small {
          margin-top: 3px;
          color: #6d675e;
          font-size: 12px;
        }
        .version-actions {
          display: flex;
          gap: 7px;
          flex: 0 0 auto;
        }
        .compact {
          min-height: 36px;
          padding: 7px 10px;
          font-size: 12px;
        }
        .status-pill {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          border-radius: 999px;
          padding: 6px 10px;
          background: #e8dfd1;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .04em;
        }
        .status-pill.ready { background: #dce8d7; color: #244a2d; }
        .auto-preflight {
          margin-bottom: 20px;
          padding: 14px;
          border: 1px solid #d7cdbf;
          border-radius: 13px;
          background: #fffaf2;
        }
        .preflight-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .preflight-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .preflight-check {
          display: grid;
          grid-template-columns: 24px minmax(0, 1fr);
          gap: 8px;
          align-items: start;
          padding: 10px;
          border-radius: 9px;
          background: rgba(255,255,255,.65);
          border: 1px solid #ded5c8;
        }
        .preflight-check.passed {
          border-color: #a9c1a9;
          background: #f2f7ef;
        }
        .preflight-check.blocked {
          border-color: #d9a497;
          background: #fff3ef;
        }
        .preflight-icon {
          font-weight: 900;
          line-height: 1.25;
        }
        .preflight-body strong, .preflight-body small {
          display: block;
        }
        .preflight-body strong {
          font-size: 13px;
        }
        .preflight-body small {
          margin-top: 3px;
          color: #6d675e;
          font-size: 11px;
          line-height: 1.4;
        }
        .manual-qa-label {
          margin: 4px 0 10px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .06em;
          color: #7a321f;
        }
        .qa-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .qa-card {
          display: grid;
          grid-template-columns: 26px minmax(0, 1fr);
          gap: 9px;
          text-align: left;
          border: 1px solid #cfc5b6;
          border-radius: 12px;
          padding: 14px;
          background: #fffdf7;
          color: inherit;
          cursor: pointer;
        }
        .qa-card.passed { border-color: #63806a; background: #f0f5ed; }
        .qa-card strong, .qa-card small { display: block; }
        .qa-card small { margin-top: 4px; color: #6d675e; line-height: 1.45; }
        .qa-check { font-size: 18px; font-weight: 900; }
        .notes { display: block; margin-top: 16px; }
        .muted { margin: 0; color: #6d675e; line-height: 1.65; }
        .result-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 20px;
        }
        .result-actions .primary { white-space: nowrap; }
        footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 24px 4px 0;
          color: #6d675e;
          font-size: 12px;
        }
        @media (max-width: 720px) {
          .os-shell { width: min(100% - 22px, 980px); padding-top: 14px; }
          .hero { padding-top: 22px; }
          .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .form-grid, .qa-grid, .preflight-grid, .result-panel, .ai-settings { grid-template-columns: 1fr; }
          .print-spec-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .engine-metrics, .review-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .panel { padding: 17px; border-radius: 15px; }
          .section-head { align-items: flex-start; }
          .stage { grid-template-columns: 32px minmax(0, 1fr); }
          .stage-state { grid-column: 2; }
          .stage-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .stage-actions button, .button-row button, .engine-actions button { width: 100%; }
          .engine-actions { display: grid; grid-template-columns: 1fr 1fr; }
          .button-row { display: grid; grid-template-columns: repeat(3, 1fr); }
          .print-preflight-head { flex-direction: column; }
          .version-row { align-items: flex-start; }
          .version-actions { flex-direction: column; }
          footer { flex-direction: column; }
        }
      `}</style>
    </>
  );
}

function Metric({ label, value, emphasis }) {
  return (
    <div className={`metric ${emphasis ? 'emphasis' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <style jsx>{`
        .metric {
          min-width: 0;
          border: 1px solid #d2c9ba;
          background: rgba(255,255,255,.55);
          border-radius: 14px;
          padding: 14px;
        }
        .metric.emphasis { border-color: #63806a; background: #f0f5ed; }
        span {
          display: block;
          color: #6d675e;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.35;
        }
        strong {
          display: block;
          margin-top: 6px;
          font-size: clamp(20px, 3vw, 28px);
          letter-spacing: -.04em;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}


function MiniMetric({ label, value }) {
  return (
    <div className="mini-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <style jsx>{`
        .mini-metric {
          min-width: 0;
          border: 1px solid #d7cdbf;
          border-radius: 11px;
          padding: 11px;
          background: #fffdf7;
        }
        span {
          display: block;
          font-size: 11px;
          color: #6d675e;
          font-weight: 800;
        }
        strong {
          display: block;
          margin-top: 5px;
          font-size: 18px;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}
