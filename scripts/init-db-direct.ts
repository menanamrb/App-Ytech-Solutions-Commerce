import { Pool } from 'pg'

// Configuration directe depuis votre .env
const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'postgres', // Base par défaut pour créer la nouvelle BDD
  password: 'aya123',
  port: 5432,
}

const targetDatabase = 'db_siite'

const sampleDevis = [
  {
    reference: 'DEV-2024-001',
    client_name: 'SARL TechPro',
    client_email: 'contact@techpro.fr',
    service: 'Site E-commerce',
    features: ['Design personnalisé', 'SEO', 'Responsive'],
    amount: 4500,
    deadline: '2024-03-15'
  },
  {
    reference: 'DEV-2024-002',
    client_name: 'Martin & Co',
    client_email: 'info@martinco.fr',
    service: 'Site Vitrine',
    features: ['Design personnalisé', 'CMS'],
    amount: 1200,
    deadline: '2024-03-20'
  },
  {
    reference: 'DEV-2024-003',
    client_name: 'Boulangerie Durand',
    client_email: 'durand@bakery.fr',
    service: 'Maintenance mensuelle',
    features: ['Support', 'Mises à jour'],
    amount: 49,
    deadline: '2024-03-10'
  }
]

async function initDatabase() {
  console.log('Configuration:', { ...config, password: '***' })
  console.log('Base de données cible:', targetDatabase)
  
  // Connexion à la base de données par défaut
  const client = new Pool(config)

  try {
    // Créer la base de données si elle n'existe pas
    await client.query(`CREATE DATABASE ${targetDatabase}`)
    console.log(`Base de données ${targetDatabase} créée avec succès`)
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`Base de données ${targetDatabase} existe déjà`)
    } else {
      console.error('Erreur lors de la création de la base de données:', error)
      return
    }
  } finally {
    await client.end()
  }

  // Connexion à la nouvelle base de données
  const targetClient = new Pool({
    ...config,
    database: targetDatabase
  })

  try {
    // Lire et exécuter le schéma
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(__dirname, '../lib/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    await targetClient.query(schema)
    console.log('Schéma exécuté avec succès')

    // Insérer les données d'exemple
    for (const devis of sampleDevis) {
      const query = `
        INSERT INTO devis (reference, client_name, client_email, service, features, amount, deadline)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (reference) DO NOTHING
      `
      await targetClient.query(query, [
        devis.reference,
        devis.client_name,
        devis.client_email,
        devis.service,
        devis.features,
        devis.amount,
        devis.deadline
      ])
    }
    
    console.log('Données d\'exemple insérées avec succès')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
  } finally {
    await targetClient.end()
  }
}

if (require.main === module) {
  initDatabase()
}

export default initDatabase
