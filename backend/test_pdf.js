const fs = require('fs');
const pdfService = require('./services/pdfService');

async function testPdf() {
  const mockData = {
    username: 'Test Student',
    roll_number: '20P31A1234',
    experiment_title: 'Zener Diode Characteristics',
    lab_category: 'Physics Lab',
    completed_at: new Date().toISOString(),
    aim: 'To study the V-I characteristics of a Zener diode.',
    procedure: '1. Connect circuit\n2. Turn on power\n3. Record readings',
    notes: 'Everything worked as expected.',
    observation_data: {
      forward: [
        { supplyV: 0.1, vz: 0.1, i: 0.001 },
        { supplyV: 0.5, vz: 0.5, i: 0.010 },
        { supplyV: 1.0, vz: 0.7, i: 5.000 }
      ],
      reverse: [
        { supplyV: 2.0, vz: -2.0, i: -0.001 },
        { supplyV: 5.0, vz: -5.0, i: -0.010 },
        { supplyV: 6.0, vz: -5.1, i: -2.000 }
      ]
    }
  };

  try {
    const pdfBuffer = await pdfService.generateLabRecord(mockData);
    fs.writeFileSync('test_record.pdf', pdfBuffer);
    console.log('PDF generated successfully as test_record.pdf');
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
}

testPdf();
