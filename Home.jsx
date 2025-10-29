import { useState, useEffect, useContext } from 'react';
import { getPriceChanges } from '../services/api';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';

function Home() {
  const [priceChanges, setPriceChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

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
        <h1>Presyo sa Merkados</h1>
        <p className="subtitle">Real-time Agricultural Commodity Prices in NCR</p>
      {user && (
        <div className="welcome-message">
          <h2>Welcome back, {user.name}! </h2>
          <p>Ready to monitor today's market trends?</p>
        </div>
      )}
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">150+</div>
          <div className="stat-label">Commodities</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">25+</div>
          <div className="stat-label">Markets</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Daily</div>
          <div className="stat-label">Price Updates</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">DA</div>
          <div className="stat-label">Verified Data</div>
        </div>
      </div>

      <section className="price-alerts">
        <div className="section-header">
          <h2>📈 Recent Significant Price Changes</h2>
        </div>
        {loading ? (
          <div className="loading">Loading market data...</div>
        ) : priceChanges.length > 0 ? (
          <div className="alerts-list">
            {priceChanges.slice(0, 5).map((change) => (
              <div key={change.id} className={`alert ${change.is_increase ? 'increase' : 'decrease'}`}>
                <h3>{change.commodity_name}</h3>
                {change.specification && <p>{change.specification}</p>}
                <p className="category">{change.category_name}</p>
                <div className="price-info">
                  <span>₱{change.old_price} → ₱{change.new_price}</span>
                  <span className="change">
                    {change.is_increase ? '↑' : '↓'} {change.change_percentage}%
                  </span>
                </div>
                <span className="date">{new Date(change.change_date).toLocaleDateString('en-PH')}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert">
            <p>No significant price changes in the last 7 days.</p>
          </div>
        )}
      </section>

     

      <section className="quick-links">
        <Link to="/commodities" className="link-card">
          <h3>📊 Monitor Market</h3>
          <p>View comprehensive price tables for all commodities across NCR markets</p>
        </Link>
        <Link to="/search" className="link-card">
          <h3>🔍 Search Products</h3>
          <p>Find specific commodities and compare prices across different markets</p>
        </Link>
        <div className="link-card" style={{background: 'var(--light-blue)'}}>
          <h3>📈 Market Insights</h3>
          <p>Daily updated price index from Department of Agriculture</p>
        </div>
      </section>
    </div>
  );
}

export default Home;