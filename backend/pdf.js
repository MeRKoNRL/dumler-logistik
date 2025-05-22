
// Генерация PDF из HTML строки
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const express = require('express');

module.exports = function generatePDF(data, res) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
  doc.pipe(res);

  doc.fontSize(16).text('Отчёт Dumler Logistik', { align: 'center' });
  doc.moveDown();

  data.forEach((entry, i) => {
    doc.fontSize(12).text(`${i + 1}. ${entry.join(' | ')}`);
  });

  doc.end();
};
