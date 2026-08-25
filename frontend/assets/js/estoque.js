'use strict';

/* ================================================
   ESTOQUE.JS - BioSaúde
   Integração real com a API (Express + MySQL)
   ================================================ */

/* ── Estado ── */
const state = {
  query:      '',
  status:     '',   // '' | 'estoque' | 'baixo' | 'critico'
  categoryId: '',
  page:       1,
  perPage:    6,
};

let categories = [];        // [{id, name}]

/* Mapa de status do front <-> valores aceitos pela API (stockStatus.js do backend) */
const STATUS_API = { estoque: 'EM_ESTOQUE', baixo: 'BAIXO', critico: 'CRITICO' };
const STATUS_UI  = { EM_ESTOQUE: 'estoque', BAIXO: 'baixo', CRITICO: 'critico' };

const STATUS_LABEL = {
  estoque: { label: 'Em estoque',    cls: 'badge-green',  bar: 'high'   },
  baixo:   { label: 'Estoque baixo', cls: 'badge-yellow', bar: 'medium' },
  critico: { label: 'Crítico',       cls: 'badge-red',    bar: 'low'    },
};

const CAT_BADGE_PALETTE = ['badge-blue', 'badge-green', 'badge-purple', 'badge-cyan', 'badge-yellow', 'badge-gray'];
function catBadgeClass(categoryId) {
  if (!categoryId) return 'badge-gray';
  return CAT_BADGE_PALETTE[categoryId % CAT_BADGE_PALETTE.length];
}

/* Réplica local da regra de negócio do backend (utils/stockStatus.js: <=10 crítico, <=60 baixo, senão em estoque) */
function getStatusFromQuantity(q) {
  if (q <= 10) return 'CRITICO';
  if (q <= 60) return 'BAIXO';
  return 'EM_ESTOQUE';
}

/* ── Carrega categorias do banco e popula os <select> ── */
async function loadCategories() {
  try {
    categories = await window.App.apiFetch('/categories');
    if (!categories) return;

    const filterSelect = document.getElementById('filterCategory');
    if (filterSelect) {
      filterSelect.innerHTML = '<option value="">Todas as categorias</option>' +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    const modalSelect = document.getElementById('productCategory');
    if (modalSelect) {
      modalSelect.innerHTML = '<option value="">Sem categoria</option>' +
        categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
  } catch (err) {
    window.App.Toast.error('Erro ao carregar categorias', err.message);
  }
}

/* ── Busca produtos+estoque na API (GET /api/stock já traz produto + status) ── */
let currentData = [];
let currentTotal = 0;

async function fetchStock() {
  const params = new URLSearchParams();
  if (state.query) params.set('search', state.query);
  if (state.status) params.set('status', STATUS_API[state.status]);
  if (state.categoryId) params.set('categoryId', state.categoryId);
  params.set('page', state.page);
  params.set('perPage', state.perPage);

  try {
    const result = await window.App.apiFetch(`/stock?${params.toString()}`);
    if (!result) return;
    currentData = result.data;
    currentTotal = result.total;
  } catch (err) {
    window.App.Toast.error('Erro ao carregar estoque', err.message);
    currentData = [];
    currentTotal = 0;
  }
}

async function fetchSummary() {
  try {
    const s = await window.App.apiFetch('/stock/summary');
    if (!s) return;
    const els = document.querySelectorAll('.stat-value');
    if (els[0]) els[0].textContent = s.total ?? 0;
    if (els[1]) els[1].textContent = s.em_estoque ?? 0;
    if (els[2]) els[2].textContent = s.baixo ?? 0;
    if (els[3]) els[3].textContent = s.critico ?? 0;
  } catch (err) {
    console.error('[Estoque] erro ao buscar resumo', err);
  }
}

/* ── Renderizar tabela + paginação ── */
async function render() {
  await fetchStock();

  const pages = Math.max(1, Math.ceil(currentTotal / state.perPage));
  state.page = Math.min(state.page, pages);

  const tbody = document.querySelector('#estoqueTable tbody');
  if (!tbody) return;

  if (currentData.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text-muted)">
        <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:.75rem"></i>
        Nenhum produto encontrado para os filtros selecionados.
      </td></tr>`;
  } else {
    tbody.innerHTML = currentData.map(row => {
      const statusKey = STATUS_UI[getStatusFromQuantity(row.quantity)];
      const st  = STATUS_LABEL[statusKey];
      const pct = Math.max(2, Math.min(100, Math.round((row.quantity / 320) * 100)));
      const updated = row.updated_at ? window.App.Fmt.date(row.updated_at) : '—';
      const catName = row.category_name || 'Sem categoria';

      return `
        <tr data-id="${row.product_id}">
          <td>
            <div class="table-avatar">
              <img src="${row.image_url || '../assets/img/logo.png'}" alt="${row.name}" style="width:36px;height:36px;object-fit:contain;background:rgba(255,255,255,.05);border-radius:6px;padding:4px;border:1px solid var(--border-light)" onerror="this.src='../assets/img/logo.png'">
              <div>
                <div style="font-weight:500;color:var(--text-primary)">${row.name}</div>
                <div style="font-size:11px;color:var(--text-muted)">${row.sku}</div>
              </div>
            </div>
          </td>
          <td><span class="badge ${catBadgeClass(row.category_id)}">${catName}</span></td>
          <td style="font-weight:600;color:var(--text-primary)">${window.App.Fmt.currency(row.price)}</td>
          <td>
            <div class="stock-level">
              <div class="stock-bar"><div class="stock-fill ${st.bar}" style="width:${pct}%"></div></div>
              <span class="stock-count">${row.quantity} un.</span>
            </div>
          </td>
          <td><span class="badge ${st.cls}"><span class="badge-dot"></span>${st.label}</span></td>
          <td style="color:var(--text-muted);font-size:var(--text-xs)">${updated}</td>
          <td>
            <div class="table-actions">
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Diminuir 1" onclick="adjustStock(${row.product_id}, ${row.quantity}, -1)"><i class="fas fa-minus"></i></button>
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Aumentar 1" onclick="adjustStock(${row.product_id}, ${row.quantity}, 1)"><i class="fas fa-plus"></i></button>
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Editar" onclick="editProduct(${row.product_id})"><i class="fas fa-pen"></i></button>
              <button class="btn btn-ghost btn-icon-sm" data-tooltip="Excluir" style="color:var(--error)" onclick="deleteProduct(${row.product_id}, '${row.name.replace(/'/g, "\\'")}')"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }

  const start = currentTotal === 0 ? 0 : (state.page - 1) * state.perPage + 1;
  const end   = Math.min(state.page * state.perPage, currentTotal);
  document.getElementById('paginationInfo').textContent =
    currentTotal === 0 ? 'Nenhum produto encontrado' : `Mostrando ${start}–${end} de ${currentTotal} produto${currentTotal !== 1 ? 's' : ''}`;

  renderPagination(pages);
  fetchSummary();
}

function renderPagination(pages) {
  const ctrl = document.getElementById('paginationControls');
  if (!ctrl) return;

  let btns = '';
  const prev = state.page > 1;
  const next = state.page < pages;

  btns += `<button class="page-btn" ${!prev ? 'disabled' : ''} onclick="goPage(${state.page - 1})"><i class="fas fa-chevron-left"></i></button>`;

  const visible = getPageRange(state.page, pages);
  let lastWas = 0;
  visible.forEach(n => {
    if (n - lastWas > 1) btns += `<span style="color:var(--text-muted);padding:0 4px;line-height:34px">…</span>`;
    btns += `<button class="page-btn ${n === state.page ? 'active' : ''}" onclick="goPage(${n})">${n}</button>`;
    lastWas = n;
  });

  btns += `<button class="page-btn" ${!next ? 'disabled' : ''} onclick="goPage(${state.page + 1})"><i class="fas fa-chevron-right"></i></button>`;
  ctrl.innerHTML = btns;
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  return [...pages].sort((a, b) => a - b);
}

function goPage(n) {
  state.page = n;
  render();
  document.querySelector('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Ajuste rápido +/- direto na tabela (PUT /api/stock/:productId, valor absoluto) ── */
async function adjustStock(productId, currentQty, delta) {
  const newQty = currentQty + delta;
  if (newQty < 0) return;
  try {
    await window.App.apiFetch(`/stock/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQty })
    });
    render();
  } catch (err) {
    window.App.Toast.error('Erro ao ajustar estoque', err.message);
  }
}

/* ── Criar / Editar produto ── */
function openCreateModal() {
  document.getElementById('addProductForm').reset();
  document.getElementById('productId').value = '';
  document.getElementById('productModalTitle').textContent = 'Adicionar Produto';
  window.App.Modal.open('addProductModal');
}

async function editProduct(id) {
  try {
    const product = await window.App.apiFetch(`/products/${id}`);
    if (!product) return;
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productQuantity').value = product.stock_quantity;
    document.getElementById('productCategory').value = product.category_id || '';
    document.getElementById('productSku').value = product.sku;
    document.getElementById('productModalTitle').textContent = 'Editar Produto';
    window.App.Modal.open('addProductModal');
  } catch (err) {
    window.App.Toast.error('Erro ao carregar produto', err.message);
  }
}

async function deleteProduct(id, name) {
  if (!confirm(`Excluir "${name}"?`)) return;
  try {
    await window.App.apiFetch(`/products/${id}`, { method: 'DELETE' });
    window.App.Toast.success('Produto excluído', `"${name}" foi removido do estoque.`);
    render();
  } catch (err) {
    window.App.Toast.error('Erro ao excluir produto', err.message);
  }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  if (window.App) window.App.requireAuth();

  await loadCategories();
  render();

  document.getElementById('estoqueSearch')?.addEventListener('input', window.App.debounce(e => {
    state.query = e.target.value.trim();
    state.page = 1;
    render();
  }, 300));

  document.getElementById('filterStatus')?.addEventListener('change', e => {
    state.status = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById('filterCategory')?.addEventListener('change', e => {
    state.categoryId = e.target.value;
    state.page = 1;
    render();
  });

  document.getElementById('addProductBtn')?.addEventListener('click', openCreateModal);

  document.getElementById('addProductForm')?.addEventListener('submit', async e => {
    e.preventDefault();

    const id = document.getElementById('productId').value;
    const payload = {
      name: document.getElementById('productName').value.trim(),
      price: parseFloat(document.getElementById('productPrice').value),
      sku: document.getElementById('productSku').value.trim(),
      categoryId: document.getElementById('productCategory').value || undefined,
    };

    try {
      if (id) {
        await window.App.apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        const newQty = parseInt(document.getElementById('productQuantity').value, 10);
        await window.App.apiFetch(`/stock/${id}`, { method: 'PUT', body: JSON.stringify({ quantity: newQty }) });
        window.App.Toast.success('Produto atualizado!');
      } else {
        payload.initialQuantity = parseInt(document.getElementById('productQuantity').value, 10) || 0;
        await window.App.apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
        window.App.Toast.success('Produto adicionado!', 'O produto foi cadastrado no estoque.');
      }
      window.App.Modal.close('addProductModal');
      e.target.reset();
      render();
    } catch (err) {
      window.App.Toast.error('Erro ao salvar produto', err.message);
    }
  });
});

/* ── Pedidos / Usuários / Perfil mantidos como estavam (fora do escopo desta integração) ── */

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