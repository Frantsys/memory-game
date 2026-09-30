/**
 * Níveis de dificuldade suportados pelo jogo.
 * @typedef {'3x3' | '6x6' | '9x9' | '12x12' | '15x15'} DifficultyLevel
 */

/**
 * Registro de pontuação de um jogador.
 * @typedef {Object} ScoreEntry
 * @property {string} user
 * @property {DifficultyLevel} difficulty
 * @property {number} score
 * @property {number} time 
 * @property {string} [date]
 */

/**
 * Módulo para gerenciamento do histórico e ranking de pontuações.
 */
const Scores = {
    /**
     * Obtém todas as pontuações salvas.
     * @returns {ScoreEntry[]} Lista de pontuações.
     */
    all() {
        return Store.get('scores', []);
    },

    /**
     * Adiciona um novo registro de pontuação ao histórico.
     * @param {ScoreEntry} entry - Objeto contendo os dados da pontuação.
     * @returns {void}
     */
    add(entry) {
        const scores = Scores.all();
        scores.push(entry);
        Store.set('scores', scores);
    },

    /**
     * Retorna o ranking das 20 melhores pontuações, opcionalmente filtrado por dificuldade.
     * Ordena por maior pontuação e, em caso de empate, pelo menor tempo.
     * @param {DifficultyLevel} [difficulty] - Dificuldade para filtrar (opcional).
     * @returns {ScoreEntry[]} Lista das melhores pontuações ordenadas.
     */
    top(difficulty) {
        return Scores.all()
            .filter((s) => !difficulty || s.difficulty === difficulty)
            .sort((a, b) => b.score - a.score || a.time - b.time)
            .slice(0, 20);
    },
};


function renderScoreboard() {
    const body = $('#score-body');
    if (!body) return;

    const rows = Scores.top($('#filter').value);

    if (rows.length === 0) {
        body.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">Nenhum resultado ainda.</td></tr>';
        return;
    }

    body.innerHTML = rows
        .map((s, i) => `
            <tr class="border-t border-gray-300">
                <td class="p-2 font-bold">${i + 1}</td>
                <td class="p-2">${escapeHTML(s.name)}</td>
                <td class="p-2">${s.score}</td>
                <td class="p-2">${s.difficulty}</td>
                <td class="p-2">${formatTime(s.time)}</td>
                <td class="p-2 hidden sm:table-cell">${new Date(s.date).toLocaleDateString('pt-BR')}</td>
            </tr>`)
        .join('');
}

const filter = $('#filter');
if (filter) {
    filter.addEventListener('change', renderScoreboard);
}
renderScoreboard();
