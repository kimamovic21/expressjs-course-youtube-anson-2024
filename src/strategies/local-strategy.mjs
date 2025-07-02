import { Strategy } from 'passport-local';
import { mockUsers } from '../utils/constants.mjs';
import passport from 'passport';

passport.serializeUser((user, done) => {
  console.log(`Inside Serialize user`);
  console.log(user);

  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(`Outside Deserializer`);
  console.log(`Deserializing user id: ${id}`);

  try {
    const findUser = mockUsers.find((user) => user.id === id);

    if (!findUser) {
      throw new Error('User not found');
    };

    done(null, findUser);
  } catch (err) {
    done(err, null);
  };
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    try {
      const findUser = mockUsers.find((user) => user.username === username);

      if (!findUser) {
        throw new Error('User not found')
      };

      if (findUser.password !== password) {
        throw new Error('Invalid Credentials')
      };

      done(null, findUser);
    } catch (err) {
      console.error(err);
      done(err, null);
    };
  }),
);