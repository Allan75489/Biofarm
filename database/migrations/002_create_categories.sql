-- ============================================================
-- CATEGORIAS DOS PRODUTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
    id         INT AUTO_INCREMENT PRIMARY KEY,

    name       VARCHAR(60) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- CATEGORIAS INICIAIS
-- ============================================================

INSERT INTO categories (name)
VALUES
    ('Analgésicos'),
    ('Antibióticos'),
    ('Antialérgicos'),
    ('Higiene'),
    ('Pomadas'),
    ('Vitaminas'),
    ('Perfumaria'),
    ('Cuidados Pessoais'),
    ('Primeiros Socorros')
ON DUPLICATE KEY UPDATE name = name;
