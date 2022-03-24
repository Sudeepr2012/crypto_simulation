
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Style.css'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function login(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={login} className='container'>
            <h4>LOGIN</h4>
            <div className='form-field'>
                <label>Username</label>
                <input type='text' value={username}
                    onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className='form-field'>
                <label>Password</label>
                <input type={'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className='btn-div'>
                <button>Login</button>
            </div>
            <div style={{ fontSize: 28 }}>
                New? <Link to='/join'>join here</Link>
            </div>
        </form>
    )
}
export default Login