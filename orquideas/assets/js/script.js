

$(function () {
    function toSlug(cadena) {
        return cadena
            .toLowerCase() // Convertir a minúsculas
            .normalize("NFD") // Normalizar para separar letras y acentos
            .replace(/[\u0300-\u036f]/g, "") // Eliminar los acentos
            .replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres no válidos
            .replace(/\s+/g, "-") // Reemplazar espacios por guiones
            .replace(/-+/g, "-") // Eliminar guiones redundantes
            .replace(/^-|-$/g, "")// Eliminar guiones al inicio y al final
            .replace(/-/g, "%20")
    }

    $(window).load(function () {
        const $carousel = $(".box-icons .owl-carousel");

        $("body").on("change", "#txt_search", function () {
            var _SELECTED_VALUE_ = ($.trim($(this).val()));
            var name = toSlug(($("#txt_name").text()).toLowerCase());
            // alert(name);
            switch (_SELECTED_VALUE_) {
                case "google":
                    url = "https://www.google.com/search?q=";
                    break;
                case "https://es.wikipedia.org/wiki/":
                    url = "#";
                    break;
                case "picturethis":
                    url = "https://www.picturethisai.com/es/search?text=";
                    break;
                case "royal":
                    url = "https://powo.science.kew.org/results?q=";
                    break;
                case "enciclovida":
                    url = "https://enciclovida.mx/busquedas/resultados?utf8=%E2%9C%93&busqueda=basica&id=&nombre=";
                    break;
                case "plantid":
                    url = "https://plantid.com.mx/planta/";
                    break;
                case "ecured":
                    url = "https://www.ecured.cu/";
                    break;
                case "pinterest":
                    url = "https://es.pinterest.com/search/pins/?rs=typed&q=";
                    break;
                case "wikispecies":
                    url = "https://species.wikimedia.org/wiki/";
                    break;
                case "wikimedia":
                    url = "https://commons.wikimedia.org/w/index.php?title=Special:MediaSearch&go=Go&type=image&uselang=es-419&search=";
                    break;
                case "inaturalistmx":
                    url = "https://mexico.inaturalist.org/search?q=";
                    break;
                case "flickr":
                    url = "https://www.flickr.com/search/?text=";
                    break
                case "gbif":
                    url = "https://www.gbif.org/es/species/search?q=";
                    break;
                case "ecosdelbosque":
                    url = "https://ecosdelbosque.com/search/node?spammaster_extra_field_1=&spammaster_extra_field_2&keys=";
                    break;
                default:
                    url = "https://www.google.com/search?q=";
                    break;
            }
            $("#link").attr("href", url + name)
        })
        $(".pictures").on("click", ".img", function () {
            $(this).addClass("popup");
            var _img_ = $(this).find("img");
            _img_.attr("style", "");

            if ($(window).width() > $(window).height()) {
                _img_.css("height", "90vh");
                _img_.css("width", "80vw");


            } else {
                _img_.css("height", "70vh");
                _img_.css("width", "80vw");
            }
            var _width_img_ = _img_.outerWidth();
            var _height_img_ = _img_.outerHeight();
            _img_.css("top", $(window).height() / 2 - (_height_img_ / 2))
            _img_.css("left", $(window).width() / 2 - (_width_img_ / 2))
            console.log($(window).width() + " - - " + $(window).height())
        })
        function checkCarousel() {
            if ($(window).width() > 500) {
                if ($carousel.hasClass("owl-loaded")) {
                    $carousel.trigger('destroy.owl.carousel').removeClass('owl-carousel owl-loaded');
                    $carousel.find('.owl-stage-outer').children().unwrap();
                }
            } else {
                //.owl-item 
                // $(".box-icons .item").css("width", $(window).width() - ($(window).width() * 0.25))
                if (!$carousel.hasClass("owl-loaded")) {

                    $carousel.owlCarousel({
                        items: 2,

                        loop: true,
                        autoplay: false,
                        dots: true,
                        nav: false,
                        center: true,
                        margin: 0,
                    });
                }
            }
        }

        // Inicializar o destruir carrusel en base al tamaño de pantalla
        checkCarousel();

        // Escuchar cambios de tamaño de ventana
        $(window).resize(checkCarousel);
        /*$(".owl-carousel").owlCarousel({
            loop: false,
            margin: 10,
    
            responsive: {
                // breakpoint from 0 up
                0: {
    
                    autoplay: true,
                    dots: true,
                    nav: true,
                 center: true,
    },
        // breakpoint from 480 up
        501: {
        items: 0, // Desactivar el carrusel
        autoplay: false,
    
        dots: false,
        nav: false
    }
            }
        });*/
        $(window).on("scroll", function () {
            var divOuterHeight = $("header").outerHeight();
            if ($(this).scrollTop() > divOuterHeight) {
                $(".sticky").addClass("show");
            } else {
                $(".sticky").removeClass("show");

            }
            console.log(divOuterHeight)

        });
    });/*
    $(document).ready(function () {
    });*/
});