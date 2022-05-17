import { useEffect, useState } from "react"
import { FaCopy } from 'react-icons/fa'
import { useParams } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { IoMdCube } from 'react-icons/io'
import { colors } from "./Others/Colors";
import UserTransactions from "./Transactions/UserTransactions";
import { notify } from "./Others/Notify";
import { API_URL, COIN_SYMBOL } from "./Strings";
import { getAddressUTXO } from "./Transactions/UTXO";
import { getUserTx } from "./Transactions/GetUserTx";

export default function ViewAddress() {
    const { address } = useParams()
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('Unknown')
    const [userTx, setUserTx] = useState()
    const [userTxStats, setUserTxStats] = useState()
    const [userUTXO, setUserUTXO] = useState()

    useEffect(() => {
        setLoading(true)
        setUsername('Unknown')
        setUserTx()
        setUserTxStats()
        setUserUTXO()
        async function getUserName() {
            const res = await fetch(`${API_URL}/username?${new URLSearchParams({ address: address }).toString()}`);
            const rUsername = await res.json();
            setUsername(rUsername.alias)
        }
        async function getTX() {
            const tempUserTx = await getUserTx(address)
            setUserTx(tempUserTx[0])
            setUserTxStats(tempUserTx[1])
            const UTXO = await getAddressUTXO(address);
            setUserUTXO(UTXO[0])
        }
        getUserName();
        getTX();
    }, [address])

    useEffect(() => {
        if (userTx && userUTXO) {
            setLoading(false)
        }
    }, [userTx, userUTXO])

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
                                notify('✔️ Address copied!')
                            }} /></td></tr>
                        <tr><td>Username</td> <td>{username}</td></tr>
                        <tr><td>Transactions</td> <td>{Object.keys(userTx).length}</td></tr>
                        <tr><td>Received</td><td>{userTxStats.received} {COIN_SYMBOL}</td>
                        </tr>
                        <tr><td>Sent</td> <td>{userTxStats.sent} {COIN_SYMBOL}</td></tr>
                        <tr><td>Balance</td> <td>{userTxStats.received - userTxStats.sent} {COIN_SYMBOL}</td></tr>
                    </div>
                </table>
                <h4 style={{ textAlign: 'left' }}>Transactions</h4>
                <UserTransactions myTx={userTx}
                    UTXO={userUTXO} />
            </div>
    )
}