-- Création de la table des commandes de packs
CREATE TABLE IF NOT EXISTS pack_orders (
  id SERIAL PRIMARY KEY,
  pack_id INTEGER REFERENCES packs(id) ON DELETE CASCADE,
  pack_name VARCHAR(255) NOT NULL,
  pack_price DECIMAL(10,2) NOT NULL,
  pack_features TEXT[],
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(50),
  client_company VARCHAR(255),
  client_city VARCHAR(255),
  project_description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  is_validated BOOLEAN DEFAULT FALSE,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  validated_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création d'index
CREATE INDEX IF NOT EXISTS idx_pack_orders_status ON pack_orders(status);
CREATE INDEX IF NOT EXISTS idx_pack_orders_client_email ON pack_orders(client_email);
CREATE INDEX IF NOT EXISTS idx_pack_orders_pack_id ON pack_orders(pack_id);
CREATE INDEX IF NOT EXISTS idx_pack_orders_created_at ON pack_orders(created_at);

-- Insertion de données de test (optionnel)
-- INSERT INTO pack_orders (pack_id, pack_name, pack_price, pack_features, client_name, client_email, client_phone, client_company, client_city, project_description)
-- VALUES (1, 'Business', 24900.00, ARRAY['Design sur mesure', 'CMS intégré', 'SEO optimisé'], 'Jean Dupont', 'jean.dupont@email.com', '+212 6 12 34 56', 'Entreprise SAS', 'Casablanca', 'Test commande');
