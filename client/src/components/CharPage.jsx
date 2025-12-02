import "../styles/Home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const placeholderThumb = (name) =>
  `../public/images/${name}.png`;


const Home = () => {
  const [chars, setChars] = useState([]);
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_API_HOST + '/chars');
        setChars(response.data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    }
    fetchChars();
  }, []);

  useEffect(() => {
    if (chars.length) setSelected(chars[0]);
  }, [chars]);

  const onSelect = (name) => {
    setSelected(name);
    setOpen(null);
  };
return (
    <div className="app">
        <h1>SF6 Chars</h1>
        <div className={`dropdown ${open ? 'open' : ''}`}>
        <button className="dropdown-toggle" onClick={() => setOpen((s) => !s)}>
            <img className="thumb" src={placeholderThumb(selected)} alt="" />
            <span className="label">{selected || 'Select a character'}</span>
            <span className="caret">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
            <ul className="dropdown-menu">
            {chars.map((name) => (
                <li key={name} className="dropdown-item" onClick={() => onSelect(name)}>
                <img className="thumb" src={placeholderThumb(name)} alt={`${name} thumbnail`} />
                <span className="label">{name}</span>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    );
};

export default Home;