import { promises as fs } from "fs"
import path from "path"
import { hash, compare } from "bcryptjs"

const DB_PATH = path.join(process.cwd(), "_db")

// Ensure DB directory exists
async function ensureDbExists() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(DB_PATH)
  }
}

// User types
export interface User {
  id: string
  username: string
  email: string
  password: string
  name: string
  bio?: string
  avatar?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends Omit<User, "password"> {
  listingsCount: number
  rating: number
  reviews: number
}

// Database operations
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">) {
  await ensureDbExists()

  const users = await getUsers()

  // Check if user already exists
  if (users.some((user) => user.email === userData.email || user.username === userData.username)) {
    throw new Error("User already exists")
  }

  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...userData,
    password: await hash(userData.password, 12),
  }

  users.push(newUser)
  await fs.writeFile(path.join(DB_PATH, "users.json"), JSON.stringify(users, null, 2))

  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

export async function getUsers(): Promise<User[]> {
  await ensureDbExists()

  try {
    const data = await fs.readFile(path.join(DB_PATH, "users.json"), "utf-8")
    return JSON.parse(data)
  } catch {
    await fs.writeFile(path.join(DB_PATH, "users.json"), "[]")
    return []
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((user) => user.email === email) || null
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const users = await getUsers()
  const user = users.find((user) => user.username === username)

  if (!user) return null

  const { password, ...userWithoutPassword } = user
  return {
    ...userWithoutPassword,
    listingsCount: 0, // You would get this from listings database
    rating: 4.5, // You would calculate this from reviews
    reviews: 0, // You would get this from reviews database
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  const users = await getUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) throw new Error("User not found")

  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString(),
  }

  await fs.writeFile(path.join(DB_PATH, "users.json"), JSON.stringify(users, null, 2))

  const { password, ...userWithoutPassword } = users[index]
  return userWithoutPassword
}

export async function verifyCredentials(email: string, password: string): Promise<Omit<User, "password"> | null> {
  const user = await getUserByEmail(email)

  if (!user) return null

  const isValid = await compare(password, user.password)
  if (!isValid) return null

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Add this function to the existing db/index.ts file
export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers()
  return users.find((user) => user.id === id) || null
}

