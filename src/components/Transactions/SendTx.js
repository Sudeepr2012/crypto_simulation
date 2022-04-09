
import { useEffect, useState } from 'react';
import SendTxWallet from './SendTxWallet';
import SendTxManual from './SendTxManual';
import { getAddressUTXO } from './UTXO';


function SendTx({ user, gun }) {

    const [UTXO, setUTXO] = useState([]);
    const [sendMethod, setSendMethod] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUTXO([])
        async function getUserTx() {
            const userUTXO = await getAddressUTXO(user.is.pub);
            setUTXO(userUTXO[0])
        }
        getUserTx()
    }, [sendMethod])

    return (
        <>
            {sendMethod === '' ?
                <div className='container'>
                    Select send method
                    <br />
                    <select value='' onChange={(e) => setSendMethod(e.target.value)}>
                        <option value='' disabled>Send method ?</option>
                        <option value='wallet'>Wallet</option>
                        <option value='manual'>Manual</option>
                    </select>
                </div>
                :
                sendMethod === 'manual' ?
                    <SendTxManual UTXO={UTXO} gun={gun} user={user} />
                    :
                    <SendTxWallet UTXO={UTXO} gun={gun} user={user} />
            }
        </>
    )
}
export default SendTx