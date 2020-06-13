import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const hoffBot = functions.https.onRequest((req, res) => {
    const { challenge } = req.body;

    res.send({ challenge });
});
