// const { render } = require( 'ejs' );
const { json } = require( 'express' );
const express = require( 'express' );
const { Store } = require( 'express-session' );
const url = require( 'url' );
const readXlsxFile = require( 'read-excel-file/node' )

var langs = require( 'langs' );

const store = require( "store" );


// const cookieParser = require( 'cookie-parser' )


const router = express.Router();


// connection to database and firestore cloud
const imports = require( '../data/firebaseConfig' );


const save_crops = [];


// opening Page
router.get( '/', function ( req, res ) {
    res.redirect( '/languages' );
} )



// router for languages page
router.get( '/languages', function ( req, res ) {

    console.log( langs.all() )
    res.render( 'languages', { languages: langs.all() } )

} )

router.get( '/home', function ( req, res ) {
    res.render( 'home' );
} )


// router to show all the questions and answers
router.get( '/community', async function ( req, res ) {

    langs.all();

    // reading the data of a questions
    const snapshot = await imports.db.collection( 'usersQuestions' )

    snapshot.get().then( ( querySnapshot ) => {
        const tempDoc = []
        querySnapshot.forEach( ( doc ) => {
            console.log( doc.id, " => ", doc.data() );

            // pushing data in n array
            tempDoc.push( { id: doc.id, Data: doc.data() } )
        } )
        console.log( "tempDoc =>", tempDoc )
        res.render( 'community', { tempDoc: tempDoc } );
    } )

} )



// router to search a keyword
router.get( "/community/:keyword", async function ( req, res ) {
    var keyword = req.params.keyword;
    keyword = keyword.replace( /[^a-zA-Z ]/g, "" );

    console.log( "keyword =>", keyword );

    // reading the data of a questions
    const snapshot = await imports.db.collection( 'usersQuestions' )

    snapshot.get().then( ( querySnapshot ) => {
        tempKeywordDoc = []
        querySnapshot.forEach( ( doc ) => {

            if ( doc.id.includes( keyword ) ) {

                // pushing data in n array
                tempKeywordDoc.push( { id: doc.id, Data: doc.data() } )
            }
        } )
        console.log( "tempKeywordDoc =>", tempKeywordDoc )
    } )
    res.redirect( '/selectedquestions' )
} )

// router.get( '/selectedquestions', function ( req, res ) {

//     console.log( "selectedquestions tempKeywordDoc =>", tempKeywordDoc )
//     res.render( 'selectedquestions', { tempDoc: tempKeywordDoc } );
//     // res.render( '401' )
// } )



// router to add a question
router.post( '/community', function ( req, res ) {
    const userQuestion = req.body;
    userQuestion.keyword = userQuestion.keyword.replace( /[^a-zA-Z ]/g, "" );
    console.log( userQuestion.keyword )


    // database updated 
    imports.db.collection( "usersQuestions" ).doc( userQuestion.keyword ).set( {} )
        .then( () => {
            console.log( "Document successfully Updated!" );

            res.redirect( '/community' )
        } )
        .catch( ( error ) => {
            console.error( "Error Updating document: ", error );
        } );
} )


// router to add a reply
router.post( '/community/:question', function ( req, res ) {
    const reply = req.body;
    const question = req.params.question;

    console.log( "Question => ", question )

    if ( reply.keyword.trim() == "" ) {
        res.status( 503 ).render( '503' );
    }
    else {

        var docRef = imports.db.collection( "usersQuestions" ).doc( question )
        docRef.get().then( ( doc ) => {

            console.log( "doc.data() => ", doc.data() )

            newdata = doc.data();

            objectLength = Object.keys( newdata ).length
            objectLength += 1;
            ans = "ans" + objectLength;

            newdata[ ans ] = reply.keyword;

            console.log( newdata );



            // database updated 
            imports.db.collection( "usersQuestions" ).doc( question ).set( newdata )
                .then( () => {
                    console.log( "Document successfully Updated!" );

                    res.redirect( '/community' )
                } )
                .catch( ( error ) => {
                    console.error( "Error Updating document: ", error );
                } );

        } ).catch( ( error ) => {
            console.log( "Error getting document:", error );
        } );
    }

} )




// router for login/soil page
router.get( '/login/soil', async function ( req, res ) {

    // reading the data of a questions
    const snapshot2 = await imports.db.collection( 'Soil' )

    snapshot2.get().then( ( querySnapshot ) => {
        const tempDocSoils = []
        querySnapshot.forEach( ( doc ) => {
            console.log( doc.id, " => ", doc.data() );

            // pushing data in n array
            tempDocSoils.push( { id: doc.id, Data: doc.data() } )
        } )
        console.log( "tempDocSoils =>", tempDocSoils )
        res.render( 'login-soil', { soils: tempDocSoils } );
    } )

} )


// router post method for login/soil page
router.post( '/login/soil', function ( req, res ) {
    const soilType = req.body;
    console.log( soilType.soil )

    var docRef = imports.db.collection( "Soil" ).doc( soilType.soil )
    docRef.get().then( ( doc ) => {

        req.session.isAuthenticated = true;                                          // flag for autentication

        req.session.save( function () {

            console.log( "/dashboard/" + doc.data().crops.toString() );
            res.redirect( "/dashboard/" + doc.data().crops.toString() )
        } )

    } );
} )

// router for login/land page
router.get( '/login/land', async function ( req, res ) {

    // reading the data of a questions
    const snapshot2 = await imports.db.collection( 'land' )

    snapshot2.get().then( ( querySnapshot ) => {
        const tempDoclands = []
        querySnapshot.forEach( ( doc ) => {
            console.log( doc.id, " => ", doc.data() );

            // pushing data in n array
            tempDoclands.push( { id: doc.id, Data: doc.data() } )
        } )
        console.log( "tempDoclands =>", tempDoclands )
        res.render( 'login-land', { lands: tempDoclands } );
    } )

} )


// router post method for login/land page
router.post( '/login/land', function ( req, res ) {
    const landType = req.body;
    console.log( landType.land )

    var docRef = imports.db.collection( "land" ).doc( landType.land )
    docRef.get().then( ( doc ) => {


        req.session.isAuthenticated = true;                                          // flag for autentication

        req.session.save( function () {

            console.log( "/dashboard/" + doc.data().crops.toString() );
            res.redirect( "/dashboard/" + doc.data().crops.toString() )
        } )

    } );
} )


// router for login/StatesSeasons page
router.get( '/login/StateSeason', async function ( req, res ) {

    rows = await readXlsxFile( './data/stateCropSeason.xlsx' )
    const seasons = [ ...new Set( rows.map( ( cropSeasonList ) => {
        return cropSeasonList[ 2 ];
    } ) ) ];
    const states = [ ...new Set( rows.map( ( cropSeasonList ) => {
        return cropSeasonList[ 0 ];
    } ) ) ];
    seasons.shift()
    states.shift()
    console.log( states );
    console.log( seasons );

    res.render( 'login-states-seasons', { seasons: seasons, states: states } );

} )


// router for post login/StatesSeasons page
router.post( "/login/StateSeason", async function ( req, res ) {
    const seasonOfCrop = req.body.season;
    const stateOfFarmer = req.body.state;


    rows = await readXlsxFile( './data/stateCropSeason.xlsx' )
    listofcrops = rows.filter( ( row ) => {
        if ( row[ 0 ] == stateOfFarmer && row[ 2 ] == seasonOfCrop ) {
            return row;
        }
    } )

    listofcrops = [ ...new Set( listofcrops.map( ( cropSeasonList ) => {
        return cropSeasonList[ 1 ].toLowerCase();
    } ) ) ];

    req.session.isAuthenticated = true;                                          // flag for autentication

    req.session.save( function () {

        console.log( "/dashboard/" + listofcrops.toString() );
        res.redirect( "/dashboard/" + listofcrops.toString() )
    } )
    // console.log( listofcrops );
} )




// router to dashboard 
router.get( '/dashboard/:cropobj', async function ( req, res ) {
    const cropobj = req.params.cropobj;

    const receivedCrops = cropobj.split( "," );

    console.log( receivedCrops );


    if ( !req.session.isAuthenticated ) {
        return res.status( 401 ).render( '401' )

    }

    var arrOBJ = await Promise.all( receivedCrops.map( async ( element ) => {

        var docRef = await imports.db.collection( "crops" ).doc( element );
        crop = await docRef.get().then( async ( doc ) => {

            // checking if crop is there if yes storing the data into a array
            if ( doc.exists ) {

                return { cropName: doc.id, cropData: doc.data() };
            }
        } )

        return ( crop );

    }
    ) );
    arrOBJ = arrOBJ.filter( function ( element ) {
        return element !== undefined;
    } );


    res.render( 'dashboard', cropList = arrOBJ );
} )



// router to help page
router.get( "/help", function ( req, res ) {
    res.render( 'help' );
} )






module.exports = router;
