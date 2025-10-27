import { useState } from 'react';
import { searchCommodities } from '../services/api';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.length < 2) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await searchCommodities(query);
      setResults(response.data.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <h1>Search Commodities</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for commodity (e.g., tomato, chicken, rice)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching...</p>}

      {searched && !loading && (
        <div className="results">
          <h2>Results for "{query}"</h2>
          {results.length > 0 ? (
            <div className="commodity-grid">
              {results.map((item) => (
                <div key={item.id} className="commodity-card">
                  <h3>{item.name}</h3>
                  {item.specification && <p className="spec">{item.specification}</p>}
                  <p className="category">{item.category_name}</p>
                  <p className="price">₱{item.latest_price}</p>
                  <span className="date">{new Date(item.price_date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found for "{query}"</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;