var map;
/*
var mapLat = 27.525841;
var mapLng = -82.438913;
var mapDefaultZoom = 16.8;
var popup;

*/
function returnBreakPoint() {
    var width = parseInt($(window).width());
    var breakpoint = 'xs';
    if (width >= 1600) {
        breakpoint = 'xxl';
    } else if (width >= 1200 && width <= 1599) {
        breakpoint = 'xl';
    } else if (width >= 992 && width <= 1199) {
        breakpoint = 'lg';
    } else if (width >= 768 && width <= 991) {
        breakpoint = 'md';
    } else if (width >= 576 && width <= 767) {
        breakpoint = 'sm';
    } else {
        breakpoint = 'xs';
    }

    return breakpoint
}

function ResizeImagen(OldWidth, OldHeight, NewWidth) {
    var aspectRatio = OldWidth / OldHeight;
    Newheight = NewWidth / aspectRatio;
    return {
        width: parseInt(NewWidth),
        height: parseInt(Newheight)
    }
}

function InitMap(breakpoint) {
    var _interaction = {
        _dragPan: false,
        _keyboardPan: false,
        _keyboardZoom: false,
        _mouseWheelZoom: false,
        _pointer: false,
        _select: false,
        _doubleClickZoom: false,
        _dragAndDrop: false,
    }
    var _maxZoom = 5;

    /*zoom = (($(window).width() * 1.58) / 768); //1.58

    zoom = zoom - (zoom * 0.05)
    $('#map').css({
        width: ImgSize.width + 'px',
        height: ImgSize.height + 'px'
    });*/
    var ImgSize;
    switch (breakpoint) {
        case 'xxl':
            zoom = 2.55;

            resizeImagenTo = 1500;
            break;
        case 'xl':
            zoom = 2.22;

            resizeImagenTo = 1180

            break;
        case 'lg':
            zoom = 1.937;

            resizeImagenTo = 975;

            break;
        case 'md':
            zoom = 1.55;

            _interaction._dragPan = true;

            resizeImagenTo = 750;
            break;
        case 'sm':
            zoom = 1.8;
            _maxZoom = 3;
            _interaction._dragPan = true;
            _interaction._doubleClickZoom = true;
            resizeImagenTo = 0;
            $('#map').css({
                width: '100%',
                height: '80vh'
            });
            break;
        default:
            zoom = 1.8;
            _maxZoom = 3;
            resizeImagenTo = 0
            _interaction._dragPan = true;
            _interaction._doubleClickZoom = true;
            $('#map').css({
                width: '100%',
                height: '80vh'
            });
            break;
    }
    ImgSize = ResizeImagen(1685, 1080, resizeImagenTo)

    if (resizeImagenTo > 0) {
        $('#map').css({
            width: ImgSize.width + 'px',
            height: ImgSize.height + 'px'
        });
    }
    // Map views always need a projection.  Here we just want to map image
    // coordinates directly to map coordinates, so we create a projection that uses
    // the image extent in pixels.



    console.log(breakpoint + " " + zoom)
    var extent = [0, 0, 1685, 1080];
    var _limit = [0, 0, (1685 / 2), (1080 / 2)]
        /*var projection = new ol.proj.Projection({
            code: 'xkcd-image',
            units: 'pixels',
            extent: extent
        });*/

    var projection = new ol.proj.Projection({
        code: 'pixels',
        units: 'pixels',
        extent: extent
    });

    var ImagenLayer = new ol.layer.Image({
        source: new ol.source.ImageStatic({
            attributions: '<a href="https://www.theislandsrealty.com" target="_blank">The Islands on the manatee river</a>',
            url: 'assets/images/Islands-siteplan-2019-sold.jpg',
            projection: projection,
            imageExtent: extent,
            imageSize: [1685, 1080],
            /*logo: {
                src: 'https://www.theislandsrealty.com/hubfs/Cottondev-July2015-Images/favicon.png'
            }*/
        })
    });
    var viewLayer = new ol.View({
        projection: projection,
        center: ol.extent.getCenter(extent),
        zoom: zoom,
        maxZoom: _maxZoom,
        /*maxZoom: zoom,
         */
        minZoom: zoom,

        /*extent: _limit*/
    });
    var map = new ol.Map({
        /* layers: [
             Imagen
         ],*/
        target: 'map',
        interactions: ol.interaction.defaults({
            dragPan: _interaction._dragPan,
            doubleClickZoom: _interaction._doubleClickZoom,
            dragAndDrop: _interaction._dragAndDrop,
            keyboardPan: _interaction._keyboardPan,
            keyboardZoom: _interaction._keyboardZoom,
            mouseWheelZoom: _interaction._mouseWheelZoom,
            pointer: _interaction._pointer,
            select: _interaction._select
        }),

        /* controls: []*/
    });


    var styleFunction = function(feature, resolution) {
        var Status = feature.get('status');
        return [new ol.style.Style({

            fill: new ol.style.Fill({
                color: "rgba(255, 255, 255,0)",
                opacity: 1
            }),

        })]

    };
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'assets/data/local.json',
        }),
        style: styleFunction
    });
    map.addLayer(ImagenLayer)


    map.setView(viewLayer);

    map.addLayer(vectorLayer);

    map.on("moveend", function() {
        var zoom = map.getView().getZoom();
        var zoomInfo = 'Zoom level = ' + zoom;
        //console.log(zoomInfo);

        /* ====== */
        /*
        let view = map.getView();
        let extent = view.calculateExtent(map.getSize());
        //hold the current resolution
        let res = view.getResolution();
        console.log(map.getSize());
        //if you use older versions of ol3 use `fitExtent` istead of `fit`
        view.fit(extent, map.getSize());
        //apply the resolution back 
        view.setResolution(res);*/
    });

    var popup = new Popup();
    map.addOverlay(popup);
    map.on('singleclick', function(evt) {
        /* var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
         popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');*/
        if (returnBreakPoint() == 'xs' || returnBreakPoint() == 'sm') {
            eventPopup(evt);
        }
    });

    var overLote = false;
    var numberlot = -1;
    map.on('pointermove', function(evt) {

        if (returnBreakPoint() != 'xs' || returnBreakPoint() != 'sm') {

            eventPopup(evt);
        }
    });

    function eventPopup(evt) {
        if (evt.dragging) {
            return;
        }
        vectorLayer.getSource().getFeatures().forEach(f => {
            f.setStyle(styleFunction);
        });
        var pixel = map.getEventPixel(evt.originalEvent);
        hoverLote = false;
        map.forEachFeatureAtPixel(pixel, function(feature) {
            feature.setStyle(
                new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: ReturnColor(feature.get('status'), true)
                    }),
                }));
            if (feature.get('status') == 'A' || feature.get('status') == 'SHOW' || feature.get('status') == 'M') {
                //var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
                var htmlPopup = '';
                if (!is_null(feature.get('info-popup'))) {

                    var info = feature.get('info-popup');
                    var photo = feature.get('photo');
                    if (!is_null(photo)) {
                        jQuery.each(photo, function(i, val) {
                            htmlPopup += '<img src="' + val + '">';
                        });
                    }
                    if (!is_null(info.homesite)) {
                        htmlPopup += '<strong>Homesite:</strong> #' + info.homesite + '<br>';
                    }
                    if (!is_null(info.acreage)) {
                        htmlPopup += '<strong>Acreage:</strong> ' + info.acreage + '<br>';
                    }
                    if (!is_null(info.view)) {
                        htmlPopup += '<strong>View:</strong> ' + info.view + '<br>';
                    }
                    if (!is_null(info.dock)) {
                        htmlPopup += '<strong>Dock:</strong> ' + info.dock + '<br>';
                    }

                    if (!is_null(info.price)) {
                        htmlPopup += '<strong>Price:</strong> ' + info.price + '<br>';
                    }
                    if (!is_null(info.more_description)) {
                        htmlPopup += (htmlPopup != '' ? '<br>' : '') + info.more_description + '<br>';
                    }
                    if (htmlPopup != '') {
                        // if (numberlot != parseInt(info.homesite)) {

                        popup.show(evt.coordinate, htmlPopup);
                        hoverLote = true;
                        numberlot = parseInt(info.homesite)
                            //}
                    }

                }
            } else {
                if (popup.isOpened) {
                    popup.hide();
                }
                hoverLote = false;
            }
            return feature;
        });
        if (!hoverLote && popup.isOpened && (returnBreakPoint() != 'xs' || returnBreakPoint() != 'sm')) {
            popup.hide();
        }
    }

    function is_null(mixed_var) {
        // Returns true if variable is null    
        //   
        // version: 810.114  
        // discuss at: http://phpjs.org/functions/is_null  
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
        // *     example 1: is_null('23');  
        // *     returns 1: false  
        // *     example 2: is_null(null);  
        // *     returns 2: true  
        return (mixed_var === null);
    }

    function ReturnColor(type, opacity) {
        type = type || 'N';
        opacity = opacity || false;
        OpacityValue = '0.45';
        var RedColor = "rgba(255,255, 255, " + (opacity == true ? '0.35' : "1") + ")";
        var YellowColor = "rgba(188, 184, 31, " + (opacity == true ? '0.73' : "1") + ")";
        var OrangeColor = "rgba(236, 145, " + (opacity == true ? OpacityValue : "1") + ")";
        var GreenColor = "rgba(71, 189, 47, " + (opacity == true ? "0.7" : "1") + ")";
        return type == 'S' ? RedColor : (type == 'A' ? YellowColor : (type == 'M' ? OrangeColor : GreenColor));
    }

}
jQuery(document).ready(function($) {
    jQuery(window).load(function() {

        InitMap(returnBreakPoint());

    });
});