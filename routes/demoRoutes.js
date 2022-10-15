const { render } = require( 'ejs' );
const express = require( 'express' );


var langs = require( 'langs' );


const router = express.Router();


// Connecting to database
const db = require( "../data/firebaseConfig" );

router.get( '/', function ( req, res ) {
    res.redirect( 'community' );
} )

// router to show all the questions and answers
router.get( '/community', async function ( req, res ) {

    langs.all();

    // reading the data of a questions
    const snapshot = await db.collection( 'usersQuestions' )

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


router.get( "/community/:keyword", async function ( req, res ) {
    var keyword = req.params.keyword;
    keyword = keyword.replace( /[^a-zA-Z ]/g, "" );

    console.log( "keyword =>", keyword );

    // reading the data of a questions
    const snapshot = await db.collection( 'usersQuestions' )

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
    const snapshot2 = await db.collection( 'Soil' )

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


// router post method
router.post( '/login', function ( req, res ) {
    const soilType = req.body;
    console.log( soilType.soil )

    var docRef = db.collection( "Soil" ).doc( soilType.soil )
    docRef.get().then( ( doc ) => {

        req.session.cropsList = doc.data().crops

        req.session.isAuthenticated = true;                                          // flag for autentication

        req.session.save( function () {

            res.redirect( '/dashboard' )
        } )

    } );
} )

async function croplisting( element ) {
    var docRef = await db.collection( "crops" ).doc( element )
    docRef.get().then( ( doc ) => {
        
        // checking if crop is there if yes storing the data into a array
        if ( doc.exists ) {
            
            var crop = { cropName: doc.id, cropData: doc.data() };
            return Promise.resolve(crop);
        }
    } );
}


router.get( '/dashboard', function ( req, res ) {

    if ( !req.session.isAuthenticated ) {
        return res.status( 401 ).render( '401' )

    }

    req.session.cropsList.forEach( async element => {

        var response =await croplisting( element );

        console.log( response );

        // const responseData = await response.json();

        // console.log( "=", responseData );
        // crop.then( ( response ) => response.json() ).then( ( data ) => console.log( data ) );


    } );

    // res.render( 'dashboard', { cropList: req.session.cropsPresented } )
} )






// router to add a question
router.post( '/community', function ( req, res ) {
    const userQuestion = req.body;
    userQuestion.keyword = userQuestion.keyword.replace( /[^a-zA-Z ]/g, "" );
    console.log( userQuestion.keyword )


    // database updated 
    db.collection( "usersQuestions" ).doc( userQuestion.keyword ).set( {} )
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

        var docRef = db.collection( "usersQuestions" ).doc( question )
        docRef.get().then( ( doc ) => {

            console.log( "doc.data() => ", doc.data() )

            newdata = doc.data();

            objectLength = Object.keys( newdata ).length
            objectLength += 1;
            ans = "ans" + objectLength;

            newdata[ ans ] = reply.keyword;

            console.log( newdata );



            // database updated 
            db.collection( "usersQuestions" ).doc( question ).set( newdata )
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

router.get( "/help", function ( req, res ) {
    res.render( 'help' );
} )




module.exports = router;
