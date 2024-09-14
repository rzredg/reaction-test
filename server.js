const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./reaction-test-e5443-firebase-adminsdk-irzf5-09eeccd5c3.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to save a score
app.post('/saveScore', async (req, res) => {
    const { name, score } = req.body;
    try {
        await db.collection('reactionTime').add({ name, score });
        res.status(200).send('Score saved successfully');
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).send('Error saving score');
    }
});

// Route to fetch leaderboard
app.get('/leaderboard', async (req, res) => {
    try {
        const snapshot = await db.collection('reactionTime').orderBy('score').limit(10).get();
        const leaderboard = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Error fetching leaderboard');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});