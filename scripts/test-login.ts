import bcrypt from 'bcryptjs';
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

async function testLogin() {
  try {
    const email = 'admin@techcommerce.com';
    const password = 'Admin@tech';

    console.log('Test de connexion...');
    console.log(`Email: ${email}`);
    console.log(`Mot de passe: ${password}`);

    // Récupérer l'utilisateur
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    const user = result.rows[0];
    console.log(`✅ Utilisateur trouvé: ${user.name} (ID: ${user.id})`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔐 Rôle: ${user.role}`);
    console.log(`🔑 Has password: ${user.password_hash ? 'Yes' : 'No'}`);

    // Vérifier le mot de passe
    if (!user.password_hash) {
      console.log('❌ Aucun mot de passe hashé trouvé');
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (isPasswordValid) {
      console.log('✅ MOT DE PASSE VALIDE !');
      console.log('La connexion devrait fonctionner.');
    } else {
      console.log('❌ MOT DE PASSE INVALIDE !');
      console.log('Le mot de passe ne correspond pas.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
}

testLogin().catch(console.error);
