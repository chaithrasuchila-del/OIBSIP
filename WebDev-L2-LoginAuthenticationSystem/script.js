// Show Registration Page
function showRegister() {
    document.getElementById("registerPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "none";
}

// Show Login Page
function showLogin() {
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("dashboardPage").style.display = "none";
}

// Display messages
function showMessage(id, text, type) {
    const message = document.getElementById(id);
    message.textContent = text;
    message.className = "message " + type;
}

// SHA-256 Password Hashing
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

// Get stored users safely
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch {
        return [];
    }
}

// Register User
async function registerUser() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password = document.getElementById("registerPassword").value;

    if (!username || !email || !password) {
        showMessage("registerMessage", "Please fill all fields.", "error");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage("registerMessage", "Enter a valid email address.", "error");
        return;
    }

    if (!/^(?=.*\d).{8,}$/.test(password)) {
        showMessage(
            "registerMessage",
            "Password must contain at least 8 characters and 1 number.",
            "error"
        );
        return;
    }

    const users = getUsers();

    const userExists = users.some(user =>
        user.username.toLowerCase() === username.toLowerCase() ||
        user.email === email
    );

    if (userExists) {
        showMessage(
            "registerMessage",
            "Username or email already exists.",
            "error"
        );
        return;
    }

    try {
        const hashedPassword = await hashPassword(password);

        const newUser = {
            username: username,
            email: email,
            password: hashedPassword
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        showMessage(
            "registerMessage",
            "Registration successful! Please login.",
            "success"
        );

        document.getElementById("registerUsername").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

        setTimeout(showLogin, 1500);
    } catch (error) {
        showMessage(
            "registerMessage",
            "Registration failed. Please try again.",
            "error"
        );
    }
}

// Login User
async function loginUser() {
    const loginName = document.getElementById("loginUser").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!loginName || !password) {
        showMessage("loginMessage", "Please fill all fields.", "error");
        return;
    }

    try {
        const users = getUsers();
        const hashedPassword = await hashPassword(password);

        const user = users.find(user =>
            (
                user.username.toLowerCase() === loginName.toLowerCase() ||
                user.email === loginName.toLowerCase()
            ) &&
            user.password === hashedPassword
        );

        if (!user) {
            showMessage(
                "loginMessage",
                "Invalid username/email or password.",
                "error"
            );
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify({
            username: user.username,
            email: user.email
        }));

        document.getElementById("loginPassword").value = "";
        showDashboard();
    } catch (error) {
        showMessage(
            "loginMessage",
            "Login failed. Please try again.",
            "error"
        );
    }
}

// Show Protected Dashboard
function showDashboard() {
    let user;

    try {
        user = JSON.parse(localStorage.getItem("loggedInUser"));
    } catch {
        user = null;
    }

    if (!user || !user.username) {
        localStorage.removeItem("loggedInUser");
        showLogin();
        return;
    }

    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "block";

    document.getElementById("welcomeMessage").textContent =
        "Hello, " + user.username + "!";
}

// Logout User
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    document.getElementById("loginUser").value = "";
    document.getElementById("loginPassword").value = "";
    showLogin();
}

// Check session when page loads
window.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("loggedInUser")) {
        showDashboard();
    } else {
        showLogin();
    }
});
