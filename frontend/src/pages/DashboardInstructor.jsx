// ============================================================
// DashboardInstructor.jsx — Panel del Instructor SportSoft
// Funcionalidades:
//   Tab 0: Consultar planilla (tabla completa por disciplina)
//   Tab 1: Registrar asistencia (marcar presente/ausente/justificado)
// Los datos son demo (sin BD), se reemplazarán con la BD real.
// ============================================================

import { useState } from 'react'

const VERDE = '#2d8a4e'
const VERDE_OS = '#1a5c30'
const VERDE_CL = 'rgba(45,138,78,0.10)'

// ─── Íconos SVG inline (mismo patrón que DashboardPadre) ─────
const IcoLogout = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
)
const IcoUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const IcoPin = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
const IcoClock = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
const IcoCheck = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

// ─── Datos demo: planillas por disciplina ─────────────────────
// TODO: reemplazar con GET /api/instructor/planillas (BD real)
const PLANILLAS_DEMO = [
    {
        id: 1,
        disciplina: 'Fútbol Infantil',
        edades: '6–12 años',
        horario: 'Lun y Mié · 3:00–5:00 pm',
        sede: 'Centro Napoleón Perea Castro',
        beneficiarios: [
            { nombre: 'Santiago Pérez', documento: '1045678123', edad: 8, estado: 'Activo' },
            { nombre: 'Valentina Ríos', documento: '1045678345', edad: 7, estado: 'Activo' },
            { nombre: 'Mateo Gómez', documento: '1045678567', edad: 9, estado: 'Activo' },
            { nombre: 'Isabella Torres', documento: '1045678789', edad: 6, estado: 'Inscrito' },
        ],
    },
    {
        id: 2,
        disciplina: 'Natación Juvenil',
        edades: '5–14 años',
        horario: 'Mar y Jue · 2:00–4:00 pm',
        sede: 'Centro Napoleón Perea Castro',
        beneficiarios: [
            { nombre: 'Emiliano Díaz', documento: '1045678901', edad: 11, estado: 'Activo' },
            { nombre: 'Camila Mendoza', documento: '1045678123', edad: 10, estado: 'Inscrito' },
            { nombre: 'Sebastián Mora', documento: '1045678456', edad: 12, estado: 'Activo' },
        ],
    },
]

const TABS = ['Consultar planilla', 'Registrar asistencia']

// Estados posibles de asistencia (para los toggles)
const ESTADOS_ASISTENCIA = ['Presente', 'Ausente', 'Justificado']

// Devuelve los colores del badge según el estado
const estadoBadge = (estado) => {
    if (estado === 'Presente') return { bg: VERDE_CL, color: VERDE }
    if (estado === 'Ausente') return { bg: '#fef2f2', color: '#dc2626' }
    if (estado === 'Justificado') return { bg: 'rgba(245,196,0,0.15)', color: '#92650a' }
    return { bg: '#f1f5f9', color: '#94a3b8' }
}

export default function DashboardInstructor({ onLogout }) {
    // Usuario guardado por el login (demo: Ana Martínez)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

    // Pestaña activa: 0 = planilla, 1 = asistencia
    const [tab, setTab] = useState(0)

    // Disciplina seleccionada (por defecto la primera)
    const [disciplinaId, setDisciplinaId] = useState(PLANILLAS_DEMO[0].id)

    // Asistencia: { [documento]: 'Presente'|'Ausente'|'Justificado' }
    // Inicializa todos en 'Presente' al cambiar de disciplina
    const [asistencia, setAsistencia] = useState({})

    // Fecha seleccionada (hoy por defecto)
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])

    // Mensaje de confirmación al guardar
    const [guardado, setGuardado] = useState(false)

    // Busca la disciplina activa por id
    const planillaActiva = PLANILLAS_DEMO.find(p => p.id === disciplinaId) || PLANILLAS_DEMO[0]

    // Cambia la disciplina y resetea la asistencia a Presente para todos
    const cambiarDisciplina = (id) => {
        setDisciplinaId(Number(id))
        const planilla = PLANILLAS_DEMO.find(p => p.id === Number(id)) || PLANILLAS_DEMO[0]
        const todos = {}
        planilla.beneficiarios.forEach(b => { todos[b.documento] = 'Presente' })
        setAsistencia(todos)
        setGuardado(false)
    }

    // Marca un estado específico para un beneficiario
    const marcarEstado = (doc, estado) => {
        setAsistencia(a => ({ ...a, [doc]: estado }))
        setGuardado(false)
    }

    // Marca TODOS como presentes (botón rápido)
    const marcarTodosPresentes = () => {
        const todos = {}
        planillaActiva.beneficiarios.forEach(b => { todos[b.documento] = 'Presente' })
        setAsistencia(todos)
        setGuardado(false)
    }

    // Guarda la asistencia en localStorage (simula BD)
    // Clave única por disciplina + fecha: asistencia_{id}_{fecha}
    const guardarAsistencia = () => {
        localStorage.setItem(
            `asistencia_${planillaActiva.id}_${fecha}`,
            JSON.stringify({ fecha, disciplina: planillaActiva.disciplina, asistencia })
        )
        setGuardado(true)
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#f0f2f5' }}>

            {/* ── Navbar (mismo estilo que DashboardPadre) ────────── */}
            <nav className="bg-white px-6 py-3 flex items-center gap-3"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderBottom: '1px solid #e8ecf0' }}>
                <div className="rounded-xl p-1.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <img src="/LOGO.jpg" alt="Comfamiliar" style={{ height: 36, objectFit: 'contain' }} />
                </div>
                <span className="font-bold text-slate-700 hidden sm:block">
                    <span style={{ color: VERDE }}>Com</span>familiar
                    <span className="text-slate-400 font-normal"> · Deportes</span>
                </span>

                <div className="ml-auto flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-700 leading-tight">{usuario.nombreCompleto}</p>
                        <p className="text-xs" style={{ color: VERDE }}>Instructor</p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: VERDE }}>
                        {(usuario.nombreCompleto?.[0] || 'I').toUpperCase()}
                    </div>
                    <button onClick={onLogout}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border-0 cursor-pointer transition"
                        style={{ background: '#fef2f2', color: '#dc2626' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}>
                        <IcoLogout /> Salir
                    </button>
                </div>
            </nav>

            <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">

                {/* ── Saludo ── */}
                <div className="mb-5">
                    <h1 className="font-bold text-slate-800 text-2xl">
                        Hola, {(usuario.nombreCompleto || '').split(' ')[0]} 👋
                    </h1>
                    <p className="text-slate-400 text-sm">Panel de Instructor · Comfamiliar Deportes</p>
                </div>

                {/* ── Tarjeta resumen ── */}
                <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}>
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
                        style={{ border: '1.5px solid rgba(255,255,255,0.08)' }} />
                    <p className="text-xs font-bold uppercase tracking-widest mb-3"
                        style={{ color: 'rgba(255,255,255,0.55)' }}>PLANILLAS DEL INSTRUCTOR</p>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                            style={{ background: 'rgba(255,255,255,0.18)' }}>
                            {usuario.nombreCompleto?.[0] || 'I'}
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">{usuario.nombreCompleto}</h2>
                            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                Correo: {usuario.correo || ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {[
                            { label: 'Disciplinas', valor: PLANILLAS_DEMO.length },
                            { label: 'Beneficiarios', valor: PLANILLAS_DEMO.reduce((a, p) => a + p.beneficiarios.length, 0) },
                            { label: 'Rol', valor: 'Instructor' },
                        ].map((s) => (
                            <div key={s.label} className="flex-1 rounded-xl px-3 py-2"
                                style={{ background: 'rgba(255,255,255,0.12)' }}>
                                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</p>
                                <p className="text-white font-semibold text-sm">{s.valor}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tarjeta principal con tabs ── */}
                <div className="bg-white rounded-2xl" style={{ border: '1px solid #e8ecf0' }}>
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 px-2 overflow-x-auto">
                        {TABS.map((t, i) => (
                            <button key={t} onClick={() => setTab(i)}
                                className="py-4 px-4 text-sm font-semibold border-0 bg-transparent cursor-pointer transition relative whitespace-nowrap"
                                style={{ color: tab === i ? VERDE : '#94a3b8' }}>
                                {t}
                                {tab === i && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: VERDE }} />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* ════ TAB 0: CONSULTAR PLANILLA ════ */}
                        {tab === 0 && (
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-base">Consultar planilla</h3>
                                        <p className="text-sm text-slate-400">Beneficiarios inscritos por disciplina</p>
                                    </div>
                                    {/* Selector de disciplina */}
                                    <label className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disciplina</span>
                                        <select value={disciplinaId} onChange={(e) => cambiarDisciplina(e.target.value)}
                                            className="px-3 py-2 rounded-lg text-sm font-semibold outline-none cursor-pointer"
                                            style={{ border: `1.5px solid ${VERDE}`, color: VERDE, background: VERDE_CL }}>
                                            {PLANILLAS_DEMO.map((p) => (
                                                <option key={p.id} value={p.id} style={{ color: '#1e293b' }}>{p.disciplina}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {/* Info de la disciplina */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5 p-4 rounded-xl"
                                    style={{ background: '#f8fafc', border: '1px solid #e8ecf0' }}>
                                    {[
                                        { ico: <IcoUsers />, val: planillaActiva.edades },
                                        { ico: <IcoClock />, val: planillaActiva.horario },
                                        { ico: <IcoPin />, val: planillaActiva.sede },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <span className="text-slate-400">{item.ico}</span>{item.val}
                                        </div>
                                    ))}
                                </div>

                                {/* Tabla de beneficiarios */}
                                <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e8ecf0' }}>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr style={{ background: '#f8fafc' }}>
                                                {['#', 'Nombre', 'Documento', 'Edad', 'Horario', 'Sede', 'Estado'].map((h, i) => (
                                                    <th key={i} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {planillaActiva.beneficiarios.map((b, i) => {
                                                const badge = estadoBadge(b.estado)
                                                return (
                                                    <tr key={b.documento} className="border-t" style={{ borderColor: '#f1f5f9' }}>
                                                        <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                                                        <td className="px-4 py-3 font-semibold text-slate-700">{b.nombre}</td>
                                                        <td className="px-4 py-3 text-slate-500">{b.documento}</td>
                                                        <td className="px-4 py-3 text-slate-500">{b.edad} años</td>
                                                        <td className="px-4 py-3 text-slate-500">{planillaActiva.horario}</td>
                                                        <td className="px-4 py-3 text-slate-500">{planillaActiva.sede}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                                style={{ background: badge.bg, color: badge.color }}>{b.estado}</span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ════ TAB 1: REGISTRAR ASISTENCIA ════ */}
                        {tab === 1 && (
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                    <div>
                                        <h3 className="font-bold text-slate-700 text-base">Registrar asistencia</h3>
                                        <p className="text-sm text-slate-400">Marque presencia de cada beneficiario</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Selector de fecha */}
                                        <label className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fecha</span>
                                            <input type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); setGuardado(false) }}
                                                className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer"
                                                style={{ border: `1.5px solid ${VERDE}`, color: VERDE }} />
                                        </label>
                                        {/* Selector de disciplina */}
                                        <label className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disciplina</span>
                                            <select value={disciplinaId} onChange={(e) => cambiarDisciplina(e.target.value)}
                                                className="px-3 py-2 rounded-lg text-sm font-semibold outline-none cursor-pointer"
                                                style={{ border: `1.5px solid ${VERDE}`, color: VERDE, background: VERDE_CL }}>
                                                {PLANILLAS_DEMO.map((p) => (
                                                    <option key={p.id} value={p.id} style={{ color: '#1e293b' }}>{p.disciplina}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                {/* Lista de beneficiarios con toggles */}
                                <div className="flex flex-col gap-2 mb-5">
                                    {planillaActiva.beneficiarios.map((b, i) => {
                                        // Estado actual de este beneficiario (por defecto Presente)
                                        const actual = asistencia[b.documento] || 'Presente'
                                        return (
                                            <div key={b.documento}
                                                className="flex flex-wrap items-center gap-3 p-3 rounded-xl"
                                                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                <span className="w-6 text-slate-400 text-xs font-semibold">{i + 1}</span>
                                                <div className="flex-1 min-w-[200px]">
                                                    <p className="font-semibold text-slate-700 text-sm">{b.nombre}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {b.documento} · {b.edad} años · {planillaActiva.horario}
                                                    </p>
                                                </div>
                                                {/* Toggles: Presente / Ausente / Justificado */}
                                                <div className="flex gap-1.5">
                                                    {ESTADOS_ASISTENCIA.map((est) => {
                                                        const activo = actual === est
                                                        const badge = estadoBadge(est)
                                                        return (
                                                            <button key={est} onClick={() => marcarEstado(b.documento, est)}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition"
                                                                style={activo
                                                                    ? { background: badge.bg, color: badge.color, boxShadow: `inset 0 0 0 1.5px ${badge.color}` }
                                                                    : { background: '#fff', color: '#94a3b8', boxShadow: 'inset 0 0 0 1px #e2e8f0' }}>
                                                                {!activo ? '○ ' : ''}{est}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Resumen de conteo */}
                                <div className="flex gap-3 mb-5">
                                    {ESTADOS_ASISTENCIA.map((est) => {
                                        const count = planillaActiva.beneficiarios.filter(b => (asistencia[b.documento] || 'Presente') === est).length
                                        const badge = estadoBadge(est)
                                        return (
                                            <div key={est} className="flex-1 rounded-xl px-3 py-2 text-center"
                                                style={{ background: badge.bg, border: `1px solid ${badge.color}33` }}>
                                                <p className="text-xs font-semibold" style={{ color: badge.color }}>{est}</p>
                                                <p className="text-white font-bold text-lg" style={{ color: badge.color }}>{count}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Botones de acción */}
                                <div className="flex flex-wrap gap-3">
                                    <button onClick={marcarTodosPresentes}
                                        className="px-4 py-2.5 rounded-xl text-xs font-semibold border-0 cursor-pointer transition"
                                        style={{ background: '#f1f5f9', color: '#475569' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e2e8f0')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f5f9')}>
                                        <IcoCheck /> Marcar todos presentes
                                    </button>
                                    <button onClick={guardarAsistencia}
                                        className="px-5 py-2.5 rounded-xl text-white font-bold text-sm border-0 cursor-pointer transition"
                                        style={{ background: `linear-gradient(135deg, ${VERDE} 0%, ${VERDE_OS} 100%)` }}
                                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                                        Guardar asistencia
                                    </button>
                                </div>

                                {/* Confirmación de guardado */}
                                {guardado && (
                                    <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium"
                                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                                        ✅ Asistencia guardada para el {new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO')} ·
                                        {planillaActiva.disciplina}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}