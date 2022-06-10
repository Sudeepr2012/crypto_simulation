import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { getAcctType } from '../others/GetAcctType';
import { putAllUTXO } from "../transactions/UTXO";
import { addToBC } from "../blocks/AddBlockToBC";
import { confirmTx } from "../transactions/PutUserTx";
import { getTDate } from "../others/GetDate";
import { API_URL } from "../Strings";

export default function ValidateBlock({ gun, user }) {

    const [validateLoading, setValidateLoading] = useState({})
    const [loading, setLoading] = useState(true)
    const [userAddress, setUserAddress] = useState(user.is.pub)
    const [validationTracker, setValidationTracker] = useState(false)
    const [pendingBlocks, setPendingBlocks] = useState()
    const [sortedPendingBlock, setSortedPendingBlock] = useState()
    const [acctType, setAcctType] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        setPendingBlocks()
        async function getPendingBlocks() {
            const res = await fetch(`${API_URL}/pendingBlocks?${new URLSearchParams({ miner: userAddress }).toString()}`);
            const data = await res.json();
            setPendingBlocks(data)
        }
        getPendingBlocks()
    }, [validationTracker])

    useEffect(() => {
        if (pendingBlocks) {
            setLoading(false)
            setValidateLoading({})
            Object.keys(pendingBlocks).map(key => (
                setValidateLoading(validateLoading => ({
                    ...validateLoading,
                    [key]: false
                }))
            ))
            Object.keys(pendingBlocks).map((key) => {
                if (!pendingBlocks[key] || (pendingBlocks[key].accept[userAddress] || pendingBlocks[key].reject[userAddress]))
                    delete pendingBlocks[key];
            })
            const sortPendingBlocks = Object.entries(pendingBlocks).sort(([, b1], [, b2]) => b2.timestamp - b1.timestamp)
            const sorted = Object.fromEntries(sortPendingBlocks)
            setSortedPendingBlock(sorted)
        }
    }, [pendingBlocks])

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

    async function validateBlock(key, action) {
        setValidateLoading(validateLoading => ({
            ...validateLoading,
            [key]: true
        }));
        await gun.get(`pending-blocks/${key}/${action}`).put({
            [userAddress]: true
        }).then(async () => {
            const res = await fetch(`${API_URL}/validateBlock?${new URLSearchParams({ key: key, action: action }).toString()}`);
            const data = await res.json();
            const count = data[0]
            const miners = data[1]
            if ((((Object.keys(count).length - 2) / (Object.keys(miners).length - 1)) * 100) > 50) {
                if (action === 'accepted') {
                    let txOP = {
                        0: {
                            address: pendingBlocks[key].coinBaseTx.to,
                            amount: pendingBlocks[key].coinBaseTx.reward,
                        }
                    }
                    let txIP = {
                        0: {
                            address: 'CoinBase Reward',
                            amount: pendingBlocks[key].coinBaseTx.reward,
                            fee: 0,
                            hash: pendingBlocks[key].coinBaseTx.hash,
                        }
                    }
                    let blockTx = pendingBlocks[key].txs;
                    blockTx.unshift(
                        {
                            hash: pendingBlocks[key].coinBaseTx.hash,
                            amount: pendingBlocks[key].coinBaseTx.reward,
                            fee: 0,
                            block: pendingBlocks[key].height,
                            from: 'CoinBase Reward',
                            to: pendingBlocks[key].coinBaseTx.to,
                            timestamp: pendingBlocks[key].coinBaseTx.timestamp,
                            inputs: txIP,
                            outputs: txOP
                        })
                    const blockToAdd = {
                        hash: pendingBlocks[key].hash,
                        height: pendingBlocks[key].height,
                        nonce: pendingBlocks[key].nonce,
                        timestamp: pendingBlocks[key].timestamp,
                        miner: pendingBlocks[key].miner,
                        difficulty: pendingBlocks[key].difficulty,
                        merkleRoot: pendingBlocks[key].merkleRoot,
                        txCount: blockTx.length,
                        prevHash: pendingBlocks[key].prevHash,
                        blockReward: pendingBlocks[key].coinBaseTx.reward,
                        feeReward: pendingBlocks[key].fee,
                    }
                    await confirmTx(blockTx, pendingBlocks[key].height)
                    await addToBC(blockToAdd, blockTx);
                    await putAllUTXO(blockTx);
                }
                await gun.get('pending-blocks').put({ [key]: null }).then(() => {
                    setValidationTracker(!validationTracker)
                })
            } else
                setValidationTracker(!validationTracker)
        })
    }
    return (
        loading ?
            <center><div className='loader'></div>
                <div style={{ fontStyle: 'italic', fontSize: 18 }}>Getting pending blocks...</div></center>
            :
            <div style={{ width: '1800px', maxWidth: '90%' }}>
                <ToastContainer />
                <h4 style={{ textAlign: 'left' }}>Pending Blocks</h4>

                {Object.keys(sortedPendingBlock).length > 0 ?
                    Object.values(sortedPendingBlock).map((block, index) => (
                        <table key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr><td>Block</td> <td>#{block.height}</td></tr>
                            <tr><td>Hash</td> <td>{block.hash}</td></tr>
                            <tr><td>Previous Hash</td>
                                <td>{block.height > 0 ?
                                    <Link to={`/block/${block.height - 1}`}>{block.prevHash}</Link>
                                    :
                                    block.prevHash
                                }</td>
                            </tr>
                            <tr><td>Timestamp</td> <td>{getTDate(new Date(block.timestamp))}</td></tr>
                            <tr><td>Transactions</td> <td>
                                {block.txsTemp.length > 0 ? block.txsTemp.map((tx, ind) => (
                                    <div key={ind}>
                                        <Link to={`/tx/${tx}`}>{tx ? `${tx.substring(0, 20)}...` : tx}</Link>
                                    </div>
                                ))
                                    :
                                    0}
                            </td></tr>
                            <tr><td>Nonce</td> <td>{block.nonce}</td></tr>
                            <tr><td>Difficulty</td> <td>{block.difficulty}</td></tr>
                            <tr><td>Miner</td> <td><Link to={`/address/${block.coinBaseTx.to}`}>{block.miner}</Link></td></tr>

                            {validateLoading[block.key] ?
                                <div className="loader"></div>
                                :
                                <tr>
                                    <td><button style={{ background: '#00cb00' }}
                                        onClick={() => validateBlock(block.key, 'accepted')}>Valid</button></td>
                                    <td><button style={{ background: 'red' }}
                                        onClick={() => validateBlock(block.key, 'rejected')}>Invalid</button></td>
                                </tr>
                            }
                        </table>
                    ))
                    :
                    'No pending block'
                }
            </div>
    )
}