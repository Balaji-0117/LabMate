document.addEventListener('DOMContentLoaded', () => {

    async function loginUser() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            // STORE JWT TOKEN
            localStorage.setItem("token", data.token);

            // REDIRECT TO DASHBOARD
            window.location.href =
                "../html/portal.html";

        } else {

            alert(data.error);
        }

    } catch (err) {

        console.error(err);

        alert("Login failed");
    }
}

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');
    const emailGroup = document.getElementById('email-group');
    const submitBtn = document.getElementById('submit-btn');
    const successState = document.getElementById('success-state');

    // Theme Switcher Logic
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }    
    }

    if(toggleSwitch) {
        toggleSwitch.addEventListener('change', switchTheme, false);
    }

    // Toggle Password Visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            if (type === 'text') {
                togglePassword.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            } else {
                togglePassword.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        });
    }

    // Basic email validation regex
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim();
            const passValue = passwordInput.value;

            if (!isValidEmail(emailValue)) {
                emailGroup.classList.add('error');
                return;
            }

            if (!passValue) {
                return; // Browser validation prevents this
            }

            emailGroup.classList.remove('error');
            
            submitBtn.innerHTML = 'Logging in...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                const res = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: emailValue,
                        password: passValue
                    }),
                });

                const data = await res.json();

                if (res.ok) {

                    // ✅ Store JWT token
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    // ✅ SAME SUCCESS UI (no change)
                    loginForm.classList.add('hidden');
                    
                    const loginTitle = document.querySelector('.login-title');
                    if (loginTitle) loginTitle.classList.add('hidden');
                    
                    const loginSubtitle = document.querySelector('.login-subtitle');
                    if (loginSubtitle) loginSubtitle.classList.add('hidden');
                    
                    const loginFooter = document.querySelector('.login-footer');
                    if (loginFooter) loginFooter.classList.add('hidden');

                    successState.classList.remove('hidden');

                    // ✅ Redirect to portal (IMPORTANT CHANGE)
                    setTimeout(() => {
                        window.location.href = '../html/portal.html';
                    }, 1500);

                } else {
                    // ❌ Show backend error
                    alert(data.error || "Login failed ❌");

                    submitBtn.innerHTML = 'Login';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }

            } catch (err) {
                console.error(err);
                alert("Server error ❌");

                submitBtn.innerHTML = 'Login';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
            }
        });
    }

    if(emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailGroup.classList.contains('error')) {
                emailGroup.classList.remove('error');
            }
        });
    }
});
