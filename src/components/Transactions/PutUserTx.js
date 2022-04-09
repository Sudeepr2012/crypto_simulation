import Gun from 'gun'
import { PEERS } from '../Others/Peers';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})

async function putToMempool(hash, outputs) {
    let utxo = {
        hash: hash
    }
    Object.keys(outputs).map((key) => {
        utxo[outputs[key].address] = outputs[key].amount;
    })
    console.log(utxo)
    const rUTXO = gun.get('UTXO').put({
        [hash]: utxo
    }).then(() => { return true })
    return rUTXO
}


async function confirmTx(transactions, block) {
    transactions.map((tx) => {
        tx.block = block;
        gun.get('transactions').put({
            [tx.hash]: tx
        })
    })
}


export { confirmTx, putToMempool }