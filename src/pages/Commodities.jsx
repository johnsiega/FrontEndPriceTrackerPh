import { useState, useEffect } from 'react';
import { getAllCommodities, getCategories } from '../services/api';

function Commodities() {
  const [commodities, setCommodities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: '',
    market_type: '',
    limit: 200,  // Increased to show all
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
      console.log('Fetching categories...');
      const response = await getCategories();
      console.log('Categories response:', response.data);
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
      console.log('Fetching commodities with filters:', filters);
      const response = await getAllCommodities(filters);
      console.log('Commodities response:', response.data);
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

  return (
    <div className="commodities">
      <h1>All Commodities</h1>

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div className="filters">
        <select 
          onChange={(e) => handleFilterChange('category_id', e.target.value)} 
          value={filters.category_id}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.commodity_count})
            </option>
          ))}
        </select>

        <select 
          onChange={(e) => handleFilterChange('market_type', e.target.value)} 
          value={filters.market_type}
        >
          <option value="">All Markets</option>
          <option value="wet">Wet Market</option>
          <option value="dry">Dry Goods</option>
        </select>

        <button onClick={() => setFilters({ category_id: '', market_type: '', limit: 200 })}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p>Loading commodities...</p>
      ) : commodities.length > 0 ? (
        <>
          <div className="commodity-grid">
            {commodities.map((item) => (
              <div key={item.id} className="commodity-card">
                <h3>{item.name}</h3>
                {item.specification && <p className="spec">{item.specification}</p>}
                <p className="category">{item.category_name}</p>
                <p className="price">₱{item.latest_price}/{item.unit}</p>
                <span className="date">
                  {new Date(item.price_date).toLocaleDateString('en-PH')}
                </span>
              </div>
            ))}
          </div>
          <p className="count">Showing {commodities.length} items</p>
        </>
      ) : (
        <p>No commodities found. Try adjusting filters or check if data has been uploaded.</p>
      )}
    </div>
  );
}

export default Commodities;