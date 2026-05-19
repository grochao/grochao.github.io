
function obtenerFechaActualES() {
    const fecha = new Date();

    const dia = String(fecha.getDate()).padStart(2, "0");

    const meses = [
        "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
        "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ];

    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return [dia, mes, anio];
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[?&amp;]/g, '\\$&');
    const regex = new RegExp('[?&amp;]' + name + '=([^&#]*)');
    const results = regex.exec(url);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
function formatearCodigo(valor) {
    const limpio = valor.trim().toUpperCase();

    const parte1 = limpio.slice(0, 3);
    const parte2 = limpio.slice(3, 9);
    const parte3 = limpio.slice(9, 13);
    const letra = limpio.slice(13);

    return `${parte1}-${parte2}-${parte3}${letra}`;
}

function numeroALetras(numero) {

    // SANITIZAR EXTRA
    numero = String(numero)
        .replace(/[^0-9.]/g, "");

    // DEJAR SOLO UN .
    const partesFix = numero.split(".");

    if (partesFix.length > 2) {
        numero = partesFix[0] + "." + partesFix.slice(1).join("");
    }

    numero = parseFloat(numero || 0);

    const UNIDADES = [
        "",
        "UN",
        "DOS",
        "TRES",
        "CUATRO",
        "CINCO",
        "SEIS",
        "SIETE",
        "OCHO",
        "NUEVE"
    ];

    const DECENAS = [
        "",
        "DIEZ",
        "VEINTE",
        "TREINTA",
        "CUARENTA",
        "CINCUENTA",
        "SESENTA",
        "SETENTA",
        "OCHENTA",
        "NOVENTA"
    ];

    const CENTENAS = [
        "",
        "CIENTO",
        "DOSCIENTOS",
        "TRESCIENTOS",
        "CUATROCIENTOS",
        "QUINIENTOS",
        "SEISCIENTOS",
        "SETECIENTOS",
        "OCHOCIENTOS",
        "NOVECIENTOS"
    ];

    function convertirMenor100(n) {

        if (n < 10) {
            return UNIDADES[n];
        }

        const especiales = {
            10: "DIEZ",
            11: "ONCE",
            12: "DOCE",
            13: "TRECE",
            14: "CATORCE",
            15: "QUINCE",
            16: "DIECISÉIS",
            17: "DIECISIETE",
            18: "DIECIOCHO",
            19: "DIECINUEVE",
            20: "VEINTE",
            21: "VEINTIÚN",
            22: "VEINTIDÓS",
            23: "VEINTITRÉS",
            24: "VEINTICUATRO",
            25: "VEINTICINCO",
            26: "VEINTISÉIS",
            27: "VEINTISIETE",
            28: "VEINTIOCHO",
            29: "VEINTINUEVE"
        };

        if (especiales[n]) {
            return especiales[n];
        }

        const decena = Math.floor(n / 10);
        const unidad = n % 10;

        return unidad === 0
            ? DECENAS[decena]
            : `${DECENAS[decena]} Y ${UNIDADES[unidad]}`;
    }

    function convertirMenor1000(n) {

        if (n === 0) {
            return "";
        }

        if (n === 100) {
            return "CIEN";
        }

        const centena = Math.floor(n / 100);
        const resto = n % 100;

        return `${CENTENAS[centena]} ${convertirMenor100(resto)}`.trim();
    }

    function convertirNumero(n) {

        if (n === 0) {
            return "CERO";
        }

        if (n < 1000) {
            return convertirMenor1000(n);
        }

        if (n < 1000000) {

            const miles = Math.floor(n / 1000);
            const resto = n % 1000;

            let textoMiles = "";

            if (miles === 1) {
                textoMiles = "MIL";
            } else {
                textoMiles = `${convertirMenor1000(miles)} MIL`;
            }

            return `${textoMiles} ${convertirMenor1000(resto)}`.trim();
        }

        if (n < 1000000000) {

            const millones = Math.floor(n / 1000000);
            const resto = n % 1000000;

            let textoMillones = "";

            if (millones === 1) {
                textoMillones = "UN MILLÓN";
            } else {
                textoMillones = `${convertirNumero(millones)} MILLONES`;
            }

            return `${textoMillones} ${convertirNumero(resto)}`.trim();
        }

        return "NÚMERO DEMASIADO GRANDE";
    }

    const partes = Number(numero).toFixed(2).split(".");

    const enteros = parseInt(partes[0], 10);
    const decimales = partes[1];

    return `${convertirNumero(enteros)} CÓRDOBAS CON ${decimales}/100`;
}


window.addEventListener('load', async function () {
    const input = document.getElementById("efectivo");

    input.addEventListener("input", function () {

        let valor = this.value;

        // ELIMINAR TODO LO QUE NO SEA 0-9 O .
        valor = valor.replace(/[^0-9.,]/g, "");

        // DEJAR SOLO UN .
        const partes = valor.split(".");

        if (partes.length > 2) {
            valor = partes[0] + "." + partes.slice(1).join("");
        }

        // OPCIONAL:
        // LIMITAR A 2 DECIMALES
        if (valor.includes(".")) {

            const [entero, decimal] = valor.split(".");

            valor = entero + "." + decimal.slice(0, 2);
        }

        this.value = valor;
    });

    input.addEventListener("keyup", function () {

        console.log(
            document.getElementById("cant-letra").innerHTML = numeroALetras(this.value) + ".-"
        );
    });

    const id = getParameterByName('id');
    const nombre = getParameterByName('nombre');
    const fecha = obtenerFechaActualES();
    const dia = document.getElementById("dia")
    const mes = document.getElementById("mes")
    const anio = document.getElementById("anio")

    if (dia) {
        console.log("entro")
        dia.textContent = fecha[0];
    }
    if (mes) {
        console.log("entro")
        mes.textContent = fecha[1];
    }
    if (anio) {
        console.log("entro")
        anio.textContent = fecha[2];
    }

    if (id) {
        const _cedula_ = ((id.trim()).replace(/\s|-/g, ''));
        const inputId = document.getElementById("id");
        if (inputId) {
            inputId.value = formatearCodigo(_cedula_);
        }
    }
    if (nombre) {
        const inputNombre = document.getElementById("nombre");
        if (inputNombre) {
            inputNombre.value = nombre;
        }
    }
    // document.querySelector('.loading').style.display = 'none';
    // const app = new OrganizationalChartCore();
    //  await app.loadStage();

    //const coreKeyEvents = new CoreKeyEvents(await app.exportAllSlidesToPNG());


});