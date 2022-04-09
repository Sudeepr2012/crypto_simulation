import { useEffect, useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "./Others/Colors";
import { getUserTx } from "./Transactions/GetUserTx";
import UserTransactions from "./Transactions/UserTransactions";
import { getAddressUTXO } from "./Transactions/UTXO";

function ViewAddress({ gun }) {

    const { address } = useParams()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('Unknown')
    const [userTx, setUserTx] = useState()
    const [userTxStats, setUserTxStats] = useState()
    const [userUTXO, setUserUTXO] = useState()

    useEffect(() => {
        setUsername('Unknown')
        gun.user(address).once((user) => {
            if (user)
                setUsername(user.alias)
        })
        async function getTX() {
            const tempUserTx = await getUserTx(address)
            setUserTx(tempUserTx[0])
            setUserTxStats(tempUserTx[1])
            const UTXO = await getAddressUTXO(address);
            setUserUTXO(UTXO[0])
        }
        getTX();
    }, [address])

    useEffect(() => {
        if (userTx && userUTXO) {
            setLoading(false)
        }
    }, [userTx, userUTXO])

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
        loading ?
            <div className="loader"></div>
            :
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
                        <tr><td>Username</td> <td>{username}</td></tr>
                        <tr><td>Transactions</td> <td>{Object.keys(userTx).length}</td></tr>
                        <tr><td>Received</td><td>{userTxStats.received} SC</td>
                        </tr>
                        <tr><td>Sent</td> <td>{userTxStats.sent} SC</td></tr>
                        <tr><td>Balance</td> <td>{userTxStats.received - userTxStats.sent} SC</td></tr>
                    </div>
                </table>
                <h4 style={{ textAlign: 'left' }}>Transactions</h4>
                <UserTransactions myTx={userTx}
                    UTXO={userUTXO} />
            </div>
    )
}
export default ViewAddress