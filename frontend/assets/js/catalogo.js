/* ================================================
   CATALOGO.JS - BioSaúde | Visão ADM
   ================================================ */

'use strict';

// ── Produtos (substituir por chamada à API futuramente) ──
const PRODUCTS = [
  { id:1,  name:'Dipirona Monoidratada 1g',   category:'Analgesicos', price:8.90,   stock:142, img:'../assets/img/dipirona.png',      badge:'green'  },
  { id:2,  name:'Ibuprofeno 400mg',            category:'Analgesicos', price:12.50,  stock:87,  img:'../assets/img/ibuprofeno.png',     badge:'green'  },
  { id:3,  name:'Paracetamol 750mg',           category:'Analgesicos', price:6.90,   stock:210, img:'../assets/img/paracetamol.png',    badge:'green'  },
  { id:4,  name:'Álcool Gel 70% 500ml',        category:'Higiene',     price:14.90,  stock:56,  img:'../assets/img/alcool-gel.png',     badge:'yellow' },
  { id:5,  name:'Sabonete Antisséptico',       category:'Higiene',     price:9.90,   stock:320, img:'../assets/img/sabonete.png',       badge:'green'  },
  { id:6,  name:'Bepantol Pomada 30g',         category:'Pomadas',     price:22.90,  stock:12,  img:'../assets/img/bepantol.webp',      badge:'red'    },
  { id:7,  name:'Nebacetin Pomada 15g',        category:'Pomadas',     price:18.50,  stock:34,  img:'../assets/img/nebacetin.png',      badge:'yellow' },
  { id:8,  name:'Vitamina C 1000mg',           category:'Vitaminas',   price:29.90,  stock:95,  img:'../assets/img/vitamina-c.png',     badge:'green'  },
  { id:9,  name:'Vitamina D 2000UI',           category:'Vitaminas',   price:34.90,  stock:78,  img:'../assets/img/vitamina-d.png',     badge:'green'  },
  { id:10, name:'1 Million Parfum 100ml',      category:'Perfumaria',  price:289.90, stock:8,   img:'../assets/img/Perfumes/1million.jpg',       badge:'red'    },
  { id:11, name:'212 VIP Black EDP',           category:'Perfumaria',  price:319.90, stock:15,  img:'../assets/img/Perfumes/212vip.webp',        badge:'yellow' },
  { id:12, name:'Malbec Blue 100ml',           category:'Perfumaria',  price:129.90, stock:42,  img:'../assets/img/Perfumes/malbec-blue.jpeg',   badge:'green'  },
  { id:13, name:'Perfume Floral Feminino',     category:'Perfumaria',  price:159.90, stock:27,  img:'../assets/img/Perfumes/floral-fem.jpeg',    badge:'green'  },
  { id:14, name:'Wepink Golden EDP',           category:'Perfumaria',  price:99.90,  stock:3,   img:'../assets/img/Perfumes/wepink-golden.webp', badge:'red'    },
  { id:15, name:'Wepink Lauv Green',           category:'Perfumaria',  price:89.90,  stock:51,  img:'../assets/img/Perfumes/wepink-green.webp',  badge:'green'  },
  { id:16, name:'Wepink Red Passion',          category:'Perfumaria',  price:94.90,  stock:18,  img:'../assets/img/Perfumes/wepink-red.webp',    badge:'yellow' },
];

const BADGE_LABELS  = { green:'Em estoque', yellow:'Estoque baixo', red:'Últimas unidades' };
const BADGE_CLASSES = { green:'badge-green', yellow:'badge-yellow', red:'badge-red' };

let filtered       = [...PRODUCTS];
let activeCategory = 'Todos';
let viewMode       = 'grid';
let sortBy         = 'name';

document.addEventListener('DOMContentLoaded', () => {
  if (window.App) window.App.requireAuth();
  initCatalog();
});

function initCatalog() {
  renderProducts();

  // Filtro por categoria
  document.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.dataset.cat;
      applyFilters();
    });
  });

  // Busca
  const search = document.getElementById('catalogSearch');
  search?.addEventListener('input', window.App.debounce(applyFilters, 300));

  // Ordenação
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => {
    sortBy = sortSelect.value;
    applyFilters();
  });

  // Alternância grid / lista
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      viewMode = btn.dataset.view;
      const grid = document.getElementById('productsGrid');
      if (grid) grid.className = viewMode === 'list' ? 'products-list' : 'products-grid';
    });
  });
}

function applyFilters() {
  const query = (document.getElementById('catalogSearch')?.value || '').toLowerCase();

  filtered = PRODUCTS.filter(p => {
    const matchCat   = activeCategory === 'Todos' || p.category === activeCategory;
    const matchQuery = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'name')       return a.name.localeCompare(b.name);
    if (sortBy === 'price-asc')  return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock')      return b.stock - a.stock;
    return 0;
  });

  renderProducts();
}

function renderProducts() {
  const grid  = document.getElementById('productsGrid');
  const count = document.getElementById('resultsCount');
  if (!grid) return;

  if (count) count.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon"><i class="fas fa-search"></i></div>
        <h3 class="empty-state-title">Nenhum produto encontrado</h3>
        <p class="empty-state-desc">Tente ajustar o filtro ou a busca.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card fade-in" data-id="${p.id}">
      <div class="product-card-img">
        <div class="product-stock-badge">
          <span class="badge ${BADGE_CLASSES[p.badge]}">
            <span class="badge-dot"></span>${BADGE_LABELS[p.badge]}
          </span>
        </div>
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='../assets/img/logo.png'">
        <div class="product-card-actions">
          <button class="product-action-btn" onclick="quickView(${p.id})" data-tooltip="Ver detalhes">
            <i class="far fa-eye"></i>
          </button>
          <button class="product-action-btn" onclick="editProduct(${p.id})" data-tooltip="Editar produto">
            <i class="fas fa-pen"></i>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${window.App.Fmt.currency(p.price)}</div>
        <div class="product-stock-info">
          <i class="fas fa-box-open"></i> ${p.stock} em estoque
        </div>
      </div>
    </div>
  `).join('');
}

// Abre modal de detalhes
function quickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;
  modal.querySelector('#qvImage').src        = p.img;
  modal.querySelector('#qvName').textContent  = p.name;
  modal.querySelector('#qvCat').textContent   = p.category;
  modal.querySelector('#qvPrice').textContent = window.App.Fmt.currency(p.price);
  modal.querySelector('#qvStock').textContent = `${p.stock} unidades`;
  modal.querySelector('#qvBadge').className   = `badge ${BADGE_CLASSES[p.badge]}`;
  modal.querySelector('#qvBadge').innerHTML   = `<span class="badge-dot"></span>${BADGE_LABELS[p.badge]}`;
  window.App.Modal.open('quickViewModal');
}

// Placeholder para edição (vai integrar com a API)
function editProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (p) window.App.Toast.info('Em breve', `Edição de "${p.name}" disponível após integração com API.`);
}
