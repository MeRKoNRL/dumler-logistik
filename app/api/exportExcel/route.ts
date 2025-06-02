import ExcelJS from 'exceljs';

export async function POST(request: Request) {
  try {
    const { title, headers, rows } = await request.json();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(title || 'Sheet');

    sheet.addRow(headers).font = { bold: true };
    rows.forEach(r => sheet.addRow(r));

    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${title || 'report'}.xlsx`
      }
    });
  } catch (err) {
    return Response.json({ error: err.toString() }, { status: 500 });
  }
}
