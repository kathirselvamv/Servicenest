// AI Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Dashboard loaded');
    
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = 'login.html';
        return;
    }

    initializeAIDashboard();
    loadAIRecommendations();
    setupAIChat();
    setupAITabs();
});

function initializeAIDashboard() {
    updateAIDashboard();
    setupQuickActions();
    initializeHomeHealthScore();
}

async function loadAIRecommendations() {
    const userEmail = localStorage.getItem('userEmail');
    
    try {
        const response = await fetch(`http://localhost:8081/api/ai/recommendations/${userEmail}`);
        const data = await response.json();
        
        if (data.status === 'SUCCESS') {
            displayAIRecommendations(data.recommendations);
        } else {
            // Fallback to mock data
            displayMockAIRecommendations();
        }
    } catch (error) {
        console.error('Error loading AI recommendations:', error);
        displayMockAIRecommendations();
    }
}

function displayAIRecommendations(recommendations) {
    displayPersonalizedServices(recommendations.personalized || []);
    displaySeasonalServices(recommendations.seasonal || []);
    displayTrendingServices(recommendations.trending || []);
    displaySmartBundles(recommendations.bundles || []);
}

function displayPersonalizedServices(services) {
    const container = document.getElementById('personalizedServices');
    
    if (services.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No personalized recommendations yet</p></div>';
        return;
    }

    container.innerHTML = services.map(service => `
        <div class="ai-service-card">
            <div class="ai-badge">AI PICK</div>
            <h4>${service.name}</h4>
            <p class="ai-reason">${service.reason}</p>
            <div class="service-rating">
                <span class="stars">${'⭐'.repeat(Math.floor(service.rating))}</span>
                <span class="rating-value">${service.rating}</span>
            </div>
            <div class="ai-price">₹${service.price}</div>
            <div class="ai-score">
                <span>AI Confidence: ${service.aiScore}%</span>
            </div>
            <div class="service-actions">
                <button class="btn primary" onclick="quickBookAI('${service.name}', ${service.price})">Book Now</button>
                <button class="btn outline">Learn More</button>
            </div>
        </div>
    `).join('');
}

function displaySeasonalServices(services) {
    const container = document.getElementById('seasonalServices');
    // Similar implementation as personalized services
}

function displayTrendingServices(services) {
    const container = document.getElementById('trendingServices');
    // Similar implementation as personalized services
}

function displaySmartBundles(bundles) {
    const container = document.getElementById('smartBundles');
    
    if (bundles.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No smart bundles available</p></div>';
        return;
    }

    container.innerHTML = bundles.map(bundle => `
        <div class="ai-bundle-card">
            <h4>${bundle.name}</h4>
            <p>${bundle.description}</p>
            
            <ul class="bundle-services">
                ${bundle.services.map(service => `<li>✅ ${service}</li>`).join('')}
            </ul>
            
            <div class="bundle-price">
                <span class="current-price">₹${bundle.price}</span>
                <span class="original-price">₹${bundle.originalPrice}</span>
                <span class="savings-badge">Save ₹${bundle.savings}</span>
            </div>
            
            <div class="ai-score">
                <span>AI Confidence: ${bundle.aiScore}%</span>
            </div>
            
            <div class="service-actions">
                <button class="btn primary" onclick="bookSmartBundle('${bundle.name}')">Get Bundle</button>
                <button class="btn outline">Customize</button>
            </div>
        </div>
    `).join('');
}

function displayMockAIRecommendations() {
    const mockRecommendations = {
        personalized: [
            {
                name: "Smart Home Setup",
                reason: "Based on your electrical service history",
                rating: 4.7,
                price: 8000,
                aiScore: 92
            },
            {
                name: "Bathroom Renovation",
                reason: "Matches your plumbing service pattern",
                rating: 4.8,
                price: 15000,
                aiScore: 88
            }
        ],
        seasonal: [
            {
                name: "Monsoon Home Protection",
                reason: "Seasonal weather preparation",
                rating: 4.6,
                price: 2999,
                aiScore: 85
            }
        ],
        trending: [
            {
                name: "Water Purifier Installation",
                reason: "Popular in your neighborhood",
                rating: 4.9,
                price: 2500,
                aiScore: 90
            }
        ],
        bundles: [
            {
                name: "Complete Home Maintenance",
                description: "Everything your home needs",
                services: ["Plumbing Check", "Electrical Safety", "Deep Cleaning", "AC Service"],
                price: 4999,
                originalPrice: 6999,
                savings: 2000,
                aiScore: 94
            }
        ]
    };

    displayAIRecommendations(mockRecommendations);
}

function setupAIChat() {
    // Chat toggle button
    const chatToggle = document.createElement('button');
    chatToggle.className = 'ai-chat-toggle';
    chatToggle.innerHTML = '💬 AI Assistant';
    chatToggle.onclick = openAIChat;
    document.body.appendChild(chatToggle);

    // Chat functionality
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';

    // Get AI response
    try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await fetch('http://localhost:8081/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userEmail: userEmail
            })
        });

        const data = await response.json();
        
        if (data.status === 'SUCCESS') {
            // Simulate AI typing delay
            setTimeout(() => {
                addChatMessage(data.message, 'ai');
            }, 1000);
        }
    } catch (error) {
        console.error('Chat error:', error);
        addChatMessage("I'm having trouble responding right now. Please try again.", 'ai');
    }
}

function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function openAIChat() {
    document.getElementById('chatWidget').classList.add('active');
}

function closeChat() {
    document.getElementById('chatWidget').classList.remove('active');
}

function setupAITabs() {
    const tabBtns = document.querySelectorAll('.recommendations-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.recommendations-content .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
        });
    });
}

function setupQuickActions() {
    // Add event listeners for quick action buttons
}

function initializeHomeHealthScore() {
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = bar.style.width;
        });
    }, 500);
}

// AI Action Functions
function schedulePredictiveMaintenance() {
    alert('🚀 AI is scheduling your predictive maintenance...');
    // Implement predictive maintenance scheduling
}

function viewSeasonalServices() {
    document.querySelector('.recommendations-tabs .tab-btn[data-tab="seasonal"]').click();
}

function viewSmartBundles() {
    document.querySelector('.recommendations-tabs .tab-btn[data-tab="bundles"]').click();
}

function quickBookAI(serviceName, price) {
    if (confirm(`Book "${serviceName}" for ₹${price}?`)) {
        // Implement AI-powered quick booking
        alert(`✅ AI is booking ${serviceName} with optimized scheduling!`);
    }
}

function bookSmartBundle(bundleName) {
    alert(`🎯 AI is configuring your "${bundleName}" bundle with best available professionals!`);
}

function scanHomeIssues() {
    alert('📱 AI Home Scan: Please allow camera access to scan your home issues...');
    // Implement AR-based home issue scanning
}

function emergencyConnect() {
    alert('🚨 AI Emergency Mode: Connecting you with nearest available professionals...');
}

function scheduleAI() {
    alert('📅 AI Smart Scheduling: Analyzing your calendar for optimal service timing...');
}

function updateAIDashboard() {
    // Real-time AI dashboard updates
    setInterval(() => {
        // Update AI insights dynamically
        const confidenceElements = document.querySelectorAll('.ai-confidence');
        confidenceElements.forEach(el => {
            const newConfidence = Math.min(95, Math.max(85, parseFloat(el.textContent) + (Math.random() - 0.5) * 2));
            el.textContent = Math.round(newConfidence) + '% match';
        });
    }, 30000); // Update every 30 seconds
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}