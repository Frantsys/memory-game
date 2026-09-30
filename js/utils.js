/**
 * Utilitário para manipulação do localStorage com suporte a serialização JSON.
 */
const Store = {
    /**
     * Obtém um item do localStorage e faz o parse do JSON.
     * @template T
     * @param {string} key - Chave do item no localStorage.
     * @param {T} fallback - Valor retornado caso a chave não exista ou ocorra um erro de parse.
     * @returns {T} O valor armazenado ou o valor de fallback.
     */
    get(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            const value = JSON.parse(raw);
            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    },

    /**
     * Salva um valor no localStorage após convertê-lo para JSON.
     * @param {string} key - Chave do item no localStorage.
     * @param {any} value - Valor a ser armazenado.
     * @returns {void}
     */
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * Remove um item do localStorage.
     * @param {string} key - Chave do item a ser removido.
     * @returns {void}
     */
    remove(key) {
        localStorage.removeItem(key);
    },
};

/**
 * Seletor de elementos HTML
 * Wrapper para querySelector
 * @template {Element} [T=HTMLElement]
 * @param {string} selector - Seletor do elemento.
 * @returns {T | null} O elemento encontrado ou `null`.
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * Embaralha os elementos de um array.
 * @template T
 * @param {T[]} array - O array a ser embaralhado.
 * @returns {T[]} O array embaralhado.
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/**
 * Formata um total de segundos no formato `MM:SS`.
 * @param {number} seconds - Quantidade de segundos a formatar.
 * @returns {string} Tempo formatado em minutos e segundos.
 */
function formatTime(seconds) {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return min + ':' + sec;
}

/**
 * Escapa caracteres HTML para prevenir ataques do tipo XSS ao inserir texto no DOM.
 * @param {string} text - Texto a ser escapado.
 * @returns {string} String com caracteres especiais codificados em entidades HTML.
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}