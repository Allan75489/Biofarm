-- ============================================================
-- PEDIDOS
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,

    -- Usuário responsável pelo pedido
    user_id         INT NOT NULL,

    -- Status do pedido
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
                    CHECK (
                        status IN (
                            'PENDENTE',
                            'EM_ANDAMENTO',
                            'CONCLUIDO',
                            'CANCELADO'
                        )
                    ),

    -- Forma de pagamento
    payment_method  VARCHAR(15)
                    CHECK (
                        payment_method IS NULL
                        OR payment_method IN (
                            'PIX',
                            'DINHEIRO',
                            'CARTAO'
                        )
                    ),

    -- Status do pagamento
    payment_status  VARCHAR(15) NOT NULL DEFAULT 'PENDENTE'
                    CHECK (
                        payment_status IN (
                            'PENDENTE',
                            'PAGO',
                            'CANCELADO'
                        )
                    ),

    -- Valor total do pedido
    total           DECIMAL(10, 2) NOT NULL DEFAULT 0
                    CHECK (total >= 0),

    -- Observações
    notes           TEXT,

    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_payment_status (payment_status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
