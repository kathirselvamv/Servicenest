// Worker Profile functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Worker Profile page loaded');
    
    const workerEmail = localStorage.getItem('userEmail');
    if (!workerEmail) {
        window.location.href = 'login.html';
        return;
    }

    loadWorkerProfile();
    setupNavigation();
    setupForms();
    loadWorkerServices();
    loadPortfolio();
    loadReviews();
});

function loadWorkerProfile() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/worker/profile/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayWorkerProfile(data.profile);
            }
        })
        .catch(error => {
            console.error('Error loading worker profile:', error);
        });
}

function displayWorkerProfile(profile) {
    // Update sidebar
    document.getElementById('workerName').textContent = 
        profile.professionalTitle || 'Service Professional';
    document.getElementById('workerEmail').textContent = profile.email;
    
    // Update professional info form
    document.getElementById('professionalTitle').value = profile.professionalTitle || '';
    document.getElementById('experience').value = profile.experience || '';
    document.getElementById('bio').value = profile.bio || '';
    document.getElementById('hourlyRate').value = profile.hourlyRate || '';
    
    // Update service areas checkboxes
    if (profile.serviceAreas) {
        const areas = profile.serviceAreas.split(',');
        document.querySelectorAll('input[name="areas"]').forEach(checkbox => {
            checkbox.checked = areas.includes(checkbox.value);
        });
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all items and contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked item and corresponding content
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupForms() {
    // Professional info form
    document.getElementById('professionalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfessionalInfo();
    });
    
    // Service form
    document.getElementById('serviceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addService();
    });
}

function updateProfessionalInfo() {
    const workerEmail = localStorage.getItem('userEmail');
    const formData = {
        professionalTitle: document.getElementById('professionalTitle').value,
        experience: document.getElementById('experience').value,
        bio: document.getElementById('bio').value,
        hourlyRate: parseFloat(document.getElementById('hourlyRate').value) || 0,
        serviceAreas: Array.from(document.querySelectorAll('input[name="areas"]:checked'))
                         .map(checkbox => checkbox.value).join(',')
    };
    
    fetch(`http://localhost:8081/api/worker/profile/${workerEmail}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            alert('Professional profile updated successfully!');
            loadWorkerProfile(); // Reload profile to update sidebar
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update profile');
    });
}

function loadWorkerServices() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/worker/services/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayServices(data.services || []);
            }
        })
        .catch(error => {
            console.error('Error loading services:', error);
            // Display mock services if API fails
            displayMockServices();
        });
}

function displayServices(services) {
    const container = document.getElementById('servicesList');
    
    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No services added yet</p></div>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-item">
            <div class="service-info">
                <div class="service-header">
                    <h4>${service.name}</h4>
                    <span class="service-price">₹${service.price}</span>
                </div>
                <p class="service-description">${service.description}</p>
                <div class="service-meta">
                    <span class="service-duration">Duration: ${service.duration} hours</span>
                </div>
            </div>
            <div class="service-actions">
                <button class="btn outline" onclick="editService('${service.name}')">Edit</button>
                <button class="btn secondary" onclick="deleteService('${service.name}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function displayMockServices() {
    const mockServices = [
        { name: 'Plumbing', description: 'Basic plumbing repairs and installations', price: 500, duration: 2 },
        { name: 'Electrical', description: 'Wiring and electrical repairs', price: 400, duration: 1.5 },
        { name: 'AC Service', description: 'AC installation and maintenance', price: 700, duration: 3 }
    ];
    displayServices(mockServices);
}

function showAddServiceModal() {
    document.getElementById('addServiceModal').style.display = 'block';
    document.getElementById('serviceForm').reset();
}

function addService() {
    const formData = new FormData(document.getElementById('serviceForm'));
    const service = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        duration: parseFloat(formData.get('duration'))
    };
    
    // Save to localStorage (in real app, send to backend)
    let services = JSON.parse(localStorage.getItem('workerServices') || '[]');
    services.push(service);
    localStorage.setItem('workerServices', JSON.stringify(services));
    
    alert('Service added successfully!');
    document.getElementById('addServiceModal').style.display = 'none';
    loadWorkerServices();
}

function editService(serviceName) {
    const services = JSON.parse(localStorage.getItem('workerServices') || '[]');
    const service = services.find(s => s.name === serviceName);
    
    if (service) {
        // Populate form with service data
        document.getElementById('serviceCategory').value = service.category || '';
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDuration').value = service.duration;
        
        // Show modal
        document.getElementById('addServiceModal').style.display = 'block';
        
        // Update form submit to handle edit
        const form = document.getElementById('serviceForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            updateService(serviceName);
        };
    }
}

function updateService(oldServiceName) {
    const formData = new FormData(document.getElementById('serviceForm'));
    const updatedService = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        duration: parseFloat(formData.get('duration'))
    };
    
    let services = JSON.parse(localStorage.getItem('workerServices') || '[]');
    const serviceIndex = services.findIndex(s => s.name === oldServiceName);
    
    if (serviceIndex !== -1) {
        services[serviceIndex] = updatedService;
        localStorage.setItem('workerServices', JSON.stringify(services));
        
        alert('Service updated successfully!');
        document.getElementById('addServiceModal').style.display = 'none';
        loadWorkerServices();
        
        // Reset form submit to add new service
        document.getElementById('serviceForm').onsubmit = function(e) {
            e.preventDefault();
            addService();
        };
    }
}

function deleteService(serviceName) {
    if (confirm('Are you sure you want to delete this service?')) {
        let services = JSON.parse(localStorage.getItem('workerServices') || '[]');
        services = services.filter(s => s.name !== serviceName);
        localStorage.setItem('workerServices', JSON.stringify(services));
        loadWorkerServices();
    }
}

function loadPortfolio() {
    // Mock portfolio data
    const portfolio = [
        { id: 1, title: 'Modern Kitchen Plumbing', description: 'Complete plumbing installation for modern kitchen', image: '🔧', date: '2024-01-10' },
        { id: 2, title: 'Office Electrical Wiring', description: 'Electrical wiring for corporate office space', image: '⚡', date: '2024-01-05' },
        { id: 3, title: 'AC Installation', description: 'Central AC system installation', image: '❄️', date: '2024-01-02' }
    ];
    
    displayPortfolio(portfolio);
}

function displayPortfolio(portfolio) {
    const container = document.getElementById('portfolioGrid');
    
    if (portfolio.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No portfolio items yet</p></div>';
        return;
    }
    
    container.innerHTML = portfolio.map(item => `
        <div class="portfolio-item">
            <div class="portfolio-image">${item.image}</div>
            <div class="portfolio-info">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <span class="portfolio-date">${formatDate(item.date)}</span>
            </div>
            <div class="portfolio-actions">
                <button class="btn outline" onclick="viewPortfolioItem(${item.id})">View</button>
                <button class="btn secondary" onclick="deletePortfolioItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddPortfolioModal() {
    const title = prompt('Enter portfolio item title:');
    if (!title) return;
    
    const description = prompt('Enter portfolio item description:');
    if (!description) return;
    
    const portfolioItem = {
        id: Date.now(),
        title: title,
        description: description,
        image: '📷',
        date: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    let portfolio = JSON.parse(localStorage.getItem('workerPortfolio') || '[]');
    portfolio.push(portfolioItem);
    localStorage.setItem('workerPortfolio', JSON.stringify(portfolio));
    
    loadPortfolio();
}

function viewPortfolioItem(itemId) {
    alert(`Viewing portfolio item #${itemId}`);
}

function deletePortfolioItem(itemId) {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
        let portfolio = JSON.parse(localStorage.getItem('workerPortfolio') || '[]');
        portfolio = portfolio.filter(item => item.id !== itemId);
        localStorage.setItem('workerPortfolio', JSON.stringify(portfolio));
        loadPortfolio();
    }
}

function loadReviews() {
    // Mock reviews data
    const reviews = [
        { id: 1, customer: 'John Doe', rating: 5, comment: 'Excellent service! Very professional and punctual.', date: '2024-01-15' },
        { id: 2, customer: 'Priya Sharma', rating: 5, comment: 'Great work! Fixed the electrical issue quickly.', date: '2024-01-12' },
        { id: 3, customer: 'Raj Kumar', rating: 4, comment: 'Good service, but was a bit late.', date: '2024-01-08' }
    ];
    
    displayReviews(reviews);
}

function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No reviews yet</p></div>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <h4>${review.customer}</h4>
                    <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                </div>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
        </div>
    `).join('');
}

function showChangePasswordModal() {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;
    
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;
    
    const confirmPassword = prompt('Confirm your new password:');
    if (!confirmPassword) return;
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    changePassword(currentPassword, newPassword);
}

function changePassword(currentPassword, newPassword) {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/profile/user/${workerEmail}/password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            alert('Password changed successfully!');
        } else {
            alert('Failed to change password: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to change password');
    });
}

// Setup modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('addServiceModal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

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