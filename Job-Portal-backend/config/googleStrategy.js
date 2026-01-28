const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (_, __, profile, done) => {
        const user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          {
            name: profile.displayName,
            provider: "google",
            providerId: profile.id,
          },
          { upsert: true, new: true }
        );
        done(null, user);
      }
    )
  );
};