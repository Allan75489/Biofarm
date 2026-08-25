-- ============================================================
-- ITENS DOS PEDIDOS
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,

    -- Pedido
    order_id    INT NOT NULL,

    -- Produto
    product_id  INT NOT NULL,

    -- Quantidade comprada
    quantity    INT NOT NULL
                CHECK (quantity > 0),

    -- Preço do produto no momento da compra
    unit_price  DECIMAL(10, 2) NOT NULL
                CHECK (unit_price >= 0),

    -- Subtotal calculado automaticamente
    subtotal    DECIMAL(10, 2)
                GENERATED ALWAYS AS
                (quantity * unit_price) STORED,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT,

    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
