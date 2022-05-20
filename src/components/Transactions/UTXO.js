import Gun from 'gun'
import { PEERS } from '../others/Peers';
import { API_URL } from '../Strings';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})

async function getAddressUTXO(address) {
    const getUTXO = await fetch(`${API_URL}/userUTXOs?${new URLSearchParams({ address: address }).toString()}`);
    const UTXO = await getUTXO.json();
    return UTXO
}

async function putUTXO(hash, outputs) {
    let utxo = {
        hash: hash
    }

    Object.keys(outputs).map((key) => {
        utxo[outputs[key].address] = outputs[key].amount;
    })

    const rUTXO = gun.get('UTXO').put({
        [hash]: utxo
    }).then(() => { return true })
    return rUTXO
}

async function putAllUTXO(txs) {
    for (let i = 0; i < txs.length; i++) {
        let utxo = {
        }
        Object.values(txs[i].outputs).map((op) => {
            if (txs[i].from !== op.address)
                utxo[op.address] = op.amount
        })
        gun.get('UTXO').get(txs[i].hash).put(utxo)
    }
}

async function deleteUTXO(inputs) {
    Object.keys(inputs).map((key) => {
        gun.get(`UTXO/${inputs[key].hash}`).get(inputs[key].address).put(null)
    })
}

export { getAddressUTXO, putUTXO, putAllUTXO, deleteUTXO }