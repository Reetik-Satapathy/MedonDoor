const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "user") {
  window.location.href = "login.html";
}

const historyDiv = document.getElementById("history");
document.getElementById("backBtn").onclick = () => window.location.href = "book.html";
document.getElementById("logoutBtn").onclick = logout;

async function loadHistory() {
  const res = await fetch("http://localhost:5000/api/bookings/my", {
    headers: { Authorization: "Bearer " + token }
  });

  const data = await res.json();
  historyDiv.innerHTML = "";

  if (!data.length) {
    historyDiv.textContent = "No bookings yet.";
    return;
  }

  data.forEach(b => {
    historyDiv.innerHTML += `
      <div class="card">
        <p><b>Service:</b> ${b.service_name}</p>
        <p><b>Status:</b> ${b.status}</p>
        <p><b>Date:</b> ${new Date(b.created_at).toLocaleString()}</p>
        ${
        b.status === "COMPLETED"
          ? `<button onclick="rateBooking(${b.id})">Rate</button>`
          : ""
        }
      </div>
    `;
  });
}

function rateBooking(bookingId) {
  const rating = prompt("Rate this service (1-5):");
  if (!rating || rating < 1 || rating > 5) return;

  const comment = prompt("Optional comment:");

  fetch("http://localhost:5000/api/ratings/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      booking_id: bookingId,
      rating,
      comment
    })
  })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(() => alert("Error submitting rating"));
}


function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

loadHistory();
