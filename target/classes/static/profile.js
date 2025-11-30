// User Profile functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile page loaded');
    
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }

    loadUserProfile();
    setupNavigation();
    setupForms();
    loadAddresses();
});

function loadUserProfile() {
    const userEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/profile/user/${userEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                displayProfile(data.profile);
            }
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });
}

function displayProfile(profile) {
    // Update sidebar
    document.getElementById('userName').textContent = 
        profile.firstName && profile.lastName ? 
        `${profile.firstName} ${profile.lastName}` : 'User Name';
    document.getElementById('userEmail').textContent = profile.email;
    
    // Update personal info form
    document.getElementById('firstName').value = profile.firstName || '';
    document.getElementById('lastName').value = profile.lastName || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('dob').value = profile.dateOfBirth || '';
    document.getElementById('gender').value = profile.gender || '';
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
    // Personal info form
    document.getElementById('personalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updatePersonalInfo();
    });
    
    // Preferences form
    document.getElementById('preferencesForm').addEventListener('submit', function(e) {
        e.preventDefault();
        savePreferences();
    });
    
    // Notifications form
    document.getElementById('notificationsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNotificationSettings();
    });
    
    // Address form
    document.getElementById('addressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveAddress();
    });
}

function updatePersonalInfo() {
    const userEmail = localStorage.getItem('userEmail');
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        dateOfBirth: document.getElementById('dob').value,
        gender: document.getElementById('gender').value
    };
    
    fetch(`http://localhost:8081/api/profile/user/${userEmail}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'SUCCESS') {
            alert('Profile updated successfully!');
            loadUserProfile(); // Reload profile to update sidebar
        } else {
            alert('Failed to update profile: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update profile');
    });
}

function savePreferences() {
    const formData = new FormData(document.getElementById('preferencesForm'));
    const preferences = {
        communication: formData.getAll('communication'),
        notifications: formData.getAll('notifications'),
        language: formData.get('language')
    };
    
    // Save to localStorage (in real app, send to backend)
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    alert('Preferences saved successfully!');
}

function saveNotificationSettings() {
    const formData = new FormData(document.getElementById('notificationsForm'));
    const notifications = {
        email_bookings: formData.get('email_bookings') === 'on',
        email_promotions: formData.get('email_promotions') === 'on',
        email_newsletter: formData.get('email_newsletter') === 'on',
        push_reminders: formData.get('push_reminders') === 'on',
        push_updates: formData.get('push_updates') === 'on'
    };
    
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    alert('Notification settings saved successfully!');
}

function loadAddresses() {
    // Load addresses from localStorage (in real app, fetch from backend)
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    displayAddresses(addresses);
}

function displayAddresses(addresses) {
    const container = document.getElementById('addressesList');
    
    if (addresses.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No addresses saved yet</p></div>';
        return;
    }
    
    container.innerHTML = addresses.map((address, index) => `
        <div class="address-item ${address.isDefault ? 'default' : ''}">
            <div class="address-info">
                <div class="address-header">
                    <h4>${address.label}</h4>
                    ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <p>${address.line1}</p>
                ${address.line2 ? `<p>${address.line2}</p>` : ''}
                <p>${address.city}, ${address.state} - ${address.pincode}</p>
                ${address.landmark ? `<p><strong>Landmark:</strong> ${address.landmark}</p>` : ''}
            </div>
            <div class="address-actions">
                <button class="btn outline" onclick="editAddress(${index})">Edit</button>
                <button class="btn secondary" onclick="deleteAddress(${index})">Delete</button>
                ${!address.isDefault ? `<button class="btn primary" onclick="setDefaultAddress(${index})">Set Default</button>` : ''}
            </div>
        </div>
    `).join('');
}

function showAddAddressModal() {
    document.getElementById('addAddressModal').style.display = 'block';
    document.getElementById('addressForm').reset();
}

function saveAddress() {
    const formData = new FormData(document.getElementById('addressForm'));
    const address = {
        label: formData.get('label'),
        line1: formData.get('line1'),
        line2: formData.get('line2'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode'),
        landmark: formData.get('landmark'),
        isDefault: formData.get('isDefault') === 'on'
    };
    
    let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    
    // If this is set as default, remove default from others
    if (address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }
    
    // If no addresses exist, set this as default
    if (addresses.length === 0) {
        address.isDefault = true;
    }
    
    addresses.push(address);
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    
    alert('Address saved successfully!');
    document.getElementById('addAddressModal').style.display = 'none';
    loadAddresses();
}

function editAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    const address = addresses[index];
    
    // Populate form with address data
    document.getElementById('addressLabel').value = address.label;
    document.getElementById('addressLine1').value = address.line1;
    document.getElementById('addressLine2').value = address.line2 || '';
    document.getElementById('city').value = address.city;
    document.getElementById('state').value = address.state;
    document.getElementById('pincode').value = address.pincode;
    document.getElementById('landmark').value = address.landmark || '';
    document.querySelector('input[name="isDefault"]').checked = address.isDefault;
    
    // Show modal
    document.getElementById('addAddressModal').style.display = 'block';
    
    // Update form submit to handle edit
    const form = document.getElementById('addressForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        updateAddress(index);
    };
}

function updateAddress(index) {
    const formData = new FormData(document.getElementById('addressForm'));
    const address = {
        label: formData.get('label'),
        line1: formData.get('line1'),
        line2: formData.get('line2'),
        city: formData.get('city'),
        state: formData.get('state'),
        pincode: formData.get('pincode'),
        landmark: formData.get('landmark'),
        isDefault: formData.get('isDefault') === 'on'
    };
    
    let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
   
    if (address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
    }
    
    addresses[index] = address;
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    
    alert('Address updated successfully!');
    document.getElementById('addAddressModal').style.display = 'none';
    loadAddresses();
    
    // Reset form submit to add new address
    document.getElementById('addressForm').onsubmit = function(e) {
        e.preventDefault();
        saveAddress();
    };
}

function deleteAddress(index) {
    if (confirm('Are you sure you want to delete this address?')) {
        let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
        const wasDefault = addresses[index].isDefault;
        
        addresses.splice(index, 1);
        
        // If we deleted the default address and there are other addresses, set the first one as default
        if (wasDefault && addresses.length > 0) {
            addresses[0].isDefault = true;
        }
        
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        loadAddresses();
    }
}

function setDefaultAddress(index) {
    let addresses = JSON.parse(localStorage.getItem('userAddresses') || '[]');
    
    // Remove default from all addresses
    addresses.forEach(addr => addr.isDefault = false);
    
    // Set the selected address as default
    addresses[index].isDefault = true;
    
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    loadAddresses();
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
    const userEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/profile/user/${userEmail}/password`, {
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
    const modal = document.getElementById('addAddressModal');
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

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}