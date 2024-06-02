const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { initializeElasticSearchSchema } = require('./utils/elasticsearch');

const app = express();
const port = 3000;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use('/api', routes);

//Home Page
app.get("/", (req, res) => {
    res.render('home', {});
});

//Email Listing Page
app.get("/data", (req, res) => {
    res.render('data', {});
});

initializeElasticSearchSchema().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Failed to initialize Elasticsearch Schema:', error);
    process.exit(1);
});
