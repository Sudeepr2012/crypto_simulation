import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiMiner } from 'react-icons/gi'
import { ToastContainer } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from '../others/Colors';
import { getAcctType } from '../others/GetAcctType';
import calculateMerkleRoot from '../transactions/CalculateMerkleRoot';
import { notify } from '../others/Notify';
import { API_URL, BLOCK_REWARD, COIN_SYMBOL, DIFFICULTY } from '../Strings';
import { getTime } from '../others/GetDate';
const SHA256 = require("crypto-js/sha256");

export default function CandidateBlock({ user, gun }) {
    const [blockIsValid, setBlockIsValid] = useState(false);
    const [autoMining, setAutoMining] = useState(false);
    const [autoMiningStart, setAutoMiningStart] = useState(0);
    const [autoMiningEnd, setAutoMiningEnd] = useState(0);
    const [nonce, setNonce] = useState(0);
    const [blockTx, setBlockTx] = useState(null);
    const [blockCBTx, setBlockCBTx] = useState({});
    const [acctType, setAcctType] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [candidateBlock, setCandidateBlock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [blockLoading, setBlockLoading] = useState(true);
    const [blockTime, setBlockTime] = useState(0)
    const userKU = user.is.pub;
    const location = useLocation();

    const navigate = useNavigate()
    useEffect(() => {
        setBlockTx(location.state)
        gun.get(`miners/${userKU}`).once((val) => {
            if (val.candidateBlock)
                gun.get(`miners/${userKU}/candidateBlock`).once((cb) => {
                    setCandidateBlock(cb)
                })
            else
                setBlockLoading(false)
        })

        window.history.replaceState({}, document.title)
    }, [])

    useEffect(() => {
        async function findCoinBaseTx() {
            let feeReward = 0;
            for (let i = 0; i < blockTx.length + 1; i++) {
                if (i === blockTx.length) {
                    let timestamp = +new Date();
                    setBlockCBTx({
                        hash: SHA256((BLOCK_REWARD + feeReward).toString() + timestamp.toString() + userKU).toString(),
                        fee: feeReward,
                        reward: feeReward + BLOCK_REWARD,
                        timestamp: timestamp,
                        to: userKU
                    }, setBlockLoading(false));
                }
                else {
                    const res = await fetch(`${API_URL}/tx?${new URLSearchParams({ txHash: blockTx[i] }).toString()}`);
                    const data = await res.json();
                    if (data.length)
                        feeReward = data[0].fee
                }
            }
        }
        if (blockTx && candidateBlock && candidateBlock.merkleRoot === '')
            findCoinBaseTx()
    }, [candidateBlock])

    useEffect(() => {
        if (Object.keys(blockCBTx).length > 0) {
            let tx = [];
            tx.push(blockCBTx.hash)
            for (let i = 0; i < blockTx.length; i++)
                tx.push(blockTx[i])
            setCandidateBlock(candidateBlock => ({ ...candidateBlock, merkleRoot: calculateMerkleRoot(tx) }));
        }
    }, [blockCBTx])

    useEffect(() => {
        if (acctType === true || acctType === false)
            updateDet()
        else
            if (acctType !== 'miner')
                navigate('/dashboard')
        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }
    }, [acctType])

    useEffect(() => {
        if (candidateBlock)
            setTimeout(() => setBlockTime(getTime(Math.round((+ new Date() - candidateBlock.timestamp) / 1000))), 1000)
    }, [blockTime, candidateBlock])

    useEffect(() => {
        setBlockIsValid(false)
        setShowSubmitButton(false)
        if (!autoMining) {
            if (candidateBlock && candidateBlock.merkleRoot !== '')
                setCandidateBlock(candidateBlock => ({ ...candidateBlock, hash: findHash(candidateBlock.prevHash, candidateBlock.timestamp, candidateBlock.merkleRoot, nonce), nonce: nonce }))
        }
        else {
            setBlockIsValid(true)
            setShowSubmitButton(true)
            setAutoMining(false)
        }
    }, [nonce])

    useEffect(() => {
        if (autoMining) {
            let tempNonce = nonce;
            let hash = candidateBlock.hash;
            if (!checkDifficulty(hash, DIFFICULTY)) {
                setAutoMiningStart(+ new Date())
                setShowSubmitButton(false)
                setBlockIsValid(false)
                while (!checkDifficulty(hash, DIFFICULTY)) {
                    tempNonce++
                    hash = findHash(candidateBlock.prevHash, candidateBlock.timestamp, candidateBlock.merkleRoot, tempNonce)
                    // affects time
                    // console.log(tempNonce)
                }
                setCandidateBlock(candidateBlock => ({ ...candidateBlock, hash: hash, nonce: tempNonce }));
                setAutoMiningEnd(+ new Date())
            } else
                setAutoMining(false)
        }
    }, [autoMining])

    useEffect(() => {
        if (candidateBlock) {
            if (autoMining) {
                setShowSubmitButton(true)
                setBlockIsValid(true)
                setNonce(candidateBlock.nonce)
            } else {
                if (candidateBlock.hash) {
                    let isBlockValid = checkDifficulty(candidateBlock.hash, DIFFICULTY);
                    setShowSubmitButton(isBlockValid)
                    setBlockIsValid(isBlockValid)
                }
            }

        }
        else {
            if (!location.state)
                navigate('/unconfirmed-tx')
        }
    }, [candidateBlock])


    async function createBlock() {
        const timestamp = +new Date();
        const username = await user.get('alias');
        const res = await fetch(`${API_URL}/prevblock`);
        const prevBlock = await res.json();
        let tempCB = {
            timestamp: timestamp,
            hash: '',
            prevHash: prevBlock.hash,
            height: prevBlock.height + 1,
            difficulty: DIFFICULTY,
            miner: username,
            merkleRoot: '',
        }
        gun.get('miners').get(userKU).put({
            candidateBlock: tempCB
        }).then(() => {
            notify('Block created!')
            tempCB.transactions = {}
            setCandidateBlock(tempCB)
        })
    }

    function findHash(previousHash, timestamp, merkleRoot, nonce) {
        return SHA256(previousHash + timestamp + merkleRoot + nonce).toString();
    }

    function checkDifficulty(hash, DIFFICULTY) {
        return hash.substr(0, DIFFICULTY) === "0".repeat(DIFFICULTY)
    }

    async function BroadcastBlock(e) {
        e.preventDefault();
        setLoading(true)
        let tempCB = candidateBlock;
        // delete tempCB['_'];
        tempCB.accepted = {
            block: false
        };
        tempCB.rejected = { block: false };
        tempCB.coinBase = blockCBTx;
        tempCB.transactions = Object.assign({}, blockTx);


        gun.get('pending-blocks').put({ [tempCB.hash]: tempCB }).then(() => {
            gun.get('miners').get(userKU).put({
                candidateBlock: null
            })
        }).then(() => {
            notify('Block broadcast successful!')
            setCandidateBlock(null)
            setNonce(0)
            setBlockTx([])
            setLoading(false)
        })
    }

    return (
        <>
            <ToastContainer />
            {candidateBlock === null ?
                <button onClick={() => {
                    createBlock()
                }}>Create Block</button>
                :
                blockLoading ?
                    <div className='loader'></div>
                    :
                    <form onSubmit={BroadcastBlock} className='container' style={{
                        width: '100%',
                        backgroundColor: blockIsValid ? '' : '#6c3c3c'
                    }}>
                        <div style={{ width: '100%', display: 'flex' }}>
                            <h4 style={{ textAlign: 'left', flex: 1 }}>Block #{candidateBlock.height}</h4>
                            <div style={{ display: 'inline-grid', justifyContent: 'center', alignContent: 'center' }}>
                                <h4 style={{ textAlign: 'right', fontSize: 20, margin: 0 }}>
                                    <GiMiner color='#e5f9ff' /> Mining Duration: {((autoMiningEnd - autoMiningStart) / 1000).toFixed(1)}s</h4>
                                <h4 style={{ textAlign: 'right', fontSize: 20, margin: 0 }}>
                                    <IoMdCube color={colors.link} /> Block Age: {blockTime}</h4>
                            </div>
                        </div>

                        <div className='form-field'>
                            <table style={{ fontSize: 16, textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                <tr><td>Prev. Hash</td> <td>{candidateBlock.prevHash}</td></tr>
                                <tr><td>Difficulty</td> <td>{DIFFICULTY}</td></tr>
                                <tr><td>Merkle Root</td> <td>{candidateBlock.merkleRoot}</td></tr>
                                <tr><td>Hash (POW)</td> <td>{autoMining ?
                                    <div className='loader'
                                        style={{ width: 20, height: 20 }}></div>
                                    :
                                    candidateBlock.hash}</td></tr>
                            </table>
                        </div>
                        <div className='form-field'>
                            <label>Transactions</label>

                            <table style={{ fontSize: 16 }}>
                                <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                    <tr><td>Hash</td> <td>{blockCBTx.hash}</td></tr>
                                    <tr><td>Block Reward</td> <td>{blockCBTx.reward} {COIN_SYMBOL}</td></tr>
                                    <tr><td>Fee Reward</td> <td>{blockCBTx.fee} {COIN_SYMBOL}</td></tr>
                                </div>
                                {blockTx.map((transaction, index) => (
                                    <div key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                        <tr><td>Hash</td> <td>{transaction}</td></tr>
                                        {/* <tr><td>Fee</td> <td>{transaction.amount} {COIN_SYMBOL}</td></tr> */}
                                    </div>
                                ))
                                }
                                <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                    <tr>Add transaction to block,&nbsp;<Link to={'/unconfirmed-tx'}>add now</Link></tr>
                                </div>
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