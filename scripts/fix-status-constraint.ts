import { Pool } from 'pg'

const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'db_siite',
  password: 'aya123',
  port: 5432,
}

async function fixStatusConstraint() {
  const client = new Pool(config)
  
  try {
    console.log('Mise à jour de la contrainte de statut pour inclure "completed"...')
    
    // Supprimer l'ancienne contrainte
    await client.query('ALTER TABLE devis DROP CONSTRAINT IF EXISTS devis_status_check')
    console.log('Ancienne contrainte supprimée')
    
    // Ajouter la nouvelle contrainte avec tous les statuts y compris "completed"
    await client.query(`
      ALTER TABLE devis 
      ADD CONSTRAINT devis_status_check 
      CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
    `)
    console.log('✅ Nouvelle contrainte ajoutée avec succès (incluant "completed")')
    
    // Vérifier la contrainte
    const result = await client.query(`
      SELECT constraint_name, check_clause 
      FROM information_schema.check_constraints 
      WHERE constraint_name = 'devis_status_check'
    `)
    
    if (result.rows.length > 0) {
      console.log('✅ Contrainte vérifiée:', result.rows[0].check_clause)
    } else {
      console.log('❌ Erreur: Contrainte non trouvée après mise à jour')
    }
    
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la contrainte:', error.message)
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  fixStatusConstraint()
}

export default fixStatusConstraint
