/* =============================================
 MUSICSTORE — main.js
 Ejercicio Final Bloque 2 — Tecnologías Web
 Universidad Simón Bolívar
 ============================================= */

// ─────────────────────────────────────────────
// 1. DATOS — COLECCIONES
// ─────────────────────────────────────────────

// Array de secciones para construir el navbar dinámicamente
const secciones = ["inicio", "catalogo", "multimedia", "formulario", "contacto"];

// Map: id de sección → nombre legible en el menú
const nombresSecciones = new Map([
    ["inicio", "Inicio"],
    ["catalogo", "Catálogo"],
    ["multimedia", "Multimedia"],
    ["formulario", "Formulario"],
    ["contacto", "Contacto"]
]);

// Set de categorías únicas del inventario
const categorias = new Set(["Instrumentos", "Accesorios", "Audio"]);

// Array de productos — datos del Bloque 1 conservados
const productos = [
    { id: "001", nombre: "Guitarra acústica Yamaha F310", categoria: "Instrumentos", precio: 589000, stock: 15, disponible: "Sí" },
    { id: "002", nombre: "Teclado Casio CT-S300", categoria: "Instrumentos", precio: 319000, stock: 8, disponible: "Sí" },
    { id: "003", nombre: "Batería electrónica Roland TD-1K", categoria: "Instrumentos", precio: 2275000, stock: 3, disponible: "Sí" },
    { id: "004", nombre: "Cable XLR 3m", categoria: "Accesorios", precio: 45000, stock: 50, disponible: "Sí" },
    { id: "005", nombre: "Soporte de micrófono de pie", categoria: "Accesorios", precio: 112000, stock: 0, disponible: "No" },
    { id: "006", nombre: "Auriculares Sony MDR-ZX110", categoria: "Audio", precio: 91000, stock: 22, disponible: "Sí" }
];

// ─────────────────────────────────────────────
// 2. ESTADO
// ─────────────────────────────────────────────

let seccionActiva = "inicio";

// ─────────────────────────────────────────────
// 3. NAVBAR DINÁMICO
// ─────────────────────────────────────────────

/**
 * Genera todos los enlaces del navbar recorriendo el array
 * 'secciones' y usando el Map para obtener el nombre visible.
 */
function construirNavbar() {
    const navLinks = document.getElementById("nav-links");
    navLinks.innerHTML = "";

    // for..of para recorrer el array de secciones
    for (const id of secciones) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = "#";
        a.textContent = nombresSecciones.get(id); // usamos el Map
        a.dataset.seccion = id;

        if (id === seccionActiva) a.classList.add("activo");

        a.addEventListener("click", (e) => {
            e.preventDefault();
            cambiarSeccion(id);
        });

        li.appendChild(a);
        navLinks.appendChild(li);
    }
}

// ─────────────────────────────────────────────
// 4. CAMBIO DE SECCIÓN — switch
// ─────────────────────────────────────────────

/**
 * Cambia el contenido del main según la sección seleccionada.
 * Usa switch-case para decidir qué función de render invocar.
 * @param {string} id — identificador de la sección
 */
function cambiarSeccion(id) {
    seccionActiva = id;

    // Actualizamos clases activas del navbar con for..of
    const enlaces = document.querySelectorAll("#nav-links a");
    for (const enlace of enlaces) {
        enlace.classList.toggle("activo", enlace.dataset.seccion === id);
    }

    // Limpiamos el contenido previo
    const main = document.getElementById("main-content");
    main.innerHTML = "";

    // switch-case para decidir qué sección renderizar
    switch (id) {
        case "inicio":
            main.innerHTML = renderInicio();
            generarStats();
            break;
        case "catalogo":
            main.innerHTML = renderCatalogo();
            break;
        case "multimedia":
            main.innerHTML = renderMultimedia();
            break;
        case "formulario":
            main.innerHTML = renderFormulario();
            break;
        case "contacto":
            main.innerHTML = renderContacto();
            iniciarFormularioContacto();
            break;
        default:
            main.innerHTML = "<p>Sección no encontrada.</p>";
    }
}

// ─────────────────────────────────────────────
// 5. RENDER — INICIO
// ─────────────────────────────────────────────

function renderInicio() {
    // Calculamos totales con un bucle while
    let totalRefs = 0;
    let totalStock = 0;
    let totalValor = 0;
    let i = 0;

    while (i < productos.length) {
        totalRefs++;
        totalStock += productos[i].stock;
        totalValor += productos[i].precio;
        i++;
    }

    // Generamos los badges de categorías desde el Set
    const categoriasHTML = Array.from(categorias)
        .map(c => `<span class="badge si">${c}</span>`)
        .join(" ");

    return `
 <div class="hero">
 <span class="hero-badge"> Temporada 2025</span>
 <h1>CATÁLOGO DE PRODUCTOS <span>MUSICALES</span></h1>
 <p>Tu tienda de instrumentos, accesorios y equipos de audio. Calidad garantizada para cada músico.</p>
 </div>
 <h2>Categorías disponibles</h2>
 <p style="margin-bottom:1.5rem">${categoriasHTML}</p>
 <h2>Resumen del inventario</h2>
 <div class="stats-grid" id="stats-grid"></div>
 `;
}

/**
 * Genera las cajas de estadísticas con un bucle for clásico.
 * Se llama después de inyectar el HTML de inicio en el DOM.
 */
function generarStats() {
    const grid = document.getElementById("stats-grid");
    if (!grid) return;

    const stats = [
        { num: productos.length, label: "Referencias" },
        { num: productos.reduce((a, p) => a + p.stock, 0), label: "Uds. en stock" },
        { num: categorias.size, label: "Categorías" },
        { num: "$" + productos.reduce((a, p) => a + p.precio, 0).toLocaleString("es-CO"), label: "Valor catálogo" }
    ];

    // for clásico para generar cada caja
    for (let j = 0; j < stats.length; j++) {
        const div = document.createElement("div");
        div.className = "stat-box";
        div.innerHTML = `
 <div class="stat-num">${stats[j].num}</div>
 <div class="stat-label">${stats[j].label}</div>
 `;
        grid.appendChild(div);
    }
}

// ─────────────────────────────────────────────
// 6. RENDER — CATÁLOGO (tabla del Bloque 1)
// ─────────────────────────────────────────────

function renderCatalogo() {
    // Calculamos totales con reduce
    const totalPrecio = productos.reduce((acc, p) => acc + p.precio, 0).toLocaleString("es-CO");
    const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
    const disponibles = productos.filter(p => p.disponible === "Sí").length;

    // Filas de la tabla con forEach — datos originales del Bloque 1
    let filas = "";
    productos.forEach(p => {
        const badgeClass = p.disponible === "Sí" ? "si" : "no";
        filas += `
 <tr>
 <td>${p.id}</td>
 <td>${p.nombre}</td>
 <td>${p.categoria}</td>
 <td>$${p.precio.toLocaleString("es-CO")}</td>
 <td>${p.stock}</td>
 <td><span class="badge ${badgeClass}">${p.disponible}</span></td>
 </tr>
 `;
    });

    return `
 <h2>Catálogo de Productos Musicales</h2>
 <p>Inventario disponible — Temporada 2025</p>
 <div class="tabla-wrap">
 <table>
 <caption style="color:var(--gris-claro);font-size:0.85rem;margin-bottom:0.5rem">
 Inventario disponible — Temporada 2025
 </caption>
 <thead>
 <tr>
 <th>ID</th>
 <th>Producto</th>
 <th>Categoría</th>
 <th>Precio (COP)</th>
 <th>Stock</th>
 <th>Disponible</th>
 </tr>
 </thead>
 <tbody>${filas}</tbody>
 <tfoot>
 <tr>
 <td colspan="3">Total de referencias: ${productos.length}</td>
 <td>$${totalPrecio}</td>
 <td>${totalStock}</td>
 <td>${disponibles} / ${productos.length}</td>
 </tr>
 </tfoot>
 </table>
 </div>
 `;
}

// ─────────────────────────────────────────────
// 7. RENDER — MULTIMEDIA (Bloque 1)
// ─────────────────────────────────────────────

function renderMultimedia() {
    // Array con los elementos multimedia del Bloque 1
    const medias = [
        {
            tipo: "video",
            titulo: "Video del artista",
            html: `<iframe height="250"
 src="https://www.youtube.com/embed/fcnjrGeCc84"
 title="Video musical incrustado desde YouTube"
 allowfullscreen></iframe>`
        },
        {
            tipo: "audio",
            titulo: "Reproductor de audio",
            html: `<audio controls loop preload="metadata" style="margin-top:0.75rem">
 <source src="audio/muestra.mp3" type="audio/mpeg">
 <source src="audio/muestra.ogg" type="audio/ogg">
 Tu navegador no soporta audio HTML5.
 </audio>`
        },
        {
            tipo: "imagen",
            titulo: "Imagen del producto",
            html: `<img
 src="https://www.porthos.com.co/web/image/411194-fdba897f/EXTENSIONES%20TEL-03.png"
 alt="Porthos extensiones telefónicas"
 title="Porthos - Soluciones de telecomunicaciones">`
        }
    ];

    // Construimos el HTML de cada media con un for clásico
    let boxesHTML = "";
    for (let k = 0; k < medias.length; k++) {
        const m = medias[k];
        boxesHTML += `
 <div class="media-box">
 <h3>${m.titulo}</h3>
 ${m.html}
 </div>
 `;
    }

    return `
 <h2>Multimedia</h2>
 <div class="multimedia-grid">${boxesHTML}</div>
 `;
}

// ─────────────────────────────────────────────
// 8. RENDER — FORMULARIO (Bloque 1, íntegro)
// ─────────────────────────────────────────────

function renderFormulario() {
    // Generamos las opciones de impuestos con un array y map
    const impuestos = [
        { valor: "4", texto: "4%" },
        { valor: "10", texto: "10%" },
        { valor: "21", texto: "21%" }
    ];

    const opcionesImpuesto = impuestos
        .map(imp => `<option value="${imp.valor}">${imp.texto}</option>`)
        .join("");

    // Opciones de promoción desde un array con for..of
    const promociones = [
        { valor: "ninguno", texto: "Ninguno", checked: true },
        { valor: "transporte", texto: "Transporte gratuito", checked: false },
        { valor: "descuento", texto: "Descuento 5%", checked: false }
    ];

    let opcionesPromocion = "";
    for (const promo of promociones) {
        const checkedAttr = promo.checked ? "checked" : "";
        opcionesPromocion += `
 <label style="display:block;margin-bottom:0.3rem;color:var(--gris-claro)">
 <input type="radio" name="promocion" value="${promo.valor}" ${checkedAttr}>
 ${promo.texto}
 </label>
 `;
    }

    return `
 <h2>Información sobre el producto</h2>
 <div class="form-producto">
 <form action="procesar.php" method="post" enctype="multipart/form-data">
 <fieldset>
 <legend>Datos básicos</legend>
 <div class="campo">
 <label>Nombre</label>
 <input type="text" name="nombre" maxlength="100" placeholder="Nombre del producto">
 </div>
 <div class="campo">
 <label>Descripción</label>
 <textarea name="descripcion" rows="6" placeholder="Descripción del producto..."></textarea>
 </div>
 <div class="campo">
 <label>Foto</label>
 <input type="file" name="foto">
 </div>
 <div class="campo">
 <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer">
 <input type="checkbox" name="contador" value="si">
 Añadir contador de visitas
 </label>
 </div>
 </fieldset>

 <fieldset>
 <legend>Datos económicos</legend>
 <div class="campo">
 <label>Precio (COP)</label>
 <input type="text" name="precio" placeholder="Ej: 129.99">
 </div>
 <div class="campo">
 <label>Impuestos</label>
 <select name="impuestos">${opcionesImpuesto}</select>
 </div>
 <div class="campo">
 <label>Promoción</label>
 ${opcionesPromocion}
 </div>
 </fieldset>

 <input type="submit" value="Enviar">
 </form>
 </div>
 `;
}

// ─────────────────────────────────────────────
// 9. RENDER — CONTACTO (nueva sección JS)
// ─────────────────────────────────────────────

function renderContacto() {
    // Opciones de categoría desde el Set
    let opcionesCategoria = '<option value="">— Selecciona una categoría —</option>';
    categorias.forEach(cat => {
        opcionesCategoria += `<option value="${cat}">${cat}</option>`;
    });

    return `
 <h2>Contacto</h2>
 <p>¿Tienes dudas sobre algún producto? Escríbenos y te respondemos en menos de 24 horas.</p>
 <div class="form-contacto">
 <div class="form-grupo">
 <label for="c-nombre">Nombre</label>
 <input type="text" id="c-nombre" placeholder="Tu nombre completo">
 </div>
 <div class="form-grupo">
 <label for="c-email">Correo electrónico</label>
 <input type="email" id="c-email" placeholder="correo@ejemplo.com">
 </div>
 <div class="form-grupo">
 <label for="c-categoria">Categoría de interés</label>
 <select id="c-categoria">${opcionesCategoria}</select>
 </div>
 <div class="form-grupo">
 <label for="c-mensaje">Mensaje</label>
 <textarea id="c-mensaje" placeholder="¿En qué podemos ayudarte?"></textarea>
 </div>
 <button class="btn-enviar" id="btn-enviar">ENVIAR MENSAJE</button>
 <div id="form-mensaje"></div>
 </div>
 `;
}

/**
 * Validación del formulario de contacto con if-else y try-catch.
 */
function iniciarFormularioContacto() {
    const btn = document.getElementById("btn-enviar");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const nombre = document.getElementById("c-nombre").value.trim();
        const email = document.getElementById("c-email").value.trim();
        const categoria = document.getElementById("c-categoria").value;
        const mensaje = document.getElementById("c-mensaje").value.trim();
        const msgDiv = document.getElementById("form-mensaje");

        msgDiv.className = "";

        try {
            // Validaciones con if-else
            if (nombre.length === 0) {
                throw new Error("Por favor introduce tu nombre.");
            }
            if (!email.includes("@") || !email.includes(".")) {
                throw new Error("El correo electrónico no parece válido.");
            }
            if (categoria === "") {
                throw new Error("Selecciona una categoría de interés.");
            }
            if (mensaje.length < 10) {
                throw new Error("El mensaje debe tener al menos 10 caracteres.");
            }

            // Si pasa todas las validaciones
            msgDiv.textContent = ` ¡Gracias, ${nombre}! Hemos recibido tu consulta sobre ${categoria}. Te contactaremos pronto.`;
            msgDiv.classList.add("ok");

        } catch (error) {
            msgDiv.textContent = ` ${error.message}`;
            msgDiv.classList.add("error");
        }
    });
}

// ─────────────────────────────────────────────
// 10. FOOTER
// ─────────────────────────────────────────────

function construirFooter() {
    const footer = document.getElementById("footer");
    const anio = new Date().getFullYear();
    footer.innerHTML = `© ${anio} Catálogo de Productos Musicales — Ejercicio Final Bloque 2 · Tecnologías Web · Universidad Simón Bolívar`;
}

// ─────────────────────────────────────────────
// 11. INICIALIZACIÓN
// ─────────────────────────────────────────────

/**
 * Función principal que arranca la aplicación cuando el DOM está listo.
 */
function init() {
    construirNavbar(); // Genera el menú dinámicamente
    cambiarSeccion("inicio"); // Muestra la sección de inicio
    construirFooter(); // Renderiza el footer

    console.log("MusicStore iniciado ");
    console.log("Productos cargados:", productos.length);
    console.log("Categorías:", [...categorias]);
    console.log("Secciones:", secciones);
}

document.addEventListener("DOMContentLoaded", init);
