function renderizarCards() {
    const lista = document.getElementById('lista-fichas');
    const inputBusca = document.getElementById('input-busca');
    const displayContador = document.getElementById('total-feiticeiros');
    
    const fichas = JSON.parse(localStorage.getItem('fichas')) || [];
    
    if (displayContador) {
        displayContador.innerText = `Feiticeiros: ${fichas.length}/15`;
    }

    if (!lista) return; 
    lista.innerHTML = "";

    // Pega o termo de busca com segurança
    const termo = (inputBusca && inputBusca.value) ? inputBusca.value.toLowerCase() : "";

    const fichasFiltradas = fichas.filter(f => (f.nome || "").toLowerCase().includes(termo));

    fichasFiltradas.forEach(ficha => {
        let dataRegistro = ficha.id ? new Date(parseInt(ficha.id)).toLocaleDateString('pt-BR') : "---";
        let imagemFicha = ficha.imagem || 'img/avatar.png';

        lista.innerHTML += `
            <div class="card-ficha">
                <div class="card-img-container">
                    <img src="${imagemFicha}" onerror="this.src='img/avatar.png'">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${ficha.nome || 'Sem Nome'}</h3>
                        <div class="menu-container">
                            <button class="btn-config" onclick="toggleMenu(event, '${ficha.id}')">⚙️</button>
                            <div id="dropdown-${ficha.id}" class="dropdown-menu">
                                <button class="dropdown-item" onclick="compartilharFicha('${ficha.id}')">📤 Compartilhar</button>
                                <button class="dropdown-item" onclick="duplicarFicha('${ficha.id}')">📋 Duplicar</button>
                                <button class="dropdown-item" onclick="abrirPortrait('${ficha.id}')">🎥 Portrait (OBS)</button>
                                <button class="dropdown-item delete" onclick="confirmarDelecao(event, '${ficha.id}')">🗑️ Deletar</button>
                            </div>
                        </div>
                    </div>
                    <p>${ficha.especializacao || 'Feiticeiro'}</p>
                    <p style="font-size: 0.7rem; opacity: 0.5;">Registrado em ${dataRegistro}</p>
                    <button class="btn-acessar" onclick="verFicha('${ficha.id}')">Acessar Ficha</button>
                </div>
            </div>
        `;
    });
}

// --- FUNÇÕES DE MENU ---

function toggleMenu(event, id) {
    event.stopPropagation();
    document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m.id !== `dropdown-${id}`) m.classList.remove('show');
    });
    document.getElementById(`dropdown-${id}`).classList.toggle('show');
}

window.onclick = () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
};

// --- FUNÇÕES DE AÇÃO ---

// NOVA FUNÇÃO: Abre a janelinha do Portrait
function abrirPortrait(id) {
    const url = `portrait.html?id=${id}`;
    // Abre em uma janela popup pequena
    window.open(url, `portrait_${id}`, 'width=500,height=300,menubar=no,status=no');
}

function duplicarFicha(id) {
    let fichas = JSON.parse(localStorage.getItem('fichas')) || [];
    const fichaOriginal = fichas.find(f => String(f.id) === String(id));
    if (fichaOriginal) {
        const novaFicha = { ...fichaOriginal, id: Date.now().toString(), nome: fichaOriginal.nome + " (Cópia)" };
        fichas.push(novaFicha);
        localStorage.setItem('fichas', JSON.stringify(fichas));
        renderizarCards();
    }
}

function confirmarDelecao(event, id) {
    event.stopPropagation();
    if (confirm("Deseja apagar este feiticeiro?")) {
        let fichas = JSON.parse(localStorage.getItem('fichas')) || [];
        fichas = fichas.filter(f => String(f.id) !== String(id));
        localStorage.setItem('fichas', JSON.stringify(fichas));
        renderizarCards();
    }
}

function verFicha(id) {
    const fichas = JSON.parse(localStorage.getItem('fichas')) || [];
    const ficha = fichas.find(f => String(f.id) === String(id));
    if (ficha) {
        localStorage.setItem('personagem_atual', JSON.stringify(ficha));
        window.location.href = 'ficha.html';
    }
}

window.onload = renderizarCards;