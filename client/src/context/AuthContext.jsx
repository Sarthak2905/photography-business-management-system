import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { demoCredentials } from '../data/mockData'
import { loginAdmin, setAuthToken } from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'lumina-admin-auth'

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: '', user: null, demoMode: false }
  })

  useEffect(() => {
    setAuthToken(auth.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  }, [auth])

  const value = useMemo(() => ({
    auth,
    isAuthenticated: Boolean(auth.token),
    login: async (credentials) => {
      try {
        const data = await loginAdmin(credentials)
        setAuth({ token: data.token, user: data.user, demoMode: false })
        return { success: true, demoMode: false }
      } catch {
        if (credentials.email === demoCredentials.email && credentials.password === demoCredentials.password) {
          setAuth({
            token: 'demo-token',
            user: {
              id: 'demo-admin',
              name: 'Aarav Kapoor',
              email: demoCredentials.email,
              role: 'admin',
            },
            demoMode: true,
          })
          return { success: true, demoMode: true }
        }

        return { success: false, message: 'Invalid credentials. Use admin@luminaweddings.com / admin123 in demo mode.' }
      }
    },
    logout: () => setAuth({ token: '', user: null, demoMode: false }),
  }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
