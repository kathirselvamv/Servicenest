// Worker Earnings functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Worker Earnings page loaded');
    
    const workerEmail = localStorage.getItem('userEmail');
    if (!workerEmail) {
        window.location.href = 'login.html';
        return;
    }

    loadEarningsData();
    loadTransactions();
    initializeChart();
});

function loadEarningsData() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/worker/earnings/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayEarnings(data.earnings);
            }
        })
        .catch(error => {
            console.error('Error loading earnings:', error);
            // Display mock data if API fails
            displayMockEarnings();
        });
}

function displayEarnings(earnings) {
    document.getElementById('totalEarnings').textContent = `₹${earnings.totalEarnings}`;
    document.getElementById('monthlyEarnings').textContent = `₹${earnings.monthlyEarnings}`;
    document.getElementById('weeklyEarnings').textContent = `₹${earnings.weeklyEarnings}`;
    document.getElementById('pendingEarnings').textContent = `₹${earnings.pendingEarnings}`;
    document.getElementById('completedJobs').textContent = earnings.completedJobs;
    document.getElementById('avgRating').textContent = earnings.avgRating;
    document.getElementById('repeatCustomers').textContent = earnings.repeatCustomers;
    document.getElementById('responseTime').textContent = earnings.responseTime;
}

function displayMockEarnings() {
    const mockEarnings = {
        totalEarnings: 12500,
        monthlyEarnings: 8500,
        weeklyEarnings: 2500,
        pendingEarnings: 1500,
        completedJobs: 25,
        avgRating: 4.8,
        repeatCustomers: '68%',
        responseTime: '15m'
    };
    displayEarnings(mockEarnings);
}

function loadTransactions() {
    // Mock transactions data
    const transactions = [
        { id: 1, date: '2024-01-15', description: 'Plumbing Service - John Doe', amount: 500, status: 'completed', type: 'credit' },
        { id: 2, date: '2024-01-14', description: 'Electrical Work - Priya Sharma', amount: 400, status: 'completed', type: 'credit' },
        { id: 3, date: '2024-01-13', description: 'AC Service - Raj Kumar', amount: 700, status: 'completed', type: 'credit' },
        { id: 4, date: '2024-01-12', description: 'Painting Service - Anjali Patel', amount: 2000, status: 'pending', type: 'credit' },
        { id: 5, date: '2024-01-11', description: 'Cleaning Service - Sunil Mehta', amount: 1300, status: 'completed', type: 'credit' }
    ];
    
    displayTransactions(transactions);
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No transactions yet</p></div>';
        return;
    }
    
    container.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-header">
                    <h4>${transaction.description}</h4>
                    <span class="transaction-amount ${transaction.type}">₹${transaction.amount}</span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-date">${formatDate(transaction.date)}</span>
                    <span class="transaction-status status-${transaction.status}">${transaction.status}</span>
                </div>
            </div>
            <div class="transaction-actions">
                <button class="btn outline" onclick="viewTransaction(${transaction.id})">View</button>
            </div>
        </div>
    `).join('');
}

function initializeChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    
    // Mock chart data
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Monthly Earnings (₹)',
            data: [8500, 9200, 7800, 11000, 9500, 12500, 13800, 12000, 14500, 13200, 15800, 14200],
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    const config = {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

function viewTransaction(transactionId) {
    alert(`Transaction #${transactionId} details would be shown here.`);
}

function downloadReport() {
    alert('Downloading earnings report...');
    // In a real application, this would generate and download a PDF/Excel report
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}