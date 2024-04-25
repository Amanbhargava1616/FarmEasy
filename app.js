const path = require( 'path' );

const express = require( 'express' );

const cookieParser = require( 'cookie-parser' )


// connecting to routing files
const demoRoutes = require( './routes/demoRoutes' );

// connection to database and firestore cloud
const imports = require( './data/firebaseConfig' );

// deploying
let port = 3000;
if ( process.env.PORT ) {
    port = process.env.PORT
}


const app = express();


// for session integration
const session = require( 'express-session' );


const { FirestoreStore } = require( '@google-cloud/connect-firestore' );                     // third party package for storing session in firestore



const sessionStore = new FirestoreStore( {                           // constructor to configure the session
    dataset: imports.db
} );


app.use( session( {                                                 // to use session
    secret: "super-secret",
    resave: false,                                                  // to not resave new sessions from same user
    saveUninitialized: false,
    store: sessionStore                                             // where to store session data

} ) );

app.use( cookieParser() )


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


app.listen( port, () => {
    console.log( "Server Listing To Port 3000 - http://localhost:3000/home" )
} );