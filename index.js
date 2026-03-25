const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sistema_chamados',
    password: 'senai', 
    port: 5432,
});
app.post('/usuarios/cadastro', async (req, res) => {
    try {
        
        const { nome, email, senha } = req.body; 
        const query = 'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *';
        const values = [nome, email, senha];
        
        const resultado = await pool.query(query, values);
        
        res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario: resultado.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao criar usuário." });
    }
});
app.post('/chamados', async (req, res) => {
    try {
        const { titulo, descricao, responsavel_id } = req.body;
        const query = 'INSERT INTO chamados (titulo, descricao, responsavel_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [titulo, descricao, responsavel_id];

        const resultado = await pool.query(query, values);

        res.status(201).json({ mensagem: "Chamado aberto!", chamado: resultado.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao criar chamado." });
    }
});
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
app.get('/chamados/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM chamados WHERE id = $1';
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Chamado não encontrado." });
        }

        res.status(200).json(resultado.rows[0]);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao buscar o chamado." });
    }
});
app.get('/chamados', async (req, res) => {
    try {
        const { responsavel_id } = req.query;
        
        let query = 'SELECT * FROM chamados';
        let values = [];

        if (responsavel_id) {
            query = query + ' WHERE responsavel_id = $1';
            values.push(responsavel_id);
        }

        const resultado = await pool.query(query, values);
        
        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao listar chamados." });
    }
});
app.put('/chamados/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descricao, responsavel_id } = req.body;

        const query = `
            UPDATE chamados 
            SET titulo = $1, descricao = $2, responsavel_id = $3 
            WHERE id = $4 
            RETURNING *
        `;
        const values = [titulo, descricao, responsavel_id, id];

        const resultado = await pool.query(query, values);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Chamado não encontrado para edição." });
        }

        res.status(200).json({ mensagem: "Chamado atualizado!", chamado: resultado.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao atualizar o chamado." });
    }
});
app.delete('/chamados/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'DELETE FROM chamados WHERE id = $1 RETURNING *';
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Chamado não encontrado para exclusão." });
        }

        res.status(200).json({ mensagem: "Chamado deletado com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao deletar o chamado." });
    }
});
app.post('/usuarios/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const query = 'SELECT * FROM usuarios WHERE email = $1 AND senha = $2';
        const values = [email, senha];

        const resultado = await pool.query(query, values);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }
        const usuarioLogado = resultado.rows[0];
        
        res.status(200).json({ 
            mensagem: "Login realizado com sucesso! Bem-vindo(a).", 
            usuario: {
                id: usuarioLogado.id,
                nome: usuarioLogado.nome,
                email: usuarioLogado.email
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao tentar fazer login." });
    }
});
