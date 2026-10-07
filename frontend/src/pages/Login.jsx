import { useState } from 'react'
import axios from 'axios'
import Registro from './Registro'

const IcoShield = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>)
const IcoClip = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>)
const IcoUser = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>)
const IcoEye = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)
const IcoEyeOff = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>)
const IcoUsers = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>)
const IcoTrophy = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>)
const IcoPin = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>)

const STATS = [
  { icon: <IcoUsers />, label: 'Beneficiarios activos', valor: '4.280' },
  { icon: <IcoTrophy />, label: 'Programas deportivos', valor: '18' },
  { icon: <IcoPin />, label: 'Sedes deportivas', valor: '12' },
]

const ROLES = [
  { id: 'Empleado', label: 'Empleado', icon: <IcoShield /> },
  { id: 'Instructor', label: 'Instructor', icon: <IcoClip /> },
  { id: 'PadreFamilia', label: 'Acudiente', icon: <IcoUser /> },
]

const BADGE_TEXTO = {
  Empleado: 'Acceso administrativo',
  Instructor: 'Acceso instructor',
  PadreFamilia: 'Acceso familiar',
}

const VERDE = '#2d8a4e'
const VERDE_OS = '#1a5c30'
const AMARILLO = '#f5c400'

export default function Login({ onLogin }) {
  const [rol, setRol] = useState('PadreFamilia')
  const [cedula, setCedula] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPass] = useState('')
  const [verPass, setVer] = useState(false)
  const [verRegistro, setVerRegistro] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRol = (r) => {
    setRol(r); setError(''); setExito('')
    setCedula(''); setCorreo(''); setPass('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setExito('')

    if (rol === 'PadreFamilia' && !cedula.trim()) { setError('Ingrese su número de cédula.'); return }
    if (rol !== 'PadreFamilia' && !correo.trim()) { setError('Ingrese su correo electrónico.'); return }
    if (!password) { setError('Ingrese su contraseña.'); return }

    try {
      setCargando(true)
      const body = { rol, password }
      if (rol === 'PadreFamilia') body.cedula = cedula.trim()
      else body.correo = correo.trim().toLowerCase()

      const { data } = await axios.post('http://localhost:3001/api/auth/login', body)

      localStorage.setItem('token', JSON.stringify(data.token))
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      localStorage.setItem('token', JSON.stringify(data.token))

      // Notifica a App.jsx
      if (onLogin) onLogin(data.usuario)

      setExito(`✅ ${data.message} — Bienvenido al sistema`)

    } catch (err) {
      // *** CAMBIO: Ahora diferenciamos entre los tres tipos de error ***
      // 401 = cédula no encontrada o credenciales incorrectas
      // 403 = cédula existe pero sin beneficiarios (nuevo)
      // Otro = error de servidor
      const status = err.response?.status
      const msg = err.response?.data?.error

      if (status === 403) {
        // *** NUEVO: Mensaje específico para cédula sin beneficiarios ***
        setError(msg || 'Su cédula está registrada pero no tiene beneficiarios activos.')
      } else if (status === 401) {
        // Cédula no encontrada o contraseña incorrecta
        setError(msg || 'Credenciales incorrectas.')
      } else {
        // Error de servidor o de conexión
        setError(msg || 'Error al conectar con el servidor.')
      }
    } finally {
      setCargando(false)
    }
  }
  if (verRegistro) return <Registro onVolver={() => setVerRegistro(false)} onLogin={onLogin} />

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      {/* Imagen de fondo */}
      <div className="absolute inset-0"
        style={{ backgroundImage: 'url(/Centro.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center top' }} />

      {/* Capa oscura */}
      <div className="absolute inset-0" style={{ background: 'rgba(5, 28, 15, 0.45)' }} />

      {/* Tarjeta */}
      <div className="relative z-10 w-full max-w-5xl flex rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.55)', minHeight: 600 }}>

        {/* Panel izquierdo */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between p-10"
          style={{ background: 'rgba(5, 30, 15, 0.60)', backdropFilter: 'blur(8px)' }}>

          {/* Logo */}
          <div className="inline-block rounded-2xl p-2"
            style={{ background: 'rgba(255,255,255,0.95)', width: 'fit-content' }}>
            <img src="/LOGO.jpg" alt="Comfamiliar" style={{ height: 52, objectFit: 'contain' }} />
          </div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(245,196,0,0.18)', border: '1px solid rgba(245,196,0,0.45)', width: 'fit-content' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: AMARILLO }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: AMARILLO }}>
                Plataforma deportiva
              </span>
            </div>

            <h1 className="font-extrabold text-white leading-tight" style={{ fontSize: '2.1rem' }}>Área de</h1>
            <h1 className="font-extrabold leading-tight mb-4" style={{ fontSize: '2.8rem', color: '#4ade80' }}>Deportes</h1>
            <p className="font-semibold text-white text-base">Centro Recreacional</p>
            <p className="font-bold text-white text-lg mb-3">Napoleón Perea Castro</p>

            <div className="inline-block px-5 py-1.5 rounded-full mb-6"
              style={{ background: AMARILLO, width: 'fit-content' }}>
              <span className="font-bold text-sm" style={{ color: '#1a3a00' }}>Cartagena</span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Inscribe a tus hijos en programas deportivos, haz seguimiento
              de asistencias y gestiona tu cuenta desde un solo lugar.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2.5">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <span style={{ color: '#4ade80' }}>{s.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
                  <p className="text-white font-bold text-xl leading-tight">{s.valor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex items-center justify-center p-8"
          style={{ background: 'rgba(255,255,255,0.97)' }}>
          <div className="w-full max-w-sm">

            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: VERDE }}>
              Bienvenido de nuevo
            </p>
            <h2 className="font-bold text-slate-800 mb-1" style={{ fontSize: '1.7rem' }}>Inicio de Sesión</h2>
            <p className="text-sm text-slate-400 mb-7">Seleccione su rol e ingrese sus credenciales</p>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 gap-1 mb-5" style={{ background: '#f1f3f7' }}>
              {ROLES.map((r) => (
                <button key={r.id} onClick={() => handleRol(r.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                             text-xs font-semibold transition-all duration-150 cursor-pointer border-0"
                  style={rol === r.id
                    ? { background: '#fff', color: VERDE, boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }
                    : { background: 'transparent', color: '#94a3b8' }}>
                  {r.icon}<span>{r.label}</span>
                </button>
              ))}
            </div>

            {/* Badge */}
            <div className="mb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: 'rgba(45,138,78,0.10)', color: VERDE }}>
                {BADGE_TEXTO[rol]}
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* Campo cédula o correo */}
              {rol === 'PadreFamilia' ? (
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                    Cédula de ciudadanía
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                      </svg>
                    </span>
                    <input type="text" value={cedula}
                      onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
                      placeholder="Ej: 1000270918" maxLength={12}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-slate-800 outline-none transition"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={(e) => { e.target.style.borderColor = VERDE; e.target.style.background = '#fff' }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Solo números · sin puntos ni espacios</p>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <input type="email" value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      placeholder={rol === 'Empleado' ? 'empleado@comfamiliar.com.co' : 'instructor@comfamiliar.com.co'}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-slate-800 outline-none transition"
                      style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                      onFocus={(e) => { e.target.style.borderColor = VERDE; e.target.style.background = '#fff' }}
                      onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                </div>
              )}

              {/* Contraseña */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Contraseña</label>
                  <a href="#" className="text-xs font-semibold" style={{ color: VERDE }}>¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input type={verPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPass(e.target.value)} placeholder="••••••••"
                    className="w-full pl-9 pr-11 py-2.5 rounded-lg text-sm text-slate-800 outline-none transition"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    onFocus={(e) => { e.target.style.borderColor = VERDE; e.target.style.background = '#fff' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                  />
                  <button type="button" onClick={() => setVer(!verPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                               hover:text-slate-600 border-0 bg-transparent cursor-pointer">
                    {verPass ? <IcoEyeOff /> : <IcoEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 px-4 py-2.5 rounded-lg text-sm"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              {exito && (
                <div className="mb-4 px-4 py-2.5 rounded-lg text-sm"
                  style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                  {exito}
                </div>
              )}

              <button type="submit" disabled={cargando}
                className="w-full py-3 rounded-xl text-white font-bold text-sm
                           transition-all duration-150 cursor-pointer border-0 disabled:opacity-70"
                style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}
                onMouseEnter={(e) => !cargando && (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => !cargando && (e.currentTarget.style.opacity = '1')}
              >
                {cargando ? 'Verificando...' : 'Iniciar Sesión'}
              </button>

            </form>

            <p className="text-center text-xs text-slate-400 mt-5">
              ¿No tiene cuenta?{' '}
              <a href="#" style={{ color: VERDE, fontWeight: 700 }}
                onClick={(e) => { e.preventDefault(); setVerRegistro(true) }}> Regístrese aquí
              </a>
            </p>
            <p className="text-center text-xs mt-3" style={{ color: '#cbd5e1' }}>
              Caja de Compensación Familiar de Cartagena y Bolívar
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}