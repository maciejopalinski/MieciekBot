const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const Store = require('connect-mongo')(session);

require('./strategies/discord');

const app = express();
const routes = require('./routes');

const DATABASE = process.env.DASHBOARD_API_DATABASE || process.env.DATABASE;
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

const PORT = process.env.DASHBOARD_API_PORT || 8080;
app.listen(PORT, () => console.log(`MieciekBot Dashboard API running on port ${PORT}`));