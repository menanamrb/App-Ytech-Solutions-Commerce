import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'ayajob',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'db_siite',
  password: process.env.POSTGRES_PASSWORD || 'aya123',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function updateUserSchema() {
  try {
    console.log('Updating users schema...')
    
    // Ajouter la colonne prenom si elle n'existe pas
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS prenom VARCHAR(100)
    `)
    
    // Mettre à jour la colonne name pour stocker nom complet
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN name TYPE VARCHAR(300)
    `)
    
    // Créer un index sur prenom pour optimiser les recherches
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_prenom ON users(prenom)
    `)
    
    // Mettre à jour les utilisateurs existants pour séparer prénom et nom
    await pool.query(`
      UPDATE users 
      SET 
        prenom = CASE 
          WHEN position(' ' IN name) > 0 
          THEN TRIM(SPLIT_PART(name, ' ', 1))
          ELSE NULL
        END,
        name = TRIM(name)
      WHERE prenom IS NULL AND name IS NOT NULL
    `)
    
    console.log('Users schema updated successfully!')
    
    // Fermer la connexion
    await pool.end()
    
  } catch (error) {
    console.error('Error updating users schema:', error)
    process.exit(1)
  }
}

updateUserSchema()
