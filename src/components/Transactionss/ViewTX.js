
import { FaCopy } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaReceipt } from 'react-icons/fa'
import { colors } from '../Others/Colors';


const blockHeigth = 7;
const tx = {
    hash: 'tx-uitr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
    from: 'MErdf53hgh-45gfxsq-vv83r352wgdsf4',
    to: 'YOUrdf53hgh-45gfxsq-vv83r352wgdsf4',
    status: 'Unconfirmed',
    time: '2022-03-24 15:12',
    inputs: ['ip1', 'ip2', 'ip3'],
    outputs: [
        {
            address: 'YOUrdf53hgh-45gfxsq-vv83r352wgdsf4',
            amount: 250,
        },
        {
            address: 'MErdf53hgh-45gfxsq-vv83r352wgdsf4',
            amount: 20,
        },
    ],
    block: 'Mempool',
    fee: 30,
    totalIP: 300,
    totalOP: 270,
    value: '$5000'
}

const UTXO = {
    'ip1': {
        address: 'adr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
        amount: 50,
        timestamp: '2022-03-24 15:12'
    },
    'ip2': {
        address: 'adr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
        amount: 100,
        timestamp: '2022-03-24 15:12'
    },
    'ip3': {
        address: 'adr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
        amount: 120,
        timestamp: '2022-03-24 15:12'
    },
}

function ViewTX() {

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
        <div style={{ width: '1800px', maxWidth: '90%' }}>
            <ToastContainer />
            <h4 style={{ textAlign: 'left' }}><FaReceipt color={colors.link} /> Transaction Details</h4>
            <table>
                <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                    <tr><td>Hash</td> <td>{tx.hash} <FaCopy
                        onClick={() => {
                            navigator.clipboard.writeText(tx.hash)
                            notify('Hash')
                        }} /></td></tr>
                    <tr><td>Time</td> <td>{tx.time}</td></tr>
                    <tr><td>Status</td> <td
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
                    <tr> <td>Confirmations</td> <td>
                        {!isNaN(tx.block) ? ((blockHeigth - tx.block) + 1) : 0}</td></tr>
                    <tr><td>Total Input</td> <td>{tx.totalIP} SC</td></tr>
                    <tr><td>Total Output</td> <td>{tx.totalOP} SC</td></tr>
                    <tr><td>Fee</td> <td>{tx.fee} SC</td></tr>
                    <tr><td>Value</td> <td>{tx.value}</td></tr>
                </div>
            </table>

            <h4 style={{ textAlign: 'left' }}>Inputs</h4>
            <table>
                {tx.inputs.map((transaction, index) => (
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Index</td> <td>{index}</td></tr>
                        <tr><td>Address</td> <td>{UTXO[transaction].address} <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(UTXO[transaction].address)
                                notify('Address')
                            }} /></td></tr>
                        <tr><td>Output</td> <td>{UTXO[transaction].amount}</td></tr>
                    </div>
                ))}
            </table>

            <h4 style={{ textAlign: 'left' }}>Outputs</h4>
            <table>
                {tx.outputs.map((transaction, index) => (
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Index</td> <td>{index}</td></tr>
                        <tr><td>Address</td> <td>{transaction.address} <FaCopy
                            onClick={() => {
                                navigator.clipboard.writeText(transaction.address)
                                notify('Address')
                            }} /></td></tr>
                        <tr><td>Output</td> <td>{transaction.amount}</td></tr>
                    </div>
                ))}
            </table>
        </div>
    )
}
export default ViewTX;