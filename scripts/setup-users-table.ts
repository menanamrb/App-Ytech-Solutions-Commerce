import pool from '../lib/db'
import fs from 'fs'
import path from 'path'

async function setupUsersTable() {
  try {
    console.log('Setting up users table...')
    
    // Read the SQL schema
    const schemaPath = path.join(__dirname, '../lib/users-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Execute the schema
    await pool.query(schema)
    
    console.log('Users table created successfully!')
    
    // Close the pool
    await pool.end()
    
  } catch (error) {
    console.error('Error setting up users table:', error)
    process.exit(1)
  }
}

setupUsersTable()
