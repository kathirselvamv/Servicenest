// User Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

// Replace the loadDashboardData function in user-dashboard.js
function loadDashboardData() {
    // Load user info
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        document.getElementById('userName').textContent = userEmail.split('@')[0];
        
        // Load bookings from API
        fetch(`http://localhost:8081/api/bookings/user/${userEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "SUCCESS") {
                    const userBookings = data.bookings || [];
                    
                    // Update stats
                    document.getElementById('totalBookings').textContent = userBookings.length;
                    document.getElementById('pendingBookings').textContent = 
                        userBookings.filter(b => b.status === 'pending').length;
                    document.getElementById('completedBookings').textContent = 
                        userBookings.filter(b => b.status === 'completed').length;
                    
                    // Load recent bookings
                    loadRecentBookings(userBookings);
                }
            })
            .catch(error => {
                console.error('Error loading bookings:', error);
            });
    }
}

function loadRecentBookings(bookings) {
    const container = document.getElementById('recentBookings');
    
    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No recent bookings found</p>
                <a href="services.html" class="btn primary">Book Your First Service</a>
            </div>
        `;
        return;
    }
    
    const recentBookings = bookings.slice(0, 3);
    
    container.innerHTML = recentBookings.map(booking => `
        <div class="booking-item">
            <div class="booking-info">
                <h4>${booking.service}</h4>
                <p>Date: ${booking.date} | Time: ${booking.time}</p>
                <span class="status ${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-actions">
                <button class="btn outline" onclick="viewBooking(${booking.id})">View</button>
            </div>
        </div>
    `).join('');
}

function quickBook(service) {
    localStorage.setItem('quickBookService', service);
    window.location.href = 'services.html';
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Add these styles for booking items
const style = document.createElement('style');
style.textContent = `
    .booking-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .status.pending {
        background: #fef3c7;
        color: #92400e;
    }
    
    .status.completed {
        background: #dcfce7;
        color: #166534;
    }
`;
document.head.appendChild(style);