import { useEffect, useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "../../Others/Colors";

const address = 'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs'

const blocks = [
    {
        heigth: 2,
        hash: '000d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        prevHash: '000dsfgfgh78jhkl8c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        timestamp: '2022-03-12 13:13',
        transactions: ['tx1', 'tx2', 'tx3'],
        nonce: 234162,
        difficulty: 3,
        miner: {
            name: 'Miner X',
            address: 'scxYksnklalldsjodojd9dwd-wdklsklkll'
        },
    },
    {
        heigth: 2,
        hash: '000kdop1dbva74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        prevHash: '000dsfgfgh78jhkl8c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        timestamp: '2022-03-12 13:43',
        transactions: ['tx1', 'tx2'],
        nonce: 578746,
        difficulty: 3,
        miner: {
            name: 'Miner Y',
            address: 'sckjy45uh5ytgjlk004k-gfgee5'
        },
    }
]

function ValidateBlock() {

    const [validateLoading, setValidateLoading] = useState({})
    const { bHeight } = useParams()

    useEffect(() => {
        for (let i = 0; i < blocks.length; i++) {
            setValidateLoading(validateLoading => ({
                ...validateLoading,
                [i]: false
            }))
        }
    }, [])
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
            <h4 style={{ textAlign: 'left' }}>Pending Blocks</h4>
            <table>
                {blocks.map((block, index) => (
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Block</td> <td>#{block.heigth}</td></tr>
                        <tr><td>Hash</td> <td>{block.hash}</td></tr>
                        <tr><td>Previous Hash</td> <td><Link to={`/block/${block.heigth - 1}`}>{block.prevHash}</Link></td></tr>
                        <tr><td>Timestamp</td> <td>{block.timestamp}</td></tr>
                        <tr><td>Transactions</td> <td>
                            {block.transactions.map((tx, ind) => (
                                <tr>
                                    <Link to={`/tx/${tx}`}>{tx}</Link>
                                </tr>
                            ))}
                        </td></tr>
                        <tr><td>Nonce</td> <td>{block.nonce}</td></tr>
                        <tr><td>Difficulty</td> <td>{block.difficulty}</td></tr>
                        <tr><td>Miner</td> <td>{block.miner.name}</td></tr>

                        {validateLoading[index] ?
                            <div className="loader"></div>
                            :
                            <tr>
                                <td><button style={{ background: '#00cb00' }}
                                    onClick={() => setValidateLoading(validateLoading => ({
                                        ...validateLoading,
                                        [index]: true
                                    }))}>Valid</button></td>
                                <td><button style={{ background: 'red' }}
                                    onClick={() => setValidateLoading(validateLoading => ({
                                        ...validateLoading,
                                        [index]: true
                                    }))}>Invalid</button></td>
                            </tr>
                        }
                    </div>
                ))}
            </table>
        </div>
    )
}
export default ValidateBlock