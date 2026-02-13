const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const errorDiv = document.getElementById("error");

/* ---------- LOGIN ---------- */
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    errorDiv.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      errorDiv.textContent = "Please enter email and password.";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.message || "Login failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "user") {
        window.location.href = "book.html";
      } else {
        window.location.href = "provider-dashboard.html";
      }

    } catch {
      errorDiv.textContent = "Server error.";
    }
  });
}

/* ---------- REGISTER ---------- */
if (registerBtn) {
  const roleSelect = document.getElementById("role");
  const serviceType = document.getElementById("serviceType");

  roleSelect.addEventListener("change", () => {
    serviceType.classList.toggle("hidden", roleSelect.value !== "provider");
  });

  registerBtn.addEventListener("click", async () => {
    errorDiv.textContent = "";

    const payload = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      role: roleSelect.value
    };

    if (!payload.name || !payload.email || !payload.password || !payload.role) {
      errorDiv.textContent = "Fill all required fields.";
      return;
    }

    if (payload.role === "provider") {
      payload.service_type = serviceType.value;
      if (!payload.service_type) {
        errorDiv.textContent = "Select service type.";
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        errorDiv.textContent = data.message || "Registration failed";
        return;
      }

      window.location.href = "login.html";
    } catch {
      errorDiv.textContent = "Server error.";
    }
  });
}
