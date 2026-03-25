
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);


CREATE TABLE chamados (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    responsavel_id INT REFERENCES usuarios(id),
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);