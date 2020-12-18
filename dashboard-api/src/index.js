const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const Store = require('connect-mongo')(session);
const cors = require('cors');

require('./strategies/discord');

const app = express();
const routes = require('./routes');
const ErrorPages = require('./templates/ErrorPages');

const DATABASE = process.env.DASHBOARD_API_DATABASE || process.env.DATABASE;
mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(cors({
    origin: [process.env.DASHBOARD_CLIENT_URL],
    credentials: true
}))

app.use(session({
    secret: process.env.DASHBOARD_API_COOKIE_SECRET,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    store: new Store({ mongooseConnection: mongoose.connection, collection: 'dashboard_sessions' })
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.redirect('/api'));
app.use('/api', routes);

app.get('*', (req, res) => ErrorPages.not_found(res));

const PORT = process.env.DASHBOARD_API_PORT || 8080;
app.listen(PORT, () => console.log(`MieciekBot Dashboard API running on port ${PORT}`));