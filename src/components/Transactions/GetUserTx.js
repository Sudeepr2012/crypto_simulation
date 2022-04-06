import Gun from 'gun'
import { getLastBlock } from '../Blocks/GetLastBlock';
import { getTDate } from '../Others/GetDate';
import { PEERS } from '../Others/Peers';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})

async function getUserTx(address) {
    let userTx = {}
    let userTxStats = {
        received: 0,
        sent: 0
    }
    await gun.get('transactions').then((txs) => {
        Object.keys(txs).map((key) => {
            if (key !== '_') {
                let myTX = {};
                gun.get(`transactions/${key}`).once(async (tx) => {
                    myTX = {
                        hash: key,
                        block: tx.block,
                        timestamp: getTDate(new Date(tx.timestamp)),
                        confirmations: (await getLastBlock() - tx.block) + 1,
                    }
                }).then(() => {
                    gun.get(`transactions/${key}/outputs/0`).once((op) => {
                        gun.get(`transactions/${key}/inputs/0`).once((ip) => {
                            if (op.address === address) {
                                myTX.from = ip.address;
                                myTX.amount = ip.amount;
                                userTxStats.received += ip.amount;
                            }
                            if (ip.address === address) {
                                myTX.to = op.address;
                                myTX.amount = op.amount;
                                userTxStats.sent += op.amount + ip.fee;
                                myTX.fee = ip.fee;
                            }

                        }).then(() => {
                            if (myTX.amount)
                                userTx[key] = myTX
                        })
                    })
                })
            }
        })
    })
    return [userTx, userTxStats];
}

export { getUserTx }