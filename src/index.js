import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.png';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';

function MyRouter() {

  return (
    <React.StrictMode>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="logo" />
          <br />
          <Router>
            <Routes>
              <Route exact path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<App />} />
            </Routes>
          </Router>
        </header>
      </div>
    </React.StrictMode>
  )
}

ReactDOM.render(
  <MyRouter />,
  document.getElementById('root')
);

reportWebVitals();
