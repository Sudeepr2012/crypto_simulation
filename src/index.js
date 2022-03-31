import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Gun from 'gun'

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
import UnconfirmedTX from './components/Transactionss/Unconfirmed';
import ViewTX from './components/Transactionss/ViewTX';
import CandidateBlock from './components/Blockchain/Miner/CandidateBlock';
import ViewAddress from './components/Crypto/ViewAddress';
import ValidateBlock from './components/Blockchain/Miner/ValidateBlock';
import { PEERS } from './components/Others/Peers';
require('gun/sea')

const gun = Gun({
  peers: PEERS
})
var user = gun.user().recall({ sessionStorage: true });

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
      <Route path="/me/block" element={<CandidateBlock user={user} gun={gun} />} />
      <Route path="/miner" element={<ValidateBlock />} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/send" element={<SendTx />} />

      <Route path="/blocks" element={<AllBlocks />} />
      <Route path="/block/:bHeight" element={<ViewBlock />} />
      <Route path="/unconfirmed-tx" element={<UnconfirmedTX user={user} gun={gun} />} />
      <Route path="/tx/:txHash" element={<ViewTX />} />
      <Route path="/address/:address" element={<ViewAddress />} />

      <Route path="*" element={<App user={user} />} />
    </Routes>
  )
}

function PathTracker({ pathChangedFun }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // console.log(user.is.pub)
    //  gun.user('9NVyZB3JLAywYsacGSJQFUBdEdS_ZyNRn4MresxbGzk.x89U95w2N2StV147jGtM2MV__4izDt2ZGpNuaeOeyqA').once((val, key) => console.log(val, key))
    // gun.user('7DTJkNatJMXqOqfAoLd9Gl02cQI1v75NXeKlXVHqNH4.ViTQrFuMqaZMb_FfZjihg24Cwj5DaqN72VnwuCdh5fw').once((val, key) => console.log(val, key))
    // gun.get('~@TesterLiam').once((data, key) => { console.log(data, key) });

    // console.log(user.is)
    // user.recall({
    //   sessionStorage: true
    // }, () => {
    //   gun.on('auth', async (ack) => {
    //     //user name and public key (wallet address)
    //     console.log(user.is)
    //     const ali = await user.get('info')
    //     console.log(ali)
    //   })
    // })
    let authPaths = ['dashboard', 'send', 'me', 'miner']
    let path = pathname.split('/')
    if (path.some((p) => { return authPaths.includes(p); }) && !user.is)
      window.location.href = '/'
    pathChangedFun()
  }, [pathname])
  return (null)
}

reportWebVitals();
