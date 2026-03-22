import { Pool } from 'pg'

const config = {
  user: 'ayajob',
  host: 'localhost',
  database: 'db_siite',
  password: 'aya123',
  port: 5432,
}

async function updateStatusConstraint() {
  const client = new Pool(config)
  
  try {
    // Supprimer l'ancienne contrainte si elle existe
    await client.query('ALTER TABLE devis DROP CONSTRAINT IF EXISTS devis_status_check')
    console.log('Ancienne contrainte supprimée')
    
    // Ajouter la nouvelle contrainte avec 'completed'
    await client.query('ALTER TABLE devis ADD CONSTRAINT devis_status_check CHECK (status IN (\'pending\', \'accepted\', \'rejected\', \'completed\'))')
    console.log('Nouvelle contrainte ajoutée avec succès')
    
  } catch (error: any) {
    if (error.code === '42710') { // La contrainte n'existe pas
      console.log('La contrainte n\'existe pas, création directe...')
      await client.query('ALTER TABLE devis ADD CONSTRAINT devis_status_check CHECK (status IN (\'pending\', \'accepted\', \'rejected\', \'completed\'))')
      console.log('Contrainte créée avec succès')
    } else {
      console.error('Erreur:', error)
    }
  } finally {
    await client.end()
  }
}

if (require.main === module) {
  updateStatusConstraint()
}

export default updateStatusConstraint
