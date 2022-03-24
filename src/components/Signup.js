
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Style.css'

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [acctType, setAcctType] = useState('normal');

    function signup(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={signup} className='container'>
            <h4>JOIN</h4>
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
            <div className='form-field'>
                <label>Join as?</label>
                <select value={acctType} onChange={(e) => setAcctType(e.target.value)}>
                    <option value={'normal'}>💸 Normal</option>
                    <option value={'miner'}>⛏️ Miner</option>
                </select>
            </div>
            <div className='btn-div'>
                <button>Join</button>
            </div>
            <div style={{ fontSize: 28 }}>
                Have an account? <Link to='/login'>login here</Link>
            </div>
        </form>
    )
}
export default SignUp