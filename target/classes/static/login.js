let captchaValue = "";

function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    captchaValue = "";
    for (let i = 0; i < 6; i++) {
        captchaValue += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("captchaText").innerText = captchaValue;
}

window.onload = function() {
    generateCaptcha();
    
    // Check if user is already logged in
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
        if (userRole === 'USER') {
            window.location.href = 'user-dashboard.html';
        } else if (userRole === 'WORKER') {
            window.location.href = 'worker-dashboard.html';
        }
    }

    document.getElementById('loginForm').addEventListener('submit', loginUser);
};

function loginUser(event) {
    event.preventDefault();
    
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const captchaInput = document.getElementById("captchaInput").value;
    const messageDiv = document.getElementById("message");

    // Reset message
    messageDiv.innerHTML = '';
    messageDiv.className = 'message';

    // Validation
    if (!role || !email || !password || !captchaInput) {
        showMessage("All fields are required", "error");
        return;
    }

    if (captchaInput !== captchaValue) {
        showMessage("Invalid CAPTCHA", "error");
        generateCaptcha();
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.auth-btn');
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;

    console.log("Sending login data:", { email, password, role });

    fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ 
            email: email,
            password: password,
            role: role
        })
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Response data:", data);
        if (data.status === "SUCCESS") {
            showMessage("Login successful! Redirecting...", "success");
            
            // Store user info in localStorage
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', data.role);
            
            // Redirect based on role
            setTimeout(() => {
                if (data.role === "USER") {
                    window.location.href = "user-dashboard.html";
                } else {
                    window.location.href = "worker-dashboard.html";
                }
            }, 1500);
        } else {
            showMessage(data.message || "Login failed", "error");
            generateCaptcha();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage("Server error. Please try again. Error: " + error.message, "error");
    })
    .finally(() => {
        submitBtn.textContent = 'Sign In';
        submitBtn.disabled = false;
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = text;
    messageDiv.className = `message ${type}`;
}