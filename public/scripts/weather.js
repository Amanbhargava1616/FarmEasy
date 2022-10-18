$( async function () {


    zip_code = 600002;
    country_code = 'IN'

    // calculating lat and lon
    var locationObj = await fetch( `http://api.openweathermap.org/geo/1.0/zip?zip=${zip_code},${country_code}&appid=37196290d363c198d3ab75b4a729bf11` )
        .then( ( response ) => response.json() )
        .then( ( data ) => { return data } )
    console.log( 'locationObj =>', locationObj );


    // calculating current weather
    var currentWeather = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${locationObj.lat}&lon=${locationObj.lon}&appid=37196290d363c198d3ab75b4a729bf11` )
        .then( ( response ) => response.json() )
        .then( ( data ) => { return data } )

    console.log( 'currentWeather =>', currentWeather );


    // calculating forcasted weather ( working )
    // var forcastWeather = await fetch( `https://api.open-meteo.com/v1/forecast?latitude=${locationObj.lat}&longitude=${locationObj.lon}&hourly=temperature_2m,rain,windspeed_10m,windgusts_10m&daily=rain_sum,windspeed_10m_max&timezone=Asia%2FSingapore&start_date=${2022 - 10 - 16}&end_date=${2022 - 10 - 23}` )
    //     .then( ( response ) => response.json() )
    //     .then( ( data ) => { return data } )

    // console.log( 'forcastWeather =>', forcastWeather );



    // history of data
    // var historyWeather_Step1 = await fetch( `http://history.openweathermap.org/data/3.0/history/locations/create?lat=${locationObj.lat}&lon=${locationObj.lon}&appid=37196290d363c198d3ab75b4a729bf11` )
    //     .then( ( response ) => response.json() )
    //     .then( ( data ) => { return data } )

    // console.log( 'historyWeather_Step1 =>', historyWeather_Step1 );


    // var historyWeather_Step2 = await fetch( `http://history.openweathermap.org/data/3.0/history/locations?appid=37196290d363c198d3ab75b4a729bf11` )
    //     .then( ( response ) => response.json() )
    //     .then( ( data ) => { return data } )

    // console.log( 'historyWeather_Step2 =>', historyWeather_Step2 );


    // var historyWeather_Step3 = await fetch( `http://history.openweathermap.org/data/3.0/history/result?id=${historyWeather_Step1.id}&start=${08 - 08 - 2021}&end=${08 - 08 - 2022}&appid=37196290d363c198d3ab75b4a729bf11` )
    //     .then( ( response ) => response.json() )
    //     .then( ( data ) => { return data } )

    // console.log( 'historyWeather_Step3 =>', historyWeather_Step3 );


    console.log( currentWeather.weather[ 0 ].main )
    $( "#marquee" ).text( `Current Weather Condition is ${currentWeather.weather[ 0 ].main}` );
} )
