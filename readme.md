# Mokepon! 🐾🔥💧🌱

Mokepon es un juego web multijugador de batalla de mascotas construido con **HTML5**, **CSS3**, **JavaScript Vanilla** (DOM y API de Canvas) y un backend en **Node.js + Express**. Los jugadores eligen una mascota Mokepon (*Hipodoge*, *Capipepo* o *Ratigueya*), se desplazan en tiempo real por un mapa 2D en Canvas para encontrar oponentes y combaten usando ataques elementales (*Fuego* 🔥, *Agua* 💧 y *Tierra* 🌱).

---

## 📁 Estructura del Proyecto e Información de los Archivos

```text
moquepon/
├── index.js                        # Servidor backend en Node.js + Express y API REST
├── package.json                    # Metadatos del proyecto y dependencias (express, cors)
├── package-lock.json               # Versiones exactas de las dependencias instaladas
├── readme.md                       # Documentación del proyecto
└── public/                         # Archivos estáticos del frontend servidos por Express
    ├── index.html                  # Interfaz principal del juego (Selección, Mapa y Combate)
    ├── styles.css                  # Estilos del juego (Tema Dracula, Flexbox, CSS Grid, Media Queries)
    ├── js/
    │   └── script.js               # Lógica del frontend, renderizado del mapa en Canvas y peticiones fetch
    └── assets/
        └── img/
            ├── capipepo.png        # Imagen de tarjeta de Capipepo
            ├── capipepo-avatar.png # Avatar de Capipepo para el mapa
            ├── hipodoge.png        # Imagen de tarjeta de Hipodoge
            ├── hipodoge-avatar.png # Avatar de Hipodoge para el mapa
            ├── ratigueya.png       # Imagen de tarjeta de Ratigueya
            ├── ratigueya-avatar.png# Avatar de Ratigueya para el mapa
            └── mokemap.png         # Imagen de fondo del mapa en Canvas
```

### Descripción Detallada de los Archivos

- **`index.js` (Servidor Backend)**
  - Configura un servidor **Express** en el puerto `8080`, habilita **CORS** (`cors`), procesa cuerpos de peticiones en formato JSON (`express.json()`) y sirve los archivos estáticos del frontend desde la carpeta `public/` (`express.static('public')`).
  - Define las clases `Jugador` y `Mokepon` en el backend y almacena los jugadores activos en memoria (`jugadores`).
  - Expone 5 endpoints para gestionar el registro de jugadores, la asignación de mascotas, las coordenadas en el mapa en tiempo real y la sincronización de ataques.

- **`package.json`**
  - Gestiona la configuración del proyecto y las dependencias del backend: `express` (`^5.3.0`) y `cors` (`^2.8.6`).

- **`public/index.html` (Estructura HTML del Frontend)**
  - Dividido en tres secciones principales:
    1. `#seleccionar-mascota`: Renderiza dinámicamente las tarjetas de los Mokepones dentro de `#contenedorTarjetas`.
    2. `#ver-mapa`: Contiene el elemento `<canvas id="mapa">` y los botones direccionales en pantalla compatibles tanto con eventos de ratón (`onmousedown`/`onmouseup`) como con pantallas táctiles de dispositivos móviles (`ontouchstart`/`ontouchend`).
    3. `#seleccionar-ataque`: Muestra los botones de ataque dinámicos (`#contenedorAtaques`), el estado del combate (`#mensajes` / `#resultado`), el botón de reinicio (`#boton-reiniciar`) y el historial de ataques en dos columnas (`.ataques`).

- **`public/styles.css` (Estilos del Frontend)**
  - Utiliza la **paleta de colores Dracula** (`#282a36`, `#44475a`, `#f8f8f2`, `#6272a4`, `#8be9fd`, `#50fa7b`, `#ffb86c`, `#ff79c6`, `#bd93f9`, `#ff5555`, `#f1fa8c`) y las fuentes de Google Fonts (`Fredoka` e `Inter`).
  - Implementa **Flexbox** para centrar secciones y alinear tarjetas/botones, el selector `input:checked + label` para resaltar el Mokepon seleccionado, **CSS Grid** (`grid-template-columns: 100px 100px`) para organizar los ataques del jugador y del enemigo en columnas, y **Media Queries** (`@media (max-width: 560px)` y `@media (max-width: 300px)`) para el diseño responsivo en móviles.

- **`public/js/script.js` (Lógica del Frontend)**
  - Define la clase `Mokepon` del frontend (con propiedades de estadísticas, ataques y posición/velocidad en el canvas) e instancia a *Hipodoge*, *Capipepo* y *Ratigueya*.
  - Controla el ciclo de dibujo 2D en `<canvas>` (`pintarCanvas`), el movimiento por teclado (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) y por botones en pantalla, la detección de colisiones (`revisarColision`), la secuencia de 5 rondas de ataques (`secuenciaAtaque`) y el resultado del combate (`combate`).
  - Se comunica con el servidor backend mediante peticiones `fetch`.

---

## 🌐 Secciones de `fetch` en `public/js/script.js` (Frontend)

El frontend se comunica con el servidor Express a través de **5 secciones `fetch`** en `public/js/script.js`:

### 1. `unirseAlJuego()` — Unirse a la partida (`GET /unirse`)
Se ejecuta dentro de `iniciarJuego()` cuando carga la página. Solicita un ID único de jugador al servidor y lo guarda en la variable `jugadorId`.
```javascript
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
```

### 2. `seleccionarMokepon(mascotaJugador)` — Registrar el Mokepon elegido (`POST /mokepon/:jugadorId`)
Se ejecuta dentro de `seleccionarMascotaJugador()` después de que el jugador elige su mascota. Envía el nombre del Mokepon seleccionado en formato JSON para asociarlo con `jugadorId` en el servidor.
```javascript
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
```

### 3. `enviarPosicion(x, y)` — Sincronizar coordenadas del mapa y recibir enemigos (`POST /mokepon/:jugadorId/posicion`)
Se ejecuta cada `50ms` dentro de `pintarCanvas()`. Envía las coordenadas `(x, y)` actuales del jugador en el canvas y recibe la lista de los demás jugadores conectados (`enemigos`) junto con sus Mokepones y posiciones para dibujarlos en el mapa y verificar colisiones.
```javascript
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
                        // Instancia y actualiza los Mokepones enemigos en el mapa
                    });
            }
        });
}
```

### 4. `enviarAtaques()` — Enviar los 5 ataques del jugador (`POST /mokepon/:jugadorId/ataques`)
Se ejecuta dentro de `secuenciaAtaque()` una vez que el jugador ha seleccionado sus 5 ataques (`ataqueJugador.length === 5`). Envía el arreglo de 5 ataques al servidor e inicia un intervalo que consulta `obtenerAtaques` cada `50ms`.
```javascript
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
```

### 5. `obtenerAtaques()` — Consultar los 5 ataques del enemigo (`GET /mokepon/:enemigoId/ataques`)
Se consulta cada `50ms` después de que el jugador termina de elegir sus ataques. Cuando el oponente (`enemigoId`) también ha enviado sus 5 ataques (`ataques.length === 5`), los guarda en `ataqueEnemigo` y ejecuta `combate()`.
```javascript
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
```

---

## 📱 Cómo Jugar desde el Celular (Configuración de Dirección IPv4 Inalámbrica)

Si las URLs de `fetch` en `public/js/script.js` usan `http://localhost:8080`, el celular intentará conectarse a sí mismo en lugar de conectarse a tu computadora donde corre el servidor Node.js. Para jugar entre dispositivos (por ejemplo, PC + celular):

1. **Obtén la dirección IPv4 de tu conexión inalámbrica (Wi-Fi)**:
   - Abre una terminal (PowerShell o Símbolo del sistema) y ejecuta:
     ```powershell
     ipconfig
     ```
   - Busca en la sección **Adaptador de LAN inalámbrica Wi-Fi** el valor de **Dirección IPv4**:
     ```text
     Adaptador de LAN inalámbrica Wi-Fi:
        Dirección IPv4. . . . . . . . . . . . . . : 192.168.1.4
     ```

2. **Reemplaza `localhost` por la dirección IPv4 inalámbrica en `public/js/script.js`**:
   - Asegúrate de que las 5 llamadas `fetch` en `public/js/script.js` (`unirseAlJuego`, `seleccionarMokepon`, `enviarAtaques`, `obtenerAtaques` y `enviarPosicion`) usen tu dirección IPv4 de Wi-Fi en lugar de `localhost`:
     - Cambiar: `http://localhost:8080/...`
     - Por: `http://192.168.1.4:8080/...` *(ya actualizado en `public/js/script.js`)*
   - *(Nota: Si en otro momento tu router te asigna una dirección IP local distinta, actualiza `192.168.1.4` en esas 5 URLs de `fetch` con tu nueva dirección IPv4).*

3. **Inicia el servidor y conéctate desde el celular**:
   - En la carpeta raíz del proyecto, inicia el servidor backend:
     ```bash
     node index.js
     ```
   - Asegúrate de que tanto tu computadora como tu celular estén conectados a la **misma red Wi-Fi**.
   - Abre el navegador en ambos dispositivos e ingresa a:
     ```text
     http://192.168.1.4:8080
     ```
