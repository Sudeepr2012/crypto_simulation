
import { useEffect, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi'
import { FaCopy } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from './Others/TabPanel'
import UserTransactions from './Transactions/UserTransactions';
import { colors } from './Others/Colors';
import { getAcctType } from './Others/GetAcctType';
import { getAddressUTXO } from './Transactions/UTXO';
import { getLastBlock } from './Blocks/GetLastBlock';
import { getTDate } from './Others/GetDate';
import { getUserTx } from './Transactions/GetUserTx';

const coinToDollar = 2;

function Dashboard({ user, gun }) {
    const address = user.is.pub;
    const [username, setUsername] = useState('');
    const [acctType, setAcctType] = useState(false);
    const [currency, setCurrency] = useState('inr');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [amount, setAmount] = useState('');
    const [userUTXO, setUserUTXO] = useState({});
    const [totalUTXO, setTotalUTXO] = useState();
    const [myTx, setMyTx] = useState({})
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (acctType === true || acctType === false)
            updateDet();

        async function updateDet() {
            setAcctType(await getAcctType(acctType))
        }

    }, [acctType])

    useEffect(() => {
        async function fetchData() {
            const getExchange = await fetch('http://www.floatrates.com/daily/usd.json')
            const exchangeValue = await getExchange.json()
            setExchangeRate(exchangeValue)
            setUsername(await user.get('alias'))
            const UTXO = await getAddressUTXO(user.is.pub);
            setUserUTXO(UTXO[0])
            setTotalUTXO(UTXO[1])
            const tempUserTx = await getUserTx(address)
            setMyTx(tempUserTx[0])
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (totalUTXO) {
            changeCurrency('inr')
            setLoading(false)
        }
    }, [totalUTXO])

    function changeCurrency(cur) {
        let amount = totalUTXO / coinToDollar;
        if (cur !== 'usd')
            amount = Math.round(exchangeRate[cur].rate * amount);
        setAmount(<>{cur === 'inr' ? '₹' : '$'}{amount}</>)
    }

    const notify = () => toast('✔️ Wallet address copied!', {
        position: "top-right",
        autoClose: 2000,
        style: { background: colors.lighter, color: colors.white },
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    function logout() {
        setLoading(true)
        user.leave().then(() => {
            window.location.href = '/';
        })
    }
    return (
        <>
            <div className='container' style={{ width: '1800px' }}>
                {loading ?
                    <center><div className='loader'></div></center>
                    :
                    <>
                        <h4>{username}</h4>
                        <ToastContainer />
                        <Box display="flex" justifyContent="center" width="100%">
                            <Tabs value={value} onChange={handleChange}
                                TabIndicatorProps={{ style: { backgroundColor: "white" } }}
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                aria-label="scrollable force tabs example"
                                centered
                            >
                                <Tab label="Wallet" />
                                <Tab label="Transactions" />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} className='tabPanel'>
                            <div style={{ width: '100%' }}>
                                <select style={{ maxWidth: 80, float: 'right' }}
                                    value={currency} onChange={(e) => {
                                        setCurrency(e.target.value)
                                        changeCurrency(e.target.value)
                                    }
                                    }>
                                    <option value={'inr'}>INR</option>
                                    <option value={'usd'}>USD</option>
                                </select>
                            </div>
                            <br />
                            <div style={{ textAlign: 'left' }}>
                                <b>Type</b>: {acctType}<br />
                                <b>SudoCoin</b>: {totalUTXO}<GiTwoCoins /><br />
                                <b>Amount</b>: {amount}<br />
                                <b>Address</b>: <FaCopy onClick={() => {
                                    navigator.clipboard.writeText(address)
                                    notify()
                                }} /><br />
                            </div>
                        </TabPanel>
                        <TabPanel value={value} index={1} className='tabPanel'>
                            <UserTransactions myTx={myTx} UTXO={
                                Object.keys(userUTXO).map(key => ({
                                    hash: key,
                                    amount: userUTXO[key]
                                }))
                            } />
                        </TabPanel>

                    </>
                }
            </div>
            <br />
            <button style={{ background: 'red' }}
                onClick={() => logout()}>Logout</button>
        </>
    )
}
export default Dashboard;