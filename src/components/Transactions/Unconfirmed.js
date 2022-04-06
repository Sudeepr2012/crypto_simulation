
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs'
import { BiErrorCircle } from 'react-icons/bi'
import { GiCancel } from 'react-icons/gi'
import { IoMdCube } from 'react-icons/io'
import { FaReceipt } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import { colors } from '../Others/Colors';
import { getAcctType } from '../Others/GetAcctType';

const AUTHORIZED_TYPE = 'miner';
const memPool = {
    'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60': {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        totalIP: 20,
        totalOP: 20,
        fee: 0,
        timestamp: '2022-03-22 12:43',
        inputs: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-fy6s93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        outputs: ['tx-USER2da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-CHANGE93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
    },
    'tx-jkkfdhthd5tj7642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60': {
        hash: 'tx-jkkfdhthd5tj7642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        totalIP: 6000,
        totalOP: 6550,
        fee: 50,
        timestamp: '2022-03-22 12:11',
        inputs: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-fy6s93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        outputs: ['tx-USER2da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-CHANGE93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
    },
    'tx-jyj793da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60': {
        hash: 'tx-jyj793da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        totalIP: 5000,
        totalOP: 5000,
        fee: 0,
        timestamp: '2022-03-18 12:11',
        inputs: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-fy6s93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        outputs: ['tx-USER2da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-CHANGE93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
    },
    'tx-FG87h4htj7642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60': {
        hash: 'tx-FG87h4htj7642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        totalIP: 230,
        totalOP: 220,
        fee: 10,
        timestamp: '2022-03-22 12:11',
        inputs: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-fy6s93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        outputs: ['tx-USER2da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60', 'tx-CHANGE93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
    },
}

function UnconfirmedTX({ user, gun }) {
    const [loading, setLoading] = useState(true)
    const [acctType, setAcctType] = useState(false);
    const [uTX, setUTX] = useState([])
    const [txLoading, setTxLoading] = useState([])
    const [candidateBlockTx, setCandidateBlockTx] = useState([])
    const [candidateBlock, setCandidateBlock] = useState(null)

    const navigate = useNavigate()
    useEffect(() => {
        // console.log(user.is.pub)
        // gun.get('miners').get(user.is.pub).map((miner, key) => console.log(miner, key))
        if (user.is)
            gun.get('miners').get(user.is.pub).get('candidateBlock').once((val) => setCandidateBlock(val))
        // gun.get('miners').get(user.is.pub).put({
        //     candidateBlock: null,
        // })
        setTimeout(() => {
            let uTx = [];
            let uTxLoading = [];
            Object.values(memPool).forEach((tx, i) => {
                uTx.push(tx)
                uTxLoading[i] = false
            })
            uTx.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)
            setUTX(uTx)
            setTxLoading(uTxLoading)
        }, 1000);
    }, [])


    useEffect(() => {
        if (user.is && (acctType === true || acctType === false))
            updateDet()
        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }
    }, [acctType])


    useEffect(() => {
        if (uTX.length > 0)
            setLoading(false)
    }, [uTX])

    function addTxToBlock(txHash, index) {
        setTxLoading(txLoading => ({ ...txLoading, [index]: true }))
        setTimeout(() => {
            setCandidateBlockTx(candidateBlockTx => [...candidateBlockTx, txHash])
            setTxLoading(txLoading => ({ ...txLoading, [index]: false }))
        }, 2000)
    }

    function removeTxFromBlock(txHash, index) {
        setTxLoading(txLoading => ({ ...txLoading, [index]: true }))
        setTimeout(() => {
            setCandidateBlockTx(candidateBlockTx.filter(newTxHash => newTxHash !== txHash))
            setTxLoading(txLoading => ({ ...txLoading, [index]: false }))
        }, 2000)
    }


    const notify = (msg) => toast(msg, {
        position: "top-right",
        autoClose: 3000,
        style: { background: colors.lighter, color: colors.white },
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

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
                            {uTX.map((utx, i) => (
                                <tr key={i}>
                                    <td data-label="Hash"><Link to={`/tx/${utx.hash}`}>{utx.hash}</Link></td>
                                    <td data-label="Timestamp">{utx.timestamp}</td>
                                    <td data-label="Amount">{utx.totalOP} SC</td>
                                    <td data-label="Fee">{utx.fee} SC</td>
                                    {acctType === AUTHORIZED_TYPE ?
                                        <td data-label="CB" style={{ cursor: 'pointer' }}>
                                            {candidateBlock !== null ?
                                                txLoading[i] ? <div className='loader'></div> :
                                                    candidateBlockTx.includes(utx.hash) ?
                                                        <GiCancel color='red' onClick={() => removeTxFromBlock(utx.hash, i)} />
                                                        :
                                                        <BsCheckLg color={colors.ligthGreen} onClick={() => addTxToBlock(utx.hash, i)} />
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
                </div>
            }
        </>
    )
}
export default UnconfirmedTX