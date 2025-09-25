import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/sweetService';
import { dummySweets, categories } from '../data/dummyData';
import { 
  FaSearch, 
  FaFilter, 
  FaShoppingCart, 
  FaPlus,
  FaTag,
  FaBoxOpen
} from 'react-icons/fa';

const Dashboard = ({ onSwitchToAdmin }) => {
  const [sweets, setSweets] = useState(dummySweets);
  const [filteredSweets, setFilteredSweets] = useState(dummySweets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);

  // Load sweets from API (fallback to dummy data)
  useEffect(() => {
    loadSweets();
    loadPurchasedItems();
  }, []);

  // Filter sweets when search criteria change
  useEffect(() => {
    filterSweets();
  }, [searchTerm, selectedCategory, priceRange, sweets]);

  const loadSweets = async () => {
    setLoading(true);
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (err) {
      console.log('Using dummy data as fallback');
      setSweets(dummySweets);
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedItems = () => {
    const purchases = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
    setPurchasedItems(purchases);
  };

  const filterSweets = () => {
    let filtered = sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sweet.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || sweet.category === selectedCategory;
      const matchesPrice = (!priceRange.min || sweet.price >= parseFloat(priceRange.min)) &&
                          (!priceRange.max || sweet.price <= parseFloat(priceRange.max));
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    setLoading(true);
    setError('');
    setSuccess('');

    const sweet = sweets.find(s => s.id === sweetId);
    if (!sweet || sweet.quantity < quantity) {
      setError('Insufficient stock for this purchase.');
      setLoading(false);
      return;
    }

    try {
      // Try API first, fallback to local update
      try {
        await sweetService.purchaseSweet(sweetId, quantity);
      } catch (apiError) {
        console.log('API not available, updating locally');
      }

      // Update local state
      setSweets(prevSweets =>
        prevSweets.map(s =>
          s.id === sweetId
            ? { ...s, quantity: Math.max(0, s.quantity - quantity) }
            : s
        )
      );

      // Add to purchased items
      const purchaseRecord = {
        id: Date.now() + Math.random(),
        sweetId: sweet.id,
        sweetName: sweet.name,
        category: sweet.category,
        description: sweet.description,
        sweetImage: sweet.image,
        unitPrice: sweet.price,
        quantity: quantity,
        totalPrice: sweet.price * quantity,
        purchaseDate: new Date().toISOString(),
        userId: localStorage.getItem('userId')
      };

      const existingPurchases = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
      const updatedPurchases = [purchaseRecord, ...existingPurchases];
      localStorage.setItem('purchasedItems', JSON.stringify(updatedPurchases));
      setPurchasedItems(updatedPurchases);

      setSuccess(`Successfully purchased ${quantity} ${sweet.name}${quantity > 1 ? 's' : ''}!`);
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError('Failed to purchase sweet. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setPriceRange({ min: '', max: '' });
  };

  const getTotalPurchasedToday = () => {
    const today = new Date().toDateString();
    return purchasedItems.filter(item => 
      new Date(item.purchaseDate).toDateString() === today
    ).length;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>🍭 Sweet Collection</h1>
          <p>Discover our delicious variety of sweets and treats</p>
        </div>
        
        {getTotalPurchasedToday() > 0 && (
          <div className="purchase-summary">
            <FaShoppingCart />
            <span>{getTotalPurchasedToday()} items purchased today</span>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters */}
      <div className="filters-section card">
        <div className="filters-header">
          <h3><FaFilter /> Filters</h3>
          {(searchTerm || selectedCategory !== 'All Categories' || priceRange.min || priceRange.max) && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        <div className="filters-grid">
          {/* Search */}
          <div className="filter-group">
            <label className="form-label">
              <FaSearch /> Search
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="filter-group">
            <label className="form-label">
              <FaTag /> Category
            </label>
            <select
              className="form-input form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group price-range">
            <label className="form-label">Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                min="0"
                step="0.01"
              />
              <span>-</span>
              <input
                type="number"
                className="form-input"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span>{filteredSweets.length} sweet{filteredSweets.length !== 1 ? 's' : ''} found</span>
        {window.localStorage.getItem('userRole') === 'ADMIN' && (
          <button 
            className="btn btn-primary" 
            onClick={() => onSwitchToAdmin && onSwitchToAdmin()}
          >
            <FaPlus /> Add New Sweet
          </button>
        )}
      </div>

      {/* Sweets Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading"></div>
          <p>Loading sweets...</p>
        </div>
      ) : (
        <div className="sweets-grid">
          {filteredSweets.map(sweet => (
            <div key={sweet.id} className="sweet-card card fade-in">
              <div className="sweet-image">
                <img 
                  src={sweet.image || 'https://via.placeholder.com/300x300?text=Sweet'} 
                  alt={sweet.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Sweet';
                  }}
                />
                <div className="sweet-category">
                  <FaTag /> {sweet.category}
                </div>
              </div>

              <div className="sweet-info">
                <h3 className="sweet-name">{sweet.name}</h3>
                <p className="sweet-description">{sweet.description}</p>

                <div className="sweet-details">
                  <div className="sweet-price">
                    <strong>${sweet.price.toFixed(2)}</strong>
                  </div>
                  <div className="sweet-stock">
                    <FaBoxOpen />
                    <span className={sweet.quantity === 0 ? 'out-of-stock' : ''}>
                      {sweet.quantity === 0 ? 'Out of Stock' : `${sweet.quantity} in stock`}
                    </span>
                  </div>
                </div>

                <div className="sweet-actions">
                  <div className="purchase-controls">
                    <select 
                      className="quantity-select"
                      defaultValue="1"
                      disabled={sweet.quantity === 0}
                      onChange={(e) => {
                        e.target.setAttribute('data-quantity', e.target.value);
                      }}
                    >
                      {[...Array(Math.min(sweet.quantity, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      className={`btn btn-primary sweet-purchase ${sweet.quantity === 0 ? 'disabled' : ''}`}
                      onClick={(e) => {
                        const quantity = parseInt(e.target.parentElement.querySelector('.quantity-select')?.value || '1');
                        handlePurchase(sweet.id, quantity);
                      }}
                      disabled={sweet.quantity === 0 || loading}
                    >
                      <FaShoppingCart />
                      {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredSweets.length === 0 && !loading && (
        <div className="no-results">
          <FaSearch size={48} />
          <h3>No sweets found</h3>
          <p>Try adjusting your search criteria or browse all categories.</p>
          <button className="btn btn-primary" onClick={clearFilters}>
            View All Sweets
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;