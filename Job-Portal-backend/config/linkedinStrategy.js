// config/linkedinStrategy.js
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("./models/user");

module.exports = (passport) => {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (_, __, profile, done) => {
        const user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          {
            name: profile.displayName,
            provider: "linkedin",
            providerId: profile.id,
          },
          { upsert: true, new: true }
        );
        done(null, user);
      }
    )
  );
};