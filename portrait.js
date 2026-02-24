const urlParams = new URLSearchParams(window.location.search);
// Se você não passar ID na URL, ele usa 'personagem_atual' por padrão
const fichaId = urlParams.get('id') || 'personagem_atual';

function sincronizarPortrait() {
    // AQUI ESTÁ O SEGREDO: Ele busca o ID específico da URL
    const dadosBrutos = localStorage.getItem(fichaId);
    
    if (!dadosBrutos) {
        // Se não encontrar o personagem, ele limpa os textos para avisar
        const peElemento = document.getElementById('pe-valor');
        if (peElemento) peElemento.innerText = "?";
        return;
    }

    const dados = JSON.parse(dadosBrutos);
    const sc = dados.status_combate;
    if (!sc) return;

    // 1. Atualiza a Foto
    const imgElement = document.getElementById('view-img');
    if (imgElement && dados.imagem) {
        if (imgElement.getAttribute('src') !== dados.imagem) {
            imgElement.src = dados.imagem;
        }
    }

    // 2. Atualiza Vida e Integridade (Direita)
    const pvTexto = document.getElementById('pv-texto');
    const piTexto = document.getElementById('pi-texto');
    
    if (pvTexto) pvTexto.innerText = `${sc.pv_atual || 0}/${sc.pv_max || 0}`;
    if (piTexto) piTexto.innerText = `${sc.pi_atual || 0}/${sc.pi_max || 0}`;

// 3. RECURSO (Número Grande na Esquerda)
const peElemento = document.getElementById('pe-valor');
if (peElemento) {
    const esp = (dados.especializacao || "").toLowerCase();
    let valorRecurso = 0;

    // Se for Restringido, ele NÃO tem energia, então usamos Estamina
    if (esp.includes("restringido")) {
        valorRecurso = sc.estamina_atual || sc['estamina-atual'] || 0;
    } 
    // PARA TODOS OS OUTROS (Especialista em Combate, em Técnicas, etc.)
    // Usamos sempre a Energia Amaldiçoada (PE)
    else {
        valorRecurso = sc.pe_atual || sc['pe-atual'] || 0; 
    }

    peElemento.innerText = valorRecurso;
}
}
// Escuta mudanças específicas no storage
window.addEventListener('storage', (e) => {
    if (e.key === fichaId) {
        sincronizarPortrait();
    }
});

// Inicializa
try {
    sincronizarPortrait();
} catch (e) {
    console.warn("Aguardando carregamento...");
}

setInterval(sincronizarPortrait, 1000);
// --- SISTEMA DE LOGS NO PORTRAIT ---

window.addEventListener('storage', (e) => {
    // Pega o ID da URL (ex: ?id=Gojo)
    const urlParams = new URLSearchParams(window.location.search);
    const personagemID = urlParams.get('id') || "personagem_1";
    
    // Verifica se a mudança foi no log deste personagem específico
    if (e.key === `log_${personagemID}`) {
        if (!e.newValue) return;
        const info = JSON.parse(e.newValue);
        criarCardLogPortrait(info);
    }
});

// --- FUNÇÃO DE LOG (O DADO) ---
function criarCardLogPortrait(info) {
    let container = document.getElementById('portrait-log-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'portrait-log-container';
        document.body.appendChild(container);
    }

    container.innerHTML = ""; 

    const card = document.createElement('div');
    card.className = "dado-card";
    
    // Configura a transição para opacidade e movimento
    card.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";

    card.innerHTML = `
        <div style="position: relative; width: 90px; height: 90px; flex-shrink: 0;">
            <img src="img/d20.png" style="
                width: 100%; height: 100%; 
                filter: brightness(0) drop-shadow(0 0 12px ${info.cor});
            ">
            <span style="
                position: absolute;
                top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                font-family: 'ZapfHumanist', sans-serif;
                font-size: 2.2rem; 
                color: #ffffff; 
                text-shadow: 0 0 5px #fff, 0 0 15px ${info.cor}, 0 0 25px ${info.cor};
            ">
                ${info.total}
            </span>
        </div>
    `;

    container.appendChild(card);

    // --- LÓGICA DO FADE OUT ---

    // 1. Aos 4.2 segundos, inicia o desvanecimento (Fade Out)
    // Usamos 4.2s para que a transição de 0.8s termine cravada em 5s
    setTimeout(() => {
        card.style.opacity = "0";
        card.style.transform = "translateY(-20px)"; // Ele sobe suavemente enquanto some
    }, 4200);

    // 2. Aos 5 segundos, remove o elemento do código para não pesar
    setTimeout(() => {
        card.remove();
    }, 5000);
}

// --- ATUALIZAÇÃO DOS STATUS (CHAMAR NO ONLOAD OU ATUALIZAR) ---
function atualizarEstiloStatus() {
    // Aplica as classes neon nos elementos da sua tela
    // Certifique-se que os IDs no seu HTML batem com esses:
    document.getElementById('pv-valor')?.classList.add('neon-text', 'neon-pv');
    document.getElementById('pi-valor')?.classList.add('neon-text', 'neon-pi');
    document.getElementById('pe-valor')?.classList.add('neon-text', 'neon-pe');
}