$(function() {
    $(window).on('load', function() {
        $("#send-contact").click(function() {
            var correo = $("#mchp-correo").val();
            var nombre = encodeURI($("#mchp-nombre").val());
            var mensaje = encodeURI($("#mchp-mensaje").val());
            var apikey = '0c2c7ec792b6ce40f842df4691c63a11-us10';
            var listID = '8c5863c8e2';
            $.ajax({
                type: "get",
                url: "https://us10.api.mailchimp.com/2.0/lists/subscribe.json",
                data: "apikey=" + apikey + "&id=" + listID + "&email[email]=" + correo + "&merge_vars[FNAME]=" + nombre + "&merge_vars[MENSAJE]=" + mensaje + "&double_optin=false&send_welcome=false",
                dataType: "json",
                success: function(response) {
                    if (typeof response.status !== 'undefined') {
                        $("#mchp-msg").text("enviado");
                    } else {
                        $("#mchp-msg").text("error");
                    }
                    // https: //us10.api.mailchimp.com/2.0/lists/subscribe.json?apikey=0c2c7ec792b6ce40f842df4691c63a11-us10&id=8c5863c8e2&email[email]=g.rocha.o@outlook.com&merge_vars[FNAME]=Guillermo%20Rocha%20Ortiz&merge_vars[MENSAJE]=Este%20es%20mi%20mensaje%20de%20prueba&double_optin=false&send_welcome=false
                    //CORRECTO RETORNA {"email":"g.rocha.o@outlook.com","euid":"4897f66f86","leid":"188602449"}
                    //INCORRECTO RETIRNA {"status":"error","code":214,"name":"List_AlreadySubscribed","error":"g.rocha.o@outlook.com is already subscribed to the list."}
                }
            });
        });
        // https://us10.api.mailchimp.com/2.0/lists/subscribe.json?apikey=0c2c7ec792b6ce40f842df4691c63a11-us10&id=8c5863c8e2&email[email]=g.rocha.o@outlook.com&merge_vars[FNAME]=Guillermo%20Rocha%20Ortiz&merge_vars[MENSAJE]=Este%20es%20mi%20mensaje%20de%20prueba&double_optin=false&send_welcome=false
    });
});
//