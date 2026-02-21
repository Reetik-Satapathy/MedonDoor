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
      bookingsDiv.innerHTML = `
        <div class="empty-state">
          <p>No bookings available at the moment.</p>
          <p style="margin-top: var(--spacing-sm); color: var(--text-secondary);">
            New service requests will appear here.
          </p>
        </div>
      `;
      return;
    }

    data.forEach(b => {
      const statusClass = b.status.toLowerCase();
      const date = b.created_at ? new Date(b.created_at) : new Date();
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      bookingsDiv.innerHTML += `
        <div class="card" id="booking-${b.id}">
          <div class="card-header">
            <div>
              <h3 class="card-title">${b.service_name}</h3>
              <span class="status-badge ${statusClass}">${b.status}</span>
            </div>
          </div>
          <div class="card-body">
            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-xs);">
              <strong>Requested on:</strong> ${formattedDate}
            </p>
            ${b.user_name ? `
              <p style="color: var(--text-secondary);">
                <strong>Patient:</strong> ${b.user_name}
              </p>
            ` : ''}
          </div>
          <div class="card-footer">
            ${
              b.status === "PENDING"
                ? `<button id="accept-${b.id}" onclick="accept(${b.id})" class="success">
                     ✓ Accept Booking
                   </button>`
                : ""
            }
            ${
              b.status === "ACCEPTED"
                ? `<button onclick="complete(${b.id})" class="success">
                     ✓ Mark as Completed
                   </button>`
                : ""
            }
          </div>
        </div>
      `;
    });
  } catch (err) {
    bookingsDiv.innerHTML = `
      <div class="error">
        Error loading bookings. Please refresh the page.
      </div>
    `;
  }
}

async function accept(id) {
  const btn = document.getElementById(`accept-${id}`);
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Accepting...';
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
        btn.textContent = "✓ Accept Booking";
      }
      return;
    }

    // Show success feedback
    const card = document.getElementById(`booking-${id}`);
    if (card) {
      card.style.background = "#d1fae5";
      setTimeout(() => {
        loadBookings();
      }, 500);
    } else {
      loadBookings();
    }
  } catch (err) {
    alert("Server error while accepting booking");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "✓ Accept Booking";
    }
  }
}

async function complete(id) {
  if (!confirm("Mark this booking as completed?")) {
    return;
  }

  const card = document.getElementById(`booking-${id}`);
  const completeBtn = card?.querySelector('button');
  
  if (completeBtn) {
    completeBtn.disabled = true;
    completeBtn.innerHTML = '<span class="spinner"></span> Completing...';
  }

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
      if (completeBtn) {
        completeBtn.disabled = false;
        completeBtn.textContent = "✓ Mark as Completed";
      }
      return;
    }

    // Show success feedback
    if (card) {
      card.style.background = "#d1fae5";
      setTimeout(() => {
        loadBookings();
      }, 500);
    } else {
      loadBookings();
    }
  } catch (err) {
    alert("Server error while completing booking");
    if (completeBtn) {
      completeBtn.disabled = false;
      completeBtn.textContent = "✓ Mark as Completed";
    }
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

loadBookings();
