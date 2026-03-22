import { Pool } from 'pg'
import pool from '../lib/db'
import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({ path: path.join(process.cwd(), '.env') })

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
  console.log('Environment variables:')
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER)
  console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE)
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST)
  console.log('POSTGRES_PORT:', process.env.POSTGRES_PORT)
  
  const client = new Pool({
    user: 'ayajob', // Utiliser ayajob pour créer la BDD
    host: process.env.POSTGRES_HOST || 'localhost',
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'aya123',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
  })

  try {
    await client.query(`CREATE DATABASE ${process.env.POSTGRES_DATABASE}`)
    console.log(`Database ${process.env.POSTGRES_DATABASE} created successfully`)
  } catch (error: any) {
    if (error.code === '42P04') {
      console.log(`Database ${process.env.POSTGRES_DATABASE} already exists`)
    } else {
      console.error('Error creating database:', error)
      return
    }
  } finally {
    await client.end()
  }

  try {
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(__dirname, '../lib/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await pool.query(schema)
    console.log('Schema executed successfully')

    for (const devis of sampleDevis) {
      const query = `
        INSERT INTO devis (reference, client_name, client_email, service, features, amount, deadline)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (reference) DO NOTHING
      `
      await pool.query(query, [
        devis.reference,
        devis.client_name,
        devis.client_email,
        devis.service,
        devis.features,
        devis.amount,
        devis.deadline
      ])
    }
    console.log('Sample data inserted successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  initDatabase()
}

export default initDatabase