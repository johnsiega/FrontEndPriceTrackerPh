import { useState, useEffect } from 'react';
import { getPriceChanges } from '../services/api';
import { Link } from 'react-router-dom';

function Home() {
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPriceChanges();
  }, []);

  const fetchPriceChanges = async () => {
    try {
      const response = await getPriceChanges({ days: 7, min_percentage: 5 });
      setPriceChanges(response.data.data);
    } catch (error) {
      console.error('Error fetching price changes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <header>
        <h1>PriceTrackerPH</h1>
        <p>Agricultural Commodity Price Tracking System - NCR</p>
      </header>

      <section className="price-alerts">
        <h2>Recent Price Changes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : priceChanges.length > 0 ? (
          <div className="alerts-list">
            {priceChanges.map((change) => (
              <div key={change.id} className={`alert ${change.is_increase ? 'increase' : 'decrease'}`}>
                <h3>{change.commodity_name}</h3>
                <p>{change.specification}</p>
                <p className="category">{change.category_name}</p>
                <div className="price-info">
                  <span>₱{change.old_price} → ₱{change.new_price}</span>
                  <span className="change">{change.change_percentage}%</span>
                </div>
                <span className="date">{new Date(change.change_date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No significant price changes in the last 7 days.</p>
        )}
      </section>

      <section className="quick-links">
        <Link to="/commodities" className="link-card">
          <h3>Browse Commodities</h3>
          <p>View all agricultural products</p>
        </Link>
        <Link to="/search" className="link-card">
          <h3>Search</h3>
          <p>Find specific items</p>
        </Link>
        <Link to="/upload" className="link-card">
          <h3>Upload PDF</h3>
          <p>Admin: Update prices</p>
        </Link>
      </section>
    </div>
  );
}

export default Home;