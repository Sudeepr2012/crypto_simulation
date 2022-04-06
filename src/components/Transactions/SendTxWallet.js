
import { useEffect, useState } from 'react';

const feeCharge = 0.5;
const maxAmount = 1000;

function SendTxWallet() {
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [fee, setFee] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amount > maxAmount)
            setAmount(maxAmount)
        setFee((Math.round((((amount * feeCharge) / 100) + Number.EPSILON) * 10000) / 10000))
    }, [amount])

    function sendTx(e) {
        e.preventDefault();
        setLoading(true)
    }
    return (
        <form onSubmit={sendTx} className='container'>
            <h4>Send SC</h4>
            <div className='form-field'>
                <label>Address</label>
                <input type='text' value={address}
                    onChange={(e) => setAddress(e.target.value)} required readOnly={loading} />
            </div>
            <div className='form-field'>
                <label>Amount</label>
                <input type='number' value={amount}
                    onChange={(e) => setAmount(+e.target.value)} required readOnly={loading} />
            </div>
            <div className='form-field'>
                <label>Fee ({feeCharge}%)</label>
                <input type={'number'} value={fee}
                    required readOnly />
            </div>
            <div className='btn-div'>
                {loading ?
                    <div className='loader'></div>
                    :
                    <button disabled={amount > 0 && address !== '' ? false : true}
                        style={{ opacity: amount > 0 && address !== '' ? '100%' : '50%' }}
                    >Send</button>
                }
            </div>
            <div className='btn-div' style={{ fontSize: 28 }}>
                - Wallet method -
            </div>
        </form >
    )
}
export default SendTxWallet