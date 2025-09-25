# 🍭 Sweet Shop Management System - React Frontend

A modern, responsive React frontend for the Sweet Shop Management System with a beautiful dark theme and comprehensive functionality.

## 📁 File Extensions

This project uses `.jsx` extensions for all React components that contain JSX syntax, following React best practices for better code organization and IDE support.

## ✨ Features

- **🔐 Authentication System**: Complete login/register with JWT token management
- **🍬 Sweet Management**: Browse, search, filter, and purchase sweets
- **👑 Admin Panel**: Full CRUD operations for sweet inventory management
- **🌙 Dark Theme**: Modern dark UI with beautiful gradients and animations  
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🛒 Shopping Cart**: Track purchases and cart items
- **🔍 Advanced Search**: Search by name, filter by category, price range
- **⚡ Real-time Updates**: Live inventory updates and stock management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spring Boot backend running on `http://localhost:8080`

### Installation

1. **Clone and navigate to the frontend directory**:
   ```bash
   cd "Sweet Shop Management System/frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoint** (optional):
   - Create a `.env` file in the root directory
   - Add your backend URL:
     ```
     REACT_APP_API_BASE_URL=http://localhost:8080/api
     ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── Login.jsx       # Login form component
│   │   ├── Register.jsx    # Registration form component  
│   │   ├── Navigation.jsx  # Navigation bar component
│   │   ├── Dashboard.jsx   # Main sweet browsing dashboard
│   │   └── AdminPanel.jsx  # Admin management panel
│   ├── services/           # API service layer
│   │   ├── config.js       # API configuration and endpoints
│   │   ├── authService.js  # Authentication API calls
│   │   └── sweetService.js # Sweet management API calls
│   ├── data/               # Sample data
│   │   └── dummyData.js    # Dummy sweets for development/fallback
│   ├── styles/             # CSS stylesheets
│   │   ├── global.css      # Global styles and dark theme
│   │   └── auth.css        # Authentication component styles
│   ├── utils/              # Utility functions
│   │   └── helpers.js      # Common helper functions
│   ├── App.jsx             # Main App component with routing
│   └── index.jsx           # React entry point
└── package.json            # Dependencies and scripts
```

## 🎨 Design Features

### Dark Theme
- **Primary Colors**: Deep navy (`#0f0f23`) with gradient accents
- **Accent Colors**: Vibrant red-pink (`#e94560`) and orange (`#f39c12`)
- **Cards**: Gradient backgrounds with subtle borders and shadows
- **Animations**: Smooth transitions, hover effects, and fade-in animations

### Responsive Layout
- **Grid System**: CSS Grid and Flexbox for responsive layouts
- **Breakpoints**: Mobile-first design with tablet and desktop optimizations
- **Navigation**: Collapsible mobile menu with hamburger icon

### Interactive Elements
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Styled inputs with focus states and validation
- **Cards**: Hover effects with elevation changes
- **Loading States**: Spinner animations and skeleton screens

## 🔧 API Integration

The frontend is designed to work with a Spring Boot backend but includes fallback dummy data:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT token

### Sweet Management Endpoints
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets with filters
- `POST /api/sweets` - Add new sweet (Admin)
- `PUT /api/sweets/:id` - Update sweet (Admin)  
- `DELETE /api/sweets/:id` - Delete sweet (Admin)
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin)

## 👤 User Roles

### Regular Users
- Browse and search sweets
- View detailed sweet information
- Purchase sweets (decreases inventory)
- Track items in cart

### Admin Users  
- All regular user permissions
- Add new sweets to inventory
- Update existing sweet details
- Delete sweets from inventory
- Restock sweet quantities
- View comprehensive admin dashboard

## 📱 Usage Examples

### User Registration/Login
1. Navigate to the registration page
2. Fill in username, email, and password
3. Submit form to create account
4. Login with credentials to access dashboard

### Browsing Sweets
1. View all available sweets on the dashboard
2. Use search bar to find specific sweets
3. Filter by category using dropdown
4. Set price range with min/max inputs
5. Click "Add to Cart" to purchase sweets

### Admin Management
1. Login with admin credentials
2. Click "Admin Panel" in navigation
3. Add new sweets using the form
4. Edit existing sweets by clicking edit button
5. Restock items by entering quantity
6. Delete sweets using delete button

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite  
- `npm run eject` - Eject from Create React App

## 🎯 Key Components

### Dashboard.js
Main user interface for browsing and purchasing sweets with search/filter functionality.

### AdminPanel.js  
Comprehensive admin interface for managing sweet inventory with CRUD operations.

### AuthService.js
Handles all authentication logic including login, logout, and token management.

### SweetService.js
Manages all sweet-related API calls with error handling and fallback logic.

## 🔐 Security Features

- JWT token-based authentication
- Protected routes with role-based access
- Automatic token refresh handling
- Secure local storage management
- Input validation and sanitization

## 🌟 Future Enhancements

- Real-time notifications
- Advanced analytics dashboard
- Multi-language support
- PWA capabilities
- Image upload functionality
- Order history tracking
- Payment integration

## 📞 Support

For questions or issues, please refer to the main project documentation or contact the development team.

---

Built with ❤️ using React, modern CSS, and best practices for a delightful user experience!