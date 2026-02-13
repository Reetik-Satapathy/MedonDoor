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
  const serviceId = document.getElementById("service").value;

  if (!serviceId) {
    message.textContent = "Please select a service.";
    return;
  }

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
      return;
    }

    message.textContent = "Booking created successfully!";
  } catch (err) {
    message.textContent = "Server error.";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
