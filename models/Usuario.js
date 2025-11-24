const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  edad: {
    type: Number,
    min: 0
  },
  activo: {
    type: Boolean,
    default: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permite que sea opcional
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true
});

// Encriptar password antes de guardar (solo si existe)
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar passwords
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  if (!this.password) return false;
  return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);