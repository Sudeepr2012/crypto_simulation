
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCubes } from 'react-icons/fa'
import './Table.css'
import { colors } from '../Others/Colors';

function AllBlocks({ gun }) {
    const [loading, setLoading] = useState(true)
    const [blocks, setBlocks] = useState([])

    useEffect(() => {
        gun.get('blockchain').once((blocks) => {
            Object.keys(blocks).map((key) => {
                if (key !== '_')
                    gun.get(`blockchain/${key}`).once((block) => {
                        setBlocks(blocks => [...blocks,
                        <tr key={key}>
                            <td data-label="Height"><Link to={`/block/${key}`}>#{block.height}</Link></td>
                            <td data-label="Hash"><Link to={`/block/${key}`}>{block.hash}</Link></td>
                            <td data-label="Timestamp">{block.timestamp}</td>
                            <td data-label="Miner">{block.miner}</td>
                            <td data-label="TXs">{block.txCount}</td>
                        </tr>
                        ]
                        )
                    })
            })
        })
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