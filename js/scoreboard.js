const Scores = {
    all() {
        return Store.get('scores', []);
    },

    add(entry) {
        const scores = Scores.all();
        scores.push(entry);
        Store.set('scores', scores);
    },

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
