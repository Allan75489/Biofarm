-- ============================================================
-- PRODUTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
    id            INT AUTO_INCREMENT PRIMARY KEY,

    -- Código interno do produto
    sku           VARCHAR(20) NOT NULL UNIQUE,

    -- Código de barras
    barcode       VARCHAR(50) UNIQUE,

    -- Nome do produto
    name          VARCHAR(150) NOT NULL,

    -- Descrição do produto
    description   TEXT,

    -- Fabricante
    manufacturer  VARCHAR(120),

    -- Categoria
    category_id   INT,

    -- Preço
    price         DECIMAL(10, 2) NOT NULL
                  CHECK (price >= 0),

    -- Imagem
    image_url     VARCHAR(255),

    -- Produto disponível ou não
    is_active     TINYINT(1) NOT NULL DEFAULT 1,

    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL,

    INDEX idx_products_category_id (category_id),
    INDEX idx_products_name (name),
    INDEX idx_products_sku (sku),
    INDEX idx_products_barcode (barcode),
    INDEX idx_products_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
