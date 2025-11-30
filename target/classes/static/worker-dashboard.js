// Worker Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    loadWorkerDashboard();
});

// Replace the loadWorkerDashboard function in worker-dashboard.js
function loadWorkerDashboard() {
    // Load worker info
    const workerEmail = localStorage.getItem('userEmail');
    if (workerEmail) {
        document.getElementById('workerName').textContent = workerEmail.split('@')[0];
        
        // Load assigned jobs
        fetch(`http://localhost:8081/api/bookings/worker/${workerEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "SUCCESS") {
                    const workerBookings = data.bookings || [];
                    
                    // Update stats
                    document.getElementById('totalJobs').textContent = workerBookings.length;
                    document.getElementById('pendingJobs').textContent = 
                        workerBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length;
                    
                    // Calculate earnings
                    const completedJobs = workerBookings.filter(b => b.status === 'completed');
                    const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.price || 500), 0);
                    document.getElementById('totalEarnings').textContent = `₹${totalEarnings}`;
                    
                    // Load today's schedule
                    loadTodaySchedule(workerBookings);
                }
            })
            .catch(error => {
                console.error('Error loading worker bookings:', error);
            });
        
        // Load pending job requests
        fetch('http://localhost:8081/api/bookings/pending')
            .then(response => response.json())
            .then(data => {
                if (data.status === "SUCCESS") {
                    loadJobRequests(data.bookings || []);
                }
            })
            .catch(error => {
                console.error('Error loading pending bookings:', error);
            });
    }
}

function loadTodaySchedule(bookings) {
    const container = document.getElementById('todaySchedule');
    const today = new Date().toISOString().split('T')[0];
    
    const todayJobs = bookings.filter(booking => booking.date === today);
    
    if (todayJobs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No jobs scheduled for today</p></div>';
        return;
    }
    
    container.innerHTML = todayJobs.map(job => `
        <div class="schedule-item">
            <div class="schedule-time">${job.time}</div>
            <div class="schedule-details">
                <h4>${job.service}</h4>
                <p>${job.name} • ${job.phone}</p>
            </div>
            <button class="btn primary" onclick="startJob(${job.id})">Start Job</button>
        </div>
    `).join('');
}

function loadJobRequests(bookings) {
    const container = document.getElementById('jobRequests');
    const pendingJobs = bookings.filter(booking => booking.status === 'pending');
    
    if (pendingJobs.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No new job requests</p></div>';
        return;
    }
    
    container.innerHTML = pendingJobs.map(job => `
        <div class="job-request-item">
            <div class="job-details">
                <h4>${job.service}</h4>
                <p>${job.name} • ${job.phone}</p>
                <p>Date: ${job.date} | Time: ${job.time}</p>
            </div>
            <div class="job-actions">
                <button class="btn primary" onclick="acceptJob(${job.id})">Accept</button>
                <button class="btn outline" onclick="declineJob(${job.id})">Decline</button>
            </div>
        </div>
    `).join('');
}

function acceptJob(jobId) {
    updateJobStatus(jobId, 'accepted');
    alert('Job accepted successfully!');
    location.reload();
}

function declineJob(jobId) {
    if (confirm('Are you sure you want to decline this job?')) {
        updateJobStatus(jobId, 'declined');
        location.reload();
    }
}

function startJob(jobId) {
    updateJobStatus(jobId, 'in-progress');
    alert('Job started!');
}

function updateJobStatus(jobId, status) {
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const jobIndex = bookings.findIndex(b => b.id === jobId);
    if (jobIndex !== -1) {
        bookings[jobIndex].status = status;
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }
}

function updateAvailability() {
    alert('Availability update feature coming soon!');
}

function updateSkills() {
    alert('Skills update feature coming soon!');
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Add styles for worker dashboard
const workerStyle = document.createElement('style');
workerStyle.textContent = `
    .schedule-item, .job-request-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 1rem;
    }
    
    .schedule-time {
        background: #2563eb;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: bold;
    }
    
    .job-actions {
        display: flex;
        gap: 0.5rem;
    }
`;
document.head.appendChild(workerStyle);