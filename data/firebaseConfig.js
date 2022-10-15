var admin = require( "firebase-admin" );

var serviceAccount = require( "./serviceAccountKeys.json" );

admin.initializeApp( {
    credential: admin.credential.cert( serviceAccount )
} );

const db = admin.firestore();
const storage = admin.storage();


module.exports = {
    db: db,
    storage: storage
};