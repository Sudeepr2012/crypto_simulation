const express = require('express')
const Gun = require('gun');
const app = express()
const port = 3030
app.use(Gun.serve);

const gun = Gun('http://localhost:3030/gun')
const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

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

// radisk: false   
Gun({ web: server });