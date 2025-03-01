"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  username: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return <UserContext.Provider value={{ user, loading, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)

