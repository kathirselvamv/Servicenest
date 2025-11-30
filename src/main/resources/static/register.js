document.getElementById('registerForm').addEventListener('submit', registerUser);

function registerUser(event) {
    event.preventDefault();
    
    const role = document.getElementById("regRole").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageDiv = document.getElementById("regMessage");

    // Reset message
    messageDiv.innerHTML = '';
    messageDiv.className = 'message';

    // Validation
    if (!role || !email || !password || !confirmPassword) {
        showMessage("All fields are required", "error");
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error");
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.auth-btn');
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    console.log("Sending registration data:", { email, password, role });

    fetch("http://localhost:8081/api/register", {
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
            showMessage("Registration successful! Redirecting to login...", "success");
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            showMessage(data.message || "Registration failed", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage("Server error. Please try again. Error: " + error.message, "error");
    })
    .finally(() => {
        submitBtn.textContent = 'Create Account';
        submitBtn.disabled = false;
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById("regMessage");
    messageDiv.innerHTML = text;
    messageDiv.className = `message ${type}`;
}