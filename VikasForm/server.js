require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const employeeController = require('./controllers/employeeController');

var app = express();

// body-parser setup
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());


// views setup
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

app.listen(4000, () => {
    console.log('Express server started at port : 4000');
});

app.use('/employee', employeeController);