const { getCliente } = require('./cliente')

class Game {
  constructor(name = '') {
    this.name = name
  }
}

let game = new Game('test 1')

async function setCliente() {
  try {
    let cliente = await getCliente()

    cliente.conectarJugador({ apuesta: 113414 }, (err, res) => {
      if (err) throw err

      console.log(res)
    })
  } catch (error) {
    console.error(error)
  }
}

setCliente()
