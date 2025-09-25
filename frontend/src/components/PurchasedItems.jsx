import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaDollarSign,
  FaBox,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const PurchasedItems = () => {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Load purchased items from localStorage
    const purchases = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
    setPurchasedItems(purchases);
    setFilteredItems(purchases);
  }, []);

  useEffect(() => {
    // Filter and sort items
    let filtered = purchasedItems.filter(item =>
      item.sweetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchTerm, sortBy, purchasedItems]);

  const getTotalSpent = () => {
    return purchasedItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return purchasedItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const clearPurchaseHistory = () => {
    if (window.confirm('Are you sure you want to clear your purchase history? This action cannot be undone.')) {
      localStorage.removeItem('purchasedItems');
      setPurchasedItems([]);
      setFilteredItems([]);
    }
  };

  return (
    <div className="purchased-items">
      <div className="purchased-header">
        <div className="purchased-title">
          <h1><FaShoppingBag /> My Purchases</h1>
          <p>Track your sweet purchases and order history</p>
        </div>

        {purchasedItems.length > 0 && (
          <div className="purchase-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FaBox />
              </div>
              <div className="stat-info">
                <span className="stat-number">{getTotalItems()}</span>
                <span className="stat-label">Items Purchased</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-info">
                <span className="stat-number">${getTotalSpent().toFixed(2)}</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {purchasedItems.length > 0 && (
        <div className="purchase-controls card">
          <div className="controls-grid">
            <div className="control-group">
              <label className="form-label">
                <FaSearch /> Search Purchases
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by sweet name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="control-group">
              <label className="form-label">
                <FaFilter /> Sort By
              </label>
              <select
                className="form-input form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Sweet Name</option>
                <option value="price">Price (High to Low)</option>
              </select>
            </div>

            <div className="control-group">
              <button 
                className="btn btn-danger btn-sm"
                onClick={clearPurchaseHistory}
                style={{ marginTop: '24px' }}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="purchases-content">
        {filteredItems.length === 0 ? (
          <div className="no-purchases">
            <FaShoppingBag size={64} />
            <h3>No Purchases Yet</h3>
            <p>
              {searchTerm 
                ? 'No purchases found matching your search.' 
                : 'Start shopping to see your purchase history here!'
              }
            </p>
            {searchTerm && (
              <button 
                className="btn btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="purchases-list">
            <div className="results-summary">
              <span>
                {filteredItems.length} purchase{filteredItems.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </span>
            </div>

            <div className="purchase-items">
              {filteredItems.map((item) => (
                <div key={item.id} className="purchase-card card fade-in">
                  <div className="purchase-image">
                    <img 
                      src={item.sweetImage || 'https://via.placeholder.com/120x120?text=Sweet'} 
                      alt={item.sweetName}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/120x120?text=Sweet';
                      }}
                    />
                  </div>

                  <div className="purchase-details">
                    <div className="purchase-main">
                      <h3 className="purchase-name">{item.sweetName}</h3>
                      <p className="purchase-category">
                        <FaBox /> {item.category}
                      </p>
                      <p className="purchase-description">{item.description}</p>
                    </div>

                    <div className="purchase-info">
                      <div className="purchase-quantity">
                        <strong>Quantity:</strong> {item.quantity}
                      </div>
                      <div className="purchase-price">
                        <strong>Unit Price:</strong> ${item.unitPrice.toFixed(2)}
                      </div>
                      <div className="purchase-total">
                        <strong>Total:</strong> 
                        <span className="total-price">${item.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="purchase-date">
                        <FaCalendarAlt />
                        {formatDate(item.purchaseDate)}
                      </div>
                    </div>
                  </div>

                  <div className="purchase-status">
                    <div className="status-badge purchased">
                      ✓ Purchased
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedItems;