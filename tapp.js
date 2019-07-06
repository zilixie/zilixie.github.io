// An example express server implementing a REST API

var express = require('express');
var applicants = require('./routes/routes');
var bodyParser = require('body-parser');


var app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


// Get the index page:
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/applicants', applicants.findAll);
app.get('/courses', applicants.courseApplicant);


app.post('/applicants', applicants.addOne);
app.delete('/applicants', applicants.deleteOne);


app.listen(3000);
console.log('Listening on port 3000');

