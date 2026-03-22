import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function updatePackOrdersSchema() {
  try {
    console.log('Mise à jour du schéma pack_orders...');

    // Ajouter les colonnes si elles n'existent pas
    const queries = [
      `ALTER TABLE pack_orders ADD COLUMN IF NOT EXISTS is_validated BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE pack_orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))`,
      `ALTER TABLE pack_orders ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP`,
      `ALTER TABLE pack_orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP`
    ];

    for (const query of queries) {
      await pool.query(query);
      console.log('✅ Colonnes ajoutées avec succès');
    }

    // Créer les index
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pack_orders_is_validated ON pack_orders(is_validated)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_pack_orders_payment_status ON pack_orders(payment_status)');
    console.log('✅ Index créés avec succès');

    // Mettre à jour quelques commandes de test
    await pool.query(`
      UPDATE pack_orders 
      SET 
        is_validated = CASE 
          WHEN id % 3 = 0 THEN TRUE 
          ELSE FALSE 
        END,
        payment_status = CASE 
          WHEN id % 2 = 0 THEN 'paid' 
          WHEN id % 3 = 0 THEN 'failed'
          ELSE 'pending'
        END,
        validated_at = CASE 
          WHEN id % 3 = 0 THEN CURRENT_TIMESTAMP 
          ELSE NULL 
        END,
        paid_at = CASE 
          WHEN id % 2 = 0 THEN CURRENT_TIMESTAMP 
          ELSE NULL 
        END
      WHERE is_validated = FALSE OR payment_status = 'pending'
    `);

    console.log('✅ Données de test mises à jour');

    // Vérifier les résultats
    const result = await pool.query(`
      SELECT 
        id,
        pack_name,
        client_name,
        status,
        is_validated,
        payment_status,
        validated_at,
        paid_at,
        created_at
      FROM pack_orders 
      ORDER BY id DESC 
      LIMIT 5
    `);

    console.log('\n📋 Dernières commandes:');
    result.rows.forEach(order => {
      console.log(`ID ${order.id}: ${order.pack_name} - ${order.client_name}`);
      console.log(`  Status: ${order.status} | Validé: ${order.is_validated} | Paiement: ${order.payment_status}`);
      if (order.validated_at) {
        console.log(`  Validé le: ${order.validated_at}`);
      }
      if (order.paid_at) {
        console.log(`  Payé le: ${order.paid_at}`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

updatePackOrdersSchema().catch(console.error);
