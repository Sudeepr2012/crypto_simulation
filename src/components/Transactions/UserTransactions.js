import { useEffect, useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { colors } from '../Others/Colors';

function UserTransactions({ myTx, UTXO }) {

    const [filterTx, setFilterTx] = useState('utxo')

    function notify(msg) {
        toast(`✔️ ${msg} copied!`, {
            position: "top-right",
            autoClose: 1000,
            style: { background: colors.lighter, color: colors.white },
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    return (
        <>
            <div style={{ width: '100%' }}>
                <select style={{ maxWidth: 80, float: 'right' }}
                    value={filterTx}
                    onChange={(e) => setFilterTx(e.target.value)}>
                    <option value={'all'}>ALL</option>
                    <option value={'utxo'}>UTXO</option>
                </select>
            </div>
            <br />
            <table>
                {filterTx === 'all' ?
                    Object.keys(myTx).length > 0 ?
                        Object.keys(myTx).reverse().map((key, index) => (
                            <div key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                                <tr><td>Hash</td> <td><Link to={`/tx/${myTx[key].hash}`}>{myTx[key].hash}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(myTx[key].hash)
                                        notify('Transaction hash')
                                    }} /></td></tr>
                                {myTx[key].from ?
                                    <tr><td>From</td> <td><Link to={`/address/${myTx[key].from}`}>{myTx[key].from}</Link> <FaCopy
                                        onClick={() => {
                                            navigator.clipboard.writeText(myTx[key].from)
                                            notify('Address')
                                        }} /></td></tr>
                                    :
                                    <tr><td>To</td> <td><Link to={`/address/${myTx[key].to}`}>{myTx[key].to}</Link> <FaCopy
                                        onClick={() => {
                                            navigator.clipboard.writeText(myTx[key].to)
                                            notify('Address')
                                        }} /></td></tr>
                                }
                                <tr><td>Time</td> <td>{myTx[key].timestamp}</td></tr>
                                <tr><td>Status</td> <td
                                    style={{
                                        color: isNaN(myTx[key].block) ? 'yellow' :
                                            colors.ligthGreen
                                    }}>{isNaN(myTx[key].block) ? 'Unconfirmed' : 'Confirmed'}</td></tr>
                                <tr> <td>Block</td>
                                    {!isNaN(myTx[key].block) ?
                                        <td><Link to={`/block/${myTx[key].block}`}>#{myTx[key].block}</Link></td>
                                        :
                                        <td>{myTx[key].block}</td>
                                    }
                                </tr>
                                <tr> <td>Confirmations</td> <td>{myTx[key].confirmations}</td></tr>
                                <tr><td>Amount</td> <td>{myTx[key].amount} SC</td></tr>
                                {myTx[key].fee ? <tr><td>Fee</td> <td>{myTx[key].fee} SC</td></tr> : null}
                                {/* (total Output - change) */}
                            </div>
                        ))
                        :
                        <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr>Address do not have any transaction </tr>
                        </div>
                    :
                    Object.keys(UTXO).length > 0 ?
                        Object.keys(UTXO).reverse().map((key, index) => (
                            <div key={index} style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                                <tr><td>Hash</td> <td><Link to={`/tx/${key}`}>{key}</Link> <FaCopy
                                    onClick={() => {
                                        navigator.clipboard.writeText(key)
                                        notify('Transaction hash')
                                    }} /></td></tr>
                                <tr><td>Amount</td> <td>{UTXO[key]} SC</td></tr>
                            </div>
                        ))
                        :
                        <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr>Address do not have any unspent transaction output</tr>
                        </div>
                }
            </table>
        </>
    )
}
export default UserTransactions