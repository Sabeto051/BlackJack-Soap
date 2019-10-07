'strict'

const soap = require('soap')
const url = 'https://blackjack-soap-server.herokuapp.com/Library?wsdls'

let myclient = null
async function getCliente() {
  if (myclient === null) {
    try {
      myclient = await soap.createClientAsync(url, { disableCache: true })
    } catch (error) {
      console.error(error)
    }
  }
  return myclient
}

async function pedirCarta() {
  if (myclient != null) {
    try {
      myclient.newCarta({ token: myclient.token }).then(result => {
        console.log(result.result)
      })
    } catch {
      console.error
    }
  } else {
    alert("ERROR: no hay cliente")
  }
}

async function plantar() {
  if (myclient != null) {
    try {
      myclient.plantar({ token: myclient.token }).then(result => {
        console.log(result.result)
      })
    } catch {
      console.error
    }
  } else {
    alert("ERROR: no hay cliente")
  }
}

var suits = {
  DIAMANTE: '&#9830',
  CORAZON: '&#9829',
  TREBOL: '&#9827',
  PICA: '&#9824'
}

function establecerEstiloCarta(pinta) {
  estilo = pinta == suits.DIAMANTE || pinta == suits.CORAZON ? 'roja' : 'negra'
  return estilo
}

function cartaAdcional() {
  let victorioso = verificarGanador()
  //Antes de adicionar carta se verifica que no exista ganador
  if (victorioso != 0) {
    if (victorioso == 1) {
      alert('La casa gano')
    } else if (victorioso == 2) {
      alert('El jugador ' + myclient.token + ' Gano')
    } else {
      alert('Ambos perdieron')
    }
  } else {
    //Se le agrega una carta al usuario (en el arreglo y en el html).
    pedirCarta('jugador')
  }
}

function verificarGanador() {
  // Aca segun el que se paso se dice quien gano y se le asigna un valor a victorioso
  myclient.gameStatus({ token: myclient.token }).then(result => {
    if (result.test === "nowinner") {
      return 0
    } else {
      return 1 //for testing purposes only
    }
  })
}

function seleccionarPinta(posPinta) {
  pintar = ''
  switch (posPinta) {
    case 0:
      pintar = suits.DIAMANTE
      break
    case 1:
      pintar = suits.CORAZON
      break
    case 2:
      pintar = suits.TREBOL
      break
    case 3:
      pintar = suits.PICA
      break
    default:
      pintar = 'Error'
      break
  }
  return pintar
}

function decorarCarta(spanId, arr, last) {
  // Se le añade el número de la carta al nuevo Span
  $('#' + spanId).html(arr[last].pintar + ' ' + arr[last].numero + ' ')
  //se obtiene el estilo de la carta
  var estilo = establecerEstiloCarta(arr[last].pintar)
  //adiciona la clase correcta dependiendo su pinta
  $('#' + spanId).addClass(estilo)
  console.log(spanId + ' ' + arr[last].numero)
}

function mostrarCarta(jugador, posicion) {
  var spanId = jugador + posicion;
  $('#' + spanId).removeClass('oculta');
  var arr = (jugador == 'casa') ? casa : jug1;
  decorarCarta(spanId, arr, posicion - 1);
  console.log(spanId);
}

module.exports = {
  getCliente: async () => await getCliente()
}

