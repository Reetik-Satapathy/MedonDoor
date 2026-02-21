const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const errorDiv = document.getElementById("error");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/* ---------- LOGIN ---------- */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      errorDiv.textContent = "Please enter email and password.";
      errorDiv.classList.remove("hidden");
      return;
    }

    const btn = loginBtn;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.message || "Login failed";
        errorDiv.classList.remove("hidden");
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      btn.textContent = "Success! Redirecting...";
      
      setTimeout(() => {
        if (data.role === "user") {
          window.location.href = "book.html";
        } else {
          window.location.href = "provider-dashboard.html";
        }
      }, 500);

    } catch {
      errorDiv.textContent = "Server error. Please try again.";
      errorDiv.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

/* ---------- REGISTER ---------- */
if (registerForm) {
  const roleSelect = document.getElementById("role");
  const serviceType = document.getElementById("serviceType");

  // Initialize: hide serviceType by default and ensure it's not required
  serviceType.classList.add("hidden");
  serviceType.required = false;
  serviceType.value = "";

  roleSelect.addEventListener("change", () => {
    if (roleSelect.value === "provider") {
      // Show serviceType dropdown only when provider is selected
      serviceType.classList.remove("hidden");
      serviceType.required = true;
    } else {
      // Hide serviceType dropdown when user is selected or nothing is selected
      serviceType.classList.add("hidden");
      serviceType.required = false;
      serviceType.value = ""; // Clear the value when hidden
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      role: roleSelect.value
    };

    if (!payload.name || !payload.email || !payload.password || !payload.role) {
      errorDiv.textContent = "Please fill all required fields.";
      errorDiv.classList.remove("hidden");
      return;
    }

    if (payload.role === "provider") {
      payload.service_type = serviceType.value;
      if (!payload.service_type) {
        errorDiv.textContent = "Please select a service type.";
        errorDiv.classList.remove("hidden");
        return;
      }
    }

    const btn = registerBtn;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Creating account...';

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.message || "Registration failed";
        errorDiv.classList.remove("hidden");
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      btn.textContent = "Account created! Redirecting...";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

    } catch {
      errorDiv.textContent = "Server error. Please try again.";
      errorDiv.classList.remove("hidden");
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}
