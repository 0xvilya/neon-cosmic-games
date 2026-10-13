// ===== APP INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('games');
  if (!grid) return;

  GAMES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <span class="game-icon">${g.icon}</span>
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      <span class="game-badge">${g.badge}</span>
    `;
    card.onclick = () => openGame(g.id);
    grid.appendChild(card);
  });

  document.getElementById('modal-close').onclick = () => {
    document.getElementById('game-modal').classList.add('hidden');
  };
});

function openGame(id) {
  const modal = document.getElementById('game-modal');
  const container = document.getElementById('game-container');
  modal.classList.remove('hidden');
  container.innerHTML = '<p style="text-align:center;color:var(--text-dim)">Загрузка...</p>';
  if (window.GameStarters && window.GameStarters[id]) {
    window.GameStarters[id](container);
  }
}
