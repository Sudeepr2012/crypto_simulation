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
  console.log(`Example app listening at http://localhost:${port}`)
})

//blocks
app.get('/blocks', (req, res) => {
  gun.get('blockchain').once(async (bcBlocks) => {
    if (bcBlocks) {
      let blocks = [];
      let keys = Object.keys(bcBlocks);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== '_')
          blocks.push(
            await gun.get(`blockchain/${keys[i]}`).once((block) => { return block })
          )
      }
      return res.send(blocks);
    }
    else
      return res.send([]);
  })
});

//view block
app.get('/block', (req, res) => {
  const bHeight = req.query.height;
  if (!bHeight)
    return res.send({ message: 'error' });
  gun.get(`blockchain/${bHeight}`).once(async (block) => {
    if (!block)
      return res.send({ message: 'error' });
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
    await gun.get(`transactions/${txHash}/inputs`).once((ips) => {
      if (ips) {
        let keys = Object.keys(ips);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== '_')
            gun.get(`transactions/${txHash}/inputs/${keys[i]}`).once((ip) => {
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
    await gun.get(`transactions/${txHash}/outputs`).then((ops) => {
      if (ops) {
        let keys = Object.keys(ops);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] !== '_')
            gun.get(`transactions/${txHash}/outputs/${keys[i]}`).once((op) => {
              rTx.totalOP += op.amount
              rTxOP.push(op)
            })
        }
      }
    })
    return res.send([rTx, rTxIP, rTxOP])
  })
});

// radisk: false   
Gun({ web: server });