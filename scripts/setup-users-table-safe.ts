import pool from '../lib/db'
import fs from 'fs'
import path from 'path'

async function setupUsersTable() {
  try {
    console.log('Setting up users table...')
    
    // Create tables one by one to avoid conflicts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        avatar_url VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'email' CHECK (provider IN ('email', 'google')),
        provider_id VARCHAR(255),
        email_verified BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)')

    // Create trigger function if not exists
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    // Create trigger if not exists
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users
    `)
    
    await pool.query(`
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)
    
    console.log('Users table created successfully!')
    
    // Close pool
    await pool.end()
    
  } catch (error) {
    console.error('Error setting up users table:', error)
    process.exit(1)
  }
}

setupUsersTable()
