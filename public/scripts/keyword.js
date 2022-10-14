$( function () {

    $( "#keyword" ).change( async function () {
        const keyword = $( "#keyword" ).val()

        const response = await fetch( `/community/:${keyword}` );
        const responseData = response.json();

    } )
} )