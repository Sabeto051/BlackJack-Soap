const tokenizator = require('crypto')

// tokenizator.randomBytes(20, function(err, buffer) {
//   var token = buffer.toString('hex')
//   console.log(token)
// })

async function aa() {
  let bb = await tokenizator.randomBytes(20)
  bb = bb.toString('hex')
  console.log(bb)
}

aa()
