
import { useEffect, useState } from 'react';
import { GiMiner } from 'react-icons/gi'
import { colors } from '../../Others/Colors';

//UTXO[tid][blockHash]
const blockTX = [
    {
        hash: 'tx-dkhfkhskfhskggmmhgjoh484hehe4rg',
        amount: 0,
    },
    {
        hash: 'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s',
        amount: 0.3,
    },
    {
        hash: 'tx-jhkl7khskfhkg86jd90we3fgjoh48fh',
        amount: 0.09,
    },
]

function CandidateBlock() {
    const [ipUTXO, setIpUTXO] = useState([]);
    const [blockHash, setBlockHash] = useState('');
    const [blockIsValid, setBlockIsValid] = useState(false);
    const [nonce, setNonce] = useState(0);
    const [ipUTXOamount, setIpUTXOamount] = useState(0);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBlockIsValid(false)
        setShowSubmitButton(false)
        setBlockHash('')
        calculateHash();
    }, [nonce, blockTX])
    function calculateHash() {
        setTimeout(() => {
            setBlockHash('00hgbnfmdhdgll')
            setShowSubmitButton(true)
            setBlockIsValid(true)
        }, 3000)
    }

    function CandidateBlock(e) {
        e.preventDefault();
        setLoading(true)
    }

    return (
        <form onSubmit={CandidateBlock} className='container' style={{
            width: '100%',
            backgroundColor: blockIsValid ? '' : '#6c3c3c'
        }}>
            <h4>Block #14</h4>
            <div className='form-field'>
                <table style={{ fontSize: 16 }}>
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                        <tr><td>Prev. Hash</td> <td>0000ghgfjdhgfyh76743h23-47ujgjdjfhg</td></tr>
                        <tr><td>Difficulty</td> <td>27</td></tr>
                        <tr><td>Merkle Root</td> <td>jkjkgf-mfjhsdk48kg78vkf740-v</td></tr>
                        <tr><td>Hash (POW)</td> <td>{blockHash}</td></tr>
                    </div>
                </table>
            </div>
            <div className='form-field'>
                <label>Transactions</label>
                <table style={{ fontSize: 16 }}>
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                        <tr><td>Block Reward</td> <td>6.39 SC</td></tr>
                        <tr><td>Fee Reward</td> <td>0.39 SC</td></tr>
                    </div>
                    {blockTX.map((transaction, index) => (
                        <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                            <tr><td>Hash</td> <td>{transaction.hash}</td></tr>
                            <tr><td>Fee</td> <td>{transaction.amount} SC</td></tr>
                        </div>
                    ))
                    }
                </table>
            </div>
            <div className='form-field'>
                <label>Nonce</label>
                <input type={'number'} value={nonce}
                    onChange={(e) => setNonce(+e.target.value)} required readOnly={loading} />
            </div>
            <div className='btn-div'>
                {showSubmitButton ?
                    loading ?
                        <div className='loader'></div>
                        : <button disabled={!blockIsValid}
                            style={{ background: blockIsValid ? colors.lighter : '' }}>Broadcast</button>
                    :
                    <center><div className='loader'></div>
                        <div style={{ fontStyle: 'italic', fontSize: 18 }}>Solving hash...</div></center>}
            </div>
            <div className='btn-div'>
                <GiMiner color='#e5f9ff' size={40} />
            </div>
        </form>
    )
}
export default CandidateBlock