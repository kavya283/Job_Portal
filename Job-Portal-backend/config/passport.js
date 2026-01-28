const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/User");

// --- Google Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback" 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          // Role is omitted so it can be handled globally or later
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- LinkedIn Strategy ---
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/linkedin/callback",
      scope: ["openid", "profile", "email"],
      state: false 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || profile._json?.email;

        if (!email) {
          return done(new Error("No email found in LinkedIn profile"), null);
        }

        let user = await User.findOne({ email: email });

        if (!user) {
          const firstName = profile.name?.givenName || profile._json?.given_name || "";
          const lastName = profile.name?.familyName || profile._json?.family_name || "";
          const fullName = profile.displayName || `${firstName} ${lastName}`.trim();

          // Role is omitted to keep the strategy role-agnostic
          user = await User.create({
            name: fullName || "LinkedIn User",
            email: email,
            linkedinId: profile.id
          });
        }
        
        return done(null, user);
      } catch (err) {
        console.error("LinkedIn Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;