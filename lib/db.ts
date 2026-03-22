import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'ayajob',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'db_siite',
  password: process.env.POSTGRES_PASSWORD || 'aya123',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export default pool
