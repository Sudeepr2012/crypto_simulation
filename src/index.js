import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import logo from './logo.png';
import './index.css';
import './PathChangedLoading.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login';
import SignUp from './components/Signup';
import Dashboard from './components/Dashboard';
import SendTx from './components/Crypto/SendTx';
import Footer from './components/Footer';
import Header from './components/Header';
import AllBlocks from './components/Blockchain/Blocks/AllBlocks';
import ViewBlock from './components/Blockchain/Blocks/ViewBlock';
import UnconfirmedTX from './components/Blockchain/Transactionss/Unconfirmed';
import ViewTX from './components/Blockchain/Transactionss/ViewTX';

const LOADING_TIME = 500;

function Index() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setShowLoading(false), LOADING_TIME)
  }, [])

  function pathChanged() {
    setShowLoading(true)
    window.scroll(0, 0)
    setTimeout(() => setShowLoading(false), LOADING_TIME)
  }
  return (
    <React.StrictMode>
      <Router>
        <div className="App">
          <Header />
          <header className="App-header">
            <img src={logo} alt="logo" />
            <br />
            {showLoading ?
              <div className="loading">
                <div className='uil-ring-css' >
                  <img src='/logo512.png' />
                  <div className='spin-load'>
                  </div>
                </div>
              </div>
              :
              null
            }
            <PathTracker pathChangedFun={pathChanged} />
            <MyRoutes />
          </header>
          <Footer />
        </div>
      </Router>

    </React.StrictMode>
  )
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);


function MyRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<SignUp />} />
      <Route path="/blocks" element={<AllBlocks />} />
      <Route path="/block/:bHeight" element={<ViewBlock />} />
      <Route path="/unconfirmed-tx" element={<UnconfirmedTX />} />
      <Route path="/tx/:txHash" element={<ViewTX />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send" element={<SendTx />} />
      <Route path="*" element={<App />} />
    </Routes>
  )
}

function PathTracker({ pathChangedFun }) {
  const { pathname } = useLocation();

  useEffect(() => {
    pathChangedFun()
  }, [pathname])
  return (null)
}

reportWebVitals();
