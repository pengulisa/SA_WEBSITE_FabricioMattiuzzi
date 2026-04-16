// =============================================
//   SISTEMA DE PEDIDOS - LANCHONETE
//   Interação via prompt/alert/confirm
// =============================================

// 1. Array de objetos - Cardápio
let produtos = [
  { nome: "X-Burguer",    preco: 15.00, categoria: "Lanche" },
  { nome: "Batata Frita", preco: 10.00, categoria: "Acompanhamento" },
  { nome: "Refrigerante", preco: 8.00,  categoria: "Bebida" },
  { nome: "Milk-shake",   preco: 12.00, categoria: "Bebida" },
  { nome: "Sorvete",      preco: 7.00,  categoria: "Sobremesa" }
];

// 2. Array de pedidos
let pedidos = [];

// =============================================
// FUNÇÃO: mostrarCardapio()
// Monta string com todos os produtos
// =============================================
function mostrarCardapio() {
  let texto = "===== CARDÁPIO =====\n\n";
  for (let i = 0; i < produtos.length; i++) {
    let p = produtos[i];
    texto += (i + 1) + " - " + p.nome + "\n";
    texto += "    Categoria: " + p.categoria + "\n";
    texto += "    Preço: R$ " + p.preco.toFixed(2) + "\n\n";
  }
  texto += "====================";
  return texto;
}

// =============================================
// FUNÇÃO: mostrarPedidos()
// Monta string com todos os pedidos
// =============================================
function mostrarPedidos() {
  if (pedidos.length === 0) {
    return "Nenhum pedido registrado ainda.";
  }

  let texto = "===== PEDIDOS =====\n\n";
  let totalGeral = 0;

  for (let i = 0; i < pedidos.length; i++) {
    let ped = pedidos[i];
    texto += "Pedido " + (i + 1) + ":\n";
    texto += "  Produto: " + ped.produto + "\n";
    texto += "  Quantidade: " + ped.quantidade + "\n";
    texto += "  Preço unitário: R$ " + ped.precoUnitario.toFixed(2) + "\n";
    texto += "  Valor total: R$ " + ped.valorTotal.toFixed(2) + "\n\n";
    totalGeral += ped.valorTotal;
  }

  texto += "-------------------\n";
  texto += "TOTAL GERAL: R$ " + totalGeral.toFixed(2) + "\n";
  texto += "===================";

  return texto;
}

// =============================================
// FUNÇÃO: adicionarPedido()
// Interage com usuário para adicionar pedido
// =============================================
function adicionarPedido() {
  // Mostra cardápio e pede escolha
  let cardapio = mostrarCardapio();
  let escolha = prompt(cardapio + "\n\nDigite o número do produto:");

  if (escolha === null) return; // Cancelou

  let indice = parseInt(escolha) - 1;

  // Valida escolha
  if (isNaN(indice) || indice < 0 || indice >= produtos.length) {
    alert("Opção inválida!");
    return;
  }

  let produto = produtos[indice];

  // Pede quantidade
  let qtdStr = prompt("Produto: " + produto.nome + "\nPreço: R$ " + produto.preco.toFixed(2) + "\n\nDigite a quantidade:");

  if (qtdStr === null) return; // Cancelou

  let quantidade = parseInt(qtdStr);

  // Valida quantidade
  if (isNaN(quantidade) || quantidade < 1) {
    alert("Quantidade inválida!");
    return;
  }

  // Calcula valor total
  let valorTotal = produto.preco * quantidade;

  // Cria o pedido
  let novoPedido = {
    produto: produto.nome,
    quantidade: quantidade,
    precoUnitario: produto.preco,
    valorTotal: valorTotal
  };

  pedidos.push(novoPedido);

  alert("✅ Pedido registrado com sucesso!\n\n" +
        quantidade + "x " + produto.nome + "\n" +
        "Total: R$ " + valorTotal.toFixed(2));
}

// =============================================
// FUNÇÃO: removerPedido()
// Remove um pedido específico
// =============================================
function removerPedido() {
  if (pedidos.length === 0) {
    alert("Não há pedidos para remover.");
    return;
  }

  let lista = mostrarPedidos();
  let escolha = prompt(lista + "\n\nDigite o número do pedido para remover:");

  if (escolha === null) return;

  let indice = parseInt(escolha) - 1;

  if (isNaN(indice) || indice < 0 || indice >= pedidos.length) {
    alert("Número de pedido inválido!");
    return;
  }

  let pedidoRemovido = pedidos[indice];
  pedidos.splice(indice, 1);

  alert("🗑️ Pedido removido:\n" +
        pedidoRemovido.quantidade + "x " + pedidoRemovido.produto);
}

// =============================================
// FUNÇÃO: menuPrincipal()
// Loop principal do sistema
// =============================================
function menuPrincipal() {
  let executando = true;

  while (executando) {
    let opcao = prompt(
      "🍔 LANCHONETE - MENU PRINCIPAL\n\n" +
      "Escolha uma opção:\n\n" +
      "1 - Ver Cardápio\n" +
      "2 - Adicionar Pedido\n" +
      "3 - Ver Pedidos\n" +
      "4 - Remover Pedido\n" +
      "5 - Sair\n\n" +
      "Digite o número da opção:"
    );

    if (opcao === null) {
      executando = false;
      break;
    }

    switch (opcao) {
      case "1":
        alert(mostrarCardapio());
        break;

      case "2":
        adicionarPedido();
        break;

      case "3":
        alert(mostrarPedidos());
        break;

      case "4":
        removerPedido();
        break;

      case "5":
        executando = false;
        alert("Obrigado por usar o sistema! 🍔");
        break;

      default:
        alert("Opção inválida! Tente novamente.");
    }
  }
}

// =============================================
//   INICIALIZAÇÃO
// =============================================

// Inicia o menu quando a página carregar
window.onload = function() {
  menuPrincipal();
};