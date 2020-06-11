var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/project_data");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "This is secret",
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Routes */

app.get('/', (req, res) => {
    res.render("home");
});

/* Register Route */
app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', (req, res) => {
    req.body.username
    req.body.password
    var msg = "Username is already taken"
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/both");
        });
    });
});

/* Login Routes */
app.get('/login', (req, res) => {
    res.render("login", { message: req.flash("error") });
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/both",
    failureRedirect: "/login"
}), (req, res) => {

});

/* Secret page */
app.get('/both', isLoggedIn, (req, res) => {
    res.render("both");

});

app.get('/girls', (req, res) => {
    res.render("girls");
});

app.get('/girls/about', (req, res) => {
    res.render("about1");
});

app.get('/girls/image', (req, res) => {
    res.render("image1");
});

app.get('/girls/hostel/contact', (req, res) => {
    res.render("contact");
});

// Boys Hostel

app.get('/boys', (req, res) => {
    res.render("boys");
});

app.get('/boys/about', (req, res) => {
    res.render("about2");
});

app.get('/boys/hostel/contact', (req, res) => {
    res.render("contact");
});

app.get('/boys/image', (req, res) => {
    res.render("image2");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});