
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { FaReceipt } from 'react-icons/fa'
import { colors } from '../Others/Colors';
import { useEffect, useState } from 'react';
import { getLastBlock } from '../Blockchain/Blocks/GetLastBlock';
import { calculateDate } from '../Others/CalculateDate';

function ViewTX({ gun }) {

    const { txHash } = useParams();
    const [tx, setTx] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const txPath = gun.get(`transactions/${txHash}`);
        async function getTx() {
            setTx(await txPath.then(async (tx) => {
                if (tx) {
                    let txData = {
                        hash: txHash,
                        inputs: [],
                        outputs: [],
                        status: isNaN(tx.block) ? 'Unconfirmed' : 'Confirmed',
                        timestamp: calculateDate(new Date(tx.timestamp)),
                        confirmations: (await getLastBlock() - tx.block) + 1,
                        block: tx.block,
                        fee: 0,
                        totalIP: 0,
                        totalOP: 0
                    };
                    txPath.get('inputs').map((ip) => {
                        //remove condition later (error due to change in data structure)
                        if (ip.amount) {
                            txData.fee += ip.fee ? ip.fee : 0; ///feein only first ip
                            txData.totalIP += ip.amount;
                            txData.inputs.push(ip);
                        }
                    })
                    txPath.get('outputs').map((op) => {
                        if (op.amount) {
                            txData.totalOP += op.amount
                            txData.outputs.push(op)
                        }
                    })
                    //remove first input (inputs[0] = from address, total amount & fee. inputs[1+] = UTXOs)
                    txData.by = txData.inputs.shift()
                    return txData
                } else {
                    return null
                }
            })
            )
        }
        getTx();
    }, [])

    useEffect(() => {
        if (tx || tx === null)
            setLoading(false);
    }, [tx])

    const notify = (msg) => toast(`✔️ ${msg} copied!`, {
        position: "top-right",
        autoClose: 2000,
        style: { background: colors.lighter, color: colors.white },
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    return (
        loading ?
            <div className='loader'></div>
            :
            tx ?
                <div style={{ width: '90%', maxWidth: '1800px' }}>
                    <ToastContainer />
                    <h4 style={{ textAlign: 'left' }}><FaReceipt color={colors.link} /> Transaction Details</h4>
                    <table style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Hash</td><td>{tx.hash} <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(tx.hash)
                                notify('Hash')
                            }} /></td></tr>
                        <tr><td>By</td><td><Link to={`/address/${tx.by.address}`}>{tx.by.address}</Link> <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(tx.by.address)
                                notify('Address')
                            }} /></td></tr>
                        <tr><td>Time</td><td>{tx.timestamp}</td></tr>
                        <tr><td>Status</td><td
                            style={{
                                color: tx.status === 'Unconfirmed' ? 'yellow' : '#76ff76'
                            }}>{tx.status}</td></tr>
                        <tr> <td>Block</td>
                            {!isNaN(tx.block) ?
                                <td><Link to={`/block/${tx.block}`}>#{tx.block}</Link></td>
                                :
                                <td>{tx.block}</td>
                            }
                        </tr>
                        <tr><td>Confirmations</td>
                            <td>{tx.confirmations}</td></tr>
                        <tr><td>Total Input</td><td>{tx.totalIP} SC</td></tr>
                        <tr><td>Total Output</td><td>{tx.totalOP} SC</td></tr>
                        <tr><td>Fee</td><td>{tx.fee} SC</td></tr>
                        {/* <tr><td>Value</td><td>{tx.value}</td></tr> */}
                    </table>

                    <h4 style={{ textAlign: 'left' }}>Inputs</h4>

                    {tx.inputs.length > 0 ?
                        tx.inputs.map((transaction, index) => (
                            <table key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                                <tr><td>Index</td> <td>{index}</td></tr>
                                <tr><td>Address</td> <td><Link to={`/tx/${transaction.address}`}>{transaction.address}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.address)
                                        notify('Address')
                                    }} /></td></tr>
                                <tr><td>Output</td> <td>{transaction.amount} SC</td></tr>
                            </table>
                        ))
                        :
                        <table style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr>No input</tr>
                        </table>}

                    <h4 style={{ textAlign: 'left' }}>Outputs</h4>
                    {tx.outputs.map((transaction, index) => (
                        <table key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr><td>Index</td> <td>{index}</td></tr>
                            <tr><td>Address</td> <td><Link to={`/address/${transaction.address}`}>{transaction.address}</Link> <FaCopy
                                onClick={() => {
                                    navigator.clipboard.writeText(transaction.address)
                                    notify('Address')
                                }} /></td></tr>
                            <tr><td>Output</td> <td>{transaction.amount} SC</td></tr>
                        </table>
                    ))}
                </div>
                :
                'Transaction not found !'
    )
}
export default ViewTX;