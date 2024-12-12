

$(function () {
    $(window).load(function () {
        const $carousel = $(".box-icons .owl-carousel");

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