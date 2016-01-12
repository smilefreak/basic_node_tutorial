var express     = require('express');
var app         = express(); // mongoos for mongodb
var mongoose    = require('mongoose');
var morgan      = require('morgan'); // log requests to the console
var bodyParser  = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =============
//
mongoose.connect('mongodb://node:1234@apollo.modulusmongo.net:27017/rir6Ojyt')

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will /img for users
app.use(morgan('dev')); // log every request in the console.
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json()); // parser application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var Todo = mongoose.model("Todo", {
    text : String
});


app.get('/api/todos', function(req, res){
    
    Todo.find(function(err, todos) {
        if (err)
            res.send(err)
        res.json(todos);
    });
});


// create todo and send back all todos after creation
app.post('/api/todos', function(req, res){
    console.log("line 36: server.js")
    console.log(req.body); 
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo){
        console.log(err)
        if(err)
            res.send(err);

        console.log(todo);
        // get and return all the todos after you create another
        Todo.find(function(err, todos){
            if(err)
                res.send(err)
            res.json(todos);
        });
    });
});


// delete a todo

app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
        Todo.find(function(err, todos){
            if(err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get("*", function(req, res) {
    res.sendfile('./public/index.html'); // // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8080);
console.log("App listening on port 8080");
