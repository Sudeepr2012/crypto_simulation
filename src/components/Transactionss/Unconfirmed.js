
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsCheckLg } from 'react-icons/bs'
import { GiCancel } from 'react-icons/gi'
import { IoMdCube } from 'react-icons/io'
import { FaReceipt } from 'react-icons/fa'
import { colors } from '../Others/Colors';

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

function UnconfirmedTX() {
    const [loading, setLoading] = useState(true)
    const [uTX, setUTX] = useState([])
    const [txLoading, setTxLoading] = useState([])
    const [candidateBlockRef, setCandidateBlockRef] = useState([])

    useEffect(() => {
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
        if (uTX.length > 0)
            setLoading(false)
    }, [uTX])

    function addTxToBlock(txHash, index) {
        setTxLoading(txLoading => ({ ...txLoading, [index]: true }))
        setTimeout(() => {
            setCandidateBlockRef(candidateBlockRef => [...candidateBlockRef, txHash])
            setTxLoading(txLoading => ({ ...txLoading, [index]: false }))
        }, 2000)
    }

    function removeTxFromBlock(txHash, index) {
        setTxLoading(txLoading => ({ ...txLoading, [index]: true }))
        setTimeout(() => {
            setCandidateBlockRef(candidateBlockRef.filter(newTxHash => newTxHash !== txHash))
            setTxLoading(txLoading => ({ ...txLoading, [index]: false }))
        }, 2000)
    }

    return (
        loading ?
            <center><div className='loader'></div>
                <div style={{ fontStyle: 'italic', fontSize: 18 }}>Getting transactions...</div></center>
            :
            <div className='blocks-table'>
                <div style={{ width: '100%', display: 'flex' }}>
                    <h4 style={{ textAlign: 'left', flex: 1, marginLeft: '5%' }}><FaReceipt color={colors.link} /> Unconfirmed Transactions</h4>
                    <h4 style={{ textAlign: 'right', marginRight: '5%' }}>
                        <Link to={`/me/block`}><IoMdCube /></Link></h4>
                </div>

                <table style={{ margin: 'auto', width: '90%' }}>
                    <thead>
                        <th scope="col">Hash</th>
                        <th scope="col">Timestamp</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Fee</th>
                        <th scope="col">CB</th>
                    </thead>

                    <tbody>
                        {uTX.map((utx, i) => (
                            <tr key={i}>
                                <td data-label="Hash"><Link to={`/tx/${utx.hash}`}>{utx.hash}</Link></td>
                                <td data-label="Timestamp">{utx.timestamp}</td>
                                <td data-label="Amount">{utx.totalOP} SC</td>
                                <td data-label="Fee">{utx.fee} SC</td>
                                <td data-label="CB" style={{ cursor: 'pointer' }}>
                                    {txLoading[i] ? <div className='loader'></div> :
                                        candidateBlockRef.includes(utx.hash) ?
                                            <GiCancel color='red' onClick={() => removeTxFromBlock(utx.hash, i)} />
                                            :
                                            <BsCheckLg color={colors.ligthGreen} onClick={() => addTxToBlock(utx.hash, i)} />
                                    }
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            </div>
    )
}
export default UnconfirmedTX