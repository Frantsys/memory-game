/**
 * @typedef {Object} User
 * @property {string} name 
 * @property {string} email 
 * @property {string} password
 */

/**
 * @typedef {Object} CurrentUser
 * @property {string} name 
 * @property {string} email
 */

/**
 * @typedef {Object} SignUpData
 * @property {string} name 
 * @property {string} email 
 * @property {string} password 
 * @property {string} confirm
 */

/**
 * @typedef {Object} LoginData
 * @property {string} email 
 * @property {string} password 
 */

const BTN = 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700';
const BTN_OUTLINE = 'border border-gray-400 bg-white px-4 py-2 rounded hover:bg-gray-100';


const Auth = {
    /**
     * Obtém a lista de usuários cadastrados.
     * @returns {User[]} Lista de usuários.
     */
    users() {
        return Store.get('users', []);
    },

    /**
     * Obtém o usuário atualmente logado.
     * @returns {CurrentUser | null} Usuário logado ou null caso não esteja autenticado.
     */
    current() {
        return Store.get('currentUser', null);
    },

    /**
     * Redireciona para a página de login se o usuário não estiver autenticado.
     * @returns {void}
     */
    require() {
        if (!Auth.current()) {
            location.replace('login.html');
        }
    },

    /**
     * Encerra a sessão do usuário atual e redireciona para a página inicial.
     * @returns {void}
     */
    logout() {
        Store.remove('currentUser');
        location.href = 'index.html';
    },

    /**
     * Realiza o cadastro de um novo usuário.
     * @param {SignUpData} data - Dados do formulário de cadastro.
     * @returns {string | null} Mensagem de erro caso ocorra falha ou null em caso de sucesso.
     */
    signUp(data) {
        const name = data.name.trim();
        const email = data.email.trim().toLowerCase();
        const password = data.password;

        if (!name || !email || !password || !data.confirm) return 'Preencha todos os campos.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'E-mail inválido.';
        if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
        if (password !== data.confirm) return 'As senhas não coincidem.';

        const users = Auth.users();
        if (users.some((u) => u.email === email)) return 'Este e-mail já está cadastrado.';

        users.push({ name, email, password });
        Store.set('users', users);
        Store.set('currentUser', { name, email });
        return null;
    },

    /**
     * Realiza o login do usuário.
     * @param {LoginData} data - Dados do formulário de login.
     * @returns {string | null} Mensagem de erro caso ocorra falha ou null em caso de sucesso.
     */
    login(data) {
        const email = data.email.trim().toLowerCase();
        const user = Auth.users().find((u) => u.email === email && u.password === data.password);

        if (!user) return 'E-mail ou senha inválidos.';

        Store.set('currentUser', { name: user.name, email: user.email });
        return null;
    },
};

/**
 * Função de callback para manipulação do formulário de autenticação.
 * @callback AuthHandler
 * @param {Record<string, any>} data - Objeto contendo os campos do formulário.
 * @returns {string | null} Mensagem de erro ou null se o envio for bem-sucedido.
 */

/**
 * Associa o evento de submit de um formulário de autenticação ao manipulador correspondente.
 * @param {string} formId - O ID do elemento `<form>`.
 * @param {AuthHandler} handler - A função responsável por processar os dados do formulário.
 * @returns {void}
 */
function bindAuthForm(formId, handler) {
    /** @type {HTMLFormElement | null} */
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = Object.fromEntries(new FormData(form));
        const error = handler(data);
        const errorBox = $('#error');

        if (error) {
            errorBox.textContent = error;
            errorBox.classList.remove('hidden');
        } else {
            location.href = 'game.html';
        }
    });
}

bindAuthForm('signup-form', Auth.signUp);
bindAuthForm('login-form', Auth.login);

/**
 * Renderiza os botões ou ações da página inicial com base no estado de autenticação.
 * @returns {void}
 */
function renderHome() {
    /** 
     * @type {HTMLElement | null} 
    */
    const box = $('#home-actions');
    if (!box) return;

    const user = Auth.current();

    if (user) {
        box.innerHTML = `
            <p class="mb-4 text-lg">Olá, <strong>${escapeHTML(user.name)}</strong>!</p>
            <div class="flex flex-wrap gap-3 justify-center">
                <a class="${BTN}" href="game.html">Iniciar jogo</a>
                <a class="${BTN_OUTLINE}" href="scoreboard.html">Scoreboard</a>
                <button class="${BTN_OUTLINE}" id="logout">Sair</button>
            </div>`;
        $('#logout').addEventListener('click', Auth.logout);
    } else {
        box.innerHTML = `
            <div class="flex flex-wrap gap-3 justify-center">
                <a class="${BTN}" href="login.html">Entrar</a>
                <a class="${BTN_OUTLINE}" href="signup.html">Criar conta</a>
                <a class="${BTN_OUTLINE}" href="scoreboard.html">Scoreboard</a>
            </div>`;
    }
}

renderHome();
