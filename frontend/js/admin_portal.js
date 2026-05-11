const API_BASE = window.__ENV__?.API_BASE || "http://localhost:5000";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "admin_login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
      throw new Error("Failed to load dashboard");
    }
    const data = await res.json();
    
    // Replace body with a simple dashboard
    document.body.innerHTML = `
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto; font-family: 'Outfit', sans-serif;">
        <h1 style="color: #4f46e5; margin-bottom: 2rem;">Admin Dashboard</h1>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3>Total Students</h3>
            <p style="font-size: 2rem; font-weight: bold; color: #4f46e5;">${data.totalStudents}</p>
          </div>
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3>Total Faculty</h3>
            <p style="font-size: 2rem; font-weight: bold; color: #4f46e5;">${data.totalFaculty}</p>
          </div>
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3>Total Experiments</h3>
            <p style="font-size: 2rem; font-weight: bold; color: #4f46e5;">${data.totalExperiments}</p>
          </div>
          <div style="background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3>Total Completions</h3>
            <p style="font-size: 2rem; font-weight: bold; color: #4f46e5;">${data.totalCompletions}</p>
          </div>
        </div>

        <button id="logoutBtn" style="background: #ef4444; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer;">
          Logout
        </button>
      </div>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "admin_login.html";
    });

  } catch (err) {
    console.error(err);
    alert("Error loading admin dashboard");
  }
});
