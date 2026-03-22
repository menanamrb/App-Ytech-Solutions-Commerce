import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'ayajob',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'db_siite',
  password: process.env.POSTGRES_PASSWORD || 'aya123',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function checkUsers() {
  try {
    console.log('🔍 Vérification des utilisateurs en base de données...\n')
    
    const result = await pool.query(`
      SELECT id, email, name, provider, provider_id, email_verified, created_at, last_login
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10
    `)
    
    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé en base de données')
    } else {
      console.log(`✅ ${result.rows.length} utilisateur(s) trouvé(s) :\n`)
      
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'N/A'} (${user.email})`)
        console.log(`   Provider: ${user.provider}`)
        console.log(`   Email vérifié: ${user.email_verified ? '✅' : '❌'}`)
        console.log(`   Créé le: ${user.created_at}`)
        console.log(`   Dernière connexion: ${user.last_login || 'Jamais'}\n`)
      })
    }
    
    // Fermer la connexion
    await pool.end()
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  }
}

checkUsers()
