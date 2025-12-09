import './styles/App.css';
import { React, useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation, matchPath } from 'react-router-dom';
import Home from './components/Home.jsx';
import Navbar from './components/Navbar.jsx';
import CharPage from './components/CharPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

const placeholderThumb = (name) =>
  `../public/images/${name}.png`;

const AppRoutes = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('moves');

  useEffect(() => {
      const pathParts = location.pathname.split('/');
      const tab = pathParts[2];
      console.log("tab: ", tab);
      if (tab) setActiveTab(tab);
  }, [location.pathname]);

  // List of explicit paths where the navbar should be shown.
  // This file uses a whitelist approach: navbar appears only on these known pages
  // or when a known route pattern matches (e.g. character pages).
  const showNavbarOn = ['/'];

  // Also allow the char page pattern '/:charName/:tab'
  const isCharPage = matchPath('/:charName/:tab', location.pathname);
  const shouldShowNavbar = showNavbarOn.some((p) => location.pathname === p || location.pathname.startsWith(p + '/')) || isCharPage != null;

  return (
    <>
      {shouldShowNavbar && <Navbar activeTab={activeTab} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:charName/:tab" element={<CharPage activeTab={activeTab} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
