const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protegerRuta = async (req, res, next) => {
  let token;

  // Verificar si el token existe en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraer token del header: "Bearer TOKEN"
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar que el token exista
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado para acceder a esta ruta'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario por ID del token
    req.usuario = await Usuario.findById(decoded.id);

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido o expirado'
    });
  }
};

module.exports = protegerRuta;