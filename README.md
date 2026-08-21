# 💊 BioSaúde

Sistema web para gestão de uma farmácia/loja de produtos de saúde, com login, dashboard, controle de estoque, catálogo de produtos, pedidos e gerenciamento de usuários.

## 📁 Estrutura

```
frontend/
├── assets/
│   ├── css/        # Estilos (global, sidebar, dashboard, estoque, catálogo, login...)
│   ├── img/         # Imagens dos produtos
│   └── js/          # Lógica de cada página
├── components/
│   └── sidebar.html # Menu lateral reutilizável
├── pages/
│   ├── login.html
│   ├── dashboard.html
│   ├── estoque.html
│   ├── catalogo.html
│   ├── pedidos.html
│   ├── perfil.html
│   └── usuarios.html
└── index.html        # Redireciona para a tela de login
```

## 🚀 Funcionalidades

- **Login** — autenticação de acesso ao sistema
- **Dashboard** — visão geral com indicadores do negócio
- **Estoque** — controle de produtos e quantidades disponíveis
- **Catálogo** — listagem e organização dos produtos à venda
- **Pedidos** — acompanhamento dos pedidos realizados
- **Usuários** — gerenciamento de contas do sistema
- **Perfil** — dados da conta do usuário logado

## 🎨 Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla JS)

## ⚡ Como executar

1. Abra a pasta do projeto no VS Code (ou editor de preferência)
2. Abra o arquivo `frontend/index.html`
3. Utilize uma extensão como **Live Server** para rodar o projeto no navegador

## 🔮 Próximos passos

- Integração com backend e banco de dados
- Autenticação real de usuários
- Persistência de estoque e pedidos em servidor

## 👨‍💻 Autor

Projeto desenvolvido por **Allan Gustavo**.

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
