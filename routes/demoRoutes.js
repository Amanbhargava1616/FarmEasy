var admin = require( "firebase-admin" );
const { render } = require( 'ejs' );
const express = require( 'express' );

var langs = require( 'langs' );

const store = require( "store2" );

// importing multer
const multer = require( 'multer' );

const router = express.Router();


// connection to database and firestore cloud
const imports = require( '../data/firebaseConfig' );


// opening Page
router.get( '/', function ( req, res ) {
    res.redirect( '/languages' );
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



// router for languages page
router.get( '/languages', function ( req, res ) {

    console.log( langs.all() )
    res.render( 'languages', { languages: langs.all() } )

} )



// router for login page
router.get( '/login', async function ( req, res ) {

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
        res.render( 'login', { soils: tempDocSoils } );
    } )

} )


// router post method for login page
router.post( '/login', function ( req, res ) {
    const soilType = req.body;
    console.log( soilType.soil )

    var docRef = imports.db.collection( "Soil" ).doc( soilType.soil )
    docRef.get().then( ( doc ) => {

        req.session.cropsList = doc.data().crops

        req.session.isAuthenticated = true;                                          // flag for autentication

        req.session.save( function () {

            res.redirect( '/dashboard' )
        } )

    } );
} )


// function for reading the crops from soil
async function croplisting( element ) {
    let crop = {}
    var docRef = await imports.db.collection( "crops" ).doc( element )
    crop = await docRef.get().then( async ( doc ) => {

        // checking if crop is there if yes storing the data into a array
        if ( doc.exists ) {
            cr = { cropName: doc.id, cropData: doc.data() };
            return cr
        }
    } )
    return crop;
}



// router to dashboard 
router.get( '/dashboard', async function ( req, res ) {

    if ( !req.session.isAuthenticated ) {
        return res.status( 401 ).render( '401' )

    }


    await req.session.cropsList.forEach( async element => {

        key = JSON.stringify( await croplisting( element ) );
        if ( key !== undefined ) {
            key = JSON.parse( key )
            console.log( "key =>", key )
            store( element, key );
        }

    } );

    // console.log( store.getAll() )

    arr = store.getAll()



    res.render( 'dashboard', cropList = arr )
} )






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



// router to help page
router.get( "/help", function ( req, res ) {
    res.render( 'help' );
} )



// router to weather page
// router.get( "/weather", function ( req, res ) {
//     res.render( 'weather' );
// } )



module.exports = router;
