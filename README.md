# 💊 BioSaúde - Frontend

Este diretório contém toda a estrutura do **frontend** da aplicação BioSaúde, responsável pela interface do usuário e interações no navegador.

---

## 📁 Estrutura de Pastas

```
frontend/
│
├── assets/            # Imagens utilizadas no projeto (produtos, perfumaria, etc.)
│
├── css/               # Arquivos de estilização
│   ├── home.css
│   ├── Medicamentos.css
│   ├── Ofertas.css
│   └── Perfumaria.css
│
├── icons/             # Ícones e imagens auxiliares
│   └── img/
│
├── js/                # Scripts JavaScript
│   ├── Home.js
│   ├── Medicamentos.js
│   ├── Ofertas.js
│   └── Perfumaria.js
│
├── pages/             # Páginas HTML do sistema
│   ├── Home.html
│   ├── Medicamentos.html
│   ├── Ofertas.html
│   └── Perfumaria.html
│
└── README.md          # Documentação do frontend
```

---

## 🚀 Funcionalidades Implementadas

### 🏠 Home

* Navegação entre páginas
* Scroll suave
* Destaque de produtos
* Integração com sistema de carrinho

---

### 💊 Medicamentos

* 🔎 Busca dinâmica por nome
* 🧩 Filtro por categoria:

  * Analgésicos
  * Vitaminas
  * Pomadas
  * Higiene
* ❤️ Sistema de favoritos
* 🛒 Adição ao carrinho

---

### 🔥 Ofertas

* 🔎 Busca de produtos em promoção
* 💸 Exibição de preço original e com desconto
* 🛒 Adição ao carrinho

---

### 💄 Perfumaria

* Listagem de produtos
* 🛒 Adição ao carrinho
* ✨ Animações nos cards

---

## 🛒 Sistema de Carrinho

O projeto utiliza o **localStorage** para armazenar os produtos adicionados ao carrinho.

### 📦 Estrutura do produto:

```json
{
  "nome": "Produto",
  "preco": "R$ 00,00"
}
```

### ✅ Funcionalidades:

* Persistência de dados no navegador
* Compartilhado entre todas as páginas
* Adição de produtos via botão "Comprar"

---

## 🎨 Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* LocalStorage (Web API)

---

## 🧠 Organização do Código

O projeto segue uma separação clara de responsabilidades:

* **HTML** → Estrutura
* **CSS** → Estilização
* **JavaScript** → Lógica e interatividade

Cada página possui seu próprio arquivo JS para manter o código organizado e escalável.

---

## ⚡ Como Executar o Projeto

1. Abra o projeto no VS Code
2. Navegue até a pasta `pages`
3. Abra o arquivo `Home.html`
4. Utilize uma extensão como **Live Server** para rodar o projeto

---

## 🔮 Melhorias Futuras

* 🛒 Página de carrinho completa
* ❌ Remoção de produtos do carrinho
* 💰 Cálculo do total da compra
* 🔐 Sistema de login/cadastro
* 🌐 Integração com backend (Node.js)
* 📦 Banco de dados

---

## 👨‍💻 Autor

Projeto desenvolvido por Allan Gustavo como prática de desenvolvimento frontend e simulação de e-commerce.

---

## 📌 Status do Projeto

🚧 Em desenvolvimento
✅ Frontend funcional
🔜 Evoluindo para aplicação completa
