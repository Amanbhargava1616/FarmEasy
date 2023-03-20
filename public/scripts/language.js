$( function () {


    $( "#submit" ).click( function () {
        const langCode = $( "#language" ).find( ":selected" ).val()
        if ( langCode == 'en' ) {
            siteLink = "https://whispering-earth-44019.herokuapp.com/home"
        }
        else
            siteLink = `https://whispering--earth--44019-herokuapp-com.translate.goog/community?_x_tr_sl=en&_x_tr_tl=${langCode}&_x_tr_hl=en-US&_x_tr_pto=wapp`
        console.log( siteLink )
        window.open( siteLink, '_blank' );
    } )
} )