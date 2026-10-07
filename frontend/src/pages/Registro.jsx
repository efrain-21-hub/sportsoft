// ============================================================
// Registro.jsx — Registro de Acudiente SportSoft Comfamiliar
// Flujo: consultar cédula → mostrar datos → crear contraseña
// ============================================================

import { useState } from 'react'
import axios from 'axios'

const VERDE = '#2d8a4e'
const VERDE_OS = '#1a5c30'
const AMARILLO = '#f5c400'
const API = 'http://localhost:3001'

// ─── Íconos ──────────────────────────────────────────────────
const IcoSearch = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const IcoCheck = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IcoX = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const IcoArrow = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)
const IcoEye = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const IcoEyeOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)
const IcoUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

export default function Registro({ onVolver, onLogin }) {
  // ── Estado paso 1: consultar cédula ──────────────────────
  const [cedula, setCedula] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [datosPadre, setDatos] = useState(null)
  const [errBusqueda, setErrBus] = useState('')
  const [sinBeneficiarios, setSinBenef] = useState(false)  // *** NUEVO: indica si la cédula existe pero no tiene beneficiarios ***

  // ── Estado paso 2: crear contraseña ──────────────────────
  const [paso, setPaso] = useState(1)
  const [password, setPass] = useState('')
  const [confirmar, setConf] = useState('')
  const [verPass, setVerP] = useState(false)
  const [verConf, setVerC] = useState(false)
  const [guardando, setGuard] = useState(false)
  const [errForm, setErrForm] = useState('')

  // *** CAMBIO: handleConsultar ahora maneja tres estados ***
  // 1. Error (cédula no existe) → errBusqueda
  // 2. Advertencia (cédula existe sin beneficiarios) → sinBeneficiarios
  // 3. Éxito (cédula existe con beneficiarios) → datosPadre
  const handleConsultar = async () => {
    if (!cedula.trim()) return
    setBuscando(true)
    setErrBus('')
    setDatos(null)
    setSinBenef(false)  // *** NUEVO: limpiar estado de sin beneficiarios ***

    try {
      // *** NUEVO: Ejecutar la consulta y un delay mínimo en paralelo ***
      // El delay de 1.5s asegura que el usuario vea la animación de carga
      // aunque la API responda rápido
      const minDelay = new Promise(resolve => setTimeout(resolve, 2500))
      const consulta = axios.post(`${API}/api/auth/consultar-cedula`, {
        cedula: cedula.trim()
      })

      // Esperar a que AMBOS terminen: la consulta Y el delay mínimo
      const [, { data }] = await Promise.all([minDelay, consulta])

      setDatos(data.datos)
      setSinBenef(data.sinBeneficiarios)
    } catch (err) {
      setErrBus(
        err.response?.data?.error ||
        'Error al consultar. Verifique su conexión.'
      )
    } finally {
      setBuscando(false)
    }
  }

  // ── Paso 2: guardar contraseña ───────────────────────────
  // Por ahora guarda en localStorage hasta que tengamos la BD propia
  // TODO: llamar a /api/auth/registro cuando tengamos sportsoft_db
  const handleRegistrar = async (e) => {
    e.preventDefault()
    setErrForm('')

    if (password.length < 6) {
      setErrForm('La contraseña debe tener mínimo 6 caracteres.')
      return
    }
    if (password !== confirmar) {
      setErrForm('Las contraseñas no coinciden.')
      return
    }

    setGuard(true)

    try {
      const usuario = {
        cedula: datosPadre.cedula,
        nombreCompleto: datosPadre.nombreCompleto,
        prinom: datosPadre.prinom,
        priape: datosPadre.priape,
        rol: 'PadreFamilia',
      }
      localStorage.setItem('usuario', JSON.stringify(usuario))
      localStorage.setItem('token', 'temporal_' + datosPadre.cedula)
      setPaso(3)

      setTimeout(() => {
        if (onLogin) onLogin(usuario)
      }, 1500)

    } catch (err) {
      setErrForm('Error al guardar. Intente de nuevo.')
    } finally {
      setGuard(false)
    }
  }

  // ── Pantalla de éxito (paso 3) ───────────────────────────
  if (paso === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: '#f0fdf4' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(45,138,78,0.15)' }}>
            <span style={{ color: VERDE }}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          <h2 className="font-bold text-slate-800 text-2xl mb-2">Registro exitoso</h2>
          <p className="text-slate-500 text-sm">
            Bienvenido a Comfamiliar Deportes. Redirigiendo...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f5f6fa' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Botón volver */}
        <button onClick={onVolver}
          className="flex items-center justify-center w-9 h-9 rounded-lg border-0
                     cursor-pointer transition"
          style={{ background: '#f1f5f9', color: '#475569' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}>
          <IcoArrow />
        </button>

        {/* Logo */}
        <div className="rounded-xl p-1.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <img src="/LOGO.jpg" alt="Comfamiliar" style={{ height: 34, objectFit: 'contain' }} />
        </div>

        {/* Indicador de pasos */}
        <div className="ml-auto flex items-center gap-3">
          {['Verificar cédula', 'Crear contraseña'].map((label, i) => {
            const n = i + 1
            const activo = paso >= n
            return (
              <div key={n} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={activo
                    ? { background: VERDE, color: '#fff' }
                    : { background: '#e2e8f0', color: '#94a3b8' }}>
                  {n}
                </div>
                <span className="text-xs hidden sm:block font-medium"
                  style={{ color: activo ? VERDE : '#94a3b8' }}>
                  {label}
                </span>
                {n < 2 && (
                  <div className="w-8 h-px mx-1"
                    style={{ background: paso > n ? VERDE : '#e2e8f0' }} />
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* ── Contenido ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8"
          style={{ border: '1px solid #e8ecf0' }}>

          {/* ════ PASO 1: Consultar cédula ════ */}
          {paso === 1 && (
            <>
              {/* Ícono */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(45,138,78,0.10)' }}>
                <span style={{ color: VERDE }}><IcoSearch /></span>
              </div>

              <h2 className="font-bold text-slate-800 text-2xl mb-1">Registro de Acudiente</h2>
              <p className="text-sm text-slate-400 mb-6">
                Ingrese su número de cédula. Verificaremos si está afiliado a Comfamiliar
                y tiene beneficiarios activos.
              </p>

              {/* Campo cédula */}
              <label className="block text-xs font-bold uppercase tracking-wide
                                text-slate-500 mb-1.5">
                Número de cédula
              </label>
              <div className="flex gap-3 mb-2">
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => {
                    setCedula(e.target.value.replace(/\D/g, ''))
                    setErrBus('')
                    setDatos(null)
                  }}
                  //onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                  placeholder="Ej: 1000270918"
                  maxLength={12}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-slate-800
                             outline-none transition"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                  onFocus={(e) => { e.target.style.borderColor = VERDE; e.target.style.background = '#fff' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                />
                <button
                  onClick={handleConsultar}
                  disabled={buscando || !cedula.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white
                             font-semibold text-sm border-0 cursor-pointer transition
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}>
                  {buscando ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Consultando...
                    </>
                  ) : (
                    <><IcoSearch /> Consultar</>
                  )}
                </button>
              </div>

              {/* Estado: consultando */}
              {buscando && (
                <div className="mt-4 p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(45,138,78,0.06)', border: `1px solid rgba(45,138,78,0.2)` }}>
                  <svg className="w-4 h-4 animate-spin" style={{ color: VERDE }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm font-medium" style={{ color: VERDE }}>
                    Consultando en la base de datos de Comfamiliar...
                  </p>
                </div>
              )}

              {/* Error: no encontrado */}
              {errBusqueda && (
                <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
                  <span style={{ color: '#dc2626' }}><IcoX /></span>
                  <div>
                    <p className="text-sm font-semibold text-red-600">Cédula no encontrada</p>
                    <p className="text-xs text-red-400 mt-0.5">{errBusqueda}</p>
                  </div>
                </div>
              )}

              {/* *** NUEVO: Advertencia amarilla cuando la cédula existe pero no tiene beneficiarios *** */}
              {/* Se muestra cuando sinBeneficiarios es true Y hay datos del padre */}
              {sinBeneficiarios && datosPadre && (
                <div className="mt-4 p-4 rounded-xl flex items-start gap-3"
                  style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                  {/* Ícono de advertencia (triángulo amarillo) */}
                  <span style={{ color: '#d97706' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </span>
                  <div>
                    {/* Título del mensaje */}
                    <p className="text-sm font-semibold" style={{ color: '#92400e' }}>
                      Cédula registrada sin beneficiarios activos
                    </p>
                    {/* Descripción del mensaje */}
                    <p className="text-xs mt-0.5" style={{ color: '#a16207' }}>
                      Su cédula pertenece a Comfamiliar pero no tiene beneficiarios activos para inscribir.
                      Verifique que cuente con hijos en edad deportiva.
                    </p>
                  </div>
                </div>
              )}

              {/* *** CAMBIO: Solo mostrar éxito si hay datos Y tiene beneficiarios *** */}
              {datosPadre && !sinBeneficiarios && (
                <div className="mt-4">
                  <div className="p-5 rounded-xl mb-4"
                    style={{ background: 'rgba(45,138,78,0.06)', border: `1px solid rgba(45,138,78,0.25)` }}>

                    {/* Encabezado */}
                    <div className="flex items-center gap-2 mb-4">
                      <span style={{ color: VERDE }}><IcoCheck /></span>
                      <p className="font-bold text-sm" style={{ color: VERDE }}>
                        Afiliado encontrado en Comfamiliar
                      </p>
                    </div>

                    {/* Avatar + nombre */}
                    <div className="flex items-center gap-3 mb-4 pb-4"
                      style={{ borderBottom: '1px solid rgba(45,138,78,0.15)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center
                                      text-white font-bold text-lg"
                        style={{ background: VERDE }}>
                        {datosPadre.prinom?.[0] || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-base">
                          {datosPadre.nombreCompleto}
                        </p>
                        <p className="text-xs text-slate-500">Cédula: {datosPadre.cedula}</p>
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: 'rgba(45,138,78,0.7)' }}>Primer nombre</p>
                        <p className="text-sm font-semibold text-slate-700">{datosPadre.prinom}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: 'rgba(45,138,78,0.7)' }}>Primer apellido</p>
                        <p className="text-sm font-semibold text-slate-700">{datosPadre.priape}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botón continuar */}
                  <button
                    onClick={() => setPaso(2)}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm
                               border-0 cursor-pointer transition"
                    style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                    Continuar → Crear contraseña
                  </button>
                </div>
              )}
            </>
          )}

          {/* ════ PASO 2: Crear contraseña ════ */}
          {paso === 2 && datosPadre && (
            <>
              {/* Chip con nombre */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
                style={{ background: 'rgba(245,196,0,0.15)', border: `1px solid ${AMARILLO}66`, width: 'fit-content' }}>
                <span className="w-2 h-2 rounded-full" style={{ background: AMARILLO }} />
                <span className="text-xs font-bold" style={{ color: '#92650a' }}>
                  {datosPadre.nombreCompleto}
                </span>
              </div>

              <h2 className="font-bold text-slate-800 text-2xl mb-1">Crear contraseña</h2>
              <p className="text-sm text-slate-400 mb-6">
                Cree una contraseña segura para acceder a la plataforma.
              </p>

              <form onSubmit={handleRegistrar} noValidate>

                {/* Cédula (solo lectura) */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-500 mb-1.5">
                    Cédula
                  </label>
                  <input type="text" value={datosPadre.cedula} readOnly
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-500 outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>

                {/* Nombre (solo lectura) */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-500 mb-1.5">
                    Nombre completo
                  </label>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f1f5f9' }}>
                    <span style={{ color: VERDE }}><IcoUser /></span>
                    <span className="text-sm font-semibold text-slate-600">
                      {datosPadre.nombreCompleto}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Datos tomados de SISU · no editables</p>
                </div>

                {/* Contraseña */}
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-500 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 pr-11 py-2.5 rounded-lg text-sm
                                 text-slate-800 outline-none transition"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={(e) => { e.target.style.borderColor = VERDE; e.target.style.background = '#fff' }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                    <button type="button" onClick={() => setVerP(!verPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                                 hover:text-slate-600 border-0 bg-transparent cursor-pointer">
                      {verPass ? <IcoEyeOff /> : <IcoEye />}
                    </button>
                  </div>
                  {/* Indicador fuerza de contraseña */}
                  {password.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex-1 h-1 rounded-full transition-all"
                          style={{
                            background: password.length >= n * 2
                              ? n <= 1 ? '#ef4444'
                                : n <= 2 ? '#f59e0b'
                                  : n <= 3 ? '#3b82f6'
                                    : VERDE
                              : '#e2e8f0'
                          }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-500 mb-1.5">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={verConf ? 'text' : 'password'}
                      value={confirmar}
                      onChange={(e) => setConf(e.target.value)}
                      placeholder="Repita su contraseña"
                      className="w-full px-4 pr-11 py-2.5 rounded-lg text-sm
                                 text-slate-800 outline-none transition"
                      style={{
                        border: `1.5px solid ${confirmar && confirmar === password ? VERDE : confirmar ? '#ef4444' : '#e2e8f0'}`,
                        background: '#f8fafc'
                      }}
                      onFocus={(e) => { e.target.style.background = '#fff' }}
                      onBlur={(e) => { e.target.style.background = '#f8fafc' }}
                    />
                    <button type="button" onClick={() => setVerC(!verConf)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                                 hover:text-slate-600 border-0 bg-transparent cursor-pointer">
                      {verConf ? <IcoEyeOff /> : <IcoEye />}
                    </button>
                  </div>
                  {confirmar && confirmar !== password && (
                    <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                  )}
                  {confirmar && confirmar === password && (
                    <p className="text-xs mt-1" style={{ color: VERDE }}>✓ Las contraseñas coinciden</p>
                  )}
                </div>

                {/* Error */}
                {errForm && (
                  <div className="mb-4 px-4 py-2.5 rounded-lg text-sm"
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                    {errForm}
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setPaso(1)}
                    className="px-5 py-3 rounded-xl font-semibold text-sm border-0
                               cursor-pointer transition"
                    style={{ background: '#f1f5f9', color: '#475569' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}>
                    ← Volver
                  </button>
                  <button type="submit" disabled={guardando}
                    className="flex-1 py-3 rounded-xl text-white font-bold text-sm
                               border-0 cursor-pointer transition disabled:opacity-70"
                    style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}
                    onMouseEnter={(e) => !guardando && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !guardando && (e.currentTarget.style.opacity = '1')}>
                    {guardando ? 'Guardando...' : 'Completar registro'}
                  </button>
                </div>

              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}