import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaDollarSign,
  FaBox,
  FaSearch,
  FaFilter,
  FaUser,
  FaChartLine,
  FaHeart,
  FaStar,
  FaGift,
  FaDownload,
  FaSort
} from 'react-icons/fa';
import { authService } from '../services/authService';
import '../styles/enhanced-purchased.css';

const EnhancedPurchasedItems = () => {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user info
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    
    // Load purchased items from localStorage
    const purchases = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
    
    // Add mock user data if not present (for demo purposes)
    const enhancedPurchases = purchases.map(item => ({
      ...item,
      userName: item.userName || user?.username || 'Guest User',
      userRole: item.userRole || user?.role || 'USER',
      rating: item.rating || Math.floor(Math.random() * 2) + 4, // 4-5 star ratings
      isFavorite: item.isFavorite || Math.random() > 0.7
    }));
    
    setPurchasedItems(enhancedPurchases);
    setFilteredItems(enhancedPurchases);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    // Filter and sort items
    let filtered = purchasedItems.filter(item => {
      const matchesSearch = item.sweetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.purchaseDate) - new Date(a.purchaseDate);
        case 'oldest':
          return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        case 'name':
          return a.sweetName.localeCompare(b.sweetName);
        case 'price':
          return b.totalPrice - a.totalPrice;
        case 'quantity':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchTerm, sortBy, selectedCategory, purchasedItems]);

  const getTotalSpent = () => {
    return purchasedItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return purchasedItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCategories = () => {
    const categories = [...new Set(purchasedItems.map(item => item.category))];
    return categories;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      />
    ));
  };

  const generateReceipt = () => {
    // Mock function - in real app, this would generate a PDF
    alert('Receipt download functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner-large">
          <FaShoppingBag className="loading-icon" />
        </div>
        <p className="loading-text">Loading your purchase history...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-purchased-container">
      <div className="background-gradient">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="user-greeting">
            <div className="user-avatar">
              <FaUser className="avatar-icon" />
            </div>
            <div className="greeting-text">
              <h1>Welcome back, <span className="user-name">{currentUser?.username || 'Guest'}</span>!</h1>
              <p className="user-subtitle">Here's your sweet shopping history</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={generateReceipt}>
              <FaDownload />
              <span>Export History</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaShoppingBag />
            </div>
            <div className="stat-content">
              <h3>{purchasedItems.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>{getTotalItems()}</h3>
              <p>Items Purchased</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>${getTotalSpent().toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{getCategories().length}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search your purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="sort-group">
            <FaSort className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price High-Low</option>
              <option value="quantity">Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="items-section">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <FaShoppingBag className="empty-icon" />
            <h3>No purchases found</h3>
            <p>
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : "You haven't made any purchases yet. Start shopping to see your history here!"
              }
            </p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item, index) => (
              <div key={index} className="purchase-card">
                <div className="card-header">
                  <div className="item-info">
                    <h3 className="item-name">{item.sweetName}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  <div className="item-actions">
                    {item.isFavorite && <FaHeart className="favorite-icon" />}
                    <span className="item-price">${item.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="purchase-details">
                    <div className="detail-item">
                      <FaBox className="detail-icon" />
                      <span>Quantity: {item.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>{formatDate(item.purchaseDate)}</span>
                    </div>
                    <div className="detail-item">
                      <FaUser className="detail-icon" />
                      <span>Ordered by: {item.userName}</span>
                    </div>
                  </div>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(item.rating)}
                    </div>
                    <span className="rating-text">({item.rating}/5)</span>
                  </div>
                </div>
                
                <div className="card-footer">
                  <button className="action-btn secondary">
                    <FaGift />
                    Reorder
                  </button>
                  <button className="action-btn primary">
                    <FaStar />
                    Rate Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPurchasedItems;