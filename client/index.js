import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import styles from './stylesheets/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<BrowserRouter><App /></BrowserRouter>)