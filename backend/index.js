// ============================================================
// index.js — Backend SportSoft Comfamiliar
// Conecta a MariaDB SISU y expone el endpoint de login
// ============================================================

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = process.env.PORT || 3001
let dbStatus = { connected: false, error: null }

// ── Middlewares ───────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Pool de conexiones a MariaDB ──────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

async function ensureDbConnection() {
  if (dbStatus.connected) return true

  try {
    const conn = await pool.getConnection()
    conn.release()
    dbStatus = { connected: true, error: null }
    console.log('✅ Conectado a MariaDB SISU correctamente')
    return true
  } catch (error) {
    dbStatus = { connected: false, error: error.message }
    console.error('❌ Error conectando a MariaDB:', error.message)
    return false
  }
}

// ── Test de conexión al arrancar ──────────────────────────────
ensureDbConnection()

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { rol, cedula, correo, password }
// ─────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { rol, cedula, password } = req.body

  try {
    const dbReady = await ensureDbConnection()
    if (!dbReady) {
      return res.status(503).json({
        error: 'No se pudo conectar a la base de datos SISU.',
        details: dbStatus.error,
      })
    }

    // ── Padre de Familia: busca por cédula en SISU ────────────
    // *** CAMBIO: Ahora separa la consulta en dos pasos ***
    // Antes: una sola query que mezclaba "no existe" con "sin beneficiarios"
    // Ahora: paso 1 = verificar cédula, paso 2 = verificar beneficiarios
    if (rol === 'PadreFamilia') {

      if (!cedula || !cedula.trim()) {
        return res.status(400).json({ error: 'Ingrese su número de cédula.' })
      }

      // *** PASO 1: Verificar si la cédula existe en la tabla subsi15 ***
      // Consulta simple sin EXISTS - solo busca si la cédula está activa
      const [existe] = await pool.execute(`
        SELECT 
          p.cedtra,
          TRIM(CONCAT(
            IFNULL(p.prinom,''), ' ',
            IFNULL(p.segnom,''), ' ',
            IFNULL(p.priape,''), ' ',
            IFNULL(p.segape,'')
          )) AS nombre_completo,
          p.priape,
          p.segape,
          p.prinom,
          p.segnom
        FROM empresa.subsi15 p
        WHERE p.cedtra = ?
          AND p.estado = 'A'
        LIMIT 1
      `, [cedula.trim()])

      // Si la cédula NO existe → error 401 "no encontrada"
      if (existe.length === 0) {
        return res.status(401).json({
          error: 'Cédula no encontrada en la base de datos.'
        })
      }

      // Guardamos los datos del padre
      const padre = existe[0]

      // *** PASO 2: Verificar si tiene beneficiarios activos ***
      // Consulta las tablas subsi23 (relación) y subsi22 (beneficiarios)
      const [benef] = await pool.execute(`
        SELECT 1
        FROM empresa.subsi23 s23
        INNER JOIN empresa.subsi22 b ON s23.codben = b.codben
        WHERE s23.cedtra = ?
          AND b.estado = 'A'
        LIMIT 1
      `, [cedula.trim()])

      // *** NUEVO: Si la cédula existe pero no tiene beneficiarios ***
      // Retornamos error 403 (Forbidden) con mensaje específico
      // El frontend diferenciará este 403 del 401 de "cédula no encontrada"
      if (benef.length === 0) {
        return res.status(403).json({
          error: 'Su cédula está registrada en Comfamiliar pero no tiene beneficiarios activos para inscribir.'
        })
      }

      // Si llegamos aquí: cédula existe Y tiene beneficiarios → continuar con login

      // TODO: cuando agreguen contraseña a la BD, verificar con bcrypt
      // Por ahora: la contraseña es la misma cédula (temporal)
      if (password !== cedula.trim()) {
        return res.status(401).json({ error: 'Contraseña incorrecta.' })
      }

      // Generar JWT
      const token = jwt.sign(
        {
          id: padre.cedtra,
          rol: 'PadreFamilia',
          nombreCompleto: padre.nombre_completo.trim(),
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      return res.json({
        message: `Bienvenido, ${padre.prinom}`,
        token,
        usuario: {
          cedula: padre.cedtra,
          nombreCompleto: padre.nombre_completo.trim(),
          priape: padre.priape,
          segape: padre.segape,
          prinom: padre.prinom,
          segnom: padre.segnom,
          rol: 'PadreFamilia',
        }
      })
    }

    // ── Empleado / Instructor: por ahora usuarios demo ────────
    // TODO: conectar a la tabla de usuarios del sistema cuando esté lista
    const USUARIOS_DEMO = {
      'empleado@comfamiliar.com.co': { rol: 'Empleado', nombre: 'Carlos Rodríguez', password: '123456' },
      'instructor@comfamiliar.com.co': { rol: 'Instructor', nombre: 'Ana Martínez', password: '123456' },
    }

    const { correo } = req.body
    if (!correo || !correo.trim()) {
      return res.status(400).json({ error: 'Ingrese su correo electrónico.' })
    }

    const usuarioDemo = USUARIOS_DEMO[correo.trim().toLowerCase()]
    if (!usuarioDemo || usuarioDemo.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    if (usuarioDemo.rol !== rol) {
      return res.status(401).json({ error: 'El rol no coincide con el correo ingresado.' })
    }

    const token = jwt.sign(
      { id: correo, rol: usuarioDemo.rol, nombreCompleto: usuarioDemo.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return res.json({
      message: `Bienvenido, ${usuarioDemo.nombre}`,
      token,
      usuario: {
        correo: correo.trim(),
        nombreCompleto: usuarioDemo.nombre,
        rol: usuarioDemo.rol,
      }
    })

  } catch (error) {
    console.error('❌ Error en login:', error.message)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
})

// POST /api/auth/consultar-cedula
// Consulta si la cédula existe en SISU y tiene beneficiarios activos
// *** CAMBIO: Ahora separa la consulta en dos pasos ***
// Paso 1: Verificar si la cédula pertenece a la base de datos
// Paso 2: Verificar si tiene beneficiarios activos
app.post('/api/auth/consultar-cedula', async (req, res) => {
  const { cedula } = req.body

  if (!cedula || !cedula.trim()) {
    return res.status(400).json({ error: 'Ingrese una cédula.' })
  }

  try {
    // *** PASO 1: Verificar si la cédula existe en SISU ***
    // Antes: una sola query con EXISTS que mezclaba "no existe" con "sin beneficiarios"
    // Ahora: consultamos solo si la cédula está en la tabla subsi15
    const [existe] = await pool.execute(`
      SELECT 
        p.cedtra,
        TRIM(CONCAT(
          IFNULL(p.prinom,''), ' ',
          IFNULL(p.segnom,''), ' ',
          IFNULL(p.priape,''), ' ',
          IFNULL(p.segape,'')
        )) AS nombre_completo,
        p.priape,
        p.segape,
        p.prinom,
        p.segnom
      FROM empresa.subsi15 p
      WHERE p.cedtra = ?
        AND p.estado = 'A'
      LIMIT 1
    `, [cedula.trim()])

    // Si la cédula NO existe en la tabla → "Cédula no encontrada"
    if (existe.length === 0) {
      return res.status(404).json({
        error: 'Cédula no encontrada en la base de datos.'
      })
    }

    // Guardamos los datos del padre para usarlos después
    const padre = existe[0]

    // *** PASO 2: Verificar si tiene beneficiarios activos ***
    // Consultamos la tabla subsi23 (relación padre-hijo) y subsi22 (beneficiarios)
    // Si no hay registros, significa que la cédula está registrada pero no tiene hijos activos
    const [benef] = await pool.execute(`
      SELECT 1
      FROM empresa.subsi23 s23
      INNER JOIN empresa.subsi22 b ON s23.codben = b.codben
      WHERE s23.cedtra = ?
        AND b.estado = 'A'
      LIMIT 1
    `, [cedula.trim()])

    // *** NUEVO: Determinar si tiene o no beneficiarios ***
    // Si benef.length === 0 → la cédula existe pero no tiene beneficiarios
    const sinBeneficiarios = benef.length === 0

    // Responder con los datos y el indicador de si tiene beneficiarios
    // El frontend usará "sinBeneficiarios" para mostrar el mensaje adecuado
    return res.json({
      encontrado: true,
      sinBeneficiarios,  // *** NUEVO CAMPO: true si no tiene beneficiarios ***
      datos: {
        cedula: padre.cedtra,
        nombreCompleto: padre.nombre_completo.trim(),
        prinom: padre.prinom?.trim(),
        segnom: padre.segnom?.trim(),
        priape: padre.priape?.trim(),
        segape: padre.segape?.trim(),
      }
    })

  } catch (error) {
    console.error('❌ Error consultando cédula:', error.message)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
})
// GET /api/padre/beneficiarios/:cedula
// Trae los beneficiarios activos del padre
app.get('/api/padre/beneficiarios/:cedula', async (req, res) => {
  const { cedula } = req.params

  try {
    const [rows] = await pool.execute(`
      SELECT 
        b.documento,
        TRIM(CONCAT(
          IFNULL(b.prinom,''), ' ',
          IFNULL(b.segnom,''), ' ',
          IFNULL(b.priape,''), ' ',
          IFNULL(b.segape,'')
        )) AS nombre_completo,
        b.prinom,
        b.priape,
        b.fecexp,
        TIMESTAMPDIFF(YEAR, b.fecexp, CURDATE()) AS edad
      FROM empresa.subsi22 b
      INNER JOIN empresa.subsi23 s23 ON b.codben = s23.codben
      WHERE s23.cedtra = ?
        AND b.estado = 'A'
    `, [cedula])

    return res.json({ beneficiarios: rows })

  } catch (error) {
    console.error('❌ Error trayendo beneficiarios:', error.message)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
})


// ── Health check ──────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbReady = await ensureDbConnection()
  res.json({
    status: dbReady ? 'ok' : 'degraded',
    message: 'SportSoft API funcionando',
    database: dbReady ? 'connected' : 'disconnected',
    dbError: dbStatus.error,
  })
})

// ── Iniciar servidor ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})