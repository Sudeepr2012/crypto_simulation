
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCubes } from 'react-icons/fa'
import './Table.css'
import { colors } from '../../Others/Colors';

const blockchain = {
    0: {
        hash: 'gdg',
        prev: '000000',
        height: 0,
        miner: {
            name: 'MinerY',
            pubKey: 'minerKU'
        },
        nonce: 46426,
        timestamp: '2022-03-22 12:11',
        transactions: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        merkleRoot: 'jhkgfksg',
        txVolume: 200,
        blockReward: 6.042,
        feeReward: 0.042
    },
    1: {
        hash: '00sklfj',
        prev: 'gdg',
        height: 1,
        miner: {
            name: 'MinerX',
            pubKey: 'minerKU'
        },
        nonce: 643275,
        timestamp: '2022-03-25 18:17',
        transactions: ['tx-d113a93da74642ce975208c1b15fecb2a547eeead3cbcc8fc2fc3f002e4c1e60'],
        merkleRoot: 'hnfbnhdx-hdhhdx',
        txVolume: 4256,
        blockReward: 8.57,
        feeReward: 0.57
    }
}
function AllBlocks() {
    const [loading, setLoading] = useState(true)
    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        setTimeout(() => {
            let blockchainHeight = Object.values(blockchain).length;
            for (let i = blockchainHeight - 1; i >= 0; i--)
                setBlocks(blocks => [...blocks,
                <tr key={i}>
                    <td data-label="Height"><Link to={`/block/${i}`}>#{blockchain[i].height}</Link></td>
                    <td data-label="Hash"><Link to={`/block/${i}`}>{blockchain[i].hash}</Link></td>
                    <td data-label="Timestamp">{blockchain[i].timestamp}</td>
                    <td data-label="Miner"><Link to={`/address/${blockchain[i].miner.pubKey}`}>{blockchain[i].miner.name}</Link></td>
                    <td data-label="Tx. Volume">{blockchain[i].txVolume} SC</td>
                </tr>
                ]
                )
        }, 1000);
    }, [])

    useEffect(() => {
        if (blocks.length > 0)
            setLoading(false)
    }, [blocks])
    return (
        loading ?
            <center><div className='loader'></div>
                <div style={{ fontStyle: 'italic', fontSize: 18 }}>Getting blocks...</div></center>
            :
            <div className='blocks-table'>
                <h4 style={{ textAlign: 'left', marginLeft: '5%' }}><FaCubes color={colors.link} /> Blocks</h4>
                <table style={{ margin: 'auto', width: '90%' }}>
                    <thead>
                        <tr style={{ display: 'contents' }}>
                            <th scope="col">Height</th>
                            <th scope="col">Hash</th>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Miner</th>
                            <th scope="col">TX. Volume</th>
                        </tr>
                    </thead>

                    <tbody>
                        {blocks.map((block, index) => (
                            block
                        ))
                        }
                    </tbody>
                </table>
            </div>
    )
}
export default AllBlocks