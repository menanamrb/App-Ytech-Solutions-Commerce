import pool from '../lib/db'

async function cleanPackOrders() {
  try {
    console.log('Nettoyage des commandes de packs...')
    
    // Supprimer les doublons basés sur email et nom du pack
    const deleteDuplicatesQuery = `
      DELETE FROM pack_orders 
      WHERE id NOT IN (
        SELECT DISTINCT ON (client_email, pack_name) id 
        FROM pack_orders 
        ORDER BY client_email, pack_name, created_at DESC
      )
    `
    
    const result = await pool.query(deleteDuplicatesQuery)
    console.log(`Doublons supprimés: ${result.rowCount}`)
    
    // Afficher les commandes restantes
    const remainingOrders = await pool.query(`
      SELECT id, pack_name, client_name, client_email, status, created_at
      FROM pack_orders 
      ORDER BY created_at DESC
    `)
    
    console.log('\nCommandes restantes dans la base de données:')
    console.log('-------------------------------------------')
    
    if (remainingOrders.rows.length === 0) {
      console.log('Aucune commande dans la base de données')
    } else {
      remainingOrders.rows.forEach((order, index) => {
        console.log(`${index + 1}. ${order.pack_name} - ${order.client_name} (${order.client_email}) - ${order.status} - ${new Date(order.created_at).toLocaleDateString('fr-FR')}`)
      })
    }
    
    console.log(`\nTotal: ${remainingOrders.rows.length} commande(s) dans la base de données`)
    
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error)
  } finally {
    process.exit(0)
  }
}

cleanPackOrders()
