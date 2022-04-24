import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/global.scss';
import App from './App';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);