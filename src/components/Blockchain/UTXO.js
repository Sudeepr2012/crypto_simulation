import Gun from 'gun'
import { PEERS } from '../Others/Peers';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})
const firstTX = 100;

async function getAddressUTXO(address) {
    // gun.get('UTXO').put({
    //     'tx-1': {
    //         hash: 'tx-1',
    //         address1: 200,
    //         address2: 10,
    //     }
    // })
    const rUTXO = gun.get('UTXO').then((data) => {
        if (!data) {
            return [{
                'tx-1': firstTX,
            }, firstTX]
        }
        else {
            let totalAmount = 0;
            let utxo = {};
            Object.keys(data).map((tx) => {
                if (tx !== '_') {
                    gun.get(`UTXO/${tx}`).get(address).once((myTx) => {
                        if (myTx) {
                            utxo[tx] = myTx;
                            totalAmount += myTx;
                        }
                    })
                }
            })
            return [utxo, totalAmount]
        }
    })
    return rUTXO
}

export { getAddressUTXO }