document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email-input');
    const emailGroup = document.getElementById('email-group');
    const submitBtn = document.getElementById('submit-btn');
    const successState = document.getElementById('success-state');
    const sentEmailDisplay = document.getElementById('sent-email-display');
    const redirectBtn = document.getElementById('redirect-btn');

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

    // Basic email validation regex
    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    if(signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailValue = emailInput.value.trim();

            if (!isValidEmail(emailValue)) {
                emailGroup.classList.add('error');
                return;
            }

            emailGroup.classList.remove('error');

            // UI loading state
            submitBtn.innerHTML = 'Sending Link...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            try {
                const res = await fetch(`${API_BASE}/api/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: emailValue }),
                });

                const data = await res.json();

                if (res.ok) {
                    // ✅ SUCCESS UI (same as your existing code)
                    signupForm.classList.add('hidden');

                    const loginTitle = document.querySelector('.login-title');
                    if (loginTitle) loginTitle.classList.add('hidden');

                    const loginSubtitle = document.querySelector('.login-subtitle');
                    if (loginSubtitle) loginSubtitle.classList.add('hidden');

                    const loginFooter = document.querySelector('.login-footer');
                    if (loginFooter) loginFooter.classList.add('hidden');

                    if (sentEmailDisplay) sentEmailDisplay.textContent = emailValue;
                    successState.classList.remove('hidden');

                } else {
                    // ❌ backend error
                    alert(data.error || "Failed to send email");
                    submitBtn.innerHTML = 'Verify Email';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }

            } catch (err) {
                console.error(err);
                alert("Server error");
                submitBtn.innerHTML = 'Verify Email';
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

    if(redirectBtn) {
        redirectBtn.addEventListener('click', () => {
            // Redirect back to homepage
            window.location.href = 'labmate_landing.html';
        });
    }
});
