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
import SendTx from './components/Crypto/SendTx';
import Footer from './components/Footer';
import Header from './components/Header';

function MyRouter() {

  return (
    <React.StrictMode>
      <div className="App">
        <Header />
        <header className="App-header">
          <img src={logo} alt="logo" />
          <br />
          <Router>
            <Routes>
              <Route exact path="/" element={<App />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<SendTx />} />
              <Route path="*" element={<App />} />
            </Routes>
          </Router>
        </header>
        <Footer />
      </div>
    </React.StrictMode>
  )
}

ReactDOM.render(
  <MyRouter />,
  document.getElementById('root')
);

reportWebVitals();
