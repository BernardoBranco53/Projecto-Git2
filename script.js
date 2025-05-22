// Expansão do submenu
document.querySelectorAll('.expandir-btn').forEach(function (btn) {
  btn.addEventListener('click', function (event) {
    event.preventDefault(); // Evita abrir várias de uma vez
    btn.parentElement.classList.toggle('active'); // Alterna o submenu clicado
  });
});
const listaCompras = document.getElementById('lista-compras');

// Impede que o clique dentro da lista feche a lista
listaCompras.addEventListener('click', (event) => {
  event.stopPropagation();
});
// Seleciona o elemento nav.menu
const menu = document.querySelector('nav.menu');

// Função para verificar a posição do menu
function verificarPosicaoMenu() {
  if (window.scrollY > 0) {
    menu.classList.add('fixo'); // Adiciona a classe fixo
  } else {
    menu.classList.remove('fixo'); // Remove a classe fixo
  }
}


// Seleciona os botões e os formulários
const botaoCadastro = document.querySelector('.botao-cadastre-se');
const botaoLogin = document.querySelector('.botao-i-sessao');
const formularioCadastro = document.getElementById('formulario-cadastro');
const formularioLogin = document.getElementById('formulario-login');
const fecharCadastro = document.getElementById('fechar-cadastro');
const fecharLogin = document.getElementById('fechar-login');

// Abrir o formulário de cadastro
botaoCadastro.addEventListener('click', () => {
  formularioCadastro.style.display = 'block';
  if (formularioLogin.style.display === 'block') {
    formularioLogin.style.display = 'none';
  }  
  fundoEscuro.style.display = 'block'; // Exibe o fundo escuro 
});

// Fechar o formulário de cadastro
fecharCadastro.addEventListener('click', () => {
  formularioCadastro.style.display = 'none';
});

// Abrir o formulário de login
botaoLogin.addEventListener('click', () => {
  formularioLogin.style.display = 'block';
  if (formularioCadastro.style.display === 'block') {
    formularioCadastro.style.display = 'none';
  }
  fundoEscuro.style.display = 'block'; // Exibe o fundo escuro 
});

// Fechar o formulário de login
fecharLogin.addEventListener('click', () => {
  formularioLogin.style.display = 'none';
});

// Impedir o envio padrão dos formulários (apenas para teste)
document.getElementById('form-cadastro').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Usuário cadastrado com sucesso!');
  formularioCadastro.style.display = 'none';
});

document.getElementById('form-login').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Login realizado com sucesso!');
  formularioLogin.style.display = 'none';
});

document.getElementById('form-cadastro').addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Coleta os dados do formulário
  const nome = document.getElementById('cadastro-nome').value;
  const email = document.getElementById('cadastro-email').value;
  const senha = document.getElementById('cadastro-senha').value;
  const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value;
  const pais = document.getElementById('cadastro-pais').value;
  const morada = document.getElementById('cadastro-morada').value;
  const localizacao = document.getElementById('cadastro-localizacao').value;
  const telemovel = document.getElementById('cadastro-telemovel').value;
  const dataNascimento = document.getElementById('cadastro-data-nascimento').value;
  const genero = document.getElementById('cadastro-genero').value;

  // Validações básicas
  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem. Por favor, verifique.');
    return;
  }

  // Envia os dados para o backend
  try {
    const resposta = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        email,
        senha,
        pais,
        morada,
        localizacao,
        telemovel,
        data_nascimento: dataNascimento,
        genero,
      }),
    });

    if (resposta.ok) {
      const dados = await resposta.json();
      alert(dados.message);
      document.getElementById('form-cadastro').reset(); // Limpa o formulário
      document.getElementById('formulario-cadastro').style.display = 'none'; // Fecha o formulário
    } else {
      const erro = await resposta.json();
      alert(`Erro: ${erro.error}`);
    }
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
    alert('Erro ao enviar os dados. Tente novamente.');
  }
});

// Seleciona o formulário e os campos de senha

const senhaInput = document.getElementById('cadastro-senha');
const confirmarSenhaInput = document.getElementById('cadastro-confirmar-senha');

// Adiciona um evento de validação ao enviar o formulário
formularioCadastro.addEventListener('submit', (event) => {
  // Verifica se as senhas são iguais
  if (senhaInput.value !== confirmarSenhaInput.value) {
    event.preventDefault(); // Impede o envio do formulário
    alert('As senhas não coincidem. Por favor, verifique.');
    confirmarSenhaInput.focus(); // Foca no campo de confirmar senha
    return;
  }

  // Se as senhas forem iguais, o formulário será enviado
  alert('Usuário cadastrado com sucesso!');
});

document.getElementById('form-login').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (resposta.ok) {
      const dados = await resposta.json();
      localStorage.setItem('token', dados.token); // Salva o token no Local Storage
      localStorage.setItem('tipoUsuario', dados.tipo); // Salva o tipo de usuário (admin ou normal)
      alert(dados.message);

      // Atualiza o site com base no tipo de usuário
      atualizarInterfaceUsuario(dados.tipo);

      // Fecha o formulário de login
      document.getElementById('formulario-login').style.display = 'none';
    } else {
      const erro = await resposta.json();
      alert(`Erro: ${erro.error}`);
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente.');
  }
});
window.onload = () => {
  carregarCategorias();
  carregarProdutos();

  const tipoUsuario = localStorage.getItem('tipoUsuario');
  if (tipoUsuario) {
    atualizarInterfaceUsuario(tipoUsuario);
  }
};
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token'); // Remove o token
  localStorage.removeItem('tipoUsuario'); // Remove o tipo de usuário
  alert('Você saiu da conta.');
  location.reload(); // Recarrega a página
});
function atualizarInterfaceUsuario(tipoUsuario) {
  const menuAdmin = document.getElementById('menu-admin'); // Elementos exclusivos do admin
  const btnAdicionarProduto = document.getElementById('btn-abrir-formulario'); // Botão para adicionar produtos

  if (tipoUsuario === 'admin') {
    // Exibe elementos do admin
    if (menuAdmin) menuAdmin.style.display = 'block';
    if (btnAdicionarProduto) btnAdicionarProduto.style.display = 'block';
  } else {
    // Oculta elementos do admin
    if (menuAdmin) menuAdmin.style.display = 'none';
    if (btnAdicionarProduto) btnAdicionarProduto.style.display = 'none';
  }
}
// Controle do menu lateral
let menuToggle = document.querySelector('#menu-toggle');
let menuContainer = document.querySelector('.menu-lateral');
let opcoesMenu = document.querySelector('#opcoes-menu');
let menuLateral2 = document.querySelector('#menu-lateral-2');
menuLateral2.style.display = 'none';

if (menuToggle) {
  menuToggle.addEventListener('change', function () {
    if (menuToggle.checked) {
      menuContainer.style.display = 'block';
      menuContainer.style.right = '0px';

      setTimeout(() => {
        opcoesMenu.style.top = '0px';
        opcoesMenu.style.opacity = '1';
        menuLateral2.style.display = 'block';
      }, 320);
    } else {
      menuContainer.style.right = '-350px';
      opcoesMenu.style.opacity = '0';
      opcoesMenu.style.top = '600px';
      menuLateral2.style.display = 'none';
    }
  });
}

// Função para adicionar produto à lista de compras
function adicionarLista(botao) {
  const produto = botao.closest('.produto');
  const nomeProduto = produto.querySelector('h3').textContent;
  const precoProduto = produto.querySelector('p').textContent.replace('Preço: KZ ', '');
  const imagemSrc = produto.querySelector('img').src;
  const lista = document.getElementById('lista-compras');

  const itensLista = lista.querySelectorAll('.item-lista');
  let produtoExistente = null;

  itensLista.forEach((item) => {
    const nomeExistente = item.querySelector('.nome-produto').textContent;
    if (nomeExistente === nomeProduto) {
      produtoExistente = item;
    }
  });

  if (produtoExistente) {
    const quantidadeSpan = produtoExistente.querySelector('.quantidade-produto');
    let quantidadeAtual = parseInt(quantidadeSpan.textContent);
    quantidadeAtual += 1;
    quantidadeSpan.textContent = quantidadeAtual;
  } else {
    const item = document.createElement('div');
    item.classList.add('item-lista');
    item.innerHTML = `
      <img src="${imagemSrc}" alt="${nomeProduto}" class="imagem-produto">
      <div class="info-produto">
        <span class="nome-produto">${nomeProduto}</span>
        <span class="quantidade-produto">1</span>
        <div class="preco-produto">KZ ${precoProduto}</div>
      </div>
      <button class="remover-item" onclick="removerItem(this)">X</button>
    `;
    lista.appendChild(item);
  }

  const nadaNoCarrinho = document.getElementById('nadaNoCarrinho');
  if (nadaNoCarrinho) {
    nadaNoCarrinho.style.display = 'none';
  }

  atualizarTotal(); // Atualiza o total
}
// Função para remover item da lista de compras
function removerItem(botao) {
  const item = botao.closest('.item-lista');
  item.remove();

  // Atualiza o total
  atualizarTotal();

  // Exibe a mensagem "Nenhum item no carrinho" se a lista estiver vazia
  const lista = document.getElementById('lista-compras');
  const nadaNoCarrinho = document.getElementById('nadaNoCarrinho');
  if (lista.querySelectorAll('.item-lista').length === 0) {
    nadaNoCarrinho.style.display = 'block';
  }
}
// Função para exibir ou ocultar a lista de compras
function exibirListaProdutos() {
  const listaCompras = document.getElementById('lista-compras');
  const menuLateral = document.querySelector('.menu-lateral');
  const menuToggle = document.querySelector('#menu-toggle');

  // Verifica se a lista de compras está aberta
  if (listaCompras.style.width === '300px') {
    // Fecha a lista de compras
    listaCompras.style.width = '0';
    listaCompras.style.opacity = '0';
  } else {
    // Fecha o menu lateral, se estiver aberto
    menuLateral.style.right = '-350px';
        menuToggle.checked = false; // Desmarca o checkbox


    // Abre a lista de compras
    listaCompras.style.width = '300px';
    listaCompras.style.opacity = '1';
  }
}

// Botão para abrir o formulário
const btnAbrirFormulario = document.getElementById('btn-abrir-formulario');
// Fundo escuro
const fundoEscuro = document.getElementById('fundo-escuro');
// Formulário
const formularioProduto = document.getElementById('formulario-produto');

// Abrir o formulário
btnAbrirFormulario.addEventListener('click', () => {
  fundoEscuro.style.display = 'block'; // Exibe o fundo escuro
  formularioProduto.style.display = 'block'; // Exibe o formulário
});

// Fechar o formulário ao clicar no fundo escuro
fundoEscuro.addEventListener('click', () => {
  fundoEscuro.style.display = 'none'; // Esconde o fundo escuro
  formularioProduto.style.display = 'none'; // Esconde o formulário
  formularioLogin.style.display = 'none'; // Esconde o formulário de login
  formularioCadastro.style.display = 'none'; // Esconde o formulário de cadastro

});

// Carregar produtos do backend
async function carregarProdutos() {
  try {
    const resposta = await fetch('http://localhost:3000/produtos');
    const produtos = await resposta.json();

    const container = document.getElementById('conteudo-produtos');
    container.innerHTML = ''; // Limpa os produtos existentes

    produtos.forEach((produto) => {
      const preco = parseFloat(produto.preco); // Converte o preço para número
      const produtoHTML = `
        <div class="produto">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>Preço: KZ ${preco.toFixed(2)}</p>
         
          <button onclick="adicionarLista(this)">Adicionar</button>
        </div>
      `;
      container.innerHTML += produtoHTML;
    });
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}
// Função para carregar categorias
// Definir a variável selectCategoria
const selectCategoria = document.getElementById('produto-categoria');
async function carregarCategorias() {
  try {
    const resposta = await fetch('http://localhost:3000/categorias');
    if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
    const categorias = await resposta.json();

    // Atualizar o menu lateral
    const opcoesMenu = document.getElementById('opcoes-menu');
    opcoesMenu.innerHTML = ''; // Limpa as opções existentes

    // Limpar e atualizar o select de categorias
    if (selectCategoria) {
      selectCategoria.innerHTML = '<option value="" disabled selected>Selecione uma categoria</option>';
      
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.nome;
        option.textContent = cat.nome;
        selectCategoria.appendChild(option);
      });
    }

    // Adicionar categorias ao menu lateral
    categorias.forEach((categoria) => {
      const li = document.createElement('li');
      li.classList.add('menu-expandir');
      li.innerHTML = `
        <a href="#" class="categoria" data-categoria="${categoria.nome}">${categoria.nome}</a>
      `;
      opcoesMenu.appendChild(li);
    });

    // Adicionar eventos de clique às categorias
    opcoesMenu.addEventListener('click', async (event) => {
      if (event.target.classList.contains('categoria')) {
        event.preventDefault();
        const categoriaSelecionada = event.target.getAttribute('data-categoria');
        await carregarProdutosPorCategoria(categoriaSelecionada);
      }
    });

  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    // Adicione aqui feedback visual para o usuário
  }
}

window.onload = () => {
  carregarCategorias();
  carregarProdutos();
};

//carregar produtos por categoria 
async function carregarProdutosPorCategoria(categoriaSelecionada) {
  try {
    const resposta = await fetch('http://localhost:3000/produtos');
    const produtos = await resposta.json();

    const container = document.getElementById('conteudo-produtos');
    container.innerHTML = ''; // Limpa os produtos existentes

    // Filtra os produtos com base na categoria selecionada
    const produtosFiltrados = produtos.filter((produto) => produto.categoria === categoriaSelecionada);

    // Exibe os produtos filtrados
    produtosFiltrados.forEach((produto) => {
      const preco = parseFloat(produto.preco); // Converte o preço para número
      const produtoHTML = `
        <div class="produto">
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>Preço: KZ ${preco.toFixed(2)}</p>
          <button onclick="adicionarLista(this)">Adicionar</button>
        </div>
      `;
      container.innerHTML += produtoHTML;
    });

    // Caso não haja produtos na categoria
    if (produtosFiltrados.length === 0) {
      container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

// Enviar novo produto para o backend
formularioProduto.addEventListener('submit', async (event) => {
  event.preventDefault();

  const novoProduto = {
    nome: document.getElementById('produto-nome').value,
    preco: parseFloat(document.getElementById('produto-preco').value),
    imagem: document.getElementById('produto-imagem').value,
    categoria: document.getElementById('produto-categoria').value,
    
  };

  try {
    const resposta = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto),
    });

    if (resposta.ok) {
      formularioProduto.reset();
      formularioProduto.style.display = 'none';
      carregarProdutos(); // Atualiza a lista de produtos
    } else {
      console.error('Erro ao adicionar produto:', await resposta.text());
    }
  } catch (error) {
    console.error('Erro ao enviar produto:', error);
  }
});

function atualizarTotal() {
  const listaCompras = document.getElementById('lista-compras');
  const itens = listaCompras.querySelectorAll('.item-lista');
  let total = 0;

  itens.forEach((item) => {
    const precoElemento = item.querySelector('.preco-produto');
    const quantidadeElemento = item.querySelector('.quantidade-produto');

    if (precoElemento && quantidadeElemento) {
      const preco = parseFloat(precoElemento.textContent.replace('KZ ', '').replace(',', '.'));
      const quantidade = parseInt(quantidadeElemento.textContent);
      total += preco * quantidade;
    }
  });

  const totalElemento = document.getElementById('total-compras');
  totalElemento.textContent = `Total: KZ ${total.toFixed(2)}`;
  totalElemento.style.display = total > 0 ? 'block' : 'none';
}
function adicionarProdutoNaLista(nome, preco, imagem) {
  const lista = document.getElementById('lista-compras');
  const itens = lista.querySelectorAll('.item-lista');
  let produtoExistente = null;

  // Verifica se o produto já está na lista
  itens.forEach((item) => {
    const nomeExistente = item.querySelector('.nome-produto').textContent;
    if (nomeExistente === nome) {
      produtoExistente = item;
    }
  });

  if (produtoExistente) {
    // Atualiza a quantidade do produto existente
    const quantidadeSpan = produtoExistente.querySelector('.quantidade-produto');
    let quantidadeAtual = parseInt(quantidadeSpan.textContent);
    quantidadeAtual += 1;
    quantidadeSpan.textContent = quantidadeAtual;
  } else {
    // Adiciona o produto à lista de compras
    const item = document.createElement('div');
    item.classList.add('item-lista');
    item.innerHTML = `
      <img src="${imagem}" alt="${nome}" class="imagem-produto">
      <div class="info-produto">
        <span class="nome-produto">${nome}</span>
        <span class="quantidade-produto">1</span>
        <div class="preco-produto">KZ ${preco.toFixed(2)}</div>
      </div>
      <button class="remover-item" onclick="removerItem(this)">X</button>
    `;
    lista.appendChild(item);
  }

  // Atualiza o total
  atualizarTotal();
}
// Exibe a mensagem "Nenhum item no carrinho" se a lista estiver vazia
  const nadaNoCarrinho = document.getElementById('nadaNoCarrinho');
  if (lista.querySelectorAll('.item-lista').length === 0) {
    nadaNoCarrinho.style.display = 'block';
  }
