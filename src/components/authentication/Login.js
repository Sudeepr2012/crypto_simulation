
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../others/Colors';
import './Style.css'

export default function Login({ user, gun }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalidAuth, setInvalidAuth] = useState(false);

    useEffect(() => {
        if (user.is)
            window.location.href = '/dashboard'
    }, [])

    function login(e) {
        e.preventDefault();
        setInvalidAuth(false)
        setLoading(true)
        user.auth(username, password, async (ack) => {
            setLoading(false)
            if (ack.err)
                setInvalidAuth(ack.err)
            else {
                alert(user.is.pub)
                window.location.href = '/dashboard'
            }
        });
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
                {loading ?
                    <div className='loader'></div>
                    :
                    <button>Login</button>
                }
            </div>
            <div className='btn-div' style={{ fontSize: 20, color: colors.link }}>
                {invalidAuth ?
                    invalidAuth
                    :
                    null
                }
            </div>
            <div className='btn-div' style={{ fontSize: 28 }}>
                New? <Link to='/join'>join here</Link>
            </div>
        </form>
    )
}