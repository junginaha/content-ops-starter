function findEndOfCentralDirectory(view) {
  const minOffset = Math.max(0, view.byteLength - 0xffff - 22);
  for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) return offset;
  }
  throw new Error('유효한 DOCX/ZIP 중앙 디렉터리를 찾지 못했습니다.');
}

function readCentralDirectory(buffer) {
  const view = new DataView(buffer);
  const eocd = findEndOfCentralDirectory(view);
  const totalEntries = view.getUint16(eocd + 10, true);
  const centralOffset = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder('utf-8');
  const entries = new Map();

  let offset = centralOffset;
  for (let index = 0; index < totalEntries; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) {
      throw new Error('DOCX 중앙 디렉터리가 손상되었습니다.');
    }

    const flags = view.getUint16(offset + 8, true);
    const compressionMethod = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const uncompressedSize = view.getUint32(offset + 24, true);
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    const fileNameBytes = new Uint8Array(buffer, offset + 46, fileNameLength);
    const fileName = decoder.decode(fileNameBytes);

    entries.set(fileName, {
      fileName,
      flags,
      compressionMethod,
      compressedSize,
      uncompressedSize,
      localHeaderOffset
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('이 브라우저는 DOCX 압축 해제를 지원하지 않습니다. 최신 Safari/Chrome에서 다시 시도해 주세요.');
  }

  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const response = new Response(stream);
  return new Uint8Array(await response.arrayBuffer());
}

async function readZipEntry(buffer, entry) {
  const view = new DataView(buffer);
  const offset = entry.localHeaderOffset;

  if (view.getUint32(offset, true) !== 0x04034b50) {
    throw new Error(`${entry.fileName}의 로컬 ZIP 헤더가 올바르지 않습니다.`);
  }

  if ((entry.flags & 0x1) !== 0) {
    throw new Error('암호화된 DOCX 파일은 지원하지 않습니다.');
  }

  const fileNameLength = view.getUint16(offset + 26, true);
  const extraLength = view.getUint16(offset + 28, true);
  const dataOffset = offset + 30 + fileNameLength + extraLength;
  const compressed = new Uint8Array(buffer, dataOffset, entry.compressedSize);

  if (entry.compressionMethod === 0) return new Uint8Array(compressed);
  if (entry.compressionMethod === 8) return inflateRaw(compressed);

  throw new Error(`지원하지 않는 DOCX 압축 방식입니다: ${entry.compressionMethod}`);
}

function nodesByLocalName(root, localName) {
  const matches = [];
  const all = root.getElementsByTagName('*');
  for (let i = 0; i < all.length; i += 1) {
    if (all[i].localName === localName) matches.push(all[i]);
  }
  return matches;
}

function getWordAttribute(node, localName) {
  if (!node || !node.attributes) return '';
  for (let i = 0; i < node.attributes.length; i += 1) {
    if (node.attributes[i].localName === localName) return node.attributes[i].value || '';
  }
  return '';
}

function paragraphStyle(paragraph) {
  const styles = nodesByLocalName(paragraph, 'pStyle');
  if (!styles.length) return '';
  return getWordAttribute(styles[0], 'val');
}

function paragraphText(paragraph) {
  let output = '';

  function walk(node) {
    if (node.nodeType === 3) {
      return;
    }

    if (node.nodeType === 1) {
      if (node.localName === 't') {
        output += node.textContent || '';
        return;
      }
      if (node.localName === 'tab') {
        output += '\t';
        return;
      }
      if (node.localName === 'br' || node.localName === 'cr') {
        output += '\n';
        return;
      }
    }

    if (!node.childNodes) return;
    for (let i = 0; i < node.childNodes.length; i += 1) {
      walk(node.childNodes[i]);
    }
  }

  walk(paragraph);
  return output.replace(/[ \t]+$/gm, '').trim();
}

function tableText(table) {
  const rows = [];
  const rowNodes = Array.from(table.children || []).filter((node) => node.localName === 'tr');

  rowNodes.forEach((row) => {
    const cells = Array.from(row.children || []).filter((node) => node.localName === 'tc');
    const values = cells.map((cell) => {
      const paragraphs = Array.from(cell.children || []).filter((node) => node.localName === 'p');
      return paragraphs.map(paragraphText).filter(Boolean).join(' / ');
    });
    if (values.some(Boolean)) rows.push(values.join('\t'));
  });

  return rows.join('\n');
}

function parseDocumentXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');

  if (nodesByLocalName(xml, 'parsererror').length) {
    throw new Error('DOCX document.xml을 해석하지 못했습니다.');
  }

  const bodies = nodesByLocalName(xml, 'body');
  if (!bodies.length) throw new Error('DOCX 본문을 찾지 못했습니다.');

  const body = bodies[0];
  const blocks = [];

  Array.from(body.children || []).forEach((node) => {
    if (node.localName === 'p') {
      const text = paragraphText(node);
      if (!text) return;
      const style = paragraphStyle(node);
      const isHeading = /heading|title|제목|머리말/i.test(style || '');
      blocks.push(isHeading ? `\n${text}\n` : text);
      return;
    }

    if (node.localName === 'tbl') {
      const text = tableText(node);
      if (text) blocks.push(`\n${text}\n`);
    }
  });

  return blocks
    .join('\n\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

function parseCoreProperties(xmlText) {
  if (!xmlText) return {};
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'application/xml');
  if (nodesByLocalName(xml, 'parsererror').length) return {};

  const firstText = (name) => {
    const nodes = nodesByLocalName(xml, name);
    return nodes.length ? (nodes[0].textContent || '').trim() : '';
  };

  return {
    title: firstText('title'),
    creator: firstText('creator'),
    subject: firstText('subject'),
    description: firstText('description')
  };
}

export async function extractDocx(file) {
  if (!file) throw new Error('DOCX 파일이 없습니다.');
  if (!/\.docx$/i.test(file.name || '')) throw new Error('DOCX 파일만 처리할 수 있습니다.');
  if (file.size > 25 * 1024 * 1024) throw new Error('현재 MVP에서는 25MB 이하 DOCX를 지원합니다.');

  const buffer = await file.arrayBuffer();
  const entries = readCentralDirectory(buffer);
  const documentEntry = entries.get('word/document.xml');

  if (!documentEntry) {
    throw new Error('DOCX 본문(word/document.xml)을 찾지 못했습니다.');
  }

  const documentBytes = await readZipEntry(buffer, documentEntry);
  const documentXml = new TextDecoder('utf-8').decode(documentBytes);
  const text = parseDocumentXml(documentXml);

  let metadata = {};
  const coreEntry = entries.get('docProps/core.xml');
  if (coreEntry) {
    try {
      const coreBytes = await readZipEntry(buffer, coreEntry);
      metadata = parseCoreProperties(new TextDecoder('utf-8').decode(coreBytes));
    } catch (_) {
      metadata = {};
    }
  }

  if (!text) throw new Error('DOCX에서 읽을 수 있는 텍스트를 찾지 못했습니다.');

  return {
    text,
    metadata,
    source: {
      type: 'docx',
      fileName: file.name,
      fileSize: file.size
    }
  };
}
