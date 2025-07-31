-- PostgreSQL用 履歴テーブル作成SQL
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  hand_data JSONB,
  result JSONB,
  problem JSONB,
  user_input TEXT,
  correct BOOLEAN,
  message TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
