import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

const DB_PATH = path.resolve('database.json'); // Caminho do arquivo JSON

// Função para ler os dados do arquivo JSON
const lerBanco = async () => {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

// Função para salvar os dados no arquivo JSON
const salvarBanco = async (dados) => {
    await fs.writeFile(DB_PATH, JSON.stringify(dados, null, 2));
};

// Rota de Cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }

    const banco = await lerBanco();
    
    // Verifica se o e-mail já está cadastrado
    const usuarioExiste = banco.usuarios.some(user => user.email === email);
    
    if (usuarioExiste) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado!' });
    }

    // Adiciona o novo usuário
    banco.usuarios.push({ nome, email, senha });
    await salvarBanco(banco);

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios!' });
    }

    const banco = await lerBanco();
    
    // Busca o usuário no banco de dados
    const usuario = banco.usuarios.find(user => user.email === email && user.senha === senha);

    if (!usuario) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas!' });
    }

    res.status(200).json({ mensagem: 'Login realizado com sucesso!', usuario });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
