## Certificado

[Ver certificado de Programación Básica](https://platzi.com/p/olivernie2626/curso/3208-programacion-basica-2022/diploma/detalle/)

# Mokepon! 🐾🔥💧🌱

Mokepon es un juego web multijugador de batalla de mascotas construido con **HTML5**, **CSS3**, **JavaScript Vanilla** (DOM y API de Canvas) y un backend en **Node.js + Express**. Los jugadores eligen una mascota Mokepon (*Hipodoge*, *Capipepo* o *Ratigueya*), se desplazan en tiempo real por un mapa 2D en Canvas para encontrar oponentes y combaten usando ataques elementales (*Fuego* 🔥, *Agua* 💧 y *Tierra* 🌱).

---

## 🚀 Cómo Ejecutar y Acceder al Juego

1. **Iniciar el servidor**:
   Abre una terminal en la carpeta raíz del proyecto y ejecuta:
   ```bash
   node index.js
   ```

2. **Acceder a la interfaz**:
   Abre tu navegador web y escribe en la barra de direcciones:
   ```text
   http://localhost:8080
   ```
   > **Importante:** **NO** abras el proyecto desde **Live Server** ni abriendo el archivo `index.html` directamente. El servidor de Node.js (`index.js`) se encarga de servir tanto la interfaz estática (`public/`) como los endpoints del juego en `http://localhost:8080`. Para probar el modo multijugador en tu computadora, abre dos pestañas o ventanas del navegador en `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

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
        └── img/                    # Imágenes y avatares de los Mokepones y mapa
```

### Descripción de los Archivos Principales

- **`index.js` (Servidor Backend)**: Configura el servidor **Express** en el puerto `8080`, sirve la carpeta `public/` y expone los endpoints para gestionar jugadores, mascotas, posiciones en el mapa y ataques.
- **`public/index.html` (Estructura HTML)**: Dividido en tres secciones: selección de mascota (`#seleccionar-mascota`), mapa en `<canvas>` con botones direccionales (`#ver-mapa`) y pantalla de combate (`#seleccionar-ataque`).
- **`public/styles.css` (Estilos CSS)**: Estiliza la interfaz con la paleta de colores **Dracula**, Google Fonts (`Fredoka` e `Inter`), **Flexbox**, **CSS Grid** y **Media Queries** responsivas.
- **`public/js/script.js` (Lógica del Frontend)**: Controla la creación de Mokepones, el renderizado y colisiones en el `<canvas>`, el sistema de combate y las peticiones `fetch` hacia `http://localhost:8080`.

---

## 🌐 Secciones de `fetch` en `public/js/script.js` (Frontend)

El frontend se comunica con el servidor Express a través de **5 peticiones `fetch`** apuntando a `http://localhost:8080`:

### 1. `unirseAlJuego()` — Unirse a la partida (`GET /unirse`)
Solicita un ID único de jugador al servidor cuando carga el juego y lo guarda en `jugadorId`.
```javascript
function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
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
Envía el nombre del Mokepon seleccionado en formato JSON para asociarlo con `jugadorId` en el servidor.
```javascript
function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
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
Envía cada `50ms` las coordenadas `(x, y)` actuales del jugador en el canvas y recibe la lista de los demás jugadores conectados (`enemigos`) para dibujarlos en el mapa y detectar colisiones.
```javascript
function enviarPosicion(x, y) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
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
Envía el arreglo con los 5 ataques seleccionados por el jugador e inicia un intervalo que consulta `obtenerAtaques` cada `50ms`.
```javascript
function enviarAtaques() {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
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
Consulta cada `50ms` si el oponente (`enemigoId`) ya envió sus 5 ataques para almacenarlos en `ataqueEnemigo` e iniciar `combate()`.
```javascript
function obtenerAtaques() {
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
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

## 📱 Opcional: Cómo Jugar desde el Celular en la Misma Red Wi-Fi

Si deseas jugar desde un celular conectado a la misma red Wi-Fi que tu computadora:

1. Ejecuta `ipconfig` en tu terminal y busca la **Dirección IPv4** en la sección **Adaptador de LAN inalámbrica Wi-Fi** (por ejemplo, `192.168.1.4`).
2. En `public/js/script.js`, reemplaza `localhost` por esa dirección IPv4 en las 5 llamadas `fetch` (por ejemplo, `http://192.168.1.4:8080/...`).
3. Con el servidor corriendo (`node index.js`), ingresa desde el navegador del celular a `http://<TU_IPV4>:8080`.
