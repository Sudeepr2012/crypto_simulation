
import { useEffect, useState } from 'react';
import Select from 'react-select'
import { selectTheme } from '../Others/Colors';


//UTXO[tid][address]
const myUTXO = [
    {
        hash: 'tx-dkhfkhskfhskggmmhgjoh484hehe4rg',
        amount: 124,
    },
    {
        hash: 'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s',
        amount: 200,
    },
    {
        hash: 'tx-jhkl7khskfhkg86jd90we3fgjoh48fh',
        amount: 76,
    },
]

function SendTx() {
    const [ipUTXO, setIpUTXO] = useState([]);
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [fee, setFee] = useState(0);
    const [ipUTXOamount, setIpUTXOamount] = useState(0);
    const [showSendButton, setShowSendButton] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleInputs([])
    }, [amount, fee])
    function handleInputs(e) {
        setIpUTXOamount(0)
        let totalUTXOAmount = 0;
        for (let i = 0; i < e.length; i++) {
            totalUTXOAmount += e[i].amount;
        }
        setIpUTXOamount(totalUTXOAmount)
        if (totalUTXOAmount >= (fee + amount) && totalUTXOAmount > 0)
            setShowSendButton(true)
        else
            setShowSendButton(false)
        setIpUTXO(e)
    }

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
                <label>Fee</label>
                <input type={'number'} value={fee}
                    onChange={(e) => setFee(+e.target.value)} required readOnly={loading} />
            </div>
            <div className='form-field'
                style={{ display: 'flex', flexDirection: 'column', width: '100%', textAlign: 'left' }}>
                <label>Inputs</label>
                <Select theme={selectTheme}
                    isDisabled={loading}
                    value={ipUTXO} onChange={(e) => handleInputs(e)}
                    isMulti
                    className='utxo-list'
                    options={ipUTXOamount >= amount + fee ? [] : myUTXO}
                    noOptionsMessage={() => {
                        return ipUTXOamount >= amount + fee
                            ? 'Required input amount reached'
                            : 'No UTXO found';
                    }}
                    getOptionLabel={e => e.hash}
                    getOptionValue={e => e.amount}
                    placeholder='Select inputs' />
            </div>
            <div className='btn-div'>
                {showSendButton && (amount > 0) ?
                    loading ?
                        <div className='loader'></div>
                        : <button>Send</button> :
                    <span style={{ fontSize: 18 }}>Please select inputs to proceed</span>}
            </div>
            <div className='btn-div' style={{ fontSize: 28 }}>
                - Manual method -
            </div>
        </form>
    )
}
export default SendTx