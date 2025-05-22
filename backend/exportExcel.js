
const ExcelJS = require('exceljs');

/**
 * Создание Excel-файла на основе двумерного массива и заголовка
 */
async function exportToExcel(title, headers, rows, res) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);

  sheet.addRow(headers).font = { bold: true };
  rows.forEach(r => sheet.addRow(r));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=' + title + '.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

module.exports = exportToExcel;
