import { Pool } from 'pg'

const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'db_siite',
  password: 'aya123',
  port: 5432,
}

async function addProjectDescriptionColumn() {
  const client = new Pool(config)
  
  try {
    // Ajouter la colonne project_description si elle n'existe pas
    await client.query('ALTER TABLE devis ADD COLUMN IF NOT EXISTS project_description TEXT')
    console.log('Colonne project_description ajoutée avec succès')
    
    // Vérifier que la colonne existe bien
    const result = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'devis' AND column_name = 'project_description'
    `)
    
    if (result.rows.length > 0) {
      console.log('❌ La colonne n\'a pas pu être ajoutée')
    } else {
      console.log('✅ Colonne project_description vérifiée avec succès')
    }
    
  } catch (error: any) {
    if (error.code === '42701') { // La colonne existe déjà
      console.log('✅ La colonne project_description existe déjà')
    } else {
      console.error('Erreur:', error)
    }
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  addProjectDescriptionColumn()
}

export default addProjectDescriptionColumn
