import "../styles/Home.css";
import "../styles/Navbar.css";
import React, { useState, useEffect, useRef, use } from "react";
import axios from "axios";
import { Link, useMatch, useNavigate, useLocation } from "react-router-dom";

const placeholderThumb = (name) =>
    `../public/images/${name}.png`;

const Navbar = () => {
    const [chars, setChars] = useState([]);
    const [open, setOpen] = useState(null);
    const [selected, setSelected] = useState(null);
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('moves');
    const isCharPage = useMatch('/:charName/:tab');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_HOST + '/chars');
                setChars(response.data);
            } catch (error) {
                console.error('Error fetching characters:', error);
            }
        };
        fetchChars();
    }, []);

    // useEffect(() => {
    //     const onDocClick = (e) => {
    //         if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    //     };
    //     document.addEventListener("click", onDocClick);
    //     return () => document.removeEventListener("click", onDocClick);
    // }, []);

    const location = useLocation();

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const charName = pathParts[1];
        console.log("charName: ", charName);
        if (charName) setSelected(charName);
    }, [location.pathname]);

    const onSelect = (name) => {
        setSelected(name);
        setOpen(false);
        if (activeTab === 'moves')
            navigate(`/${name}/moves`);
        else if (activeTab === 'stats')
            navigate(`/${name}/stats`);
    };

    return (
        <nav className="navbar" ref={containerRef}>
            <div className="nav-column nav-left">
                <Link to="/" className="brand" onClick={() => { setOpen(false); setSelected(null); }}>
                    SF6 Frame Data
                </Link>
            </div>

              <div className="nav-column nav-center">
                  <div className={`dropdown ${open ? "open" : ""}`}>
                      <button className="dropdown-toggle" onClick={() => setOpen((s) => !s)}>
                          <img className="thumb" src={placeholderThumb(selected)} alt="" />
                          <span className="label">{selected || "Select character"}</span>
                          <span className="caret">{open ? "▲" : "▼"}</span>
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

            {isCharPage && (
              <div className="nav-column nav-right">
                  <div className="tab-toggle" role="tablist" aria-label="Moves or Stats">
                      <Link
                          to={`/${selected}/moves`}
                          className={`tab-btn ${activeTab === 'moves' ? 'active' : ''}`}
                          onClick={() => setActiveTab('moves')}
                      >
                          Moves
                      </Link>

                      <Link
                          to={`/${selected}/stats`}
                          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                          onClick={() => setActiveTab('stats')}
                      >
                          Stats
                      </Link>
                  </div>
              </div>
            )}
        </nav>
    );
}

export default Navbar;