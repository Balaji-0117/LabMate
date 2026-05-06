document.addEventListener('DOMContentLoaded', () => {
    const createPasswordForm = document.getElementById('create-password-form');
    const passwordInput = document.getElementById('password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const passwordGroup = document.getElementById('password-group');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const submitBtn = document.getElementById('submit-btn');
    const successState = document.getElementById('success-state');

    // Requirements elements
    const reqLength = document.getElementById('req-length');
    const reqUpper = document.getElementById('req-upper');
    const reqLower = document.getElementById('req-lower');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

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

    // Toggle Password Visibility helper
    const setupToggle = (btn, input) => {
        if (btn && input) {
            btn.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                if (type === 'text') {
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-off-icon"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                } else {
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="eye-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                }
            });
        }
    };

    setupToggle(togglePassword, passwordInput);
    setupToggle(toggleConfirmPassword, confirmPasswordInput);

    // Password Validation
    const validatePassword = (pass) => {
        let valid = true;
        
        // At least 8 chars
        if (pass.length >= 8) { reqLength.textContent = '✓ At least 8 characters'; reqLength.style.color = 'var(--teal)'; }
        else { reqLength.textContent = '❌ At least 8 characters'; reqLength.style.color = 'var(--text-soft)'; valid = false; }
        
        // Uppercase
        if (/[A-Z]/.test(pass)) { reqUpper.textContent = '✓ One uppercase letter'; reqUpper.style.color = 'var(--teal)'; }
        else { reqUpper.textContent = '❌ One uppercase letter'; reqUpper.style.color = 'var(--text-soft)'; valid = false; }
        
        // Lowercase
        if (/[a-z]/.test(pass)) { reqLower.textContent = '✓ One lowercase letter'; reqLower.style.color = 'var(--teal)'; }
        else { reqLower.textContent = '❌ One lowercase letter'; reqLower.style.color = 'var(--text-soft)'; valid = false; }
        
        // Number
        if (/[0-9]/.test(pass)) { reqNumber.textContent = '✓ One number'; reqNumber.style.color = 'var(--teal)'; }
        else { reqNumber.textContent = '❌ One number'; reqNumber.style.color = 'var(--text-soft)'; valid = false; }
        
        // Special Char (!@#)
        if (/[!@#]/.test(pass)) { reqSpecial.textContent = '✓ One special character (!@#)'; reqSpecial.style.color = 'var(--teal)'; }
        else { reqSpecial.textContent = '❌ One special character (!@#)'; reqSpecial.style.color = 'var(--text-soft)'; valid = false; }
        
        return valid;
    };

    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            validatePassword(e.target.value);
            passwordGroup.classList.remove('error');
            
            if (confirmPasswordInput.value) {
                if (e.target.value === confirmPasswordInput.value) {
                    confirmPasswordGroup.classList.remove('error');
                } else {
                    confirmPasswordGroup.classList.add('error');
                }
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', (e) => {
            if (e.target.value === passwordInput.value) {
                confirmPasswordGroup.classList.remove('error');
            } else {
                confirmPasswordGroup.classList.add('error');
            }
        });
    }

    if(createPasswordForm) {
        createPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const passValue = passwordInput.value;
            const confirmPassValue = confirmPasswordInput.value;

            if (!validatePassword(passValue)) {
                passwordGroup.classList.add('error');
                return;
            } else {
                passwordGroup.classList.remove('error');
            }
            
            if (passValue !== confirmPassValue) {
                confirmPasswordGroup.classList.add('error');
                return;
            } else {
                confirmPasswordGroup.classList.remove('error');
            }
            
            submitBtn.innerHTML = 'Setting Password...';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            setTimeout(() => {
                createPasswordForm.classList.add('hidden');
                
                const loginTitle = document.querySelector('.login-title');
                if (loginTitle) loginTitle.classList.add('hidden');
                
                const loginSubtitle = document.querySelector('.login-subtitle');
                if (loginSubtitle) loginSubtitle.classList.add('hidden');

                successState.classList.remove('hidden');

                // Redirect to homepage after success
                setTimeout(() => {
                    window.location.href = 'labmate_landing.html';
                }, 1500);
            }, 1500); // 1.5 seconds artificial delay
        });
    }
});
