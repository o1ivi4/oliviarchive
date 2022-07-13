// start app with either 'npm run dev' or 'node server.js'
// go to http://localhost:3000/ 

const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const mongo = require('mongodb');
const connectionString = 'mongodb+srv://oliviagiandrea:Zjnxx373@recipecluster.jdtjm.mongodb.net/?retryWrites=true&w=majority'

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

mongo.MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('oliviarchive');
    const recipes = db.collection('recipes');

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
        const query = new RegExp(req.query.recipe, "i");
        var cats_string = req.query.cats; 
        cats_string = cats_string.replace(/\[|\]|\"/g, "");
        var cats = cats_string.split(',');
        if (cats_string.length >= 1) {
            // sort returned docs in asc order a-z
            const filter = {sort: {title: 1}};
            recipes.find({title: { $regex: query }, category: { $in: cats }}, filter).toArray()
            .then(results => {
                console.log(results);
                res.json(results);
            })
            .catch(error => console.error(error));
        } else {
            // sort returned docs in asc order a-z
            const filter = {sort: {title: 1}};    
            recipes.find({title: { $regex: query }}, filter).toArray()
                .then(results => {
                    console.log(results);
                    res.json(results);
                })
                .catch(error => console.error(error));
        }
    });

    app.get('/id/:id', (req, res) => {
        // parsing the url
        var id = parseInt(req.params.id);
        console.log("lookup by rid", id);
        recipes.find({"rid": id}).toArray(function(err, result) {
            if (err) throw err;
            res.render('recipe.ejs', { recipe: result[0]});
        });
    });

    app.get('/edit/:id', (req, res) => {
        // parsing the url
        var id = parseInt(req.params.id);
        console.log("editing recipe", id);
        recipes.find({"rid": id}).toArray(function(err, result) {
            if (err) throw err;
            res.render('edit.ejs', { recipe: result[0]});
        });
    });

    app.get('/new', (req, res) => {
        res.render('new.ejs');
    });
    
    app.post('/recipes', (req, res) => {
        // get data from form
        var recipe_data = req.body;
        var ings = recipe_data['ingredients'];
        // reformat ingredient list for easier display on recipe pages
        var format_ings = [];
        for (var i = 0; i < ings.length; i+=3) {
            var ing = [ings[i], ings[i+1], ings[i+2]];
            format_ings.push(ing);
        }
        // replace ing list with formatted version
        recipe_data['ingredients'] = format_ings;
        // insert recipe into mongodb
        recipes.insertOne(recipe_data)
            .then(result => {
                sleep(1000).then(s => {
                    // grab auto-incremented objectID from insertOne
                    recipes.find({"_id":result.insertedId}).toArray()
                    .then(found => {
                        // redirect to unique recipe details page with id in url
                        res.redirect('/id/' + found[0].rid);
                    })
                    .catch(error => console.error(error));
                })
            })
            .catch(error => console.error(error));       
    });

    app.post('/edit', (req, res) => {
        var recipe = req.body;
        recipes.findOneAndUpdate(
            { rid: recipe.rid },
            {
              $set: {
                title: recipe.title,
                servings: recipe.servings,
                notes: recipe.notes,
                ingredients: req.body.ingredients,
                directions: req.body.directions,
                category: req.body.category
              }
            },
            {
              upsert: true
            }
        )
        .then(result => {
            res.json('Success');
        })
        .catch(error => console.error(error))
    });

    app.delete('/recipes', (req, res) => {
        recipes.deleteOne(
            { rid: req.body.rid }
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('Error deleting recipe: Recipe not found.');
            }
            res.json(`Successfully Deleted Recipe`);
          })
          .catch(error => console.error(error));
    });

    app.listen(3000, function() {
        console.log('listening on 3000');
    });
})
.catch(error => console.error(error));