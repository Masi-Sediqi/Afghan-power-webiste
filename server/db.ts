import pg from 'pg'

const { Pool } = pg

export type SafeUser = {
  id: number
  name: string
  phone: string | null
  email: string
  provider: string
  avatarUrl: string | null
}

export type UserRow = SafeUser & {
  passwordHash: string | null
  googleSub: string | null
}

function connectionString() {
  const value = process.env.DATABASE_URL?.trim()
  if (!value) throw new Error('DATABASE_URL is required')
  return value
}

export const pool = new Pool({ connectionString: connectionString() })

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT NOT NULL,
      password_hash TEXT,
      google_sub TEXT,
      provider TEXT NOT NULL DEFAULT 'local',
      avatar_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email));
    CREATE UNIQUE INDEX IF NOT EXISTS users_phone_unique ON users (phone) WHERE phone IS NOT NULL AND phone <> '';
    CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_unique ON users (google_sub) WHERE google_sub IS NOT NULL AND google_sub <> '';
  `)
}

function toUser(row: any): UserRow {
  return {
    id: Number(row.id),
    name: row.name,
    phone: row.phone,
    email: row.email,
    passwordHash: row.password_hash,
    googleSub: row.google_sub,
    provider: row.provider,
    avatarUrl: row.avatar_url,
  }
}

export function safeUser(user: UserRow): SafeUser {
  const { passwordHash: _passwordHash, googleSub: _googleSub, ...safe } = user
  return safe
}

export async function findUserById(id: number) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id])
  return result.rowCount ? toUser(result.rows[0]) : null
}

export async function findUserByIdentifier(identifier: string) {
  const result = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR phone = $2 LIMIT 1',
    [identifier, identifier],
  )
  return result.rowCount ? toUser(result.rows[0]) : null
}

export async function findUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1', [email])
  return result.rowCount ? toUser(result.rows[0]) : null
}

export async function createLocalUser(input: { name: string; phone: string; email: string; passwordHash: string }) {
  const result = await pool.query(
    `INSERT INTO users (name, phone, email, password_hash, provider)
     VALUES ($1, $2, $3, $4, 'local') RETURNING *`,
    [input.name, input.phone || null, input.email, input.passwordHash],
  )
  return toUser(result.rows[0])
}

export async function upsertGoogleUser(input: { name: string; email: string; googleSub: string; avatarUrl?: string | null }) {
  const existing = await findUserByEmail(input.email)
  if (existing) {
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE(NULLIF($2, ''), name), google_sub = $3, avatar_url = COALESCE($4, avatar_url),
           provider = CASE WHEN password_hash IS NULL THEN 'google' ELSE 'local+google' END, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [existing.id, input.name, input.googleSub, input.avatarUrl || null],
    )
    return toUser(result.rows[0])
  }

  const result = await pool.query(
    `INSERT INTO users (name, email, google_sub, provider, avatar_url)
     VALUES ($1, $2, $3, 'google', $4) RETURNING *`,
    [input.name, input.email, input.googleSub, input.avatarUrl || null],
  )
  return toUser(result.rows[0])
}
