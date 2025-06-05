import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Search, Heart, Globe, Menu, X, Moon, Sun, Info } from 'lucide-react';
import Player from './Player';
import { useRadio } from '../contexts/RadioContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const location = useLocation();
  const { currentStation } = useRadio();

  useEffect(() => {
    // Set body class for dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md z-20 transition-colors duration-300">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
            <Radio size={28} className="text-purple-700 dark:text-purple-400" />
            <span className="text-xl font-bold">GlobalRadio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/browse" active={location.pathname === '/browse'}>
              Browse
            </NavLink>
            <NavLink to="/search" active={location.pathname === '/search'}>
              Search
            </NavLink>
            <NavLink to="/favorites" active={location.pathname === '/favorites'}>
              Favorites
            </NavLink>
            <NavLink to="/about" active={location.pathname === '/about'}>
              About
            </NavLink>
          </nav>

          {/* Mobile Menu Button & Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-gray-700" />
              )}
            </button>
            
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu size={24} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white dark:bg-gray-800 py-4 px-4 shadow-lg animate-fadeIn transition-all duration-300">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" active={location.pathname === '/'} icon={<Globe size={18} />}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/browse" active={location.pathname === '/browse'} icon={<Radio size={18} />}>
                Browse
              </MobileNavLink>
              <MobileNavLink to="/search" active={location.pathname === '/search'} icon={<Search size={18} />}>
                Search
              </MobileNavLink>
              <MobileNavLink to="/favorites" active={location.pathname === '/favorites'} icon={<Heart size={18} />}>
                Favorites
              </MobileNavLink>
              <MobileNavLink to="/about" active={location.pathname === '/about'} icon={<Info size={18} />}>
                About
              </MobileNavLink>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} GlobalRadio. All rights reserved.</p>
          <p className="mt-1">Built with love for radio enthusiasts worldwide.</p>
        </div>
      </footer>

      {/* Floating Player */}
      {currentStation && (
        <div className="fixed bottom-0 left-0 right-0 z-30 animate-slideUp">
          <Player />
        </div>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={`font-medium transition-colors duration-200 hover:text-purple-700 dark:hover:text-purple-400 ${
      active
        ? 'text-purple-700 dark:text-purple-400'
        : 'text-gray-700 dark:text-gray-300'
    }`}
  >
    {children}
  </Link>
);

interface MobileNavLinkProps extends NavLinkProps {
  icon: ReactNode;
}

const MobileNavLink = ({ to, active, icon, children }: MobileNavLinkProps) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
      active
        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
    }`}
  >
    <span className={active ? 'text-purple-700 dark:text-purple-400' : ''}>{icon}</span>
    <span className="font-medium">{children}</span>
  </Link>
);

export default Layout;