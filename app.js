const path = require( 'path' );

const express = require( 'express' );

// connecting to routing files
const demoRoutes = require( './routes/demoRoutes' );

// connecting to database
// const db = require( './data/firebaseConfig' );

const app = express();


app.set( 'view engine', 'ejs' );       // Activate ejs engine
app.set( 'views', path.join( __dirname, 'views' ) );


app.use( express.urlencoded( { extended: true } ) );      // Parse incoming request bodies
app.use( express.static( 'public' ) );   // Serve static files (e.g. CSS , JS)

app.use( demoRoutes );

app.use( function ( error, req, res, next ) {

    // Default error handling 
    // Will become active whenever any route / middleware crashes
    console.log( error );
    res.status( 500 ).render( '500' );
} );


app.listen( 3000 );