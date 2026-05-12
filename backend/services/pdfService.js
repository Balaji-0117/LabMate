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
    
    // Observation Table
    if (recordData.observation_data) {
      try {
        const obsData = typeof recordData.observation_data === 'string' ? JSON.parse(recordData.observation_data) : recordData.observation_data;
        
        doc.fontSize(14).text('OBSERVATION TABLE', { underline: true });
        doc.moveDown();
        
        const drawTable = (title, data) => {
          if (!data || data.length === 0) return;
          doc.fontSize(12).text(title, { underline: true });
          doc.moveDown(0.5);
          
          const keys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'time');
          const columnWidth = 400 / keys.length;
          
          let y = doc.y;
          // Draw header
          doc.font('Helvetica-Bold');
          keys.forEach((key, i) => {
            doc.text(key.toUpperCase(), 50 + (i * columnWidth), y, { width: columnWidth, align: 'left' });
          });
          doc.moveDown(0.5);
          doc.font('Helvetica');
          
          // Draw rows
          data.forEach(row => {
            y = doc.y;
            keys.forEach((key, i) => {
              doc.text(String(row[key]), 50 + (i * columnWidth), y, { width: columnWidth, align: 'left' });
            });
            doc.moveDown(0.2);
          });
          doc.moveDown();
        };

        if (obsData.forward && obsData.forward.length > 0) {
          drawTable('Forward Bias Readings', obsData.forward);
        }
        if (obsData.reverse && obsData.reverse.length > 0) {
          drawTable('Reverse Bias Readings', obsData.reverse);
        }

      } catch (e) {
        console.error('Error rendering observation table:', e);
        doc.fontSize(11).text('Error rendering observation data.');
      }
      doc.moveDown();
    }

    doc.fontSize(14).text('RESULT', { underline: true });
    doc.fontSize(11).text(recordData.notes || 'Experiment completed successfully.');
    doc.end();
  });
};
