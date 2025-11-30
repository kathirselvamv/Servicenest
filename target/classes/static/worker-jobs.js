// Worker Jobs functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Worker Jobs page loaded');
    
    const workerEmail = localStorage.getItem('userEmail');
    if (!workerEmail) {
        window.location.href = 'login.html';
        return;
    }

    setupTabs();
    loadWorkerJobs();
    loadPendingJobs();
    setupModal();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
            
            // Load data for the active tab
            if (tabName === 'pending') {
                loadPendingJobs();
            } else if (tabName === 'completed') {
                loadCompletedJobs();
            } else if (tabName === 'active') {
                loadWorkerJobs();
            }
        });
    });
}

function loadWorkerJobs() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/bookings/worker/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                const activeJobs = data.bookings.filter(job => 
                    job.status === 'accepted' || job.status === 'in-progress'
                );
                displayJobs(activeJobs, 'activeJobs');
            }
        })
        .catch(error => {
            console.error('Error loading jobs:', error);
        });
}

function loadPendingJobs() {
    fetch('http://localhost:8081/api/bookings/pending')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayPendingJobs(data.bookings || []);
            }
        })
        .catch(error => {
            console.error('Error loading pending jobs:', error);
        });
}

function loadCompletedJobs() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/bookings/worker/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                const completedJobs = data.bookings.filter(job => job.status === 'completed');
                displayJobs(completedJobs, 'completedJobs');
            }
        })
        .catch(error => {
            console.error('Error loading completed jobs:', error);
        });
}

function displayJobs(jobs, containerId) {
    const container = document.getElementById(containerId);
    
    if (jobs.length === 0) {
        container.innerHTML = getEmptyStateHTML('No jobs found');
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-item" data-id="${job.id}">
            <div class="job-info">
                <div class="job-header">
                    <h4>${job.serviceType}</h4>
                    <span class="job-status status-${job.status}">${formatStatus(job.status)}</span>
                </div>
                <div class="job-details">
                    <p><strong>Customer:</strong> ${job.customerName}</p>
                    <p><strong>Phone:</strong> ${job.customerPhone}</p>
                    <p><strong>Date:</strong> ${formatDate(job.serviceDate)}</p>
                    <p><strong>Time:</strong> ${job.serviceTime}</p>
                    <p><strong>Address:</strong> ${job.serviceAddress}</p>
                </div>
            </div>
            <div class="job-actions">
                <button class="btn outline" onclick="viewJobDetails(${job.id})">View Details</button>
                ${getActionButton(job)}
            </div>
        </div>
    `).join('');
}

function displayPendingJobs(jobs) {
    const container = document.getElementById('pendingJobs');
    
    if (jobs.length === 0) {
        container.innerHTML = getEmptyStateHTML('No pending requests');
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-item" data-id="${job.id}">
            <div class="job-info">
                <div class="job-header">
                    <h4>${job.serviceType}</h4>
                    <span class="job-price">₹${calculateJobPrice(job.serviceType)}</span>
                </div>
                <div class="job-details">
                    <p><strong>Customer:</strong> ${job.customerName}</p>
                    <p><strong>Phone:</strong> ${job.customerPhone}</p>
                    <p><strong>Date:</strong> ${formatDate(job.serviceDate)}</p>
                    <p><strong>Time:</strong> ${job.serviceTime}</p>
                    <p><strong>Address:</strong> ${job.serviceAddress}</p>
                </div>
                <div class="job-meta">
                    <span>Requested: ${formatDateTime(job.createdAt)}</span>
                </div>
            </div>
            <div class="job-actions">
                <button class="btn primary" onclick="acceptJob(${job.id})">Accept Job</button>
                <button class="btn outline" onclick="declineJob(${job.id})">Decline</button>
            </div>
        </div>
    `).join('');
}

function getActionButton(job) {
    switch(job.status) {
        case 'accepted':
            return `<button class="btn primary" onclick="startJob(${job.id})">Start Job</button>`;
        case 'in-progress':
            return `<button class="btn success" onclick="completeJob(${job.id})">Complete Job</button>`;
        default:
            return '';
    }
}

function getEmptyStateHTML(message) {
    const icons = {
        'active': '🛠️',
        'pending': '⏳',
        'completed': '✅',
        'cancelled': '❌'
    };
    
    const icon = icons[message.toLowerCase().includes('pending') ? 'pending' : 
                     message.toLowerCase().includes('completed') ? 'completed' : 
                     message.toLowerCase().includes('active') ? 'active' : '📋'];
    
    return `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h3>${message}</h3>
        </div>
    `;
}

function acceptJob(jobId) {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/bookings/${jobId}/assign-worker`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            workerEmail: workerEmail
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            alert('Job accepted successfully!');
            loadPendingJobs();
            loadWorkerJobs();
        } else {
            alert('Failed to accept job: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to accept job');
    });
}

function declineJob(jobId) {
    if (confirm('Are you sure you want to decline this job?')) {
        fetch(`http://localhost:8081/api/bookings/${jobId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify('declined')
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert('Job declined');
                loadPendingJobs();
            } else {
                alert('Failed to decline job: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to decline job');
        });
    }
}

function startJob(jobId) {
    fetch(`http://localhost:8081/api/bookings/${jobId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify('in-progress')
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            alert('Job started!');
            loadWorkerJobs();
        } else {
            alert('Failed to start job: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to start job');
    });
}

function completeJob(jobId) {
    if (confirm('Mark this job as completed?')) {
        fetch(`http://localhost:8081/api/bookings/${jobId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify('completed')
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                alert('Job completed successfully!');
                loadWorkerJobs();
                loadCompletedJobs();
            } else {
                alert('Failed to complete job: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to complete job');
        });
    }
}

function viewJobDetails(jobId) {
    fetch(`http://localhost:8081/api/bookings/${jobId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayJobDetails(data.booking);
            } else {
                alert('Failed to load job details');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load job details');
        });
}

function displayJobDetails(job) {
    const modal = document.getElementById('jobModal');
    const detailsContainer = document.getElementById('jobDetails');
    const actionsContainer = document.getElementById('jobActions');
    
    detailsContainer.innerHTML = `
        <div class="job-detail">
            <h3>${job.serviceType}</h3>
            <div class="detail-section">
                <h4>Job Details</h4>
                <p><strong>Status:</strong> <span class="status-${job.status}">${formatStatus(job.status)}</span></p>
                <p><strong>Date:</strong> ${formatDate(job.serviceDate)}</p>
                <p><strong>Time Slot:</strong> ${job.serviceTime}</p>
                <p><strong>Address:</strong> ${job.serviceAddress}</p>
                <p><strong>Estimated Price:</strong> ₹${calculateJobPrice(job.serviceType)}</p>
            </div>
            
            <div class="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${job.customerName}</p>
                <p><strong>Email:</strong> ${job.customerEmail}</p>
                <p><strong>Phone:</strong> ${job.customerPhone}</p>
            </div>
            
            <div class="detail-section">
                <h4>Job Information</h4>
                <p><strong>Job ID:</strong> #${job.id}</p>
                <p><strong>Requested On:</strong> ${formatDateTime(job.createdAt)}</p>
                <p><strong>Last Updated:</strong> ${formatDateTime(job.updatedAt)}</p>
            </div>
        </div>
    `;
    
    // Set up action buttons based on job status
    actionsContainer.innerHTML = getJobActionButtons(job);
    
    modal.style.display = 'block';
}

function getJobActionButtons(job) {
    switch(job.status) {
        case 'pending':
            return `
                <button class="btn primary" onclick="acceptJob(${job.id}); closeModal()">Accept Job</button>
                <button class="btn outline" onclick="declineJob(${job.id}); closeModal()">Decline</button>
            `;
        case 'accepted':
            return `<button class="btn primary" onclick="startJob(${job.id}); closeModal()">Start Job</button>`;
        case 'in-progress':
            return `<button class="btn success" onclick="completeJob(${job.id}); closeModal()">Complete Job</button>`;
        default:
            return `<button class="btn outline" onclick="closeModal()">Close</button>`;
    }
}

function closeModal() {
    document.getElementById('jobModal').style.display = 'none';
}

function setupModal() {
    const modal = document.getElementById('jobModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function calculateJobPrice(serviceType) {
    const prices = {
        'Plumbing': 500,
        'Electrical': 400,
        'Painting': 2000,
        'Cleaning': 1300,
        'AC Service': 700,
        'Carpenter': 600
    };
    return prices[serviceType] || 500;
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
        'declined': 'Declined'
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