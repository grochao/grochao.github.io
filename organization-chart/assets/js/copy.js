"use strict";
$(function () {
    /*
        let layer;
        // Función para crear boxes con minWidth
        function crearBox({
            x,
            y,
            nombre,
            imgURL = '',
            textsize = 25,
            textcolor = '#ffffff',
            borderColor = "#80BC00",
            borderWidth = 4,
            shadowColor = "#06511F",
            shadowBlur = 20,
            shadowOffsetX = 4,
            shadowOffsetY = 4,
            shadowOpacity = 0.3,
            cornerRadius = null,
            background = "#026937",
            padding = 20,
            extraWidth = 30,
            maxWidth = 500,
            minWidth = 300  // Nuevo parámetro minWidth
    
    
    
        }) {
            const group = new Konva.Group({ x, y, name: 'box_node', draggable: true, });
    
            // Crear texto para medir su altura
            const textoTitulo = new Konva.Text({
                text: nombre,
                fontSize: textsize,
                fontStyle: 'bold',
                fill: textcolor,
                padding: padding,
                width: maxWidth - padding * 2 - (imgURL ? 80 + padding : 0),
                wrap: 'word',
                align: 'left'
            });
    
            // Calcular altura del texto
            const textHeight = textoTitulo.height();
    
            // Calcular altura del box (2 veces la altura del texto + padding vertical)
            const boxHeight = (textHeight * 2) + (padding * 2);
    
            // Tamaño de la imagen (ajustado a la altura del box)
            const imageSize = imgURL ? boxHeight - padding * 2 : 0;
    
            // Posición vertical para centrar imagen y texto
            const verticalCenter = padding;
    
            // Ancho total del box (considerando minWidth)
            const textWidth = Math.min(maxWidth - padding * 2 - (imgURL ? imageSize + padding : 0),
                textoTitulo.getTextWidth());
    
            // Calcular ancho necesario sin considerar minWidth
            const calculatedWidth = padding + (imgURL ? imageSize + padding : 0) + textWidth + padding + extraWidth;
    
            // Aplicar minWidth y maxWidth
            const totalWidth = Math.max(
                minWidth,
                Math.min(maxWidth, calculatedWidth)
            );
    
            // Crear rectángulo de fondo
            const backgroundRect = new Konva.Rect({
                width: totalWidth,
                height: boxHeight,
                fill: background,
                cornerRadius: (cornerRadius===null?boxHeight/2: cornerRadius ),
                stroke: borderColor,
                strokeWidth: borderWidth,
                shadowColor: shadowColor,
                shadowBlur: shadowBlur,
                shadowOffset: { x: shadowOffsetX, y: shadowOffsetY },
                shadowOpacity: shadowOpacity,
            });
    
            group.add(backgroundRect);
    
            // Función para cargar imagen
            const cargarImagen = (callback) => {
                if (!imgURL) return callback(null);
    
                const img = new window.Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => callback(img);
                img.onerror = () => {
                    console.warn('⚠️ Imagen no cargó, se omitirá.');
                    callback(null);
                };
                img.src = imgURL;
            };
    
            // Cargar imagen y crear elementos
            cargarImagen((img) => {
                // Crear imagen si está disponible
                if (img) {
                    const imagenKonva = new Konva.Image({
                        x: padding,
                        y: verticalCenter,
                        width: imageSize,
                        height: imageSize,
                        image: img,
                        cornerRadius: imageSize / 2,
                        clipFunc: function (ctx) {
                            ctx.beginPath();
                            ctx.arc(imageSize / 2, imageSize / 2, imageSize / 2, 0, Math.PI * 2);
                            ctx.closePath();
                        },
                    });
                    group.add(imagenKonva);
                }
    
                // Configurar texto - CENTRADO CUANDO NO HAY IMAGEN
                if (img) {
                    // Con imagen: texto a la derecha de la imagen
                    textoTitulo.x(padding + imageSize + padding);
                } else {
                    // Sin imagen: texto centrado horizontalmente
                    textoTitulo.align('center');
                    textoTitulo.width(totalWidth - padding * 2);
                    textoTitulo.x(padding);
                }
    
                // Centrar verticalmente siempre
                textoTitulo.y((boxHeight - textHeight) / 2);
    
                group.add(textoTitulo);
    
                layer.add(group);
                layer.draw();
            });
        }
    
        // Posiciones aleatorias para nuevos boxes
        function getRandomPosition() {
            return {
                x: Math.random() * (width - 300),
                y: Math.random() * (height - 150)
            };
        }
    
      
    
        $(window).load(function () {
            // let { stage } = initStage();
            // Configuración inicial del canvas
            const width = window.innerWidth * 0.9;
            const height = window.innerHeight * 0.6;
    
            const stage = new Konva.Stage({
                container: 'ANSChart',
                width: width,
                height: height,
            });
    
            layer = new Konva.Layer();
            stage.add(layer);
    
            // Variable para almacenar minWidth actual
            let currentMinWidth = 300;
            console.log("antes");
    
    
            // Crear box inicial
            crearBox({
                x: width / 2 - 200,
                y: height / 2 - 200,
                nombre: "BOD",
                textsize: 32,
                textcolor: "#ffffff",
                padding: 0,
                extraWidth: 0,
                minWidth: currentMinWidth
            });
    
            crearBox({
                x: width / 2 - 200,
                y: height / 2 - 100,
                nombre: "DIRECTOR GENERAL",
                imgURL: "https://lh3.googleusercontent.com/a/ACg8ocJQR4X3efLavov-WfIWB0pLlu-2tJHOSDRMvWcDUfwEECA7pg=s120-p-mo",
                textsize: 24,
                
                padding: 5,
                extraWidth: 10,
                minWidth: currentMinWidth
            });
    
            crearBox({
                x: width / 2 - 200,
                y: height / 2 - 0,
                nombre: "Business Director",
                imgURL: "https://lh3.googleusercontent.com/a-/ALV-UjWQmlBAjAlO1dOcZc1K-K5gp3TZf1OpKIhJuWDuAaFKY17zF5bx=s48-p",
                textsize: 24,
                padding: 5,
                extraWidth: 10,
                minWidth: currentMinWidth
            });
    
    
           
            console.log("después");
    
        });
    */
    const _JSON_SLIDERS_ = {
        "Settings": {
            width: 1920,
            height: 1080,
            total_pages: 3,
        },
        "Pages": [
            {
                page_name: "Page 1",
            },
            {
                page_name: "Page 2"
            },
            {
                page_name: "Page 3"
            }
        ]
    }
    const virtualWidth = 1920;
    const virtualHeight = 1080;
    const stages = [];
    const MIN_SCALE = 0.3;
    const MAX_SCALE = 3;
    function InitSliders() {

    }

    function entrarPantallaCompleta() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    function salirPantallaCompleta() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }




    $(".icon_maximize").click(function () {
        entrarPantallaCompleta();
        $(this).parent().addClass("btn-hidden");
        $(".icon_minimize").parent().removeClass("btn-hidden");
    });
    $(".icon_minimize").click(function () {
        salirPantallaCompleta();
        $(this).parent().addClass("btn-hidden");
        $(".icon_maximize").parent().removeClass("btn-hidden");
    });

    function refreshSliders() {

    }
    function resizeStage(stage, container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const scaleX = containerWidth / virtualWidth;
        const scaleY = containerHeight / virtualHeight;
        const scale = Math.min(scaleX, scaleY);

        stage.width(virtualWidth * scale);
        stage.height(virtualHeight * scale);
        stage.scale({ x: scale, y: scale });
        stage.draw();
    }
    function enableLayerDrag(stage) {
        let isDragging = false;
        let lastPos = null;

        stage.on('mousedown touchstart', (e) => {
            const isDraggableDisabled = e.target?.attrs?.disablePanning;
            if (!isDraggableDisabled) {
                isDragging = true;
                lastPos = stage.getPointerPosition();
            }
        });

        stage.on('mouseup touchend', () => {
            isDragging = false;
        });

        stage.on('mousemove touchmove', () => {
            if (!isDragging || !lastPos) return;

            const pointerPos = stage.getPointerPosition();
            const dx = pointerPos.x - lastPos.x;
            const dy = pointerPos.y - lastPos.y;

            let newX = stage.x() + dx;
            let newY = stage.y() + dy;

            // Restricciones
            const scale = stage.scaleX();
            const stageWidthScaled = stage.width();
            const stageHeightScaled = stage.height();
            const contentWidth = virtualWidth * scale;
            const contentHeight = virtualHeight * scale;

            const minX = Math.min(0, stageWidthScaled - contentWidth);
            const maxX = Math.max(0, stageWidthScaled - contentWidth);

            const minY = Math.min(0, stageHeightScaled - contentHeight);
            const maxY = Math.max(0, stageHeightScaled - contentHeight);

            newX = Math.min(maxX, Math.max(minX, newX));
            newY = Math.min(maxY, Math.max(minY, newY));

            stage.position({ x: newX, y: newY });
            stage.batchDraw();
            lastPos = pointerPos;
        });
    }

    function enableZoom(stage, container) {
        container.addEventListener('wheel', (e) => {
            e.preventDefault();

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale
            };

            const direction = e.deltaY > 0 ? -1 : 1;
            const zoomFactor = 0.1;
            let newScale = oldScale * (1 + direction * zoomFactor);

            newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale
            };

            stage.position(newPos);
            stage.batchDraw();
        });
    }
    function LoadPage() {


        _JSON_SLIDERS_.Pages.forEach((page, index) => {

            console.log("Cargando página: " + page.page_name);

            const slidersDiv = d3.select("#sliders");
            const slideDiv = slidersDiv.append("div")
                .attr("class", "slide");
            const slideContentDIV = slideDiv.append("div")
                .attr("class", "slide-content")
                .attr("id", "slide-id-" + index);

            const ratio = 16 / 9;
            let stageWidth = virtualWidth;
            let stageHeight = virtualHeight;

            const stage = new Konva.Stage({
                container: "slide-id-" + index,
                className: "slide-stage",
                width: stageWidth,
                height: stageHeight,
            });
            var layer = new Konva.Layer();

            const border = new Konva.Rect({
                x: 0,
                y: 0,
                width: stage.width(),
                height: stage.height(),

                fill: 'ededed' // Border thickness
            });

            // Add the border to the layer
            layer.add(border);

            // Crea el cuadrado
            var square = new Konva.Rect({
                x: 50,
                y: 50,
                width: 100,
                height: 100,
                fill: 'green',
                stroke: 'black',
                strokeWidth: 4
            });

            var square2 = new Konva.Rect({
                x: 200,
                y: 120,
                width: 100,
                height: 200,
                fill: 'RED',
                stroke: 'black',
                strokeWidth: 4
            });

            // Agrega el cuadrado a la capa
            layer.add(square);
            layer.add(square2);

            // Agrega la capa al escenario
            stage.add(layer);
            const container = document.getElementById("slide-id-" + index);
            stages.push({ stage, container });
            resizeStage(stage, container);
            enableZoom(stage, container);
            enableLayerDrag(stage);
            /*
            let layer = new Konva.Layer();
            stage.add(layer);
            */

            /*
                        layer = new Konva.Layer();
                        stage.add(layer);*/
            /*
             const container = document.getElementById("slide-id-" + index);
             const containerWidth = container.clientWidth;
             const containerHeight = container.clientHeight;
 
             const scaleX = containerWidth / virtualWidth;
             const scaleY = containerHeight / virtualHeight;
 
             const scale = Math.min(scaleX, scaleY);
 
             stage.width(virtualWidth * scale);
             stage.height(virtualHeight * scale);
             stage.scale({ x: scale, y: scale });
 
             stage.draw();
             
 */
        });

    }
    $(window).on('resize', function () {
        refreshSliders();
    });

    $(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
        if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
        ) {
            // Salió del modo de pantalla completa
            //console.log("Saliendo del modo de pantalla completa");

        } else {
            // Entró en modo de pantalla completa
            //console.log("Entrando en modo de pantalla completa");
            resizeStage(stage, container);
            enableZoom(stage, container);

        }
        // refreshSliders();
    });
    window.addEventListener('resize', () => {
        stages.forEach(({ stage, container }) => {
            resizeStage(stage, container);
        });
    });
    $(window).load(function () {
        refreshSliders();
        LoadPage();
    });

});

