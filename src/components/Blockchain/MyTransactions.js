const myTransactions = [
    {
        hash: 'tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60',
        to: 'gjf8j43-dfjgj404r4-vvfrg3r352wgwf4',
        status: 'Confirmed',
        confirmations: 4,
        time: '2022-03-23 18:26',
        block: '#3',
        fee: '10 SC',
        amount: '1000 SC',
        value: '$20000'
    },
    {
        hash: 'tx-jhgfefffce975208c1b15fecb2abddb4546547eawffwvd3cbcc8fcrtrtrtt540',
        to: 'rdf53hgh-45gfxsq-vv83r352wgdsf4',
        status: 'Rejected',
        confirmations: 0,
        time: '2022-03-23 12:18',
        block: '-',
        fee: '6 SC',
        amount: '3000 SC',
        value: '$50000'
    },
    {
        hash: 'tx-uitr43j3jfik4kn9wm4fg954lxks4ut5gsgsgrt322geg6egde345fh6q3gjuiy7d',
        to: 'rdf53hgh-45gfxsq-vv83r352wgdsf4',
        status: 'Unconfirmed',
        confirmations: 0,
        time: '2022-03-24 15:12',
        block: 'Mempool',
        fee: '6 SC',
        amount: '300 SC',
        value: '$5000'
    },
]

function MyTransactions() {

    return (
        <>
            <table>
                {myTransactions.reverse().map((transaction, index) => (
                    <div style={{ textAlign: 'left', background: '#6ba9a8', marginBottom: 20, padding: 10 }}>
                        <tr><td>Hash</td> <td>{transaction.hash}</td></tr>
                        <tr><td>To</td> <td>{transaction.to}</td></tr>
                        <tr><td>Time</td> <td>{transaction.time}</td></tr>
                        <tr><td>Status</td> <td
                            style={{
                                color: transaction.status === 'Unconfirmed' ? 'yellow' :
                                    transaction.status === 'Confirmed' ? '#76ff76' : 'red'
                            }}>{transaction.status}</td></tr>
                        <tr> <td>Block</td> <td>{transaction.block}</td></tr>
                        <tr> <td>Confirmations</td> <td>{transaction.confirmations}</td></tr>
                        <tr><td> Fee</td> <td>{transaction.fee}</td></tr>
                        <tr><td>Amount</td> <td>{transaction.amount}</td></tr>
                        <tr><td>Value</td> <td>{transaction.value}</td></tr>
                    </div>
                ))}
            </table>
        </>
    )
}
export default MyTransactions