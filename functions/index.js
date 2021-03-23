const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require("./peytons-projects-firebase-adminsdk-thisq-8a80f28b50.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://peytons-projects.firebaseio.com",
  storageBucket: "peytons-projects.appspot.com"
});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true }));

app.get('/recipes', async (req, res) => {
    try {
        let recipes = await admin.firestore().collection('recipes').get();
        let formattedRecipes = recipes.docs.map(doc => doc.data());
        return res.status(200).send(formattedRecipes);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post('/recipe', async (req, res) => {
    try {
        let recipe = req.body;
        await admin.firestore().collection('recipes').add(recipe)
        .then((addedRecipe) => {
            admin.firestore().collection('recipes').doc(addedRecipe.id)
            .update({
                id: addedRecipe.id
            })
        });
        return res.status(200).send('Recipe Added')
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get('/ingredients', async (req, res) => {

    try {
        let ingredients = await admin.firestore().collection('ingredients').get();
        let formattedIngredients = ingredients.docs.map(doc => doc.data());
        return res.status(200).send(formattedIngredients);
    } catch (error) {
        return res.status(500).send(error);
    }
});

exports.api = functions.https.onRequest(app);