import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Api from './api';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Api />
  </React.StrictMode>
);

