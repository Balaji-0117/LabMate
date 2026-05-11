const API_BASE = window.__ENV__?.API_BASE || "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  
  // If no token exists, send them back to the unified login page
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Get user details
  const username = localStorage.getItem("username") || "Admin";
  const email = localStorage.getItem("email") || "";

  // Update UI Elements
  const profNameEls = document.querySelectorAll(".prof-name");
  const welcomeNameEl = document.querySelector(".welcome-name");
  const dropdownHeaderName = document.querySelector(".dropdown-header strong");
  const textAvatars = document.querySelectorAll(".profile-avatar, .dh-avatar");
  const imgAvatar = document.querySelector(".welcome-avatar");

  // Apply names
  profNameEls.forEach(el => el.innerText = username);
  if (welcomeNameEl) welcomeNameEl.innerText = username;
  if (dropdownHeaderName) dropdownHeaderName.innerText = username;

  // Apply avatars
  const initials = username.substring(0, 2).toUpperCase();
  textAvatars.forEach(el => el.innerText = initials);
  if (imgAvatar) {
    imgAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0a8f7c&color=fff&size=80&bold=true`;
  }

  try {
    // Fetch data securely
    const res = await fetch(`${API_BASE}/api/faculty/students`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) {
      throw new Error("Failed to load dashboard data");
    }
    
    const students = await res.json();
    
    // Carefully update the stats in your beautiful UI without destroying it!
    const statStudents = document.getElementById("stat-students");
    if (statStudents) {
      statStudents.innerText = students.length;
    }

  } catch (err) {
    console.error("Dashboard warning:", err);
  }

  // Attach logout functionality to your custom dropdown logout buttons
  const logoutLinks = document.querySelectorAll(".logout-link");
  logoutLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "login.html";
    });
  });
});
