import { useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "../Others/Colors";

const address = 'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs'

const transactions = [
    {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        from: 'jhgj58svnmfsj56kgdjsk4lr90fgkhjsrw',
        to: 'jhgj58svnmfsj56kgdjsk4lr90fgkhjsrw',
        timestamp: '2022-03-12 13:43',
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
        timestamp: '2022-03-12 13:43',
        block: 0,
        fee: 0.022,
        amount: 120,
        value: '$30000',
        totalIP: 140,
        totalOP: 125,
    }
]

function ViewAddress() {

    const { address } = useParams()
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
            <h4 style={{ textAlign: 'left' }}><IoMdCube color={colors.link} /> Details</h4>
            <table>
                <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                    <tr><td>Address</td> <td>{address} <FaCopy
                        onClick={() => {
                            navigator.clipboard.writeText(address)
                            notify('Address')
                        }} /></td></tr>
                    <tr><td>Transactions</td> <td>{transactions.length}</td></tr>
                    <tr> <td>Recieved</td>
                        <td>134 SC</td>
                    </tr>
                    <tr><td>Sent</td> <td>100 SC</td></tr>
                    <tr><td>Balance</td> <td>34 SC</td></tr>
                </div>
            </table>
            <h4 style={{ textAlign: 'left' }}>Transactions</h4>
            <table>
                {transactions.map((transaction, index) => (
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Hash</td> <td><Link to={`/tx/${transaction.hash}`}>{transaction.hash}</Link> <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(transaction.hash)
                                notify('Hash')
                            }} /></td></tr>
                        <tr><td>Timestamp</td> <td>{transaction.timestamp}</td></tr>
                        <tr><td>From</td> <td><Link to={`/address/${transaction.from}`}>{transaction.from}</Link> <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(transaction.from)
                                notify('Address')
                            }} /></td></tr>
                        <tr><td>To</td> <td><Link to={`/address/${transaction.to}`}>{transaction.to}</Link> <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(transaction.to)
                                notify('Address')
                            }} /></td></tr>
                        <tr><td>Amount</td> <td>{transaction.amount} SC</td></tr>
                        <tr><td>Fee</td> <td>{transaction.fee} SC</td></tr>
                    </div>
                ))}
            </table>
        </div>
    )
}
export default ViewAddress