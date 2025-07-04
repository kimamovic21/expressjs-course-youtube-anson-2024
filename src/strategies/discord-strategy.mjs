import { Strategy } from 'passport-discord';
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs';
import passport from 'passport';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id);
    return findUser ? done(null, findUser) : done(null, null);
  } catch (error) {
    done(err, null);
  };
});

export default passport.use(
  new Strategy(
    {
      clientID: process.env.PASSPORT_DISCORD_CLIENT_ID,
      clientSecret: process.env.PASSPORT_DISCORD_CLIENT_SECRET,
      callbackURL: process.env.PASSPORT_DISCORD_CALLBACK_URL,
      scope: ['identify'],
    },
    async (accessToken, refreshToken, profile, done) => {
      let findUser;

      try {
        findUser = await DiscordUser.findOne({ discordId: profile.id });
      } catch (err) {
        console.error(err);
        return done(err, null);
      };

      try {
        if (!findUser) {
          const newUser = new DiscordUser({
            username: profile.username,
            discordId: profile.id,
          });

          const newSavedUser = await newUser.save();

          return done(null, newSavedUser);
        };

        return done(null, findUser)
      } catch (err) {
        console.error(err);
        return done(err, null);
      };
    },
  ),
);