# ServiceNest - Home Service Platform 🏠

ServiceNest is a comprehensive home service platform connecting customers with professional service providers. The platform allows customers to book various home services while enabling service providers to manage their bookings, schedule, and earnings.

## 🌟 Features

### For Customers 👤
- **Easy Booking**: Book home services in minutes
- **Service Categories**: Plumbing, Electrical, AC Service, Cleaning, Carpentry, Painting, Appliance Repair
- **Real-time Tracking**: Track service requests in real-time
- **Ratings & Reviews**: Rate and review service providers
- **Secure Payments**: Multiple payment options

### For Service Providers 🛠️
- **Smart Dashboard**: Manage bookings, schedule, and earnings
- **Schedule Management**: View and manage weekly appointments
- **Job Management**: Accept/reject job requests, update status
- **Earnings Tracking**: Monitor daily, weekly, and monthly earnings
- **Profile Management**: Professional profile with ratings and reviews

## 🏗️ Tech Stack

### Backend
- **Java 17** with Spring Boot 3.2+
- **Spring Data JPA** for database operations
- **MySQL** Database
- **RESTful APIs**
- **Maven** for dependency management

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Vanilla JavaScript** (No frameworks)
- **Responsive Design** with Flexbox/Grid
- **Font Awesome** Icons
- **Local Storage** for session management

### Database
- **MySQL** with JPA/Hibernate
- **Tables**: users, worker_profiles, bookings, services, etc.

## 📁 Project Structure

```
servicenest/
├── backend/
│   ├── src/main/java/com/servicenest/
│   │   ├── controller/          # REST Controllers
│   │   ├── model/              # Entity Classes
│   │   ├── repository/         # JPA Repositories
│   │   ├── dto/               # Data Transfer Objects
│   │   └── ServiceNestApplication.java
│   └── pom.xml
├── frontend/
│   ├── index.html             # Home/Landing Page
│   ├── login.html             # User Login
│   ├── register.html          # User Registration
│   ├── customer-dashboard.html # Customer Dashboard
│   ├── worker-dashboard.html  # Worker Dashboard
│   ├── worker-schedule.html   # Worker Schedule
│   ├── worker-jobs.html       # Worker Jobs
│   ├── worker-earnings.html   # Worker Earnings
│   ├── worker-profile.html    # Worker Profile
│   └── style.css              # Global Styles
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6+
- Modern web browser

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/servicenest.git
   cd servicenest
   ```

2. **Configure Database**
   ```sql
   CREATE DATABASE servicenest_db;
   USE servicenest_db;
   ```

3. **Update application properties**
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/servicenest_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   server.port=8081
   ```

4. **Run the application**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Open frontend files**
   - Navigate to the `frontend` folder
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     npx http-server frontend -p 3000
     ```

2. **Access the application**
   - Open browser and go to: `http://localhost:3000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'WORKER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Worker Profiles Table
```sql
CREATE TABLE worker_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    professional_title VARCHAR(255),
    experience VARCHAR(50),
    phone_number VARCHAR(20),
    service_areas TEXT,
    hourly_rate DECIMAL(10,2),
    skills TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    worker_email VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    service_time VARCHAR(50) NOT NULL,
    service_address TEXT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected', 'in-progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Worker Operations
- `GET /api/worker/dashboard/{email}` - Get worker dashboard
- `GET /api/worker/profile/{email}` - Get worker profile
- `PUT /api/worker/profile/{email}` - Update worker profile
- `GET /api/worker/earnings/{email}` - Get worker earnings
- `GET /api/worker/jobs/{email}` - Get worker jobs

### Customer Operations
- `GET /api/customer/dashboard/{email}` - Get customer dashboard
- `POST /api/bookings` - Create new booking

## 🎨 UI Pages

1. **Landing Page** (`index.html`) - Homepage with service categories
2. **Login Page** (`login.html`) - User authentication
3. **Registration Page** (`register.html`) - New user registration
4. **Customer Dashboard** (`customer-dashboard.html`) - Customer bookings and history
5. **Worker Dashboard** (`worker-dashboard.html`) - Worker overview and stats
6. **Worker Schedule** (`worker-schedule.html`) - Weekly schedule management
7. **Worker Jobs** (`worker-jobs.html`) - Job request management
8. **Worker Earnings** (`worker-earnings.html`) - Earnings and analytics
9. **Worker Profile** (`worker-profile.html`) - Professional profile management

## 🔐 Security Features

- **Role-based Access Control** (USER vs WORKER)
- **Input Validation** on all forms
- **Password Strength** indicator
- **Email Verification** for registration
- **Session Management** using Local Storage

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
heroku create servicenest-api
heroku addons:create cleardb:ignite
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
- Connect your GitHub repository
- Set build command: (none for static sites)
- Set publish directory: `frontend`
- Add environment variables if needed

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (≥1024px)
- Tablet (768px - 1023px)
- Mobile (≤767px)

## 🧪 Testing

### Backend Testing
```bash
mvn test
```

### Manual Testing Scenarios
1. User Registration (Customer/Worker)
2. User Login
3. Service Booking
4. Job Management (Accept/Reject/Complete)
5. Schedule Management
6. Profile Updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, you can email kathirselvamv82@gmail.com or create an issue in the GitHub repository.

## 🙏 Acknowledgements

- Icons by [Font Awesome](https://fontawesome.com)
- Color scheme inspired by [Tailwind CSS](https://tailwindcss.com)
- Gradients from [UI Gradients](https://uigradients.com)

## 📞 Contact

Project Maintainer: [KathirSelvam V](mailto:kathirselvamv82@gmail.com)

Project Link: [https://github.com/kathirselvamv/Servicenest](https://github.com/kathirselvamv/Servicenest)

---

**Made with ❤️ for home service solutions**
