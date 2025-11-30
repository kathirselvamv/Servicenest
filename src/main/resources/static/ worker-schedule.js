// Worker Schedule functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Worker Schedule page loaded');
    
    const workerEmail = localStorage.getItem('userEmail');
    if (!workerEmail) {
        window.location.href = 'login.html';
        return;
    }

    initializeSchedule();
    loadAppointments();
    setupAvailabilityModal();
});

let currentWeek = new Date();

function initializeSchedule() {
    generateWeekSchedule();
    setupWeekNavigation();
}

function generateWeekSchedule() {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const weekStart = getWeekStart(currentWeek);
    
    document.getElementById('currentWeek').textContent = 
        `Week of ${formatDate(weekStart)}`;
    
    // Generate time slots (7 AM to 8 PM)
    let scheduleHTML = '<div class="time-column">';
    for (let hour = 7; hour <= 20; hour++) {
        scheduleHTML += `<div class="time-slot">${formatHour(hour)}</div>`;
    }
    scheduleHTML += '</div>';
    
    // Generate days columns
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        
        scheduleHTML += `
            <div class="day-column" data-date="${day.toISOString().split('T')[0]}">
                <div class="day-header">
                    <div class="day-name">${getDayName(day)}</div>
                    <div class="day-date">${formatDate(day)}</div>
                </div>
                ${generateDayTimeSlots(day)}
            </div>
        `;
    }
    
    scheduleGrid.innerHTML = scheduleHTML;
}

function generateDayTimeSlots(day) {
    let slotsHTML = '';
    for (let hour = 7; hour <= 20; hour++) {
        const slotId = `slot-${formatDate(day)}-${hour}`;
        slotsHTML += `
            <div class="time-slot" id="${slotId}" data-time="${hour}:00">
                <!-- Appointments will be added here dynamically -->
            </div>
        `;
    }
    return slotsHTML;
}

function setupWeekNavigation() {
    document.getElementById('prevWeek').addEventListener('click', function() {
        currentWeek.setDate(currentWeek.getDate() - 7);
        generateWeekSchedule();
        loadAppointments();
    });
    
    document.getElementById('nextWeek').addEventListener('click', function() {
        currentWeek.setDate(currentWeek.getDate() + 7);
        generateWeekSchedule();
        loadAppointments();
    });
}

function loadAppointments() {
    const workerEmail = localStorage.getItem('userEmail');
    
    fetch(`http://localhost:8081/api/bookings/worker/${workerEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS') {
                const appointments = data.bookings || [];
                displayAppointments(appointments);
                displayTodayAppointments(appointments);
                displayUpcomingAppointments(appointments);
            }
        })
        .catch(error => {
            console.error('Error loading appointments:', error);
        });
}

function displayAppointments(appointments) {
    // Clear existing appointments
    document.querySelectorAll('.appointment').forEach(el => el.remove());
    
    appointments.forEach(appointment => {
        if (appointment.status === 'accepted' || appointment.status === 'in-progress') {
            addAppointmentToSchedule(appointment);
        }
    });
}

function addAppointmentToSchedule(appointment) {
    const date = appointment.serviceDate;
    const time = appointment.serviceTime.split('-')[0]; // Get start time
    const hour = parseInt(time.split(':')[0]);
    
    const slotId = `slot-${date}-${hour}`;
    const slot = document.getElementById(slotId);
    
    if (slot) {
        const appointmentEl = document.createElement('div');
        appointmentEl.className = `appointment status-${appointment.status}`;
        appointmentEl.innerHTML = `
            <div class="appointment-content">
                <strong>${appointment.serviceType}</strong>
                <small>${appointment.customerName}</small>
                <small>${appointment.serviceTime}</small>
            </div>
        `;
        appointmentEl.addEventListener('click', () => viewAppointmentDetails(appointment));
        slot.appendChild(appointmentEl);
    }
}

function displayTodayAppointments(appointments) {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => 
        apt.serviceDate === today && 
        (apt.status === 'accepted' || apt.status === 'in-progress')
    );
    
    const container = document.getElementById('todayAppointments');
    displayAppointmentList(todayAppointments, container);
}

function displayUpcomingAppointments(appointments) {
    const today = new Date();
    const upcomingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.serviceDate);
        return aptDate > today && 
               (apt.status === 'accepted' || apt.status === 'in-progress');
    }).sort((a, b) => new Date(a.serviceDate) - new Date(b.serviceDate));
    
    const container = document.getElementById('upcomingAppointments');
    displayAppointmentList(upcomingAppointments, container);
}

function displayAppointmentList(appointments, container) {
    if (appointments.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No appointments</p></div>';
        return;
    }
    
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-time">${apt.serviceTime}</div>
            <div class="appointment-details">
                <h4>${apt.serviceType}</h4>
                <p>${apt.customerName} • ${apt.customerPhone}</p>
                <p class="appointment-address">${apt.serviceAddress}</p>
            </div>
            <div class="appointment-status status-${apt.status}">${formatStatus(apt.status)}</div>
        </div>
    `).join('');
}

function viewAppointmentDetails(appointment) {
    alert(`Appointment Details:\n
Service: ${appointment.serviceType}
Customer: ${appointment.customerName}
Phone: ${appointment.customerPhone}
Date: ${formatDate(appointment.serviceDate)}
Time: ${appointment.serviceTime}
Address: ${appointment.serviceAddress}
Status: ${formatStatus(appointment.status)}`);
}

function setupAvailabilityModal() {
    const modal = document.getElementById('availabilityModal');
    const openBtn = document.getElementById('setAvailability');
    const closeBtn = modal.querySelector('.close');
    const form = document.getElementById('availabilityForm');
    
    openBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveAvailability();
    });
}

function saveAvailability() {
    const formData = new FormData(document.getElementById('availabilityForm'));
    const availability = {
        days: formData.getAll('days'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        breakStart: formData.get('breakStart'),
        breakEnd: formData.get('breakEnd')
    };
    
    // Save to localStorage (in real app, send to backend)
    localStorage.setItem('workerAvailability', JSON.stringify(availability));
    
    alert('Availability saved successfully!');
    document.getElementById('availabilityModal').style.display = 'none';
}

// Utility functions
function getWeekStart(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
    });
}

function formatHour(hour) {
    return hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function getDayName(date) {
    return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'in-progress': 'In Progress',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}