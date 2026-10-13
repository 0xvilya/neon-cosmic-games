// ===== GAME DATA & LOGIC =====

const GAMES = [
  {
    id: 'country-quiz',
    title: 'Квиз: Страны',
    icon: '🌍',
    desc: 'Угадай страну по столице, флагу или факту. 10 вопросов.',
    badge: 'Квиз'
  },
  {
    id: 'space-memory',
    title: 'Космическая Память',
    icon: '🚀',
    desc: 'Найди пары космических символов. Тренируй память!',
    badge: 'Память'
  },
  {
    id: 'neon-snake',
    title: 'Неоновый Змей',
    icon: '🐍',
    desc: 'Классический змей в неоновом стиле. Собирай очки!',
    badge: 'Аркада'
  },
  {
    id: 'reaction-test',
    title: 'Тест Реакции',
    icon: '⚡',
    desc: 'Проверь скорость своей реакции. Кликни как можно быстрее!',
    badge: 'Реакция'
  },
  {
    id: 'math-blitz',
    title: 'Математический Блиц',
    icon: '🧮',
    desc: 'Реши как можно больше примеров за 60 секунд.',
    badge: 'Квиз'
  },
  {
    id: 'color-match',
    title: 'Цветовой Матч',
    icon: '🎨',
    desc: 'Выбери правильный цвет по названию. Не попадись на обман!',
    badge: 'Реакция'
  }
];

// Country Quiz Data
const COUNTRIES = [
  { q: 'Столица Франции?', a: ['Париж', 'Лион', 'Марсель', 'Ницца'], correct: 0 },
  { q: 'Столица Японии?', a: ['Осака', 'Токио', 'Киото', 'Хиросима'], correct: 1 },
  { q: 'Столица Бразилии?', a: ['Рио-де-Жанейро', 'Сан-Паулу', 'Бразилиа', 'Салвадор'], correct: 2 },
  { q: 'Столица Австралии?', a: ['Сидней', 'Мельбурн', 'Канберра', 'Брисбен'], correct: 2 },
  { q: 'Столица Канады?', a: ['Торонто', 'Ванкувер', 'Монреаль', 'Оттава'], correct: 3 },
  { q: 'Столица Египта?', a: ['Каир', 'Александрия', 'Гиза', 'Луксор'], correct: 0 },
  { q: 'Столица Южной Кореи?', a: ['Пусан', 'Сеул', 'Инчхон', 'Тэгу'], correct: 1 },
  { q: 'Столица Аргентины?', a: ['Буэнос-Айрес', 'Кордова', 'Росарио', 'Мендоса'], correct: 0 },
  { q: 'Столица Турции?', a: ['Стамбул', 'Анкара', 'Измир', 'Анталья'], correct: 1 },
  { q: 'Столица Индии?', a: ['Мумбаи', 'Калькутта', 'Нью-Дели', 'Бангалор'], correct: 2 },
  { q: 'Столица Мексики?', a: ['Гвадалахара', 'Мехико', 'Монтеррей', 'Канкун'], correct: 1 },
  { q: 'Столица Италии?', a: ['Милан', 'Неаполь', 'Рим', 'Флоренция'], correct: 2 },
  { q: 'Столица Испании?', a: ['Барселона', 'Мадрид', 'Валенсия', 'Севилья'], correct: 1 },
  { q: 'Столица Германии?', a: ['Мюнхен', 'Гамбург', 'Берлин', 'Франкфурт'], correct: 2 },
  { q: 'Столица Китая?', a: ['Шанхай', 'Пекин', 'Гуанчжоу', 'Шэньчжэнь'], correct: 1 }
];

// Space Memory Symbols
const MEMORY_SYMBOLS = ['🚀', '🛸', '🌌', '⭐', '🪐', '☄️', '🌙', '👽'];

// Color Match
const COLORS = [
  { name: 'КРАСНЫЙ', hex: '#ff0040' },
  { name: 'СИНИЙ', hex: '#0080ff' },
  { name: 'ЗЕЛЁНЫЙ', hex: '#39ff14' },
  { name: 'ЖЁЛТЫЙ', hex: '#ffe600' },
  { name: 'РОЗОВЫЙ', hex: '#ff00aa' },
  { name: 'ФИОЛЕТОВЫЙ', hex: '#b400ff' },
  { name: 'БИРЮЗОВЫЙ', hex: '#00f5ff' },
  { name: 'ОРАНЖЕВЫЙ', hex: '#ff8800' }
];

// ===== SCORE SYSTEM (session + localStorage) =====
const ScoreManager = {
  get(gameId) {
    const data = JSON.parse(localStorage.getItem('neonScores') || '{}');
    return data[gameId] || { best: 0, last: 0, plays: 0 };
  },
  set(gameId, score) {
    const data = JSON.parse(localStorage.getItem('neonScores') || '{}');
    const prev = data[gameId] || { best: 0, last: 0, plays: 0 };
    data[gameId] = {
      best: Math.max(prev.best, score),
      last: score,
      plays: prev.plays + 1
    };
    localStorage.setItem('neonScores', JSON.stringify(data));
    return data[gameId];
  },
  getAll() {
    return JSON.parse(localStorage.getItem('neonScores') || '{}');
  },
  clear() {
    localStorage.removeItem('neonScores');
  }
};

// ===== GAME IMPLEMENTATIONS =====

function startCountryQuiz(container) {
  let score = 0;
  let current = 0;
  const questions = [...COUNTRIES].sort(() => Math.random() - 0.5).slice(0, 10);

  function render() {
    if (current >= questions.length) {
      const result = ScoreManager.set('country-quiz', score);
      container.innerHTML = `
        <div class="game-ui">
          <h2>Квиз завершён!</h2>
          <p class="score-display">Твой счёт: ${score} / 10</p>
          <p>Лучший результат: ${result.best}</p>
          <button class="btn" onclick="startCountryQuiz(document.getElementById('game-container'))">Ещё раз</button>
          <button class="btn btn-pink" id="close-after">Закрыть</button>
        </div>`;
      document.getElementById('close-after').onclick = () => document.getElementById('game-modal').classList.add('hidden');
      return;
    }
    const q = questions[current];
    container.innerHTML = `
      <div class="game-ui">
        <h2>Квиз: Страны</h2>
        <p>Вопрос ${current + 1} / 10</p>
        <p class="score-display">Счёт: ${score}</p>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-options" id="options"></div>
      </div>`;
    const opts = document.getElementById('options');
    q.a.forEach((ans, i) => {
      const btn = document.createElement('div');
      btn.className = 'quiz-option';
      btn.textContent = ans;
      btn.onclick = () => {
        if (i === q.correct) {
          btn.classList.add('correct');
          score++;
        } else {
          btn.classList.add('wrong');
          opts.children[q.correct].classList.add('correct');
        }
        Array.from(opts.children).forEach(c => c.onclick = null);
        setTimeout(() => { current++; render(); }, 900);
      };
      opts.appendChild(btn);
    });
  }
  render();
}

function startSpaceMemory(container) {
  let moves = 0;
  let matched = 0;
  let first = null;
  let lock = false;
  const symbols = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].sort(() => Math.random() - 0.5);
  const cards = symbols.map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }));

  function render() {
    container.innerHTML = `
      <div class="game-ui">
        <h2>Космическая Память</h2>
        <p class="score-display">Ходы: ${moves} | Пары: ${matched}/8</p>
        <div class="memory-grid" id="mem-grid"></div>
        <button class="btn btn-pink" id="mem-restart">Заново</button>
      </div>`;
    const grid = document.getElementById('mem-grid');
    cards.forEach((c, i) => {
      const el = document.createElement('div');
      el.className = 'memory-card' + (c.flipped || c.matched ? ' flipped' : '') + (c.matched ? ' matched' : '');
      el.textContent = (c.flipped || c.matched) ? c.symbol : '?';
      el.onclick = () => flip(i);
      grid.appendChild(el);
    });
    document.getElementById('mem-restart').onclick = () => startSpaceMemory(container);
  }

  function flip(i) {
    if (lock || cards[i].flipped || cards[i].matched) return;
    cards[i].flipped = true;
    render();
    if (!first) {
      first = i;
      return;
    }
    moves++;
    lock = true;
    if (cards[first].symbol === cards[i].symbol) {
      cards[first].matched = cards[i].matched = true;
      matched++;
      first = null;
      lock = false;
      render();
      if (matched === 8) {
        const score = Math.max(0, 100 - moves * 2);
        const result = ScoreManager.set('space-memory', score);
        setTimeout(() => {
          container.innerHTML = `
            <div class="game-ui">
              <h2>Победа!</h2>
              <p class="score-display">Ходов: ${moves}</p>
              <p>Очки: ${score} (лучший: ${result.best})</p>
              <button class="btn" onclick="startSpaceMemory(document.getElementById('game-container'))">Ещё раз</button>
            </div>`;
        }, 400);
      }
    } else {
      setTimeout(() => {
        cards[first].flipped = false;
        cards[i].flipped = false;
        first = null;
        lock = false;
        render();
      }, 700);
    }
  }
  render();
}

function startNeonSnake(container) {
  container.innerHTML = `
    <div class="game-ui">
      <h2>Неоновый Змей</h2>
      <p class="score-display" id="snake-score">Счёт: 0</p>
      <canvas id="snake-canvas" width="320" height="320"></canvas>
      <p style="color:var(--text-dim);font-size:0.9rem">Стрелки / WASD для управления</p>
      <button class="btn" id="snake-start">Старт</button>
      <button class="btn btn-pink" id="snake-stop">Стоп</button>
    </div>`;

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const size = 16;
  const cols = 20, rows = 20;
  let snake, dir, food, score, running, loop;

  function reset() {
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    food = { x: 15, y: 10 };
    score = 0;
    document.getElementById('snake-score').textContent = 'Счёт: 0';
  }

  function draw() {
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, 320, 320);
    // grid glow
    ctx.strokeStyle = 'rgba(0,245,255,0.08)';
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, 320); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(320, i * size); ctx.stroke();
    }
    // food
    ctx.fillStyle = '#ff00aa';
    ctx.shadowColor = '#ff00aa';
    ctx.shadowBlur = 12;
    ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4);
    // snake
    ctx.fillStyle = '#00f5ff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 10;
    snake.forEach((s, i) => {
      ctx.fillRect(s.x * size + 1, s.y * size + 1, size - 2, size - 2);
    });
    ctx.shadowBlur = 0;
  }

  function tick() {
    if (!running) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
      running = false;
      const result = ScoreManager.set('neon-snake', score);
      document.getElementById('snake-score').textContent = `Игра окончена! Счёт: ${score} (рекорд: ${result.best})`;
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snake-score').textContent = 'Счёт: ' + score;
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } else {
      snake.pop();
    }
    draw();
  }

  function keyHandler(e) {
    const k = e.key.toLowerCase();
    if (['arrowup', 'w'].includes(k) && dir.y === 0) dir = { x: 0, y: -1 };
    if (['arrowdown', 's'].includes(k) && dir.y === 0) dir = { x: 0, y: 1 };
    if (['arrowleft', 'a'].includes(k) && dir.x === 0) dir = { x: -1, y: 0 };
    if (['arrowright', 'd'].includes(k) && dir.x === 0) dir = { x: 1, y: 0 };
  }

  document.getElementById('snake-start').onclick = () => {
    if (running) return;
    reset();
    running = true;
    draw();
    clearInterval(loop);
    loop = setInterval(tick, 120);
  };
  document.getElementById('snake-stop').onclick = () => {
    running = false;
    clearInterval(loop);
  };
  window.addEventListener('keydown', keyHandler);
  reset();
  draw();

  // cleanup on close
  const origClose = document.getElementById('modal-close').onclick;
  document.getElementById('modal-close').onclick = () => {
    running = false;
    clearInterval(loop);
    window.removeEventListener('keydown', keyHandler);
    document.getElementById('game-modal').classList.add('hidden');
  };
}

function startReactionTest(container) {
  let startTime = 0;
  let waiting = false;
  let best = ScoreManager.get('reaction-test').best || Infinity;

  container.innerHTML = `
    <div class="game-ui">
      <h2>Тест Реакции</h2>
      <p class="score-display" id="react-msg">Нажми «Готов», затем кликни, когда экран загорится</p>
      <div id="react-box" style="width:280px;height:180px;margin:1.5rem auto;border-radius:12px;background:#111;border:2px solid #333;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.2rem;transition:background 0.1s"></div>
      <button class="btn" id="react-ready">Готов</button>
      <p style="margin-top:1rem;color:var(--text-dim)">Лучший результат: <span id="react-best">${best === Infinity ? '—' : best + ' мс'}</span></p>
    </div>`;

  const box = document.getElementById('react-box');
  const msg = document.getElementById('react-msg');

  document.getElementById('react-ready').onclick = () => {
    if (waiting) return;
    waiting = true;
    box.style.background = '#1a1a00';
    box.style.borderColor = '#ffe600';
    box.textContent = 'Жди...';
    msg.textContent = 'Жди зелёного света...';
    const delay = 1500 + Math.random() * 3000;
    setTimeout(() => {
      if (!waiting) return;
      box.style.background = '#003300';
      box.style.borderColor = '#39ff14';
      box.style.boxShadow = '0 0 30px #39ff14';
      box.textContent = 'КЛИК!';
      startTime = performance.now();
      waiting = 'go';
    }, delay);
  };

  box.onclick = () => {
    if (waiting === 'go') {
      const ms = Math.round(performance.now() - startTime);
      waiting = false;
      box.style.background = '#111';
      box.style.borderColor = '#333';
      box.style.boxShadow = 'none';
      box.textContent = ms + ' мс';
      msg.textContent = ms < 200 ? 'Молния! ⚡' : ms < 300 ? 'Отлично!' : ms < 400 ? 'Хорошо' : 'Можно быстрее';
      const result = ScoreManager.set('reaction-test', ms); // lower is better, but we store as is
      // For reaction we want lowest, so special handling
      const data = ScoreManager.getAll();
      if (!data['reaction-test'].best || ms < data['reaction-test'].best) {
        data['reaction-test'].best = ms;
        localStorage.setItem('neonScores', JSON.stringify(data));
      }
      document.getElementById('react-best').textContent = (data['reaction-test'].best || ms) + ' мс';
    } else if (waiting === true) {
      waiting = false;
      box.style.background = '#330011';
      box.style.borderColor = '#ff00aa';
      box.textContent = 'Слишком рано!';
      msg.textContent = 'Попробуй ещё раз';
    }
  };
}

function startMathBlitz(container) {
  let score = 0;
  let timeLeft = 60;
  let timer;
  let a, b, op, answer;

  function newQuestion() {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 15) + 1;
    const ops = ['+', '-', '×'];
    op = ops[Math.floor(Math.random() * 3)];
    if (op === '+') answer = a + b;
    else if (op === '-') { if (b > a) [a, b] = [b, a]; answer = a - b; }
    else answer = a * b;
    document.getElementById('math-q').textContent = `${a} ${op} ${b} = ?`;
    document.getElementById('math-input').value = '';
    document.getElementById('math-input').focus();
  }

  container.innerHTML = `
    <div class="game-ui">
      <h2>Математический Блиц</h2>
      <p class="score-display">Счёт: <span id="math-score">0</span> | Время: <span id="math-time">60</span>с</p>
      <div class="quiz-question" id="math-q">?</div>
      <input type="number" id="math-input" style="font-size:1.5rem;padding:0.6rem;width:120px;text-align:center;background:#0a0a18;border:2px solid var(--neon-cyan);color:var(--neon-cyan);border-radius:8px;outline:none" autofocus>
      <br><br>
      <button class="btn" id="math-submit">Ответить</button>
    </div>`;

  newQuestion();
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('math-time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      const result = ScoreManager.set('math-blitz', score);
      container.innerHTML = `
        <div class="game-ui">
          <h2>Время вышло!</h2>
          <p class="score-display">Счёт: ${score}</p>
          <p>Лучший: ${result.best}</p>
          <button class="btn" onclick="startMathBlitz(document.getElementById('game-container'))">Ещё раз</button>
        </div>`;
    }
  }, 1000);

  function check() {
    const val = parseInt(document.getElementById('math-input').value, 10);
    if (val === answer) {
      score++;
      document.getElementById('math-score').textContent = score;
      newQuestion();
    } else {
      document.getElementById('math-input').style.borderColor = '#ff00aa';
      setTimeout(() => document.getElementById('math-input').style.borderColor = 'var(--neon-cyan)', 300);
    }
  }
  document.getElementById('math-submit').onclick = check;
  document.getElementById('math-input').onkeydown = e => { if (e.key === 'Enter') check(); };
}

function startColorMatch(container) {
  let score = 0;
  let round = 0;
  const maxRounds = 15;

  function next() {
    if (round >= maxRounds) {
      const result = ScoreManager.set('color-match', score);
      container.innerHTML = `
        <div class="game-ui">
          <h2>Готово!</h2>
          <p class="score-display">Счёт: ${score} / ${maxRounds}</p>
          <p>Лучший: ${result.best}</p>
          <button class="btn" onclick="startColorMatch(document.getElementById('game-container'))">Ещё раз</button>
        </div>`;
      return;
    }
    round++;
    const correct = COLORS[Math.floor(Math.random() * COLORS.length)];
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    // sometimes mismatch to trick
    const options = [correct, ...COLORS.filter(c => c.name !== correct.name).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="game-ui">
        <h2>Цветовой Матч</h2>
        <p>Раунд ${round}/${maxRounds} | Счёт: ${score}</p>
        <p style="margin:1.2rem 0;font-size:1.1rem;color:var(--text-dim)">Выбери цвет, которым написано слово:</p>
        <div style="font-size:2.2rem;font-weight:700;margin:1rem 0;color:${textColor.hex};text-shadow:0 0 12px ${textColor.hex}">${correct.name}</div>
        <div class="quiz-options" id="color-opts"></div>
      </div>`;
    const opts = document.getElementById('color-opts');
    options.forEach(c => {
      const btn = document.createElement('div');
      btn.className = 'quiz-option';
      btn.textContent = c.name;
      btn.style.borderColor = c.hex;
      btn.onclick = () => {
        if (c.name === correct.name) score++;
        next();
      };
      opts.appendChild(btn);
    });
  }
  next();
}

// Export starters
window.GameStarters = {
  'country-quiz': startCountryQuiz,
  'space-memory': startSpaceMemory,
  'neon-snake': startNeonSnake,
  'reaction-test': startReactionTest,
  'math-blitz': startMathBlitz,
  'color-match': startColorMatch
};
