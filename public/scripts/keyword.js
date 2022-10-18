$( function () {

    $( "#keyword" ).change( async function () {
        const keyword = $( "#keyword" ).val()

        await fetch( `/community/:${keyword}` );

    } )
} )