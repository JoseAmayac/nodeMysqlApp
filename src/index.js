//Imports 
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const connect_flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const {database} = require('./keys');
const passport = require('passport');
//Initializations
const app = express();
require('./libs/passport');

//Settings
app.set('port',process.env.PORT || 4000); //Setting the port 
app.set('views',path.join(__dirname,'views'));//Setting the views folder in the project
app.engine('.hbs',exphbs({ //Setting the engine for the frontend part
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./libs/handlebars')
}));
app.set('view engine','.hbs'); //Setting the view engine

//Middlewares
app.use(session({
    secret: 'jlmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(connect_flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//To receive information that is send from the forms, without photos, videos, etc..
app.use(express.json()); // To receive json files
app.use(passport.initialize());
app.use(passport.session());


//Gloval variables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});


//Routes
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Static files 
app.use(express.static(path.join(__dirname,'public')));//Setting the public folder route

//Server
app.listen(app.get('port'),()=>{
    console.log('Listening in the port ',app.get('port'));
});