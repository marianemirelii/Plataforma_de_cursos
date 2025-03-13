import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware para interpretar JSON
app.use(express.json());

// Rota de cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Lendo o banco de dados
        const data = await fs.readFile('database.json', 'utf8');
        const usuarios = JSON.parse(data);

        // Verifica se o e-mail já existe
        if (usuarios.some(user => user.email === email)) {
            return res.status(400).json({ mensagem: 'E-mail já cadastrado!' });
        }

        // Adiciona o novo usuário
        usuarios.push({ nome, email, senha });

        // Salva no arquivo
        await fs.writeFile('database.json', JSON.stringify(usuarios, null, 2));

        res.status(201).json({ mensagem: 'Cadastro realizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao salvar usuário!' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
