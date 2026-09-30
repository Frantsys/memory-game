# Memory Game

Projeto web de um jogo da memória interativo com sistema de autenticação de utilizadores e classificação (scoreboard).

## Estrutura do Projeto

A estrutura de diretórios e ficheiros do projeto está organizada da seguinte forma:

```text
memory-game/
├── html/
│   ├── index.html        # Página inicial / Apresentação
│   ├── login.html        # Página de login de utilizadores
│   ├── signup.html       # Página de registo de novos jogadores
│   ├── game.html         # Interface principal do jogo
│   └── scoreboard.html   # Tabela de pontuações e classificações
├── js/
│   ├── auth.js           # Lógica de autenticação e gestão de sessão
│   ├── game.js           # Lógica do jogo da memória
│   ├── scoreboard.js     # Lógica de processamento e exibição do ranking
│   └── utils.js          # Funções utilitárias
├── LICENSE
└── README.md
```

## Funcionalidades

- **Gestão de Jogadores:**
  - Criação de conta e autenticação.
  - Controle de sessões de jogador.

- **Jogo da Memória:**
  - Tabuleiro interativo de cartas.
  - Lógica para combinar pares de cartas com validação de tentativas.
  - Contagem de pontuação e tempo de jogo.

- **Classificação:**
  - Exibição das melhores pontuações registadas na página de pontuações.

## Tecnologias Utilizadas

- **HTML5:** Estruturação das páginas web.
- **JavaScript:** Lógica da aplicação, manipulação do DOM e gestão do jogo.
- **TailwindCss:** Estilização.

## Como Executar o Projeto

1. Faça o clone do repositório para a sua máquina local:
   ```bash
   git clone https://github.com/Frantsys/memory-game.git
   ```

2. Navegue até ao diretório do projeto:
   ```bash
   cd memory-game
   ```

3. Abra o ficheiro `html/index.html` num navegador web da sua preferência, ou utilize uma extensão de servidor local (Live Server).

## Licença

Este projeto está licenciado sob os termos do ficheiro `LICENSE` incluído no repositório.