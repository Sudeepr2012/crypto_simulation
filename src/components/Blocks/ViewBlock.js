import { useEffect, useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "../others/Colors";
import { getTDate, roundAmont } from "../others/GetDate";
import { notify } from "../others/Notify";
import { API_URL, COIN_SYMBOL } from "../Strings";

function ViewBlock() {
    const { bHeight } = useParams()
    const [block, setBlock] = useState()
    const [blockTx, setBlockTx] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setBlockTx([])
        async function getBlock() {
            const res = await fetch(`${API_URL}/block?${new URLSearchParams({ height: bHeight }).toString()}`);
            const data = await res.json();
            if (data.length) {
                setBlock(data[0])
                setBlockTx(data[1])
            } else {
                setBlock('error')
            }
        }
        getBlock();
    }, [bHeight])

    useEffect(() => {
        if (block)
            setLoading(false)
    }, [block])
    return (
        <div style={{ width: '1800px', maxWidth: '90%' }}>
            <ToastContainer />
            {loading ?
                <center><div className="loader"></div></center>
                :
                block !== 'error' ?
                    <>
                        <h4 style={{ textAlign: 'left' }}><IoMdCube color={colors.link} /> Block #{block.height}</h4>
                        <table style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr><td>Hash</td> <td>{block.hash} <FaCopy
                                onClick={() => {
                                    navigator.clipboard.writeText(block.hash)
                                    notify('✔️ Hash copied!')
                                }} /></td></tr>
                            <tr><td>Confirmations</td> <td>{block.confirmations}</td></tr>
                            <tr> <td>Height</td>
                                <td><Link to={`/block/${block.height}`}>#{block.height}</Link></td>
                            </tr>
                            <tr><td>Timestamp</td> <td>{getTDate(new Date(block.timestamp))}</td></tr>
                            <tr><td>Miner</td> <td>{block.miner}</td></tr>
                            <tr><td>Nonce</td> <td>{block.nonce}</td></tr>
                            <tr><td>Difficulty</td> <td>{block.difficulty}</td></tr>
                            <tr><td>Merkle Root</td> <td>{block.merkleRoot}</td></tr>
                            <tr><td>Transactions</td> <td>{block.txCount}</td></tr>
                            <tr><td>Block Reward</td> <td>{roundAmont(block.blockReward)} {COIN_SYMBOL}</td></tr>
                            <tr><td>Fee Reward</td> <td>{block.feeReward} {COIN_SYMBOL}</td></tr>
                        </table>
                        <h4 style={{ textAlign: 'left' }}>Block Transactions</h4>
                        {blockTx.map((transaction, index) => (
                            <table key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                                <tr><td>Hash</td> <td><Link to={`/tx/${transaction.hash}`}>{transaction.hash}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.hash)
                                        notify('✔️ Hash copied!')
                                    }} /></td></tr>
                                <tr><td>Amount</td> <td>{roundAmont(transaction.amount)} {COIN_SYMBOL}</td></tr>
                                <tr><td>Fee</td> <td>{transaction.fee} {COIN_SYMBOL}</td></tr>
                                <tr><td>From</td> <td><Link to={`/address/${transaction.from}`}>{transaction.from}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.from)
                                        notify('✔️ Address copied!')
                                    }} /></td></tr>
                                <tr><td>To</td> <td><Link to={`/address/${transaction.to}`}>{transaction.to}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.to)
                                        notify('✔️ Address copied!')
                                    }} /></td></tr>
                            </table>
                        ))}
                    </>
                    :
                    'Block not found !'
            }
        </div>
    )
}
export default ViewBlock