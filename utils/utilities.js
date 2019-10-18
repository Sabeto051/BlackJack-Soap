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
  terminado: false
}

let casaStatus = {
  cartas: []
}

function conectarJugador(apuesta = 0) {
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
  let ases = 0
  let contador = carta => {
    suma += carta.valor
  }
  let numAses = carta => {
    if (carta.id === 1) {
      ases++
    }
  }

  cc.map(contador)

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
function verificarJugadorEnTuno(token) { }

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
  let puntos = contarCartas(casaStatus.cartas);

  while (puntos < 17) {
    let cartacasa1 = newCarta()
    casaStatus.cartas.push(cartacasa1)
    puntos = contarCartas(casaStatus.cartas);
  }

  siguienteTurno();
}

/* 
  Verifica quien Gana al FINAL y devuelve o se queda con la plata de las apuestas
*/
function verificarQuienGana() { }

/* 
  resetea todo, se envia a clientes si ganaron o perdieron
  Se tiene que esperar 20 segundos mostranso los mensajes de fin
  Luego del tiempo se inicia el proceso otra vez
*/
function terminarJuego() { }

/* 
  PETICION cliente
  Jugador se planta y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno
*/
function plantar(token) { }

/* 
  PETICION cliente
  Jugador lo invoca y envia su token de verificacion
  llama a verificarJugadorEnTuno para ver si es su turno
*/
function cartaCartaAdicional(token) { }

/* 
  PETICION GET cliente
  Devuelve solo una carta de la casa, porque la otra es oculta
*/
function casaStatusRequest() { }

/* 
  PETICION GET cliente
  Retorna el jugador en la pos del array requerida
*/
function jugadorStatusRequest(posicionEnArray) { }

/* 
  PETICION POST cliente
  Retorna el server status
*/
function juegoStatusRequest() { }

module.exports = {
  conectarJugador
}
