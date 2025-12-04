/**
 * PDF Export Generator
 * Generate PDF reports for programs
 * Uses dynamic import to reduce initial bundle size
 */

// Type for program data in PDF export
interface ProgramPDFData {
  name: string;
  network: {
    name: string;
  };
  commissionRate: number | null;
  commissionType: string | null;
}

// Dynamic import for jsPDF to reduce bundle size
async function loadJsPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

export async function generateProgramPDF(programs: ProgramPDFData[]) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Affiliate Programs Report', 20, 20);

  doc.setFontSize(12);
  let y = 40;

  programs.forEach((program, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${index + 1}. ${program.name}`, 20, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`Network: ${program.network.name}`, 25, y);
    y += 5;
    doc.text(`Commission: ${program.commissionRate}% ${program.commissionType}`, 25, y);
    y += 10;
    doc.setFontSize(12);
  });

  return doc;
}

export async function downloadProgramsPDF(programs: ProgramPDFData[], filename = 'programs.pdf') {
  const doc = await generateProgramPDF(programs);
  doc.save(filename);
}
