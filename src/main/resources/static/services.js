// Enhanced Services page functionality with search and ratings

// Enhanced Services with Real-time Features & Advanced Animations
class ServiceNestUI {
  constructor() {
    this.init();
  }

  init() {
    console.log('🚀 ServiceNest Advanced UI Initialized');
    
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      this.loadUserProfileForBooking();
    }

    this.initializeServicesPage();
    this.initializeSearchAndFilters();
    this.initializeReviewsSystem();
    this.initializeRealTimeFeatures();
    this.initializeMobileOptimizations();
  }

  initializeServicesPage() {
    this.setupBookingModal();
    this.setupDateRestrictions();
    this.addCardAnimations();
    this.setupCardHoverEffects();
    this.formatPhoneNumber();
    this.setupNavbarEffects();
  }

  initializeSearchAndFilters() {
    this.setupSearchFunctionality();
    this.setupAdvancedFilters();
    this.setupProviderSelection();
  }

  initializeReviewsSystem() {
    this.setupReviewsModal();
    this.setupRatingInput();
  }

  initializeRealTimeFeatures() {
    this.setupRealTimeNotifications();
    this.setupLiveSearch();
    this.setupOnlineStatus();
  }

  initializeMobileOptimizations() {
    this.setupTouchGestures();
    this.setupMobileMenu();
    this.setupPerformanceOptimizations();
  }

  // === NAVBAR EFFECTS ===
  setupNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Parallax effect
    this.setupParallaxEffect();
  }

  setupParallaxEffect() {
    const servicesContainer = document.querySelector('.services-container');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      servicesContainer.style.transform = `translateY(${rate}px)`;
    });
  }

  // === REAL-TIME FEATURES ===
  setupRealTimeNotifications() {
    this.notificationContainer = document.createElement('div');
    this.notificationContainer.className = 'notification-container';
    this.notificationContainer.style.cssText = `
      position: fixed;
      top: 100px;
      right: 2rem;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `;
    document.body.appendChild(this.notificationContainer);
  }

  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    this.notificationContainer.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 400);
    }, duration);

    return notification;
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    return icons[type] || 'ℹ️';
  }

  setupLiveSearch() {
    const searchInput = document.getElementById('serviceSearch');
    
    searchInput.addEventListener('input', this.debounce(() => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm.length > 2) {
        this.performLiveSearch(searchTerm);
      }
    }, 300));
  }

  async performLiveSearch(searchTerm) {
    try {
      // Show loading state
      this.showNotification('Searching...', 'info', 2000);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update results
      this.performSearch();
      
    } catch (error) {
      this.showNotification('Search failed', 'error');
    }
  }

  setupOnlineStatus() {
    window.addEventListener('online', () => {
      this.showNotification('Back online!', 'success', 2000);
    });

    window.addEventListener('offline', () => {
      this.showNotification('You are offline', 'warning', 3000);
    });
  }

  // === MOBILE OPTIMIZATIONS ===
  setupTouchGestures() {
    let startX, startY;
    const servicesGrid = document.querySelector('.services-grid-detailed');

    servicesGrid.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    servicesGrid.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const diffX = startX - e.touches[0].clientX;
      const diffY = startY - e.touches[0].clientY;
      
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe - prevent vertical scroll
        e.preventDefault();
      }
    }, { passive: false });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.cssText = `
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.5rem;
    `;

    const navContainer = document.querySelector('.nav-container');
    navContainer.appendChild(mobileMenuBtn);

    // Show on mobile
    if (window.innerWidth <= 768) {
      mobileMenuBtn.style.display = 'block';
      document.querySelector('.nav-links').style.display = 'none';
    }

    mobileMenuBtn.addEventListener('click', this.toggleMobileMenu);
  }

  toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const isVisible = navLinks.style.display === 'flex';
    
    navLinks.style.display = isVisible ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(255, 255, 255, 0.15)';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.padding = '1rem';
  }

  setupPerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  preloadCriticalResources() {
    const criticalResources = [
      '/api/services/popular',
      '/api/providers/featured'
    ];

    criticalResources.forEach(resource => {
      fetch(resource, { priority: 'high' }).catch(() => {});
    });
  }

  // === ENHANCED ANIMATIONS ===
  addCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) rotateX(10deg)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) rotateX(0)';
      }, index * 100);
    });
  }

  setupCardHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        card.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
        card.style.boxShadow = '0 20px 40px rgba(31, 38, 135, 0.5)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) rotateX(0)';
        card.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
      });
    });
  }

  // === UTILITY FUNCTIONS ===
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ... (include all other existing functions from previous services.js)
}

// Initialize the enhanced UI
document.addEventListener('DOMContentLoaded', () => {
  new ServiceNestUI();
});

// Service Worker for PWA features (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('Services page loaded');
    
    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        loadUserProfileForBooking();
    }
    
    initializeServicesPage();
    initializeSearchAndFilters();
    initializeReviewsSystem();
});

function initializeServicesPage() {
    setupBookingModal();
    setupDateRestrictions();
    addCardAnimations();
    setupCardHoverEffects();
    formatPhoneNumber();
}

function initializeSearchAndFilters() {
    setupSearchFunctionality();
    setupAdvancedFilters();
    setupProviderSelection();
}

function initializeReviewsSystem() {
    setupReviewsModal();
    setupRatingInput();
}

// Search and Filter Functions
function setupSearchFunctionality() {
    const searchInput = document.getElementById('serviceSearch');
    const searchBtn = document.querySelector('.search-btn');
    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const serviceCards = document.querySelectorAll('.service-detail-card');
        
        serviceCards.forEach(card => {
            const serviceName = card.querySelector('h3').textContent.toLowerCase();
            const serviceDescription = card.querySelector('p').textContent.toLowerCase();
            const serviceFeatures = Array.from(card.querySelectorAll('.service-features li'))
                .map(li => li.textContent.toLowerCase())
                .join(' ');
            
            const matchesSearch = serviceName.includes(searchTerm) ||
                                serviceDescription.includes(searchTerm) ||
                                serviceFeatures.includes(searchTerm);
            
            if (matchesSearch || searchTerm === '') {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };
    
    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    
    // Add debouncing for better performance
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
}

function setupAdvancedFilters() {
    const sortBy = document.getElementById('sortBy');
    const ratingFilter = document.getElementById('ratingFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    const applyFilters = () => {
        const selectedRating = parseFloat(ratingFilter.value);
        const priceRange = priceFilter.value;
        const sortMethod = sortBy.value;
        
        const serviceCards = Array.from(document.querySelectorAll('.service-detail-card'));
        
        // Filter by rating
        let filteredCards = serviceCards.filter(card => {
            const cardRating = parseFloat(card.dataset.rating);
            const cardPrice = parseFloat(card.dataset.price);
            
            // Rating filter
            if (selectedRating > 0 && cardRating < selectedRating) {
                return false;
            }
            
            // Price filter
            if (priceRange !== 'all') {
                const [min, max] = priceRange.split('-').map(val => 
                    val.endsWith('+') ? parseFloat(val) : parseFloat(val)
                );
                
                if (priceRange.endsWith('+')) {
                    if (cardPrice < min) return false;
                } else {
                    if (cardPrice < min || cardPrice > max) return false;
                }
            }
            
            return true;
        });
        
        // Sort results
        filteredCards.sort((a, b) => {
            const ratingA = parseFloat(a.dataset.rating);
            const ratingB = parseFloat(b.dataset.rating);
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const reviewsA = parseInt(a.dataset.reviews);
            const reviewsB = parseInt(b.dataset.reviews);
            
            switch(sortMethod) {
                case 'rating':
                    return ratingB - ratingA;
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'popularity':
                default:
                    return reviewsB - reviewsA;
            }
        });
        
        // Update DOM
        const container = document.querySelector('.services-grid-detailed');
        container.innerHTML = '';
        filteredCards.forEach(card => {
            container.appendChild(card);
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // Show no results message
        if (filteredCards.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No Services Found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                    <button class="btn primary" onclick="resetFilters()">Reset Filters</button>
                </div>
            `;
        }
    };
    
    sortBy.addEventListener('change', applyFilters);
    ratingFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
}

function setupProviderSelection() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('select-provider')) {
            const providerCard = e.target.closest('.provider-card');
            const providerName = e.target.dataset.provider;
            const providerId = providerCard.dataset.providerId;
            
            // Store selected provider
            localStorage.setItem('selectedProvider', JSON.stringify({
                id: providerId,
                name: providerName,
                rating: providerCard.dataset.rating,
                jobs: providerCard.dataset.completedJobs
            }));
            
            // Visual feedback
            document.querySelectorAll('.provider-card').forEach(card => {
                card.style.borderColor = '#e2e8f0';
            });
            providerCard.style.borderColor = '#2563eb';
            
            alert(`Selected provider: ${providerName}`);
        }
    });
}

// Reviews System Functions
function setupReviewsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal reviews-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="reviewsModalTitle">Service Reviews</h2>
            <div class="reviews-list" id="reviewsList">
                <!-- Reviews will be loaded here -->
            </div>
            <div class="add-review-section" id="addReviewSection" style="display: none;">
                <h3>Add Your Review</h3>
                <form id="reviewForm">
                    <div class="rating-input">
                        <span class="rating-star" data-rating="1">⭐</span>
                        <span class="rating-star" data-rating="2">⭐</span>
                        <span class="rating-star" data-rating="3">⭐</span>
                        <span class="rating-star" data-rating="4">⭐</span>
                        <span class="rating-star" data-rating="5">⭐</span>
                    </div>
                    <input type="hidden" id="selectedRating" name="rating">
                    <div class="form-group">
                        <label for="reviewComment">Your Review</label>
                        <textarea id="reviewComment" name="comment" rows="4" placeholder="Share your experience..." required></textarea>
                    </div>
                    <button type="submit" class="btn primary">Submit Review</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // View reviews buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-reviews-btn')) {
            const service = e.target.dataset.service;
            showReviewsModal(service);
        }
    });
}

function showReviewsModal(service) {
    const modal = document.querySelector('.reviews-modal');
    const title = document.getElementById('reviewsModalTitle');
    const reviewsList = document.getElementById('reviewsList');
    const addReviewSection = document.getElementById('addReviewSection');
    
    title.textContent = `${service} - Reviews`;
    reviewsList.innerHTML = '<div class="loading">Loading reviews...</div>';
    
    // Load reviews from backend
    loadServiceReviews(service).then(reviews => {
        displayReviews(reviews, reviewsList);
        
        // Show add review section if user is logged in
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            addReviewSection.style.display = 'block';
            setupReviewForm(service);
        } else {
            addReviewSection.style.display = 'none';
        }
    });
    
    modal.style.display = 'block';
    
    // Close modal
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

async function loadServiceReviews(service) {
    try {
        // First try to load from actual API
        const response = await fetch(`http://localhost:8081/api/reviews/service/${service}`);
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'SUCCESS') {
                return data.reviews || [];
            }
        }
        
        // Fallback to mock data if API fails
        return getMockReviews(service);
    } catch (error) {
        console.error('Error loading reviews:', error);
        return getMockReviews(service);
    }
}

function getMockReviews(service) {
    // Mock data based on service type
    const mockReviews = {
        'Plumbing': [
            {
                id: 1,
                customerName: 'Priya Sharma',
                rating: 5,
                comment: 'Excellent service! The plumber was very professional and fixed the issue quickly.',
                date: '2024-01-15',
                images: ['🛠️', '🚰']
            },
            {
                id: 2,
                customerName: 'Raj Kumar',
                rating: 4,
                comment: 'Good service, but was a bit delayed. The work quality was good though.',
                date: '2024-01-12',
                images: []
            }
        ],
        'Electrical': [
            {
                id: 1,
                customerName: 'Amit Verma',
                rating: 5,
                comment: 'Great electrical work! Very safe and professional.',
                date: '2024-01-14',
                images: ['⚡']
            }
        ],
        'default': [
            {
                id: 1,
                customerName: 'Customer',
                rating: 5,
                comment: 'Good service experience.',
                date: '2024-01-10',
                images: []
            }
        ]
    };
    
    return mockReviews[service] || mockReviews.default;
}

function displayReviews(reviews, container) {
    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No reviews yet</p></div>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <h4>${review.customerName}</h4>
                    <div class="stars">
                        ${'⭐'.repeat(review.rating)}
                        <span class="rating-value">${review.rating}.0</span>
                    </div>
                </div>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <p class="review-comment">${review.comment}</p>
            ${review.images && review.images.length > 0 ? `
                <div class="review-images">
                    ${review.images.map(img => `<div class="review-image">${img}</div>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function setupRatingInput() {
    const ratingStars = document.querySelectorAll('.rating-star');
    const selectedRating = document.getElementById('selectedRating');
    
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            selectedRating.value = rating;
            
            // Update star display
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            ratingStars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#fbbf24';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            const currentRating = parseInt(selectedRating.value) || 0;
            ratingStars.forEach((s, index) => {
                if (index >= currentRating) {
                    s.style.color = '#d1d5db';
                }
            });
        });
    });
}

function setupReviewForm(service) {
    const reviewForm = document.getElementById('reviewForm');
    
    reviewForm.onsubmit = function(e) {
        e.preventDefault();
        
        const userEmail = localStorage.getItem('userEmail');
        const rating = document.getElementById('selectedRating').value;
        const comment = document.getElementById('reviewComment').value;
        
        if (!rating) {
            alert('Please select a rating');
            return;
        }
        
        submitReview({
            service: service,
            userEmail: userEmail,
            rating: parseInt(rating),
            comment: comment
        });
    };
}

async function submitReview(reviewData) {
    try {
        const response = await fetch('http://localhost:8081/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData)
        });
        
        const data = await response.json();
        
        if (data.status === 'SUCCESS') {
            alert('Review submitted successfully!');
            document.getElementById('reviewForm').reset();
            document.querySelectorAll('.rating-star').forEach(star => {
                star.classList.remove('active');
            });
            
            // Reload reviews to show the new one
            const service = reviewData.service;
            const reviewsList = document.getElementById('reviewsList');
            const reviews = await loadServiceReviews(service);
            displayReviews(reviews, reviewsList);
            
        } else {
            alert('Failed to submit review: ' + data.message);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
    }
}

// Booking Modal Functions
function setupBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookBtns = document.querySelectorAll('.book-btn');
    const bookingForm = document.getElementById('bookingForm');

    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            document.getElementById('selectedService').value = service;
            
            // Update modal title with service name
            const modalTitle = modal.querySelector('h2');
            modalTitle.textContent = `Book ${service} Service`;
            
            // Check if provider is selected
            const selectedProvider = localStorage.getItem('selectedProvider');
            if (selectedProvider) {
                const provider = JSON.parse(selectedProvider);
                document.getElementById('customerName').placeholder = `Booking with ${provider.name}`;
            }
            
            modal.style.display = 'block';
            
            // Auto-focus on first input
            setTimeout(() => {
                document.getElementById('customerName').focus();
            }, 100);
        });
    });

    closeBtn.addEventListener('click', function() {
        closeBookingModal();
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeBookingModal();
        }
    });

    // Booking form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
}

function setupDateRestrictions() {
    const serviceDateInput = document.getElementById('serviceDate');
    if (serviceDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        serviceDateInput.min = today;
        
        // Set maximum date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        serviceDateInput.max = maxDate.toISOString().split('T')[0];
    }
}

function loadUserProfileForBooking() {
    const userEmail = localStorage.getItem('userEmail');
    
    // Try to load user profile to pre-fill name
    fetch(`http://localhost:8081/api/profile/user/${userEmail}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'SUCCESS' && data.profile) {
                const profile = data.profile;
                const customerNameInput = document.getElementById('customerName');
                
                if (profile.firstName && profile.lastName) {
                    customerNameInput.value = `${profile.firstName} ${profile.lastName}`;
                } else if (profile.firstName) {
                    customerNameInput.value = profile.firstName;
                }
                
                // Also pre-fill email if not already set
                const customerEmail = document.getElementById('customerEmail');
                if (!customerEmail) {
                    // Add hidden email field if not present
                    const emailField = document.createElement('input');
                    emailField.type = 'hidden';
                    emailField.id = 'customerEmail';
                    emailField.name = 'customerEmail';
                    emailField.value = userEmail;
                    document.getElementById('bookingForm').appendChild(emailField);
                }
            }
        })
        .catch(error => {
            console.log('Could not load user profile for pre-fill');
        });
}

function submitBooking() {
    const userEmail = localStorage.getItem('userEmail');
    const bookingForm = document.getElementById('bookingForm');
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    const bookingData = {
        serviceType: document.getElementById('selectedService').value,
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: userEmail || document.getElementById('customerName').value.trim() + '@example.com',
        customerPhone: document.getElementById('customerPhone').value.trim(),
        serviceDate: document.getElementById('serviceDate').value,
        serviceTime: document.getElementById('serviceTime').value,
        serviceAddress: document.getElementById('serviceAddress').value.trim()
    };

    // Validate required fields
    if (!validateBookingData(bookingData)) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
    }

    // Send to backend API
    fetch("http://localhost:8081/api/bookings", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === "SUCCESS") {
            showBookingSuccess(data);
        } else {
            showBookingError(data.message || 'Booking failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showBookingError('Network error. Please check your connection and try again.');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function validateBookingData(bookingData) {
    // Check required fields
    if (!bookingData.customerName) {
        alert('Please enter your name');
        document.getElementById('customerName').focus();
        return false;
    }
    
    if (!bookingData.customerPhone) {
        alert('Please enter your phone number');
        document.getElementById('customerPhone').focus();
        return false;
    }
    
    if (!bookingData.serviceDate) {
        alert('Please select a service date');
        document.getElementById('serviceDate').focus();
        return false;
    }
    
    if (!bookingData.serviceTime) {
        alert('Please select a service time');
        document.getElementById('serviceTime').focus();
        return false;
    }
    
    if (!bookingData.serviceAddress) {
        alert('Please enter service address');
        document.getElementById('serviceAddress').focus();
        return false;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers
    if (!phoneRegex.test(bookingData.customerPhone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        document.getElementById('customerPhone').focus();
        return false;
    }
    
    return true;
}

function showBookingSuccess(data) {
    // Create success message
    const successMessage = `
        ✅ Booking Confirmed!
        
        Service: ${document.getElementById('selectedService').value}
        Date: ${document.getElementById('serviceDate').value}
        Time: ${document.getElementById('serviceTime').value}
        Booking ID: #${data.bookingId || 'N/A'}
        
        We will contact you soon to confirm the appointment.
    `;
    
    alert(successMessage);
    
    // Close modal and reset form
    closeBookingModal();
    
    // Clear selected provider
    localStorage.removeItem('selectedProvider');
    
    // Redirect to bookings page if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        setTimeout(() => {
            if (confirm('View your bookings?')) {
                window.location.href = 'my-bookings.html';
            }
        }, 1000);
    }
}

function showBookingError(message) {
    alert(`❌ ${message}`);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    
    modal.style.display = 'none';
    bookingForm.reset();
    
    // Reset service selection
    document.getElementById('selectedService').value = '';
}

// Utility Functions
function resetFilters() {
    document.getElementById('serviceSearch').value = '';
    document.getElementById('sortBy').value = 'popularity';
    document.getElementById('ratingFilter').value = '0';
    document.getElementById('priceFilter').value = 'all';
    
    // Trigger filter application
    const event = new Event('change');
    document.getElementById('sortBy').dispatchEvent(event);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function quickBook(serviceType) {
    // Find the book button for this service and trigger click
    const bookBtn = document.querySelector(`.book-btn[data-service="${serviceType}"]`);
    if (bookBtn) {
        bookBtn.click();
    } else {
        // If button not found, manually set service and open modal
        document.getElementById('selectedService').value = serviceType;
        document.getElementById('bookingModal').style.display = 'block';
    }
}

function addCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupCardHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
}

function formatPhoneNumber() {
    const phoneInput = document.getElementById('customerPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            // Format as XXX-XXX-XXXX
            if (value.length > 6) {
                value = value.substring(0, 6) + '-' + value.substring(6);
            }
            if (value.length > 3) {
                value = value.substring(0, 3) + '-' + value.substring(3);
            }
            
            e.target.value = value;
        });
    }
}

// Initialize animations when page loads
window.addEventListener('load', addCardAnimations);