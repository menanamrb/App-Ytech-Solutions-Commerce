-- Création de la table des devis
CREATE TABLE IF NOT EXISTS devis (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  service VARCHAR(255) NOT NULL,
  features TEXT[],
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  project_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline DATE NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création d'un index pour accélérer les recherches
CREATE INDEX IF NOT EXISTS idx_devis_status ON devis(status);
CREATE INDEX IF NOT EXISTS idx_devis_client_name ON devis(client_name);
CREATE INDEX IF NOT EXISTS idx_devis_created_at ON devis(created_at);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_devis_updated_at 
    BEFORE UPDATE ON devis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
