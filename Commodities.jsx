import { useState, useEffect } from 'react';
import { getAllCommodities, getCategories } from '../services/api';

function Commodities() {
  const [commodities, setCommodities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: '',
    market_type: '',
    location: '',
    date_from: '',
    date_to: '',
    limit: 200,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCommodities();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchCommodities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCommodities(filters);
      setCommodities(response.data.data);
    } catch (error) {
      console.error('Error fetching commodities:', error);
      setError('Failed to load commodities. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleExport = () => {
    // Export functionality can be implemented later
    alert('Export feature coming soon!');
  };

  return (
    <div className="commodities">
      <h1>Monitor Market</h1>
      <p className="page-subtitle">Real-time commodity prices across NCR markets</p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Advanced Filters */}
      <div className="advanced-filters">
        <div className="filter-group">
          <label>Category</label>
          <select 
            onChange={(e) => handleFilterChange('category_id', e.target.value)} 
            value={filters.category_id}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Market Type</label>
          <select 
            onChange={(e) => handleFilterChange('market_type', e.target.value)} 
            value={filters.market_type}
          >
            <option value="">All Markets</option>
            <option value="wet">Wet Market</option>
            <option value="dry">Dry Goods</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input 
            type="date"
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
            value={filters.date_from}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input 
            type="date"
            onChange={(e) => handleFilterChange('date_to', e.target.value)}
            value={filters.date_to}
          />
        </div>

        <div className="filter-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setFilters({
              category_id: '',
              market_type: '',
              location: '',
              date_from: '',
              date_to: '',
              limit: 200
            })}
          >
            Clear Filters
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            Export Data
          </button>
        </div>
      </div>

      {/* Commodities Table */}
      {loading ? (
        <div className="loading">Loading market data...</div>
      ) : commodities.length > 0 ? (
        <div className="table-container">
          <table className="commodities-table">
            <thead>
              <tr>
                <th>Commodity</th>
                <th>Specification</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Category</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {commodities.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.specification || 'N/A'}</td>
                  <td>{item.unit}</td>
                  <td className="price">
                    <strong>₱{item.latest_price}</strong>
                  </td>
                  <td>{item.category_name}</td>
                  <td>{new Date(item.price_date).toLocaleDateString('en-PH')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert">
          <p>No commodities found. Try adjusting filters or check if data has been uploaded.</p>
        </div>
      )}
    </div>
  );
}

export default Commodities;