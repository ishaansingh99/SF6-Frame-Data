import "../styles/Home.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const placeholderThumb = (name) =>
  `../public/images/${name}.png`;

const NotFoundPage = () => {

return (
    <div className="app">
        <h1>Page not found :(</h1>
        <a href="/">Go back home</a>
        {/* <div className={`dropdown ${open ? 'open' : ''}`}>
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
        </div> */}
    </div>
    );
};

export default NotFoundPage;