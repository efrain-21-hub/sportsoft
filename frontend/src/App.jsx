import { useState, useEffect } from 'react'
import Login from './pages/Login'
import DashboardPadre from './pages/DashboardPadre'
// 1. Importar la nueva página del instructor
import DashboardInstructor from './pages/DashboardInstructor'

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [transicion, setTransicion] = useState(false)

  // Lee la sesión guardada al cargar la app
  useEffect(() => {
    const u = localStorage.getItem('usuario')
    if (u) setUsuario(JSON.parse(u))
  }, [])

  // Cierra sesión: borra localStorage y suaviza el cambio a Login
  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    setTransicion(true)
    setTimeout(() => {
      setUsuario(null)
      setTransicion(false)
    }, 300)
  }
  // Inicia sesión: suaviza el cambio hacia el dashboard del rol
  const handleLogin = (u) => {
    setTransicion(true)
    setTimeout(() => {
      setUsuario(u)
      setTransicion(false)
    }, 300)
  }

  return (
    <div style={{
      opacity: transicion ? 0 : 1,
      transition: 'opacity 0.3s ease-in-out',
      minHeight: '100vh'
    }}>
      {usuario?.rol === 'PadreFamilia'
        ? <DashboardPadre onLogout={handleLogout} />
        // 2. Nueva ruta condicional para el instructor
        : usuario?.rol === 'Instructor'
          ? <DashboardInstructor onLogout={handleLogout} />
          : <Login onLogin={handleLogin} />
      }
    </div>
  )
}