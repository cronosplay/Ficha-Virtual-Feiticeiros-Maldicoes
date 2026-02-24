// --- DATABASE DE ORIGENS E REGRAS ---
const dadosOrigens = {
    "Inato": {
        titulo: "Inato",
        desc: "A origem mais comum. Nascidos com afinidade para energia amaldiçoada e uma técnica única.",
        habilidades: "• +2 em um atributo, +1 em outro.<br>• Recebe um Talento no 1° nível.<br>• Marca Registrada: 1 Feitiço adicional com custo reduzido.",
        temTecnica: true
    },
    "Herdado": {
        titulo: "Herdado",
        desc: "Poder provindo de linhagem sanguínea e clãs tradicionais.",
        habilidades: "• Bônus e Perícias baseados no Clã escolhido.<br>• Herança de Clã exclusiva.",
        temTecnica: true,
        abaExtra: "cla"
    },
    "Derivado": {
        titulo: "Derivado",
        desc: "Energia vinda de fonte externa ou antinatural (objetos amaldiçoados).",
        habilidades: "• +2 em um atributo, +1 em outro.<br>• Energia Antinatural: Recupera energia com ação bônus.<br>• Desenvolvimento Inesperado: Bônus de atributo a cada 4 níveis.",
        temTecnica: true
    },
    "Restringido": {
        titulo: "Restringido",
        desc: "Restrição Celeste: Zero energia em troca de um corpo divino.",
        habilidades: "• +1 em FOR, DES, CON e +2 extras em físicos.<br>• Imunidade a doenças e cura acelerada.<br>• Limite de atributos físicos estendido para 30.",
        temTecnica: false,
        obrigaEspecializacao: "Restringido"
    },
    "Feto Amaldiçoado Híbrido": {
        titulo: "Feto Amaldiçoado Híbrido",
        desc: "Híbrido entre humano e maldição com anatomia única.",
        habilidades: "• +2 em um atributo, +1 em outro.<br>• Vigor Maldito: Cura por ação bônus.<br>• Características de Anatomia evolutivas.",
        temTecnica: true,
        abaExtra: "anatomia"
    },
    "Sem Técnica": {
        titulo: "Sem Técnica",
        desc: "Feiticeiros que compensam a falta de dom inato com esforço extremo.",
        habilidades: "• 4 pontos de atributos para distribuir.<br>• 2 Perícias extras.<br>• Acesso ao Novo Estilo da Sombra e Domínio Simples.",
        temTecnica: false
    },
    "Corpo Amaldiçoado Mutante": {
        titulo: "Corpo Amaldiçoado Mutante",
        desc: "Forma de vida artificial com múltiplos núcleos.",
        habilidades: "• 2 pontos de atributo livres.<br>• Imunidade a veneno.<br>• Possui 3 Núcleos que podem ser trocados em combate.",
        temTecnica: true
    }
};

// --- VARIÁVEIS DE ESTADO ---
let personagem = {
    atributos: { "FORÇA": 10, "DESTREZA": 10, "CONSTITUIÇÃO": 10, "INTELIGÊNCIA": 10, "SABEDORIA": 10, "PRESENÇA": 10 },
    metodoAtributo: 'fixo',
    origem: null,
    subEscolha: null, 
    especializacao: null,
    tecnica: "",
    nome: "",
    grau: "",
    imagem: "",
    pvMax: 0
};

// --- LÓGICA DE ATRIBUTOS ---
const VALORES_FIXOS = [15, 14, 13, 12, 10, 8];
const tabelaCustos = { 8: -2, 9: -1, 10: 0, 11: 2, 12: 3, 13: 4, 14: 5, 15: 7 };

function initAtributos() {
    const container = document.getElementById('container-atributos');
    container.innerHTML = '';
    Object.keys(personagem.atributos).forEach(attr => {
        container.innerHTML += `
            <div class="attr-box">
                <div class="attr-name">${attr}</div>
                <span class="attr-value" id="val-${attr}">${personagem.atributos[attr]}</span>
                <div class="controls" id="ctrl-${attr}">
                    <button type="button" class="btn-control" onclick="alterarAtributo('${attr}', -1)">▼</button>
                    <button type="button" class="btn-control" onclick="alterarAtributo('${attr}', 1)">▲</button>
                </div>
            </div>`;
    });
    atualizarInterfaceAtributos();
}

function alterarAtributo(attr, direcao) {
    if (personagem.metodoAtributo === 'fixo') {
        let idx = VALORES_FIXOS.indexOf(personagem.atributos[attr]);
        let novoIdx = idx - direcao;
        if (novoIdx >= 0 && novoIdx < VALORES_FIXOS.length) {
            personagem.atributos[attr] = VALORES_FIXOS[novoIdx];
            document.getElementById(`val-${attr}`).innerText = personagem.atributos[attr];
        }
    } else if (personagem.metodoAtributo === 'compra') {
        let novoVal = personagem.atributos[attr] + direcao;
        if (novoVal < 8 || novoVal > 15) return;
        let copia = { ...personagem.atributos, [attr]: novoVal };
        let custo = 0;
        Object.values(copia).forEach(v => custo += tabelaCustos[v]);
        if (custo <= 17) {
            personagem.atributos[attr] = novoVal;
            document.getElementById(`val-${attr}`).innerText = novoVal;
            document.getElementById('pontos-restantes').innerText = 17 - custo;
        }
    }
}
// Carrega o som (certifique-se que o arquivo dados.mp3 está na pasta raiz)
const somDados = new Audio('dados.mp3');

function setMetodo(m) {
    personagem.metodoAtributo = m;
    if (m === 'fixo') {
        personagem.atributos = { "FORÇA": 15, "DESTREZA": 14, "CONSTITUIÇÃO": 13, "INTELIGÊNCIA": 12, "SABEDORIA": 10, "PRESENÇA": 8 };
    } else {
        personagem.atributos = { "FORÇA": 10, "DESTREZA": 10, "CONSTITUIÇÃO": 10, "INTELIGÊNCIA": 10, "SABEDORIA": 10, "PRESENÇA": 10 };
    }
    initAtributos();
}

function rolarTodosAtributos() {
    // Tocar o som toda vez que o botão for clicado
    somDados.currentTime = 0; // Reinicia o som caso clique rápido
    somDados.play().catch(e => console.log("Erro ao tocar som:", e));

    Object.keys(personagem.atributos).forEach(attr => {
        // Lógica de 4d6 (descarta o menor)
        let d = [0,0,0,0].map(() => Math.floor(Math.random() * 6) + 1).sort((a,b) => a-b);
        d.shift(); 
        
        personagem.atributos[attr] = d.reduce((a,b) => a+b, 0);
        
        // Atualiza o valor na tela
        const el = document.getElementById(`val-${attr}`);
        if (el) {
            el.innerText = personagem.atributos[attr];
            
            // Adiciona um efeito visual de brilho temporário ao rolar
            el.classList.add('glow-rolagem');
            setTimeout(() => el.classList.remove('glow-rolagem'), 500);
        }
    });
}



function atualizarInterfaceAtributos() {
    document.getElementById('fixo-info').classList.toggle('hidden', personagem.metodoAtributo !== 'fixo');
    document.getElementById('compra-info').classList.toggle('hidden', personagem.metodoAtributo !== 'compra');
    document.getElementById('rolagem-actions').classList.toggle('hidden', personagem.metodoAtributo !== 'rolagem');
    document.querySelectorAll('.controls').forEach(c => c.style.visibility = (personagem.metodoAtributo === 'rolagem') ? 'hidden' : 'visible');
}
// 1. Função para abrir e fechar os cards (Acordeão)
function toggleOrigin(id) {
    const card = document.getElementById(`card-${id}`);
    const isActive = card.classList.contains('active');
    
    // Fecha todos os outros cards antes de abrir o novo
    document.querySelectorAll('.origin-card-expandable').forEach(c => {
        c.classList.remove('active');
    });
    
    // Se o clicado não estava aberto, ele abre agora
    if (!isActive) {
        card.classList.add('active');
    }
}

// 2. Função para selecionar a origem (Brilho + Marca + Salvar)
function confirmarOrigem(key, destino) {
    // Remove a classe 'selected' de todos os cards (apaga o brilho e a marca)
    document.querySelectorAll('.origin-card-expandable').forEach(card => {
        card.classList.remove('selected');
    });

    // Adiciona a classe 'selected' no card clicado (ativa o CSS roxo)
    const cardSelecionado = document.getElementById(`card-${key}`);
    if (cardSelecionado) {
        cardSelecionado.classList.add('selected');
    }

    // Salva a escolha no seu objeto de personagem
    personagem.origem = key;
    personagem.proximoPasso = destino; // Salva se vai para 'cla', 'anatomia' ou 'next'

    // Ativa o botão de "Próximo" da navegação principal
    const btnNext = document.getElementById('btn-origem-next');
    if (btnNext) {
        btnNext.disabled = false;
        // Muda o texto do botão para avisar o próximo passo
        if (destino === 'cla') btnNext.innerHTML = 'ESCOLHER CLÃ &rarr;';
        else if (destino === 'anatomia') btnNext.innerHTML = 'DEFINIR ANATOMIA &rarr;';
        else btnNext.innerHTML = 'AVANÇAR &rarr;';
    }
}

// 3. Função que o botão de "Próximo" chama para mudar de aba
function avancarStepDasOrigens() {
    if (!personagem.origem) return;

    if (personagem.proximoPasso === 'cla') {
        renderSubOpcoes('cla', ["Gojo", "Inumaki", "Kamo", "Zenin"]);
        nextStep('cla');
    } else if (personagem.proximoPasso === 'anatomia') {
        renderSubOpcoes('anatomia', [
            "Alma Maldita", "Anatomia Incompreensível", "Arma Natural", 
            "Articulações Extensas", "Braços Extras", "Capacidade de Voo", 
            "Carapaça Mutante", "Sangue Tóxico"
        ]);
        nextStep('anatomia');
    } else {
        nextStep(3); // Vai para Especialização
    }
}

function selecionarTecnica(nome, idSimples) {
    // Remove seleção visual de todos
    document.querySelectorAll('.tecnica-card').forEach(c => c.classList.remove('selected'));
    
    // Adiciona brilho ao card clicado
    const card = document.getElementById(`card-${idSimples}`);
    if (card) card.classList.add('selected');
    
    // Salva no objeto
    personagem.tecnica = nome;
    
    // Habilita o próximo passo
    document.getElementById('btn-tecnica-next').disabled = false;
}

function selecionarTecnicaCustom() {
    const nome = document.getElementById('input-tecnica-custom').value;
    const desc = document.getElementById('desc-tecnica-custom').value;
    
    if (!nome) {
        alert("Sua técnica precisa de um nome!");
        return;
    }
    
    document.querySelectorAll('.tecnica-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('card-custom').classList.add('selected');
    
    personagem.tecnica = `Original: ${nome}`;
    personagem.tecnicaDesc = desc; // Guardando a descrição também
    
    document.getElementById('btn-tecnica-next').disabled = false;
}

function confirmarCla(nomeCla, idSimples) {
    // Remove seleção visual de todos os cards de clã
    document.querySelectorAll('#step-cla .origin-card-expandable').forEach(card => {
        card.classList.remove('selected');
    });

    // Adiciona o brilho roxo no selecionado
    const cardSelecionado = document.getElementById(`card-${idSimples}`);
    if (cardSelecionado) {
        cardSelecionado.classList.add('selected');
    }

    // Salva no objeto do personagem
    personagem.cla = nomeCla;

    // Habilita o botão de próximo
    const btnNext = document.getElementById('btn-cla-next');
    btnNext.disabled = false;
    btnNext.innerHTML = `PROSSEGUIR COM ${nomeCla.toUpperCase()} &rarr;`;
}

function confirmarAnatomia(nome, idSimples) {
    // 1. Remove seleção visual de todos os cards de ANATOMIA
    const secaoAnatomia = document.getElementById('step-anatomia');
    secaoAnatomia.querySelectorAll('.origin-card-expandable').forEach(card => {
        card.classList.remove('selected');
    });

    // 2. Adiciona o brilho roxo apenas no que você clicou
    const cardAtual = document.getElementById(`card-${idSimples}`);
    if (cardAtual) {
        cardAtual.classList.add('selected');
    }

    // 3. Salva a escolha no objeto global
    if (typeof personagem !== 'undefined') {
        personagem.anatomia = nome;
    }
    
    // 4. Localiza o botão de avançar desta etapa específica
    const btnNext = document.getElementById('btn-anatomia-next');
    if (btnNext) {
        btnNext.disabled = false; // Libera o clique
        btnNext.style.opacity = "1"; // Garante que visualmente pareça clicável
        btnNext.innerHTML = `PROSSEGUIR COM ${nome.toUpperCase()} &rarr;`;
    }
}

// Função para o botão voltar retornar à tela de Origens
function voltarParaOrigem() {
    document.getElementById('step-cla').classList.add('hidden');
    document.getElementById('step-origens').classList.remove('hidden'); // Ajuste o ID conforme seu projeto
}


// --- NAVEGAÇÃO ---
function nextStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`step-${n}`);
    if(target) target.classList.remove('hidden');
    
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const navItem = document.getElementById(`st-${n}`);
    if(navItem) navItem.classList.add('active');
    
    window.scrollTo(0,0);
}

function voltarPasso(n) { nextStep(n); }


function selecionarClasse(nome) {
    personagem.especializacao = nome;
    
    // PV Inicial
    let pvBase = (nome === 'Restringido') ? 16 : (nome === 'Lutador' || nome === 'Especialista em Combate' ? 12 : 10);
    personagem.pvMax = pvBase + (personagem.atributos.CONSTITUIÇÃO || 0);
    
    console.log(`Classe: ${nome} | PV: ${personagem.pvMax}`);
    irParaTecnica();
}

function renderSubOpcoes(tipo, lista) {
    const container = document.getElementById(`${tipo}-selector-container`);
    if(!container) return;
    container.innerHTML = lista.map(item => `
        <button type="button" class="btn-metodo" onclick="salvarSubEscolha('${item}', this)">${item}</button>
    `).join('');
}

function salvarSubEscolha(val, btn) {
    personagem.subEscolha = val;
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function irParaEspecializacao() { nextStep(3); }

function irParaTecnica() {
    const o = dadosOrigens[personagem.origem];
    if (o && o.temTecnica === false) nextStep(5); 
    else nextStep(4);
}

// --- VOLTAR LÓGICA REVERSA ---
function voltarDeEspecializacao() {
    const o = dadosOrigens[personagem.origem];
    if (o && o.abaExtra) nextStep(o.abaExtra);
    else nextStep(2);
}

// --- SALVAMENTO FINAL E REDIRECIONAMENTO ---
function finalizarFicha() {
    console.log("Iniciando salvamento...");

    // 1. Referências dos Elementos
    const elNome = document.getElementById('nome-feiticeiro') || document.getElementById('nome-personagem');
    const elJogador = document.getElementById('nome-jogador');
    const elGrau = document.getElementById('grau-feiticeiro');
    const elImagem = document.getElementById('imagem-feiticeiro');

    // 2. Dados Básicos e ID Único
    personagem.id = Date.now().toString(); 
    personagem.nome = (elNome && elNome.value.trim() !== "") ? elNome.value : "Feiticeiro Sem Nome";
    personagem.jogador = elJogador ? elJogador.value : "Desconhecido";
    personagem.grau = elGrau ? elGrau.value : "4º Grau";

    // 3. Lógica da Imagem (Pasta img/)
    let imgValue = elImagem ? elImagem.value.trim() : "";
    if (imgValue === "") {
        personagem.imagem = "img/avatar.png"; 
    } else {
        personagem.imagem = imgValue.startsWith('img/') ? imgValue : `img/${imgValue}`;
    }

    // 4. Sincronização de Atributos
    personagem.atributos_base = {
        for: personagem.atributos["FORÇA"],
        des: personagem.atributos["DESTREZA"],
        con: personagem.atributos["CONSTITUIÇÃO"],
        int: personagem.atributos["INTELIGÊNCIA"],
        sab: personagem.atributos["SABEDORIA"],
        pre: personagem.atributos["PRESENÇA"]
    };

    // 5. Campos de Descrição (O que estava faltando!)
    personagem.aparencia = document.getElementById('desc-aparencia')?.value || "";
    personagem.historico = document.getElementById('desc-historico')?.value || "";
    personagem.personalidade = document.getElementById('desc-personalidade')?.value || "";
    personagem.objetivo = document.getElementById('desc-objetivo')?.value || "";

    if (!personagem.tecnica) personagem.tecnica = "Nenhuma";

    // 6. Salvamento em Lista e Personagem Atual
    let fichas = JSON.parse(localStorage.getItem('fichas')) || [];
    fichas.push(personagem);
    localStorage.setItem('fichas', JSON.stringify(fichas));
    localStorage.setItem('personagem_atual', JSON.stringify(personagem));

    console.log("Ficha salva com ID: " + personagem.id);
    
    // 7. Redirecionar para o Dashboard (ou ficha.html se preferir abrir direto)
    window.location.href = 'dashboard.html';
}

// Remova o addEventListener('submit') antigo que estava dando erro e use apenas a função acima no botão.

// --- SALVAMENTO FINAL ---
document.getElementById('form-criacao').addEventListener('submit', (e) => {
    e.preventDefault();
    personagem.nome = document.getElementById('nome-feiticeiro').value;
    personagem.grau = document.getElementById('grau-feiticeiro').value;
    personagem.imagem = document.getElementById('imagem-feiticeiro').value;
    personagem.tecnica = document.getElementById('input-tecnica')?.value || "Nenhuma";

    let fichas = JSON.parse(localStorage.getItem('fichas')) || [];
    fichas.push(personagem);
    localStorage.setItem('fichas', JSON.stringify(fichas));

    alert("Feiticeiro Registrado!");
    window.location.href = 'dashboard.html';
});

window.onload = () => {
    if (typeof initAtributos === "function") initAtributos();
    // Se a função initOrigens não existir, o JS não vai mais tentar chamar e dar erro.
    if (typeof initOrigens === "function") initOrigens(); 
};