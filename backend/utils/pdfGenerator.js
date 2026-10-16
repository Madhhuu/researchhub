import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapePdf(str) {
  return String(str || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\\()]/g, '\\$&')
    .slice(0, 95);
}

function wrapText(text, maxChars = 75) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function generateResearchPaperPdf(pub) {
  const titleLines = wrapText(pub.title || 'Research Paper', 60).slice(0, 3);
  const abstractLines = wrapText(pub.abstract || 'No abstract text provided for this publication.', 70).slice(0, 10);
  const citationLines = wrapText(
    `${pub.facultyName} (${pub.year}). "${pub.title}". ${pub.journalOrConference || 'Repository'}. ${pub.doi ? `doi:${pub.doi}` : ''}`,
    70
  ).slice(0, 3);

  let stream = 'BT\n';

  // Header Banner
  stream += '/F1 14 Tf\n50 740 Td\n(RESEARCHHUB INSTITUTIONAL REPOSITORY) Tj\n';
  stream += '/F1 9 Tf\n0 -14 Td\n(OFFICIAL FACULTY RESEARCH MANUSCRIPT - AUTHORIZED REPOSITORY COPY) Tj\n';
  stream += '0 -15 Td\n(---------------------------------------------------------------------------------------------------------) Tj\n';

  // Title
  stream += '0 -25 Td\n/F1 15 Tf\n';
  titleLines.forEach((tl, i) => {
    if (i > 0) stream += '0 -18 Td\n';
    stream += `(${escapePdf(tl)}) Tj\n`;
  });

  // Metadata
  stream += '0 -26 Td\n/F1 10 Tf\n';
  stream += `(Author: ${escapePdf(pub.facultyName)}    |    Department: ${escapePdf(pub.department)}    |    Year: ${pub.year}) Tj\n`;
  stream += '0 -16 Td\n';
  stream += `(Venue: ${escapePdf(pub.journalOrConference || 'Peer Reviewed Publication')}    |    Format: ${escapePdf(pub.type)}) Tj\n`;
  if (pub.doi) {
    stream += '0 -16 Td\n';
    stream += `(Digital Object Identifier: https://doi.org/${escapePdf(pub.doi)}) Tj\n`;
  }

  // Abstract Section
  stream += '0 -30 Td\n/F1 11 Tf\n(ABSTRACT) Tj\n';
  stream += '0 -15 Td\n/F1 9 Tf\n';
  abstractLines.forEach((al) => {
    stream += `(${escapePdf(al)}) Tj\n0 -13 Td\n`;
  });

  // Citation Section
  stream += '0 -15 Td\n/F1 10 Tf\n(RECOMMENDED CITATION) Tj\n';
  stream += '0 -14 Td\n/F1 8 Tf\n';
  citationLines.forEach((cl) => {
    stream += `(${escapePdf(cl)}) Tj\n0 -11 Td\n`;
  });

  // Authorization Footer Stamp
  stream += '0 -25 Td\n/F1 9 Tf\n';
  stream += '(---------------------------------------------------------------------------------------------------------) Tj\n';
  stream += '0 -14 Td\n/F1 9 Tf\n';
  stream += `(ACCESS STATUS: APPROVED BY CORRESPONDING FACULTY: ${escapePdf(pub.facultyName)}) Tj\n`;
  stream += '0 -13 Td\n';
  stream += `(Generated on: ${new Date().toISOString().split('T')[0]}  |  Verified under ResearchHub Protocol v2.4) Tj\n`;

  stream += 'ET\n';

  const streamLength = Buffer.byteLength(stream, 'latin1');

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000310 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${450 + streamLength}
%%EOF`;

  return Buffer.from(pdf, 'latin1');
}

export function ensureUploadsExist(publications) {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  for (const pub of publications) {
    const filename = pub.fileUrl || `${pub.id}.pdf`;
    const fullPath = path.join(uploadsDir, filename);

    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size < 100) {
      const pdfBuffer = generateResearchPaperPdf(pub);
      fs.writeFileSync(fullPath, pdfBuffer);
      console.log(`Generated PDF for publication ${pub.id} -> ${filename}`);
    }
  }
}
