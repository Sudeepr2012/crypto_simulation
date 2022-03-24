import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigate();
  return (
    <>
      Welcome to Blockchain and Cryptocurrency Demo
      <p style={{ background: '#94d0cf21', padding: 50, }}>
        To continue, kindly
        <div style={{ display: 'flex', marginTop: 10, }}>
          <button onClick={() => navigate("login")}>Login</button>
          <span style={{ margin: '0px 20px' }}>or</span>
          <button onClick={() => navigate("/join")}>Sign up</button>
        </div>
      </p>
    </>
  );
}

export default App;
