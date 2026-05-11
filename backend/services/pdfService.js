const PDFDocument = require('pdfkit');

exports.generateLabRecord = (recordData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('LabMate — Lab Record', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Student: ${recordData.username}`);
    doc.text(`Roll No: ${recordData.roll_number}`);
    doc.text(`Experiment: ${recordData.experiment_title}`);
    doc.text(`Lab: ${recordData.lab_category}`);
    doc.text(`Completed On: ${new Date(recordData.completed_at).toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(14).text('AIM', { underline: true });
    doc.fontSize(11).text(recordData.aim || 'N/A');
    doc.moveDown();
    doc.fontSize(14).text('PROCEDURE', { underline: true });
    doc.fontSize(11).text(recordData.procedure || 'N/A');
    doc.moveDown();
    doc.fontSize(14).text('RESULT', { underline: true });
    doc.fontSize(11).text(recordData.notes || 'Experiment completed successfully.');
    doc.end();
  });
};
