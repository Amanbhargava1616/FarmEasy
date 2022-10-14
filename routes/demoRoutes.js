const { render } = require( 'ejs' );
const express = require( 'express' );


var langs = require( 'langs' );


const router = express.Router();


// Connecting to database
const db = require( "../data/firebaseConfig" );

const windowchange = require( "../util/chnageWindow" )


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

} )




module.exports = router;
