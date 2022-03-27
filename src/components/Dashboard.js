
import { useEffect, useState } from 'react';
import { GiTwoCoins } from 'react-icons/gi'
import { FaCopy } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from './Others/TabPanel'
import './Style.css'
import MyTransactions from './Transactionss/MyTransactions';
import { colors } from './Others/Colors';

const address = 'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs'

//UTXO[tid][address]
const UTXO = {
    'tx-dkhfkhskfhskggmmhgjoh484hehe4rg': {
        hash: 'tx-dkhfkhskfhskggmmhgjoh484hehe4rg',
        'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs': {
            amount: 124,
        },
        'osjsf34jw-4tnbk5hketgk487d8b9hfl5lll26if8b4l': {
            amount: 20,
        }
    },
    'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s': {
        hash: 'tx-tl79jg5hk8reh3hdfjd90wpo5gd83s',
        'vvfhnfsgsfsddh-5e6yjfhsgfhgdsa56cchdfdyi674h': {
            amount: 200,
        },
        'osjsf34jw-4tnbk5hketgk487d8b9hfl5lll26if8b4l': {
            amount: 5,
        }
    },
    'tx-jhkl7khskfhkg86jd90we3fgjoh48fh': {
        hash: 'tx-jhkl7khskfhkg86jd90we3fgjoh48fh',
        'dfdjkfgshhsdfsgsfsbkksf-sgksbgkabhvkjvsvisvs': {
            amount: 76,
        },
        'osjsf34jw-4tnbk5hketgk487d8b9hfl5lll26if8b4l': {
            amount: 5,
        }
    },
}


function Dashboard() {
    const [username, setUsername] = useState('User1');
    const [currency, setCurrency] = useState('inr');
    const [exchangeRate, setExchangeRate] = useState(null);
    const [amount, setAmount] = useState('');
    const [myUTXO, setMyUTXO] = useState([]);
    const [totalUTXO, setTotalUTXO] = useState(0);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        async function fetchData() {
            const getExchange = await fetch('http://www.floatrates.com/daily/usd.json')
            const exchangeValue = await getExchange.json()
            setExchangeRate(exchangeValue)
        }
        fetchData();
        Object.values(UTXO).forEach(utxo => {
            if (utxo[address] !== undefined) {
                setMyUTXO(myUTXO => [...myUTXO, {
                    hash: utxo['hash'],
                    amount: utxo[address].amount
                }])
                setTotalUTXO(totalUTXO => totalUTXO + utxo[address].amount)
            }
        })
    }, [])

    useEffect(() => {
        if (exchangeRate !== null) {
            // Object.values(exchangeRate).forEach(exRate => (console.log(exRate)))
            changeCurrency('inr')
        }
    }, [exchangeRate])

    function changeCurrency(cur) {
        let amount = 1000;
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

    return (
        <div className='container' style={{ width: '1800px' }}>
            <h4>DASHBOARD</h4>
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
                    {username}<br />
                    <b>SudoCoin</b>: {totalUTXO}<GiTwoCoins /><br />
                    <b>Amount</b>: {amount}<br />
                    <b>Address</b>: <FaCopy onClick={() => {
                        navigator.clipboard.writeText(address)
                        notify()
                    }} /><br />
                </div>
            </TabPanel>
            <TabPanel value={value} index={1} className='tabPanel'>
                <MyTransactions UTXO={myUTXO} />
            </TabPanel>

        </div>
    )
}
export default Dashboard;