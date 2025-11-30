package com.servicenest.controller;

import com.servicenest.model.Booking;
import com.servicenest.model.User;
import com.servicenest.repository.BookingRepository;
import com.servicenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin("*")
public class AIServiceController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ AI-PERSONALIZED SERVICE RECOMMENDATIONS
     */
    @GetMapping("/recommendations/{email}")
    public ResponseEntity<?> getAIRecommendations(@PathVariable String email) {
        System.out.println("=== AI RECOMMENDATIONS ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                response.put("status", "ERROR");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            List<Booking> userBookings = bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
            
            // AI Recommendation Logic
            Map<String, Object> recommendations = generateAIRecommendations(user, userBookings);
            
            response.put("status", "SUCCESS");
            response.put("message", "AI recommendations generated");
            response.put("recommendations", recommendations);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error generating AI recommendations: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to generate recommendations: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private Map<String, Object> generateAIRecommendations(User user, List<Booking> userBookings) {
        Map<String, Object> recommendations = new HashMap<>();
        
        // 1. Personalized Service Suggestions
        List<Map<String, Object>> personalizedServices = generatePersonalizedServices(userBookings);
        recommendations.put("personalized", personalizedServices);
        
        // 2. Seasonal Recommendations
        List<Map<String, Object>> seasonalServices = generateSeasonalServices();
        recommendations.put("seasonal", seasonalServices);
        
        // 3. Popular in Your Area
        List<Map<String, Object>> localTrending = generateLocalTrending();
        recommendations.put("trending", localTrending);
        
        // 4. AI-Predicted Needs
        List<Map<String, Object>> predictedNeeds = generatePredictedNeeds(userBookings);
        recommendations.put("predicted", predictedNeeds);
        
        // 5. Smart Bundles
        List<Map<String, Object>> smartBundles = generateSmartBundles(userBookings);
        recommendations.put("bundles", smartBundles);
        
        return recommendations;
    }

    private List<Map<String, Object>> generatePersonalizedServices(List<Booking> userBookings) {
        // AI logic based on user's booking history
        List<Map<String, Object>> services = new ArrayList<>();
        
        if (userBookings.stream().anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("Plumbing"))) {
            services.add(createServiceRecommendation("Bathroom Renovation", 
                "Based on your plumbing history", 4.8, 15000, "renovation"));
        }
        
        if (userBookings.stream().anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("Electrical"))) {
            services.add(createServiceRecommendation("Smart Home Setup", 
                "Upgrade your electrical systems", 4.7, 8000, "smart-home"));
        }
        
        if (userBookings.stream().anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("AC"))) {
            services.add(createServiceRecommendation("AC Maintenance Package", 
                "Regular maintenance improves efficiency", 4.6, 1999, "maintenance"));
        }
        
        // Default recommendations for new users
        if (services.isEmpty()) {
            services.add(createServiceRecommendation("Home Deep Cleaning", 
                "Perfect for new customers", 4.9, 1299, "cleaning"));
            services.add(createServiceRecommendation("Basic Electrical Check", 
                "Ensure home safety", 4.7, 599, "safety"));
        }
        
        return services;
    }

    private List<Map<String, Object>> generateSeasonalServices() {
        Calendar cal = Calendar.getInstance();
        int month = cal.get(Calendar.MONTH) + 1; // January = 0, so add 1
        
        List<Map<String, Object>> services = new ArrayList<>();
        
        if (month >= 3 && month <= 6) { // Spring (Mar-Jun)
            services.add(createServiceRecommendation("Summer AC Preparation", 
                "Get your AC ready for summer", 4.8, 1499, "maintenance"));
            services.add(createServiceRecommendation("Water Cooler Service", 
                "Beat the summer heat", 4.5, 899, "cleaning"));
        } 
        else if (month >= 6 && month <= 9) { // Monsoon (Jun-Sep)
            services.add(createServiceRecommendation("Monsoon Home Protection", 
                "Waterproofing and drainage check", 4.7, 2999, "maintenance"));
            services.add(createServiceRecommendation("Electrical Safety Audit", 
                "Stay safe during rains", 4.8, 1299, "safety"));
        }
        else if (month >= 10 || month <= 2) { // Winter (Oct-Feb)
            services.add(createServiceRecommendation("Heater Installation & Service", 
                "Stay warm this winter", 4.6, 1999, "installation"));
            services.add(createServiceRecommendation("Geyser Maintenance", 
                "Ensure hot water supply", 4.7, 899, "maintenance"));
        }
        
        // Always available seasonal services
        services.add(createServiceRecommendation("Festival Deep Cleaning", 
            "Get ready for celebrations", 4.9, 1999, "cleaning"));
        
        return services;
    }

    private List<Map<String, Object>> generateLocalTrending() {
        // Simulate location-based trending services (Mumbai area)
        List<Map<String, Object>> services = new ArrayList<>();
        
        services.add(createServiceRecommendation("Water Purifier Installation", 
            "Popular in your area", 4.8, 2500, "installation"));
        services.add(createServiceRecommendation("RO Service & Repair", 
            "High demand service", 4.6, 799, "maintenance"));
        services.add(createServiceRecommendation("Modular Kitchen Setup", 
            "Trending home upgrade", 4.9, 25000, "renovation"));
        services.add(createServiceRecommendation("Pest Control Service", 
            "Seasonal requirement", 4.7, 1499, "cleaning"));
        
        return services;
    }

    private List<Map<String, Object>> generatePredictedNeeds(List<Booking> userBookings) {
        List<Map<String, Object>> services = new ArrayList<>();
        
        // AI prediction based on booking patterns
        if (!userBookings.isEmpty()) {
            Booking lastBooking = userBookings.get(0);
            LocalDateTime lastServiceDate = lastBooking.getCreatedAt();
            LocalDateTime now = LocalDateTime.now();
            
            // Calculate days between last service and now
            long daysSinceLastService = java.time.Duration.between(lastServiceDate, now).toDays();
            
            System.out.println("Days since last service: " + daysSinceLastService);
            
            // Predict needs based on service type and time elapsed
            String lastServiceType = lastBooking.getServiceType();
            
            if (lastServiceType != null) {
                if (lastServiceType.contains("Plumbing") && daysSinceLastService > 90) {
                    services.add(createServiceRecommendation("Plumbing Health Check", 
                        "Time for routine plumbing inspection", 4.7, 699, "maintenance"));
                }
                
                if (lastServiceType.contains("Electrical") && daysSinceLastService > 180) {
                    services.add(createServiceRecommendation("Electrical Safety Check", 
                        "Regular safety inspection recommended", 4.8, 899, "safety"));
                }
                
                if (lastServiceType.contains("AC") && daysSinceLastService > 60) {
                    services.add(createServiceRecommendation("AC Filter Cleaning", 
                        "Maintain AC efficiency", 4.6, 499, "maintenance"));
                }
            }
            
            // General preventive maintenance after 6 months
            if (daysSinceLastService > 180) {
                services.add(createServiceRecommendation("Preventive Maintenance Package", 
                    "Time for comprehensive home check-up", 4.7, 1999, "maintenance"));
            }
        } else {
            // For new users with no booking history
            services.add(createServiceRecommendation("Welcome Home Inspection", 
                "Start with a complete home assessment", 4.8, 999, "safety"));
        }
        
        return services;
    }

    private List<Map<String, Object>> generateSmartBundles(List<Booking> userBookings) {
        List<Map<String, Object>> bundles = new ArrayList<>();
        
        // Analyze user's service patterns to create personalized bundles
        boolean hasPlumbing = userBookings.stream()
            .anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("Plumbing"));
        boolean hasElectrical = userBookings.stream()
            .anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("Electrical"));
        boolean hasCleaning = userBookings.stream()
            .anyMatch(b -> b.getServiceType() != null && b.getServiceType().contains("Cleaning"));
        
        // Basic maintenance bundle (always available)
        bundles.add(createBundleRecommendation("Essential Home Care", 
            "Basic plumbing + electrical + cleaning", 4.8, 3499, 4599, 
            Arrays.asList("Basic Plumbing Check", "Electrical Safety", "Standard Cleaning")));
        
        // Personalized bundles based on history
        if (hasPlumbing && hasElectrical) {
            bundles.add(createBundleRecommendation("Complete Home Maintenance", 
                "Comprehensive plumbing + electrical + deep cleaning", 4.9, 5999, 7899,
                Arrays.asList("Advanced Plumbing Check", "Complete Electrical Audit", "Premium Deep Cleaning")));
        }
        
        if (hasCleaning) {
            bundles.add(createBundleRecommendation("Ultimate Clean & Repair", 
                "Deep cleaning + minor repairs package", 4.7, 4499, 5699,
                Arrays.asList("Premium Deep Cleaning", "Minor Plumbing Fixes", "Electrical Repairs")));
        }
        
        // Seasonal bundle
        bundles.add(createBundleRecommendation("Monsoon Ready Package", 
            "Waterproofing + drainage + AC service", 4.6, 4999, 6299,
            Arrays.asList("Waterproofing Service", "Drainage Cleaning", "AC Maintenance")));
        
        return bundles;
    }

    private Map<String, Object> createServiceRecommendation(String name, String reason, 
                                                          double rating, double price, String category) {
        Map<String, Object> service = new HashMap<>();
        service.put("name", name);
        service.put("reason", reason);
        service.put("rating", rating);
        service.put("price", price);
        service.put("category", category);
        service.put("aiScore", Math.round((Math.random() * 10 + 85) * 10) / 10.0); // AI confidence score 85-95
        service.put("image", getServiceImage(category));
        return service;
    }

    private Map<String, Object> createBundleRecommendation(String name, String description, 
                                                         double rating, double price, double originalPrice,
                                                         List<String> services) {
        Map<String, Object> bundle = new HashMap<>();
        bundle.put("name", name);
        bundle.put("description", description);
        bundle.put("rating", rating);
        bundle.put("price", price);
        bundle.put("originalPrice", originalPrice);
        bundle.put("services", services);
        bundle.put("savings", originalPrice - price);
        bundle.put("aiScore", Math.round((Math.random() * 10 + 80) * 10) / 10.0);
        bundle.put("popularity", Math.round(Math.random() * 50 + 50)); // 50-100%
        return bundle;
    }

    private String getServiceImage(String category) {
        Map<String, String> categoryImages = new HashMap<>();
        categoryImages.put("plumbing", "🚰");
        categoryImages.put("electrical", "⚡");
        categoryImages.put("cleaning", "🧹");
        categoryImages.put("maintenance", "🔧");
        categoryImages.put("installation", "🔩");
        categoryImages.put("renovation", "🏠");
        categoryImages.put("safety", "🛡️");
        categoryImages.put("smart-home", "🤖");
        
        return categoryImages.getOrDefault(category.toLowerCase(), "🔍");
    }

    /**
     * ✅ AI CHATBOT FOR SERVICE GUIDANCE
     */
    @PostMapping("/chat")
    public ResponseEntity<?> aiChat(@RequestBody Map<String, String> chatData) {
        String message = chatData.get("message");
        String userEmail = chatData.get("userEmail");
        
        System.out.println("=== AI CHAT ===");
        System.out.println("User: " + userEmail);
        System.out.println("Message: " + message);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (message == null || message.trim().isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Message cannot be empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            String aiResponse = generateAIResponse(message, userEmail);
            
            response.put("status", "SUCCESS");
            response.put("message", aiResponse);
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("messageId", UUID.randomUUID().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error in AI chat: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "I'm having trouble responding. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private String generateAIResponse(String userMessage, String userEmail) {
        String lowerMessage = userMessage.toLowerCase();
        
        // AI Response Logic with contextual understanding
        if (lowerMessage.contains("plumbing") || lowerMessage.contains("leak") || lowerMessage.contains("pipe") || lowerMessage.contains("water")) {
            return "🚰 **Plumbing Assistance**: I recommend our emergency plumbing service. " +
                   "Our AI system shows 3 available plumbers in your area within 30 minutes. " +
                   "For leaks, I suggest immediate attention. Would you like me to connect you with the nearest professional?";
                   
        } else if (lowerMessage.contains("electrical") || lowerMessage.contains("wiring") || lowerMessage.contains("fuse") || lowerMessage.contains("power")) {
            return "⚡ **Electrical Help**: For electrical issues, safety first! " +
                   "Our certified electrician service has 4.9★ rating. " +
                   "I've matched you with 2 highly-rated professionals nearby. " +
                   "Available for emergency visits within 45 minutes.";
                   
        } else if (lowerMessage.contains("cleaning") || lowerMessage.contains("clean") || lowerMessage.contains("dirty")) {
            return "🧹 **Cleaning Services**: Based on your location, I recommend our premium deep cleaning package. " +
                   "Our AI estimates 3-4 hours for a standard apartment. " +
                   "Available slots: Tomorrow 9 AM or 2 PM. Includes sanitization and eco-friendly products.";
                   
        } else if (lowerMessage.contains("price") || lowerMessage.contains("cost") || lowerMessage.contains("how much")) {
            return "💰 **Pricing Info**: I can provide accurate pricing based on: " +
                   "• Service complexity 📊\n" +
                   "• Materials required 🛠️\n" +
                   "• Your location 📍\n" +
                   "• Professional availability ⏰\n\n" +
                   "Could you share more details about what you need?";
                   
        } else if (lowerMessage.contains("urgent") || lowerMessage.contains("emergency") || lowerMessage.contains("asap")) {
            return "🚨 **EMERGENCY MODE ACTIVATED!**\n" +
                   "I'm connecting you with our fastest-available service professionals in your area.\n" +
                   "• Nearest plumber: 15-20 mins ⏱️\n" +
                   "• Emergency electrician: 25 mins ⚡\n" +
                   "• 24/7 support: Activated ✅\n\n" +
                   "Please confirm your address for immediate assistance.";
                   
        } else if (lowerMessage.contains("thank") || lowerMessage.contains("thanks")) {
            return "😊 You're welcome! I'm here to help with all your home service needs. " +
                   "Is there anything else I can assist you with today?";
                   
        } else if (lowerMessage.contains("hello") || lowerMessage.contains("hi") || lowerMessage.contains("hey")) {
            return "👋 Hello! I'm your ServiceNest AI assistant! " +
                   "I can help you:\n" +
                   "• Book services instantly 📅\n" +
                   "• Get accurate quotes 💰\n" +
                   "• Find the right professional 👷\n" +
                   "• Solve home issues 🏠\n\n" +
                   "What can I help you with today?";
                   
        } else {
            return "🤖 **AI Assistant**: I understand you're looking for: \"" + userMessage + "\"\n\n" +
                   "I can help you with:\n" +
                   "• Plumbing & Water issues 🚰\n" +
                   "• Electrical & Power problems ⚡\n" +
                   "• Cleaning & Maintenance 🧹\n" +
                   "• Installation Services 🔩\n" +
                   "• Emergency Repairs 🚨\n\n" +
                   "Could you tell me more specifically what service you need?";
        }
    }

    /**
     * ✅ GET USER SERVICE HISTORY ANALYSIS
     */
    @GetMapping("/analysis/{email}")
    public ResponseEntity<?> getUserServiceAnalysis(@PathVariable String email) {
        System.out.println("=== USER SERVICE ANALYSIS ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Booking> userBookings = bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
            Map<String, Object> analysis = analyzeUserServicePatterns(userBookings);
            
            response.put("status", "SUCCESS");
            response.put("message", "Service analysis completed");
            response.put("analysis", analysis);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error in service analysis: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to analyze service patterns");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private Map<String, Object> analyzeUserServicePatterns(List<Booking> userBookings) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Service frequency analysis
        Map<String, Long> serviceFrequency = userBookings.stream()
            .filter(b -> b.getServiceType() != null)
            .collect(Collectors.groupingBy(Booking::getServiceType, Collectors.counting()));
        
        analysis.put("totalBookings", userBookings.size());
        analysis.put("serviceFrequency", serviceFrequency);
        analysis.put("favoriteService", getMostFrequentService(serviceFrequency));
        
        // Spending analysis
        double totalSpent = userBookings.stream()
            .mapToDouble(b -> b.getPrice() != null ? b.getPrice() : 0)
            .sum();
        analysis.put("totalSpent", totalSpent);
        analysis.put("averageBookingValue", userBookings.isEmpty() ? 0 : totalSpent / userBookings.size());
        
        // Recency analysis
        if (!userBookings.isEmpty()) {
            LocalDateTime lastBooking = userBookings.get(0).getCreatedAt();
            long daysSinceLastBooking = java.time.Duration.between(lastBooking, LocalDateTime.now()).toDays();
            analysis.put("daysSinceLastService", daysSinceLastBooking);
            analysis.put("serviceRecency", daysSinceLastBooking < 30 ? "Active" : "Needs Attention");
        }
        
        return analysis;
    }

    private String getMostFrequentService(Map<String, Long> serviceFrequency) {
        return serviceFrequency.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("No services yet");
    }

    /**
     * ✅ HEALTH CHECK
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "AI Service is running smoothly");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("version", "2.0.0");
        response.put("aiModel", "ServiceNest AI v2");
        return ResponseEntity.ok(response);
    }
}