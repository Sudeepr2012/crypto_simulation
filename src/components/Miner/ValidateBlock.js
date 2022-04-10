import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { getAcctType } from '../Others/GetAcctType';
import { colors } from "../Others/Colors";
import { deleteUTXO, putUTXO } from "../Transactions/UTXO";
import { addToBC } from "../Blocks/AddBlockToBC";
import { confirmTx } from "../Transactions/PutUserTx";

function ValidateBlock({ gun, user }) {

    const [validateLoading, setValidateLoading] = useState({})
    const [validationTracker, setValidationTracker] = useState(false)
    const [pendingBlocks, setPendingBlocks] = useState({})
    const [acctType, setAcctType] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setPendingBlocks({})
        gun.get('pending-blocks').once((blocks) => {
            console.log(blocks)
            Object.keys(blocks).map((key) => {
                if (key !== '_' && blocks[key]) {
                    gun.get('pending-blocks').get(key).then((block) => {
                        gun.get(`pending-blocks/${key}/transactions`).once((tx) => {
                            console.log(tx)
                        })
                        gun.get(`pending-blocks/${key}/coinBase`).once((cb) => {
                            console.log(cb)
                            block.coinBaseTx = cb
                        })
                        gun.get(`pending-blocks/${key}/accepted`).once((accepted) => {
                            if (!accepted || !accepted[user.is.pub]) {
                                gun.get(`pending-blocks/${key}/rejected`).once((rejected) => {
                                    if (!rejected || !rejected[user.is.pub]) {
                                        block.key = key;
                                        setPendingBlocks(pendingBlocks => ({ ...pendingBlocks, [key]: block }))
                                    }
                                })
                            }
                        })
                    })
                }
            })
        })

    }, [validationTracker])

    console.log(pendingBlocks)
    useEffect(() => {
        setValidateLoading({})
        Object.keys(pendingBlocks).map(key => (
            setValidateLoading(validateLoading => ({
                ...validateLoading,
                [key]: false
            }))
        ))
    }, [pendingBlocks])

    useEffect(() => {
        if (acctType === true || acctType === false)
            updateDet()
        else
            if (acctType !== 'miner')
                navigate('/dashboard')
            else {
                //get miner dets
            }
        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }
    }, [acctType])

    function validateBlock(key, action) {
        setValidateLoading(validateLoading => ({
            ...validateLoading,
            [key]: true
        }));
        gun.get(`pending-blocks/${key}/${action}`).put({
            [user.is.pub]: true
        }).then(() =>
            gun.get(`pending-blocks/${key}/${action}`).once((count) => {
                gun.get('miners').then(async (miners) => {
                    if ((((Object.keys(count).length - 1) / (Object.keys(miners).length - 1)) * 100) > 50) {
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
                            const blockTx = [
                                {
                                    hash: pendingBlocks[key].coinBaseTx.hash,
                                    amount: pendingBlocks[key].coinBaseTx.reward,
                                    fee: 0,
                                    from: 'CoinBase Reward',
                                    to: pendingBlocks[key].coinBaseTx.to,
                                    timestamp: pendingBlocks[key].coinBaseTx.timestamp,
                                    inputs: txIP,
                                    outputs: txOP
                                }
                            ]
                            // blockTx.push()
                            const blockToAdd = {
                                hash: pendingBlocks[key].hash,
                                height: pendingBlocks[key].height,
                                nonce: pendingBlocks[key].nonce,
                                timestamp: pendingBlocks[key].timestamp,
                                miner: pendingBlocks[key].miner,
                                difficulty: pendingBlocks[key].difficulty,
                                merkleRoot: pendingBlocks[key].merkleRoot,
                                txCount: blockTx.length,
                                blockReward: pendingBlocks[key].coinBaseTx.reward,
                                feeReward: pendingBlocks[key].coinBaseTx.fee,

                            }
                            await confirmTx(blockTx, pendingBlocks[key].height)
                            await addToBC(blockToAdd, blockTx);
                            await putUTXO(pendingBlocks[key].coinBaseTx.hash, txOP);
                            await deleteUTXO(txIP)
                        }
                        gun.get('pending-blocks').put({ [key]: null }).then(() => {
                            setValidationTracker(!validationTracker)
                        })
                    } else
                        setValidationTracker(!validationTracker)
                })
            })
        )
    }

    const notify = (msg) => toast(`✔️ ${msg} copied!`, {
        position: "top-right",
        autoClose: 1000,
        style: { background: colors.lighter, color: colors.white },
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    return (
        <div style={{ width: '1800px', maxWidth: '90%' }}>
            <ToastContainer />
            <h4 style={{ textAlign: 'left' }}>Pending Blocks</h4>
            {Object.values(pendingBlocks).map((block, index) => (
                block ?
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
                        <tr><td>Timestamp</td> <td>{block.timestamp}</td></tr>
                        <tr><td>Transactions</td> <td>
                            {/* {block.transactions.map((tx, ind) => (
                            <div key={ind}>
                                <Link to={`/tx/${tx}`}>{tx}</Link>
                            </div>
                        ))} */}
                            {Object.keys(block.transactions).length}
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
                    :
                    null
            ))}
        </div>
    )
}
export default ValidateBlock