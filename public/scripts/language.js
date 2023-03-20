$( function () {


    $( "#submit" ).click( function () {
        const langCode = $( "#language" ).find( ":selected" ).val()
        if ( langCode == 'en' ) {
            siteLink = "https://farmeasy-wk25.onrender.com/home"
        }
        else
            siteLink = `https://farmeasy--wk25-onrender-com.translate.goog/home?_x_tr_sl=en&_x_tr_tl=${langCode}&_x_tr_hl=en-US&_x_tr_pto=wapp`
        console.log( siteLink )
        window.open( siteLink, '_blank' );
    } )
} )