import './styles/App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Navbar from './components/Navbar.jsx';
import CharPage from './components/CharPage.jsx';

const placeholderThumb = (name) =>
  `../public/images/${name}.png`;

const App = () => {

  return (
    <BrowserRouter>
      <Navbar /> A navigation bar with links
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:charName/:tab" element={<CharPage />} />
        {/* <Route path="/about" element={<About />} />*/}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
