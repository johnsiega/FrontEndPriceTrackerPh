import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Commodities from './pages/Commodities';
import Search from './pages/Search';
import Upload from './pages/Upload';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/commodities">Commodities</Link>
          <Link to="/search">Search</Link>
          <Link to="/upload">Upload</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commodities" element={<Commodities />} />  {/* Should be /commodities not to */}
            <Route path="/search" element={<Search />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </main>

        <footer>
          <p>PriceTrackerPH © 2025 | Data from Department of Agriculture</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;