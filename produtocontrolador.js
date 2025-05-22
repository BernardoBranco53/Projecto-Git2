const db = require('./servidor');

// Função para adicionar um produto
const adicionarProduto = async (nome, preco, imagem_url, quantidade) => {
    const result = await db.query(
        'INSERT INTO produtos (nome, preco, imagem_url, quantidade) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, preco, imagem_url, quantidade]
    );
    return result.rows[0];  // Retorna o produto inserido
};

// Exemplo de uso
adicionarProduto('Arroz', 1050.00, 'IMG/arroz.jpg', 100)
    .then(produto => console.log('Produto Adicionado:', produto))
    .catch(err => console.error('Erro ao adicionar produto:', err));

    