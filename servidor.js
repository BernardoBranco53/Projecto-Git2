const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path'); // Importa o módulo path

const app = express();

// Middleware para permitir requisições CORS e interpretar JSON
app.use(cors());
app.use(express.json());

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: 'branco', // Substitua pelo seu usuário do PostgreSQL
  host: 'localhost',
  database: 'MeuProjecto', // Nome do banco de dados
  password: 'Palele123', // Substitua pela sua senha do PostgreSQL
  port: 5432,
});

// Servir arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Rota para buscar todos os produtos
app.get('/produtos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM produtos');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).send('Erro no servidor');
  }
});
// Rota para adicionar usuários
app.post('/usuarios', async (req, res) => {
  const {
    nome,
    email,
    senha,
    pais,
    morada,
    localizacao,
    telemovel,
    data_nascimento,
    genero,
  } = req.body;

  // Hash da senha para segurança
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, pais, morada, localizacao, telemovel, data_nascimento, genero)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nome, email, senhaHash, pais, morada, localizacao, telemovel, data_nascimento, genero]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: resultado.rows[0] });
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});
const bcrypt = require('bcryptjs');


app.post('/usuarios', async (req, res) => {
  const {
    nome,
    email,
    senha,
    pais,
    morada,
    localizacao,
    telemovel,
    data_nascimento,
    genero
  } = req.body;

  // Hash da senha (usando bcrypt)
  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, pais, morada, localizacao, telemovel, data_nascimento, genero)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [nome, email, senhaHash, pais, morada, localizacao, telemovel, data_nascimento, genero]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).send('Erro no servidor');
  }
});
// Rota para buscar todas as categorias
app.get('/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para adicionar um novo produto
app.post('/produtos', async (req, res) => {
  try {
    const { nome, preco, imagem, categoria } = req.body;

    // Verifica se todos os campos foram enviados
    if (!nome || !preco || !imagem || !categoria) {
      return res.status(400).send('Todos os campos são obrigatórios');
    }

    await pool.query(
      'INSERT INTO produtos (nome, preco, imagem, categoria) VALUES ($1, $2, $3, $4)',
      [nome, preco, imagem, categoria]
    );
    res.status(201).send('Produto adicionado com sucesso');
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).send('Erro ao adicionar produto');
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const usuario = resultado.rows[0];

    // Verifica a senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Gera um token de autenticação
    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, 'seu_segredo', { expiresIn: '1h' });

    res.json({ message: 'Login realizado com sucesso!', token, tipo: usuario.tipo });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});


// Iniciar o servidor
app.listen(3000, () => {
  console.log('RODANDO');
});