import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiMiner } from 'react-icons/gi'
import { IoMdCube } from 'react-icons/io'
import { colors } from '../../Others/Colors';
import { getAcctType } from '../../Others/GetAcctType';
const SHA256 = require("crypto-js/sha256");

const difficulty = 0;
const blockTX = [
    {
        hash: 'tx-gsfdh566bes5ggmmhgjoh484hehe4rg',
        fee: 0.39,
        reward: 6.39,
        timestamp: new Date(),
        to: 'sc-dffvfog05954jnknb9hthm9je3ngn9ijslmkfzgreg9'
    },
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

function CandidateBlock({ user, gun }) {
    const [blockIsValid, setBlockIsValid] = useState(false);
    const [autoMining, setAutoMining] = useState(false);
    const [autoMiningStart, setAutoMiningStart] = useState(0);
    const [autoMiningEnd, setAutoMiningEnd] = useState(0);
    const [nonce, setNonce] = useState(0);
    const [block, setBlock] = useState({
        hash: findHash("0eb6638c4f44e941942a5d8dd51fc92e1bacec92a78a154522060fdbeb2daf0e", + new Date(), 'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s', 0),
        timestamp: new Date(),
        data: 'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s',
        nonce: 0,
        prevHash: "0eb6638c4f44e941942a5d8dd51fc92e1bacec92a78a154522060fdbeb2daf0e"
    });
    const [acctType, setAcctType] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [createBlock, setCreateBlock] = useState(false);
    const [loading, setLoading] = useState(false);
    const [blockTime, setBlockTime] = useState(0)

    const navigate = useNavigate()
    useEffect(() => {
        let tx = [];
        for (let i = 0; i < blockTX.length; i++)
            tx.push(blockTX[i].hash)
        calculateMerkleRoot(tx);
    }, [])

    useEffect(() => {
        if (acctType === true || acctType === false)
            updateDet()
        else
            if (acctType !== 'miner')
                navigate('/dashboard')
            else {
                //get miner candidate block
            }
        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }
    }, [acctType])

    useEffect(() => {
        setTimeout(() => setBlockTime(Math.round((+ new Date() - block.timestamp) / 1000)), 1000)
    }, [blockTime])

    useEffect(() => {
        setBlockIsValid(false)
        setShowSubmitButton(false)
        if (!autoMining) {
            setBlock(block => ({ ...block, hash: findHash(block.prevHash, block.timestamp, block.data, nonce), nonce: nonce }))
        }
        else {
            setBlockIsValid(true)
            setShowSubmitButton(true)
            setAutoMining(false)
        }
    }, [nonce, blockTX])

    useEffect(() => {
        if (autoMining) {
            let tempNonce = nonce;
            let hash = block.hash;
            if (!checkDifficulty(hash, difficulty)) {
                setAutoMiningStart(+ new Date())
                setShowSubmitButton(false)
                setBlockIsValid(false)
                while (!checkDifficulty(hash, difficulty)) {
                    tempNonce++
                    hash = findHash(block.prevHash, block.timestamp, block.data, tempNonce)
                    // affects time
                    // console.log(tempNonce)
                }
                setBlock(block => ({ ...block, hash: hash, nonce: tempNonce }));
                setAutoMiningEnd(+ new Date())
            } else
                setAutoMining(false)
        }
    }, [autoMining])

    useEffect(() => {
        if (block.hash !== undefined) {
            if (autoMining) {
                setShowSubmitButton(true)
                setBlockIsValid(true)
                setNonce(block.nonce)
            } else {
                let isBlockValid = checkDifficulty(block.hash, difficulty);
                setShowSubmitButton(isBlockValid)
                setBlockIsValid(isBlockValid)
            }
        }
    }, [block])

    function calculateMerkleRoot(tx) {
        console.log(tx)
        if (tx.length === 1) {
            setBlock(block => ({ ...block, data: tx[0] }))
            return
        }
        if (tx.length % 2 !== 0)
            tx.push(tx[tx.length - 1])
        let txTemp = [];
        let i = 0;
        while (i < tx.length - 1) {
            txTemp.push(SHA256(tx[i] + tx[i + 1]).toString());
            i += 2;
        }
        calculateMerkleRoot(txTemp)
    }

    function findHash(previousHash, timestamp, data, nonce) {
        return SHA256(previousHash + timestamp + data + nonce).toString();
    }

    function checkDifficulty(hash, difficulty) {
        return hash.substr(0, difficulty) === "0".repeat(difficulty)
    }

    function BroadcastBlock(e) {
        e.preventDefault();
        setLoading(true)
    }

    return (
        <>
            {!createBlock ?
                <button onClick={() => {
                    setCreateBlock(true)
                    setBlock(block => ({ ...block, timestamp: + new Date() }));
                }}>Create Block</button>
                :
                <form onSubmit={BroadcastBlock} className='container' style={{
                    width: '100%',
                    backgroundColor: blockIsValid ? '' : '#6c3c3c'
                }}>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <h4 style={{ textAlign: 'left', flex: 1 }}>Block #14</h4>
                        <div style={{ display: 'inline-grid', justifyContent: 'center', alignContent: 'center' }}>
                            <h4 style={{ textAlign: 'right', fontSize: 20, margin: 0 }}>
                                <GiMiner color='#e5f9ff' /> Mining Duration: {((autoMiningEnd - autoMiningStart) / 1000).toFixed(1)}s</h4>
                            <h4 style={{ textAlign: 'right', fontSize: 20, margin: 0 }}>
                                <IoMdCube color={colors.link} /> Total Block time: {blockTime}s</h4>
                        </div>
                    </div>

                    <div className='form-field'>
                        <table style={{ fontSize: 16 }}>
                            <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                <tr><td>Prev. Hash</td> <td>{block.prevHash}</td></tr>
                                <tr><td>Difficulty</td> <td>{difficulty}</td></tr>
                                <tr><td>Merkle Root</td> <td>{block.data}</td></tr>
                                <tr><td>Hash (POW)</td> <td>{autoMining ?
                                    <div className='loader'
                                        style={{ width: 20, height: 20 }}></div>
                                    :
                                    block.hash}</td></tr>
                            </div>
                        </table>
                    </div>
                    <div className='form-field'>
                        <label>Transactions</label>
                        <table style={{ fontSize: 16 }}>
                            <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                <tr><td>Block Reward</td> <td>{blockTX[0].reward} SC</td></tr>
                                <tr><td>Fee Reward</td> <td>{blockTX[0].fee} SC</td></tr>
                            </div>
                            {blockTX.map((transaction, index) => (
                                index !== 0 ?
                                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                        <tr><td>Hash</td> <td>{transaction.hash}</td></tr>
                                        <tr><td>Fee</td> <td>{transaction.amount} SC</td></tr>
                                    </div>
                                    :
                                    null
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
                            <center>
                                <div style={{ fontStyle: 'italic', fontSize: 18 }}>
                                    {autoMining ? 'Mining...' : 'Block invalid'}</div></center>}
                    </div>
                    <div className='btn-div'>
                        {autoMining ?
                            <center><div className='loader'></div>
                            </center>
                            :
                            <GiMiner
                                onClick={() => {
                                    setAutoMining(true)
                                }}
                                color='#e5f9ff' size={40} />}
                    </div>
                </form>
            }
        </>
    )
}
export default CandidateBlock