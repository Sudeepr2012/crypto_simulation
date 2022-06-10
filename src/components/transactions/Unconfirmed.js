import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs'
import { BiErrorCircle } from 'react-icons/bi'
import { GiCancel } from 'react-icons/gi'
import { IoMdCube } from 'react-icons/io'
import { FaReceipt } from 'react-icons/fa'
import { ToastContainer } from 'react-toastify';
import { colors } from '../others/Colors';
import { getAcctType } from '../others/GetAcctType';
import { notify } from '../others/Notify';
import { API_URL, COIN_SYMBOL } from '../Strings';

const AUTHORIZED_TYPE = 'miner';

export default function UnconfirmedTX({ user, gun }) {
    const [loading, setLoading] = useState(true)
    const [acctType, setAcctType] = useState(false);
    const [mempool, setMempool] = useState()
    const [txLoading, setTxLoading] = useState({})
    const [candidateBlockTx, setCandidateBlockTx] = useState([])
    const [candidateBlock, setCandidateBlock] = useState(null)

    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        setMempool()
        async function getUnconfirmedTx() {
            const res = await fetch(`${API_URL}/mempool`);
            const data = await res.json();
            setMempool(data)
            for (let i = 0; i < data.length; i++) {
                setTxLoading(txLoading => ({ ...txLoading, [data[i].hash]: false }))
            }
        }
        getUnconfirmedTx();
        gun.get('transactions').on(() => getUnconfirmedTx())
        if (user.is)
            gun.get(`miners/${user.is.pub}`).once((val) => {
                if (val && val.candidateBlock)
                    gun.get(`miners/${user.is.pub}/candidateBlock`).once((cb) => setCandidateBlock(cb))
            })
    }, [])

    useEffect(() => {
        if (mempool)
            setLoading(false)
    }, [mempool])

    useEffect(() => {
        if (user.is && (acctType === true || acctType === false))
            updateDet()
        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }
    }, [acctType])

    function addTxToBlock(txHash) {
        setTxLoading(txLoading => ({ ...txLoading, [txHash]: true }))
        setCandidateBlockTx(candidateBlockTx => [...candidateBlockTx, txHash],
            setTxLoading(txLoading => ({ ...txLoading, [txHash]: false })))
    }

    function removeTxFromBlock(txHash) {
        setTxLoading(txLoading => ({ ...txLoading, [txHash]: true }))
        setCandidateBlockTx(candidateBlockTx.filter(newTxHash => newTxHash !== txHash),
            setTxLoading(txLoading => ({ ...txLoading, [txHash]: false })))
    }

    return (
        <>
            <ToastContainer />
            {loading ?
                <center><div className='loader'></div>
                    <div style={{ fontStyle: 'italic', fontSize: 18 }}>Getting transactions...</div></center>
                :

                <div className='blocks-table'>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <h4 style={{ textAlign: 'left', flex: 1, marginLeft: '5%' }}><FaReceipt color={colors.link} /> Unconfirmed Transactions</h4>
                        {acctType === AUTHORIZED_TYPE ? <h4 style={{ textAlign: 'right', marginRight: '5%' }}>
                            <IoMdCube onClick={() => navigate('/me/block', { state: candidateBlockTx })} /></h4>
                            :
                            null
                        }
                    </div>
                    {mempool.length > 0 ?
                        <table style={{ margin: 'auto', width: '90%' }}>
                            <thead>
                                <tr style={{ display: 'contents' }}>
                                    <th scope="col">Hash</th>
                                    <th scope="col">Timestamp</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Fee</th>
                                    {acctType === AUTHORIZED_TYPE ? <th scope="col">CB</th> : null}
                                </tr>
                            </thead>

                            <tbody>
                                {mempool.map((utx, i) => (
                                    <tr key={i}>
                                        <td data-label="Hash"><Link to={`/tx/${utx.hash}`}>{utx.hash}</Link></td>
                                        <td data-label="Timestamp">{utx.timestamp}</td>
                                        <td data-label="Amount">{utx.amount} {COIN_SYMBOL}</td>
                                        <td data-label="Fee">{utx.fee} {COIN_SYMBOL}</td>
                                        {acctType === AUTHORIZED_TYPE ?
                                            <td data-label="CB" style={{ cursor: 'pointer' }}>
                                                {candidateBlock ?
                                                    txLoading[i] ? <div className='loader'></div> :
                                                        candidateBlockTx.includes(utx.hash) ?
                                                            <GiCancel color='red' onClick={() => removeTxFromBlock(utx.hash)} />
                                                            :
                                                            <BsCheckLg color={colors.ligthGreen} onClick={() => addTxToBlock(utx.hash)} />
                                                    :
                                                    <BiErrorCircle color={colors.ligthGreen} onClick={() => notify('You need to create block first!')} />
                                                }
                                            </td>
                                            :
                                            null
                                        }
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                        :
                        'No unconfirmed transaction'
                    }
                </div>
            }
        </>
    )
}