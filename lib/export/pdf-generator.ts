/**
 * PDF Export Generator
 * Generate PDF reports for programs
 */

import jsPDF from 'jspdf'

export function generateProgramPDF(programs: any[]) {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text('Affiliate Programs Report', 20, 20)

  doc.setFontSize(12)
  let y = 40

  programs.forEach((program, index) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }

    doc.text(`${index + 1}. ${program.name}`, 20, y)
    y += 7
    doc.setFontSize(10)
    doc.text(`Network: ${program.network.name}`, 25, y)
    y += 5
    doc.text(`Commission: ${program.commissionRate}% ${program.commissionType}`, 25, y)
    y += 10
    doc.setFontSize(12)
  })

  return doc
}

export function downloadProgramsPDF(programs: any[], filename = 'programs.pdf') {
  const doc = generateProgramPDF(programs)
  doc.save(filename)
}
