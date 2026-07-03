/* ================================================
   ESTOQUE.JS - BioSaúde | Tabela dinâmica com
   paginação, filtros e busca reais
   ================================================ */

'use strict';

/* ── Dataset completo (substituir por API futuramente) ── */
const ESTOQUE = [
  { id:1,  sku:'SKU-001', name:'Dipirona Monoidratada 1g',   category:'Analgesicos', price:8.90,   stock:142, updated:'29/06/2025' },
  { id:2,  sku:'SKU-002', name:'Ibuprofeno 400mg',            category:'Analgesicos', price:12.50,  stock:87,  updated:'28/06/2025' },
  { id:3,  sku:'SKU-003', name:'Paracetamol 750mg',           category:'Analgesicos', price:6.90,   stock:210, updated:'27/06/2025' },
  { id:4,  sku:'SKU-004', name:'Álcool Gel 70% 500ml',        category:'Higiene',     price:14.90,  stock:56,  updated:'29/06/2025' },
  { id:5,  sku:'SKU-005', name:'Sabonete Antisséptico',       category:'Higiene',     price:9.90,   stock:320, updated:'26/06/2025' },
  { id:6,  sku:'SKU-006', name:'Bepantol Pomada 30g',         category:'Pomadas',     price:22.90,  stock:12,  updated:'27/06/2025' },
  { id:7,  sku:'SKU-007', name:'Nebacetin Pomada 15g',        category:'Pomadas',     price:18.50,  stock:34,  updated:'25/06/2025' },
  { id:8,  sku:'SKU-008', name:'Vitamina C 1000mg',           category:'Vitaminas',   price:29.90,  stock:95,  updated:'26/06/2025' },
  { id:9,  sku:'SKU-009', name:'Vitamina D 2000UI',           category:'Vitaminas',   price:34.90,  stock:78,  updated:'24/06/2025' },
  { id:10, sku:'SKU-010', name:'1 Million Parfum 100ml',      category:'Perfumaria',  price:289.90, stock:8,   updated:'25/06/2025' },
  { id:11, sku:'SKU-011', name:'212 VIP Black EDP',           category:'Perfumaria',  price:319.90, stock:15,  updated:'23/06/2025' },
  { id:12, sku:'SKU-012', name:'Malbec Blue 100ml',           category:'Perfumaria',  price:129.90, stock:42,  updated:'22/06/2025' },
  { id:13, sku:'SKU-013', name:'Perfume Floral Feminino',     category:'Perfumaria',  price:159.90, stock:27,  updated:'21/06/2025' },
  { id:14, sku:'SKU-014', name:'Wepink Golden EDP',           category:'Perfumaria',  price:99.90,  stock:3,   updated:'20/06/2025' },
  { id:15, sku:'SKU-015', name:'Wepink Lauv Green',           category:'Perfumaria',  price:89.90,  stock:51,  updated:'19/06/2025' },
  { id:16, sku:'SKU-016', name:'Wepink Red Passion',          category:'Perfumaria',  price:94.90,  stock:18,  updated:'18/06/2025' },
];

/* ── Imagens por id ── */
const IMGS = {
  1:'dipirona.png', 2:'ibuprofeno.png', 3:'paracetamol.png',
  4:'alcool-gel.png', 5:'sabonete.png', 6:'bepantol.webp',
  7:'nebacetin.png', 8:'vitamina-c.png', 9:'vitamina-d.png',
  10:'1million.jpg', 11:'212vip.webp', 12:'malbec-blue.jpeg',
  13:'floral-fem.jpeg', 14:'wepink-golden.webp', 15:'wepink-green.webp', 16:'wepink-red.webp'
};

/* ── Cores dos badges de categoria ── */
const CAT_BADGE = {
  Analgesicos:'badge-blue', Higiene:'badge-green',
  Pomadas:'badge-purple',   Vitaminas:'badge-cyan', Perfumaria:'badge-yellow'
};

/* ── Estado da tabela ── */
const state = {
  query:    '',
  status:   '',   // '' | 'estoque' | 'baixo' | 'critico'
  category: '',
  page:     1,
  perPage:  6,
};

/* ── Classificar status por quantidade ── */
function getStatus(stock) {
  if (stock <= 10)  return { key:'critico',  label:'Crítico',       cls:'badge-red',    bar:'low',    pct: Math.max(2, Math.round(stock/320*100)) };
  if (stock <= 60)  return { key:'baixo',    label:'Estoque baixo', cls:'badge-yellow', bar:'medium', pct: Math.round(stock/320*100) };
  return               { key:'estoque',  label:'Em estoque',    cls:'badge-green',  bar:'high',   pct: Math.round(stock/320*100) };
}

/* ── Filtrar dataset ── */
function filtered() {
  return ESTOQUE.filter(p => {
    const s = getStatus(p.stock);
    const matchQ   = !state.query    || p.name.toLowerCase().includes(state.query) || p.sku.toLowerCase().includes(state.query);
    const matchS   = !state.status   || s.key === state.status;
    const matchCat = !state.category || p.category === state.category;
    return matchQ && matchS && matchCat;
  });
}

/* ── Renderizar tabela + paginação ── */
function render() {
  const data     = filtered();
  const total    = data.length;
  const pages    = Math.max(1, Math.ceil(total / state.perPage));
  state.page     = Math.min(state.page, pages);
  const start    = (state.page - 1) * state.perPage;
  const pageData = data.slice(start, start + state.perPage);

  /* tbody */
  const tbody = document.querySelector('#estoqueTable tbody');
  if (!tbody) return;

  if (pageData.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted)">
        <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:.75rem"></i>
        Nenhum produto encontrado para os filtros selecionados.
      </td></tr>`;
  } else {
    tbody.innerHTML = pageData.map(p => {
      const st  = getStatus(p.stock);
      const img = `../assets/img/${IMGS[p.id] || 'logo.png'}`;
      const cat = p.category === 'Analgesicos' ? 'Analgésicos' : p.category;
      return `
        <tr data-id="${p.id}">
          <td>
            <div class="table-avatar">
              <img src="${img}" alt="${p.name}" style="width:36px;height:36px;object-fit:contain;background:rgba(255,255,255,.05);border-radius:6px;padding:4px;border:1px solid var(--border-light)" onerror="this.src='../assets/img/logo.png'">
              <div>
                <div style="font-weight:500;color:var(--text-primary)">${p.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${p.sku}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${CAT_BADGE[p.category] || 'badge-gray'}">${cat}</span></td>
          <td style="font-weight:600;color:var(--text-primary)">R$ ${p.price.toFixed(2).replace('.',',')}</td>
          <td>
            <div class="stock-level">
              <div class="stock-bar"><div class="stock-fill ${st.bar}" style="width:${st.pct}%"></div></div>
              <span class="stock-count">${p.stock} un.</span>
            </div>
          </td>
          <td><span class="badge ${st.cls}"><span class="badge-dot"></span>${st.label}</span></td>
          <td style="color:var(--text-muted);font-size:var(--text-xs)">${p.updated}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Editar" onclick="editProduct(${p.id})"><i class="fas fa-pen"></i></button>
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Excluir" style="color:var(--error)" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  /* info e paginação */
  const endIdx = Math.min(start + state.perPage, total);
  document.getElementById('paginationInfo').textContent =
    total === 0
      ? 'Nenhum produto encontrado'
      : `Mostrando ${start + 1}–${endIdx} de ${total} produto${total !== 1 ? 's' : ''}`;

  renderPagination(pages);
  updateStats();
}

/* ── Renderizar controles de paginação ── */
function renderPagination(pages) {
  const ctrl = document.getElementById('paginationControls');
  if (!ctrl) return;

  // Gera janela de páginas: prev, [1 ... p-1 p p+1 ... N], next
  let btns = '';

  const prev = state.page > 1;
  const next = state.page < pages;

  btns += `<button class="page-btn" ${!prev ? 'disabled' : ''} onclick="goPage(${state.page - 1})">
    <i class="fas fa-chevron-left"></i></button>`;

  // Páginas visíveis
  const visible = getPageRange(state.page, pages);
  let lastWas = 0;
  visible.forEach(n => {
    if (n - lastWas > 1) btns += `<span style="color:var(--text-muted);padding:0 4px;line-height:34px">…</span>`;
    btns += `<button class="page-btn ${n === state.page ? 'active' : ''}" onclick="goPage(${n})">${n}</button>`;
    lastWas = n;
  });

  btns += `<button class="page-btn" ${!next ? 'disabled' : ''} onclick="goPage(${state.page + 1})">
    <i class="fas fa-chevron-right"></i></button>`;

  ctrl.innerHTML = btns;
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  return [...pages].sort((a, b) => a - b);
}

/* ── Atualizar cards de resumo ── */
function updateStats() {
  const em     = ESTOQUE.filter(p => getStatus(p.stock).key === 'estoque').length;
  const baixo  = ESTOQUE.filter(p => getStatus(p.stock).key === 'baixo').length;
  const critico= ESTOQUE.filter(p => getStatus(p.stock).key === 'critico').length;
  const els = document.querySelectorAll('.stat-value');
  if (els[0]) els[0].textContent = ESTOQUE.length;
  if (els[1]) els[1].textContent = em;
  if (els[2]) els[2].textContent = baixo;
  if (els[3]) els[3].textContent = critico;
}

/* ── Navegar para página ── */
function goPage(n) {
  state.page = n;
  render();
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Editar produto ── */
function editProduct(id) {
  const p = ESTOQUE.find(x => x.id === id);
  if (!p) return;
  window.App.Toast.info('Em breve', `Edição de "${p.name}" disponível após integração com API.`);
}

/* ── Excluir produto ── */
function deleteProduct(id) {
  const p = ESTOQUE.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Excluir "${p.name}"?`)) return;
  const idx = ESTOQUE.findIndex(x => x.id === id);
  if (idx > -1) ESTOQUE.splice(idx, 1);
  render();
  window.App.Toast.success('Produto excluído', `"${p.name}" foi removido do estoque.`);
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.App) window.App.requireAuth();

  /* busca */
  document.getElementById('estoqueSearch')?.addEventListener('input', window.App.debounce(e => {
    state.query = e.target.value.toLowerCase().trim();
    state.page  = 1;
    render();
  }, 250));

  /* filtro status */
  document.getElementById('filterStatus')?.addEventListener('change', e => {
    state.status = e.target.value;
    state.page   = 1;
    render();
  });

  /* filtro categoria */
  document.getElementById('filterCategory')?.addEventListener('change', e => {
    state.category = e.target.value;
    state.page     = 1;
    render();
  });

  /* adicionar produto */
  document.getElementById('addProductBtn')?.addEventListener('click', () => {
    window.App.Modal.open('addProductModal');
  });

  document.getElementById('addProductForm')?.addEventListener('submit', e => {
    e.preventDefault();
    window.App.Toast.success('Produto adicionado!', 'O produto foi cadastrado no estoque.');
    window.App.Modal.close('addProductModal');
    e.target.reset();
  });

  render();
});

/* ── Pedidos / Usuários / Perfil mantidos abaixo ── */

function initPedidos() {
  document.getElementById('pedidosSearch')?.addEventListener('input', window.App.debounce(e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#pedidosTable tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 250));
  document.querySelectorAll('[data-action="view-pedido"]').forEach(btn => {
    btn.addEventListener('click', () => window.App.Modal.open('pedidoModal'));
  });
}

function initUsuarios() {
  document.getElementById('usuariosSearch')?.addEventListener('input', window.App.debounce(e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('#usuariosTable tbody tr').forEach(row => {
      row.style.display = !q || row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }, 250));
  document.getElementById('addUserBtn')?.addEventListener('click', () => window.App.Modal.open('addUserModal'));
  document.querySelectorAll('[data-action="delete-user"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Excluir usuário?')) { btn.closest('tr').remove(); window.App.Toast.success('Usuário excluído.'); }
    });
  });
  document.getElementById('addUserForm')?.addEventListener('submit', e => {
    e.preventDefault();
    window.App.Toast.success('Usuário criado!');
    window.App.Modal.close('addUserModal');
    e.target.reset();
  });
}

function initPerfil() {
  const user = window.App?.Auth.getUser();
  if (user) {
    const nameEl   = document.getElementById('perfilNome');
    const emailEl  = document.getElementById('perfilEmail');
    const avatarEl = document.querySelector('.profile-avatar');
    if (nameEl)   nameEl.value = user.nome || '';
    if (emailEl)  emailEl.value = user.email || '';
    if (avatarEl) avatarEl.textContent = (user.nome || 'U')[0].toUpperCase();
    document.querySelectorAll('.profile-name-display').forEach(el => el.textContent = user.nome || '');
    document.querySelectorAll('.profile-role-display').forEach(el => el.textContent = 'ADM');
  }
  document.getElementById('perfilForm')?.addEventListener('submit', e => {
    e.preventDefault();
    window.App.Toast.success('Perfil atualizado!', 'Suas informações foram salvas.');
  });
  document.getElementById('newPassword')?.addEventListener('input', e => {
    const val = e.target.value;
    const bar = document.getElementById('strengthBar');
    const lbl = document.getElementById('strengthLabel');
    if (!bar || !lbl) return;
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    bar.className = 'strength-fill ' + (['','weak','fair','good','strong'][s] || '');
    lbl.textContent = ['','Fraca','Regular','Boa','Forte'][s] || '';
  });
  document.getElementById('senhaForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const np = document.getElementById('newPassword')?.value;
    const cp = document.getElementById('confirmPassword')?.value;
    if (np !== cp) { window.App.Toast.error('Senhas não coincidem'); return; }
    window.App.Toast.success('Senha alterada!');
    e.target.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPedidos();
  initUsuarios();
  initPerfil();
});
