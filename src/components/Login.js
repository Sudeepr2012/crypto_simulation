
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Dashboard from './Dashboard';
import { colors } from './Others/Colors';
import './Style.css'

function Login({ user, gun }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [invalidAuth, setInvalidAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.is !== undefined)
            navigate("/dashboard");
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
                navigate("/dashboard");
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
export default Login