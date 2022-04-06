import Gun from 'gun'
import { PEERS } from '../../Others/Peers';
require('gun/sea')

const gun = Gun({
    peers: PEERS
})

async function getLastBlock() {
    const rHeight = gun.get('blockchain').then((blocks) => {
        return (Object.keys(blocks).length - 1)
    })
    return rHeight
}

export { getLastBlock }