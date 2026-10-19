const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const sectionReiniciar = document.getElementById("reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");

const sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
const spanMascotaJugador = document.getElementById("mascota-jugador");

const spanMascotaEnemigo = document.getElementById("mascota-enemigo");

const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vitas-enemigo");

const sectionMensajes = document.getElementById("resultado");
const ataquesDelJugador = document.getElementById("ataques-del-jugador");
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo");

const contenedorTarjetas = document.getElementById("contenedorTarjetas");
const contenedorAtaques = document.getElementById("contenedorAtaques");

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null;
let enemigoId = null;
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let mascotaDelJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonFuego
let botonAgua
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let lienzo = mapa.getContext("2d");
let mapaBackground = new Image();
mapaBackground.src = './assets/img/mokemap.png';
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20;
}

alturaQueBuscamos = anchoDelMapa * 600 / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let hipodoge = new Mokepon("Hipodoge", "assets/img/hipodoge.png", 5, "assets/img/hipodoge-avatar.png");
let capipepo = new Mokepon("Capipepo", "assets/img/capipepo.png", 5, "assets/img/capipepo-avatar.png");
let ratigueya = new Mokepon("Ratigueya", "assets/img/ratigueya.png", 5, "assets/img/ratigueya-avatar.png");

const HIPODOGE_ATAQUES = [
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🌱", id: "boton-tierra" }
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES);

const CAPIPEPO_ATAQUES = [
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "🌱", id: "boton-tierra" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🔥", id: "boton-fuego" }
]

capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "🔥", id: "boton-fuego" },
    { nombre: "💧", id: "boton-agua" },
    { nombre: "🌱", id: "boton-tierra" }
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(hipodoge, capipepo, ratigueya);

function iniciarJuego() {

    sectionSeleccionarAtaque.style.display = "none";

    sectionVerMapa.style.display = "none";

    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class="tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputHipodoge = document.getElementById("Hipodoge");
        inputCapipepo = document.getElementById("Capipepo");
        inputRatigueya = document.getElementById("Ratigueya");

    });

    botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);

    botonReiniciar.addEventListener("click", reiniciarJuego);

    unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://192.168.1.4:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta);
                        jugadorId = respuesta;
                    })
            }
        })
}

function seleccionarMascotaJugador() {
    sectionSeleccionarMascota.style.display = "none";

    if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id;
        mascotaJugador = inputHipodoge.id;
        sectionSeleccionarMascota.style.display = "none";
        sectionVerMapa.style.display = "flex";
    } else if (inputCapipepo.checked) {
        spanMascotaJugador.innerHTML = inputCapipepo.id;
        mascotaJugador = inputCapipepo.id;
        sectionSeleccionarMascota.style.display = "none";
        sectionVerMapa.style.display = "flex";
    } else if (inputRatigueya.checked) {
        mascotaJugador = inputRatigueya.id;
        spanMascotaJugador.innerHTML = inputRatigueya.id;
        sectionSeleccionarMascota.style.display = "none";
        sectionVerMapa.style.display = "flex";
    } else {
        alert("No has seleccionado ninguna mascota");
        sectionSeleccionarMascota.style.display = "flex";
        sectionSeleccionarAtaque.style.display = "none";
    }

    seleccionarMokepon(mascotaJugador);

    extraerAtaques(mascotaJugador);
    iniciarMapa()
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques;
        }
    }
    mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon;
    })

    botonFuego = document.getElementById("boton-fuego");
    botonAgua = document.getElementById("boton-agua");
    botonTierra = document.getElementById("boton-tierra");

    botones = document.querySelectorAll(".BAtaque");
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === "🔥") {
                ataqueJugador.push('FUEGO');
                console.log(ataqueJugador);
                boton.style.background = '#6272a4';
                boton.disabled = true;
            } else if (e.target.textContent === "💧") {
                ataqueJugador.push('AGUA');
                console.log(ataqueJugador);
                boton.style.background = '#6272a4';
                boton.disabled = true;
            } else if (e.target.textContent === "🌱") {
                ataqueJugador.push('TIERRA');
                console.log(ataqueJugador);
                boton.style.background = '#6272a4';
                boton.disabled = true;
            }
            if(ataqueJugador.length === 5) {
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.1.4:8080/mokepon/${enemigoId}/ataques`)
        .then(function(res){
            if(res.ok) {
                res.json()
                    .then(function({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
}

function seleccionarMascotaEnemigo(enemigo) {
    let mascotaAleatoria = aleatorio(0, mokepones.length - 1);

    spanMascotaEnemigo.innerHTML = enemigo.nombre;
    ataquesMokeponEnemigo = enemigo.ataques;
    secuenciaAtaque()
}

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0, mokepones.length - 1);
    if (ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push("FUEGO");
    } else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push("AGUA");
    } else {
        ataqueEnemigo.push("TIERRA");
    }
    console.log(ataqueEnemigo);
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}

function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador];
    indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

function combate() {
    clearInterval(intervalo)

    for (let i = 0; i < ataqueJugador.length; i++) {
        if (ataqueJugador[i] === ataqueEnemigo[i]) {
            indexAmbosOponentes(i, i);
            crearMensaje("EMPATE");
        } else if (ataqueJugador[i] === "FUEGO" && ataqueEnemigo[i] === "TIERRA") {
            indexAmbosOponentes(i, i);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else if (ataqueJugador[i] === "AGUA" && ataqueEnemigo[i] === "FUEGO") {
            indexAmbosOponentes(i, i);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else if (ataqueJugador[i] === "TIERRA" && ataqueEnemigo[i] === "AGUA") {
            indexAmbosOponentes(i, i);
            crearMensaje("GANASTE");
            victoriasJugador++;
            spanVidasJugador.innerHTML = victoriasJugador;
        } else {
            indexAmbosOponentes(i, i);
            crearMensaje("PERDISTE");
            victoriasEnemigo++;
            spanVidasEnemigo.innerHTML = victoriasEnemigo;
        }
    }
    resvisarVidas()
}

function resvisarVidas() {
    if (victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal("Esto fue un empate");
    } else if (victoriasJugador > victoriasEnemigo) {
        crearMensajeFinal("FELICIDADES! Ganaste 😎");
    } else {
        crearMensajeFinal("Lo siento, perdiste 😢");
    }
}

function crearMensaje(resultado) {
    let nuevoAtaqueDelJugador = document.createElement("p");
    let nuevoAtaqueDelEnemigo = document.createElement("p");

    sectionMensajes.innerHTML = resultado;
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador;
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo;

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador);
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo);
}

function crearMensajeFinal(resultadoFinal) {

    sectionMensajes.innerHTML = resultadoFinal;
    sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
    location.reload();
}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
    mascotaDelJugadorObjeto.x = mascotaDelJugadorObjeto.x + mascotaDelJugadorObjeto.velocidadX;
    mascotaDelJugadorObjeto.y = mascotaDelJugadorObjeto.y + mascotaDelJugadorObjeto.velocidadY;
    lienzo.clearRect(0, 0, mapa.width, mapa.height);
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaDelJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaDelJugadorObjeto.x, mascotaDelJugadorObjeto.y)

    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}

function enviarPosicion(x, y) {
    fetch(`http://192.168.1.4:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ enemigos }) {
                        console.log(enemigos);
                        mokeponesEnemigos = enemigos.map(function (enemigo) {
                            if (!enemigo.mokepon) {
                                return null;
                            }

                            let mokeponEnemigo = null;
                            const mokeponNombre = enemigo.mokepon.nombre || "";
                            if (mokeponNombre === "Hipodoge") {
                                mokeponEnemigo = new Mokepon("Hipodoge", "assets/img/hipodoge.png", 5, "assets/img/hipodoge-avatar.png", enemigo.id);
                            } else if (mokeponNombre === "Capipepo") {
                                mokeponEnemigo = new Mokepon("Capipepo", "assets/img/capipepo.png", 5, "assets/img/capipepo-avatar.png", enemigo.id);
                            } else if (mokeponNombre === "Ratigueya") {
                                mokeponEnemigo = new Mokepon("Ratigueya", "assets/img/ratigueya.png", 5, "assets/img/ratigueya-avatar.png", enemigo.id);
                            }

                            if (!mokeponEnemigo) {
                                return null;
                            }

                            mokeponEnemigo.x = enemigo.x
                            mokeponEnemigo.y = enemigo.y

                            return mokeponEnemigo
                        }).filter(function (mokepon) {
                            return mokepon !== null;
                        })
                    });
            }
        });
}

function moverDerecha() {
    mascotaDelJugadorObjeto.velocidadX = 5;
}

function moverIzquierda() {
    mascotaDelJugadorObjeto.velocidadX = -5;
}

function moverAbajo() {
    mascotaDelJugadorObjeto.velocidadY = 5;
}

function moverArriba() {
    mascotaDelJugadorObjeto.velocidadY = -5;
}

function detenerMovimiento() {
    mascotaDelJugadorObjeto.velocidadX = 0;
    mascotaDelJugadorObjeto.velocidadY = 0;
}

function sePresionoUnaTecla(event) {
    switch (event.key) {
        case "ArrowUp":
            moverArriba();
            break
        case "ArrowDown":
            moverAbajo();
            break
        case "ArrowLeft":
            moverIzquierda();
            break
        case "ArrowRight":
            moverDerecha();
            break
        default:
            break
    }
}

function iniciarMapa() {
    mascotaDelJugadorObjeto = obtenerObjetoMascota(mascotaJugador);
    intervalo = setInterval(pintarCanvas, 50);
    window.addEventListener("keydown", sePresionoUnaTecla);
    window.addEventListener("keyup", detenerMovimiento);
}

function obtenerObjetoMascota() {
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i];
        }
    }
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaDelJugadorObjeto.y
    const abajoMascota = mascotaDelJugadorObjeto.y + mascotaDelJugadorObjeto.alto
    const derechaMascota = mascotaDelJugadorObjeto.x + mascotaDelJugadorObjeto.ancho
    const izquierdaMascota = mascotaDelJugadorObjeto.x

    if (
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = enemigo.id
    sectionSeleccionarAtaque.style.display = "flex";
    sectionVerMapa.style.display = "none";
    seleccionarMascotaEnemigo(enemigo);
}

window.addEventListener("load", iniciarJuego);