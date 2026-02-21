const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "user") {
  window.location.href = "login.html";
}

const historyDiv = document.getElementById("history");
document.getElementById("backBtn").onclick = () => window.location.href = "book.html";
document.getElementById("logoutBtn").onclick = logout;

async function loadHistory() {
  try {
    const res = await fetch("http://localhost:5000/api/bookings/my", {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    historyDiv.innerHTML = "";

    if (!data.length) {
      historyDiv.innerHTML = `
        <div class="empty-state">
          <p>No bookings yet.</p>
          <p style="margin-top: var(--spacing-sm);">
            <a href="book.html" style="color: var(--primary); text-decoration: none; font-weight: 500;">
              Book your first service →
            </a>
          </p>
        </div>
      `;
      return;
    }

    data.forEach(b => {
      const statusClass = b.status.toLowerCase();
      const date = new Date(b.created_at);
      const formattedDate = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      historyDiv.innerHTML += `
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${b.service_name}</h3>
              <span class="status-badge ${statusClass}">${b.status}</span>
            </div>
          </div>
          <div class="card-body">
            <p style="color: var(--text-secondary); margin-bottom: var(--spacing-xs);">
              <strong>Booked on:</strong> ${formattedDate}
            </p>
            ${b.provider_name ? `
              <p style="color: var(--text-secondary);">
                <strong>Provider:</strong> ${b.provider_name}
              </p>
            ` : ''}
          </div>
          ${b.status === "COMPLETED" ? `
            <div class="card-footer">
              <button onclick="rateBooking(${b.id})" class="success" style="flex: 1;">
                ⭐ Rate Service
              </button>
            </div>
          ` : ''}
        </div>
      `;
    });
  } catch (err) {
    historyDiv.innerHTML = `
      <div class="error">
        Error loading booking history. Please try again.
      </div>
    `;
  }
}

function rateBooking(bookingId) {
  // Create a simple rating modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: var(--spacing-xl);
    border-radius: var(--radius-xl);
    max-width: 400px;
    width: 90%;
    box-shadow: var(--shadow-xl);
  `;
  
  let selectedRating = 0;
  let comment = '';
  
  modalContent.innerHTML = `
    <h3 style="margin-bottom: var(--spacing-lg);">Rate This Service</h3>
    <div class="rating-stars" id="ratingStars">
      ${[1, 2, 3, 4, 5].map(i => `
        <button type="button" onclick="selectRating(${i})" id="star-${i}">⭐</button>
      `).join('')}
    </div>
    <textarea 
      id="ratingComment" 
      placeholder="Optional: Share your experience..."
      style="width: 100%; margin-top: var(--spacing-md); padding: var(--spacing-sm); border: 2px solid var(--border-color); border-radius: var(--radius-md); min-height: 80px; font-family: inherit;"
    ></textarea>
    <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
      <button onclick="submitRating()" class="success" style="flex: 1; margin: 0;">Submit</button>
      <button onclick="closeRatingModal()" class="secondary" style="flex: 1; margin: 0;">Cancel</button>
    </div>
  `;
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  window.selectRating = (rating) => {
    selectedRating = rating;
    for (let i = 1; i <= 5; i++) {
      const star = document.getElementById(`star-${i}`);
      if (i <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    }
  };
  
  window.submitRating = async () => {
    if (selectedRating < 1 || selectedRating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    
    comment = document.getElementById("ratingComment").value.trim();
    
    try {
      const res = await fetch("http://localhost:5000/api/ratings/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          booking_id: bookingId,
          rating: selectedRating,
          comment: comment || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error submitting rating");
        return;
      }

      alert("Thank you for your feedback!");
      closeRatingModal();
      loadHistory();
    } catch (err) {
      alert("Error submitting rating. Please try again.");
    }
  };
  
  window.closeRatingModal = () => {
    document.body.removeChild(modal);
    delete window.selectRating;
    delete window.submitRating;
    delete window.closeRatingModal;
  };
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

loadHistory();
