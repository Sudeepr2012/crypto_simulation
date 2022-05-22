import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaReceipt } from 'react-icons/fa'
import { ToastContainer } from 'react-toastify';
import { colors } from '../others/Colors';
import { getTDate, roundAmont } from '../others/GetDate';
import { API_URL, COIN_SYMBOL } from '../Strings';

export default function AllTXs({ gun }) {
    const [loading, setLoading] = useState(true)
    const [txs, setTxs] = useState()

    useEffect(() => {
        setLoading(true)
        setTxs()
        async function getTxs() {
            const res = await fetch(`${API_URL}/txs`);
            const data = await res.json();
            setTxs(data)
        }
        getTxs()
        gun.get('transactions').on(() => getTxs())
    }, [])

    useEffect(() => {
        if (txs)
            setLoading(false)
    }, [txs])


    return (
        <>
            <ToastContainer />
            {loading ?
                <center><div className='loader'></div>
                    <div style={{ fontStyle: 'italic', fontSize: 18 }}>Getting transactions...</div></center>
                :

                <div className='blocks-table'>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <h4 style={{ textAlign: 'left', flex: 1, marginLeft: '5%' }}><FaReceipt color={colors.link} /> All Transactions</h4>
                    </div>
                    {txs.length > 0 ?
                        <table style={{ margin: 'auto', width: '90%' }}>
                            <thead>
                                <tr style={{ display: 'contents' }}>
                                    <th scope="col">Hash</th>
                                    <th scope="col">Block</th>
                                    <th scope="col">Timestamp</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Fee</th>
                                </tr>
                            </thead>

                            <tbody>
                                {txs.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map((tx, i) => (
                                    <tr key={i}>
                                        <td data-label="Hash"><Link to={`/tx/${tx.hash}`}>{(tx.hash).substring(0, 30)}...</Link></td>
                                        <td data-label="Block">
                                            {!isNaN(tx.block) ?
                                                <Link to={`/block/${tx.block}`}>{tx.block}</Link>
                                                :
                                                tx.block
                                            }
                                        </td>
                                        <td data-label="Timestamp">{getTDate(new Date(tx.timestamp))}</td>
                                        <td data-label="Amount">{roundAmont(tx.amount)} {COIN_SYMBOL}</td>
                                        <td data-label="Fee">{tx.fee} {COIN_SYMBOL}</td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                        :
                        'No transaction'
                    }
                </div>
            }
        </>
    )
}