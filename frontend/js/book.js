const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "user") {
  window.location.href = "login.html";
}

const bookBtn = document.getElementById("bookBtn");
const historyBtn = document.getElementById("historyBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");

bookBtn.addEventListener("click", bookService);
historyBtn.addEventListener("click", () => {
  window.location.href = "history.html";
});
logoutBtn.addEventListener("click", logout);

async function bookService() {
  message.textContent = "";
  message.classList.add("hidden");
  const serviceId = document.getElementById("service").value;

  if (!serviceId) {
    message.textContent = "Please select a service.";
    message.classList.add("error");
    message.classList.remove("hidden", "success");
    return;
  }

  const originalText = bookBtn.textContent;
  bookBtn.disabled = true;
  bookBtn.innerHTML = '<span class="spinner"></span> Booking...';

  try {
    const res = await fetch("http://localhost:5000/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ service_id: serviceId })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.message || "Booking failed.";
      message.classList.add("error");
      message.classList.remove("hidden", "success");
      bookBtn.disabled = false;
      bookBtn.textContent = originalText;
      return;
    }

    message.textContent = "✅ Booking created successfully!";
    message.classList.add("success");
    message.classList.remove("hidden", "error");
    
    // Reset form
    document.getElementById("service").value = "";
    bookBtn.disabled = false;
    bookBtn.textContent = originalText;
    
    // Clear message after 3 seconds
    setTimeout(() => {
      message.classList.add("hidden");
    }, 3000);

  } catch (err) {
    message.textContent = "Server error. Please try again.";
    message.classList.add("error");
    message.classList.remove("hidden", "success");
    bookBtn.disabled = false;
    bookBtn.textContent = originalText;
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}
