import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'db_siite',
  password: 'aya123',
  port: 5432,
}

async function createPackOrdersTable() {
  const client = new Pool(config)
  
  try {
    console.log('Création de la table des commandes de packs...')
    
    // Lire le fichier SQL
    const schemaPath = path.join(__dirname, '../lib/pack-orders-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Exécuter le schéma
    await client.query(schema)
    console.log('✅ Table pack_orders créée avec succès')
    
  } catch (error: any) {
    console.error('Erreur lors de la création:', error.message)
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  createPackOrdersTable()
}

export default createPackOrdersTable
