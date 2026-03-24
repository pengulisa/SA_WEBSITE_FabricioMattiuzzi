// =========================
// ESTADO DA APLICAÇÃO (APPLICATION STATE)
// Variáveis globais que armazenam os dados da loja
// =========================
// ---- STATE ----
let produtos = JSON.parse(localStorage.getItem("loja_produtos") || "[]");
let vendas = JSON.parse(localStorage.getItem("loja_vendas") || "[]");
let perdas = JSON.parse(localStorage.getItem("loja_perdas") || "[]");

// =========================
// FUNÇÕES UTILITÁRIAS (UTILITY FUNCTIONS)
// Funções auxiliares para salvar dados e formatação
// =========================
function salvar() {
  localStorage.setItem("loja_produtos", JSON.stringify(produtos));
  localStorage.setItem("loja_vendas", JSON.stringify(vendas));
  localStorage.setItem("loja_perdas", JSON.stringify(perdas));
}

function fmt(v) {
  return (
    "R$ " +
    parseFloat(v || 0)
      .toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  );
}

function fmtDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pt-BR") +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

// =========================
// SISTEMA DE ABAS (TABS SYSTEM)
// Funções para alternar entre as abas da interface
// =========================
// ---- TABS ----
function showTab(name) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById("tab-" + name).classList.add("active");
  event.target.classList.add("active");
  if (name === "vendas") popularSelectProdutos();
  if (name === "historico") renderHistorico();
}

// =========================
// RESUMO (SUMMARY)
// Funções para atualizar os cards de resumo na interface
// =========================
// ---- SUMMARY ----
function atualizarResumo() {
  const totalV = vendas.reduce((a, v) => a + v.total, 0);
  const totalLucro = vendas.reduce((a, v) => a + v.lucro, 0);
  const totalP = perdas.reduce((a, p) => a + p.valor, 0);
  document.getElementById("totalVendas").textContent = fmt(totalV);
  document.getElementById("totalGanhos").textContent = fmt(totalLucro);
  document.getElementById("totalPerdas").textContent = fmt(totalP);
  document.getElementById("totalProdutos").textContent = produtos.length;
}

// =========================
// DATA E HORA (DATE AND TIME)
// Funções para atualizar a data exibida na interface
// =========================
// ---- DATE ----
function updateDate() {
  const now = new Date();
  document.getElementById("dateDisplay").textContent = now.toLocaleDateString(
    "pt-BR",
    { weekday: "short", day: "2-digit", month: "short", year: "numeric" },
  );
}

setInterval(updateDate, 60000);
updateDate();

// =========================
// GERENCIAMENTO DE PRODUTOS (PRODUCT MANAGEMENT)
// Funções para adicionar, editar, excluir e renderizar produtos
// =========================
// ---- PRODUTOS ----
function adicionarProduto() {
  const nome = document.getElementById("prodNome").value.trim();
  const cat = document.getElementById("prodCategoria").value.trim();
  const custo = parseFloat(document.getElementById("prodCusto").value) || 0;
  const venda = parseFloat(document.getElementById("prodVenda").value) || 0;
  const estoque = parseInt(document.getElementById("prodEstoque").value) || 0;

  if (!nome) {
    alert("Informe o nome do produto!");
    return;
  }

  produtos.push({
    id: Date.now(),
    nome,
    categoria: cat,
    custo,
    venda,
    estoque,
  });

  salvar();
  renderProdutos();
  atualizarResumo();

  [
    "prodNome",
    "prodCategoria",
    "prodCusto",
    "prodVenda",
    "prodEstoque",
  ].forEach((id) => (document.getElementById(id).value = ""));
}

function renderProdutos(filtro = "") {
  const tbody = document.getElementById("tabelaProdutos");
  const lista = filtro
    ? produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
          (p.categoria || "").toLowerCase().includes(filtro.toLowerCase()),
      )
    : produtos;

  if (!lista.length) {
    tbody.innerHTML =
      '<tr><td colspan="7"><div class="empty-state"><div>📦</div>Nenhum produto cadastrado ainda.</div></td></tr>';
    return;
  }

  tbody.innerHTML = lista
    .map((p) => {
      const margem =
        p.custo > 0
          ? (((p.venda - p.custo) / p.custo) * 100).toFixed(1) + "%"
          : "—";
      const margemClass = p.venda - p.custo >= 0 ? "badge-green" : "badge-red";

      return `<tr>
      <td><strong>${p.nome}</strong></td>
      <td>${p.categoria || "—"}</td>
      <td>${fmt(p.custo)}</td>
      <td>${fmt(p.venda)}</td>
      <td><span class="badge ${margemClass}">${margem}</span></td>
      <td>${p.estoque}</td>
      <td style="display:flex;gap:6px;">
        <button class="btn btn-ghost btn-sm" onclick="abrirModal(${p.id})">✏️ Editar</button>
        <button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id})">🗑</button>
      </td>
    </tr>`;
    })
    .join("");
}

function excluirProduto(id) {
  if (!confirm("Excluir este produto?")) return;
  produtos = produtos.filter((p) => p.id !== id);
  salvar();
  renderProdutos();
  atualizarResumo();
}

function abrirModal(id) {
  const p = produtos.find((x) => x.id === id);
  if (!p) return;

  document.getElementById("editId").value = id;
  document.getElementById("editNome").value = p.nome;
  document.getElementById("editCategoria").value = p.categoria || "";
  document.getElementById("editCusto").value = p.custo;
  document.getElementById("editVenda").value = p.venda;
  document.getElementById("editEstoque").value = p.estoque;
  document.getElementById("modalEdit").classList.add("open");
}

function fecharModal() {
  document.getElementById("modalEdit").classList.remove("open");
}

function salvarEdicao() {
  const id = parseInt(document.getElementById("editId").value);
  const p = produtos.find((x) => x.id === id);
  if (!p) return;

  p.nome = document.getElementById("editNome").value.trim() || p.nome;
  p.categoria = document.getElementById("editCategoria").value.trim();
  p.custo = parseFloat(document.getElementById("editCusto").value) || 0;
  p.venda = parseFloat(document.getElementById("editVenda").value) || 0;
  p.estoque = parseInt(document.getElementById("editEstoque").value) || 0;

  salvar();
  renderProdutos();
  atualizarResumo();
  fecharModal();
}

// =========================
// GERENCIAMENTO DE VENDAS (SALES MANAGEMENT)
// Funções para registrar e renderizar vendas
// =========================
// ---- VENDAS ----
function popularSelectProdutos() {
  const sel = document.getElementById("vendaProduto");
  sel.innerHTML =
    '<option value="">Selecionar...</option>' +
    produtos
      .map(
        (p) => `<option value="${p.id}">${p.nome} — ${fmt(p.venda)}</option>`,
      )
      .join("");

  sel.onchange = () => {
    const p = produtos.find((x) => x.id === parseInt(sel.value));
    if (p) document.getElementById("vendaPreco").value = p.venda;
  };
}

function registrarVenda() {
  const prodId = parseInt(document.getElementById("vendaProduto").value);
  const qtd = parseInt(document.getElementById("vendaQtd").value) || 1;
  const preco = parseFloat(document.getElementById("vendaPreco").value) || 0;
  const obs = document.getElementById("vendaObs").value.trim();
  const p = produtos.find((x) => x.id === prodId);

  if (!p) {
    alert("Selecione um produto!");
    return;
  }

  if (qtd > p.estoque) {
    alert(`Estoque insuficiente! Disponível: ${p.estoque}`);
    return;
  }

  const total = preco * qtd;
  const lucro = (preco - p.custo) * qtd;

  vendas.unshift({
    id: Date.now(),
    data: new Date().toISOString(),
    produto: p.nome,
    qtd,
    preco,
    total,
    lucro,
    obs,
  });

  p.estoque -= qtd;
  salvar();
  renderVendas();
  atualizarResumo();

  document.getElementById("vendaQtd").value = 1;
  document.getElementById("vendaObs").value = "";
}

function renderVendas() {
  const tbody = document.getElementById("tabelaVendas");
  if (!vendas.length) {
    tbody.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><div>🛒</div>Nenhuma venda registrada.</div></td></tr>';
    return;
  }

  tbody.innerHTML = vendas
    .map(
      (v) => `<tr>
    <td>${fmtDate(v.data)}</td>
    <td>${v.produto}</td>
    <td>${v.qtd}</td>
    <td>${fmt(v.preco)}</td>
    <td>${fmt(v.total)}</td>
    <td><span class="badge ${v.lucro >= 0 ? "badge-green" : "badge-red"}">${fmt(v.lucro)}</span></td>
  </tr>`,
    )
    .join("");
}

// =========================
// GERENCIAMENTO DE PERDAS (LOSSES MANAGEMENT)
// Funções para registrar e excluir perdas
// =========================
// ---- PERDAS ----
function registrarPerda() {
  const desc = document.getElementById("perdaDesc").value.trim();
  const tipo = document.getElementById("perdaTipo").value;
  const valor = parseFloat(document.getElementById("perdaValor").value) || 0;
  const obs = document.getElementById("perdaObs").value.trim();

  if (!desc) {
    alert("Informe a descrição!");
    return;
  }

  if (!valor) {
    alert("Informe o valor!");
    return;
  }

  perdas.unshift({
    id: Date.now(),
    data: new Date().toISOString(),
    desc,
    tipo,
    valor,
    obs,
  });

  salvar();
  renderPerdas();
  atualizarResumo();

  ["perdaDesc", "perdaValor", "perdaObs"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
}

function renderPerdas() {
  const tbody = document.getElementById("tabelaPerdas");
  if (!perdas.length) {
    tbody.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><div>📉</div>Nenhuma perda registrada.</div></td></tr>';
    return;
  }

  tbody.innerHTML = perdas
    .map(
      (p) => `<tr>
    <td>${fmtDate(p.data)}</td>
    <td>${p.desc}</td>
    <td><span class="badge badge-red">${p.tipo}</span></td>
    <td style="color:var(--danger)">${fmt(p.valor)}</td>
    <td>${p.obs || "—"}</td>
    <td><button class="btn btn-danger btn-sm" onclick="excluirPerda(${p.id})">🗑</button></td>
  </tr>`,
    )
    .join("");
}

function excluirPerda(id) {
  if (!confirm("Excluir esta perda?")) return;
  perdas = perdas.filter((p) => p.id !== id);
  salvar();
  renderPerdas();
  atualizarResumo();
}

// =========================
// HISTÓRICO (HISTORY)
// Funções para gerenciar o histórico de dias fechados
// =========================
// ---- HISTÓRICO ----
let historicoDias = JSON.parse(
  localStorage.getItem("loja_historico_dias") || "[]",
);

function renderHistorico() {
  const tbody = document.getElementById("tabelaHistorico");
  let rows = [];

  // Movimentações do dia atual (ainda não fechadas)
  const hoje = [
    ...vendas.map((v) => ({
      data: v.data,
      tipo: "VENDA",
      desc: `${v.qtd}x ${v.produto}`,
      valor: v.total,
      resultado: v.lucro >= 0 ? "Lucro" : "Prejuízo",
      cor: v.lucro >= 0 ? "badge-green" : "badge-red",
      diaFechado: false,
    })),
    ...perdas.map((p) => ({
      data: p.data,
      tipo: "PERDA",
      desc: p.desc,
      valor: p.valor,
      resultado: p.tipo,
      cor: "badge-red",
      diaFechado: false,
    })),
  ];

  // Movimentações de dias fechados
  historicoDias.forEach((dia) => {
    dia.vendas.forEach((v) =>
      rows.push({
        data: v.data,
        tipo: "VENDA",
        desc: `${v.qtd}x ${v.produto}`,
        valor: v.total,
        resultado: v.lucro >= 0 ? "Lucro" : "Prejuízo",
        cor: v.lucro >= 0 ? "badge-green" : "badge-red",
        diaFechado: true,
        diaData: dia.data,
      }),
    );

    dia.perdas.forEach((p) =>
      rows.push({
        data: p.data,
        tipo: "PERDA",
        desc: p.desc,
        valor: p.valor,
        resultado: p.tipo,
        cor: "badge-red",
        diaFechado: true,
        diaData: dia.data,
      }),
    );
  });

  const todos = [...hoje, ...rows].sort(
    (a, b) => new Date(b.data) - new Date(a.data),
  );

  if (!todos.length) {
    tbody.innerHTML =
      '<tr><td colspan="6"><div class="empty-state"><div>📋</div>Nenhuma movimentação registrada.</div></td></tr>';
    return;
  }

  tbody.innerHTML = todos
    .map(
      (t) => `<tr>
    <td>${fmtDate(t.data)}</td>
    <td><span class="badge ${t.tipo === "VENDA" ? "badge-yellow" : "badge-red"}">${t.tipo}</span></td>
    <td>${t.desc}</td>
    <td>${fmt(t.valor)}</td>
    <td><span class="badge ${t.cor}">${t.resultado}</span></td>
    <td>${t.diaFechado ? `<span class="badge badge-green" style="font-size:.65rem;">✔ Fechado</span>` : `<span class="badge badge-yellow" style="font-size:.65rem;">Em aberto</span>`}</td>
  </tr>`,
    )
    .join("");
}

// =========================
// EXPORTAÇÃO (EXPORT)
// Função para exportar dados em CSV
// =========================
// ---- EXPORTAR ----
function exportarCSV() {
  const rows = [["Data", "Tipo", "Descrição", "Valor", "Status"]];

  // dia atual
  vendas.forEach((v) =>
    rows.push([
      fmtDate(v.data),
      "VENDA",
      `${v.qtd}x ${v.produto}`,
      v.total.toFixed(2),
      "Em aberto",
    ]),
  );
  perdas.forEach((p) =>
    rows.push([
      fmtDate(p.data),
      "PERDA",
      p.desc,
      p.valor.toFixed(2),
      "Em aberto",
    ]),
  );

  // dias fechados
  historicoDias.forEach((dia) => {
    dia.vendas.forEach((v) =>
      rows.push([
        fmtDate(v.data),
        "VENDA",
        `${v.qtd}x ${v.produto}`,
        v.total.toFixed(2),
        "Fechado",
      ]),
    );
    dia.perdas.forEach((p) =>
      rows.push([
        fmtDate(p.data),
        "PERDA",
        p.desc,
        p.valor.toFixed(2),
        "Fechado",
      ]),
    );
  });

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  a.download = "minhaloja_historico.csv";
  a.click();
}

// =========================
// FECHAR DIA (CLOSE DAY)
// Função para fechar o dia e salvar no histórico
// =========================
// ---- FECHAR DIA ----
function fecharDia() {
  if (!vendas.length && !perdas.length) {
    alert("Nenhuma movimentação no dia para fechar.");
    return;
  }

  const totalV = vendas.reduce((a, v) => a + v.total, 0);
  const totalLucro = vendas.reduce((a, v) => a + v.lucro, 0);
  const totalP = perdas.reduce((a, p) => a + p.valor, 0);

  const msg = `📊 Resumo do dia:\n\n💰 Total em Vendas: ${fmt(totalV)}\n✅ Lucro: ${fmt(totalLucro)}\n📉 Perdas: ${fmt(totalP)}\n\nDeseja fechar o dia?\n(Tudo ficará salvo no histórico e os produtos permanecem cadastrados)`;

  if (!confirm(msg)) return;

  historicoDias.unshift({
    id: Date.now(),
    data: new Date().toISOString(),
    vendas: [...vendas],
    perdas: [...perdas],
    totalVendas: totalV,
    totalLucro,
    totalPerdas: totalP,
  });

  localStorage.setItem("loja_historico_dias", JSON.stringify(historicoDias));

  vendas = [];
  perdas = [];
  salvar();
  renderVendas();
  renderPerdas();
  renderHistorico();
  atualizarResumo();

  alert("✅ Dia fechado e salvo no histórico! Boas vendas amanhã!");
}

// =========================
// ZERAR TUDO (RESET ALL)
// Função para resetar todos os dados da aplicação
// =========================
// ---- ZERAR TUDO ----
function zerarTudo() {
  if (
    !confirm(
      "⚠️ Tem certeza que quer ZERAR TUDO?\nProdutos, vendas, perdas e histórico serão apagados permanentemente!",
    )
  )
    return;
  if (!confirm("🚨 Última confirmação! Isso não pode ser desfeito. Continuar?"))
    return;

  produtos = [];
  vendas = [];
  perdas = [];
  historicoDias = [];

  salvar();
  localStorage.setItem("loja_historico_dias", JSON.stringify([]));

  renderProdutos();
  renderVendas();
  renderPerdas();
  renderHistorico();
  atualizarResumo();

  alert("✅ Dados zerados com sucesso!");
}

// =========================
// INICIALIZAÇÃO (INITIALIZATION)
// Código executado ao carregar a página
// =========================
// ---- INIT ----
renderProdutos();
renderVendas();
renderPerdas();
atualizarResumo();

document.getElementById("modalEdit").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) fecharModal();
});
