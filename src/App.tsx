import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import About from './pages/About';
import { RadioProvider } from './contexts/RadioContext';

function App() {
  return (
    <RadioProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </RadioProvider>
  );
}

export default App