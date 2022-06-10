import Gun from 'gun'
import { PEERS } from '../others/Peers';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})

export async function getLastBlock() {
    const rHeight = gun.get('blockchain').then((blocks) => {
        return (Object.keys(blocks).length - 2)
    })
    return rHeight
}
