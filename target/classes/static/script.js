function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (email === "" || password === "") {
        msg.innerHTML = "All fields required";
        return;
    }

	fetch("http://localhost:8081/api/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.text())
    .then(data => {
        if (data === "USER_NOT_FOUND") {
            msg.innerHTML = "User not registered";
        } 
        else if (data === "INVALID_PASSWORD") {
            msg.innerHTML = "Wrong password";
        } 
        else if (data.startsWith("LOGIN_SUCCESS")) {
            const role = data.split(":")[1];
            window.location.href = "dashboard.html?role=" + role;
        }
    })
    .catch(() => {
        msg.innerHTML = "Server error";
    });
}
