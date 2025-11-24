const express = require('express');
const router = express.Router();
const passport = require('passport');
const Usuario = require('../models/Usuario');
const generarToken = require('../config/jwt');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, edad } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      edad
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login - Login tradicional
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporciona email y contraseña'
      });
    }

    const usuario = await Usuario.findOne({ email }).select('+password');

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const token = generarToken(usuario._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/auth/google - Iniciar autenticación con Google
router.get(
  '/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// GET /api/auth/google/callback - Callback de Google
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login' 
  }),
  (req, res) => {
    // Generar JWT para el usuario
    const token = generarToken(req.user._id);
    
    // Redirigir al frontend con el token
    // En producción, redirigir a tu URL de frontend
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
    
    // O devolver JSON si prefieres
    // res.json({
    //   success: true,
    //   token,
    //   data: {
    //     id: req.user._id,
    //     nombre: req.user.nombre,
    //     email: req.user.email,
    //     avatar: req.user.avatar
    //   }
    // });
  }
);

// GET /api/auth/me - Obtener usuario autenticado
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    
    res.status(200).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;