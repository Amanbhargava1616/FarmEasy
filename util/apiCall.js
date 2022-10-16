fetch( 'https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=37196290d363c198d3ab75b4a729bf11' )
    .then( ( response ) => response.json() )
    .then( ( data ) => console.log( data ) );