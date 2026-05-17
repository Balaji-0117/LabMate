const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '../../frontend/html');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

let expIdCounter = 1;

for (const file of files) {
  // Skip auth/portal/landing pages
  if (['login.html', 'signup.html', 'portal.html', 'create_password.html', 'labmate_landing.html', 'admin_login.html', 'admin_signup.html', 'admin_portal.html', 'faculty_login.html', 'faculty_signup.html', 'faculty_portal.html'].includes(file)) continue;

  const snippet = `
<div id="record-download-section" style="display:none; margin-top:2rem; text-align:center;">
  <button id="downloadRecordBtn" onclick="downloadLabRecord()" 
    style="background:#4f46e5;color:#fff;padding:12px 28px;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">
    ⬇ Download Lab Record (PDF)
  </button>
</div>

<script>
  const EXPERIMENT_ID = ${expIdCounter++};

  async function markComplete() {
    const token = localStorage.getItem('token');
    const res = await fetch(\`\${API_BASE}/api/student/experiments/\${EXPERIMENT_ID}/complete\`, {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    const data = await res.json();
    if (data.recordId) {
      document.getElementById('record-download-section').style.display = 'block';
      document.getElementById('downloadRecordBtn').dataset.recordId = data.recordId;
    }
  }

  async function downloadLabRecord() {
    const token = localStorage.getItem('token');
    const recordId = document.getElementById('downloadRecordBtn').dataset.recordId;
    const res = await fetch(\`\${API_BASE}/api/student/records/\${recordId}/pdf\`, {
      headers: { 'Authorization': \`Bearer \${token}\` }
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'LabRecord.pdf'; a.click();
  }
</script>
</body>`;

  let content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
  if (!content.includes('downloadLabRecord()')) {
    content = content.replace('</body>', snippet);
    fs.writeFileSync(path.join(htmlDir, file), content, 'utf8');
    console.log('Updated ' + file);
  }
}
console.log('All files updated.');
