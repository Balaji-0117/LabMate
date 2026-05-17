const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, '../../frontend/html');

// Create admin_login.html
let loginHtml = fs.readFileSync(path.join(htmlDir, 'login.html'), 'utf8');
let adminLoginHtml = loginHtml
  .replace('<title>Login — LabMate</title>', '<title>Admin Login — LabMate</title>')
  .replace('Welcome Back', 'Admin Login')
  .replace('<p class="login-subtitle">Enter your email to securely log into your account.</p>', '<p class="login-subtitle">Admin portal access.</p>')
  .replace('<a href="signup.html" class="login-link">Sign up here</a>', '<a href="admin_signup.html" class="login-link">Sign up here</a>')
  .replace('<script src="../js/login.js"></script>', `
<script>
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const res = await fetch(\`\${API_BASE}/api/admin/login\`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'admin');
      window.location.href = 'admin_portal.html';
    } else {
      alert(data.error);
    }
  });
</script>
`);
fs.writeFileSync(path.join(htmlDir, 'admin_login.html'), adminLoginHtml);

// Create faculty_login.html
let facultyLoginHtml = loginHtml
  .replace('<title>Login — LabMate</title>', '<title>Faculty Login — LabMate</title>')
  .replace('Welcome Back', 'Faculty Login')
  .replace('<p class="login-subtitle">Enter your email to securely log into your account.</p>', '<p class="login-subtitle">Faculty portal access.</p>')
  .replace('<a href="signup.html" class="login-link">Sign up here</a>', '<a href="faculty_signup.html" class="login-link">Sign up here</a>')
  .replace('<script src="../js/login.js"></script>', `
<script>
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const res = await fetch(\`\${API_BASE}/api/faculty/login\`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'faculty');
      window.location.href = 'faculty_portal.html';
    } else {
      alert(data.error);
    }
  });
</script>
`);
fs.writeFileSync(path.join(htmlDir, 'faculty_login.html'), facultyLoginHtml);

// Create admin_signup.html
let signupHtml = fs.readFileSync(path.join(htmlDir, 'signup.html'), 'utf8');
const extraFields = `
<div class="form-group" style="margin-bottom:15px;">
  <label for="username-input" class="form-label">Username</label>
  <input type="text" id="username-input" class="form-input" placeholder="Your Name" required />
</div>
<div class="form-group" style="margin-bottom:15px;">
  <label for="email-input" class="form-label">Institution Email Address</label>
  <input type="email" id="email-input" class="form-input" placeholder="you@institution.edu" required />
</div>
<div class="form-group" style="margin-bottom:15px;">
  <label for="password-input" class="form-label">Password</label>
  <input type="password" id="password-input" class="form-input" placeholder="Password" required />
</div>
`;

let adminSignupHtml = signupHtml
  .replace('<title>Sign Up — LabMate</title>', '<title>Admin Sign Up — LabMate</title>')
  .replace('Create Account', 'Admin Registration')
  .replace(/<div class="form-group" id="email-group">[\s\S]*?<\/div>/, extraFields)
  .replace('<a href="login.html" class="login-link">Login here</a>', '<a href="admin_login.html" class="login-link">Login here</a>')
  .replace('<button type="submit" class="cta-btn cta-primary login-btn" id="submit-btn"', '<button type="submit" class="cta-btn cta-primary login-btn" id="submit-btn"')
  .replace('Verify Email Address', 'Register Admin')
  .replace('<script src="../js/signup.js"></script>', `
<script>
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const res = await fetch(\`\${API_BASE}/api/admin/signup\`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Admin created!'); window.location.href = 'admin_login.html';
    } else alert(data.error);
  });
</script>
`);
fs.writeFileSync(path.join(htmlDir, 'admin_signup.html'), adminSignupHtml);

// Create faculty_signup.html
let facultySignupHtml = signupHtml
  .replace('<title>Sign Up — LabMate</title>', '<title>Faculty Sign Up — LabMate</title>')
  .replace('Create Account', 'Faculty Registration')
  .replace(/<div class="form-group" id="email-group">[\s\S]*?<\/div>/, extraFields)
  .replace('<a href="login.html" class="login-link">Login here</a>', '<a href="faculty_login.html" class="login-link">Login here</a>')
  .replace('Verify Email Address', 'Register Faculty')
  .replace('<script src="../js/signup.js"></script>', `
<script>
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username-input').value;
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    
    const res = await fetch(\`\${API_BASE}/api/faculty/signup\`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Faculty created!'); window.location.href = 'faculty_login.html';
    } else alert(data.error);
  });
</script>
`);
fs.writeFileSync(path.join(htmlDir, 'faculty_signup.html'), facultySignupHtml);

// Create portals
let portalHtml = fs.readFileSync(path.join(htmlDir, 'portal.html'), 'utf8');

let facultyPortalHtml = portalHtml
  .replace('<title>Student Portal — LabMate</title>', '<title>Faculty Portal — LabMate</title>')
  .replace('Student Portal', 'Faculty Portal')
  .replace('<script src="../js/portal.js"></script>', '<script src="../js/faculty_portal.js"></script>');

fs.writeFileSync(path.join(htmlDir, 'faculty_portal.html'), facultyPortalHtml);

let adminPortalHtml = portalHtml
  .replace('<title>Student Portal — LabMate</title>', '<title>Admin Portal — LabMate</title>')
  .replace('Student Portal', 'Admin Portal')
  .replace('<script src="../js/portal.js"></script>', '<script src="../js/admin_portal.js"></script>');

fs.writeFileSync(path.join(htmlDir, 'admin_portal.html'), adminPortalHtml);

console.log('Frontend Auth & Portal pages generated.');
