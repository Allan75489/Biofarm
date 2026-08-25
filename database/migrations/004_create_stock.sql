-- ============================================================
-- ESTOQUE DOS PRODUTOS
-- ============================================================

CREATE TABLE IF NOT EXISTS stock (
    id             INT AUTO_INCREMENT PRIMARY KEY,

    product_id     INT NOT NULL UNIQUE,

    -- Quantidade atual
    quantity       INT NOT NULL DEFAULT 0
                   CHECK (quantity >= 0),

    -- Quantidade mínima antes de considerar estoque baixo
    min_quantity   INT NOT NULL DEFAULT 5
                   CHECK (min_quantity >= 0),

    -- Quantidade máxima permitida
    max_quantity   INT
                   CHECK (
                       max_quantity IS NULL
                       OR max_quantity >= min_quantity
                   ),

    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE,

    INDEX idx_stock_product_id (product_id),
    INDEX idx_stock_quantity (quantity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
