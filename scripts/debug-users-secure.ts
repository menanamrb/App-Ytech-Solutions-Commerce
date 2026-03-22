import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'ayajob',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || 'db_siite',
  password: process.env.POSTGRES_PASSWORD || 'aya123',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function debugUsersSecure() {
  try {
    console.log('🔍 Debug sécurisé des utilisateurs...\n')
    
    // Vérifier tous les utilisateurs SANS données sensibles
    const result = await pool.query(`
      SELECT id, prenom, name, email, provider, email_verified, created_at, last_login
      FROM users 
      ORDER BY created_at DESC
      LIMIT 5
    `)
    
    if (result.rows.length === 0) {
      console.log('❌ Aucun utilisateur trouvé en base de données')
    } else {
      console.log(`✅ ${result.rows.length} utilisateur(s) trouvé(s) :\n`)
      
      result.rows.forEach((user, index) => {
        // Masquer l'email partiellement pour la sécurité
        const maskedEmail = user.email.replace(/(.{2}).*(@.*)/, '$1***$2')
        
        console.log(`${index + 1}. ${user.prenom || ''} ${user.name || 'N/A'} (${maskedEmail})`)
        console.log(`   Provider: ${user.provider}`)
        console.log(`   Email vérifié: ${user.email_verified ? '✅' : '❌'}`)
        console.log(`   Créé le: ${user.created_at}`)
        console.log(`   Dernière connexion: ${user.last_login || 'Jamais'}\n`)
      })
    }
    
    // Vérifier s'il y a des tokens de reset
    const tokensResult = await pool.query(`
      SELECT COUNT(*) as count FROM password_reset_tokens
    `)
    
    console.log(`🔑 Tokens de reset actifs: ${tokensResult.rows[0].count}`)
    
    // Fermer la connexion
    await pool.end()
    
  } catch (error) {
    console.error('❌ Erreur lors du debug:', error.message)
  }
}

debugUsersSecure()
