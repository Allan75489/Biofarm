export const listarProdutos = (req, res) => {
    res.json([{ id: 1, nome: "Produto teste" }]);
};

export const criarProduto = (req, res) => {
    res.json({ mensagem: "Produto criado com sucesso" });
};