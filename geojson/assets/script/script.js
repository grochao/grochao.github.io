var map;
var mapLat = 27.525841;
var mapLng = -82.438913;
var mapDefaultZoom = 16.8;
var popup;

function initialize_map() {
    //console.info(mapLat + '..' + mapLng);
    map = new ol.Map({
        target: "map",
        layers: [
            new ol.layer.Tile({
                /*source: new ol.source.OSM({
                     url: "https://maps-cdn.salesboard.biz/styles/klokantech-3d-gl-style/{z}/{x}/{y}.png"
                     
                 });*/
                source: new ol.source.XYZ({
                    attributions: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
                    attributionsCollapsible: false,
                    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    maxZoom: 23
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
        })
    });


    popup = new ol.Overlay.Popup({ autoPan: true, autoPanAnimation: { duration: 2000 } });
    map.addOverlay(popup);

    /* map.on('click', function(evt) {
         var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
         popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
     });*/

    var long_string = 'a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text a long text ';
    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature) {
            //popup.setPosition(evt.coordinate);

            var content = feature.get('descriptions');

            popup.show(evt.coordinate, content);

        } else {
            popup.hide();

        }
    });
}
var vectorLayer

function add_map_point(lat, lng, pointer, textPopup) {
    var _scale = '0.45';
    if (pointer == 'logo') {
        pointer = 'https://cdn2.hubspot.net/hubfs/465801/Images/website/logo-mapa.png';
        _scale = '1';
    } else {
        _scale = '0.45';
    }
    vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
                descriptions: textPopup,
            })]
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                scale: _scale,
                src: pointer
            })
        })
    });
    map.addLayer(vectorLayer);
}

function ReturnMarkerColor(type) {

    var img;
    switch (type) {
        case 'dining':
            img = 'spin_01.png';
            break;
        case 'shoping':
            img = 'spin_02.png';
            break;
        case 'entertainment':
            img = 'spin_03.png';
            break;
        case 'services':
            img = 'spin_04.png';
            break;
        case 'park_recreation':
            img = 'spin_05.png';
            break;
        case 'education':
            img = 'spin_06.png';
            break;
        case 'cities':
            img = 'spin_07.png';
            break;
        default:
            img = 'spin_03.png';
            break;
    }
    return 'https://cdn2.hubspot.net/hubfs/465801/Images/website/' + img;
}

function LoadMarker(obj) {

    initialize_map();
    map.removeLayer(vectorLayer);

    //add_map_point(27.525527, -82.433951, 'logo', '');

}

jQuery(document).ready(function($) {
    jQuery(window).load(function() {



        /* function adjust_iframe() {

             if ($(window).width() >= 768) {
                 if (!jQuery("#ScrollLocation").hasClass('scrollator')) {
                     $('#ScrollLocation').scrollator();
                 }
                 $('#ScrollLocation').scrollator('hide');
                 jQuery('#setion-map iframe, #map-container, #map_theislands, #ScrollLocation').height(jQuery('#setion-map').height());
             } else {
                 if (jQuery("#ScrollLocation").hasClass('scrollator')) {
                     $('#ScrollLocation').scrollator('destroy');
                 }
                 jQuery('#setion-map iframe, #map-container, #map_theislands, #ScrollLocation').attr("style", "");
             }

         }
         adjust_iframe();
         $(window).resize(function() {
             adjust_iframe();
         });*/


        //add_map_point(27.525527, -82.433951);

        LoadMarker('#map');

        /*jQuery('.box-local').click(function() {
            var coordinates = (jQuery(this).data('geolocation')).split(',');
            var color = ((jQuery(this).data('color')).toLowerCase()).replace(' & ', '_');
            jQuery('#map_theislands').html('');
            initialize_map();
            map.removeLayer(vectorLayer);
            add_map_point(27.525527, -82.433951, 'logo', '');
            add_map_point(coordinates[0], coordinates[1], ReturnMarkerColor(color), $(this).html());



        });
        jQuery('#list-hot-spots li').click(function() {

            var id_local = 0;
            if (jQuery("#map-container").length) {
                id_local = (jQuery(this).attr("id")).replace('localion-', '');
                jQuery("#map-container ul, #map-container span.title").hide()
                jQuery("#map-container .local_" + id_local).show()
                jQuery('#list-hot-spots li').removeClass('current-pointer');
                jQuery(this).addClass('current-pointer');
                jQuery('#list-hot-spots').removeClass('show-options');
                jQuery('#sidebar').removeClass('show');

            }


            LoadMarker("#map-container .local_" + id_local + ' .box-local');


        });
        jQuery('#tab_location').on('click', function() {
            jQuery("#tab_location .arrow").toggleClass('active');

            jQuery("#sidebar").toggleClass('show');
            if (jQuery("#sidebar").hasClass('show') && jQuery("#ScrollLocation").hasClass('scrollator')) {

                $('#ScrollLocation').scrollator('show');
            } else {
                $('#ScrollLocation').scrollator('hide');
            }
        });

        jQuery('#list-hot-spots .span-h3').click(function() {

            if (!jQuery(this).parent().hasClass('show-options')) {
                jQuery(this).parent().addClass('show-options');

            } else {
                jQuery(this).parent().removeClass('show-options');
            }

        });*/


    });
});