

$(function () {
    function return_scale_display() {
        return {
            _width_: 1200,
            _height_: 627
        }
    }

    function loadScript() {
        hljs.highlightAll();

        const codeElement = document.querySelector("code.language");
        const codeContent = `` +
            `= Table.ReplaceValue(` +
            `\n  #"paso_anterior",` +
            `\n  each` +
            `\n     [NOMBRE],` +
            `\n  each ` +
            `\n     Text.FromBinary(Text.ToBinary([NOMBRE], 437), 1252),` +
            `\n  Replacer.ReplaceValue,` +
            `\n  {"NOMBRE"}` +
            `\n)`;
        codeElement.textContent = codeContent;
        hljs.highlightBlock(codeElement);

    }
    $(document).ready(function () {
        loadScript();

    });
    function capturar() {
        const div = document.getElementById("__display__");
        html2canvas(div, {
            backgroundColor: null, // respeta el fondo del div
            useCORS: true, // necesario si usas fuentes o imágenes externas
            scale: 1
        }).then(canvas => {
            const base64image = canvas.toDataURL("image/png");

            // Mostrar en etiqueta <img>
            // document.getElementById("imagen-resultado").src = base64image;

            // Descargar imagen
            const link = document.createElement('a');
            link.download = 'captura.png';
            link.href = base64image;
            link.click();
        });

    } async function copiarImagenAlPortapapeles() {
        const div = document.getElementById("__display__");

        const canvas = await html2canvas(div, { useCORS: true });
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ "image/png": blob })
                ]);
                alert("¡Imagen copiada al portapapeles!");
            } catch (err) {
                console.error("Error al copiar:", err);
                alert("No se pudo copiar la imagen. ¿Estás en HTTPS?");
            }
        }, "image/png");
    }
    $(window).load(function () {

        $("body").on('click', '[class*="export"]', function () {
            $(".__display__").css({
                "transform": "scale(1)"

            });
            if ($(this).hasClass("export-png")) {
                capturar();
            }
            if ($(this).hasClass("export-clipboard")) {
                copiarImagenAlPortapapeles();
            }
            resizeAll();
        });



        function resizeAll() {
            let $canvas = $('.__canvas__');
            let display = return_scale_display();

            // Medidas del contenedor
            let canvasW = $canvas.width();
            let canvasH = $canvas.height();

            // Medidas originales del display
            let displayW = display._width_;
            let displayH = display._height_;

            // Calcular el factor de escala más pequeño (para mantener proporción)
            let scaleX = canvasW / displayW;
            let scaleY = canvasH / displayH;
            let scale = Math.min(scaleX, scaleY);

            // Aplicar el scale con transform y centrar si querés
            //transformOrigin: 'top left' // o 'center center', según necesites
            /// console.clear();
            // console.log("scale(" + scale + ")");

            $(".__display__").css({
                "width": displayW + "px",
                "height": displayH + "px",
                "min-width": displayW + "px",
                "min-height": displayH + "px",
                "transform": "scale(" + (scale - 0.35) + ")"

            });
        }
        // Inicializar o destruir carrusel en base al tamaño de pantalla
        resizeAll();

        // Escuchar cambios de tamaño de ventana
        $(window).resize(resizeAll);


        /*
        
         
        */
    });
});