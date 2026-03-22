import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'ayajob',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'db_siite',
  password: process.env.POSTGRES_PASSWORD || 'aya123',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function setupPasswordReset() {
  try {
    console.log('Setting up password reset tokens table...')
    
    // Create the table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at)')

    // Create cleanup function
    await pool.query(`
      CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
      RETURNS TRIGGER AS $$
      BEGIN
          DELETE FROM password_reset_tokens WHERE expires_at < CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    // Create trigger
    await pool.query(`
      DROP TRIGGER IF EXISTS cleanup_password_reset_tokens ON password_reset_tokens
    `)
    
    await pool.query(`
      CREATE TRIGGER cleanup_password_reset_tokens 
          BEFORE INSERT ON password_reset_tokens 
          FOR EACH ROW EXECUTE FUNCTION cleanup_expired_tokens()
    `)
    
    console.log('Password reset tokens table created successfully!')
    
    // Close the pool
    await pool.end()
    
  } catch (error) {
    console.error('Error setting up password reset tokens table:', error)
    process.exit(1)
  }
}

setupPasswordReset()
