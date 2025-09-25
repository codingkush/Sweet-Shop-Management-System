import React, { useState, useEffect } from 'react';
import { sweetService } from '../services/sweetService';
import { dummySweets, categories } from '../data/dummyData';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBox,
  FaSave,
  FaTimes,
  FaEye,
  FaSearch
} from 'react-icons/fa';

const AdminPanel = ({ onBackToDashboard }) => {
  const [sweets, setSweets] = useState(dummySweets);
  const [filteredSweets, setFilteredSweets] = useState(dummySweets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'Chocolate',
    price: '',
    quantity: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [searchTerm, selectedCategory, sweets]);

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

  const filterSweets = () => {
    let filtered = sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || sweet.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredSweets(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Chocolate',
      price: '',
      quantity: '',
      description: '',
      image: ''
    });
    setShowAddForm(false);
    setEditingSweet(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.price || !formData.quantity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.price) <= 0 || parseInt(formData.quantity) < 0) {
      setError('Price must be positive and quantity cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingSweet) {
        // Update existing sweet
        try {
          await sweetService.updateSweet(editingSweet.id, sweetData);
        } catch (apiError) {
          console.log('API not available, updating locally');
        }
        
        setSweets(prevSweets =>
          prevSweets.map(sweet =>
            sweet.id === editingSweet.id ? { ...sweet, ...sweetData } : sweet
          )
        );
        setSuccess('Sweet updated successfully!');
      } else {
        // Add new sweet
        const newSweet = {
          ...sweetData,
          id: Date.now() // Generate temporary ID
        };

        try {
          const response = await sweetService.addSweet(sweetData);
          newSweet.id = response.id;
        } catch (apiError) {
          console.log('API not available, adding locally');
        }

        setSweets(prevSweets => [...prevSweets, newSweet]);
        setSuccess('Sweet added successfully!');
      }

      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save sweet. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description,
      image: sweet.image || ''
    });
    setEditingSweet(sweet);
    setShowAddForm(true);
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) {
      return;
    }

    setLoading(true);
    try {
      try {
        await sweetService.deleteSweet(sweetId);
      } catch (apiError) {
        console.log('API not available, deleting locally');
      }

      setSweets(prevSweets => prevSweets.filter(sweet => sweet.id !== sweetId));
      setSuccess('Sweet deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete sweet. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (sweetId, additionalQuantity) => {
    if (!additionalQuantity || additionalQuantity <= 0) {
      setError('Please enter a valid quantity to restock');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    try {
      try {
        await sweetService.restockSweet(sweetId, parseInt(additionalQuantity));
      } catch (apiError) {
        console.log('API not available, restocking locally');
      }

      setSweets(prevSweets =>
        prevSweets.map(sweet =>
          sweet.id === sweetId
            ? { ...sweet, quantity: sweet.quantity + parseInt(additionalQuantity) }
            : sweet
        )
      );
      setSuccess('Sweet restocked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to restock sweet. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">
          <h1>🔧 Admin Panel</h1>
          <p>Manage your sweet inventory</p>
        </div>
        <button className="btn btn-secondary" onClick={onBackToDashboard}>
          <FaEye /> View Store
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Controls */}
      <div className="admin-controls card">
        <div className="controls-grid">
          <div className="control-group">
            <label className="form-label">
              <FaSearch /> Search Sweets
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="control-group">
            <label className="form-label">Filter by Category</label>
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

          <div className="control-group">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus /> Add New Sweet
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="sweet-form card">
          <div className="form-header">
            <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
            <button className="btn btn-secondary btn-sm" onClick={resetForm}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sweet name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Price * ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the sweet..."
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FaSave /> {editingSweet ? 'Update Sweet' : 'Add Sweet'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sweets Table */}
      <div className="admin-table card">
        <div className="table-header">
          <h3>Sweet Inventory ({filteredSweets.length} items)</h3>
        </div>

        <div className="table-container">
          <table className="sweets-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSweets.map(sweet => (
                <SweetRow
                  key={sweet.id}
                  sweet={sweet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRestock={handleRestock}
                  loading={loading}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredSweets.length === 0 && !loading && (
          <div className="no-results">
            <p>No sweets found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Sweet Row Component
const SweetRow = ({ sweet, onEdit, onDelete, onRestock, loading }) => {
  const [restockQuantity, setRestockQuantity] = useState('');
  const [showRestockInput, setShowRestockInput] = useState(false);

  const handleRestock = () => {
    onRestock(sweet.id, restockQuantity);
    setRestockQuantity('');
    setShowRestockInput(false);
  };

  return (
    <tr className={sweet.quantity === 0 ? 'out-of-stock-row' : ''}>
      <td>
        <img
          src={sweet.image || 'https://via.placeholder.com/60x60?text=Sweet'}
          alt={sweet.name}
          className="table-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/60x60?text=Sweet';
          }}
        />
      </td>
      <td>
        <div className="sweet-name-cell">
          <strong>{sweet.name}</strong>
          <small>{sweet.description}</small>
        </div>
      </td>
      <td>
        <span className="category-badge">{sweet.category}</span>
      </td>
      <td>
        <strong>${sweet.price.toFixed(2)}</strong>
      </td>
      <td>
        <div className="stock-cell">
          <span className={sweet.quantity === 0 ? 'out-of-stock' : sweet.quantity < 5 ? 'low-stock' : ''}>
            {sweet.quantity} units
          </span>
          {sweet.quantity < 10 && (
            <small className="stock-warning">
              {sweet.quantity === 0 ? 'Out of stock!' : 'Low stock'}
            </small>
          )}
        </div>
      </td>
      <td>
        <div className="action-buttons">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(sweet)}
            disabled={loading}
            title="Edit"
          >
            <FaEdit />
          </button>
          
          {showRestockInput ? (
            <div className="restock-input">
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="Qty"
                min="1"
                className="form-input"
                style={{ width: '60px', fontSize: '12px' }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleRestock}
                disabled={loading || !restockQuantity}
              >
                <FaSave />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowRestockInput(false);
                  setRestockQuantity('');
                }}
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowRestockInput(true)}
              disabled={loading}
              title="Restock"
            >
              <FaBox />
            </button>
          )}
          
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(sweet.id)}
            disabled={loading}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminPanel;