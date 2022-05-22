import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Gun from 'gun'
import logo from './logo.png';
import './index.css';
import './PathChangedLoading.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/authentication/Login';
import SignUp from './components/authentication/Signup';
import Dashboard from './components/Dashboard';
import SendTx from './components/transactions/SendTx';
import Footer from './components/Footer';
import Header from './components/Header';
import AllBlocks from './components/blocks/AllBlocks';
import ViewBlock from './components/blocks/ViewBlock';
import UnconfirmedTX from './components/transactions/Unconfirmed';
import ViewTX from './components/transactions/ViewTX';
import CandidateBlock from './components/miner/CandidateBlock';
import ViewAddress from './components/ViewAddress';
import ValidateBlock from './components/miner/ValidateBlock';
import { PEERS } from './components/others/Peers';
import AllTXs from './components/transactions/AllTXs';
require('gun/sea')

const gun = Gun({
  peers: PEERS
})
let user = gun.user().recall({ sessionStorage: true });
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
      <Route exact path="/" element={<App user={user} />} />
      <Route path="/login" element={<Login user={user} gun={gun} />} />
      <Route path="/join" element={<SignUp user={user} gun={gun} />} />
      <Route path="/blocks" element={<AllBlocks gun={gun} />} />
      <Route path="/txs" element={<AllTXs gun={gun} />} />

      <Route path="/block/:bHeight" element={<ViewBlock gun={gun} />} />
      <Route path="/unconfirmed-tx" element={<UnconfirmedTX user={user} gun={gun} />} />
      <Route path="/tx/:txHash" element={<ViewTX gun={gun} />} />
      <Route path="/address/:address" element={<ViewAddress />} />

      {user.is ?
        <>
          <Route path="/me/block" element={<CandidateBlock user={user} gun={gun} />} />
          <Route path="/miner" element={<ValidateBlock user={user} gun={gun} />} />
          <Route path="/dashboard" element={<Dashboard user={user} gun={gun} />} />
          <Route path="/send" element={<SendTx user={user} gun={gun} />} />
        </>
        :
        null
      }
      <Route path="*" element={<App user={user} />} />
    </Routes>
  )
}

function PathTracker({ pathChangedFun }) {
  const { pathname } = useLocation();

  useEffect(() => {
    //no. of miners in our network
    gun.get('miners').then((miners) => console.log(Object.keys(miners).length - 1))
    let authPaths = ['dashboard', 'send', 'me', 'miner']
    let path = pathname.split('/')
    if (path.some((p) => { return authPaths.includes(p); }) && !user.is)
      window.location.href = '/'
    pathChangedFun()
  }, [pathname])
  return (null)
}

reportWebVitals();
