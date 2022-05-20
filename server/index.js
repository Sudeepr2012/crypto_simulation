const express = require('express')
const Gun = require('gun');
const app = express()
const port = 3030
app.use(Gun.serve);
require('gun/sea')

const gun = Gun({
  peers: 'http://localhost:3030/gun'
})

async function getLastBlock() {
  const rHeight = gun.get('blockchain').then((blocks) => {
    return (Object.keys(blocks).length - 2)
  })
  return rHeight
}

function checkDateFormat(date) {
  if (date < 10)
    return (`0${date}`)
  return date;
}

function getTDate(date) {
  let newDate = `${checkDateFormat(date.getDate())}-${checkDateFormat(date.getMonth() + 1)}-${date.getFullYear()} ${checkDateFormat(date.getHours())}:${checkDateFormat(date.getMinutes())}`;
  return newDate;
}

const server = app.listen(port, () => {
  console.log(`BC-JNTUH listening at http://localhost:${port}`)
})

//get username
app.get('/username', (req, res) => {
  const address = req.query.address;
  if (!address)
    return res.send({ alias: 'Unknown' });
  gun.user(address).once((user) => {
    if (user)
      return res.send({ alias: user.alias });
    return res.send({ alias: 'Unknown' });
  })
})

//blocks
app.get('/blocks', (req, res) => {
  gun.get('blockchain').once(async (bcBlocks) => {
    if (!bcBlocks)
      return res.send([]);
    let blocks = [];
    let keys = Object.keys(bcBlocks);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== '_')
        blocks.push(
          await gun.get(`blockchain/${keys[i]}`).once((block) => { return block })
        )
    }
    return res.send(blocks);
  })
});

//view block
app.get('/block', (req, res) => {
  const bHeight = req.query.height;
  if (!bHeight)
    return res.send({ message: 'error - block height required' });
  gun.get(`blockchain/${bHeight}`).once(async (block) => {
    if (!block)
      return res.send({ message: 'error - block not found in blockchain' });
    let rBlock = {};
    let rBlockTx = [];
    block.confirmations = (await getLastBlock() - block.height) + 1
    rBlock = block;
    gun.get(`blockchain/${bHeight}/transactions`).then(async (txs) => {
      if (txs) {
        let keys = Object.keys(txs);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== '_')
            rBlockTx.push(await gun.get(`blockchain/${bHeight}/transactions/${keys[i]}`).once((tx) => {
              return tx
            }))
        }
      }
    }).then(() => { return res.send([rBlock, rBlockTx]); })
  })
});

//get last block hash & height (prevHash)
app.get('/prevblock', (req, res) => {
  gun.get('blockchain').once(async (blocks) => {
    if (!blocks)
      return res.send({ hash: '0000000000000000000000000000000000000000000000000000000000000000', height: -1 });
    const topBlock = Object.keys(blocks).length - 2;
    let rData = {};
    await gun.get(`blockchain/${topBlock}`).once((block) => {
      rData = { hash: block.hash, height: block.height }
    })
    return res.send(rData)
  })
})

//all txs
app.get('/txs', (req, res) => {
  gun.get('transactions').once(async (tempTxs) => {
    if (!tempTxs)
      return res.send([]);
    let tempTx = [];
    let keys = Object.keys(tempTxs);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== '_' && tempTxs[keys[i]])
        tempTx.push(
          await gun.get(`transactions/${keys[i]}`).once((tx) => {
            return {
              hash: tx.hash,
              timestamp: getTDate(new Date(tx.timestamp)),
              amount: tx.amount,
              fee: tx.fee,
              block: tx.block
            }
          })
        )
    }
    return res.send(tempTx);
  })
});

//mempool
app.get('/mempool', (req, res) => {
  gun.get('transactions').once(async (txs) => {
    if (txs) {
      let utx = [];
      let keys = Object.keys(txs);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== '_') {
          await gun.get(`transactions/${keys[i]}`).once((tx) => {
            if (tx && tx.block === 'mempool')
              utx.push({
                hash: tx.hash,
                timestamp: getTDate(new Date(tx.timestamp)),
                amount: tx.amount,
                fee: tx.fee
              })
          })
        }
      }
      utx.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1)
      return res.send(utx);
    }
    else
      return res.send([]);
  })
});


//view tx
app.get('/tx', (req, res) => {
  const txHash = req.query.txHash;
  if (!txHash)
    return res.send({ message: 'error' });
  gun.get(`transactions/${txHash}`).then(async (tx) => {
    if (!tx)
      return res.send({ message: 'error' });
    let rTx = {
      hash: txHash,
      by: {
        adress: ''
      },
      status: isNaN(tx.block) ? 'Unconfirmed' : 'Confirmed',
      timestamp: getTDate(new Date(tx.timestamp)),
      confirmations: isNaN(tx.block) ? 0 : (await getLastBlock() - tx.block) + 1,
      block: tx.block,
      fee: 0,
      totalIP: 0,
      totalOP: 0
    };
    let rTxIP = [];
    let rTxOP = [];
    await gun.get(`transactions/${txHash}/inputs`).then(async (ips) => {
      if (ips) {
        let keys = Object.keys(ips);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== '_')
            await gun.get(`transactions/${txHash}/inputs/${keys[i]}`).once((ip) => {
              if (keys[i] == 0)
                rTx.by = ip
              else
                rTxIP.push(ip)
              if (ip.fee >= 0)
                rTx.fee += ip.fee
              else
                rTx.totalIP += ip.amount
            })
        }
      }
    })
    await gun.get(`transactions/${txHash}/outputs`).then(async (ops) => {
      if (ops) {
        let keys = Object.keys(ops);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== '_')
            await gun.get(`transactions/${txHash}/outputs/${keys[i]}`).once((op) => {
              rTx.totalOP += op.amount
              rTxOP.push(op)
            })
        }
      }
    })
    return res.send([rTx, rTxIP, rTxOP])
  })
});


//get user TXs
app.get('/userTXs', (req, res) => {
  const address = req.query.address;
  if (!address)
    return res.send({ message: 'error' });
  gun.get('transactions').then(async (txs) => {
    if (!txs)
      return res.send([{}, { received: 0, sent: 0 }]);
    let userTXs = {};
    let userTXsStats = { received: 0, sent: 0 }
    const allTxs = Object.keys(txs);
    for (let i = 0; i < allTxs.length; i++) {
      if (allTxs[i] !== '_') {
        const tx = await gun.get(`transactions/${allTxs[i]}`);
        const txOP = await gun.get(`transactions/${allTxs[i]}/outputs/0`)
        const txIP = await gun.get(`transactions/${allTxs[i]}/inputs/0`)
        if (txOP.address === address) {
          if (!userTXs[allTxs[i]])
            userTXs[allTxs[i]] = { hash: allTxs[i] }
          userTXs[allTxs[i]].from = txIP.address;
          userTXs[allTxs[i]].amount = txIP.amount;
          if (!isNaN(tx.block))
            userTXsStats.received += txIP.amount;
        }
        if (txIP.address === address) {
          if (!userTXs[allTxs[i]])
            userTXs[allTxs[i]] = { hash: allTxs[i] }
          userTXs[allTxs[i]].to = txOP.address;
          userTXs[allTxs[i]].amount = txOP.amount;
          userTXsStats.sent += txOP.amount + txIP.fee;
          userTXs[allTxs[i]].fee = txIP.fee;
        }
        if (userTXs[allTxs[i]]) {
          userTXs[allTxs[i]].block = tx.block
          userTXs[allTxs[i]].timestamp = getTDate(new Date(tx.timestamp))
          userTXs[allTxs[i]].confirmations = isNaN(tx.block) ? 0 : (await getLastBlock() - tx.block) + 1
        }

      }
    }
    return res.send([userTXs, userTXsStats]);
  })
})

//get address UTXO
app.get('/userUTXOs', (req, res) => {
  const address = req.query.address;
  if (!address)
    return res.send([{}, 0]);
  gun.get('UTXO').then((utxo) => {
    if (!utxo)
      return res.send([{}, 0]);
    let addressUtxo = {};
    Object.keys(utxo).map(async (key) => {
      if (key !== '_') {
        await gun.get('UTXO').get(key).get(address).once((tx) => {
          if (tx > 0)
            addressUtxo[key] = tx;
        })
      }
    })
    return res.send([addressUtxo, Object.values(addressUtxo).reduce((sum, a) => sum + a, 0)]);
  })
})
// radisk: false   
Gun({ web: server });