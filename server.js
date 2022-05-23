// start app with either 'npm run dev' or 'node server.js'
// go to http://localhost:3000/ 

const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const mongo = require('mongodb');
const connectionString = 'mongodb+srv://oliviagiandrea:Zjnxx373@recipecluster.jdtjm.mongodb.net/?retryWrites=true&w=majority'

mongo.MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('oliviarchive');
    const recipes = db.collection('recipes');

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    app.get('/', (req, res) => {
        db.collection('recipes').find().toArray()
        .then(results => {
            res.render('index.ejs', {recipes: results});
        })
        .catch(error => console.error(error));
    });

    // app.get('/recipes', (req, res) => {
    //     db.collection('recipes').find().toArray()
    //     .then(results => {
    //         res.render('recipes.ejs', {recipes: results});
    //     })
    //     .catch(error => console.error(error));
    // });

    app.get('/search', (req, res) => {
        // parse request url, pull out required info, create dynamic expression
        console.log(req.query)
        const query = new RegExp(req.query.recipe, "i");
        // sort returned docs in asc order a-z
        const filter = {sort: {title: 1}};

        recipes.find({title: { $regex: query}}, filter).toArray()
            .then(results => {
                res.json(results);
            })
            .catch(error => console.error(error));
    });

    app.get('/id/:id', (req, res) => {
        // parsing the url
        // var id = new mongo.ObjectId(req.params.id);
        var id = parseInt(req.params.id);
        console.log("lookup by rid", id);
        recipes.find({"rid": id}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.render('recipe.ejs', { recipe: result[0]});
        });
    });

    app.get('/edit/:id', (req, res) => {
        // parsing the url
        var id = parseInt(req.params.id);
        console.log("editing recipe", id);
        recipes.find({"rid": id}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.render('edit.ejs', { recipe: result[0]});
        });
    });

    app.get('/new', (req, res) => {
        res.render('new.ejs', {recipes: ""})
        .catch(error => console.error(error));
    });
    
    app.post('/recipes', (req, res) => {
        recipes.insertOne(req.body)
            .then(result => {
                res.redirect('/');
            })
            .catch(error => console.error(error));
    });

    app.put('/recipes', (req, res) => {
        recipes.findOneAndUpdate(
            { title: 'bread' },
            {
              $set: {
                title: req.body.title,
                ingredient: req.body.ingredient
              }
            },
            {
              upsert: true
            }
          )
            .then(result => {
                res.json('Success');
            })
            .catch(error => console.error(error));
    });
    
    app.delete('/recipes', (req, res) => {
        recipes.deleteOne(
            { title: req.body.title }
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No muffin to delete');
            }
            res.json(`Deleted muffin`);
          })
          .catch(error => console.error(error));
    });

    app.listen(3000, function() {
        console.log('listening on 3000');
    });
})
.catch(error => console.error(error));