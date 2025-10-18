document.addEventListener('DOMContentLoaded', () => {

    // ================== Utilidades financeiras ==================
    const juros_simples_montante = (C, i, n) => C * (1 + i * n);
    const juros_compostos_montante = (C, i, n) => C * ((1 + i) ** n);
    const desconto_comercial_simples_liquido = (N, d, t) => N * (1 - d * t);
    const equivalencia_anual_de_mensal = (i_m) => (1 + i_m) ** 12 - 1;
    const price_parcela = (P, i, n) => {
        if (n <= 0) return 0.0;
        if (i === 0) return P / n;
        return P * (i * (1 + i) ** n) / ((1 + i) ** n - 1);
    };

    // ================== Geradores por fase (4 pares) ==================
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);

    const f1_porcentagem = () => {
        const cenarios = [
            { tipo: 'desconto', contexto: "Videogame em promoção", valor_base: 250, percentual: 15 },
            { tipo: 'gorjeta', contexto: "Conta do restaurante", valor_base: 80, percentual: 10 },
            { tipo: 'aumento', contexto: "Reajuste da mensalidade", valor_base: 120, percentual: 5 },
            { tipo: 'comissao', contexto: "Venda de um celular", valor_base: 1500, percentual: 4 },
            { tipo: 'desconto', contexto: "Blusa na liquidação", valor_base: 75, percentual: 20 },
            { tipo: 'aumento', contexto: "Aumento no ingresso", valor_base: 40, percentual: 10 },
            { tipo: 'gorjeta', contexto: "Corrida de aplicativo", valor_base: 30, percentual: 15 },
            { tipo: 'desconto', contexto: "Livro com cupom", valor_base: 50, percentual: 10 },
        ];
        return shuffle(cenarios).slice(0, 4).map(cenario => {
            let q = '', a = '', explic = '';
            const { tipo, contexto, valor_base, percentual } = cenario;
            switch (tipo) {
                case 'desconto':
                    const valor_desconto = valor_base * (percentual / 100);
                    q = `Um(a) ${contexto} custa R$ ${valor_base.toFixed(2)}. Com ${percentual}% de desconto, qual o preço final?`;
                    a = `R$ ${(valor_base - valor_desconto).toFixed(2)}`;
                    explic = `Desconto: ${valor_base.toFixed(2)} × ${percentual}%. Final: ${valor_base.toFixed(2)} - ${valor_desconto.toFixed(2)}`;
                    break;
                case 'gorjeta':
                    const valor_gorjeta = valor_base * (percentual / 100);
                    q = `A ${contexto} deu R$ ${valor_base.toFixed(2)}. Com gorjeta de ${percentual}%, qual o valor total?`;
                    a = `R$ ${(valor_base + valor_gorjeta).toFixed(2)}`;
                    explic = `Gorjeta: ${valor_base.toFixed(2)} × ${percentual}%. Total: ${valor_base.toFixed(2)} + ${valor_gorjeta.toFixed(2)}`;
                    break;
                case 'aumento':
                    const valor_aumento = valor_base * (percentual / 100);
                    q = `O ${contexto} custa R$ ${valor_base.toFixed(2)} e terá aumento de ${percentual}%. Qual o novo valor?`;
                    a = `R$ ${(valor_base + valor_aumento).toFixed(2)}`;
                    explic = `Aumento: ${valor_base.toFixed(2)} × ${percentual}%. Novo Valor: ${valor_base.toFixed(2)} + ${valor_aumento.toFixed(2)}`;
                    break;
                case 'comissao':
                    q = `Vendedor recebe ${percentual}% pela ${contexto} de R$ ${valor_base.toFixed(2)}. Quanto ele ganhou?`;
                    a = `R$ ${(valor_base * (percentual / 100)).toFixed(2)}`;
                    explic = `Comissão = ${valor_base.toFixed(2)} × (${percentual} / 100)`;
                    break;
            }
            return { q, a, explic };
        });
    };

    const f2_juros_simples = () => {
        const casos = [
            [500, 0.02, 6, "Material escolar"], [800, 0.03, 4, "Bicicleta"], [1000, 0.015, 10, "Conserto do notebook"],
            [1200, 0.025, 8, "Curso rápido"], [700, 0.018, 12, "Reforma do quarto"],
        ];
        return shuffle(casos).slice(0, 4).map(([C, i, n, ctx]) => ({
            q: `${ctx}: C=R$ ${C.toFixed(2)}, i=${(i*100).toFixed(2)}% a.m., n=${n} → Montante?`,
            a: `R$ ${juros_simples_montante(C, i, n).toFixed(2)}`,
            explic: `M=C(1+in)=${C.toFixed(2)}(1+${i.toFixed(4)}×${n})`
        }));
    };

    const f3_juros_compostos = () => {
        const casos = [
            [300, 0.02, 6, "Poupança para viagem"], [700, 0.015, 12, "Reserva para notebook"],
            [1000, 0.025, 8, "Investimento em CDB"], [900, 0.03, 4, "Aplicação mensal"], [1200, 0.018, 10, "Fundo simples"],
        ];
        return shuffle(casos).slice(0, 4).map(([C, i, n, ctx]) => ({
            q: `${ctx}: C=R$ ${C.toFixed(2)}, i=${(i*100).toFixed(2)}% a.m., n=${n} → Montante?`,
            a: `R$ ${juros_compostos_montante(C, i, n).toFixed(2)}`,
            explic: `M=C(1+i)^n=${C.toFixed(2)}(1+${i.toFixed(4)})^${n}`
        }));
    };
    
    const f4_desconto_simples = () => {
        const casos = [
            [1000, 0.02, 2, "Antecipação de título"], [1500, 0.03, 1, "Desconto à vista"], [2000, 0.04, 3, "Negociação"],
            [1200, 0.025, 2, "Pagamento adiantado"], [1800, 0.015, 4, "Desconto comercial"],
        ];
        return shuffle(casos).slice(0, 4).map(([N, d, t, ctx]) => ({
            q: `${ctx}: N=R$ ${N.toFixed(2)}, d=${(d*100).toFixed(2)}% a.m., t=${t} → Valor líquido?`,
            a: `R$ ${desconto_comercial_simples_liquido(N, d, t).toFixed(2)}`,
            explic: `VL=N(1-dt)=${N.toFixed(2)}(1-${d.toFixed(4)}×${t})`
        }));
    };

    const f5_equivalencia_taxas = () => {
        let taxas = shuffle([0.01, 0.015, 0.02, 0.025, 0.03]);
        let ctx = shuffle(["Cartão de loja", "Microcrédito", "Consórcio", "Empréstimo", "Financiamento"]);
        return taxas.slice(0, 4).map((i_m, k) => ({
            q: `${ctx[k]}: ${(i_m * 100).toFixed(2)}% a.m. → taxa efetiva anual = ?`,
            a: `${(equivalencia_anual_de_mensal(i_m) * 100).toFixed(2)}% a.a.`,
            explic: `(1+i_a)=(1+i_m)^12 → i_a=(1+${i_m.toFixed(4)})^12-1`
        }));
    };

    const f6_reajuste_inflacao = () => {
        const casos = [
            [1000, 0.05, "Mensalidade da academia"], [450, 0.08, "Preço do cinema"], [800, 0.03, "Material escolar"],
            [1500, 0.04, "Cesta básica"], [1200, 0.025, "Plano de celular"],
        ];
        return shuffle(casos).slice(0, 4).map(([P0, pi, ctx]) => ({
            q: `${ctx}: preço R$ ${P0.toFixed(2)}, inflação ${(pi*100).toFixed(1)}% → preço corrigido?`,
            a: `R$ ${(P0 * (1 + pi)).toFixed(2)}`,
            explic: `P1=P0(1+π)=${P0.toFixed(2)}(1+${pi.toFixed(3)})`
        }));
    };

    const f7_price_parcela = () => {
        const casos = [
            [300, 0.02, 6, "Celular parcelado"], [800, 0.025, 12, "Notebook no carnê"], [1200, 0.03, 9, "Bike parcelada"],
            [600, 0.015, 10, "Curso preparatório"], [1000, 0.018, 8, "Console de videogame"],
        ];
        return shuffle(casos).slice(0, 4).map(([P, i, n, ctx]) => ({
            q: `${ctx}: P=R$ ${P.toFixed(2)}, i=${(i*100).toFixed(2)}% a.m., n=${n} → parcela?`,
            a: `R$ ${price_parcela(P, i, n).toFixed(2)}`,
            explic: "p=P·[i(1+i)^n]/[(1+i)^n-1]"
        }));
    };

    const f8_total_pago_price = () => {
        const casos = [
            [300, 0.02, 6, "Fone premium"], [900, 0.025, 12, "Notebook intermediário"], [1500, 0.03, 9, "Bike de trilha"],
            [700, 0.018, 10, "Curso técnico"], [1100, 0.015, 8, "Smart TV"],
        ];
        return shuffle(casos).slice(0, 4).map(([P, i, n, ctx]) => ({
            q: `${ctx}: P=R$ ${P.toFixed(2)}, i=${(i*100).toFixed(2)}% a.m., n=${n} → total pago?`,
            a: `R$ ${(price_parcela(P, i, n) * n).toFixed(2)}`,
            explic: "Total≈parcela×n"
        }));
    };

    const PHASE_BUILDERS = [f1_porcentagem, f2_juros_simples, f3_juros_compostos, f4_desconto_simples, f5_equivalencia_taxas, f6_reajuste_inflacao, f7_price_parcela, f8_total_pago_price];
    const PHASE_NAMES = ["F1 — Porcentagem Aplicada", "F2 — Juros simples (M)", "F3 — Juros compostos (M)", "F4 — Desconto comercial simples (VL)", "F5 — Equivalência i_m→i_a.a.", "F6 — Reajuste por inflação", "F7 — Parcela PRICE", "F8 — Total pago (PRICE)"];
    const ENCOURAGE = ["Mandou bem! Próxima fase te espera! 🚀", "Perfeito! Continue nesse ritmo! ⭐", "Ótimo trabalho! Vamos subir o nível! 💪", "Top! Você está voando! ✨"];
    const TIMER_MAX = 75;

    const body = document.body;
    const startPanel = document.getElementById('start-panel');
    const confirmPanel = document.getElementById('confirm-panel');
    const gameScreen = document.getElementById('game-screen');
    const board = document.getElementById('board');
    const paletteDd = document.getElementById('palette-dd');
    const darkSwitch = document.getElementById('dark-switch');
    const chipTurn = document.getElementById('chip-turn');
    const chipScore = document.getElementById('chip-score');
    const subtitle = document.getElementById('subtitle');
    const timeTxt = document.getElementById('time-txt');
    const btnAdvance = document.getElementById('btn-advance');
    const name1Input = document.getElementById('name1');
    const name2Input = document.getElementById('name2');
    const dialogOverlay = document.getElementById('dialog-overlay');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogContent = document.getElementById('dialog-content');
    const dialogOkBtn = document.getElementById('dialog-ok');
    const dialogRestartBtn = document.getElementById('dialog-restart');

    let phaseIdx = 0, matched = new Set(), flipped = [], lock = false;
    let players = ["Jogador 1 🐯", "Jogador 2 🐼"], turn = 0, scores = [0, 0];
    let pendingEnd = false, timerLeft = TIMER_MAX, mistakes = 0, timerInterval = null, currentCards = [];

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const applyPalette = () => {
        const palette = paletteDd.value;
        body.className = `theme-${palette.toLowerCase()}`;
        if (darkSwitch.checked) body.classList.add('dark-mode');
    };
    const updateHeader = () => {
        chipTurn.textContent = `Vez: ${players[turn]}`;
        chipScore.textContent = `Placar: ${scores[0]} × ${scores[1]}`;
        subtitle.textContent = `${PHASE_NAMES[phaseIdx]} 🎯`;
        timeTxt.textContent = `⏱ ${Math.ceil(timerLeft)}s`;
    };
    const isPair = (i, j) => currentCards[i].pair === currentCards[j].pair && currentCards[i].type !== currentCards[j].type;
    const showDialog = (title, content, showRestart = false) => {
        dialogTitle.textContent = title;
        dialogContent.innerHTML = content.replace(/\n/g, '<br>');
        dialogRestartBtn.classList.toggle('hidden', !showRestart);
        dialogOverlay.classList.remove('hidden');
    };
    const closeDialog = () => {
        dialogOverlay.classList.add('hidden');
        if (pendingEnd) {
            pendingEnd = false;
            endPhase();
        }
    };
    const showExplanation = (pairId) => {
        const exp = currentCards.find(c => c.pair === pairId)?.explain || "";
        showDialog("Acertou o par! 🎉", exp);
    };
    const endPhase = () => {
        clearInterval(timerInterval);
        timerInterval = null;
        btnAdvance.classList.remove('hidden');
        const tRatio = timerLeft / TIMER_MAX;
        let stars = "⭐";
        if (tRatio >= 0.6 && mistakes <= 1) stars = "⭐⭐⭐";
        else if (tRatio >= 0.3 || mistakes <= 3) stars = "⭐⭐";
        const msg = `${shuffle(ENCOURAGE)[0]}\nSua pontuação da fase: ${stars}`;
        showDialog("Fase concluída! 🏆", msg);
    };
    const resetTimer = () => {
        clearInterval(timerInterval);
        timerLeft = TIMER_MAX;
        mistakes = 0;
        updateHeader();
    };
    const startTimer = () => {
        resetTimer();
        timerInterval = setInterval(() => {
            timerLeft -= 1;
            updateHeader();
            if (timerLeft <= 0) endPhase();
        }, 1000);
    };
    const buildPhase = (idx) => {
        if (idx >= PHASE_BUILDERS.length || typeof PHASE_BUILDERS[idx] !== 'function') return;
        const pairs = PHASE_BUILDERS[idx]();
        const cards = [];
        const borders = ['--border1', '--border2', '--border3', '--border4', '--border5', '--border6', '--border7', '--border8'];
        pairs.forEach(({ q, a, explic }, pid) => {
            const colorVar = borders[pid % borders.length];
            cards.push({ type: 'Q', pair: pid, text: q, explain: explic, color: colorVar });
            cards.push({ type: 'A', pair: pid, text: a, explain: explic, color: colorVar });
        });
        currentCards = shuffle(cards);
    };
    const rebuildBoard = () => {
        board.innerHTML = '';
        console.log('Building board with', currentCards.length, 'cards');
        
        currentCards.forEach((card, idx) => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'card-container';
            cardContainer.dataset.index = idx;
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const backFace = document.createElement('div');
            backFace.className = 'card-face back-face';
            backFace.textContent = '?';
            
            const frontFace = document.createElement('div');
            frontFace.className = 'card-face front-face';
            frontFace.style.borderColor = `var(${card.color})`;
            frontFace.innerHTML = `<div class="header">${card.type === 'Q' ? 'PROBLEMA ✨' : 'RESPOSTA ✨'}</div><div class="body">${card.text}</div>`;
            
            cardInner.appendChild(backFace);
            cardInner.appendChild(frontFace);
            cardContainer.appendChild(cardInner);
            cardContainer.addEventListener('click', () => handleCardClick(idx));
            
            board.appendChild(cardContainer);
        });
        
        console.log('Board children:', board.children.length);
    };
    const handleCardClick = async (idx) => {
        if (lock || matched.has(idx) || flipped.includes(idx)) return;
        const cardElem = board.children[idx];
        cardElem.classList.add('is-flipped');
        flipped.push(idx);
        if (flipped.length === 2) {
            lock = true;
            const [i, j] = flipped;
            if (isPair(i, j)) {
                matched.add(i); matched.add(j);
                scores[turn] += 1;
                updateHeader();
                if (matched.size === currentCards.length) pendingEnd = true;
                showExplanation(currentCards[i].pair);
                flipped = [];
            } else {
                mistakes += 1;
                await sleep(1000);
                board.children[i].classList.remove('is-flipped');
                board.children[j].classList.remove('is-flipped');
                flipped = [];
                turn = 1 - turn;
                updateHeader();
            }
            lock = false;
            if (matched.size === currentCards.length && !pendingEnd) endPhase();
        }
    };
    const resetPhase = () => {
        clearInterval(timerInterval);
        matched.clear(); flipped = [];
        resetTimer();
        buildPhase(phaseIdx);
        rebuildBoard();
        updateHeader();
        startTimer();
    };
    const nextPhase = () => {
        btnAdvance.classList.add('hidden');
        closeDialog();
        if (phaseIdx >= 7) {
            let res;
            if (scores[0] > scores[1]) res = `${players[0]} venceu por ${scores[0]} a ${scores[1]}!`;
            else if (scores[1] > scores[0]) res = `${players[1]} venceu por ${scores[1]} a ${scores[0]}!`;
            else res = `Empate! ${scores[0]} a ${scores[1]}!`;
            const finalMsg = `Vocês concluíram as 8 fases!\n${res}`;
            showDialog("Parabéns! 🎉", finalMsg, true);
            return;
        }
        phaseIdx++;
        resetPhase();
    };
    const restartGame = () => {
        scores = [0, 0]; turn = 0; phaseIdx = 0;
        clearInterval(timerInterval);
        closeDialog();
        btnAdvance.classList.add('hidden');
        gameScreen.classList.add('hidden');
        startPanel.classList.remove('hidden');
        confirmPanel.classList.add('hidden');
        name1Input.value = ''; name2Input.value = '';
    };
    
    const setupWhiteboard = () => {
        const canvas = document.getElementById('whiteboard-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            const activeTool = document.querySelector('.tool-btn.active');
            if(activeTool.dataset.action === 'eraser') {
                 ctx.strokeStyle = '#FFFFFF';
                 ctx.lineWidth = 20;
            } else {
                 ctx.strokeStyle = activeTool.dataset.color || '#000000';
                 ctx.lineWidth = 3;
            }
        };

        setTimeout(resizeCanvas, 0);
        window.addEventListener('resize', resizeCanvas);

        let isDrawing = false, lastX = 0, lastY = 0;

        const getCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return [clientX - rect.left, clientY - rect.top];
        };
        const startDrawing = (e) => { isDrawing = true; [lastX, lastY] = getCoords(e); };
        const draw = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const [currentX, currentY] = getCoords(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            [lastX, lastY] = [currentX, currentY];
        };
        const stopDrawing = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        const tools = document.querySelectorAll('.tool-btn');
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;

        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                
                const action = tool.dataset.action;
                if (action === 'color') {
                    ctx.strokeStyle = tool.dataset.color;
                    ctx.lineWidth = 3;
                } else if (action === 'eraser') {
                    ctx.strokeStyle = '#FFFFFF';
                    ctx.lineWidth = 20;
                } else if (action === 'clear') {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            });
        });
    };

    const initGame = () => {
        confirmPanel.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        resetPhase();
        setupWhiteboard();
    };

    paletteDd.addEventListener('change', applyPalette);
    darkSwitch.addEventListener('change', applyPalette);
    document.getElementById('process-names-btn').addEventListener('click', () => {
        players[0] = name1Input.value.trim() || "Jogador 1 🐯";
        players[1] = name2Input.value.trim() || "Jogador 2 🐼";
        document.getElementById('confirm-text').textContent = `Olá, ${players[0]} e ${players[1]}! Estão prontos para a Memória Financeira?`;
        updateHeader();
        startPanel.classList.add('hidden');
        confirmPanel.classList.remove('hidden');
    });
    document.getElementById('init-game-btn').addEventListener('click', initGame);
    document.getElementById('btn-repeat').addEventListener('click', resetPhase);
    document.getElementById('btn-restart').addEventListener('click', restartGame);
    btnAdvance.addEventListener('click', nextPhase);
    dialogOkBtn.addEventListener('click', closeDialog);
    dialogRestartBtn.addEventListener('click', restartGame);
    applyPalette();
});