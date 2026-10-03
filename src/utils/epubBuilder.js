const encoder = new TextEncoder();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view, offset, value) {
  view.setUint16(offset, value & 0xffff, true);
}

function writeUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);
  return {
    time: (hours << 11) | (minutes << 5) | seconds,
    date: ((year - 1980) << 9) | (month << 5) | day
  };
}

function concatUint8(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

export function createStoredZip(files, mimeType = 'application/zip') {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  const stamp = dosDateTime();

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = file.data instanceof Uint8Array ? file.data : encoder.encode(String(file.data ?? ''));
    const checksum = crc32(dataBytes);
    const flags = 0x0800; // UTF-8 file names

    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    writeUint32(lv, 0, 0x04034b50);
    writeUint16(lv, 4, 20);
    writeUint16(lv, 6, flags);
    writeUint16(lv, 8, 0);
    writeUint16(lv, 10, stamp.time);
    writeUint16(lv, 12, stamp.date);
    writeUint32(lv, 14, checksum);
    writeUint32(lv, 18, dataBytes.length);
    writeUint32(lv, 22, dataBytes.length);
    writeUint16(lv, 26, nameBytes.length);
    writeUint16(lv, 28, 0);
    local.set(nameBytes, 30);

    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    writeUint32(cv, 0, 0x02014b50);
    writeUint16(cv, 4, 20);
    writeUint16(cv, 6, 20);
    writeUint16(cv, 8, flags);
    writeUint16(cv, 10, 0);
    writeUint16(cv, 12, stamp.time);
    writeUint16(cv, 14, stamp.date);
    writeUint32(cv, 16, checksum);
    writeUint32(cv, 20, dataBytes.length);
    writeUint32(cv, 24, dataBytes.length);
    writeUint16(cv, 28, nameBytes.length);
    writeUint16(cv, 30, 0);
    writeUint16(cv, 32, 0);
    writeUint16(cv, 34, 0);
    writeUint16(cv, 36, 0);
    writeUint32(cv, 38, 0);
    writeUint32(cv, 42, localOffset);
    central.set(nameBytes, 46);

    localParts.push(local, dataBytes);
    centralParts.push(central);
    localOffset += local.length + dataBytes.length;
  });

  const centralDirectory = concatUint8(centralParts);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  writeUint32(ev, 0, 0x06054b50);
  writeUint16(ev, 4, 0);
  writeUint16(ev, 6, 0);
  writeUint16(ev, 8, files.length);
  writeUint16(ev, 10, files.length);
  writeUint32(ev, 12, centralDirectory.length);
  writeUint32(ev, 16, localOffset);
  writeUint16(ev, 20, 0);

  return new Blob([...localParts, centralDirectory, eocd], { type: mimeType });
}

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isHeading(paragraph = '') {
  const value = paragraph.trim();
  return (
    value.length <= 60 &&
    /^(제\s*\d+\s*장|chapter\s+\d+|\d+[.)]\s*\S|프롤로그|에필로그|들어가며|나오며)/i.test(value)
  );
}

function manuscriptToXhtml(manuscript = '') {
  const blocks = String(manuscript)
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const text = escapeXml(block).replace(/\n/g, '<br />');
    return isHeading(block)
      ? `<h2>${text}</h2>`
      : `<p>${text}</p>`;
  }).join('\n');
}

function normalizeIsbn(value = '') {
  return String(value).replace(/[^0-9Xx]/g, '').toUpperCase();
}

function isoModified(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function buildEpub({
  title = '',
  author = '',
  manuscript = '',
  isbn = '',
  publisher = 'OneDayBooks'
} = {}) {
  const safeTitle = String(title || '').trim() || '제목 없음';
  const safeAuthor = String(author || '').trim() || '저자 미상';
  const normalizedIsbn = normalizeIsbn(isbn);
  const identifier = normalizedIsbn
    ? `urn:isbn:${normalizedIsbn}`
    : `urn:uuid:${crypto.randomUUID()}`;
  const modified = isoModified();
  const content = manuscriptToXhtml(manuscript);

  const mimetype = 'application/epub+zip';

  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="ko">
<head>
  <meta charset="utf-8"/>
  <title>목차</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>목차</h1>
    <ol>
      <li><a href="text.xhtml">${escapeXml(safeTitle)}</a></li>
    </ol>
  </nav>
</body>
</html>`;

  const textXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko">
<head>
  <meta charset="utf-8"/>
  <title>${escapeXml(safeTitle)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section class="title-page">
    <h1>${escapeXml(safeTitle)}</h1>
    <p class="author">${escapeXml(safeAuthor)}</p>
  </section>
  <main>
    ${content}
  </main>
</body>
</html>`;

  const styleCss = `
html { writing-mode: horizontal-tb; }
body {
  margin: 0 6%;
  font-family: serif;
  line-height: 1.8;
  word-break: keep-all;
}
.title-page {
  text-align: center;
  margin: 35% 0 40%;
  break-after: page;
}
.title-page h1 { font-size: 1.8em; line-height: 1.35; }
.title-page .author { margin-top: 2.4em; text-indent: 0; }
main p {
  margin: 0 0 1em;
  text-align: justify;
  text-indent: 1em;
}
h2 {
  margin: 2.5em 0 1.5em;
  font-size: 1.35em;
  line-height: 1.4;
  break-before: page;
}
`.trim();

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="ko">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${escapeXml(identifier)}</dc:identifier>
    <dc:title>${escapeXml(safeTitle)}</dc:title>
    <dc:creator>${escapeXml(safeAuthor)}</dc:creator>
    <dc:language>ko</dc:language>
    <dc:publisher>${escapeXml(publisher)}</dc:publisher>
    <meta property="dcterms:modified">${modified}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="text" href="text.xhtml" media-type="application/xhtml+xml"/>
    <item id="css" href="style.css" media-type="text/css"/>
  </manifest>
  <spine>
    <itemref idref="text"/>
  </spine>
</package>`;

  const files = [
    { name: 'mimetype', data: mimetype },
    { name: 'META-INF/container.xml', data: containerXml },
    { name: 'OEBPS/content.opf', data: opf },
    { name: 'OEBPS/nav.xhtml', data: navXhtml },
    { name: 'OEBPS/text.xhtml', data: textXhtml },
    { name: 'OEBPS/style.css', data: styleCss }
  ];

  return {
    blob: createStoredZip(files, 'application/epub+zip'),
    identifier,
    metadata: {
      title: safeTitle,
      author: safeAuthor,
      isbn: normalizedIsbn,
      publisher,
      language: 'ko',
      modified
    },
    technicalChecks: {
      mimetypeFirst: files[0].name === 'mimetype',
      mimetypeExact: files[0].data === 'application/epub+zip',
      containerPresent: files.some((file) => file.name === 'META-INF/container.xml'),
      packagePresent: files.some((file) => file.name === 'OEBPS/content.opf'),
      navPresent: files.some((file) => file.name === 'OEBPS/nav.xhtml'),
      contentPresent: files.some((file) => file.name === 'OEBPS/text.xhtml')
    }
  };
}
