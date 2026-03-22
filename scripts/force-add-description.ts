import { Pool } from 'pg'

const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'db_siite',
  password: 'aya123',
  port: 5432,
}

async function forceAddDescriptionColumn() {
  const client = new Pool(config)
  
  try {
    console.log('Tentative d\'ajout de la colonne project_description...')
    
    // D\'abord vérifier si la colonne existe
    const checkResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'devis' AND column_name = 'project_description'
    `)
    
    if (checkResult.rows.length > 0) {
      console.log('✅ La colonne project_description existe déjà')
      console.log('Type:', checkResult.rows[0].data_type)
    } else {
      console.log('❌ La colonue n\'existe pas, ajout en cours...')
      
      // Ajouter la colonne
      await client.query('ALTER TABLE devis ADD COLUMN project_description TEXT')
      console.log('✅ Colonne project_description ajoutée avec succès')
    }
    
    // Vérifier l'ajout
    const verifyResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'devis' AND column_name = 'project_description'
    `)
    
    if (verifyResult.rows.length > 0) {
      console.log('✅ Vérification réussie: La colonne project_description existe bien')
    } else {
      console.log('❌ Erreur: La colonue n\'a pas été ajoutée')
    }
    
  } catch (error: any) {
    console.error('Erreur:', error.message)
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  forceAddDescriptionColumn()
}

export default forceAddDescriptionColumn
