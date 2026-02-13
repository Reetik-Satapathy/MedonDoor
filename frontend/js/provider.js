const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "provider") {
  window.location.href = "login.html";
}

const bookingsDiv = document.getElementById("bookings");
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.onclick = logout;
}

async function loadBookings() {
  try {
    const res = await fetch("http://localhost:5000/api/providers/bookings", {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    bookingsDiv.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      bookingsDiv.innerHTML = "<p>No bookings available.</p>";
      return;
    }

    data.forEach(b => {
      bookingsDiv.innerHTML += `
        <div class="card" id="booking-${b.id}">
          <p><b>Service:</b> ${b.service_name}</p>
          <p><b>Status:</b> ${b.status}</p>

          ${
            b.status === "PENDING"
              ? `<button id="accept-${b.id}" onclick="accept(${b.id})">
                   Accept
                 </button>`
              : ""
          }

          ${
            b.status === "ACCEPTED"
              ? `<button onclick="complete(${b.id})">
                   Mark Completed
                 </button>`
              : ""
          }
        </div>
      `;
    });
  } catch (err) {
    bookingsDiv.innerHTML = "<p>Error loading bookings.</p>";
  }
}

async function accept(id) {
  const btn = document.getElementById(`accept-${id}`);
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Accepting...";
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/providers/bookings/${id}/accept`,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Could not accept booking");

      if (btn) {
        btn.disabled = false;
        btn.textContent = "Accept";
      }
    }

    loadBookings();
  } catch (err) {
    alert("Server error while accepting booking");

    if (btn) {
      btn.disabled = false;
      btn.textContent = "Accept";
    }
  }
}

async function complete(id) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/providers/bookings/${id}/complete`,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Could not complete booking");
    }

    loadBookings();
  } catch (err) {
    alert("Server error while completing booking");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

loadBookings();
