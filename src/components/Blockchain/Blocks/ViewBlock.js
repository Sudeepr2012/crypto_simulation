import { useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "../../Others/Colors";

const address = 'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs'

const block = {
    hash: '0000d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
    prev: '000000',
    height: 0,
    difficulty: 13684,
    miner: {
        name: 'MinerY',
        pubKey: 'minerKU'
    },
    nonce: 46426,
    timestamp: '2022-03-22 12:11',
    transactions: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
    merkleRoot: 'jhkgfksg',
    txVolume: 200,
    blockReward: 6.042,
    feeReward: 0.042
}

const transactions = [
    {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        from: 'jhgj58svnmfsj56kgdjsk4lr90fgkhjsrw',
        to: 'jhgj58svnmfsj56kgdjsk4lr90fgkhjsrw',
        time: '2022-03-12 13:43',
        block: 0,
        fee: 0.020,
        amount: 50,
        value: '$2000',
        totalIP: 60,
        totalOP: 50,
    },
    {
        hash: 'tx-iygh9j-hth56thgh6dhtey5y54uwyj45ei8egy6u5ef5h5thy7ufyjh78iuh6hb75u',
        from: 'jhgj58svnmfsj56gsk4lr90fgkhjsrw',
        to: 'jhgj58svnmfsj56kgdjsk4lr90fgkhjsrw',
        time: '2022-03-12 13:43',
        block: 0,
        fee: 0.022,
        amount: 120,
        value: '$30000',
        totalIP: 140,
        totalOP: 125,
    }
]

function ViewBlock() {

    const { bHeight } = useParams()
    const [filterTx, setFilterTx] = useState('utxo')

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
            <h4 style={{ textAlign: 'left' }}><IoMdCube color={colors.link} /> Block #{bHeight}</h4>
            <table style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                <tr><td>Hash</td> <td>{block.hash} <FaCopy
                    onClick={() => {
                        navigator.clipboard.writeText(block.hash)
                        notify('Hash')
                    }} /></td></tr>
                <tr><td>Confirmations</td> <td>8</td></tr>
                <tr> <td>Height</td>
                    <td><Link to={`/block/${block.height}`}>#{block.height}</Link></td>
                </tr>
                <tr><td>Timestamp</td> <td>{block.timestamp}</td></tr>
                <tr><td>Miner</td> <td>{block.miner.name}</td></tr>
                <tr><td>Nonce</td> <td>{block.nonce}</td></tr>
                <tr><td>Difficulty</td> <td>{block.difficulty}</td></tr>
                <tr><td>Merkle Root</td> <td>{block.merkleRoot}</td></tr>
                <tr><td>No. of Transactions</td> <td>{block.transactions.length}</td></tr>
                <tr><td>Transaction Volume</td> <td>{block.txVolume} SC</td></tr>
                <tr><td>Block Reward</td> <td>{block.blockReward} SC</td></tr>
                <tr><td>Fee Reward</td> <td>{block.feeReward} SC</td></tr>
            </table>
            <h4 style={{ textAlign: 'left' }}>Block Transactions</h4>
            {transactions.map((transaction, index) => (
                <table key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                    <tr><td>Hash</td> <td><Link to={`/tx/${transaction.hash}`}>{transaction.hash}</Link> <FaCopy
                        onClick={() => {
                            navigator.clipboard.writeText(transaction.hash)
                            notify('Hash')
                        }} /></td></tr>
                    <tr><td>Amount</td> <td>{transaction.amount} SC</td></tr>
                    <tr><td>Fee</td> <td>{transaction.fee} SC</td></tr>
                    <tr><td>From</td> <td>{transaction.from} <FaCopy
                        onClick={() => {
                            navigator.clipboard.writeText(transaction.from)
                            notify('Address')
                        }} /></td></tr>
                    <tr><td>To</td> <td>{transaction.to} <FaCopy
                        onClick={() => {
                            navigator.clipboard.writeText(transaction.to)
                            notify('Address')
                        }} /></td></tr>
                </table>
            ))}
        </div>
    )
}
export default ViewBlock