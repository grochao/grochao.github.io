

$(function () {
    $(window).load(function () {

        $(".owl-carousel").owlCarousel({
            loop: false,
            margin: 10,
            dots: true,
            items: 1,
            nav: true,
            center: true,
        });
        $(window).on("scroll", function () {
            var divOuterHeight = $("header").outerHeight();
            if ($(this).scrollTop() > divOuterHeight) {
                $(".sticky").addClass("show");
            } else {
                $(".sticky").removeClass("show");

            }
        });
    });/*
    $(document).ready(function () {
    });*/
});