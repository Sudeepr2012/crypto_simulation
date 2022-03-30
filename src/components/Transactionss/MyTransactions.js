import { useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { colors } from '../Others/Colors';

const blockHeigth = 7;
const myTransactions = [
    {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        from: 'jhgj58svnmfsj56k,sk4lr90fgkhjsrw',
        status: 'Confirmed',
        time: '2022-03-12 13:43',
        block: 1,
        fee: '10',
        value: '$30000',
        totalIP: '1520',
        totalOP: '1510',
    },
    {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        to: 'gjf8j43-dfjgj404r4-vvfrg3r352wgwf4',
        status: 'Confirmed',
        time: '2022-03-23 18:26',
        block: 3,
        fee: '10',
        value: '$20000',
        totalIP: '1320',
        totalOP: '1310',
    },
    {
        hash: 'tx-jhgfefffce975208c1b15fecb2abddb4546547eawffwvd3cbcc8fcrtrtrtt540',
        to: 'rdf53hgh-45gfxsq-vv83r352wgdsf4',
        status: 'Rejected',
        time: '2022-03-23 12:18',
        block: '-',
        fee: '0',
        value: '$50000',
        totalIP: '1320',
        totalOP: '1320',
    },
    {
        hash: 'tx-uitr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
        to: 'rdf53hgh-45gfxsq-vv83r352wgdsf4',
        status: 'Unconfirmed',
        time: '2022-03-24 15:12',
        block: 'Mempool',
        fee: '6',
        totalIP: '300',
        totalOP: '224',
        value: '$5000'
    },
]
myTransactions.reverse()

function MyTransactions({ UTXO }) {

    const [filterTx, setFilterTx] = useState('utxo')

    const notify = () => toast('✔️ Transaction hash copied!', {
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
                    myTransactions.map((transaction, index) => (
                        <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr><td>Hash</td> <td>{transaction.hash}</td></tr>
                            {transaction.to === undefined ?
                                <tr><td>From</td> <td>{transaction.from}</td></tr>
                                :
                                <tr><td>To</td> <td>{transaction.to}</td></tr>
                            }
                            <tr><td>Time</td> <td>{transaction.time}</td></tr>
                            <tr><td>Status</td> <td
                                style={{
                                    color: transaction.status === 'Unconfirmed' ? 'yellow' :
                                        transaction.status === 'Confirmed' ? colors.ligthGreen : 'red'
                                }}>{transaction.status}</td></tr>
                            <tr> <td>Block</td>
                                {!isNaN(transaction.block) ?
                                    <td><Link to={`/block/${transaction.block}`}>#{transaction.block}</Link></td>
                                    :
                                    <td>{transaction.block}</td>
                                }
                            </tr>
                            <tr> <td>Confirmations</td> <td>
                                {!isNaN(transaction.block) ? ((blockHeigth - transaction.block) + 1) : 0}</td></tr>
                            <tr><td>Total Input</td> <td>{transaction.totalIP} SC</td></tr>
                            <tr><td>Total Output</td> <td>{transaction.totalOP} SC</td></tr>
                            <tr><td>Fee</td> <td>{transaction.fee} SC</td></tr>
                            <tr><td>Value</td> <td>{transaction.value}</td></tr>
                            {/* (total Output - change) */}
                        </div>
                    ))
                    :
                    UTXO.map((transaction, index) => (
                        <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                            <tr><td>Hash</td> <td>{transaction.hash} <FaCopy
                                onClick={() => {
                                    navigator.clipboard.writeText(transaction.hash)
                                    notify()
                                }} /></td></tr>
                            <tr><td>Amount</td> <td>{transaction.amount} SC</td></tr>
                        </div>
                    ))
                }
            </table>
        </>
    )
}
export default MyTransactions