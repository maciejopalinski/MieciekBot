const passport = require('passport');
const DiscordStrategy = require('passport-discord');
const User = require('../database/schemas/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ id });
        return user ? done(null, user) : done(null, null);
    } catch (err) {
        console.error(err);
        done(err, null);
    }
})

passport.use(
    new DiscordStrategy({
        clientID: process.env.DASHBOARD_API_CLIENT_ID,
        clientSecret: process.env.DASHBOARD_API_CLIENT_SECRET,
        callbackURL: '/api/auth/redirect',
        scope: ['identify', 'guilds']
    }, async (accessToken, refreshToken, profile, done) => {
        
        const userTag = `${profile.username}#${profile.discriminator}`;

        try {
            const findUser = await User.findOneAndUpdate({ id: profile.id }, {
                tag: userTag,
                avatar: profile.avatar,
                guilds: profile.guilds
            });
    
            if(findUser) return done(null, findUser);
            else
            {
                const newUser = await User.create({
                    id: profile.id,
                    tag: userTag,
                    avatar: profile.avatar,
                    guilds: profile.guilds
                });
                return done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            return done(err, null);
        }
    })
);