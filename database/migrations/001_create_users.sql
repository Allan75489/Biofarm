-- ============================================================
-- USUÁRIOS DO SISTEMA
-- Autenticação e níveis de acesso
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,

    name          VARCHAR(120) NOT NULL,

    email         VARCHAR(160) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role          VARCHAR(10) NOT NULL DEFAULT 'USER'
                  CHECK (role IN ('ADMIN', 'USER')),

    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
