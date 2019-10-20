const tokenizator = require('crypto')

class Carta {
  constructor() {
    this.id = Math.floor(Math.random() * 52 + 1)
    this.valor = ((this.id - 1) % 13) + 1
    this.valor = this.valor > 10 ? 10 : this.valor
    this.valor = this.valor === 1 ? 11 : this.valor
  }
}

let jugadores = []

let juegoStatus = {
  Comenzado: false,
  jugadoresConectados: 0,
  jugadorEnTurno: null, // posicion en array, casa es jugador -1
  terminado: false,
  tokensGanadores: [],
  tokensPerdedores: []
}

let casaStatus = {
  cartas: []
}

function conectarJugador(apuesta = 0) {
  if (juegoStatus.Comenzado === false) {
    let token = tokenizator.randomBytes(20)
    token = token.toString('hex')

    let player = {
      token,
      apuesta,
      numeroCartas: 0,
      cartas: [],
      perdio: false,
      blackjack: false,
      posicionEnArray: jugadores.length,
      plantado: false
    }
    jugadores.push(player)

    juegoStatus.jugadoresConectados += 1
    juegoStatus.juegoComenzado = true

    // SE empieza el CONTEO

    return token
  } else {
    return 'Error'
  }
}

/* 
  Conteo para que empiece el juego
  cuando se acaba, o cancela porque hay 2 jugadores jugando
  llama a empezarJuego()
*/
function conteoJuegoInicio() {
  let cronometro = setTimeout(empezarJuego, 60000)
}

/* 
  Reparte y crea las cartas de jugadores y casa
*/
function empezarJuego() {
  //Reparte dos cartas a cada jugador
  jugadores.forEach(element => {
    let carta1 = newCarta()
    let carta2 = newCarta()
    element.cartas.push(carta1)
    element.cartas.push(carta2)
    element.numeroCartas += 2
  })

  //reparte las dos cartas de la casa
  let cartacasa1 = newCarta()
  let cartacasa2 = newCarta()
  casaStatus.cartas.push(cartacasa1)
  casaStatus.cartas.push(cartacasa2)

  //actualizar
  juegoStatus.Comenzado = true
  juegoStatus.jugadoresConectados = jugadores.length
}

/* 
  Crea una carta (numero random 1-52)
  server no pinta carta, lo hace el cliente
*/
function newCarta() {
  return new Carta()
}

/* 
  Conteo de cartas
*/
function contarCartas(cartas) {
  let suma = 0
  let ases = 0 // numero de ases con valor 11
  let contador = carta => {
    suma += carta.valor
  }
  let numAses = carta => {
    if (carta.id === 1) {
      ases++
    }
  }

  cartas.map(contador)

  if (suma > 21) {
    cartas.map(numAses)

    let i = 0
    while (ases > 0 && suma > 21 && i < cartas.length) {
      if (cartas[i].id === 1) {
        cartas[i].valor = 1
        ases--
        cartas.map(contador)
      }

      i++
    }
  }

  return suma
}

/* 
  verifica si un jugador está en el turno actual
*/
function verificarJugadorEnTuno(token) {
  let posJugEnTurno = juegoStatus.jugadorEnTurno

  if (posJugEnTurno !== -1) {
    let jugEnTurno = jugadores[posJugEnTurno]
    if (token === jugEnTurno.token) {
      return true
    } else {
      return false
    }
  }

  return false
}

/* 
  valida que jugador juega despues, o si la casa juega despues
  puede llama funcion jugarCasa()
*/
function siguienteTurno() {
  // si el jugador en turno, ya jugo la casa, se acaba el juego
  if (juegoStatus.jugadorEnTurno == -1) {
    terminarJuego()
  }

  if (juegoStatus.jugadorEnTurno + 1 == jugadores.length) {
    juegoStatus.jugadorEnTurno = -1
    jugarCasa()
  } else {
    juegoStatus.jugadorEnTurno++
  }
}

/* 
  juega la casa (despues de q todos jugadores jugaron)
  Casa puede pedir mas cartas, se puede pasar en puntos, etc...
*/
function jugarCasa() {
  let puntos = contarCartas(casaStatus.cartas)

  while (puntos < 17) {
    let cartacasa1 = newCarta()
    casaStatus.cartas.push(cartacasa1)
    puntos = contarCartas(casaStatus.cartas)
  }

  siguienteTurno()
}

/* 
  Verifica quien Gana al FINAL y devuelve o se queda con la plata de las apuestas
*/
function verificarQuienGana() {
  let i = 0
  let totales = []
  jugadores.forEach(jugador => {
    //para cada jugador calcular el total

    totales.append(contarCartas(jugador.cartas))
    /*
    totales.append(0); 
    jugador.cartas.forEach(carta => { //para carta del jugador sumarla al total
      total[i] += carta.valor
    }) */
    i++
  })

  let totalcasa = contarCartas(casaStatus.cartas)
  /*
  let totalcasa = 0;

  casaStatus.cartas.forEach(carta => {
    //calcular total de la casa
    totalcasa += carta.valor
  }) */

  i = 0
  jugadores.forEach(jugador => {
    //para cada jugador revisar si perdio, empato o gano
    if (totales[i] <= 21) {
      if (totales[i] > totalcasa) {
        console.log('jugador ' + i + ' gano!')
      } else {
        if ((totales[i] = totalcasa)) {
          console.log('jugador ' + i + ' empata con la casa')
          jugador.perdio = true
        } else {
          console.log('jugador ' + i + ' perdio!')
          jugador.perdio = true
        }
      }
    } else {
      console.log('jugador ' + i + ' se paso y perdio!')
      jugador.perdio = true
    }
    i++
  })
}

/* 
  resetea todo, se envia a clientes si ganaron o perdieron
  Se tiene que esperar 20 segundos mostranso los mensajes de fin
  Luego del tiempo se inicia el proceso otra vez
*/
function terminarJuego() {
  verificarQuienGana()

  jugadores.forEach(jugador => {
    //informar que cada jugador perdio (un poco reduntante)
    if (jugador.perdio) {
      console.log(jugador.token + ' perdio! La pifiaste, men')
      juegoStatus.tokensGanadores.push(jugador.token) //agregar token de ganadores a array
    } else {
      console.log(jugador.token + ' gano! Buena la rata')
      juegoStatus.tokensGanadores.push(jugador.token) //agregar token de perdedores a array
    }
  })

  juegoStatus.terminado = true

  setTimeout(function() {
    // tiempo muerto
    jugadores = []
    casaStatus.cartas = []
    juegoStatus.Comenzado = false
    juegoStatus.jugadoresConectados = 0
    juegoStatus.jugadorEnTurno = null
    juegoStatus.terminado = false

    // empezarJuego()
  }, 20000)
}

/* 
  PETICION cliente
  Jugador se planta y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno
*/
function plantar(token) {
  // Miro si el pana esta en turno
  let turno = verificarJugadorEnTuno(token)

  if (turno) {
    for (let index = 0; index < jugadores.length; index++) {
      if (jugadores[index].token === token) {
        jugadores[index].plantado = true
        siguienteTurno()

        return 'Plantado con exito'
      }
    }
  } else {
    return 'No es tu turno'
  }
}

/* 
  PETICION cliente
  Jugador lo invoca y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno

*/
function cartaCartaAdicional(token) {
  let turno = verificarJugadorEnTuno(token)

  if (turno) {
    //garantizar que es su turno
    for (let index = 0; index < jugadores.length; index++) {
      if (jugadores[index].token === token) {
        jugadores[index].cartas.push(newCarta()) //agregar nueva carta
        let total = contarCartas(jugadores[index].cartas) //revisar total suma

        if (total > 21) {
          //si ya perdio, pasar de turno e informar usuario que la cago
          console.log('la pifiaste')
          siguienteTurno()

          return 'Perdiste'
        }

        return 'Carta agregada con exito'
      }
    }
  } else {
    return 'No es tu turno'
  }
}

/* 
  PETICION GET cliente
  Devuelve solo una carta de la casa, porque la otra es oculta
*/
function casaStatusRequest() {
  if (juegoStatus.terminado === true) {
    return casaStatus.cartas
  } else {
    return [casaStatus.cartas[1]]
  }
}

/* 
  PETICION GET cliente
  Retorna el jugador en la pos del array requerida
*/
function jugadorStatusRequest() {
  let array = []

  jugadores.forEach(jugador => {
    let player = {
      token: jugador.token,
      apuesta: jugador.apuesta,
      cartas: jugador.cartas
    }
    array.push(player)
  })

  return array
}

/* 
  PETICION POST cliente
  Retorna el server status
*/
function juegoStatusRequest() {}

module.exports = {
  conectarJugador,
  plantar,
  cartaCartaAdicional,
  casaStatusRequest,
  jugadorStatusRequest,
  juegoStatusRequest
}
