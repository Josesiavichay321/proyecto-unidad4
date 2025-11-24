const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/Usuario');
const generarToken = require('./jwt');
console.log('ID:', process.env.GOOGLE_CLIENT_ID);
console.log('SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('ENV loaded?', !!process.env.MONGODB_URI);



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si el usuario ya existe
        let usuario = await Usuario.findOne({ googleId: profile.id });

        if (usuario) {
          // Usuario existe, devolver usuario
          return done(null, usuario);
        }

        // Buscar por email por si se registró localmente
        usuario = await Usuario.findOne({ email: profile.emails[0].value });

        if (usuario) {
          // Actualizar con googleId
          usuario.googleId = profile.id;
          usuario.provider = 'google';
          usuario.avatar = profile.photos[0]?.value;
          await usuario.save();
          return done(null, usuario);
        }

        // Crear nuevo usuario
        usuario = await Usuario.create({
          googleId: profile.id,
          nombre: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value,
          provider: 'google'
        });

        done(null, usuario);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await Usuario.findById(id);
    done(null, usuario);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;