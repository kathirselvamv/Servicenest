// My Bookings functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('My Bookings page loaded');
    
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }

    loadUserBookings();
    setupFilters();
    setupModal();
});

function loadUserBookings() {
    const userEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/bookings/user/${userEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayBookings(data.bookings || []);
            } else {
                showEmptyState();
            }
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            showEmptyState();
        });
}

function displayBookings(bookings) {
    const container = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        showEmptyState();
        return;
    }

    container.innerHTML = bookings.map(booking => `
        <div class="booking-item" data-status="${booking.status}" data-id="${booking.id}">
            <div class="booking-info">
                <div class="booking-header">
                    <h4>${booking.serviceType}</h4>
                    <span class="booking-status status-${booking.status}">${formatStatus(booking.status)}</span>
                </div>
                <div class="booking-details">
                    <p><strong>Date:</strong> ${formatDate(booking.serviceDate)}</p>
                    <p><strong>Time:</strong> ${booking.serviceTime}</p>
                    <p><strong>Address:</strong> ${booking.serviceAddress}</p>
                    ${booking.assignedWorker ? `<p><strong>Assigned To:</strong> ${booking.assignedWorker}</p>` : ''}
                </div>
                <div class="booking-meta">
                    <span>Booked on: ${formatDateTime(booking.createdAt)}</span>
                </div>
            </div>
            <div class="booking-actions">
                <button class="btn outline" onclick="viewBookingDetails(${booking.id})">View Details</button>
                ${booking.status === 'pending' ? `<button class="btn secondary" onclick="cancelBooking(${booking.id})">Cancel</button>` : ''}
            </div>
        </div>
    `).join('');
}

function showEmptyState() {
    const container = document.getElementById('bookingsList');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No Bookings Yet</h3>
            <p>You haven't made any service bookings yet.</p>
            <a href="services.html" class="btn primary">Book Your First Service</a>
        </div>
    `;
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bookingItems = document.querySelectorAll('.booking-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const status = this.dataset.status;
            
            // Filter bookings
            bookingItems.forEach(item => {
                if (status === 'all' || item.dataset.status === status) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function setupModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function viewBookingDetails(bookingId) {
    fetch(`http://localhost:8081/api/bookings/${bookingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayBookingDetails(data.booking);
            } else {
                alert('Failed to load booking details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load booking details');
        });
}

function displayBookingDetails(booking) {
    const modal = document.getElementById('bookingModal');
    const detailsContainer = document.getElementById('bookingDetails');
    
    detailsContainer.innerHTML = `
        <div class="booking-detail">
            <h3>${booking.serviceType}</h3>
            <div class="detail-section">
                <h4>Service Details</h4>
                <p><strong>Status:</strong> <span class="status-${booking.status}">${formatStatus(booking.status)}</span></p>
                <p><strong>Date:</strong> ${formatDate(booking.serviceDate)}</p>
                <p><strong>Time Slot:</strong> ${booking.serviceTime}</p>
                <p><strong>Address:</strong> ${booking.serviceAddress}</p>
            </div>
            
            <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${booking.customerName}</p>
                <p><strong>Email:</strong> ${booking.customerEmail}</p>
                <p><strong>Phone:</strong> ${booking.customerPhone}</p>
            </div>
            
            ${booking.assignedWorker ? `
            <div class="detail-section">
                <h4>Assigned Professional</h4>
                <p><strong>Worker:</strong> ${booking.assignedWorker}</p>
            </div>
            ` : ''}
            
            <div class="detail-section">
                <h4>Booking Information</h4>
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Booked On:</strong> ${formatDateTime(booking.createdAt)}</p>
                <p><strong>Last Updated:</strong> ${formatDateTime(booking.updatedAt)}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        fetch(`http://localhost:8081/api/bookings/${bookingId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify('cancelled')
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert('Booking cancelled successfully');
                loadUserBookings(); // Reload bookings
            } else {
                alert('Failed to cancel booking: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to cancel booking');
        });
    }
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'Not set';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}