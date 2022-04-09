import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiMiner } from 'react-icons/gi'
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from '../Others/Colors';
import { getAcctType } from '../Others/GetAcctType';
const SHA256 = require("crypto-js/sha256");

const difficulty = 4;
const blockReward = 10;

const notify = (msg) => toast(msg, {
    position: "top-right",
    autoClose: 3000,
    style: { background: colors.lighter, color: colors.white },
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
});


function CandidateBlock({ user, gun }) {
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

    const location = useLocation();

    const navigate = useNavigate()
    useEffect(() => {
        setBlockTx(location.state)
        gun.get('miners').get(user.is.pub).get('candidateBlock').once((val) => {
            if (val)
                setCandidateBlock(val)
            else
                setBlockLoading(false)
            console.log(val)
        })
        window.history.replaceState({}, document.title)
    }, [])

    useEffect(() => {
        if (blockTx !== null && candidateBlock) {
            if (candidateBlock.merkleRoot === '') {
                let tx = [];
                tx.push(candidateBlock.tempCoinBaseHash)
                for (let i = 0; i < blockTx.length; i++)
                    tx.push(blockTx[i])
                calculateMerkleRoot(tx);
            }
        }
    }, [blockTx, candidateBlock])

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
        if (candidateBlock)
            setTimeout(() => setBlockTime(Math.round((+ new Date() - candidateBlock.timestamp) / 1000)), 1000)
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
            if (!checkDifficulty(hash, difficulty)) {
                setAutoMiningStart(+ new Date())
                setShowSubmitButton(false)
                setBlockIsValid(false)
                while (!checkDifficulty(hash, difficulty)) {
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
                let isBlockValid = checkDifficulty(candidateBlock.hash, difficulty);
                setShowSubmitButton(isBlockValid)
                setBlockIsValid(isBlockValid)
            }

        }
        else {
            if (!location.state)
                navigate('/unconfirmed-tx')
        }
    }, [candidateBlock])


    async function createBlock() {
        const timestamp = +new Date();
        gun.get('blockchain').once(async (blocks) => {
            let tempCoinBaseHash = SHA256(blockReward + timestamp + user.is.pub).toString();
            const username = await user.get('alias');
            if (blocks !== undefined) {
                let prevHash, height;
                gun.get('blockchain').get(Object.keys(blocks).length - 2).once((val) => {
                    prevHash = val.hash;
                    height = Object.keys(blocks).length - 1;
                }).then(() => {
                    let tempCB = {
                        timestamp: timestamp,
                        hash: '',
                        prevHash: prevHash,
                        height: height,
                        difficulty: difficulty,
                        miner: username,
                        merkleRoot: '',
                        tempCoinBaseHash: tempCoinBaseHash,
                    }
                    gun.get('miners').get(user.is.pub).put({
                        candidateBlock: tempCB
                    }).then(() => {
                        notify('Block created!')
                        tempCB.transactions = {}
                        setCandidateBlock(tempCB)
                    })
                })
            } else {
                let tempCB = {
                    timestamp: timestamp,
                    hash: '',
                    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
                    height: 0,
                    difficulty: difficulty,
                    miner: username,
                    merkleRoot: '',
                    tempCoinBaseHash: tempCoinBaseHash
                }
                gun.get('miners').get(user.is.pub).put({
                    candidateBlock: tempCB
                }).then(() => {
                    notify('Block created!')
                    tempCB.transactions = {}
                    setCandidateBlock(tempCB)
                })
            }

        })
    }

    function calculateMerkleRoot(tx) {
        console.log(tx)
        if (tx.length === 1) {
            setCandidateBlock(candidateBlock => ({ ...candidateBlock, merkleRoot: tx[0] }), setBlockLoading(false))
            let feeReward = 0;
            blockTx.map((bTx) => {
                gun.get('mempool').get(bTx).once((val) => feeReward += val.fee)
            })
            setBlockCBTx({
                hash: candidateBlock.tempCoinBaseHash,
                fee: feeReward,
                reward: feeReward + blockReward,
                timestamp: +new Date(),
                to: user.is.pub
            });
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

    function findHash(previousHash, timestamp, merkleRoot, nonce) {
        return SHA256(previousHash + timestamp + merkleRoot + nonce).toString();
    }

    function checkDifficulty(hash, difficulty) {
        return hash.substr(0, difficulty) === "0".repeat(difficulty)
    }

    function BroadcastBlock(e) {
        e.preventDefault();
        setLoading(true)
        let tempCB = candidateBlock;
        delete tempCB.tempCoinBaseHash;
        delete tempCB['_'];
        // tempCB.coinBase = blockCBTx;
        tempCB.transactions = Object.assign({}, blockTx);
        tempCB.accepted = {
            // [user.is.pub] : true
        };
        tempCB.rejected = {};
        console.log(tempCB)
        gun.get('pending-blocks').put({ [tempCB.hash]: tempCB }).then(() => {
            gun.get('pending-blocks').get(tempCB.hash).put({
                coinBase: blockCBTx
            }).then(() => {
                gun.get('miners').get(user.is.pub).put({
                    candidateBlock: null
                }).then(() => {
                    console.log('Block broadcast successful!')
                    setLoading(false)
                })
            })
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
                                    <IoMdCube color={colors.link} /> Total Block time: {blockTime}s</h4>
                            </div>
                        </div>

                        <div className='form-field'>
                            <table style={{ fontSize: 16, textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                <tr><td>Prev. Hash</td> <td>{candidateBlock.prevHash}</td></tr>
                                <tr><td>Difficulty</td> <td>{difficulty}</td></tr>
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
                                    <tr><td>Block Reward</td> <td>{blockCBTx.reward} SC</td></tr>
                                    <tr><td>Fee Reward</td> <td>{blockCBTx.fee} SC</td></tr>
                                </div>
                                {blockTx.length > 0 ?
                                    <>
                                        {blockTx.map((transaction, index) => (
                                            <div key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                                <tr><td>Hash</td> <td>{transaction}</td></tr>
                                                {/* <tr><td>Fee</td> <td>{transaction.amount} SC</td></tr> */}
                                            </div>
                                        ))
                                        }
                                    </>
                                    :
                                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 5, padding: 10 }}>
                                        <tr>Block has no other transaction,&nbsp;<Link to={'/unconfirmed-tx'}>add now</Link></tr>
                                    </div>
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