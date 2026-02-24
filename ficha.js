const somDados = new Audio('dados.mp3');
somDados.volume = 0.5; // Ajuste o volume de 0 a 1 aqui
let personagem = JSON.parse(localStorage.getItem("personagem_atual")) || {};


// Garante que o array de técnicas exista
if (!personagem.tecnicas) {
    personagem.tecnicas = [];
    localStorage.setItem("personagem_atual", JSON.stringify(personagem));
}

// --- 1. CONFIGURAÇÕES GERAIS ---
const dadosClasses = {
    'lutador': { pvIni: 12, pvNv: 6, peNv: 4, usaAtributo: false },
    'especialista em combate': { pvIni: 12, pvNv: 6, peNv: 4, usaAtributo: false },
    'especialista em técnica': { pvIni: 10, pvNv: 5, peNv: 6, usaAtributo: true },
    'controlador': { pvIni: 12, pvNv: 5, peNv: 5, usaAtributo: true },
    'suporte': { pvIni: 12, pvNv: 5, peNv: 5, usaAtributo: true },
    'restringido': { pvIni: 16, pvNv: 7, peNv: 0, isStamina: true }
};

const mapaPericias = {
    'acrobacia': 'des', 'crime': 'des', 'furtividade': 'des', 'iniciativa': 'des',
    'pilotagem': 'des', 'pontaria': 'des', 'reflexos': 'des', 'atletismo': 'for',
    'luta': 'for', 'fortitude': 'con','feitiçaria': 'int', 'astúcia': 'int', 'atualidades': 'int', 'ciencias': 'int',
    'investigacao': 'int', 'ocultismo': 'int', 'tatica': 'int', 'tecnologia': 'int',
    'integridade': 'pre','adestramento': 'pre', 'artes': 'pre', 'diplomacia': 'pre', 'enganacao': 'pre',
    'intimidacao': 'pre', 'religiao': 'pre', 'intuicao': 'sab', 'medicina': 'sab',
    'percepcao': 'sab', 'sobrevivencia': 'sab', 'vontade': 'sab'
};

const custoPorNivel = {
    0: 0,
    1: 2,
    2: 5,
    3: 8,
    4: 12,
    5: 20
};

const compendioTecnicas = [

{
    nome: "Lapso Azul: Atração",
    categoria: "ILIMITADO",
    nivel: 0,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "9 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 9 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Sendo essa a forma mais básica do Azul, você utiliza o poder de atração
    para puxar um alvo até você.

    O alvo deve realizar um teste de <strong>Fortitude</strong>.
    ` + criarEscalaPorNivel("Lapso Azul: Atração", [
        {
            dano: "1d10",
            extra: "Atraí 4,5m • Sucesso anula dano"
        },
        {
            dano: "2d8",
            extra: "Atraí 6m • Sucesso metade"
        },
        {
            dano: "6d8",
            extra: "Atraí 9m • Sucesso metade"
        },
        {
            dano: "11d8",
            extra: "Atraí 12m • Sucesso metade"
        },
        {
            dano: "13d10",
            extra: "Atraí 15m • Sucesso metade"
        },
        {
            dano: "17d12",
            extra: "Atraí 24m • Sucesso metade"
        }
    ])
},

{
nome: "Movimento Imediato",
categoria: "ILIMITADO",
nivel: 1,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Bônus<br>
<strong>Alcance:</strong> 9 Metros<br>
<strong>Alvo:</strong> Um espaço desocupado<br>
<strong>Duração:</strong> Imediata<br><br>

Você realiza uma movimentação extremamente rápida, semelhante a um pequeno teleporte.

Ao usar essa habilidade, você se move imediatamente para um espaço desocupado dentro de 9 metros.

Esse movimento não provoca ataques de oportunidade.
`,
requisito: ""
},

{
nome: "Azul: Afunde!",
categoria: "ILIMITADO",
nivel: 1,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Comum<br>
<strong>Alcance:</strong> 9 Metros<br>
<strong>Área:</strong> Círculo de 4,5m<br>
<strong>Duração:</strong> Imediata<br><br>

Você cria uma área onde o Azul constantemente puxa os alvos para baixo.

Todos na área devem realizar teste de <strong>Fortitude</strong>.

Em falha, recebem a condição <strong>Caído</strong>.  
Em sucesso, ignoram a condição.
`,
requisito: ""
},

{
    nome: "Azul: Atração de Objeto",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "12 Metros",
    alvo: "6 Metros em Linha",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 12 Metros<br>
    <strong>Alvo:</strong> 6 Metros em Linha<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você pode escolher imbuir um objeto com energia amaldiçoada e arremessá-lo
    em direção aos alvos dentro do combate. Para cada classe de objeto acima do médio,
    você gasta 1 ponto adicional de energia e causa dano baseado no tamanho do objeto.
    Cada nível de tamanho de estrutura causa 2d10 de dano.
    ` + criarEscalaPorNivel("Azul: Atração de Objeto", [

        {
            dano: "2d10",
            extra: "Tamanho grande • 2 pontos extra para objetos maiores"
        },
    ])
},

{
    nome: "Azul: Atração Constante",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você constantemente usa o azul em seus punhos, atraindo no exato momento em que
    vai desferir um golpe com eles. Sempre que desferir um golpe desarmado com esta
    habilidade ativa, ele causa dano energético adicional. 

    Você pode optar por sustentar a habilidade ao invés de usá-la de forma imediata,
    causando menor dano, mas pagando 1 ponto de energia (P.E) por turno para mantê-la ativa.
    ` + criarEscalaPorNivel("Azul: Atração Constante", [
        {
            dano: "2d6",
            extra: "Dano imediato nível 1 • Sustentado 1d10 pagando 1 P.E/turno"
        },
        {
            dano: "3d8",
            extra: "Dano imediato nível 2 • Sustentado 2d8 pagando 1 P.E/turno"
        },
        {
            dano: "3d10",
            extra: "Dano imediato nível 3 • Sustentado 3d8 pagando 2 P.E/turno"
        },
        {
            dano: "4d10",
            extra: "Dano imediato nível 4 • Sustentado 3d10 pagando 2 P.E/turno"
        },
        {
            dano: "5d12",
            extra: "Dano imediato nível 5 • Sustentado 4d12 pagando 2 P.E/turno"
        }
    ])
},



{
    nome: "Azul: Compressão",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 18 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza o azul para comprimir o espaço ao redor de uma criatura, amassando-a.
    A criatura alvo deve realizar um teste de resistência de <strong>Fortitude</strong>.
    Em caso de falha, recebe dano completo; em caso de sucesso, recebe apenas metade.
    ` + criarEscalaPorNivel("Azul: Compressão", [
        {
            dano: "7d8",
            extra: "Dano completo falha • Sucesso metade"
        },
    ])
},

{
    nome: "Azul: Colisão",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "18 Metros",
    alvo: "Duas Criaturas",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 18 Metros<br>
    <strong>Alvo:</strong> Duas Criaturas<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você cria dois pontos de atração em duas criaturas diferentes, forçando uma colisão
    entre elas. Ambas as criaturas devem realizar um teste de resistência de <strong>Fortitude</strong>,
    recebendo 2d8 de dano energético e sendo puxadas uma na direção da outra. 

    A colisão causa dano adicional igual a 1d8 de dano energético para cada categoria
    de tamanho das criaturas envolvidas acima de minúsculo (por exemplo, a colisão de duas
    criaturas médias causaria 4d8 de dano).
    ` + criarEscalaPorNivel("Azul: Colisão", [
        {
            dano: "2d8",
            extra: "Dano inicial + colisão por tamanho • Sucesso reduz dano inicial pela metade"
        }
    ])
},



{
nome: "Desvio Imediato",
categoria: "ILIMITADO",
nivel: 2,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Reação<br>
<strong>Alvo:</strong> Próprio<br>
<strong>Duração:</strong> Imediata<br><br>

Duração: Imediata
Você utiliza do azul para puxar o seu corpo imediatamente para fora do caminho de
um golpe corpo-a-corpo. Como uma reação ao receber um ataque corpo-a-corpo, você
utiliza do azul para desviar parcialmente do golpe Recebe <strong>13 de RD</strong> contra o ataque e é puxado 3 metros, sem provocar ataques de oportunidade.
`,
requisito: ""
},

{
nome: "Azul: Atração para Impacto",
categoria: "ILIMITADO",
nivel: 2,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Bônus<br>
<strong>Alcance:</strong> 18 Metros<br>
<strong>Alvo:</strong> Único<br>
<strong>Duração:</strong> Imediata<br><br>

Você utiliza o Azul para atrair um alvo até você ou até um aliado escolhido, forçando um impacto amplificado.

O alvo deve realizar um teste de <strong>Fortitude</strong>.

Em uma falha, ele é puxado por toda a extensão do alcance da técnica até o usuário ou ao aliado escolhido.

Para cada <strong>4,5 metros percorridos</strong>, o alvo recebe <strong>+1 nível de dano</strong> ao próximo ataque que sofrer ao atingir o destino.
`,
requisito: ""
},

{
    nome: "Azul: Ponto de Atração",
    categoria: "ILIMITADO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "24 Metros",
    alvo: "Um Ponto",
    duracao: "Sustentada",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 24 Metros<br>
    <strong>Alvo:</strong> Um Ponto<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Você cria um azul em um ponto dentro de 24 metros, transformando-o em uma força
    atrativa constante. O ponto de atração afeta uma área esférica de 6 metros e todas
    as criaturas dentro da área devem realizar um teste de resistência de <strong>Fortitude</strong>.
    Em caso de falha, recebem 5d12 de dano energético ou metade em um sucesso.

    Caso falhe, a criatura também é puxada para o centro da área, recebendo a condição <strong>Imóvel</strong> por uma rodada.
    Para cada rodada após a primeira, você deve pagar 2 pontos de energia amaldiçoada para sustentar o ponto de atração.

    Enquanto o ponto estiver sendo sustentado:
    <ul>
        <li>Criaturas dentro da área recebem a condição <strong>Lento</strong></li>
        <li>A área conta como <strong>terreno difícil</strong></li>
        <li>Se uma criatura terminar seu turno dentro da área, mas distante do centro, deve repetir o teste de Fortitude, sendo puxada novamente em uma falha</li>
    </ul>
    ` + criarEscalaPorNivel("Azul: Ponto de Atração", [
        {
            dano: "5d12",
            extra: "Falha: dano completo + puxado ao centro e Imóvel 1 rodada • Sucesso: metade"
        }
    ])
},

{
nome: "Teleporte de Longa Distância",
categoria: "ILIMITADO",
nivel: 3,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Comum<br>
<strong>Duração:</strong> Imediata<br><br>

Você comprime o espaço e se teleporta para um local que conheça.

Pode levar criaturas ou objetos que esteja tocando.
`,
requisito: ""
},

{
    nome: "Azul: Golpe Forçado",
    categoria: "ILIMITADO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "24 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 24 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza o azul para atrair um alvo até você. O alvo deve realizar um teste de 
    <strong>Fortitude</strong>. Em caso de falha, ele é puxado até você e, ao chegar, você realiza
    um teste de <strong>Corpo a Corpo</strong>. Em um sucesso, você acerta o alvo com um poderoso
    chute, arremessando-o para cima e causando 9d8 de dano de impacto.

    Ao arremessar o alvo para cima, você pode gastar sua <strong>Reação</strong> para avançar e realizar
    outro ataque, teste de luta ou feitiçaria. Em um sucesso, causa 3d8 de dano adicional. 
    O alvo atingido dessa forma recebe a condição <strong>Caído</strong>.
    ` + criarEscalaPorNivel("Azul: Golpe Forçado", [
        {
            dano: "9d8",
            extra: "Dano do chute + 3d8 adicional se a reação for bem-sucedida • Sucesso no teste de Fortitude reduz apenas o puxão"
        }
    ])
},

{
nome: "Azul: Chacoalhar",
categoria: "ILIMITADO",
nivel: 3,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Bônus<br>
<strong>Alcance:</strong> 24 Metros<br>
<strong>Alvo:</strong> Único<br>
<strong>Duração:</strong> Imediata<br><br>

Você utiliza o Azul para chacoalhar violentamente o alvo por toda a extensão da técnica.

O alvo deve realizar um teste de <strong>Fortitude</strong>.

Durante o movimento, caso colida com alguma estrutura, ele sofre dano conforme a tabela de <strong>Dano de Fontes Variadas</strong> (página 338 do livro básico).

Ao final da técnica, independentemente do resultado do teste, o alvo recebe a condição <strong>Enjoado</strong> por 1 rodada.
`,
requisito: ""
},


{
    nome: "Azul: Implosão Absoluta",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "6 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 6 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você causa a implosão absoluta de uma criatura, utilizando o azul para comprimir ao máximo
    o espaço ao redor dela. A criatura alvo deve realizar um teste de resistência de <strong>Fortitude</strong>.
    Em caso de falha, recebe 3d10 de dano; em caso de sucesso, recebe apenas metade.

    Caso a criatura falhe no teste, você consegue comprimir extremamente seu corpo, fazendo
    com que ela receba uma das <strong>consequências complexas</strong> descritas na página 314.
    ` + criarEscalaPorNivel("Azul: Implosão Absoluta", [
        {
            dano: "3d10",
            extra: "Falha: dano completo + consequência complexa • Sucesso: metade do dano"
        },
        {
            dano: "4d10",
            extra: "Nível 5: dano aumentado + consequência complexa • Sucesso: metade do dano"
        }
    ])
},

{
nome: "Criação de Imagens",
categoria: "ILIMITADO",
nivel: 4,
desc: `
<strong>Habilidade Feitiço</strong><br>
<strong>Conjuração:</strong> Ação Comum<br>
<strong>Alcance:</strong> Próprio<br>
<strong>Alvo:</strong> Próprio<br>
<strong>Duração:</strong> Imediata<br><br>

Movendo-se em velocidade extrema, você cria inúmeras imagens residuais que replicam seus movimentos, confundindo seus inimigos.

Ao ativar a habilidade, múltiplas imagens passam a acompanhá-lo.

Caso você seja alvo de um ataque, o atacante deve realizar um teste de resistência de <strong>Astúcia</strong>.

Em uma falha, ele ataca uma das imagens, anulando completamente o ataque e dissipando a imagem atingida.

Além disso, ao realizar uma ação de ataque, caso ainda haja pelo menos uma imagem ativa, você recebe <strong>+5 na rolagem de ataque</strong>, utilizando as imagens para simular movimentos e confundir o alvo.
`,
requisito: ""
},

{
    nome: "Azul: Catástrofe",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "12 Metros (Círculo)",
    alvo: "Todos no Alcance",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 12 Metros (Círculo)<br>
    <strong>Alvo:</strong> Todos no Alcance<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza o azul em sua forma quase máxima, fazendo com que toda uma área
    tenha uma atração constante, forçando todos os alvos a colidirem no centro.
    Todos devem realizar um teste de resistência de <strong>Fortitude</strong>.

    Em caso de falha, cada alvo recebe 10d10 de dano energético e colide com os outros
    no centro da técnica. A colisão causa dano adicional igual a 1d10 de dano energético
    para cada categoria de tamanho das criaturas envolvidas acima de minúsculo
    (por exemplo, a colisão de duas criaturas médias causaria 4d10 de dano).
    ` + criarEscalaPorNivel("Azul: Catástrofe", [
        {
            dano: "10d10",
            extra: "Falha: dano completo + colisão por tamanho • Sucesso: metade do dano inicial"
        },
    ])
},

{
    nome: "Azul: Devastação",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "18 Metros (Círculo)",
    alvo: "Todos no Alcance",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 18 Metros (Círculo)<br>
    <strong>Alvo:</strong> Todos no Alcance<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza de um azul que atrai tudo para si antes de implodir. Todos no alcance
    da técnica devem realizar um teste de resistência de <strong>Fortitude</strong>.
    
    Em caso de falha, são puxados para o centro da técnica, incluindo estruturas e elementos
    do cenário. Após tudo ser atraído, o azul implode causando 12d12 de dano energético. 
    Alvos que falharem no teste inicial recebem a condição <strong>Fragilizado</strong> por 2 rodadas,
    enquanto aqueles que sucederem recebem metade do dano e ignoram a condição.
    ` + criarEscalaPorNivel("Azul: Devastação", [
        {
            dano: "12d12",
            extra: "Falha: dano completo + Fragilizado 2 rodadas • Sucesso: metade do dano e ignora condição"
        }
    ])
},

{
    nome: "Azul: Asa do Anjo Caído",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "48 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 48 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza diversas esferas do azul ao redor do alvo, que são atraídas pela energia
    amaldiçoada do alvo até colidirem com ele, criando um acerto praticamente garantido.
    O alvo deve realizar um teste de resistência de <strong>Fortitude</strong> com desvantagem.
    
    Em caso de falha, o alvo recebe 20d12 de dano energético.
    ` + criarEscalaPorNivel("Azul: Asa do Anjo Caído", [
        {
            dano: "20d12",
            extra: "Falha: dano completo • Sucesso: sem dano"
        }
    ])
},

{
    nome: "Liberação Máxima: Compressão Absoluta",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "6 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 6 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você causa a compressão total de uma criatura, utilizando o azul com uma liberação superior de energia.
    A criatura alvo deve realizar um teste de resistência de <strong>Fortitude</strong>.
    
    Em caso de falha, recebe 4d10 de dano; em caso de sucesso, recebe apenas metade.
    
    Caso falhe, a criatura é comprimida, recebendo a condição <strong>Imóvel</strong> e sendo movida junto do azul
    até um ponto à sua escolha dentro de 30 metros. Durante o percurso, ela destrói tudo pelo caminho,
    além de atrair objetos e detritos, recebendo dano conforme a tabela de <strong>Dano de Fontes Variados</strong>.

    Ao fim do percurso, caso sobreviva, deve realizar outro teste de Fortitude. Um sucesso gera
    uma rolagem na tabela de <strong>Consequências Extremas</strong>; uma falha gera duas rolagens,
    causando perdas corporais conforme os resultados.
    ` + criarEscalaPorNivel("Liberação Máxima: Compressão Absoluta", [
        {
            dano: "4d10",
            extra: "Falha: dano completo + Imóvel + movimento + destruição de objetos • Sucesso: metade do dano"
        }
    ])
},

{
    nome: "Liberação Máxima: Ponto de Atração",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "24 Metros",
    alvo: "Um Ponto",
    duracao: "Sustentada",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 24 Metros<br>
    <strong>Alvo:</strong> Um Ponto<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Você cria um azul em um ponto dentro de 24 metros, transformando-o em uma força
    atrativa constante. O ponto de atração afeta uma área esférica de 7,5 metros e todas
    as criaturas dentro da área devem realizar um teste de resistência de <strong>Fortitude</strong>.
    
    Em caso de falha, recebem 12d12 de dano energético e são puxadas para o centro da área,
    recebendo a condição <strong>Imóvel</strong> por uma rodada. Em caso de sucesso, recebem metade do dano.

    Para cada rodada após a primeira, você deve pagar 2 pontos de energia amaldiçoada para sustentar o ponto.
    Enquanto o ponto estiver sustentado:
    <ul>
        <li>Criaturas dentro da área recebem a condição <strong>Lento</strong></li>
        <li>A área conta como <strong>terreno difícil</strong></li>
        <li>Se uma criatura terminar seu turno dentro da área, mas distante do centro, deve repetir o teste de Fortitude</li>
    </ul>

    Como uma <strong>Ação Bônus</strong>, você pode mover o ponto de atração até 18 metros.
    Toda criatura na área é movida juntamente, assim como objetos e estruturas pelo caminho,
    podendo causar danos baseados na tabela de <strong>Dano de Fontes Variados</strong>.
    ` + criarEscalaPorNivel("Liberação Máxima: Ponto de Atração", [
        {
            dano: "12d12",
            extra: "Falha: dano completo + Imóvel + efeitos de movimento e destruição • Sucesso: metade do dano"
        }
    ])
},

{
    nome: "Vermelho: Empurrar",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> Toque<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você imbui o vermelho em sua mão e toca o alvo. Realize um teste de <strong>Feitiçaria</strong> e, em caso de sucesso,
    o alvo é arremessado na distância indicada abaixo. Caso colida com alguma estrutura, o alvo recebe dano de
    <strong>Fontes Variadas</strong> com 2d10 para cada nível de tamanho da estrutura.
    ` + criarEscalaPorNivel("Vermelho: Empurrar", [
        {
            dano: "2d10",
            extra: "Nível 1: arremessado 12 metros • Dano por colisão conforme tamanho da estrutura"
        },
        {
            dano: "2d10",
            extra: "Nível 2: arremessado 18 metros • Dano por colisão conforme tamanho da estrutura"
        },
        {
            dano: "2d10",
            extra: "Nível 3: arremessado 24 metros • Dano por colisão conforme tamanho da estrutura"
        },
        {
            dano: "2d10",
            extra: "Nível 4: arremessado 30 metros • Dano por colisão conforme tamanho da estrutura"
        },
        {
            dano: "2d10",
            extra: "Nível 5: arremessado 48 metros • Dano por colisão conforme tamanho da estrutura"
        }
    ])
},

{
    nome: "Vermelho: Campo Destrutivo",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "4,5 Metros (Círculo)",
    alvo: "Todos na Área",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 4,5 Metros (Círculo)<br>
    <strong>Alvo:</strong> Todos na Área<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você canaliza o seu vermelho na ponta dos dedos e cria uma área circular afetada pelo vermelho,
    destruindo o que estiver no processo. Todos os alvos na área devem realizar um teste de 
    <strong>Fortitude</strong>. Em caso de falha, recebem 2d8 de dano energético.
    ` + criarEscalaPorNivel("Vermelho: Campo Destrutivo", [
        {
            dano: "2d8",
            extra: "Nível 1: Falha no teste de Fortitude recebe 2d8 de dano"
        }
    ])
},

{
    nome: "Vermelho: Reforço por Repulsão",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentado",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentado<br><br>

    Você coloca uma fina camada de vermelho ao seu redor e utiliza da repulsão dele
    para amenizar os impactos dos golpes e ataques que você recebe. Para sustentar a habilidade,
    deve pagar P.E por rodada conforme o nível:
    ` + criarEscalaPorNivel("Vermelho: Reforço por Repulsão", [
        {
            dano: "RD 4",
            extra: "Nível 1: recebe 4 de RD • Custo: 1 P.E por rodada"
        },
        {
            dano: "RD 7",
            extra: "Nível 2: recebe 7 de RD • Custo: 1 P.E por rodada"
        },
        {
            dano: "RD 10",
            extra: "Nível 3: recebe 10 de RD • Custo: 2 P.E por rodada"
        },
        {
            dano: "RD 12",
            extra: "Nível 4: recebe 12 de RD • Custo: 2 P.E por rodada"
        },
        {
            dano: "RD 18",
            extra: "Nível 5: recebe 18 de RD • Custo: 2 P.E por rodada"
        }
    ])
},

{
    nome: "Vermelho: Embate de Energia",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Reação",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Reação<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza do vermelho para combater um ataque ou técnica que vai em sua direção.
    Realize um teste de <strong>Amaldiçoado</strong> contra o acerto ou CD do alvo. 
    <ul>
        <li>Sucesso: recebe metade do dano</li>
        <li>Falha: recebe o dano completo</li>
    </ul>
    `
},

{
    nome: "Vermelho: Golpes Repulsivos",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Sendo uma reversão direta do Azul: Atração Constante, ao invés de fortalecer seus ataques
    por atrair o alvo a eles, você o expulsa com seus ataques, causando dano adicional e
    arremessando os alvos.
    `,
    
    escala: criarEscalaPorNivel("Vermelho: Golpes Repulsivos", [
        {
            dano: "3d12",
            extra: "Arremessa alvo 3 metros por ataque • Acumula entre ataques no fim do turno"
        }
    ])
},

{
    nome: "Vermelho: Repulsão",
    categoria: "ILIMITADO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "24 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 24 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você usa a reversão de técnica no Ilimitado, criando o poder de repelir, comprimido em
    uma pequena esfera vermelha que libera uma extrema força explosiva. O alvo deve
    realizar um teste de resistência de <strong>Fortitude</strong>.
    
    <ul>
        <li>Falha: recebe 10d8 de dano energético e é empurrado 12 metros</li>
        <li>Sucesso: recebe metade do dano e é empurrado 6 metros</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Repulsão", [
        {
            dano: "10d8",
            extra: "Falha: dano completo + empurrado 12 metros • Sucesso: metade do dano + empurrado 6 metros"
        }
    ])
},

{
    nome: "Vermelho: Destruição Forçada",
    categoria: "ILIMITADO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "12 Metros (Linha, 3 metros de largura)",
    alvo: "Todos no Alcance",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 12 Metros (Linha, 3 metros de largura)<br>
    <strong>Alvo:</strong> Todos no Alcance<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você concentra seu poder na ponta dos dedos e dispara um projétil. Todos no alcance devem
    realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: recebem 5d12 de dano energético e são empurrados por todo o restante do alcance</li>
        <li>Caso colida com uma estrutura, recebe dano de <strong>Fontes Variadas</strong> com 2d10 por nível de tamanho da estrutura</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Destruição Forçada", [
        {
            dano: "5d12",
            extra: "Falha: dano completo + empurrado total do alcance • Dano por colisão conforme tamanho da estrutura"
        }
    ])
},

{
    nome: "Vermelho: Disparo Carmesim",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "30 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 30 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você junta dois dedos na forma de uma pistola e dispara um vermelho altamente destrutivo.
    A criatura alvo deve realizar um teste de <strong>Reflexos</strong>.
    <ul>
        <li>Falha: recebe 12d10 de dano energético e é empurrada 18 metros</li>
        <li>Sucesso: recebe metade do dano e é empurrada 9 metros</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Disparo Carmesim", [
        {
            dano: "12d10",
            extra: "Falha: dano completo + empurrado 18 metros • Sucesso: metade do dano + empurrado 9 metros"
        }
    ])
},

{
    nome: "Vermelho: Execração",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 18 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza do vermelho para focar em empurrar uma criatura dentro de 18 metros,
    forçando-a ao máximo. A criatura alvo deve realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: é empurrada até 30 metros • Sucesso: metade da distância</li>
        <li>Durante o movimento, a criatura quebra obstáculos:</li>
        <ul>
            <li>Objeto de peso considerável: 1d10</li>
            <li>Objeto pesado: 2d10</li>
            <li>Objeto extremamente pesado: 4d10</li>
        </ul>
        <li>Ao final do trajeto, teste de Fortitude: falha → condição <strong>Atordoado</strong> por 1 rodada</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Execração", [
        {
            dano: "1d10/2d10/4d10",
            extra: "Falha: empurrada 30 metros • Dano por categoria de peso do objeto • Sucesso: metade da distância"
        }
    ])
},

{
    nome: "Vermelho Controlado",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 18 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você dispara um vermelho contra uma criatura dentro de 18 metros. A criatura alvo deve
    realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: recebe 12d10 de dano energético</li>
        <li>Sucesso: recebe metade do dano</li>
    </ul>
    Após atingir a criatura, você mantém o vermelho controlado, movendo-o para um ponto dentro de 9 metros.
    Como ação livre, no turno de conjuração ou no seguinte, você pode explodir o vermelho:
    <ul>
        <li>Criaturas próximas realizam teste de Fortitude</li>
        <li>Falha: empurradas 9 metros</li>
        <li>Sucesso: metade da distância</li>
        <li>Se entrarem no alcance de ataque, você pode usar reação para ataque corpo-a-corpo com vantagem e crítico garantido</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho Controlado", [
        {
            dano: "12d10",
            extra: "Falha: dano completo • Sucesso: metade • Explosão controlada empurra 9 metros"
        },
    ])
},

{
    nome: "Vermelho: Libertação Carmesim",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Completa",
    alcance: "30 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 30 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você concentra uma enorme quantidade de energia em um pequeno vermelho e o libera extremamente rápido
    em direção ao alvo, liberando toda a energia no impacto.
    <ul>
        <li>Teste de feitiçaria para acertar</li>
        <li>Sucesso: alvo recebe 20d12 de dano energético e faz teste de <strong>Fortitude</strong></li>
        <li>Falha no Fortitude: recebe uma condição extrema (braço, perna, olho ou ferida interna)</li>
        <li>Sucesso no Fortitude: metade do dano e nenhuma condição</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Libertação Carmesim", [
        {
            dano: "20d12",
            extra: "Falha no Fortitude: condição extrema • Sucesso: metade do dano, sem condição"
        }
    ])
},

{
    nome: "Vermelho: Devastação Coralina",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "24 Metros (Linha, 4,5 metros de largura)",
    alvo: "Todos no Alcance",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 24 Metros (Linha, 4,5 metros de largura)<br>
    <strong>Alvo:</strong> Todos no Alcance<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você realiza uma concentração diferente de energia, tornando-a mais escura e liberando-a.
    Todos os alvos devem realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: são mandados até o fim da técnica e recebem 12d12 de dano energético</li>
        <li>O local se torna <strong>terreno difícil</strong></li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Vermelho: Devastação Coralina", [
        {
            dano: "12d12",
            extra: "Falha: dano completo e área se torna terreno difícil • Sucesso: metade do dano e mantém a área normal"
        }
    ])
},

{
    nome: "LIBERAÇÃO MÁXIMA: Vermelho Controlado",
    categoria: "ILIMITADO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Comum",
    alcance: "30 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 30 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você dispara um vermelho contra uma criatura dentro de 18 metros. A criatura alvo deve
    realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: recebe 12d10 de dano energético</li>
        <li>Sucesso: recebe metade do dano</li>
    </ul>
    Após atingir a criatura, você mantém o vermelho controlado, movendo-o discretamente pelo ambiente
    até um ponto dentro de 9 metros. Como ação livre, no turno de conjuração ou no seguinte, você
    pode explodir o vermelho:
    <ul>
        <li>Criaturas próximas realizam teste de Fortitude</li>
        <li>Falha: empurradas 9 metros</li>
        <li>Sucesso: metade da distância</li>
        <li>Se entrarem no alcance de ataque, você pode usar sua reação para ataque corpo-a-corpo com vantagem, crítico garantido e alvo recebe condição <strong>Exposto ao Golpe</strong></li>
    </ul>
    `,

    escala: criarEscalaPorNivel("LIBERAÇÃO MÁXIMA: Vermelho Controlado", [
        {
            dano: "12d10",
            extra: "Falha no Fortitude: dano completo • Sucesso: metade • Explosão controlada empurra 9 metros, ataque crítico garantido se entrar no alcance com condição Exposto ao Golpe"
        },
    ])
},

{
    nome: "LIBERAÇÃO MÁXIMA: Devastação Coralina",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Completa",
    alcance: "30 Metros (Linha, 4,5 metros de largura)",
    alvo: "Todos no Alcance",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 30 Metros (Linha, 4,5 metros de largura)<br>
    <strong>Alvo:</strong> Todos no Alcance<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você realiza uma concentração diferente de energia, tornando-a mais escura e liberando-a.
    Todos os alvos devem realizar um teste de <strong>Fortitude</strong>.
    <ul>
        <li>Falha: são mandados até o fim da técnica, recebem 15d12 de dano energético e a área de 9 metros se torna <strong>terreno difícil</strong></li>
        <li>Todos afetados ficam com membros superiores <strong>Atordoados</strong> por 2 rodadas</li>
        <li>Interação especial: funciona com a <strong>Liberação Máxima do Azul: Ponto de Atração</strong></li>
    </ul>
    `,

    escala: criarEscalaPorNivel("LIBERAÇÃO MÁXIMA: Devastação Coralina", [
        {
            dano: "15d12",
            extra: "Falha: dano completo + terreno difícil + membros superiores atordoados por 2 rodadas • Sucesso: metade do dano, efeitos mantidos"
        }
    ])
},

{
    nome: "Feitiço Imaginário: Vazio Roxo",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Imaginária",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Completa",
    alcance: "Linha de 40 Metros a sua frente",
    alvo: "Todos na área",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Imaginária</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> Linha de 40 Metros a sua frente<br>
    <strong>Alvo:</strong> Todos na área<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você causa a fusão do azul com o vermelho, criando uma técnica complexa que colide dois infinitos para gerar massa imaginária, apagando tudo à sua frente. 
    Uma enorme esfera roxa se propaga em linha reta, com 6 metros de largura.
    <ul>
        <li>Objetos no caminho são apagados</li>
        <li>Criaturas realizam teste de <strong>Fortitude</strong>:
            <ul>
                <li>Falha: perdem 12d12 PV</li>
                <li>Sucesso: metade do dano</li>
            </ul>
        </li>
        <li>Se os PV de uma criatura chegam a 0, ela é apagada da existência</li>
        <li>Área se torna <strong>terreno difícil</strong> e se propaga 20 metros por rodada</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Feitiço Imaginário: Vazio Roxo", [
        {
            dano: "12d12",
            extra: "Falha: dano completo e criatura apagada se PV 0 • Sucesso: metade do dano • Área terreno difícil, propaga 20m/rodada"
        }
    ])
},

{
    nome: "Feitiço Imaginário: Roxo Concentrado",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Imaginária",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Completa",
    alcance: "30 Metros",
    alvo: "Único",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Imaginária</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> 30 Metros<br>
    <strong>Alvo:</strong> Único<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você causa a fusão do azul com o vermelho, colidindo dois infinitos para criar massa imaginária que apaga tudo à sua frente.
    Diferente da versão colossal, aqui é uma pequena esfera devastadora.
    <ul>
        <li>Teste de <strong>amaldiçoado</strong> ou distância para acertar</li>
        <li>Sucesso: alvo perde 20d12 em pontos de vida e faz teste de <strong>Fortitude</strong></li>
        <li>Falha no Fortitude: alvo recebe a condição <strong>Ferida Interna</strong></li>
        <li>Sucesso no Fortitude: metade do dano, sem condição</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Feitiço Imaginário: Roxo Concentrado", [
        {
            dano: "20d12",
            extra: "Falha no Fortitude: condição Ferida Interna • Sucesso: metade do dano, sem condição"
        }
    ])
},

{
    nome: "Feitiço Máximo do Vazio: Roxo",
    categoria: "ILIMITADO",
    nivel: "Máximo",
    tipo: "Habilidade Feitiço Máximo",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "2 Rodadas",
    alcance: "Área Esférica de 50 Metros",
    alvo: "Todos na área",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço Máximo</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> 2 Rodadas<br>
    <strong>Alcance:</strong> Área Esférica de 50 Metros<br>
    <strong>Alvo:</strong> Todos na área<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você combina azul e vermelho em um ponto dentro de 9 metros, criando uma explosão de vazio roxo.
    <ul>
        <li>Todas as criaturas na área fazem teste de <strong>Fortitude</strong> com desvantagem</li>
        <li>Falha: recebem 26d10 PV de dano</li>
        <li>Sucesso: metade do dano</li>
        <li>Você sofre 1/3 do dano total por origem própria</li>
        <li>Área afetada é destruída, estruturas e objetos viram detritos</li>
        <li>Condições extremas:
            <ul>
                <li>Inimigos dentro de 24 metros: 1 condição extrema</li>
                <li>Inimigos dentro de 12 metros: 2 condições extremas</li>
                <li>Acima de 30 metros: nada adicional</li>
            </ul>
        </li>
        <li>Habilidades como <strong>Feitiço Cuidadoso</strong> não podem ser aplicadas</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("Feitiço Máximo do Vazio: Roxo", [
        {
            dano: "26d10",
            extra: "Falha no Fortitude: dano completo e condições extremas conforme distância • Sucesso: metade do dano • Você recebe 1/3 do dano • Área destruída"
        }
    ])
},
{
    nome: "LIBERAÇÃO MÁXIMA: Roxo 200%",
    categoria: "ILIMITADO",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica + 2 Aliados em 3 metros",
    conjuracao: "2 Rodadas",
    alcance: "Linha de 30 Metros (6 metros de largura)",
    alvo: "Todos na área",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica + 2 Aliados em 3 metros<br>
    <strong>Conjuração:</strong> 2 Rodadas<br>
    <strong>Alcance:</strong> Linha de 30 Metros (6 metros de largura)<br>
    <strong>Alvo:</strong> Todos na área<br>
    <strong>Duração:</strong> Imediata<br><br>

    Esta é uma amplificação de condução de energia ao roxo convencional. Você e mais dois feiticeiros iniciam um ritual de amplificação de efeitos:
    <ul>
        <li>Se ambos possuírem técnicas de amplificação de feitiço (ex.: Utahime ou Gakuganji), aplicam os mais fortes reforços que possuam</li>
        <li>Se não possuírem, devem gastar 10 P.E cada para amplificar a potência da técnica</li>
        <li>Todos os alvos atingidos realizam teste de <strong>Fortitude</strong> com desvantagem</li>
        <li>Falha: recebem 240 PV (20d12 maximizado pelo ritual)</li>
        <li>Sucesso: metade do dano</li>
    </ul>
    `,

    escala: criarEscalaPorNivel("LIBERAÇÃO MÁXIMA: Roxo 200%", [
        {
            dano: "20d12",
            extra: "Maximizado pelo ritual: falha no Fortitude perde 240 PV • Sucesso: metade • Requer 2 aliados em 3 metros ou P.E extra se não possuírem amplificação"
        }
    ])
},
{
    nome: "Amplificação do Infinito",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Reação",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Reação<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você amplifica o foco no infinito, dedicando-se a parar golpes que vá receber.
    Como reação a ser atacado, você dobra o bônus na defesa e na redução de dano garantida pelo infinito, até o final do turno atual.
    Sempre que os bônus do infinito aumentarem, o custo desta habilidade aumenta em 2 P.E.
    `
},
{
    nome: "Voar",
    categoria: "ILIMITADO",
    nivel: 1,
    tipo: "Habilidade Feitiço Passiva",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Passiva",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Contínua",
    desc: `
    <strong>Habilidade Feitiço Passiva</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Passiva<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Contínua<br><br>

    Refinando seu controle com o infinito, você se torna capaz de pairar no ar, aproximando-se da capacidade de voar.
    Você recebe seu deslocamento como movimento de voo e pode permanecer estático no ar.
    Seu máximo de energia amaldiçoada é diminuído em 2.
    `
},
{
    nome: "Infinito",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica + Olhos Desvendados",
    conjuracao: "Reação",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Até o Fim do Turno",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica + Olhos Desvendados<br>
    <strong>Conjuração:</strong> Reação<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Até o Fim do Turno<br><br>

    Você melhora o Infinito, podendo mantê-lo mais tempo sem gastar os usos do funcionamento básico.
    Nível 3: duração passa a toda a rodada, ou até o fim do turno se estiver com olhos vendados.
    Nível 4: pode segurar um revestimento de domínio se o ND da criatura for menor que o seu e diferença máxima de 2 níveis de domínio.
    Nível 5: Infinito automatizado, perdendo 15 P.E permanentes.
    `
},
{
    nome: "Emprestar Infinito",
    categoria: "ILIMITADO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    requisito: "Aptidão Reversão de Técnica",
    conjuracao: "Ação Bônus",
    alcance: "Toque",
    alvo: "Uma Criatura",
    duracao: "Concentração",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Requisito:</strong> Aptidão Reversão de Técnica<br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Toque<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Concentração<br><br>

    Você toca uma criatura, transmitindo os mesmos benefícios de Defesa e Redução de Dano do seu Infinito na forma neutra.
    Ainda é anulado nas mesmas condições que você, mas fica imune aos efeitos da sua expansão.
    `
},
{
    nome: "Clivar",
    categoria: "SANTUÁRIO",
    nivel: 0,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    alvo: "Uma Criatura",
    duracao: "Imediata",

    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> Toque<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>
    
    Ao tocar uma criatura, você cria um ataque cortante que se adapta à resistência do alvo, visando causar a maior quantidade de dano possível.
    `
    + criarEscalaPorNivel("Clivar", [
        {
            dano: "2d10",
            extra: "Nível 0: baixa liberação de energia, adaptação limitada"
        },
        {
            dano: "3d8",
            extra: "Nível 1: +1d8 por Nível de aptidão de aura do alvo, até 2 dados adicionais"
        },
        {
            dano: "6d8",
            extra: "Nível 2: +1d8 por Nível de aptidão de aura do alvo, até 4 dados adicionais"
        },
        {
            dano: "10d8",
            extra: "Nível 3: +1d8 por Nível de aptidão de aura + metade de controle e leitura do alvo, até 6 dados adicionais"
        },
        {
            dano: "13d10",
            extra: "Nível 4: +1d10 por Nível de aptidão de aura + metade de controle e leitura do alvo, até 6 dados adicionais"
        },
        {
            dano: "14d12",
            extra: "Nível 5: +1d12 por Nível de aptidão de aura, controle e leitura do alvo, até 10 dados adicionais"
        }
    ])
},

// Clivar: Sangre
{
    nome: "Clivar: Sangre",
    categoria: "SANTUÁRIO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    duracao: "Imediata",
    desc: `
    Ao forçar seus cortes do Clivar a rasgarem mais fundo, você faz o alvo sangrar.
    O alvo deve realizar um TR de Fortitude e, em uma falha, recebe a condição Sangramento médio, ignorando em um sucesso.
    `
},

// Teia de Aranha
{
    nome: "Teia de Aranha",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    area: "Circular de 4,5 Metros",
    duracao: "Imediata",
    desc: `
    Você toca no chão usando o Clivar e cria cortes em formato de teia de aranha.
    Uma área circular de 4,5 metros a partir de você é destruída, transformando o terreno em difícil.
    Criaturas sobre ela recebem dano de queda; criaturas abaixo recebem dano de desabamento (2d10 por nível de tamanho da estrutura desabada).
    `
},

// Clivar: Cortes Fragilizadores
{
    nome: "Clivar: Cortes Fragilizadores",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você foca todo o dano em uma camada acima da carne, destruindo a pele do alvo.
    O alvo deve realizar um TR de Fortitude, recebendo a condição Fragilizado por 2 rodadas, ignorando em um sucesso.
    `
},

// Clivar: Corte Ocular
{
    nome: "Clivar: Corte Ocular",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você mira abaixo da sobrancelha do alvo, fazendo-o jorrar sangue nos olhos e debilitando sua visão.
    O alvo deve realizar um TR de Fortitude, recebendo a condição Cego por 2 rodadas, ignorando em um sucesso.
    `
},

// Clivar: Punhos Constantes
{
    nome: "Clivar: Punhos Constantes",
    categoria: "SANTUÁRIO",
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    Você constantemente utiliza o Clivar em seus punhos, atraindo energia para causar dano adicional em ataques desarmados.
    `
    + criarEscalaPorNivel("Clivar: Punhos Constantes", [
        {
            dano: "2d6",
            extra: "Nível 1: dano energético adicional. Sustentação: 1 P.E por turno"
        },
        {
            dano: "2d8",
            extra: "Nível 2: dano sustentado. Sustentação: 1 P.E por turno"
        },
        {
            dano: "3d8",
            extra: "Nível 3: dano sustentado. Sustentação: 2 P.E por turno"
        },
        {
            dano: "3d12",
            extra: "Nível 4: dano sustentado. Sustentação: 2 P.E por turno"
        },
        {
            dano: "4d12",
            extra: "Nível 5: dano sustentado. Sustentação: 2 P.E por turno"
        }
    ])
},

{
    nome: "Clivar: Punhos Constantes",
    categoria: "SANTUÁRIO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    Você constantemente utiliza o Clivar em seus punhos, atraindo energia para causar dano adicional em ataques desarmados.
    `,
    escalas: criarEscalaPorNivel("Clivar: Punhos Constantes", [
        {nivel: 1, dano: "2d6", extra: "Nível 1: dano energético adicional. Sustentação: 1 P.E por turno"},
        {nivel: 2, dano: "2d8", extra: "Nível 2: dano sustentado. Sustentação: 1 P.E por turno"},
        {nivel: 3, dano: "3d8", extra: "Nível 3: dano sustentado. Sustentação: 2 P.E por turno"},
        {nivel: 4, dano: "3d12", extra: "Nível 4: dano sustentado. Sustentação: 2 P.E por turno"},
        {nivel: 5, dano: "4d12", extra: "Nível 5: dano sustentado. Sustentação: 2 P.E por turno"}
    ])
},

{
    nome: "Desmantelar",
    categoria: "SANTUÁRIO",
    nivel: 0,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Variável",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você dispara um projétil cortante e invisível. Realize um teste de ataque de técnica (Distância ou Amaldiçoado)
    contra o alvo e, caso acerte, causa dano cortante.
    `
    + criarEscalaPorNivel("Desmantelar", [
        { dano: "1d10", extra: "Nível 0, Alcance 9m" },
        { dano: "4d8", extra: "Nível 1, Alcance 12m" },
        { dano: "8d8", extra: "Nível 2, Alcance 18m" },
        { dano: "14d8", extra: "Nível 3, Alcance 24m" },
        { dano: "16d10", extra: "Nível 4, Alcance 30m" },
        { dano: "20d12", extra: "Nível 5, Alcance 48m" }
    ])
},

{
    nome: "Teia do Desmantelar",
    categoria: "SANTUÁRIO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Linha",
    area: "6 metros (1,5m largura)",
    duracao: "Imediata",
    desc: `
    Você muda a forma com a qual utiliza o Desmantelar, criando um corte que varre tudo no caminho, forçando os inimigos a realizarem um teste de Reflexos.
    `,
    escalas: criarEscalaPorNivel("Teia do Desmantelar", [
        {nivel: 1, dano: "3d8", extra: "6 metros linha, 1,5m largura. Metade em sucesso"},
        {nivel: 2, dano: "6d8", extra: "9 metros linha, 1,5m largura. Metade em sucesso"},
        {nivel: 3, dano: "7d12", extra: "9 metros linha, 3m largura. Metade em sucesso"},
        {nivel: 4, dano: "14d10", extra: "13,5 metros linha, 4,5m largura. Metade em sucesso"},
        {nivel: 5, dano: "16d12", extra: "18 metros linha, 9m largura. Metade em sucesso"}
    ])
},

{
    nome: "Chuva de Cortes",
    categoria: "SANTUÁRIO",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Área",
    area: "Esfera",
    duracao: "Imediata",
    desc: `
    Aplicando seu feitiço em uma área esférica, seus cortes surgem das extremidades e fecham em direção aos inimigos. Todos os alvos devem realizar um teste de Fortitude.
    `,
    escalas: criarEscalaPorNivel("Chuva de Cortes", [
        {nivel: 1, dano: "2d8", extra: "6 metros, 4,5 metros esfera. Metade em sucesso"},
        {nivel: 2, dano: "6d8", extra: "12 metros, 6 metros esfera. Metade em sucesso"},
        {nivel: 3, dano: "7d12", extra: "18 metros, 9 metros esfera. Metade em sucesso"},
        {nivel: 4, dano: "14d10", extra: "21 metros, 12 metros esfera. Metade em sucesso"},
        {nivel: 5, dano: "16d12", extra: "18 metros, 18 metros esfera. Metade em sucesso"}
    ])
},

{
    nome: "Corte Avassalador",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "24 Metros",
    alvo: "Único",
    duracao: "Imediata",
    desc: `
    Você realiza um corte com intenção de destruir completamente as defesas inimigas. O alvo deve realizar um teste de Fortitude e, em uma falha, recebe a condição Exposto por 2 rodadas, ignorando em um sucesso.
    `
},

{
    nome: "Decepar",
    categoria: "SANTUÁRIO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "15 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você utiliza o Desmantelar focado em decepar um membro da criatura alvo. Realize um teste de ataque de técnica (Distância ou Amaldiçoado) e, em um acerto, causa 8d10 de dano cortante. Além disso, o alvo deve realizar um TR de Fortitude, perdendo o membro em uma falha.
    `
},
{
    nome: "Destruição Máxima",
    categoria: "SANTUÁRIO",
    nivel: 1,
    tipo: "Habilidade Feitiço Passiva",
    conjuracao: "Passiva",
    duracao: "Contínua",
    desc: `
    Destruição e catástrofe acompanham você, devastando o ambiente ao seu redor. 
    Sempre que causar dano em estruturas ou objetos, trate como se possuíssem vulnerabilidade ao seu dano, aumentando-a.
    Seu máximo de energia amaldiçoada é reduzido em 2.
    `
},

{
    nome: "Desmantelar Imperceptível",
    categoria: "SANTUÁRIO",
    nivel: 2,
    tipo: "Habilidade Feitiço Passiva",
    conjuracao: "Passiva",
    duracao: "Contínua",
    desc: `
    Aproveitando da invisibilidade dos seus cortes de Desmantelar, você os torna imperceptíveis a partir da ocultação de gestos.
    Sempre que realizar um teste de ataque para usar Desmantelar, você recebe +2 na rolagem de acerto.
    Seu máximo de energia amaldiçoada é reduzido em 4.
    `
},

{
    nome: "Corte Ampliado",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço Passiva",
    conjuracao: "Passiva",
    duracao: "Contínua",
    desc: `
    Dominando o Desmantelar, você se torna capaz de ampliá-lo durante uma conjuração, tornando-o em uma varredura.
    Quando utilizar a habilidade de feitiço Desmantelar, você pode usar sua reação para adicionar até dois alvos ao ataque,
    desde que estejam adjacentes ao alvo primário, pagando um custo adicional igual a metade do custo do nível utilizado para cada um.
    Você pode utilizar esta habilidade uma quantidade de vezes igual ao seu bônus de treinamento por cena.
    Seu máximo de energia amaldiçoada é reduzido em 6.
    `
},

{
    nome: "Corte Verdadeiro",
    categoria: "SANTUÁRIO",
    nivel: 4,
    tipo: "Habilidade Feitiço Passiva",
    conjuracao: "Passiva",
    duracao: "Contínua",
    desc: `
    Suas habilidades de técnica de corte ignoram o dobro de seu bônus de treinamento em RD.
    Seu máximo de energia amaldiçoada é reduzido em 8.
    `
},

{
    nome: "Imbuir com Chamas",
    categoria: "SANTUÁRIO",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Uma técnica",
    duracao: "Imediata",
    desc: `
    Você utiliza do Kamino, imbuindo uma técnica sua com chamas para alterar o seu dano para queimante.
    `
},

{
    nome: "Queimem!",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Área de 9 Metros Cilindro",
    duracao: "Imediata",
    desc: `
    Você utiliza de suas chamas divinas para queimar seus oponentes. Todas as criaturas na área devem realizar um TR de Reflexos,
    recebendo 5d12 de dano queimante em uma falha e metade em um sucesso.
    `
},

{
    nome: "Chamas Divinas: Abra",
    categoria: "SANTUÁRIO",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "24 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você recita as palavras: "Chamas Divinas: Abram.” e realiza selos de mão formando uma flecha de chamas. Teste de Distância ou Amaldiçoado
    para acertar. Em um sucesso o alvo recebe dano queimante.
    `
    + criarEscalaPorNivel("Chamas Divinas: Abra", [
        { dano: "17d8", extra: "Nível 3" },
        { dano: "20d10", extra: "Nível 4" },
        { dano: "25d12", extra: "Nível 5" }
    ])
},

{
    nome: "Carbonizado por Chamas",
    categoria: "SANTUÁRIO",
    nivel: 4,
    tipo: "Habilidade Feitiço Passiva",
    conjuracao: "Passiva",
    duracao: "Contínua",
    desc: `
    Suas chamas são elevadas a um novo nível de destruição, queimando o tecido e fazendo com que os resquícios de energia dificultem a recuperação do alvo.
    Sempre que causar dano com uma de suas habilidades de feitiço do Kamino, o alvo tem uma diminuição no dano que consegue recuperar igual ao seu nível por 1 rodada.
    Seu máximo de energia é reduzido em 8.
    `
},

{
    nome: "Chamas Divinas: Golpe Queima Roupa",
    categoria: "SANTUÁRIO",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Toque",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    Você toca no alvo e libera uma enorme quantidade de chamas divinas próximo ao rosto. Teste de Corpo a Corpo ou Amaldiçoado.
    `
    + criarEscalaPorNivel("Chamas Divinas: Golpe Queima Roupa", [
        { dano: "12d10", extra: "Nível 4: TR de Fortitude; falha causa fragilizado 1 rodada e confuso 2 rodadas" },
        { dano: "17d10", extra: "Nível 5: TR de Fortitude; falha causa fragilizado 2 rodadas e confuso 3 rodadas" }
    ])
},


    // NÍVEL 0
    {
        nome: "Redirecionamento Sanguíneo",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 0,
        tipo: "Habilidade de Técnica",
        conjuracao: "Reação",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Reação<br>
        <strong>Alcance:</strong> Pessoal<br>
        <strong>Alvo:</strong> Si mesmo<br>
        <strong>Duração:</strong> Imediata<br><br>

        Ao sofrer um golpe, você pode como uma reação redirecionar esse sangue que foi tirado de você e manipula para criar uma arma de sangue sem custo adicional, desde que esse golpe tenha pago a criação da arma em PVs.
        </div>
        `
    },
    {
        nome: "Estímulo Corporal",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 0,
        tipo: "Habilidade de Técnica",
        conjuracao: "Si mesmo", 
        alcance: "Si mesmo",
        alvo: "Si mesmo",
        duracao: "Sustentada",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Si mesmo<br>
        <strong>Alcance:</strong> Si mesmo<br>
        <strong>Alvo:</strong> Si mesmo<br>
        <strong>Duração:</strong> Sustentada<br>
        <strong>Custo:</strong> 1 PE por turno<br><br>

        Em um êxtase momentâneo, você aumenta o fluxo de sangue nas suas pernas, aumentando seu deslocamento em 3 metros pagando 1 PE por turno.
        </div>
        `
    },

    // NÍVEL 1
    {
        nome: "Corte Profundo",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Corpo a corpo",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Corpo a corpo<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Como um verdadeiro animal, você canaliza sangue em suas mãos e mutila um alvo, dilacerando seus órgãos internos com suas unhas. Faz um teste de acerto contra a CA do alvo. O alvo realiza um TR de Fortitude, sofrendo "sangramento leve" em falha.
        </div>
        ` + criarEscalaPorNivel("Corte Profundo", [
            { dano: "4d8 cortante", extra: "Sangramento leve em falha no TR" }
        ])
    },
    {
        nome: "Instinto Sanguinário",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Sua sede por sangue te movimenta. Recebe instinto sanguinário da origem feto amaldiçoado. Abdica 2 PE.
        </div>
        `
    },
    {
        nome: "Sede por Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "Arma",
        alvo: "Própria arma",
        duracao: "Sustentada",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br>
        <strong>Duração:</strong> Sustentada<br>
        <strong>Custo Base:</strong> 1 PE e 2 PV por turno<br><br>

        Você endurece o sangue em suas armas de sangue aumentando a força delas, suas armas de sangue causam Dano adicional do mesmo tipo de dano.
        </div>
        ` + criarEscalaPorNivel("Sede por Sangue", [
            { dano: "2d10", extra: "Custo: 1 PE e 2 PV/turno" },
            { dano: "3d8",  extra: "Custo padrão" },
            { dano: "4d8",  extra: "Custo: 2 PE e 4 PV/turno" },
            { dano: "4d12", extra: "Custo escalado" },
            { dano: "5d12", extra: "Custo escalado" }
        ])
    },
    {
        nome: "Corpo Aprimorado",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Após um certo uso de sua técnica, seu corpo se adapta a perda de sangue, você recebe robustez aprimorada. Abdica 2 PE.
        </div>
        `
    },
    {
        nome: "Cortes Sanguinolentos",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Corpo a corpo",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Pré-requisito:</strong> Lâmina sangrenta<br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Corpo a corpo<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você pega sua lâmina sangrenta e desfere um corte preciso no peito de seu alvo com +2 no acerto.
        </div>
        ` + criarEscalaPorNivel("Cortes Sanguinolentos", [
            { dano: "6d8", extra: "+2 no acerto" }
        ])
    },
    {
        nome: "Agulha Sanguínea",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "12 Metros",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> 12 Metros<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br>
        <strong>Custo:</strong> 2 PE e 3 PV<br><br>

        Você pressiona sangue na ponta de sua mão e atira ela com uma pressão e velocidade absurda. Ao disparar essa agulha você rola um teste de feitiçaria ou pontaria contra a CA do alvo.
        </div>
        ` + criarEscalaPorNivel("Agulha Sanguínea", [
            { dano: "5d8 perfurante", extra: "Teste contra CA" }
        ])
    },

    // NÍVEL 2
    {
        nome: "Brutalidade Sanguinolenta",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Corpo a corpo",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Corpo a corpo<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você avança contra um inimigo endurecendo sangue em suas mãos, e logo depois perfura o crânio do alvo com suas unhas. Rola um teste de acerto contra a CA do alvo. Além disso o alvo realiza um TR de Fortitude onde em falha fica com "sangramento leve".
        </div>
        ` + criarEscalaPorNivel("Brutalidade Sanguinolenta", [
            { dano: "11d8 perfurante", extra: "Sangramento leve em falha no TR" }
        ])
    },
    {
        nome: "Fluxo de Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Si mesmo",
        alvo: "Si mesmo",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Si mesmo<br>
        <strong>Alvo:</strong> Si mesmo<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você flui o sangue pelo seu corpo, aumentando sua circulação e te concedendo um fluxo maior de sangue, cura 6d6 de vida temporária (ou 6d6 de vida comum caso possua energia reversa). Ela não paga o custo de sangue.
        </div>
        `
    },
    {
        nome: "Armadura Sanguínea",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Si mesmo",
        alvo: "Si mesmo",
        duracao: "Sustentada",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Si mesmo<br>
        <strong>Alvo:</strong> Si mesmo<br>
        <strong>Duração:</strong> Sustentada<br>
        <strong>Custo Base:</strong> 1 PE e 2 PV por turno<br><br>

        Você preenche seu corpo com uma camada de sangue, que possui a forma e aparência de acordo com sua narração.<br><br>
        <strong>Progressão:</strong><br>
        • Nível 2: +8 na CA (1 PE e 2 PV/turno)<br>
        • Nível 3: +12 na CA (2 PE e 4 PV/turno)<br>
        • Nível 4: +15 na CA<br>
        • Nível 5: +22 na CA
        </div>
        `
    },
    {
        nome: "Explosão de Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Reação",
        alcance: "Área 3 Metros",
        alvo: "Todos na área",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Reação<br>
        <strong>Alcance:</strong> Área de 3 Metros<br>
        <strong>Alvo:</strong> Todos na área<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você explode uma arma de sangue desfazendo ela e a perdendo em troca. O sangue espirra nos alvos; todos em 3 metros realizam um TR de Reflexos. Em falha, o sangue entra em seus olhos deixando-os cegos até o fim da rodada e desprevenidos contra seu próximo golpe. Em sucesso, ficam apenas desprevenidos contra seu próximo golpe.
        </div>
        `
    },
    {
        nome: "Forte Contra os Fracos",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 2,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Corpo a corpo/Arma",
        alvo: "Criaturas sangrando",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Ver inimigos se afogando no próprio sangue te enche de sede por morte. Você causa 2d6 de dano adicional em ataques padrões contra inimigos sangrando ou desmembrados.
        </div>
        `
    },

    // NÍVEL 3
    {
        nome: "Disparo Rápido",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 3,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "18 Metros",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br>
        <strong>Alcance:</strong> 18 Metros<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você canaliza sangue no seu braço, e o libera em um rápido disparo. O alvo realiza um TR de Reflexos. Em sucesso não sofre dano, porém esse disparo tira o foco do alvo (o próximo ataque que você realizar contra ele conta como desprevenido).
        </div>
        ` + criarEscalaPorNivel("Disparo Rápido", [
            { dano: "7d8 perfurante", extra: "Dano em falha • Ataque desprevenido" }
        ])
    },
    {
        nome: "Hemorragia Ocular",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 3,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br>
        <strong>Alcance:</strong> 9 Metros<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você canaliza sangue em seus olhos os deixando vermelhos, e logo depois dispara um jato de sangue contra o olho de um inimigo. O alvo faz um TR de Reflexos. Em falha, fica cego por 1 turno e desprevenido por 3 turnos (desprevenido contra o próximo golpe).
        </div>
        `
    },
    {
        nome: "Revestimento Corporal",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 3,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Seu corpo constantemente se reveste com sangue, mantendo um fluxo que aumenta sua resistência. Você recebe 5 de RD geral (exceto na alma).
        </div>
        `
    },
    {
        nome: "Garras Destruidoras",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 3,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "Alcance das garras",
        alvo: "Uma criatura",
        duracao: "Imediata (Garras mantidas)",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> Alcance das garras sangrentas<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você canaliza sangue em seus punhos e os libera pela ponta, perfurando o alvo com velocidade sobre-humana. Faz um teste de luta/pontaria contra a CA do alvo com +3 no acerto enquanto ele está desprevenido. Após o uso, você mantém as garras.
        </div>
        ` + criarEscalaPorNivel("Garras Destruidoras", [
            { dano: "18d8 cortante", extra: "+3 acerto em alvo desprevenido" }
        ])
    },
    {
        nome: "Golpes Pesados",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 3,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Ataques com arma",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Seus golpes se tornam pesados como meteoros. Seu nunchaku de sangue causa 1 dado de dano adicional e recebe +1 dado de dano em acertos críticos.
        </div>
        `
    },

    // NÍVEL 4
    {
        nome: "Mar de Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 4,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Comum",
        alcance: "18 Metros em linha",
        alvo: "Área/Criaturas na linha",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Comum<br>
        <strong>Alcance:</strong> 18 Metros em linha<br>
        <strong>Alvo:</strong> Criaturas na área<br>
        <strong>Duração:</strong> Imediata<br><br>

        Com o seu Tridente, você canaliza todo o sangue absorvido e o libera em uma onda. Todos no alcance realizam um TR de Reflexos sofrendo o dano total, ou metade em um sucesso.<br>
        <em>Aprimoramento:</em> A cada 10 PVs canalizados na rajada, você pode aumentar o alcance em 3 metros, aumentar 1d de dano OU gastar 10 PV para deixar o alvo enredado por 1 turno (TR Fortitude).
        </div>
        ` + criarEscalaPorNivel("Mar de Sangue", [
            { dano: "20d10 de força", extra: "Reflexo metade • Aprimoramentos por PV" }
        ])
    },
    {
        nome: "Chuva de Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 4,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Completa",
        alcance: "9 Metros",
        alvo: "Todos na área (12m)",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Completa<br>
        <strong>Alcance:</strong> 9 Metros<br>
        <strong>Área:</strong> 12 Metros<br>
        <strong>Alvo:</strong> Todos na área<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você concentra uma grande quantia de sangue e a libera como adagas que caem do céu em um ponto escolhido. Todos na área fazem TR de Reflexos. Caso o alvo sofra uma falha crítica, fica com "sangramento médio".
        </div>
        ` + criarEscalaPorNivel("Chuva de Sangue", [
            { dano: "14d10 perfurante", extra: "Sangramento médio em falha crítica" }
        ])
    },
    {
        nome: "Destruição Abdominal",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 4,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Completa",
        alcance: "Corpo a corpo",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Completa<br>
        <strong>Alcance:</strong> Corpo a corpo<br>
        <strong>Alvo:</strong> Uma criatura<br>
        <strong>Duração:</strong> Imediata<br><br>

        Você canaliza sangue em suas mãos, e abre o abdômen de seu alvo com suas garras arrancando cada gota de sangue. O cenário se torna uma piscina de sangue.<br>
        O alvo realiza um TR de Fortitude. Caso passe, sofre metade do dano e anula as condições.
        </div>
        ` + criarEscalaPorNivel("Destruição Abdominal", [
            { dano: "11d10", extra: "Falha: Sangramento forte e ferida interna" }
        ])
    },

    // NÍVEL 5
    {
        nome: "Acostumado com o Custo",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 5,
        tipo: "Passiva de Técnica",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Passiva de Técnica</strong><br><br>

        Seu corpo se adapta perfeitamente ao custo de sangue, evitando qualquer tipo de inconveniente. O custo de vida (PV) das habilidades é reduzido pela metade.
        </div>
        `
    },

    // TÉCNICA MÁXIMA
    {
        nome: "Anjo de Sangue",
        categoria: "MANIPULAÇÃO DE SANGUE",
        nivel: 5,
        tipo: "Habilidade de Técnica Máxima",
        conjuracao: "Ação Completa",
        alcance: "Si mesmo",
        alvo: "Si mesmo",
        duracao: "Sustentada",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Técnica Máxima</strong><br>
        <strong>Conjuração:</strong> Ação Completa<br>
        <strong>Alcance:</strong> Si mesmo<br>
        <strong>Alvo:</strong> Si mesmo<br>
        <strong>Duração:</strong> Sustentada<br><br>

        Em um ato decisivo, como sua última cartada, crescem asas de sangue solidificado em suas costas. Seu corpo cria um esqueleto vibrante ao redor dele, te deixando em um estado absurdo.<br><br>
        <strong>Bônus da Transformação:</strong><br>
        • +10 de CA<br>
        • Seu movimento pode ser mudado para aéreo<br>
        • 10 de RD geral (exceto na alma)<br>
        • +10 em TRs de Fortitude e Reflexos<br>
        • -5 em testes mentais<br>
        • +12 de acerto contra alvos sangrando<br><br>
        <em>Penalidade:</em> Ao fim da transformação, recebe 5 pontos de exaustão.
        </div>
        `
    },

    // NÍVEL 0
    {
        nome: "Aumento de Energia",
        categoria: "CÓPIA",
        nivel: 0,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br><br>
        A Rika possui uma conexão energética com o seu invocador, podendo usufruir da grande capacidade da energia amaldiçoada de Rika. O usuário recebe +2 PE adicional a cada aumento de treinamento.
        </div>
        `
    },
    {
        nome: "Combate Sincronizado",
        categoria: "CÓPIA",
        nivel: 0,
        tipo: "Habilidade Passiva",
        conjuracao: "Ação Bônus",
        alcance: "Variável",
        alvo: "Um inimigo",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva (Ativação)</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br><br>
        Você e Rika possuem uma enorme sincronia. Você se torna capaz de fazer com que Rika realize um falso ataque em um inimigo. O alvo deve realizar um TR de Reflexos; em falha, fica desprevenido. Em sucesso, ignora o efeito.
        </div>
        `
    },

    // NÍVEL 1
    {
        nome: "Existência Perturbadora",
        categoria: "CÓPIA",
        nivel: 1,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Aura",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -2 de Energia Máxima<br><br>
        Você carrega uma aura perturbadora que libera energia macabra quando você ou Rika se sentem ameaçados. Você recebe a aptidão amaldiçoada de aura macabra.
        </div>
        `
    },
    {
        nome: "Amplificação do Armazém",
        categoria: "CÓPIA",
        nivel: 1,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -2 de Energia Máxima<br><br>
        Sua Rika aumenta a reserva de itens e armas. A capacidade de armazenamento da Rika aumenta para o dobro do modificador de Força dela.
        </div>
        `
    },
    {
        nome: "A União Faz a Força",
        categoria: "CÓPIA",
        nivel: 1,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "3 Metros",
        alvo: "Invocador e Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -2 de Energia Máxima<br><br>
        Quando Rika estiver a pelo menos 3m de seu invocador, ambos recebem um bônus de +1 em testes de ataques e +2 em rolagens de dano.
        </div>
        `
    },

    // NÍVEL 2
    {
        nome: "Fortalecimento da Rainha",
        categoria: "CÓPIA",
        nivel: 2,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -4 de Energia Máxima<br><br>
        A Rika possui +2 em testes de atletismo para agarrar. Esse bônus aumenta em +1 nos níveis 10 e 15.
        </div>
        `
    },
    {
        nome: "Armazenamento Próprio",
        categoria: "CÓPIA",
        nivel: 2,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -4 de Energia Máxima<br><br>
        Sua Rika adquire a capacidade de armazenar técnicas por conta própria, sem utilizar o limite do usuário. Ela recebe uma quantidade de técnicas extras igual ao seu modificador de Presença.
        </div>
        `
    },
    {
        nome: "Combate Amoroso",
        categoria: "CÓPIA",
        nivel: 2,
        tipo: "Habilidade Conjunta",
        conjuracao: "Especial",
        alcance: "Corpo a corpo",
        alvo: "Uma criatura",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Conjunta</strong><br>
        <strong>Custo de Ação:</strong> Comum + Reação (ou Complexa + Reação)<br><br>
        Você e Rika golpeiam juntos. Você pode usar uma ação comum enquanto Rika usa uma reação, ou vice-versa (Rika ação complexa e você reação), para realizar um ataque conjunto com duas rolagens de ataque.
        </div>
        `
    },

    // NÍVEL 3
    {
        nome: "Leque de Fortalecimento Amaldiçoado",
        categoria: "CÓPIA",
        nivel: 3,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -6 de Energia Máxima<br><br>
        Sua Rika recebe 1 característica adicional para a invocação, recebendo outra no nível 15.
        </div>
        `
    },
    {
        nome: "Rika me Proteja!",
        categoria: "CÓPIA",
        nivel: 3,
        tipo: "Habilidade de Técnica",
        conjuracao: "Reação",
        alcance: "6 Metros",
        alvo: "O Usuário",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Reação<br>
        <strong>Alcance:</strong> 6 Metros<br>
        <strong>Alvo:</strong> O Usuário<br><br>
        Ao ser alvo de um ataque, a Rika pode ser invocada para tomar o dano em seu lugar. Ela recebe o dano com vulnerabilidade e não pode aplicar nenhuma de suas resistências ou RD nesta instância.
        </div>
        `
    },

    // NÍVEL 4
    {
        nome: "Proteção Amorosa",
        categoria: "CÓPIA",
        nivel: 4,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "6 Metros",
        alvo: "O Usuário",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -8 de Energia Máxima<br><br>
        Enquanto Rika estiver a até 6 metros de você, ela dificulta a visão dos inimigos e você recebe +6 de RD.
        </div>
        `
    },

    // NÍVEL 5
    {
        nome: "Rainha das Maldições",
        categoria: "CÓPIA",
        nivel: 5,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "6 Metros",
        alvo: "Si mesmo e Rika",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br>
        <strong>Custo:</strong> -10 de Energia Máxima<br><br>
        Espíritos amaldiçoados abaixo de Grau Especial possuem desvantagem para acertar ataques contra Rika ou contra você (caso esteja a até 6 metros dela).
        </div>
        `
    },

    {
    nome: "Liberação Amorosa",
    categoria: "CÓPIA",
    nivel: 5,
    tipo: "Habilidade de Feitiço Máxima",
    conjuracao: "Ação Completa",
    alcance: "27 Metros (Linha)",
    alvo: "Área (4,5m de largura)",
    duracao: "Imediata",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Habilidade de Técnica Máxima</strong><br>
    <strong>Requisito:</strong> Eu te Libero dessa Maldição.<br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Área:</strong> 27m de linha por 4,5m de largura<br><br>

    No momento derradeiro, você libera seu voto de restrição para que Rika dispare toda a sua energia em um único feixe. <br><br>
    
    <strong>Efeito:</strong> Rika realiza um teste de Distância utilizando metade de seu modificador como bônus. Em um sucesso, causa <strong>320 de dano energético</strong>, somando <strong>toda a sua energia atual</strong> como bônus no dano. <br><br>
    
    <strong>Penalidade Sombria:</strong> Após o uso, Rika fica com 0 de energia. Você pode utilizar este feitiço uma <strong>única vez</strong>, perdendo a invocação da Rika, suas cópias e o acesso à técnica até o próximo interlúdio, entrando na mecânica de <em>"Recuperando o Amor"</em>.
    </div>
    `
},

    // NÍVEL 0
    {
        nome: "Estoque das Sombras",
        categoria: "DEZ SOMBRAS",
        nivel: 0,
        tipo: "Habilidade Passiva",
        conjuracao: "Passiva",
        alcance: "Pessoal",
        alvo: "Si mesmo",
        duracao: "Permanente",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade Passiva</strong><br><br>
        Você armazena itens na sua própria sombra (até 5 espaços). Retirar um item é uma ação livre na primeira vez, tornando-se ação bônus nas vezes seguintes.
        </div>
        `
    },

    // NÍVEL 1
    {
        nome: "Ocultação Sombria",
        categoria: "DEZ SOMBRAS",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "4,5 Metros",
        alvo: "Uma Sombra",
        duracao: "Variável",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br>
        <strong>Alcance:</strong> 4,5 Metros<br><br>
        Você entra em uma sombra e se torna indetectável e invisível, sendo movido por ela. Se sair da sombra para atacar a criatura dona da sombra, o alvo faz um TR de Reflexos; em falha, fica desprevenido contra o ataque.
        </div>
        `
    },
    {
        nome: "Passo Sombrio",
        categoria: "DEZ SOMBRAS",
        nivel: 1,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma Sombra",
        duracao: "Imediata",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Conjuração:</strong> Ação Bônus<br>
        <strong>Alcance:</strong> 9 Metros<br><br>
        Você se teleporta para a sombra de uma criatura não hostil. Esse movimento não provoca ataques de oportunidade.
        </div>
        `
    },

    // NÍVEL 2
    {
        nome: "Fortalecimento Sombrio: Dano",
        categoria: "DEZ SOMBRAS",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma Sombra Invocada",
        duracao: "Sustentada",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br>
        <strong>Custo:</strong> 1 PE por turno<br><br>
        A invocação escolhida recebe um adicional de 2d12 em suas ações complexas de dano.
        </div>
        `
    },
    {
        nome: "Fortalecimento Sombrio: Precisão",
        categoria: "DEZ SOMBRAS",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma Sombra Invocada",
        duracao: "Duas Rodadas",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br><br>
        A invocação escolhida recebe um adicional de +2 no acerto de seus ataques.
        </div>
        `
    },
    {
        nome: "Fortalecimento Sombrio: Defesa",
        categoria: "DEZ SOMBRAS",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma Sombra Invocada",
        duracao: "Duas Rodadas",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br><br>
        A invocação escolhida recebe um adicional de +2 em sua Defesa.
        </div>
        `
    },
    {
        nome: "Fortalecimento Sombrio: Dificuldade",
        categoria: "DEZ SOMBRAS",
        nivel: 2,
        tipo: "Habilidade de Técnica",
        conjuracao: "Ação Bônus",
        alcance: "9 Metros",
        alvo: "Uma Sombra Invocada",
        duracao: "Duas Rodadas",
        desc: `
        <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
        <strong>Habilidade de Técnica</strong><br><br>
        A invocação escolhida recebe um adicional de +2 em sua Classe de Dificuldade (CD).
        </div>
        `
    },

    // NÍVEL 3
{
    nome: "Fuga do Coelho",
    categoria: "DEZ SOMBRAS",
    nivel: 3,
    tipo: "Habilidade de Técnica",
    conjuracao: "Reação",
    alcance: "Pessoal",
    alvo: "Si mesmo",
    duracao: "Imediata",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Evasão de Sombras</strong><br>
    <strong>Requisito:</strong> Ter o Shikigami "Coelho" como invocação conquistada.<br><br>

    Ao ser alvo de um ataque, você manifesta instantaneamente uma horda de coelhos sombrios que inundam a área, servindo como distração e escudo.<br><br>

    <strong>Efeitos da Técnica:</strong><br>
    • <strong>Redução de Dano:</strong> O impacto do ataque recebido é reduzido em <strong>18</strong>.<br>
    • <strong>Recuar Estratégico:</strong> Como parte da mesma reação, você pode se mover até <strong>9 metros</strong> para um espaço desocupado. Este movimento não provoca ataques de oportunidade.<br><br>

    <strong>Nota Narrativa:</strong> Os coelhos não são controláveis individualmente. Eles se espalham de forma caótica pelo campo e desaparecem automaticamente no início do seu próximo turno.
    </div>
    `
},
{
    nome: "Materialização de Sombras: Clones",
    categoria: "DEZ SOMBRAS",
    nivel: 3,
    tipo: "Habilidade de Técnica",
    conjuracao: "Variável",
    alcance: "Pessoal",
    alvo: "Si mesmo",
    duracao: "Imediata",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Embaralhamento Sensorial</strong><br>
    Você manifesta duplicatas de sombra que emergem do solo para confundir os sentidos do adversário.<br><br>

    <strong>Criação de Clones:</strong><br>
    • <strong>Ação Bônus:</strong> Cria 1 clone.<br>
    • <strong>Ação Comum:</strong> Cria 2 clones.<br>
    • <strong>Ação Completa:</strong> Cria 3 clones.<br><br>

    <strong>Características dos Clones:</strong><br>
    • <strong>Vitalidade:</strong> Cada clone possui 1 PV.<br>
    • <strong>Intercepção (Reação):</strong> O clone pode usar sua reação para se interpor em um ataque direcionado a você, reduzindo o dano sofrido em <strong>4</strong>.<br><br>

    <strong>Mecânica de Engano:</strong><br>
    Ao atacar, o alvo deve realizar um <strong>Teste de Astúcia</strong>. Em caso de falha, ele atinge um clone em vez de você. Se após esse ataque ainda restar ao menos um clone de pé, o alvo recebe a condição <strong>Desprevenido</strong> devido à desorientação.
    </div>
    `
},
{
    nome: "Utilizar de Sombras",
    categoria: "DEZ SOMBRAS",
    nivel: 3,
    tipo: "Habilidade de Técnica",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Uma Criatura ou Área",
    duracao: "Imediata",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Manifestação Residual</strong><br>
    Você canaliza a essência de um Shikigami já derrotado no ritual de exorcismo para executar uma de suas ações, desde que a execução seja fisicamente possível para você.<br><br>

    <strong>Execução e Acerto:</strong><br>
    Para habilidades que exigem acerto, utilize seu teste de <strong>Amaldiçoado, Distância ou Corpo a Corpo</strong> (conforme a natureza do ataque).<br><br>

    <strong>Cálculo de Dano:</strong><br>
    O dano causado segue os valores abaixo, a menos que o dano base original da invocação seja <strong>maior</strong> (nesse caso, utiliza-se o maior):<br>
    • <strong>Alvo Único (Ataque):</strong> 8d8 de dano.<br>
    • <strong>Alvo Único (TR):</strong> 7d8 de dano (caso exija Teste de Resistência).<br>
    • <strong>Habilidade em Área:</strong> 5d12 de dano em caso de falha no teste dos alvos.
    </div>
    ` + criarEscalaPorNivel("Utilizar de Sombras", [
        { dano: "8d8/7d8", extra: "Usa o maior entre o base ou da invocação" },
        { dano: "5d12", extra: "Dano em área (Usa o maior entre base ou invocação)" }
    ])
},
{
    nome: "Quimera",
    categoria: "DEZ SOMBRAS",
    nivel: 3,
    tipo: "Habilidade de Técnica",
    conjuracao: "Variável",
    alcance: "Pessoal",
    duracao: "Variável",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Síntese de Sombras</strong><br>
    Ao realizar a invocação, você pode fundir seus Shikigamis em uma criatura única e poderosa.<br><br>

    <strong>Modos de Conjuração:</strong><br>
    • <strong>Ação Comum:</strong> Mescla <strong>dois</strong> Shikigamis.<br>
    • <strong>Ação Completa:</strong> Mescla <strong>três</strong> Shikigamis.<br><br>

    <strong>Atributos da Quimera:</strong><br>
    • <strong>Vitalidade:</strong> Soma os PVs totais de todos os envolvidos.<br>
    • <strong>Mobilidade e Defesa:</strong> Utiliza o maior valor de Movimento e a maior Defesa entre eles, somando o seu <strong>Bônus de Treinamento</strong> à Defesa final.<br>
    • <strong>Ações e Traços:</strong> Recebe todas as características e habilidades de ambos. A quantidade de ações por turno é igual à do Shikigami que possuir o maior número de ações originalmente.<br><br>

    <strong>Instabilidade da Trindade:</strong><br>
    Caso utilize a versão de <strong>3 Shikigamis</strong>, a forma tripla dura rodadas igual ao nível da técnica (3 rodadas). Após esse tempo, a Quimera decai: um dos Shikigamis é devolvido às sombras e a criatura permanece como uma mescla de apenas dois.
    </div>
    `
},

    // NÍVEL 4
{
    nome: "Ataque de Clones",
    categoria: "DEZ SOMBRAS",
    nivel: 4,
    tipo: "Habilidade de Técnica",
    conjuracao: "Ação Comum",
    alcance: "18 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Habilidade de Técnica</strong><br>
    <strong>Requisito:</strong> Possuir um clone de pé.<br><br>

    Você avança em conjunto com seu clone, realizando uma sequência de ataques coordenados onde apenas o seu golpe real causa dano. <br><br>

    <strong>Execução:</strong><br>
    • O alvo deve realizar um <strong>Teste de Astúcia</strong>. Em uma falha, ele fica <strong>Desprevenido</strong> e <strong>Desorientado</strong>. Em um sucesso, ele ignora estas condições.<br>
    • Em seguida, você realiza uma <strong>Rolagem de Corpo a Corpo</strong> contra o alvo. <br><br>
    
    <strong>Efeito de Acerto:</strong><br>
    Se o ataque atingir, você causa o dano do seu ataque com um adicional de <strong>8d10 (Pós Ataque)</strong>.
    </div>
    ` + criarEscalaPorNivel("Ataque de Clones", [
        { dano: "Ataque + 8d10", extra: "Adicional pós-ataque" }
    ])
},
{
    nome: "Sombras Parciais: Ecos do Abismo",
    categoria: "DEZ SOMBRAS",
    nivel: 4,
    tipo: "Habilidade de Técnica",
    conjuracao: "Ação Bônus",
    alcance: "6 Metros", // Adicionado para clareza de onde a sombra surge
    duracao: "Cena", // Alterado de "Imediata" para "Cena", pois o efeito de invocação persiste
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Manifestação Imperfeita</strong><br>
    Você é capaz de forçar a manifestação de Shikigamis que já foram destruídos, moldando seus restos de sombra em formas instáveis e nefastas.<br><br>

    <strong>Custo de Ativação:</strong> Metade do custo original de invocação do Shikigami escolhido.<br><br>

    <strong>Características da Sombra Parcial:</strong><br>
    • <strong>Atributos Reduzidos:</strong> A criatura retorna com apenas 50% de todos os seus atributos, PV, CA e bônus de ataque originais.<br>
    • <strong>Natureza Efêmera:</strong> Por ser uma forma incompleta e distorcida, ela carece da inteligência ou habilidades complexas que possuía em vida.<br>
    • <strong>Persistência:</strong> Embora seja uma "Sombra Parcial", ela permanece em campo até ser derrotada novamente ou dispensada.
    </div>
    `
},
    // NÍVEL 5
{
    nome: "Roda do General: Rito de Exorcismo",
    categoria: "DEZ SOMBRAS",
    nivel: 5,
    tipo: "Habilidade de Técnica",
    conjuracao: "Ação Completa",
    alcance: "Pessoal",
    alvo: "Si mesmo",
    duracao: "5 Rodadas",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Cântico de Invocação:</strong> <i>"Com este tesouro, eu invoco..."</i><br><br>
    
    <strong>Requisito:</strong> Ter domado o General Divino (Mahoraga).<br><br>

    Ao realizar o selo manual, você manifesta sobre sua cabeça a <strong>Roda do Dharma</strong> do General. Em vez de invocar a criatura, você assume sua natureza adaptativa.<br><br>

    <strong>Efeitos Ativos:</strong><br>
    • <strong>Burlar Defesas:</strong> Seus ataques ignoram resistências e reduções de dano conforme a ficha do General.<br>
    • <strong>Adaptação Progressiva:</strong> Você recebe a característica <i>Adaptação Defensiva</i>. Embora a técnica dure 5 rodadas, qualquer adaptação concluída permanece ativa até o <strong>fim da cena</strong>.<br><br>

    <strong>Fraqueza:</strong> O uso de <i>Revestimento de Domínio</i> por parte dos oponentes anula temporariamente esses bônus enquanto você estiver em contato com o efeito.
    </div>
    `
},

{
    nome: "LIBERAÇÃO MÁXIMA: Lar da Sombra",
    categoria: "DEZ SOMBRAS",
    nivel: 1,
    tipo: "Habilidade de Técnica",
    conjuracao: "Ação Bônus",
    alcance: "6 Metros",
    alvo: "Uma Sombra",
    duracao: "Especial",
    desc: `
    <div style="overflow-y: auto; max-height: 250px; padding-right: 5px;">
    <strong>Domínio das Sombras</strong><br>
    Você e um de seus Shikigamis mergulham em uma sombra dentro do alcance. Enquanto habitam esse espaço, ambos tornam-se <strong>invisíveis e indetectáveis</strong>. <br><br>

    <strong>Movimentação e Limitações:</strong><br>
    • Vocês perdem a capacidade de movimento autônomo, deslocando-se estritamente conforme a projeção da sombra escolhida.<br>
    • A permanência dura até que você decida emergir ou até que a sombra seja dissipada (o que expulsa ambos imediatamente para o espaço adjacente).<br><br>

    <strong>Assalto Sombrio:</strong><br>
    Ao emergir para realizar um ataque contra o dono da sombra, o alvo é considerado <strong>Desprevenido</strong>. No momento da saída, você deve escolher uma das seguintes táticas:<br>
    • <strong>Infiltração Solo:</strong> Apenas você emerge.<br>
    • <strong>Assalto de Besta:</strong> Apenas o Shikigami emerge.<br>
    • <strong>Ataque Combinado:</strong> Ambos emergem simultaneamente para o combate.
    </div>
    `
},

{
    nome: "Punho Pesado",
    categoria: "BOM BA YE",
    nivel: 0,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Você aumenta sua massa levemente para impulsionar os seus golpes físicos. 
    Enquanto Punho Pesado estiver ativada, todo ataque corpo-a-corpo causa dano adicional.
    Para cada turno após o primeiro, paga 1 ponto de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado", [
        { dano: "1d6", extra: "Sustentada • Turno 1+" }
    ])
},
{
    nome: "Transformar Garuda",
    categoria: "BOM BA YE",
    nivel: 0,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Toque",
    alvo: "Garuda",
    duracao: "Ilimitada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Toque<br>
    <strong>Alvo:</strong> Garuda<br>
    <strong>Duração:</strong> Ilimitada<br><br>

    Você transforma seu shikigami Garuda em uma ferramenta amaldiçoada em formato de chicote. 
    Você trata como se tivesse maestria com ela e a transformação dura o tempo que desejar, podendo reverter como ação livre. 
    Enquanto em forma de chicote, Garuda causa dano e tem as características Estendida e Pesada.
    ` + criarEscalaPorNivel("Transformar Garuda", [
        { dano: "1d8", extra: "Forma de chicote • Sustentada" }
    ])
},
{
    nome: "Deslocamento Forçado",
    categoria: "BOM BA YE",
    nivel: 0,
    tipo: "Habilidade Feitiço Passiva",
    desc: `
    <strong>Habilidade Feitiço Passiva</strong><br>
    Utilizando sua amplificação de massa, você força os pés contra o chão para aumentar sua velocidade e força. 
    Sempre que estiver com alguma forma de Punho Pesado ativa, você recebe 1,5 metros de deslocamento adicional.
`
},
{
    nome: "Punho Pesado: Amplificação",
    categoria: "BOM BA YE",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Um aumento maior de massa para impulsionar seus golpes. 
    Enquanto Punho Pesado: Amplificação estiver ativada, todo ataque corpo-a-corpo causa dano adicional e soma +2 ao total. 
    Para cada turno após o primeiro, paga 1 ponto de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado: Amplificação", [
        { dano: "1d10", extra: "Sustentada • Turno 1+" }
    ])
},

{
    nome: "Laço Pesado",
    categoria: "BOM BA YE",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "12 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 12 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você comanda Garuda a avançar contra um alvo e tentar prendê-lo, laçando-o e usando da sua massa para diminuir o movimento dele. 
    A criatura alvo deve realizar um teste de <strong>Reflexos</strong>. 
    Em falha, recebe as condições <strong>Agarrado</strong> e <strong>Desprevenido</strong>, com Garuda se laçando nela. 
    Para escapar, repete o teste no começo de cada turno, livrando-se de Garuda em um sucesso.
`
},
{
    nome: "Chute Direto",
    categoria: "BOM BA YE",
    nivel: 1,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Corpo-a-Corpo",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> Corpo-a-Corpo<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você realiza um avanço seguido de um chute direto, mirando na cabeça do alvo. 
    Teste de Corpo a Corpo para acertar. Em sucesso, causa dano de impacto. 
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Chute Direto", [
        { dano: "4d8", extra: "Impacto • Amplificações aumentam o dano" }
    ])
},
{
    nome: "Punho Pesado: Amplificação Dupla",
    categoria: "BOM BA YE",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Um aumento maior de massa para impulsionar seus golpes. 
    Enquanto Punho Pesado: Amplificação Dupla estiver ativada, todo ataque corpo-a-corpo tem o dano aumentado.
    Para cada turno após o primeiro, paga 1 ponto de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado: Amplificação Dupla", [
        { dano: "2d8", extra: "Sustentada • Turno 1+" }
    ])
},

{
    nome: "Esmagamento",
    categoria: "BOM BA YE",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "12 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 12 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você usa Garuda como um chicote reforçado para esmagar um alvo. 
    Realize um ataque de Corpo a Corpo. Em sucesso, causa dano de impacto. 
    A criatura acertada deve realizar um teste de <strong>Fortitude</strong>; em falha, é derrubada.
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Esmagamento", [
        { dano: "8d8", extra: "Falha TR Fortitude: Derrubado" }
    ])
},
{
    nome: "Punho Imparável",
    categoria: "BOM BA YE",
    nivel: 2,
    tipo: "Habilidade Feitiço Passiva",
    desc: `
    <strong>Habilidade Feitiço Passiva</strong><br>
    Enquanto amplificado, nada pode impedir o poder dos seus punhos e da massa imbuída neles. 
    Enquanto estiver com alguma habilidade de Punho Pesado ativa, seus ataques corpo-a-corpo ignoram redução de dano igual ao seu bônus de treinamento. 
    Seu máximo de energia amaldiçoada diminui em 4.
`
},
{
    nome: "Combinação Amplificada",
    categoria: "BOM BA YE",
    nivel: 2,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "Corpo-a-Corpo",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> Corpo-a-Corpo<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você utiliza Garuda em forma de Shikigami para criar um ataque combinado potente contra o alvo. 
    A Garuda o distrai fingindo um ataque, forçando-o a realizar um teste de <strong>Astúcia</strong>; 
    em falha, fica desprevenido e desorientado, em sucesso ignora as condições. 
    Você então aproveita a brecha para realizar 2 golpes normalmente.
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Combinação Amplificada", [
        { dano: "Variável", extra: "2 Golpes • Amplificações aumentam o dano" }
    ])
},

{
    nome: "Punho Pesado: Amplificação Tripla",
    categoria: "BOM BA YE",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Aumenta grandemente a massa para seus próximos golpes. 
    Enquanto Punho Pesado: Amplificação Tripla estiver ativada, todo ataque corpo-a-corpo causa dano adicional. 
    Para cada turno após o primeiro, paga 2 pontos de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado: Amplificação Tripla", [
        { dano: "3d8", extra: "Sustentada • Turno 1+" }
    ])
},
{
    nome: "Chute Devastador",
    categoria: "BOM BA YE",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "24 Metros",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> 24 Metros<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Reforça a si mesmo e Garuda com massa imaginária e utiliza o shikigami como projétil. 
    O alvo realiza um teste de <strong>Reflexos</strong>. 
    Em falha, recebe dano de impacto; em sucesso, metade. 
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Chute Devastador", [
        { dano: "12d8", extra: "Falha TR Reflexos: Dano total • Sucesso metade" }
    ])
},
{
    nome: "Golpe Amplificado",
    categoria: "BOM BA YE",
    nivel: 3,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Corpo-a-Corpo",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> Corpo-a-Corpo<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você se acelera utilizando amplificação e desfere um poderoso golpe na cabeça do alvo. 
    Teste de Corpo a Corpo para acertar. 
    Em sucesso, o alvo recebe dano de impacto e deve realizar um teste de <strong>Fortitude</strong>; 
    em falha, sofre a condição <strong>Caído</strong>, em sucesso ignora.
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Golpe Amplificado", [
        { dano: "16d8", extra: "Falha TR Fortitude: Caído • Sucesso ignora" }
    ])
},

{
    nome: "Punho Pesado: Amplificação Quádrupla",
    categoria: "BOM BA YE",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Amplifica a massa imaginária até quase quebrar os limites. 
    Enquanto Punho Pesado: Amplificação Quádrupla estiver ativada, todo ataque corpo-a-corpo causa dano adicional. 
    Para cada turno após o primeiro, paga 2 pontos de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado: Amplificação Quádrupla", [
        { dano: "3d10", extra: "Sustentada • Turno 1+" }
    ])
},
{
    nome: "Destruição Absoluta",
    categoria: "BOM BA YE",
    nivel: 4,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Linha de 18 Metros",
    alvo: "Todas as criaturas na linha",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Área:</strong> Linha de 18 Metros<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você usa Garuda como ferramenta para criar uma onda de destruição absoluta em linha. 
    Todas as criaturas na linha realizam teste de <strong>Reflexos</strong>. 
    Em falha, recebem dano de impacto; em sucesso, metade. 
    Opcionalmente, a área pode se tornar terreno difícil. 
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Destruição Absoluta", [
        { dano: "10d10", extra: "Falha TR Reflexos: Dano total • Sucesso metade" }
    ])
},
{
    nome: "Punhos Esmagadores",
    categoria: "BOM BA YE",
    nivel: 4,
    tipo: "Habilidade Feitiço Passiva",
    desc: `
    <strong>Habilidade Feitiço Passiva</strong><br>
    Sua amplificação se torna tão forte que os inimigos sofrem com o impacto de seus ataques mais poderosos. 
    Todo golpe crítico realizado com amplificação tripla ou superior força o inimigo a realizar teste de <strong>Fortitude</strong>; 
    em falha, recebe a condição <strong>Enjoado</strong>. 
    Seu máximo de energia amaldiçoada é reduzido em 8.
`
},

{
    nome: "Punho Pesado: Amplificação Quíntupla",
    categoria: "BOM BA YE",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Bônus",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Sustentada",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Bônus<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Sustentada<br><br>

    Amplifica a massa imaginária até quebrar os limites. 
    Enquanto Punho Pesado: Amplificação Quíntupla estiver ativada, todo ataque corpo-a-corpo causa dano adicional. 
    Para cada turno após o primeiro, paga 2 pontos de energia amaldiçoada para sustentar.
    ` + criarEscalaPorNivel("Punho Pesado: Amplificação Quíntupla", [
        { dano: "4d12", extra: "Sustentada • Turno 1+" }
    ])
},
{
    nome: "Golpe Devastador",
    categoria: "BOM BA YE",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Comum",
    alcance: "Corpo-a-Corpo",
    alvo: "Uma Criatura",
    duracao: "Imediata",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Comum<br>
    <strong>Alcance:</strong> Corpo-a-Corpo<br>
    <strong>Alvo:</strong> Uma Criatura<br>
    <strong>Duração:</strong> Imediata<br><br>

    Você amplifica sua massa a níveis devastadores, causando enorme dano sem armas. 
    Teste de Corpo a Corpo para acertar. Em sucesso, o alvo recebe dano desarmado + adicional. 
    O alvo deve realizar um teste de <strong>Fortitude</strong>:
    falha → um braço destruído,  
    sucesso comum → braço inutilizado,  
    sucesso crítico → ignora condição. 
    Amplificações aumentam o dano desta técnica.
    ` + criarEscalaPorNivel("Golpe Devastador", [
        { dano: "6d12", extra: "TR Fortitude: falha braço destruído • sucesso comum braço inutilizado • crítico ignora" }
    ])
},
{
    nome: "Impacto Devastador",
    categoria: "BOM BA YE",
    nivel: 5,
    tipo: "Habilidade Feitiço Passiva",
    desc: `
    <strong>Habilidade Feitiço Passiva</strong><br>
    Seus golpes normais podem desestabilizar defesas inimigas devido à amplificação de massa. 
    Ao realizar um Raio Negro com amplificação, o alvo deve realizar um teste de <strong>Fortitude</strong>, 
    ficando fragilizado por 1 rodada. 
    Seu máximo de Energia amaldiçoada é reduzido em 10.
`
},

{
    nome: "Fera Indomável",
    categoria: "BOM BA YE",
    nivel: 5,
    tipo: "Habilidade Feitiço",
    conjuracao: "Ação Completa",
    alcance: "Próprio",
    alvo: "Próprio",
    duracao: "Cena",
    desc: `
    <strong>Habilidade Feitiço</strong><br>
    <strong>Conjuração:</strong> Ação Completa<br>
    <strong>Alcance:</strong> Próprio<br>
    <strong>Alvo:</strong> Próprio<br>
    <strong>Duração:</strong> Cena<br><br>

    Você entra em um modo completamente selvagem, focado apenas na destruição do inimigo. 
    Ao ativar, você recebe as seguintes modificações:
    <ul>
        <li>+28 de dano fixo em ataques Corpo a Corpo</li>
        <li>10 pontos para distribuir entre seus atributos (máximo de 4 em um único atributo)</li>
        <li>+6 em suas CDs</li>
        <li>Ignora 14 de RD em seus ataques Corpo a Corpo (escolher 1 tipo de dano)</li>
    </ul>
    Ao fim da cena, você recebe 5 níveis de exaustão.
`
}



];


// --- 2. FUNÇÕES DE ROLAGEM DE DADOS (Colocadas no TOPO para não dar erro) ---

// Função global para rolar Perícias e Resistências
window.rolarDado = function(nome, idCampo) {
    const el = document.getElementById(idCampo);
    if (!el) return;

    // 1. Pega o texto e limpa espaços extras e caracteres não numéricos (mantendo o sinal de -)
    let textoLimpo = (el.innerText || el.value || "0").trim();
    
    // 2. Extrai apenas os números e o sinal de menos usando Regex
    // Isso evita que ícones ou textos dentro da div quebrem o cálculo
    let bonusMatch = textoLimpo.match(/-?\d+/);
    let bonus = bonusMatch ? parseInt(bonusMatch[0]) : 0;
    
    // 3. Rola o dado
    let dado = Math.floor(Math.random() * 20) + 1;
    
    // 4. SOMA MATEMÁTICA REAL
    let total = dado + bonus;

    // 5. Log de debug no console para você ver se os números estão certos
    console.log(`Rolagem: ${dado} + Bônus: ${bonus} = Total: ${total}`);

    exibirLog(nome.toUpperCase(), dado, bonus, total);
};

// Função para rolar Atributos
window.rolarAtributo = function(nome, idMod) {
    window.rolarDado(nome, idMod);
};

// Função de rolar Ataques
window.rolarAtaque = function(tipo) {
    const idAtr = `atr-${tipo}`;       
    const idOutros = `outros-${tipo}`; 
    const idCheck = `check-${tipo}`;   
    
    const elAtr = document.getElementById(idAtr);
    const siglaAtr = elAtr ? elAtr.value : "FOR";
    
    const elMod = document.getElementById(`mod-${siglaAtr.toLowerCase()}`);
    const modAtributo = elMod ? (parseInt(elMod.innerText.replace('+', '')) || 0) : 0;

    const nivel = parseInt(document.getElementById('view-nivel')?.value) || 1;
    const metadeNivel = Math.floor(nivel / 2);

    const outros = parseInt(document.getElementById(idOutros)?.value) || 0;
    const treinado = document.getElementById(idCheck)?.checked ? 2 : 0;
    
    const bonusTotal = modAtributo + metadeNivel + treinado + outros;
    const dado = Math.floor(Math.random() * 20) + 1;
    const totalFinal = dado + bonusTotal;

    const nomes = { 'corpo': 'Ataque Corpo a Corpo', 'distancia': 'Ataque à Distância', 'amal': 'Ataque Amaldiçoado' };
    exibirLog(nomes[tipo], dado, bonusTotal, totalFinal);
};

// Garante que a função seja visível globalmente
window.rolarAtaqueRapido = function(nome, formulaOuBonus, tipo) {
    console.log("Iniciando rolagem:", nome, formulaOuBonus);

    // Se o valor contiver um 'd' (ex: 2d6+4), rolamos DANO
    if (formulaOuBonus.toString().includes('d')) {
        const resultado = processarFormulaDano(formulaOuBonus);
        // Chamamos o log passando a fórmula no lugar do dado
        exibirLog(nome, formulaOuBonus, 0, resultado);
    } 
    // Se for apenas número, rolamos ACERTO (d20)
    else {
        const dado = Math.floor(Math.random() * 20) + 1;
        const bonus = parseInt(formulaOuBonus) || 0;
        const total = dado + bonus;
        exibirLog(nome, dado, bonus, total);
    }
};

function mostrarAba(nomeAba) {
    // Esconde todos os conteúdos de abas
    document.querySelectorAll('.tab-content').forEach(div => {
        div.classList.add('hidden');
    });

    // Mostra apenas a aba clicada
    const abaAlvo = document.getElementById('aba-' + nomeAba);
    if (abaAlvo) {
        abaAlvo.classList.remove('hidden');
    }

    // SÓ CARREGA OS CARDS SE CLICAR EM TALENTOS
    if (nomeAba === 'talentos') {
        carregarTalentosAutomatico();
    }
}


// --- 3. CARREGAMENTO INICIAL ---
document.addEventListener('DOMContentLoaded', function() {
    const personagemSalvo = localStorage.getItem('personagem_atual');
    
    // Listener para o Bônus de CA
    document.getElementById('view-ca')?.addEventListener('input', atualizarTudo);

    if (personagemSalvo) {
        // 🔥 IMPORTANTE: Removido o 'const' para usar a variável global 'dados'
        dados = JSON.parse(personagemSalvo); 
        
        // Habilidades e Técnicas
        if (dados.habilidades_lista) minhasHabilidades = dados.habilidades_lista;
        if (dados.tecnicas_lista) minhasTecnicas = dados.tecnicas_lista;
        renderizarListaTecnicas();

        if (dados.aptidoes_lista) {
            minhasAptidoes = dados.aptidoes_lista;
        } else {
            minhasAptidoes = [];
        }

        // Carregar níveis das aptidões
        if (dados.niveis_aptidoes) {
            document.getElementById("nivel-aura").value = dados.niveis_aptidoes.aura || 0;
            document.getElementById("nivel-controle").value = dados.niveis_aptidoes.controle || 0;
            document.getElementById("nivel-dominio").value = dados.niveis_aptidoes.dominio || 0;
            document.getElementById("nivel-barreira").value = dados.niveis_aptidoes.barreira || 0;
            document.getElementById("nivel-reversa").value = dados.niveis_aptidoes.reversa || 0;
        }

        // Dados Básicos
        if(dados.nome) document.getElementById('view-nome').innerText = dados.nome.toUpperCase();
        if(document.getElementById('view-jogador')) document.getElementById('view-jogador').innerText = dados.jogador || "--";
        if(document.getElementById('view-tecnica')) document.getElementById('view-tecnica').innerText = dados.tecnica || "Inata";
        if(document.getElementById('view-especializacao')) document.getElementById('view-especializacao').innerText = dados.especializacao || "--";
        if(document.getElementById('view-origem')) document.getElementById('view-origem').innerText = dados.cla || dados.anatomia || dados.origem || "--";
        if(dados.imagem && document.getElementById('view-img')) document.getElementById('view-img').src = dados.imagem;
        if(document.getElementById('view-nivel')) document.getElementById('view-nivel').value = dados.nivel || 1;

        // Atributos
        const mapaAttr = {"FORÇA": "base-for", "DESTREZA": "base-des", "CONSTITUIÇÃO": "base-con", "INTELIGÊNCIA": "base-int", "SABEDORIA": "base-sab", "PRESENÇA": "base-pre"};
        if (dados.atributos) {
            for (let nome in mapaAttr) {
                const input = document.getElementById(mapaAttr[nome]);
                if (input && dados.atributos[nome] !== undefined) input.value = dados.atributos[nome];
            }
        }

        // Perícias
        if (dados.niveis_pericias) {
            for (let p in dados.niveis_pericias) {
                const el = document.getElementById(`treino-${p}`);
                if (el) el.value = dados.niveis_pericias[p];
            }
        }
        
        // Bônus CA
        if (dados.bonus_ca !== undefined) {
            const inputCA = document.getElementById('view-ca');
            if (inputCA) inputCA.value = dados.bonus_ca;
        }

        // Ataques
        if (dados.ataques_base) {
            const tipos = ['corpo', 'distancia', 'amal'];
            tipos.forEach(t => {
                const info = dados.ataques_base[t];
                if (info) {
                    if (document.getElementById(`atr-${t}`)) document.getElementById(`atr-${t}`).value = info.atr || "";
                    if (document.getElementById(`outros-${t}`)) document.getElementById(`outros-${t}`).value = info.outros || 0;
                    if (document.getElementById(`check-${t}`)) document.getElementById(`check-${t}`).checked = info.treinado || false;
                }
            });
        }

        // RDs
        if (dados.rds) {
            const mapaIds = {
                cor: 'rd-cortante', per: 'rd-perfurante', imp: 'rd-impacto',
                acido: 'rd-acido', conge: 'rd-congelante', choco: 'rd-chocante',
                quei: 'rd-queimante', soni: 'rd-sonico', alma: 'rd-na-alma',
                reversa: 'rd-en-reversa', energe: 'rd-energetico', psiqui: 'rd-psiquico',
                radia: 'rd-radiante', necro: 'rd-necrotico', veneno: 'rd-venenoso'
            };
            for (let chave in dados.rds) {
                const idReal = mapaIds[chave];
                const campo = document.getElementById(idReal);
                if (campo) campo.value = dados.rds[chave] || 0;
            }
        }

        // 🔥 STATUS DE COMBATE (Corrigido para carregar os EXTRAS)
        if (dados.status_combate) {
            const sc = dados.status_combate;
            if(document.getElementById('pv-atual')) document.getElementById('pv-atual').value = sc.pv_atual || "";
            if(document.getElementById('pe-atual')) document.getElementById('pe-atual').value = sc.pe_atual || "";
            if(document.getElementById('pi-atual')) document.getElementById('pi-atual').value = sc.pi_atual || "";
            if(document.getElementById('estamina-atual')) document.getElementById('estamina-atual').value = sc.estamina_atual || "4";
            if(document.getElementById('preparo-atual')) document.getElementById('preparo-atual').value = sc.preparo_atual || "0";
            
            // Aqui carregamos as diferenças manuais para o cálculo de vida não resetar
            if(document.getElementById('pv-max')) document.getElementById('pv-max').dataset.manualExtra = sc.pv_extra || 0;
            if(document.getElementById('pe-max')) document.getElementById('pe-max').dataset.manualExtra = sc.pe_extra || 0;
            if(document.getElementById('pi-max')) document.getElementById('pi-max').dataset.manualExtra = sc.pi_extra || 0;
            if(document.getElementById('estamina-max')) document.getElementById('estamina-max').dataset.manualExtra = sc.estamina_extra || 0;
            if(document.getElementById('preparo-max')) document.getElementById('preparo-max').dataset.manualExtra = sc.preparo_extra || 0;

            if(sc.exaustao) setExaustao(parseInt(sc.exaustao));
        }
    }

    // Listener para salvar mudanças
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('change', () => {
            atualizarTudo();
            console.log("Ficha auto-salva!");
        });
    });

// --- RESET DE INICIALIZAÇÃO ---
    
    // 1. Calcula os valores reais (ex: transforma o máximo em 4)
    atualizarTudo(); 

    // 2. CORREÇÃO FORÇADA: Se os valores atuais forem maiores que os máximos 
    // ou se for a primeira vez que a ficha abre (vazia).
    const corrigirSeNecessario = (idAtual, idMax) => {
        const atualEl = document.getElementById(idAtual);
        const maxEl = document.getElementById(idMax);
        
        if (atualEl && maxEl) {
            let valAtual = parseInt(atualEl.value) || 0;
            let valMax = parseInt(maxEl.value) || 0;

            // Se o atual for 0, ou se for o "9" fantasma, ou se for maior que o máximo
            if (valAtual === 0 || valAtual === 9 || valAtual > valMax || atualEl.value === "") {
                atualEl.value = maxEl.value;
            }
        }
    };

    // Executa a correção em todos os campos
    corrigirSeNecessario('pv-atual', 'pv-max');
    corrigirSeNecessario('pe-atual', 'pe-max');
    corrigirSeNecessario('pi-atual', 'pi-max');
    corrigirSeNecessario('estamina-atual', 'estamina-max');
    corrigirSeNecessario('preparo-atual', 'preparo-max');

    // 3. SALVAMENTO FINAL: Garante que o Portrait (OBS) receba os dados corrigidos
    atualizarTudo();
    
    // 4. Renderiza as listas e o visual
    renderizarListaFicha();
    renderizarListaAptidoes();
    carregarAtaquesDoPersonagem();
    if(typeof atualizarBarrasVisuais === 'function') atualizarBarrasVisuais();
});

// --- 4. FUNÇÃO MESTRA (CÁLCULOS AUTOMÁTICOS) ---
function atualizarTudo() {
    // 1. Referência do Nível
    const elNivel = document.getElementById('view-nivel');
    const nivel = elNivel ? (Math.max(parseInt(elNivel.value) || 1, 1)) : 1;
    
    // 2. Tenta carregar os dados existentes ou cria um objeto base limpo
    let dadosStorage = JSON.parse(localStorage.getItem('personagem_atual')) || {};
    let dados = { ...dadosStorage };
    if (!dados.tecnicas) dados.tecnicas = [];
    
    // 3. BLINDAGEM: Garante que as sub-estruturas existam para evitar erro de "undefined"
    if (!dados.atributos) dados.atributos = {};
    if (!dados.resistencias) dados.resistencias = {};
    if (!dados.niveis_pericias) dados.niveis_pericias = {};
    if (!dados.status_combate) dados.status_combate = {};
    
    // 4. Captura de Informações Básicas de Texto
    dados.nome = document.getElementById('view-nome')?.innerText || "";
    dados.jogador = document.getElementById('view-jogador')?.innerText || "";
    dados.tecnica = document.getElementById('view-tecnica')?.innerText || "";
    dados.especializacao = document.getElementById('view-especializacao')?.innerText || "";
    dados.origem = document.getElementById('view-origem')?.innerText || "";

    let modsCalculados = {};

    // A) Atributos: Cálculo de Modificadores
    const nomesMapa = {
        'for': 'FORÇA', 'des': 'DESTREZA', 'con': 'CONSTITUIÇÃO', 
        'int': 'INTELIGÊNCIA', 'sab': 'SABEDORIA', 'pre': 'PRESENÇA'
    };

    ['for','des','con','int','sab','pre'].forEach(attr => {
        const elBase = document.getElementById(`base-${attr}`);
        const elMod = document.getElementById(`mod-${attr}`);
        if(elBase){
            const val = parseInt(elBase.value) || 10;
            const mod = Math.floor((val - 10) / 2);
            if(elMod) elMod.innerText = (mod >= 0 ? `+${mod}` : mod);
            modsCalculados[attr] = mod;
            dados.atributos[nomesMapa[attr]] = val;
        }
    });

// --- Status Vitais (PV, PE, PI, Estamina, Preparo) ---
const elEsp = document.getElementById('view-especializacao');
const nomeClasse = elEsp ? elEsp.innerText.toLowerCase().trim() : "";
const classe = dadosClasses[nomeClasse];

if (classe) {
    const mC = modsCalculados['con'] || 0;
    const mI = modsCalculados['int'] || 0;
    const mP = modsCalculados['pre'] || 0;
    const mS = modsCalculados['sab'] || 0;

    // Garante que o objeto de status existe
    if (!dados.status_combate) dados.status_combate = {};

    // 1. CÁLCULOS DE TREINAMENTO (Base fixa do sistema)
    const etapaResistencia = etapasTreino("resistencia");
    let bonusPvTreino = 0;
    if (etapaResistencia >= 1) bonusPvTreino += 4;
    if (etapaResistencia >= 4) bonusPvTreino += 6;

    const etapaCompreensao = etapasTreino("compreensao");
    const etapaControle = etapasTreino("controle-energia");
    let bonusPeTreino = 0;
    if (etapaCompreensao >= 1) bonusPeTreino += 2;
    if (etapaCompreensao >= 3) bonusPeTreino += 3;
    if (etapaControle >= 1) bonusPeTreino += 2;
    if (etapaControle >= 3) bonusPeTreino += 3;

    // 2. FUNÇÃO QUE APLICA E SALVA OS VALORES (Impede o reset no F5)
    const configurarCampo = (id, valorBaseCalculado, keyExtra) => {
        const el = document.getElementById(id);
        if (!el) return;

        // 🔥 O SEGREDO DO F5:
        // Primeiro, tentamos pegar o valor extra direto do objeto 'dados' que o onload carregou.
        // Se não existir (primeira vez), usamos 0.
        let extra = 0;
        if (dados.status_combate && dados.status_combate[keyExtra] !== undefined) {
            extra = parseInt(dados.status_combate[keyExtra]);
        } else if (el.dataset.manualExtra) {
            extra = parseInt(el.dataset.manualExtra);
        }

        // Define o valor no input (Base + Extra salvo)
        el.value = valorBaseCalculado + extra;
        el.dataset.manualExtra = extra;

        // Quando você digita no campo
        el.oninput = () => {
            let totalDigitado = parseInt(el.value) || 0;
            let novaDiferenca = totalDigitado - valorBaseCalculado;
            
            // Salva a diferença no objeto global
            el.dataset.manualExtra = novaDiferenca;
            dados.status_combate[keyExtra] = novaDiferenca;
            
            // Salva o objeto inteiro no LocalStorage imediatamente
            localStorage.setItem('personagem_atual', JSON.stringify(dados));
        };
    };

    // 3. APLICAÇÃO DOS CÁLCULOS

    // PV e PI
    let pvBaseComp = (classe.pvIni + mC) + ((nivel - 1) * (classe.pvNv + mC)) + bonusPvTreino;
    configurarCampo('pv-max', pvBaseComp, 'pv_extra');
    configurarCampo('pi-max', pvBaseComp, 'pi_extra');

    // PE (Energia)
    if (!classe.isStamina) {
        let peBaseComp = (classe.peNv * nivel) + bonusPeTreino;
        if (classe.usaAtributo) {
            if (nomeClasse.includes('técnica')) peBaseComp += Math.max(mI, mS);
            else if (nomeClasse.includes('controlador') || nomeClasse.includes('suporte')) peBaseComp += Math.max(mP, mS);
        }
        configurarCampo('pe-max', peBaseComp, 'pe_extra');
    }

    // Estamina (Restringidos)
    if (nomeClasse.includes('restringido')) {
        configurarCampo('estamina-max', (nivel * 4), 'estamina_extra');
        if(document.getElementById('container-estamina')) document.getElementById('container-estamina').style.display = "block";
        const peC = document.getElementById('pe-max')?.closest('.hud-bar-group');
        if(peC) peC.style.display = "none";
    }

    // Preparo (Especialista)
    if (nomeClasse.includes('especialista em combate')) {
        configurarCampo('preparo-max', (nivel + mS), 'preparo_extra');
        if(document.getElementById('container-preparo')) document.getElementById('container-preparo').style.display = "block";
    }
}


    // BÔNUS DE TREINAMENTO
    let bT = Math.floor((nivel-1)/4)+2;
    if(document.getElementById('view-treino')) document.getElementById('view-treino').value = `+${bT}`;
    let grau = nivel>=19?"Grau Especial":(nivel>=14?"1º Grau":(nivel>=8?"2º Grau":(nivel>=5?"3º Grau":"4º Grau")));
    if(document.getElementById('view-grau')) document.getElementById('view-grau').innerText = grau;

    // CD
    const modChaveCD = Math.max(modsCalculados['int']||0,modsCalculados['sab']||0,modsCalculados['pre']||0);
    if(document.getElementById('view-cd')) document.getElementById('view-cd').value = 10+bT+modChaveCD;
        // --- Iniciativa ---
    const elIni = document.getElementById('view-iniciativa');
    if(elIni){
        const treinoIni = parseInt(document.getElementById('treino-iniciativa')?.value) || 0;
        let bonusAgilidadeIni = 0;
        if(etapasTreino("agilidade") >= 3) bonusAgilidadeIni = 2;
        const totalIni = (modsCalculados['des']||0) + treinoIni + bonusAgilidadeIni;
        elIni.value = totalIni >= 0 ? `+${totalIni}` : totalIni;
    }

    // --- Atenção ---
    const elAten = document.getElementById('view-atencao');
    if(elAten){
        const treinoPer = parseInt(document.getElementById('treino-percepcao')?.value) || 0;
        elAten.value = 10 + (modsCalculados['sab']||0) + treinoPer;
    }

    // --- Deslocamento ---
    const elDesloc = document.getElementById('view-desloc');
    if(elDesloc){
        let baseMetros = nomeClasse.includes('restringido') ? 12 : 9;
        const exVal = parseInt(document.getElementById('valor-exaustao')?.value) || 0;
        if(exVal >= 2) baseMetros = Math.floor(baseMetros/2);
        if(exVal >= 5) baseMetros = 0;

        const etapas = etapasTreino("agilidade");
        if(etapas >= 1) baseMetros += 1.5;
        if(etapas === 4) baseMetros += 4.5;

        elDesloc.value = `${baseMetros}m`;
    }

    // --- DEFESA ---
    const elDefesa = document.getElementById('view-defesa');
    if(elDefesa){
        const modDes = modsCalculados['des']||0;
        const metadeNivel = Math.floor(nivel/2);
        const bonusCA = parseInt(document.getElementById('view-ca')?.value) || 0;
        const defesaFinal = 10 + modDes + metadeNivel + bonusCA;
        elDefesa.value = defesaFinal;
        dados.status_manual = dados.status_manual || {};
        dados.status_manual.ca = bonusCA;
    }

// --- Perícias ---
for(let p in mapaPericias){
    const elT = document.getElementById(`treino-${p}`);
    const elTot = document.getElementById(`total-${p}`);

    if(elT){
        // --- Bônus Agilidade ---
        let bonusAgilidade = 0;
        const etapasAgi = etapasTreino("agilidade");
        if(p==="acrobacia" && etapasAgi>=2) bonusAgilidade = 2;
        if(p==="reflexos" && etapasAgi>=4) bonusAgilidade = 2;

        // --- Bônus Compreensão ---
        let bonusCompreensao = 0;
        const etapaComp = etapasTreino("compreensao");
        if((p === "feitiçaria" || p === "ocultismo") && etapaComp >= 2) bonusCompreensao += 1;
        if((p === "feitiçaria" || p === "ocultismo") && etapaComp >= 4) bonusCompreensao += 2;

        // --- Bônus Treino de Resistência ---
        let bonusResistencia = 0;
        const etapaResistencia = etapasTreino("resistencia");
        if(p === "fortitude" && etapaResistencia >= 3) bonusResistencia += 2;

        // --- Cálculo final ---
        const res =
            (modsCalculados[mapaPericias[p]] || 0) +
            (parseInt(elT.value) || 0) +
            bonusAgilidade +
            bonusCompreensao +
            bonusResistencia;

        if(elTot) elTot.innerText = res >= 0 ? `+${res}` : res;

        dados.niveis_pericias[p] = elT.value;
    }


    }

    // --- RDs (Resistência a Dano) ---
    dados.rds = {
        cor: document.getElementById('rd-cortante')?.value||0,
        per: document.getElementById('rd-perfurante')?.value||0,
        imp: document.getElementById('rd-impacto')?.value||0,
        acido: document.getElementById('rd-acido')?.value||0,
        conge: document.getElementById('rd-congelante')?.value||0,
        choco: document.getElementById('rd-chocante')?.value||0,
        quei: document.getElementById('rd-queimante')?.value||0,
        soni: document.getElementById('rd-sonico')?.value||0,
        alma: document.getElementById('rd-na-alma')?.value||0,
        reversa: document.getElementById('rd-en-reversa')?.value||0,
        energe: document.getElementById('rd-energetico')?.value||0,
        psiqui: document.getElementById('rd-psiquico')?.value||0,
        radia: document.getElementById('rd-radiante')?.value||0,
        necro: document.getElementById('rd-necrotico')?.value||0,
        veneno: document.getElementById('rd-venenoso')?.value||0
    };
        // --- Status de Combate ---
dados.status_combate = dados.status_combate || {};

dados.status_combate.pv_atual = document.getElementById('pv-atual')?.value || "";
dados.status_combate.pe_atual = document.getElementById('pe-atual')?.value || "";
dados.status_combate.pi_atual = document.getElementById('pi-atual')?.value || "";
dados.status_combate.preparo_atual = document.getElementById('preparo-atual')?.value || "0";
dados.status_combate.estamina_atual = document.getElementById('estamina-atual')?.value || "4";
dados.status_combate.exaustao = document.getElementById('valor-exaustao')?.value || "0";


    // --- Jogadas de Ataque Base ---
    dados.ataques_base = {
        corpo: {
            atr: document.getElementById('atr-corpo')?.value,
            outros: document.getElementById('outros-corpo')?.value,
            treinado: document.getElementById('check-corpo')?.checked
        },
        distancia: {
            atr: document.getElementById('atr-distancia')?.value,
            outros: document.getElementById('outros-distancia')?.value,
            treinado: document.getElementById('check-distancia')?.checked
        },
        amal: {
            atr: document.getElementById('atr-amal')?.value,
            outros: document.getElementById('outros-amal')?.value,
            treinado: document.getElementById('check-amal')?.checked
        }
    };

   // --- Finalização dos Dados ---
    dados.nivel = nivel;
    dados.bonus_ca = parseInt(document.getElementById('view-ca')?.value) || 0;

    // 🔥 1. PRIMEIRO: Chama a função que coloca "Gojo" ou "Kamo" na lista
    if (typeof verificarHabilidadesDeOrigem === 'function') {
        verificarHabilidadesDeOrigem();
    }

    // 🔥 2. DEPOIS: Salva a lista já atualizada dentro do objeto 'dados'
    dados.habilidades_lista = minhasHabilidades; 
    dados.tecnicas_lista = minhasTecnicas; // Use tecnicas_lista para bater com o seu onload
    dados.aptidoes_lista = minhasAptidoes;

    // 3. Salva os níveis das aptidões
    dados.niveis_aptidoes = {
        aura: document.getElementById("nivel-aura")?.value || 0,
        controle: document.getElementById("nivel-controle")?.value || 0,
        dominio: document.getElementById("nivel-dominio")?.value || 0,
        barreira: document.getElementById("nivel-barreira")?.value || 0,
        reversa: document.getElementById("nivel-reversa")?.value || 0
    };

// --- 4. PREPARAÇÃO DOS DADOS FINAIS ---
    dados.nivel = nivel;
    dados.bonus_ca = parseInt(document.getElementById('view-ca')?.value) || 0;
    dados.habilidades_lista = minhasHabilidades; 
    dados.tecnicas_lista = minhasTecnicas;
    dados.aptidoes_lista = minhasAptidoes;

    // Atualiza os valores máximos no objeto antes de salvar
    if (!dados.status_combate) dados.status_combate = {};
    dados.status_combate.pv_max = document.getElementById('pv-max')?.value || "0";
    dados.status_combate.pi_max = document.getElementById('pi-max')?.value || "0";
    dados.status_combate.pe_max = document.getElementById('pe-max')?.value || "0";
    dados.status_combate.estamina_max = document.getElementById('estamina-max')?.value || "0";
    dados.status_combate.preparo_max = document.getElementById('preparo-max')?.value || "0";

    // --- 5. SALVAMENTO INTELIGENTE (MULTI-PORTRAIT) ---
    const dadosString = JSON.stringify(dados);
    
    // Salva na chave padrão (uso geral)
    localStorage.setItem('personagem_atual', dadosString);

    // Salva na chave específica do ID (para o Multi-Portrait)
    // Se a ficha não tiver um ID, ela não vai funcionar bem com múltiplos portraits.
    if (dados.id) {
        localStorage.setItem(dados.id, dadosString);
        console.log(`Sincronizado no Canal ID: ${dados.id}`);
    } else {
        // Fallback caso você ainda não tenha gerado IDs únicos
        localStorage.setItem('personagem_1', dadosString);
    }

    // --- 6. SINCRONIZAÇÃO COM A LISTA GLOBAL (DASHBOARD) ---
    let listaGeral = JSON.parse(localStorage.getItem('fichas')) || [];
    const indexFicha = listaGeral.findIndex(f => f.id === dados.id);

    if (indexFicha !== -1) {
        listaGeral[indexFicha] = dados;
        localStorage.setItem('fichas', JSON.stringify(listaGeral));
    }

    // --- 7. ATUALIZAÇÃO VISUAL DA FICHA ---
    if (typeof renderizarListaFicha === 'function') renderizarListaFicha();
    if (typeof atualizarBarrasVisuais === 'function') atualizarBarrasVisuais();
    if (typeof calcularAtaques === 'function') calcularAtaques();
}




// --- 5. FUNÇÕES DE INTERFACE ---
function calcularAtaques() {
    const tipos = ['corpo', 'distancia', 'amal'];
    
    tipos.forEach(tipo => {
        const display = document.getElementById(`total-${tipo}`);
        if (!display) return;

        const elAtr = document.getElementById(`atr-${tipo}`);
        const siglaAtr = elAtr ? elAtr.value : "FOR";
        
        const elMod = document.getElementById(`mod-${siglaAtr.toLowerCase()}`);
        const modAtributo = elMod ? (parseInt(elMod.innerText.replace('+', '')) || 0) : 0;
        
        const nivel = parseInt(document.getElementById('view-nivel')?.value) || 1;
        const metadeNivel = Math.floor(nivel / 2);

        const treinado = document.getElementById(`check-${tipo}`)?.checked ? 2 : 0;
        const outros = parseInt(document.getElementById(`outros-${tipo}`)?.value) || 0;

        const total = modAtributo + metadeNivel + treinado + outros;
        display.innerText = (total >= 0 ? '+' : '') + total;
    });

    if (typeof renderizarMinhasTecnicas === 'function') {
    renderizarMinhasTecnicas();
}
}

window.rolarDanoDireto = function(nome, formula) {
    // 1. Calcula o valor (ex: "2d6+4" vira um número)
    const totalDano = calcularFormula(formula);
    
    // 2. Envia para o log
    // Passamos a fórmula no lugar do 'dado' para o log saber que é DANO
    exibirLog(nome, formula, 0, totalDano);
}

function calcularFormula(formula) {
    const regex = /(\d*)d(\d+)/gi;
    let total = 0;
    let detalhes = [];
    let critico = false;
    let falhaCritica = false;

    // Remove espaços para evitar erros no eval
    let formulaLimpa = formula.replace(/\s+/g, '');

    // Processa os dados (ex: 2d6)
    const formulaSemDados = formulaLimpa.replace(regex, (match, qtd, faces) => {
        qtd = parseInt(qtd) || 1;
        faces = parseInt(faces);

        for (let i = 0; i < qtd; i++) {
            const roll = Math.floor(Math.random() * faces) + 1;
            total += roll;
            detalhes.push(`d${faces}: ${roll}`);

            if (faces === 20) {
                if (roll === 20) critico = true;
                if (roll === 1) falhaCritica = true;
            }
        }
        return "0"; // Substitui o dado por 0 para o cálculo do bônus
    });

    // Calcula bônus fixo (ex: +2, -1) com segurança
    let bonus = 0;
    try {
        // O eval agora só vê números e operadores (ex: 0+0+2)
        bonus = eval(formulaSemDados) || 0;
    } catch (e) {
        console.error("Erro ao calcular bônus da fórmula:", e);
        bonus = 0;
    }
    
    total += bonus;

    // Retorna o objeto completo
    return { total, detalhes, critico, falhaCritica, bonus };
}

function exibirLog(titulo, dado, bonus, total) {
    // 🛡️ PROTEÇÃO ANTI-ERRO [object Object]
    // Se 'total' ou 'dado' vierem como objetos de biblioteca de dados, extraímos o número
    let totalReal = total;
    if (typeof total === 'object' && total !== null) {
        totalReal = total.total || total.resultado || total.value || 0;
    }

    let dadoReal = dado;
    if (typeof dado === 'object' && dado !== null) {
        dadoReal = dado.formula || dado.text || "---";
    }

    // 🔥 TOCA O SOM DOS DADOS
    if (typeof somDados !== 'undefined') {
        somDados.currentTime = 0; // Reinicia para permitir cliques rápidos
        somDados.play().catch(() => {
            // Silencia erro caso o usuário ainda não tenha clicado na página
        });
    }

    // 🏗️ GERENCIAMENTO DO CONTAINER DE LOGS
    let container = document.getElementById('log-master-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'log-master-container';
        Object.assign(container.style, {
            position: "fixed", bottom: "20px", right: "20px", zIndex: "999999", 
            display: "flex", flexDirection: "column-reverse", gap: "10px", pointerEvents: "none" 
        });
        document.body.appendChild(container);
    }

    // 🎨 CRIAÇÃO DO CARD DE LOG
    const log = document.createElement('div');
    log.style.pointerEvents = "auto";
    Object.assign(log.style, {
        minWidth: "280px", padding: "15px", background: "rgba(10, 10, 12, 0.98)",
        borderLeft: "5px solid #ff2f92", borderRadius: "4px", display: "flex",
        color: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.8)", fontFamily: "'Inter', sans-serif",
        opacity: "0", transform: "translateX(50px)", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    });

    // 🟢 CONFIGURAÇÃO DE CORES E TEXTOS
    let corTotal = "white"; 
    let textoSubtitulo = `Bônus: ${bonus >= 0 ? '+'+bonus : bonus}`;
    let labelDireita = "TOTAL";
    
    // Verifica se é Dano ou Cura para mudar a cor do número grandão
    const eDano = (typeof dadoReal === 'string' && dadoReal.includes('d'));

    if (eDano) {
        if (titulo.toLowerCase().includes("cura") || titulo.toLowerCase().includes("regeneração")) {
            corTotal = "#00ff88"; // Verde para Cura
            labelDireita = "CURA";
        } else {
            corTotal = "#ff2f92"; // Rosa para Dano
            labelDireita = "DANO";
        }
    }

    // 🎲 LÓGICA DE CRÍTICO E DESASTRE (Somente para d20/Testes)
    const valorNatural = totalReal - bonus;
    let corNumeroD20 = "white"; 

    if (!eDano) { 
        if (valorNatural >= 20) {
            corNumeroD20 = "#00ff88"; // Verde no dado
            corTotal = "#00ff88";     // Verde no total
        } else if (valorNatural <= 1) {
            corNumeroD20 = "#ff4d4d"; // Vermelho no dado
            corTotal = "#ff4d4d";     // Vermelho no total
        }
    }

    // 🖼️ CONTEÚDO DO ÍCONE (d20 + Número Central)
    const iconeConteudo = `
    <div style="position:relative; display:flex; align-items:center; justify-content:center; width:40px; height:40px;">
        <img src="img/d20.png" style="width:100%; height:100%; filter: drop-shadow(0 0 5px ${corNumeroD20}88)">
        <span style="position:absolute; font-size:0.85rem; font-weight:900; color:${corNumeroD20}; text-shadow: 1px 1px 2px black; pointer-events:none; z-index:2;">
            ${totalReal}
        </span>
    </div>`;

    // 📝 ESTRUTURA FINAL DO HTML
    log.innerHTML = `
        <div style="display:flex; align-items:center; width:100%">
            <div style="position:relative; display: flex; align-items: center; justify-content: center; width:40px;">
                ${iconeConteudo}
            </div>
            <div style="flex-grow:1; margin-left:15px">
                <span style="display:block; font-size:0.6rem; font-weight:900; color:#ff2f92; text-transform:uppercase; letter-spacing:1px;">${titulo}</span>
                <span style="font-size:0.75rem; color:#aaa; font-weight:600">${textoSubtitulo}</span>
            </div>
            <div style="text-align:right; border-left: 1px solid rgba(255,255,255,0.1); padding-left:15px">
                <span style="display:block; font-size:0.5rem; color:#666; font-weight:900">${labelDireita}</span>
                <span style="font-size:1.6rem; font-weight:900; color:${corTotal}; line-height:1; text-shadow: 0 0 10px ${corTotal}44">${totalReal}</span>
            </div>
        </div>
    `;

    container.appendChild(log);

    // ✨ ANIMAÇÃO DE ENTRADA E SAÍDA
    setTimeout(() => {
        log.style.opacity = "1";
        log.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
        log.style.opacity = "0";
        log.style.transform = "translateX(50px)";
        setTimeout(() => log.remove(), 500);
    }, 5000); 
// 🔥 SINCRONIZAÇÃO COM O PORTRAIT (OBS)
    const dadosLog = {
        titulo: titulo,
        total: totalReal,
        dado: dadoReal,
        bonus: bonus,
        cor: corTotal,
        timestamp: Date.now() // Garante que o Portrait perceba que é um novo clique
    };

    // Envia para o ID específico do personagem ou para o geral
    const logID = typeof dados !== 'undefined' && dados.id ? `log_${dados.id}` : 'log_geral';
    localStorage.setItem(logID, JSON.stringify(dadosLog));
}

function criarBotaoDano(nomeHabilidade, rotulo, formula) {
    return `
    <div class="bloco-dano">
        <span class="tipo-dano">${rotulo}</span>
        <span class="valor-dano"
              onclick="rolarDanoDireto('${nomeHabilidade} - ${rotulo}', '${formula}')">
            ${formula}
            <img src="img/d20.png">
        </span>
    </div>
    `;
}

function criarEscalaPorNivel(nomeHabilidade, dadosPorNivel) {
    let html = `<div class="escala-nivel-container">`;

    dadosPorNivel.forEach((info, index) => {
        html += `
        <div class="linha-nivel">
            <span class="nivel-label">NÍVEL ${index}</span>
            <span class="nivel-dano"
                  onclick="rolarDanoDireto('${nomeHabilidade} - Nível ${index}', '${info.dano}')">
                ${info.dano}
                <img src="img/d20.png">
            </span>
            <span class="nivel-extra">${info.extra}</span>
        </div>
        `;
    });

    html += `</div>`;
    return html;
}

function rolarDadosFlex() {
    const input = document.getElementById('input-dados-formula');
    const formula = input.value.trim();

    if (!formula) {
        alert("Digite uma fórmula de dados, ex: 3d6+2");
        return;
    }

    const total = calcularFormula(formula);
    exibirLog(`Rolagem ${formula}`, formula, 0, total);

    input.value = ""; // limpa o input após rolar
}

// ADICIONA ENTER PARA ROLAR
document.getElementById('input-dados-formula').addEventListener('keydown', function(e) {
    if (e.key === "Enter") {
        rolarDadosFlex();
    }
});

function setExaustao(nivel) {
    const input = document.getElementById('valor-exaustao');
    if (!input) return;

    let novoNivel = (parseInt(input.value) === nivel && nivel !== 0) ? 0 : nivel;
    input.value = novoNivel;

    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`ex-${i}`);
        if (box) {
            if (i <= novoNivel && novoNivel !== 0) {
                box.style.backgroundColor = "#ff2f92"; 
                box.style.boxShadow = "0 0 10px #ff2f92";
                box.style.color = "white";
            } else {
                box.style.backgroundColor = "transparent";
                box.style.boxShadow = "none";
                box.style.color = "#aaa";
            }
        }
    }

    const efeitos = [
        "Organismo operando normalmente.",
        "Exaustão 1 — O personagem recebe -1 em todas as suas rolagens, Defesa e Classe de Dificuldade. Esse negativo aumenta em -1 para cada nível de exaustão.",
        "Exaustão 2 — O personagem recebe a condição Desprevenido e o penalizador anterior aumenta para -2.",
        "Exaustão 3 — Perde 20 PV máximos ou 1/4 da vida máxima (o que for maior). Se chegar a 0 PV, desmaia. Recebe a condição Exposto e o penalizador aumenta para -3.",
        "Exaustão 4 — Recebe a condição Condenado e Desorientado. Se entrar em estado de morrendo, começa com duas falhas. Penalizador aumenta para -4.",
        "Exaustão 5 — Perde 50 PV máximos ou metade da vida máxima (o que for maior). Se chegar a 0 PV, desmaia. Recebe a condição Enjoado e penalizador aumenta para -5.",
        "Exaustão 6 — O personagem morre."
    ];
    
    const descEl = document.getElementById('desc-exaustao');
    if (descEl) descEl.innerText = efeitos[novoNivel];
    
    if (typeof atualizarTudo === 'function') atualizarTudo();
}
// --- 6. FUNÇÃO DE TROCA DE ABAS ---
function switchTab(event, tabId) {
    // 1. Esconde todos os conteúdos
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
        content.classList.add('hidden'); // Garante as duas formas de esconder
    });

    // 2. Desativa botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Ativa a aba alvo
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.remove('hidden');
        targetTab.classList.add('active');

        // Limpa e carrega talentos APENAS se for a aba certa
        const divDestino = document.getElementById('conteudo-dinamico-talentos');
        if (tabId === 'tab-talentos') {
    carregarTalentosAutomatico();
} else {
    const divDestino = document.getElementById('conteudo-dinamico-talentos');
    if (divDestino) divDestino.innerHTML = "";
}
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}
function abrirModalAtaque() {
    document.getElementById('modalAtaque').style.display = 'flex';
}

function fecharModalAtaque() {
    document.getElementById('modalAtaque').style.display = 'none';
}



// =============================
// SISTEMA DE ATAQUES CORRIGIDO
// =============================

// Fonte única de verdade
let meusAtaques = [];

// Controle de edição
let editandoCardId = null;

// Carrega ataques ao iniciar
function carregarAtaquesDoPersonagem() {

    let dados = JSON.parse(localStorage.getItem('personagem_atual')) || {};

    meusAtaques = dados.ataques_lista || [];

    renderizarLista();
}

// Salva dentro do personagem_atual
function salvarAtaque() {

    const nome = document.getElementById('atk-nome').value || "Novo Ataque";
    const dano = document.getElementById('atk-dano').value || "1d4";
    const crit = document.getElementById('atk-critico').value || "20";
    const mult = document.getElementById('atk-mult').value || "2";
    const bonus = document.getElementById('atk-bonus').value || "0";
    const tipo = document.getElementById('atk-tipo').value;

    const novoAtaque = {
        id: editandoCardId ? editandoCardId : Date.now(),
        nome,
        dano,
        crit,
        mult,
        bonus,
        tipo
    };

    let dados = JSON.parse(localStorage.getItem('personagem_atual')) || {};

    if (!dados.ataques_lista) dados.ataques_lista = [];

    if (editandoCardId) {
        dados.ataques_lista = dados.ataques_lista.map(a =>
            a.id == editandoCardId ? novoAtaque : a
        );
        editandoCardId = null;
    } else {
        dados.ataques_lista.push(novoAtaque);
    }

    localStorage.setItem('personagem_atual', JSON.stringify(dados));

    meusAtaques = dados.ataques_lista;

    renderizarLista();
    fecharModalAtaque();
atualizarTudo();
}


// Renderiza sempre a partir do array
function renderizarLista() {

    const container = document.getElementById('container-lista-ataques');
    if (!container) return;

    container.innerHTML = "";

    meusAtaques.forEach(atk => {

        const html = `
        <div class="ataque-card-premium" id="card-${atk.id}">
            <div class="atk-premium-header" onclick="toggleCard('${atk.id}')">
                <i class="fas fa-chevron-down atk-premium-icon"></i>
                <div class="atk-premium-info">
                    <h4>${atk.nome}</h4>
                    <span>DANO: <b>${atk.dano}</b> | CRÍTICO: <b>${atk.crit} / x${atk.mult}</b></span>
                </div>
                <div class="btn-roll-premium"
                    onclick="event.stopPropagation(); rolarDanoDireto('${atk.nome}', '${atk.dano}')">
                    <i class="fas fa-dice-d20"></i>
                </div>
            </div>

            <div class="atk-premium-body" id="body-${atk.id}" style="display:none; padding: 20px;">
                <div style="display:grid; grid-template-columns: repeat(4,1fr); gap:15px;">
                    <div><small>BÔNUS</small><div class="grid-info-val">+${atk.bonus}</div></div>
                    <div><small>TIPO</small><div class="grid-info-val">${atk.tipo}</div></div>
                    <div><small>CRÍTICO</small><div class="grid-info-val">${atk.crit}</div></div>
                    <div><small>MULT.</small><div class="grid-info-val">x${atk.mult}</div></div>
                </div>

                <div style="margin-top:10px; display:flex; justify-content:space-between; border-top:1px solid #333;">
                    <button onclick="removerAtaque('${atk.id}')" style="color:#ff4444; background:none; border:none; cursor:pointer; font-weight:bold; font-size:10px;">REMOVER</button>
                    <button onclick="prepararEdicao('${atk.id}', '${atk.nome}', '${atk.dano}', '${atk.crit}', '${atk.mult}', '${atk.bonus}', '${atk.tipo}')" style="color:#aaa; background:none; border:none; cursor:pointer; font-weight:bold; font-size:10px;">EDITAR</button>
                </div>
            </div>
        </div>`;

        container.insertAdjacentHTML('beforeend', html);
    });
}

function removerAtaque(id) {

    meusAtaques = meusAtaques.filter(atk => atk.id != id);

    const dados = JSON.parse(localStorage.getItem('personagem_atual')) || {};
    dados.ataques_lista = meusAtaques;

    localStorage.setItem('personagem_atual', JSON.stringify(dados));

    renderizarLista();
}



function prepararEdicao(id, nome, dano, crit, mult, bonus, tipo) {

    document.getElementById('modalAtaque').style.display = 'flex';

    document.getElementById('atk-nome').value = nome;
    document.getElementById('atk-dano').value = dano;
    document.getElementById('atk-critico').value = crit;
    document.getElementById('atk-mult').value = mult;
    document.getElementById('atk-bonus').value = bonus;
    document.getElementById('atk-tipo').value = tipo;

    editandoCardId = id;
    document.querySelector('.btn-add-v6').innerText = "SALVAR ALTERAÇÕES";
}


function toggleCard(id) {
    const body = document.getElementById(`body-${id}`);
    const icone = document.querySelector(`#card-${id} .atk-premium-icon`);
    const isHidden = window.getComputedStyle(body).display === "none";
    
    body.style.display = isHidden ? "grid" : "none";
    icone.style.transform = isHidden ? "rotate(180deg)" : "rotate(0deg)";
}


// 1. BANCO DE DADOS
const compendioHabilidades = [
    {
        nome: "Corpo Treinado",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Você treinou o seu corpo para que ele seja sua própria arma, assim como pode incorporar certas armas em sua luta corpo a corpo. Sendo um lutador, você recebe as seguintes capacidades: • Você sabe desferir golpes rápidos com o seu corpo. Quando realizar um ataque desarmado ou com uma arma marcial, você pode realizar um ataque desarmado como uma ação bônus. • Você treinou e se dedicou a fazer com que seu corpo fosse uma arma por si só. O dano dos seus ataques desarmados se torna 1d8. Nos níveis 5, 9, 13 e 17 seu dano desarmado aumenta para 1d10, 1d12, 2 d 8 e 2d12, respectivamente. • Versatilidade e adaptabilidade são importantes. Você pode escolher usar tanto Força quanto Destreza nos seus ataques desarmados e ataques com armas marciais.",
        requisito: ""
    },
{
    nome: "Ajuste",
    categoria: "Lutador",
    nivel: "2° NÍVEL",
    desc: "Às vezes um bom golpe só precisa de um ajuste. Uma vez por rodada, ao realizar um ataque, você pode adicionar seu dado de empolgação na rolagem de acerto e no dano. Você pode escolher adicionar o bônus antes ou depois de saber o resultado da rolagem de acerto.",
    requisito: ""
},
{
    nome: "Comando",
    categoria: "Lutador",
    nivel: "2° NÍVEL",
    desc: "Sua empolgação pode acabar contagiando seus aliados. Ao realizar um ataque, você comanda um aliado dentro de 1,5 metros a realizar um ataque corpo- a-corpo o acompanhando no mesmo alvo, como uma reação dele. Você ou aliado deve pagar 1 ponto de energia amaldiçoada para realizar o ataque. Caso use essa habilidade, você não pode utilizar ataque extra.",
    requisito: ""
},
{
    nome: "Desarme",
    categoria: "Lutador",
    nivel: "2° NÍVEL",
    desc: "Uma boa luta não deve ser contida pelo porte de uma arma. Ao acertar uma criatura com um ataque você aproveita para tentar a desarmar. Você adiciona seu dado de empolgação ao dano desse ataque e o alvo deve fazer uma jogada de ataque corpo a corpo contra o resultado do seu ataque. Em uma falha ele larga um item à sua escolha que esteja manejando.",
    requisito: ""
},
{
    nome: "Esquiva",
    categoria: "Lutador",
    nivel: "2° NÍVEL",
    desc: "Com o sangue fervendo, é mais fácil se esquivar de ataques. Ao ser acertado por um ataque corpo-a-corpo você pode usar sua reação para diminuir o dano em um valor igual a uma rolagem do seu dado de empolgação + modificador de destreza.",
    requisito: ""
},
{
    nome: "Trabalho de Pés",
    categoria: "Lutador",
    nivel: "2° NÍVEL",
    desc: "Você usa da sua empolgação para trabalhar o seu movimento. Como uma ação bônus, você pode escolher aumentar sua Defesa em um valor igual ao seu dado de empolgação, até o começo do seu próximo turno.",
    requisito: ""
},
    {
        nome: "Reflexo Evasivo",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Em busca de uma boa luta, e conseguir durar nela, você começa a desenvolver um reflexo para evitar danos. Você recebe redução de dano a todo tipo, exceto alma, igual a metade do seu nível de Lutador.",
        requisito: ""
    },
    {
        nome: "Aparar Ataque",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Quando for alvo de um ataque corpo a corpo, você pode gastar 1 PE e sua reação para realizar uma jogada de ataque contra o atacante. Caso seu teste supere o do inimigo, você evita o ataque.",
        requisito: ""
    },
    {
        nome: "Aparar Projéteis",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Quando receber um ataque à distância, você pode gastar 1 PE e sua reação para tentar aparar o projétil, reduzindo o dano recebido em 2d6 + modificador de atributo-chave + bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Ataque Inconsequente",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, ao realizar um ataque, você pode escolher receber vantagem na jogada de ataque e +5 na rolagem de dano. Porém, ao fazer isso, você fica Desprevenido por 1 rodada.",
        requisito: ""
    },
    {
        nome: "Caminho da Mão Vazia",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Seus ataques desarmados causam dano adicional igual ao seu bônus de treinamento e você soma metade do seu bônus de treinamento em jogadas de ataque desarmadas.",
        requisito: ""
    },
    {
        nome: "Complementação Marcial",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Enquanto estiver desarmado ou empunhando uma arma marcial, você recebe +2 em testes para Desarmar, Derrubar ou Empurrar, assim como para resistir a esses efeitos.",
        requisito: ""
    },
    {
        nome: "Deboche Desconcertante",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Como uma Ação Bônus, escolha uma criatura que possa te ver ou ouvir e realize um teste de Intimidação contra a Vontade dela, recebendo +2 no teste. Se suceder, ela recebe penalidade igual ao seu bônus de treinamento em todos os testes até o começo do seu próximo turno.",
        requisito: "Treinado em Intimidação"
    },
    {
        nome: "Dedicação em Arma",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Escolha três armas como Armas Dedicadas (não podem possuir Duas Mãos ou Pesada, exceto se já forem marciais). Elas passam a ser consideradas marciais e, enquanto empunhadas, o dano aumenta em 1 nível.",
        requisito: ""
    },
    {
        nome: "Esquiva Rápida",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Como Ação Bônus, faça um teste de Acrobacia contra a Atenção de um inimigo ao seu alcance corpo a corpo. Se suceder, ele recebe metade do seu modificador de Destreza como penalidade em jogadas de ataque contra você até o início do seu próximo turno.",
        requisito: ""
    },
    {
        nome: "Finta Melhorada",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Você pode usar Destreza ao invés de Presença em testes de Enganação para fintar. Além disso, acertar um inimigo desprevenido pela sua finta causa um dado de dano adicional.",
        requisito: ""
    },
    {
        nome: "Impacto Misto",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Quando acertar uma criatura com um ataque com arma marcial, você recebe +2 em jogadas de ataque e dano desarmados até o começo do seu próximo turno. O bônus escala conforme seu nível.",
        requisito: ""
    },
    {
        nome: "Kiai Intimidador",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, ao conseguir um crítico em ataque corpo a corpo, você pode realizar um teste de Intimidação contra a Vontade do alvo. Se suceder, ele fica Abalado por 1 rodada. Se já estiver Abalado, fica Amedrontado.",
        requisito: ""
    },
    {
        nome: "Mãos Amaldiçoadas",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Ao usar um Feitiço ofensivo com alcance de Toque, você pode substituir a jogada de ataque de técnica por uma jogada de ataque corpo a corpo e somar seu modificador de Força ou Destreza.",
        requisito: ""
    },
    {
        nome: "Puxar um Ar",
        categoria: "Lutador",
        nivel: "2° NÍVEL",
        desc: "Como Ação Bônus, role o dano do seu ataque desarmado e cure-se nesse valor. Pode ser usado um número de vezes igual ao seu bônus de treinamento por descanso curto ou longo.",
        requisito: ""
    },
    {
        nome: "Implemento Marcial",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Você recebe +2 na CD de suas Habilidades de Especialização, Feitiços e Aptidões Amaldiçoadas. Esse bônus aumenta em 1 nos níveis 8° e 16° de Lutador.",
        requisito: ""
    },
    {
        nome: "Ação Ágil",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Uma vez por rodada, você pode gastar 2 PE para receber uma Ação Ágil, que pode ser utilizada para Andar, Desengajar ou Esconder.",
        requisito: ""
    },
    {
        nome: "Acrobata",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Você passa a utilizar Destreza para calcular sua distância de pulo e pode usar Acrobacia no lugar de Atletismo em testes para aumentar sua distância de salto.",
        requisito: ""
    },
    {
        nome: "Atacar e Recuar",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Uma vez por turno, ao acertar uma criatura com um ataque, você pode gastar 1 PE para se mover até 4,5 metros para longe dela. Esse movimento não provoca ataques de oportunidade.",
        requisito: "Esquiva Rápida"
    },
    {
        nome: "Brutalidade",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Como Ação Livre, você pode gastar 2 PE para entrar em estado de Brutalidade, recebendo +2 em jogadas de ataque corpo a corpo e dano. Enquanto nesse estado, não pode manter concentração nem usar Feitiços ou Técnicas de Estilo. A Brutalidade termina se você não atacar no turno ou se encerrar como Ação Livre. Em níveis maiores, pode gastar PE adicionais para aumentar os bônus.",
        requisito: ""
    },
    {
        nome: "Defesa Marcial",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Enquanto estiver desarmado ou empunhando arma marcial, você soma 1 + metade do seu Bônus de Treinamento à sua Defesa.",
        requisito: "Complementação Marcial"
    },
    {
        nome: "Devolver Projéteis",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Aparar Projéteis passa a usar 3d10 e soma também seu nível de Lutador. Se o dano reduzido for nulo ou negativo, você pode devolver o projétil como parte da reação, causando ao atacante o dano que receberia.",
        requisito: "Aparar Projéteis"
    },
    {
        nome: "Fluxo",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "A cada nível de empolgação que você subir, recebe +1 em rolagens de dano. No começo de cada rodada, recebe 4 PV temporários para cada nível de empolgação acima do primeiro.",
        requisito: ""
    },
    {
        nome: "Fúria da Vingança",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Ao ver um aliado cair a 0 PV, durante 1 rodada você recebe: +4 de dano nos ataques, +2 na Defesa e +2 em TRs de Fortitude e Vontade contra o inimigo alvo da vingança.",
        requisito: ""
    },
    {
        nome: "Imprudência Motivadora",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Ao iniciar um combate, você pode escolher lutar com uma restrição autoimposta (como perder um sentido ou membro). Se vencer o combate assim, recupera PE igual ao seu nível, recebe +2 em jogadas de ataque e reduz sua margem de crítico em 1 até o fim da missão.",
        requisito: ""
    },
    {
        nome: "Músculos Desenvolvidos",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Você pode optar por somar seu Modificador de Força ao invés de Destreza em sua Defesa.",
        requisito: ""
    },
    {
        nome: "Redirecionar Força",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Quando um inimigo errar um ataque corpo a corpo contra você, pode gastar 2 PE e sua reação para redirecionar o ataque para outra criatura dentro do alcance, caso o resultado supere a Defesa do novo alvo.",
        requisito: ""
    },
    {
        nome: "Segura pra Mim",
        categoria: "Lutador",
        nivel: "4° NÍVEL",
        desc: "Quando for alvo de um ataque corpo a corpo ou habilidade de alvo único, pode gastar 3 PE para colocar uma criatura agarrada na frente. Faça um teste de Atletismo contra Atletismo ou Acrobacia dela. Se vencer, ela recebe o ataque no seu lugar.",
        requisito: ""
    },
{
    nome: "Aprimoramento Marcial",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Você aprimora suas habilidades marciais, tornando mais difícil resistir às suas técnicas de Lutador. Você passa a somar metade do seu Bônus de Treinamento à sua CD de Especialização.",
    requisito: ""
},
{
    nome: "Gosto pela Luta",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Você tem um gosto pelas lutas, o que começa a cultivar uma força, precisão e resistência superiores. Você passa a adicionar +2 em jogadas de ataque desarmadas ou com armas marciais e +1 em rolagens de Fortitude e de dano. Nos níveis 8, 12, 16 e 20 o bônus em jogadas de ataque aumenta em +1, enquanto nos níveis 9, 13 e 17 o bônus em Fortitude e dano aumenta em +1.",
    requisito: ""
},
{
    nome: "Ataque Extra",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Ao realizar a ação Atacar, você pode gastar 2 PE para atacar duas vezes em vez de uma.",
    requisito: ""
},
{
    nome: "Brutalidade Sanguinária",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Enquanto estiver no estado de Brutalidade, sempre que obtiver um acerto crítico ou reduzir a vida de uma criatura a 0 ou menos, você aumenta o nível de dano dos seus ataques corpo a corpo em 1. Esse bônus acumula até um limite igual ao seu bônus de treinamento e dura enquanto o estado de Brutalidade permanecer ativo.",
    requisito: "Brutalidade"
},
{
    nome: "Corpo Calejado",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Você adiciona metade do seu modificador de Constituição à sua Defesa e recebe pontos de vida adicionais iguais ao seu nível de Lutador.",
    requisito: ""
},
{
    nome: "Eliminar e Continuar",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Sempre que um inimigo ao qual você causou dano cair ou morrer a até 9 metros de você, recebe 2d6 + nível de personagem + modificador de atributo-chave em PV temporários, que se acumulam. No nível 8 aumenta para 3d6, no 12 para 4d6, no 16 para 4d8 e no 20 para 4d12.",
    requisito: ""
},
{
    nome: "Foguete sem Ré",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Como uma Ação Completa, você pode gastar 6 PE para se mover até o dobro do seu deslocamento. Criaturas pelas quais você passar devem realizar um teste de Reflexos. Em falha, sofrem Xd10 + modificador de Força ou Destreza de dano de Impacto (onde X é seu bônus de treinamento) e não podem realizar Ataques de Oportunidade contra você. Ao terminar adjacente a uma criatura, pode realizar um ataque contra ela.",
    requisito: ""
},
{
    nome: "Golpe da Mão Aberta",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Como uma Ação Comum, você pode gastar 4 PE para realizar um ataque desarmado. Em um acerto, o alvo deve realizar um teste de Fortitude. Em falha, fica Desorientado, Enjoado e Exposto até o início do seu próximo turno. Esse golpe conta como ataque desarmado, mas não pode ser usado com Ataque Extra.",
    requisito: ""
},
{
    nome: "Ignorar Dor",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Você recebe redução de dano contra todos os tipos, exceto Alma, igual ao seu nível de empolgação atual. Contra danos físicos, essa redução é dobrada.",
    requisito: ""
},
{
    nome: "Manobras Finalizadoras",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Você libera acesso a novas Manobras Finalizadoras. Ao realizar um ataque, pode executar uma Manobra Finalizadora conforme descrito na especialização.",
    requisito: ""
},
{
    nome: "Poder Corporal",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "O dano de seus ataques desarmados aumenta em 2 níveis. Uma vez por rodada, ao realizar um ataque desarmado, você pode realizar uma Manobra como parte do ataque, aplicando seu efeito junto ao dano.",
    requisito: "Caminho da Mão Vazia"
},
{
    nome: "Potência Superior",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Quando Derrubar um inimigo com sucesso, ele recebe 2d6 + seu modificador de Força de dano de Impacto. Quando Empurrar um inimigo, a distância passa a ser 4,5 metros em vez de 1,5 metros.",
    requisito: "Complementação Marcial"
},
{
    nome: "Sequência Inconsequente",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Quando utilizar Ataque Inconsequente, o dano adicional passa a ser aplicado a todos os ataques realizados durante o turno.",
    requisito: "Ataque Inconsequente"
},
{
    nome: "Um com a Arma",
    categoria: "Lutador",
    nivel: "6° NÍVEL",
    desc: "Um número de vezes por descanso curto igual à metade do seu nível de Lutador, suas armas dedicadas podem superar resistência ao tipo de dano em um ataque. Se errar o ataque, o uso não é consumido. Uma vez por rodada, ao ser desarmado de uma arma dedicada, pode usar sua reação para manter posse dela.",
    requisito: "Dedicação em Arma"
},
{
    nome: "Teste de Resistência Mestre",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Você se torna treinado em um segundo teste de resistência e mestre no concedido pela sua especialização.",
    requisito: ""
},
{
    nome: "Aptidões de Luta",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Ao obter esta habilidade, você pode aumentar em 1 o seu nível de aptidão em Aura ou em Controle e Leitura. Você pode selecionar esta habilidade duas vezes, uma para cada aptidão.",
    requisito: ""
},
{
    nome: "Ataques Ressoantes",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Ao realizar um ataque contra um inimigo, você pode gastar 2 pontos de energia amaldiçoada para que todos os inimigos adjacentes ao alvo, cuja Defesa seja inferior ao resultado do seu ataque, recebam dano igual à metade do dano causado no alvo.",
    requisito: ""
},
{
    nome: "Brutalidade Aprimorada",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Ao entrar no estado de Brutalidade, você recebe PV temporários iguais ao seu nível + modificador do atributo utilizado na CD de Especialização. O bônus inicial de dano da Brutalidade se torna +4, e o aumento de dano por ponto de energia adicional gasto passa a ser +2.",
    requisito: "Brutalidade"
},
{
    nome: "Feitiço e Punho",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Uma vez por rodada, quando utilizar um Feitiço de dano com alvo único, você pode gastar 2 PE para realizar um ataque corpo a corpo contra o mesmo alvo, desde que ele esteja dentro do seu alcance.",
    requisito: "Mãos Amaldiçoadas"
},
{
    nome: "Golpear Brecha",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Quando utilizar Aparar Ataque e obtiver sucesso, você pode gastar 2 PE adicionais para realizar um ataque contra o inimigo como parte da mesma reação.",
    requisito: "Aparar Ataque"
},
{
    nome: "Oportunista",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Uma vez por rodada, quando um inimigo dentro do seu alcance corpo a corpo for atingido por um ataque de uma criatura que o esteja flanqueando, você pode gastar 2 PE para realizar um ataque corpo a corpo contra esse inimigo.",
    requisito: ""
},
{
    nome: "Pancada Desnorteante",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Quando obtiver um acerto crítico em um ataque corpo a corpo, você pode fazer com que o alvo receba desvantagem em um teste de resistência à sua escolha até o início do seu próximo turno.",
    requisito: ""
},
{
    nome: "Punhos Letais",
    categoria: "Lutador",
    nivel: "8° NÍVEL",
    desc: "Enquanto estiver desarmado, sua margem de crítico é reduzida em 1 e seus ataques ignoram RD igual ao seu bônus de treinamento.",
    requisito: "Poder Corporal"
},
{
    nome: "Alma Quieta",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Você recebe vantagem para resistir às condições Condenado, Enfeitiçado e Fragilizado.",
    requisito: "Treinado em Vontade"
},
{
    nome: "Corpo Sincronizado",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Você recebe vantagem para resistir às condições Caído e Exposto.",
    requisito: "Treinado em Fortitude"
},
{
    nome: "Empolgar-se",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Um número de vezes por descanso longo igual ao seu Bônus de Treinamento, você pode subir dois níveis de Empolgação em vez de um no início de um turno em que ela aumentaria.",
    requisito: ""
},
{
    nome: "Impacto Demolidor",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Como uma Ação Comum, realize um ataque corpo a corpo contra um alvo ao seu alcance. Em caso de acerto, cause o dano normalmente e realize a ação Empurrar como parte do ataque. A distância empurrada é dobrada e o alvo quebra objetos ou obstáculos em seu caminho, sofrendo também Dano de Fontes Externas. Não é possível utilizar Ataque Extra nesta ação.",
    requisito: "Potência Superior"
},
{
    nome: "Insistência",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Uma vez por cena, quando seus PV seriam reduzidos a 0, você pode retornar ao nível de Empolgação 1 para permanecer de pé, curando-se em um valor igual a uma rolagem de dano do seu ataque desarmado. Após usar esta habilidade, até realizar um descanso longo, seu nível máximo de Empolgação é reduzido em 1.",
    requisito: "Ignorar Dor"
},
{
    nome: "Mente em Paz",
    categoria: "Lutador",
    nivel: "10° NÍVEL",
    desc: "Você recebe vantagem para resistir às condições Amedrontado, Atordoado e Confuso.",
    requisito: "Treinado em Astúcia"
},
{
    nome: "Armas Absolutas",
    categoria: "Lutador",
    nivel: "12° NÍVEL",
    desc: "Enquanto estiver empunhando uma Arma Dedicada, você pode gastar 2 PE para receber, por uma rodada, um dos seguintes bônus à sua escolha: +3 na Defesa ou +3 em Jogadas de Ataque. Além disso, uma vez por ataque, ao errar com uma arma dedicada, você pode rolar novamente o ataque, ficando com o melhor resultado. Para cada rodada após a primeira, é necessário gastar mais 2 PE para manter os bônus.",
    requisito: "Um com a Arma"
},
{
    nome: "Empolgação Máxima",
    categoria: "Lutador",
    nivel: "12° NÍVEL",
    desc: "O seu potencial e intensidade assumem um patamar superior, aprimorando suas capacidades. Os seus dados de empolgação se tornam 2d4, 2d6, 2d8 e 3d6, respectivamente.",
    requisito: "Um com a Arma"
},
{
    nome: "Corpo Arsenal",
    categoria: "Lutador",
    nivel: "12° NÍVEL",
    desc: "Quando obtiver um acerto crítico com um ataque desarmado, você pode optar por aplicar também o efeito de um grupo adicional entre Bastão, Haste ou Martelo.",
    requisito: "Punhos Letais"
},
{
    nome: "Seja Água",
    categoria: "Lutador",
    nivel: "12° NÍVEL",
    desc: "Seu deslocamento aumenta em 3 metros, você ignora terreno difícil causado por fontes físicas (como detritos ou solo destruído) e, uma vez por rodada, pode evitar ser agarrado sem a necessidade de realizar teste.",
    requisito: ""
},
{
    nome: "Tempestade Sufocante",
    categoria: "Lutador",
    nivel: "12° NÍVEL",
    desc: "Para cada ataque corpo a corpo desarmado ou com arma marcial que você acertar em um mesmo alvo no turno, ele recebe -1 na Defesa e em Testes de Resistência contra você, acumulando até um máximo igual ao seu bônus de treinamento. O efeito dura até o início do próximo turno da criatura afetada.",
    requisito: ""
},
{
    nome: "Corpo Supremo",
    categoria: "Lutador",
    nivel: "16° NÍVEL",
    desc: "Você alcançou um alto nível como lutador e levou seu corpo ao limite. Você recebe mais 3 metros de movimento adicionais, +4 na sua Defesa e redução de dano igual a metade do seu nível de personagem contra dano cortante, perfurante e de impacto, além de mais um tipo à sua escolha, exceto alma. Contra os outros tipos de dano não escolhidos, a redução de dano é igual a 1/4 do seu nível.",
    requisito: ""
},
{
    nome: "Duro na Queda",
    categoria: "Lutador",
    nivel: "16° NÍVEL",
    desc: "Quando estiver nas portas da morte, você pode escolher receber uma falha garantida para fazer um teste de Vontade contra a CD X, sendo X igual a 15 + 1 para cada 3 pontos de vida negativos. Se passar, você levanta com 1 de vida e recebe 1 ponto de exaustão.",
    requisito: "Treinado em Vontade"
},
{
    nome: "Lutador Superior",
    categoria: "Lutador",
    nivel: "16° NÍVEL",
    desc: "Tendo alcançado o ápice do seu corpo e das técnicas de combate do lutador, você está em um nível superior. Seus ataques desarmados causam 1 dado de dano adicional e uma vez por rodada, você pode realizar um ataque desarmado como uma ação livre gastando 2PE. Além disso, você inicia todo combate com um Nível de Empolgação a mais.",
    requisito: "Nível 20"
},
// ---------------ESPECIALISTA EM COMBATE ----------------//
{
    nome: "Repertório do Especialista",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Como um Especialista em Combate, você pode escolher um estilo principal para seguir em sua especialização. No primeiro nível, você recebe um dos estilos de combate. Você recebe um novo estilo de combate no nível 6 e outro no 12, complementando suas capacidades dentro de combate.",
    requisito: ""
},
  {
    nome: "Estilo Defensivo",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Foca em aprimorar a sua defesa. Defesa +2 no 1° nível, e aumenta +1 nos níveis 4, 8, 12 e 16.",
    incrementos: {
      "4": "+1 na Defesa",
      "8": "+1 na Defesa",
      "12": "+1 na Defesa",
      "16": "+1 na Defesa"
    },
    requisito: ""
  },
  {
    nome: "Estilo do Arremessador",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Você se versa em armas de arremesso. Pode sacar uma arma de arremesso como parte do ataque, além de receber +2 em rolagens de dano. Bônus de dano aumenta +1 nos níveis 4, 8, 12 e 16.",
    incrementos: {
      "4": "+1 em dano com armas de arremesso",
      "8": "+1 em dano com armas de arremesso",
      "12": "+1 em dano com armas de arremesso",
      "16": "+1 em dano com armas de arremesso"
    },
    requisito: ""
  },
  {
    nome: "Estilo do Duelista",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Foca em duelar com uma única arma. Usando uma arma em uma mão e a outra livre, recebe +1 em acerto e +2 em dano. Dano aumenta +1 nos níveis 4, 8, 12 e 16. Acerto aumenta +1 nos níveis 8 e 16.",
    incrementos: {
      "4": "+1 em dano",
      "8": "+1 em dano, +1 em acerto",
      "12": "+1 em dano",
      "16": "+1 em dano, +1 em acerto"
    },
    requisito: ""
  },
  {
    nome: "Estilo do Interceptador",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Você intercepta ataques de aliados. Quando um aliado dentro do alcance recebe ataque, você pode usar reação para reduzir dano em 1d10 + mod. de Força/Destreza/Sabedoria. Aumenta +1d10 nos níveis 4, 8, 12 e 16.",
    incrementos: {
      "4": "+1d10 no dano reduzido",
      "8": "+1d10 no dano reduzido",
      "12": "+1d10 no dano reduzido",
      "16": "+1d10 no dano reduzido"
    },
    requisito: ""
  },
  {
    nome: "Estilo do Protetor",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Protege aliados. Quando uma criatura ataca um alvo dentro de 1,5m, você pode usar reação para impor desvantagem. Pode conceder vantagem em Teste de Resistência de aliado dentro de 1,5m.",
    incrementos: {},
    requisito: ""
  },
  {
    nome: "Estilo Distante",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Especialista em ataques à distância. Recebe +1 em acerto e +2 em dano com armas à distância. Dano aumenta +1 nos níveis 4, 8, 12 e 16; acerto aumenta +1 nos níveis 8 e 16.",
    "incrementos": {
      "4": "+1 em dano",
      "8": "+1 em dano, +1 em acerto",
      "12": "+1 em dano",
      "16": "+1 em dano, +1 em acerto"
    },
    requisito: ""
  },
  {
    nome: "Estilo Duplo",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Manejo de duas armas. Pode adicionar bônus de atributo ao dano da segunda arma, além de +1 em dano, aumentando +1 nos níveis 4, 8, 12 e 16.",
    incrementos: {
      "4": "+1 em dano",
      "8": "+1 em dano",
      "12": "+1 em dano",
      "16": "+1 em dano"
    },
    requisito: ""
  },
  {
    nome: "Estilo Massivo",
    categoria: "Especialista em Combate",
    nivel: "1° NÍVEL",
    desc: "Domina armas pesadas. Quando rolar 1 ou 2 no dano com arma em duas mãos ou pesada, pode rolar novamente. Recebe +1 em dano, aumentando +1 nos níveis 4, 8, 12 e 16.",
    incrementos: {
      "4": "+1 em dano",
      "8": "+1 em dano",
      "12": "+1 em dano",
      "16": "+1 em dano"
    },
    requisito:""
  },
{
    nome: "Arremessos Potentes",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Seus ataques com armas de arremesso contam como um nível de dano acima. Além disso, no começo do seu turno, você pode gastar 1 PE para fazer com que seus ataques com armas de arremesso ignorem RD igual ao seu bônus de treinamento.",
    requisito: ""
},

{
    nome: "Arsenal Cíclico",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Uma vez por rodada, você pode sacar ou trocar um item com uma ação livre. Ao realizar um golpe com um grupo de armas e trocar para outra arma de outro grupo na mesma rodada ou na próxima, você recebe +1d até o fim do seu próximo turno com a arma trocada.",
    requisito: ""
},
{
    nome: "Assumir Postura",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Ao obter esta habilidade, você recebe acesso às Posturas, explicadas e listadas no final da especialização.",
    requisito: ""
},
{
    nome: "Disparos Sincronizados",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Se estiver manejando duas armas à distância ou de fogo, você pode usar suas ações de ataque juntas para sincronizar os tiros. Realize os dois ataques e, caso ambos acertem, combine o dano em uma única instância, aplicando efeitos de ambas as armas e resistências ou fraquezas apenas uma vez.",
    requisito: ""
},
{
    nome: "Escudeiro Agressivo",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Uma vez por rodada, ao realizar uma ação de ataque enquanto empunha um escudo, você pode gastar 1 ponto de energia amaldiçoada para fazer um ataque adicional com o escudo.",
    requisito: ""
},
{
    nome: "Extensão do Corpo",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Seu alcance em ataques com armas corpo a corpo aumenta em 1,5 metros e você recebe +2 em jogadas de ataque e em testes para evitar ser desarmado.",
    requisito: ""
},
{
    nome: "Flanqueador Superior",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Enquanto estiver flanqueando uma criatura, ela recebe -2 em testes de resistência.",
    requisito: ""
},
{
    nome: "Golpe Falso",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Como reação a um aliado atacando um inimigo dentro do seu alcance de ataque, o inimigo deve realizar um TR de Astúcia e, caso falhe, seu aliado recebe vantagem no teste de ataque.",
    requisito: ""
},
{
    nome: "Golpes Potentes",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Sempre que você estiver usando uma arma com a qual seja treinado, o dano dela aumenta em um nível e suas rolagens de dano recebem +2.",
    requisito: ""
},
{
    nome: "Indomável",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Uma quantidade de vezes por descanso curto ou longo igual à metade do seu nível de personagem, você pode gastar 1 ponto de energia amaldiçoada para rolar novamente um teste de resistência que tenha falhado, ficando com o melhor resultado.",
    requisito: ""
},
{
    nome: "Pistoleiro Iniciado",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Antes de realizar um ataque com uma arma de fogo, você pode aumentar a margem de Emperrar em 2. Em troca, caso acerte, você causa 1 dado de dano adicional.",
    requisito: ""
},
{
    nome: "Posicionamento Ameaçador",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "A menos que esteja furtivo, você pode conceder os benefícios de Flanco para aliados, mesmo utilizando armas à distância ou de fogo, desde que o alvo esteja dentro do primeiro alcance da sua arma.",
    requisito: ""
},
{
    nome: "Precisão Definitiva",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Quando faz um ataque, você pode gastar 1 ponto de energia amaldiçoada para receber +2 na rolagem para acertar. A cada quatro níveis, pode gastar 1 ponto adicional para aumentar o bônus em +2. Você pode optar por aplicar o bônus na rolagem de dano ao invés da de acerto, recebendo +4 ao invés de +2.",
    requisito: ""
},
{
    nome: "Presença Suprimida",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Você recebe +2 em rolagens de Furtividade. Sua penalidade em furtividade por atacar ou realizar ações chamativas é reduzida para -5.",
    requisito: ""
},
{
    nome: "Revigorar",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Um número de vezes igual ao seu bônus de treinamento, você pode usar sua ação bônus para se curar em 1d10 + o dobro do seu modificador de Constituição + bônus de treinamento, aumentando em 1 dado a cada 4 níveis. Recupera todos os usos em descanso longo ou metade em descanso curto.",
    requisito: ""
},
{
    nome: "Tiro Falso",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Como reação a um aliado atacando um inimigo dentro do seu alcance, caso esteja manejando arma à distância ou de fogo, o inimigo deve realizar um TR de Astúcia e, caso falhe, seu aliado recebe vantagem no teste de ataque.",
    requisito: ""
},
{
    nome: "Zona de Risco",
    categoria: "Especialista em Combate",
    nivel: "2° NÍVEL",
    desc: "Uma vez por rodada, se estiver empunhando uma arma corpo a corpo com a propriedade Estendida e um inimigo entrar no seu alcance, você pode gastar 2 pontos de energia amaldiçoada para realizar um ataque contra ele.",
    requisito: ""
},
{
    nome: "Golpe Especial",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Quando realizar um ataque, ou arte do combate que envolva um ataque, você pode o montar como um ataque especial, escolhendo entre as opções abaixo: • Amplo. O ataque atinge uma criatura a mais. +2PE • Atroz. Em um acerto, o ataque causa 1 dado de dano adicional. +1PE • Impactante. Empurra o alvo em 1,5 metros para cada 15 pontos de dano causados. Fortitude reduz à metade. +1PE • Letal. Diminui em 1 a margem de crítico do ataque. +2PE • Longo. Aumenta o alcance da arma em 1,5 metros para corpo-a-corpo ou 9 metros para ataques a distância. +1PE • Penetrante. Ignora redução a dano em um valor igual a metade do seu nível de personagem. +2PE • Preciso. Recebe vantagem no ataque. Após o primeiro uso na rodada, o custo aumenta para 2PE. +1PE/+2PE • Sanguinário. Uma criatura atingida sofre sangramento leve (CD de Especialização). Pode ser pego uma segunda vez para causar sangramento médio ao invés de leve. +2PE • Lento. O ataque deve ser usado como ação completa. -2PE • Sacrifício. Recebe 15 de dano ao efetuar o ataque. -1PE • Desfocado. O ataque recebe uma penalidade de 4 no acerto (cumulativo até três vezes). -1PE",
    requisito: ""
},
{
    nome: "Implemento Marcial",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você recebe +2 na CD de suas Habilidades de Especialização, Feitiços e Aptidões Amaldiçoadas. Esse bônus aumenta em 1 nos níveis 8° e 16° de Especialista em Combate",
    requisito: ""
},
{
    nome: "Aprender Postura",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você aprende uma postura adicional à sua escolha. No 10° nível você aprende outra postura.",
    requisito: "Assumir Postura"
},
{
    nome: "Armas Escolhidas",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Escolha um grupo de armas. Seus ataques com armas desse grupo têm o nível de dano aumentado em 3.",
    requisito: ""
},
{
    nome: "Arremesso Rápido",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Uma vez por rodada, ao realizar um ataque com uma arma de arremesso, você pode gastar 1 PE para realizar um ataque com arma de arremesso contra outro alvo. Você deve arremessar outra arma ou a mesma arma, desde que ela possua a propriedade Retorno.",
    requisito: ""
},
{
    nome: "Técnicas de Avanço",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você aprende duas artes de combate de avanço, listadas no final da especialização.",
    requisito: ""
},
{
    nome: "Buscar Oportunidade",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Como Ação Livre, realize um teste de Percepção com CD 16 +2 para cada inimigo em campo. Caso tenha sucesso, você pode utilizar Andar, Desengajar ou Esconder como Ação Livre.",
    requisito: ""
},
{
    nome: "Compensar Erro",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Uma vez por rodada, ao errar um ataque corpo a corpo, você pode gastar até uma quantidade de PE igual ao seu bônus de treinamento para causar dano no alvo. Para cada ponto gasto, o alvo recebe 1d10 de dano Energético, somando seu modificador de Força, Destreza ou Sabedoria ao total.",
    requisito: ""
},
{
    nome: "Especialista em Escudo",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você soma o aumento base de RD do seu escudo em testes de resistência de Reflexos e Fortitude.",
    requisito: ""
},
{
    nome: "Espírito de Luta",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Como Ação Livre, você pode gastar 1 PE para receber +2 em jogadas de ataque até o fim da cena. Ao utilizar esta habilidade, você também ganha PV temporários iguais ao seu nível de personagem.",
    requisito: ""
},
{
    nome: "Grupo Favorito",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Escolha um grupo de armas. Você recebe acesso ao efeito de crítico do grupo enquanto estiver manejando uma arma pertencente a ele.",
    requisito: ""
},
{
    nome: "Guarda Estudada",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você soma metade do seu modificador de Sabedoria na sua Defesa, limitado pelo seu nível. Além disso, escolha um Teste de Resistência para receber +2.",
    requisito: ""
},
{
    nome: "Mente Oculta",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você passa a adicionar seu bônus de Sabedoria em rolagens de Furtividade.",
    requisito: ""
},
{
    nome: "Preparo Imediato",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Durante uma rolagem de iniciativa, você pode gastar 3 pontos de preparo para utilizar Preparar apenas para uma ação bônus. A partir do 10° nível, pode gastar 7 pontos de preparo para preparar uma ação comum.",
    requisito: ""
},
{
    nome: "Recarga Rápida",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "O custo em ações para recarregar armas à distância que você empunhar diminui em um nível: ação comum se torna ação bônus e ação bônus se torna ação livre.",
    requisito: ""
},
{
    nome: "Uso Rápido",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Ao utilizar uma ação para usar um item, você pode pagar 1 ponto de energia para usar um item adicional.",
    requisito: ""
},
{
    nome: "Renovação pelo Sangue",
    categoria: "Especialista em Combate",
    nivel: "6° NÍVEL",
    desc: "Com tamanha precisão e letalidade, você passa a ser capaz de renovar seu próprio estoque de energia a partir do sangue. Ao acertar um ataque crítico em um inimigo ou reduzir seus pontos de vida a 0, você recupera um ponto de energia amaldiçoada.",
    requisito: ""
},
{
    nome: "Teste de Resistência Mestre",
    categoria: "Especialista em Combate",
    nivel: "4° NÍVEL",
    desc: "Você se torna treinado em um segundo teste de resistência e mestre no concedido pela sua especialização.",
    requisito: ""
},
{
    nome: "Aptidões de Combate",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Você pode aumentar seu nível de aptidão em Aura ou Controle e Leitura em 1. Você pode escolher esta habilidade duas vezes, uma para cada aptidão.",
    requisito: ""
},
{
    nome: "Técnicas da Força",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Você aprende duas artes de combate da força, listadas no final da especialização.",
    requisito: ""
},
{
    nome: "Destruição Dupla",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Enquanto estiver lutando com duas armas de grupos diferentes, o ataque com a segunda arma causa 1 dado de dano adicional. Caso consiga um acerto crítico, você pode gastar 1 PE para aplicar simultaneamente o Efeito Crítico do grupo das duas armas, caso pertençam a grupos diferentes.",
    requisito: ""
},
{
    nome: "Espírito Incansável",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Ao utilizar Espírito de Luta, você pode gastar 2 PE ao invés de 1, aumentando o bônus em ataques para +5 e fazendo com que os PV temporários ganhos sejam iguais ao seu bônus de ataque (já considerando o bônus da habilidade), ao invés do seu nível de personagem.",
    requisito: "Espírito de Luta"
},
{
    nome: "Pistoleiro Avançado",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Você pode aumentar o Emperrar em até 6 ao invés de 2, causando 1 dado de dano adicional para cada +2 de Emperrar. Além disso, se uma criatura dentro do primeiro alcance da sua arma de fogo tentar se mover, você pode gastar sua Reação para realizar um ataque contra ela; se acertar, ela sofre dano e perde 4,5 metros de movimento até o fim do turno.",
    requisito: "Pistoleiro Iniciado"
},
{
    nome: "Ricochete Constante",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Ao ativar Arremessos Potentes, você pode pagar 5 PE ao invés de 1 para que, até o fim do turno, seus ataques com armas de arremesso possam atingir uma criatura adicional à sua escolha dentro de 4,5 metros do alvo original, caso sua jogada de ataque também supere a Defesa dela.",
    requisito: "Arremessos Potentes"
},
{
    nome: "Sombra Viva",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Uma vez por rodada, você pode utilizar Esgueirar e se mover todo o seu deslocamento ao invés de apenas metade. Além disso, uma vez por rodada, se fosse ser encontrado por uma criatura, pode usar sua Reação para realizar novo teste de Furtividade e permanecer escondido caso supere a Percepção do inimigo.",
    requisito: "Treinado em Furtividade"
},
{
    nome: "Surto de Ação",
    categoria: "Especialista em Combate",
    nivel: "8° NÍVEL",
    desc: "Um número de vezes igual à metade do seu bônus de treinamento por descanso longo, você pode, uma vez por rodada, gastar 5 pontos de energia amaldiçoada para realizar uma ação comum adicional no seu turno.",
    requisito: ""
},
{
    nome: "Análise Acelerada",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Utilizar a ação de Análise se torna uma ação bônus.",
    requisito: ""
},
{
    nome: "Armas Perfeitas",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Seus ataques com uma arma do grupo escolhido em Armas Escolhidas ignoram 10 de RD do tipo de dano dela.",
    requisito: "Armas Escolhidas"
},
{
    nome: "Assassinar",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Durante a primeira rodada de combate, ao atacar uma criatura desprevenida a partir de furtividade ou surpresa, seu primeiro ataque é um crítico garantido.",
    requisito: "Mestre em Furtividade"
},
{
    nome: "Ataque Concentrado",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Ao utilizar a ação Atacar, você pode gastar PE equivalentes à metade do custo de Ataque Extra e/ou Surto de Ação, até o limite de usos possíveis no turno. Para cada vez que fizer isso, adiciona metade dos dados de dano de um ataque (mínimo 1 dado) ao dano do próximo ataque. Ao usar esta habilidade, considera-se que Ataque Extra e/ou Surto de Ação foram utilizados no turno.",
    requisito: "Ataque Extra"
},
{
    nome: "Chuva de Arremessos",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Como ação completa, você pode realizar uma quantidade de ataques com armas de arremesso igual ao seu bônus de treinamento. Para cada ataque após o primeiro, você gasta 1 ponto de energia amaldiçoada. Você só pode continuar atacando enquanto possuir armas de arremesso disponíveis.",
    requisito: "Arremessos Potentes e Arremesso Rápido"
},
{
    nome: "Potência Antes de Cair",
    categoria: "Especialista em Combate",
    nivel: "10° NÍVEL",
    desc: "Se você for cair a 0 PV, pode imediatamente realizar um turno, interrompendo o turno atual. Durante esse turno, qualquer dano sofrido conta como falha em teste de morte. Ao final do turno, você fica inconsciente e recebe 1 nível de exaustão. Pode ser usada uma vez por descanso longo.",
    requisito: ""
},
{
    nome: "Técnicas de Saque",
    categoria: "Especialista em Combate",
    nivel: "12° NÍVEL",
    desc: "Você aprende duas artes de combate de saque, listadas no final da especialização.",
    requisito: ""
},
{
    nome: "Ciclagem Absoluta",
    categoria: "Especialista em Combate",
    nivel: "12° NÍVEL",
    desc: "Durante o seu turno, você pode trocar a arma que esteja manejando toda vez que atacar. Além disso, sempre que trocar para uma arma de outro grupo durante seu turno, recebe +2 na próxima jogada de ataque que realizar.",
    requisito: "Arsenal Cíclico"
},
{
    nome: "Manejo Único",
    categoria: "Especialista em Combate",
    nivel: "12° NÍVEL",
    desc: "Você escolhe mais uma propriedade para ser aplicada a toda arma que estiver manejando. No começo de uma cena de combate, pode pagar 2 pontos de energia para receber uma propriedade única pelo resto da cena, podendo ser criada pelo jogador ou uma já existente.",
    requisito: "Manejo Especial"
},
{
    nome: "Mestre Pistoleiro",
    categoria: "Especialista em Combate",
    nivel: "12° NÍVEL",
    desc: "Fazer uma arma emperrada voltar a funcionar se torna uma ação de movimento e sua margem de crítico com armas de fogo aumenta em 1.",
    requisito: "Pistoleiro Avançado"
},
{
    nome: "Sincronia Perfeita",
    categoria: "Especialista em Combate",
    nivel: "12° NÍVEL",
    desc: "O alcance adicional concedido por Extensão do Corpo aumenta para 3 metros e você recebe vantagem em testes para evitar ser desarmado.",
    requisito: "Extensão do Corpo"
},
{
    nome: "Crítico Aperfeiçoado",
    categoria: "Especialista em Combate",
    nivel: "16° NÍVEL",
    desc: "A margem do seu acerto crítico é reduzida em 2 ao invés de 1.",
    requisito: "Crítico Melhorado"
},
{
    nome: "Mestre da Postura",
    categoria: "Especialista em Combate",
    nivel: "16° NÍVEL",
    desc: "Ao entrar em Postura, você pode assumir duas Posturas ao mesmo tempo, recebendo os benefícios de ambas.",
    requisito: "Assumir Postura"
},
{
    nome: "Autossuficiente",
    categoria: "Especialista em Combate",
    nivel: "16° NÍVEL",
    desc: "Tornando-se um mestre das técnicas armadas, você consegue ser autossuficiente na energia para usar seu golpe especial. Sempre que realizar um Golpe Especial, recebe 3 PE temporários para serem usados no ataque. Uma vez por cena, você pode escolher transformar esse valor em 6. Além disso, todos seus ataques causam um dado de dano adicional, do mesmo tipo da arma manuseada.",
    requisito: ""
},
//--------------------------ESPECIALISTA EM TÉCNICA-----------------------//
{
    nome: "Domínio dos Fundamentos.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Como um especialista em técnicas, você tem uma maior dominância sobre os fundamentos da energia amaldiçoada e das suas habilidades. Você aprende duas das Mudanças de Fundamento abaixo no primeiro nível e uma adicional no nível 12.",
    requisito: ""
},
{
    nome: "Feitiço Cruel.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando usar um Feitiço que força um Teste de Resistência, você pode gastar 1 ponto de energia amaldiçoada para aumentar a CD do teste em +2 ou 2 pontos para aumentar em +4.",
    requisito: ""
},
{
    nome: "Feitiço Distante.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando usar um Feitiço à distância, você pode gastar 2 pontos de energia amaldiçoada para dobrar seu alcance. Caso seja um Feitiço corpo-a-corpo, você pode gastar 2 pontos de energia amaldiçoada para conceder alcance de 9 metros.",
    requisito: ""
},
{
    nome: "Feitiço Duplicado.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Uma vez por rodada, quando usar um Feitiço de dano cujo alvo seja apenas uma criatura, você pode gastar pontos de energia amaldiçoada para conceder um segundo alvo à habilidade. O custo é igual ao dobro do nível do Feitiço (considere 1 para Feitiços de nível 0).",
    requisito: ""
},
{
    nome: "Feitiço Expansivo.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando usar um Feitiço em área, você pode gastar 3 pontos de energia amaldiçoada para aumentar a área em um valor igual à metade da área padrão (1,5x do total).",
    requisito: ""
},
{
    nome: "Feitiço Potente.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando usar um Feitiço de dano, você pode gastar 2 pontos de energia amaldiçoada e rolar novamente uma quantidade de dados de dano igual ao seu modificador de Inteligência ou Sabedoria, utilizando os melhores resultados.",
    requisito: ""
},
{
    nome: "Feitiço Preciso.",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando usar um Feitiço que utilize um teste de ataque, você pode gastar 1 ponto de energia amaldiçoada para receber +2 de acerto ou 2 pontos para receber +4 de acerto.",
    requisito: ""
},
{
    nome: "Feitiço Rápido.",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Uma vez por rodada, quando utilizar um Feitiço cuja conjuração seja uma Ação Completa ou Comum, você pode gastar PE para reduzir seu custo de ação em um passo (Completa para Comum ou Comum para Bônus). O custo é igual ao dobro do nível do Feitiço (considere 1 para Feitiços de nível 0).",
    requisito: "Nível 6"
},
{
    nome: "Abastecido pelo Sangue",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Quando um inimigo morre a até 12m de você, pode usar sua reação para recuperar energia amaldiçoada igual ao seu modificador de Inteligência ou Sabedoria. 1x por descanso longo (2x no nível 8, 3x no nível 16).",
    requisito: ""
},
{
    nome: "Conhecimento Aplicado",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao realizar um teste de resistência contra um Feitiço, pode gastar PE igual à metade do bônus de treinamento. Para cada ponto gasto, recebe +2 no teste.",
    requisito: ""
},
{
    nome: "Conjuração Defensiva",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao usar um Feitiço, pode gastar 2 PE para receber, até o início do próximo turno, bônus em Defesa e RD igual ao nível do Feitiço.",
    requisito: ""
},
{
    nome: "Economia de Energia",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Após descanso curto ganha 1d4 de reserva; após descanso longo 1d6 (aumenta 1 dado a cada 5 níveis). Como ação comum, pode adicionar a reserva à sua energia atual. Não acumula.",
    requisito: ""
},
{
    nome: "Explosão Encadeada",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao rolar dano máximo em um dado de dano de um Feitiço, rola mais um dado do mesmo tipo e adiciona ao total. Só ativa uma vez por dado.",
    requisito: ""
},
{
    nome: "Finta Amaldiçoada",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Pode usar seu atributo-chave ao invés de Presença para Fintar. O alvo Desprevenido aplica-se ao seu próximo Feitiço.",
    requisito: ""
},
{
    nome: "Mente Plácida",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao testar concentração, pode gastar 1 PE para +3 ou 2 PE para +5. A CD é reduzida em valor igual ao seu modificador de Inteligência ou Sabedoria.",
    requisito: ""
},
{
    nome: "Nova Habilidade",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Cria imediatamente dois novos Feitiços ou três variações de liberação. Pode ser escolhida múltiplas vezes.",
    requisito: ""
},
{
    nome: "Perturbação Amaldiçoada",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ação comum: gasta 2 PE para afetar criatura a até 9m (TR de Vontade). Falha: prejuízo igual ao seu modificador de Inteligência ou Sabedoria; sucesso: metade. Dura por número de rolagens igual ao bônus de treinamento.",
    requisito: ""
},
{
    nome: "Reação Rápida",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Adiciona seu modificador de Inteligência ou Sabedoria ao bônus de iniciativa.",
    requisito: ""
},
{
    nome: "Reforço Amaldiçoado",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Sua CD de Especialização e Amaldiçoada aumenta em +2 (+3 no nível 10, +4 no nível 20).",
    requisito: ""
},
{
    nome: "Sobrecarregar",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao usar Feitiço que exige teste de resistência, pode gastar PE igual ao bônus de treinamento. Para cada ponto gasto, aumenta a CD em +1.",
    requisito: ""
},
{
    nome: "Técnicas de Combate",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Escolhe duas armas para se tornar treinado e pode usar Inteligência ou Sabedoria nos ataques e dano com elas.",
    requisito: ""
},
{
    nome: "Zelo Recompensador",
    categoria: "Especialista em Técnica",
    nivel: "2° NÍVEL",
    desc: "Ao suceder em teste de resistência contra Feitiço, recebe 1 PE temporário (2 PE temporários no nível 14).",
    requisito: ""
},
{
    nome: "Adiantar a Evolução.",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Focado em sua técnica, você consegue adiantar a evolução das suas habilidades. Ao invés de seguir o padrão para conseguir Feitiços de nível superior, com o aumento de treinamento, você segue o seguinte padrão: no nível 4, você recebe acesso a Feitiços nível 2; no nível 7, você recebe acesso a Feitiços nível 3; no nível 11, você recebe acesso a Feitiços nível 4; no nível 15, você recebe acesso a Feitiços nível 5.",
    requisito: ""
},
{
    nome: "Até a Última Gota",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "1x por descanso longo, se estiver com menos da metade da energia amaldiçoada, pode usar ação comum para recuperar 1d4 + mod Int/Sab (aumenta 1 dado a cada 5 níveis). Após usar, recebe 1 ponto de exaustão.",
    requisito: ""
},
{
    nome: "Ciclagem Maldita",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Se usar um Feitiço de dano diferente do último utilizado, ele causa dados adicionais iguais à metade do bônus de treinamento.",
    requisito: ""
},
{
    nome: "Determinação Energizada",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Ao realizar teste de resistência de Astúcia ou Vontade, pode gastar 1 PE para ter vantagem. Cada uso adicional na mesma rodada custa +1 PE cumulativo.",
    requisito: ""
},
{
    nome: "Energia Focalizada",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Escolhe um teste de resistência (Fortitude, Reflexos, Astúcia ou Vontade) para adicionar metade do modificador de Inteligência ou Sabedoria nas rolagens.",
    requisito: ""
},
{
    nome: "Energia Inacabável",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Seu máximo de energia amaldiçoada aumenta em valor igual à metade do seu nível de Especialista em Técnica.",
    requisito: ""
},
{
    nome: "Epifania Amaldiçoada",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Aprende uma Aptidão Amaldiçoada. No nível 12, aprende outra adicional.",
    requisito: ""
},
{
    nome: "Explosão Defensiva",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Como reação ao ser atingido por ataque corpo a corpo, pode gastar até o bônus de treinamento em PE. Para cada PE gasto, reduz o dano em 5 e empurra o atacante 3m.",
    requisito: "Aptidão Cobrir-se"
},
{
    nome: "Feitiço Favorito",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Escolhe um Feitiço que recebe permanentemente uma Melhoria de Ritual. Conta como efeito já aplicado em rituais.",
    requisito: ""
},
{
    nome: "Feitiços Refinados",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Adiciona metade do bônus de treinamento na CD dos seus Feitiços e Aptidões Amaldiçoadas.",
    requisito: ""
},
{
    nome: "Movimentos Imprevisíveis",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Pode adicionar seu modificador de Inteligência ou Sabedoria na Defesa, limitado pelo nível.",
    requisito: ""
},
{
    nome: "Naturalidade com Rituais",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Pode usar Inteligência no lugar de Destreza em testes de Prestidigitação para rituais.",
    requisito: "Treinado em Prestidigitação"
},
{
    nome: "Preparação de Técnicas",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Prepara 2 Feitiços por descanso longo para conjurar com metade do custo na primeira vez. Níveis permitidos aumentam conforme o nível (1 a 5).",
    requisito: ""
},
{
    nome: "Olhar Preciso",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Recebe +2 em ataques com Feitiços e Aptidões Amaldiçoadas. A cada 4 níveis, o bônus aumenta em +1.",
    requisito: ""
},
{
    nome: "Sacrifício pela Energia",
    categoria: "Especialista em Técnica",
    nivel: "4° NÍVEL",
    desc: "Para cada 6 de dano causado a si mesmo, recupera 2 PE. Vida perdida não pode ser curada até o próximo descanso (cura excedente vira PV temporário). Se causar dano ≥ metade da vida máxima, recebe 1 ponto de exaustão.",
    requisito: ""
},
{
    nome: "Bastião Interior",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Você transforma sua mente em um bastião inabalável. Recebe vantagem em todos os testes de resistência para evitar ou encerrar as condições Amedrontado, Desorientado e Enfeitiçado.",
    requisito: "Treinado em Vontade"
},
{
    nome: "Combate Amaldiçoado",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Sempre que realizar um ataque com uma arma na qual se tornou treinado por meio de Técnicas de Combate, o ataque causa dano adicional igual ao seu bônus de treinamento. Além disso, no início de um combate ou como ação livre no seu turno, você pode gastar 2 PE para que essa arma cause dano como se fosse um nível de dano acima. Esse efeito dura até o fim do combate.",
    requisito: "Técnicas de Combate"
},
{
    nome: "Correção",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Uma vez por rodada, quando você falhar em um teste para manter a concentração em um Feitiço, pode gastar uma quantidade de PE igual ao nível do Feitiço para não perder a concentração.",
    requisito: ""
},
{
    nome: "Dominância em Feitiço",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Escolha um Feitiço que você conheça. O custo base de PE desse Feitiço é reduzido em um valor igual à metade do nível dele (arredondado para cima). Essa redução não pode diminuir o custo abaixo de 1 PE.",
    requisito: ""
},
{
    nome: "Elevar Aptidão",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Escolha uma de suas Aptidões. O Nível dessa Aptidão aumenta em +1. Você pode selecionar esta habilidade um número de vezes igual ao seu bônus de treinamento, podendo escolher a mesma Aptidão mais de uma vez (respeitando limites do sistema).",
    requisito: ""
},
{
    nome: "Especialização",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Escolha 3 perícias nas quais você já seja treinado. Você se torna Mestre nessas perícias.",
    requisito: ""
},
{
    nome: "Incapaz de Falhar",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Ao realizar uma rolagem de Aptidão Amaldiçoada (exceto Aptidões de Domínio), você pode gastar 2 PE para adicionar ao resultado um valor igual ao seu modificador de Inteligência ou Sabedoria. Pode usar essa habilidade apenas uma vez por Aptidão utilizada na rodada.",
    requisito: ""
},
{
    nome: "Mente Repartida",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Você pode manter concentração simultânea em duas fontes diferentes (como dois Feitiços que exijam concentração). Se falhar em um teste de concentração, você escolhe qual das fontes perde primeiro.",
    requisito: ""
},
{
    nome: "Nível Perfeito",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Escolha um nível de Feitiço. A CD de resistência de todos os seus Feitiços desse nível aumenta em +2. Nos níveis 12 e 18, você pode escolher um nível adicional diferente para receber esse mesmo benefício.",
    requisito: ""
},
{
    nome: "Passo Rápido",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Quando uma criatura entra no seu alcance corpo a corpo ou se aproxima a uma distância que permitiria atacá-lo, você pode usar sua Reação para se mover até metade do seu deslocamento. Esse movimento não provoca ataques de oportunidade.",
    requisito: ""
},
{
    nome: "Potência Concentrada",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Uma vez por rodada, você pode gastar uma Ação de Movimento para concentrar energia. Se fizer isso, seu próximo Feitiço de dano com alvo único, conjurado até o fim do turno, causa dano adicional igual a 5 × o nível do Feitiço.",
    requisito: ""
},
{
    nome: "Ritualista",
    categoria: "Especialista em Técnica",
    nivel: "6° NÍVEL",
    desc: "Você recebe +2 em testes para realizar Conjuração em Ritual. Além disso, um número de vezes por Descanso Longo igual à metade do seu bônus de treinamento (arredondado para baixo), você pode aplicar 1 melhoria adicional a um Ritual sem aumentar seu custo.",
    requisito: ""
},
{
    nome: "Expansão dos Fundamentos",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Ao obter esta habilidade, você aprende 1 Mudança de Fundamento adicional à sua escolha. No nível 12, aprende mais 1 Mudança de Fundamento adicional.",
    requisito: ""
},
{
    nome: "Físico Amaldiçoado Defensivo",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "A quantidade máxima de PE que você pode gastar ao utilizar a Aptidão Cobrir-se aumenta em +2. Caso possua Cobertura Avançada, esse aumento adicional é de +1 (totalizando +3).",
    requisito: "Aptidão Cobrir-se"
},
{
    nome: "Imbuir com Técnica",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Quando conjurar um Feitiço de dano que não seja de tipo especial nem em área, e cujo tempo de conjuração seja Ação Comum ou inferior, você pode, como Ação Bônus, gastar +2 PE para imbuí-lo em uma arma que esteja manejando, desde que seja treinado com ela. Em vez de resolver o Feitiço normalmente, você realiza um ataque com a arma. Se acertar, além do dano do ataque, aplica também o efeito completo do Feitiço como se tivesse atingido normalmente. Caso o Feitiço exija Teste de Resistência, o efeito é aplicado automaticamente sem teste, exceto se envolver Condições, que ainda exigem TR normalmente.",
    requisito: "Combate Amaldiçoado"
},
{
    nome: "Liberações Expandidas",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Você recebe 1 Liberação Máxima adicional. Nos níveis 12 e 16, recebe mais 1 Liberação Máxima adicional em cada um desses níveis.",
    requisito: ""
},
{
    nome: "Mira Aperfeiçoada",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Você pode utilizar a ação Mirar para jogadas de ataque amaldiçoado. Além disso, recebe a Mudança de Fundamento Técnica Precisa. Caso já possua Técnica Precisa, o bônus concedido por ela aumenta em +1.",
    requisito: "Olhar Preciso"
},
{
    nome: "Primeiro Disparo",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Durante a rolagem de iniciativa, você pode utilizar imediatamente uma habilidade cujo custo de tempo seja Ação Bônus ou Ação Livre. Essa habilidade é resolvida antes do início do primeiro turno do combate.",
    requisito: "Treinado em Reflexos"
},
{
    nome: "Revestimento Constante",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Você recebe Redução de Dano contra todos os tipos de dano, exceto dano à alma, em valor igual ao seu bônus de treinamento. Essa redução é permanente enquanto estiver consciente.",
    requisito: "Aptidão Cobrir-se"
},
{
    nome: "Sustentação Avançada",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Você pode manter 1 Feitiço sustentado adicional simultaneamente. Além disso, no início de um combate, pode ativar 1 Feitiço sustentado à sua escolha como Ação Livre, desde que ele normalmente exija Ação Bônus ou inferior.",
    requisito: ""
},
{
    nome: "Teste de Resistência Mestre.",
    categoria: "Especialista em Técnica",
    nivel: "8° NÍVEL",
    desc: "Você se torna treinado em um segundo teste de resistência e mestre no concedido pela sua especialização.",
    requisito: ""
},
{
    nome: "Foco Amaldiçoado.",
    categoria: "Especialista em Técnica",
    nivel: "10° NÍVEL",
    desc: "Durante seu desenvolvimento, você se foca em certos aspectos do funcionamento da energia amaldiçoada, podendo escolher entre um dos três focos: • Destruição. Todo Feitiço que você conjurar causa +1 de dano para cada dado rolado nela. Além disso, sempre que causar dano com um Feitiço ou aptidão amaldiçoada, você soma o seu bônus de treinamento no total de dano. • Economia. O custo de todos os seus Feitiços é reduzido em 2, podendo reduzir o custo dos Feitiços nível 1 para 0. Além disso, você passa a somar o seu bônus de treinamento no seu máximo de energia amaldiçoada. • Refino. Você recebe uma Aptidão Amaldiçoada ou Feitiço adicional a sua escolha. Além disso, você passa a somar metade do seu bônus de treinamento no cálculo de todas as suas CDs e em jogadas de ataque amaldiçoado.",
    requisito: ""
},
{
    nome: "Destruição Ampla",
    categoria: "Especialista em Técnica",
    nivel: "10° NÍVEL",
    desc: "Sempre que conjurar um Feitiço de dano em área, ele causa +5 de dano adicional para cada criatura além da primeira que esteja sendo afetada. O dano adicional é somado ao dano total do Feitiço antes da aplicação de RD ou Testes de Resistência individuais.",
    requisito: ""
},
{
    nome: "Destruição Focada",
    categoria: "Especialista em Técnica",
    nivel: "10° NÍVEL",
    desc: "Sempre que conjurar um Feitiço de dano de alvo único, ele ignora uma quantidade de Redução de Dano igual ao seu modificador de Inteligência ou Sabedoria (à sua escolha). Além disso, o Feitiço causa dados de dano adicionais iguais à metade do seu bônus de treinamento (arredondado para baixo), utilizando o mesmo tipo de dado do Feitiço.",
    requisito: ""
},
{
    nome: "Economia de Energia Avançada",
    categoria: "Especialista em Técnica",
    nivel: "10° NÍVEL",
    desc: "Sua habilidade Economia de Energia é aprimorada: após um descanso curto, sua reserva passa a ser 1d6; após um descanso longo, 1d8 (mantendo a progressão de aumento de 1 dado a cada 5 níveis). Além disso, transferir energia da reserva para seu total atual passa a exigir uma Ação Bônus em vez de Ação Comum.",
    requisito: "Economia de Energia"
},
{
    nome: "Sentidos Aguçados",
    categoria: "Especialista em Técnica",
    nivel: "10° NÍVEL",
    desc: "Sua Atenção aumenta em um valor igual à metade do seu modificador de Inteligência ou Sabedoria (arredondado para baixo). Você adiciona esse mesmo valor como bônus adicional em rolagens de Percepção. Além disso, você pode gastar 2 PE para, enquanto estiver no ar, manter-se estável como se estivesse apoiado em uma superfície sólida, permanecendo de pé até o início do seu próximo turno.",
    requisito: "Mestre em Percepção"
},
{
    nome: "Esgrimista Jujutsu",
    categoria: "Especialista em Técnica",
    nivel: "12° NÍVEL",
    desc: "Sempre que ativar Combate Amaldiçoado, você pode conjurar simultaneamente 1 Feitiço Auxiliar que tenha você como alvo, desde que o custo padrão desse Feitiço seja Ação Bônus. O Feitiço é conjurado como parte da mesma ação que ativa ou utiliza o Combate Amaldiçoado, sem exigir ação adicional.",
    requisito: "Combate Amaldiçoado"
},
{
    nome: "Expansão Maestral",
    categoria: "Especialista em Técnica",
    nivel: "12° NÍVEL",
    desc: "Você pode utilizar sua Expansão de Domínio mesmo possuindo apenas uma mão livre. Além disso, enquanto estiver realizando a expansão, ataques à distância contra você não provocam ataques de oportunidade.",
    requisito: "Aptidão Expansão de Domínio Completa"
},
{
    nome: "Explosão Máxima",
    categoria: "Especialista em Técnica",
    nivel: "12° NÍVEL",
    desc: "Sempre que um efeito permitir rolar um dado adicional por obter resultado máximo em um dado de dano (como em Explosão Encadeada), além de rolar o dado adicional, você soma +4 ao dano total para cada resultado máximo obtido. O bônus aplica-se uma vez por dado que tenha atingido o valor máximo.",
    requisito: "Explosão Encadeada"
},
{
    nome: "Mestre das Aptidões",
    categoria: "Especialista em Técnica",
    nivel: "12° NÍVEL",
    desc: "No início de cada rodada, você recebe uma quantidade de PE temporários igual à metade do seu bônus de treinamento (arredondado para baixo). Esses PE temporários só podem ser utilizados para conjurar ou ativar Aptidões Amaldiçoadas. Esses pontos não acumulam entre rodadas e são contabilizados separadamente de outros PE temporários.",
    requisito: ""
},
{
    nome: "Versatilidade Ampliada",
    categoria: "Especialista em Técnica",
    nivel: "12° NÍVEL",
    desc: "Todos os seus Feitiços passam a possuir 1 variação de liberação adicional. Além disso, escolha 1 Feitiço que você conheça: ele passa a possuir 1 variação de liberação para cada nível de Feitiço ao qual você tenha acesso.",
    requisito: ""
},
{
    nome: "Manipulação Perfeita",
    categoria: "Especialista em Técnica",
    nivel: "16° NÍVEL",
    desc: "Escolha uma quantidade de Feitiços igual ao seu bônus de treinamento. O custo base em PE desses Feitiços é reduzido em um valor igual à metade do seu bônus de treinamento (arredondado para baixo). Essa redução não pode diminuir o custo de um Feitiço para menos de 1 PE. A escolha dos Feitiços é permanente, salvo regra específica que permita alteração.",
    requisito: "Dominância em Habilidade"
},
{
    nome: "Sustentação Mestre",
    categoria: "Especialista em Técnica",
    nivel: "16° NÍVEL",
    desc: "Você pode manter até 3 Feitiços sustentados simultaneamente. Além disso, o custo em PE para sustentar Feitiços é reduzido em 1 por Feitiço sustentado (mínimo de 1 PE por Feitiço).",
    requisito: "Sustentação Avançada"
},
{
    nome: "O Honrado.",
    categoria: "Especialista em Técnica",
    nivel: "16° NÍVEL",
    desc: "Entre os céus e a terra, você sozinho é o honrado, com um controle de energia amaldiçoada insuperável. Feitiços de nível 1, 2 e 3 tem o seu custo reduzido pela metade; a CD de todos seus Feitiços e Aptidões Amaldiçoadas aumenta em 5 e você recebe +5 em rolagens de ataque para Feitiços e Aptidões Amaldiçoadas.",
    requisito: ""
},
//CONTROLADOR//
{
        nome: "Treinamento em Controle",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Você é treinado para controlar Invocações com maior eficiência. Ao obter esta habilidade, você: • Recebe duas Invocações iniciais, as quais podem ser tanto shikigamis quanto corpos amaldiçoados. Nos níveis 3, 6, 9, 10, 12, 15 e 18 você recebe uma Invocação adicional. • A quantidade de Invocações que você pode manter ativas em campo aumenta em 1. • Nos níveis 6, 12 e 18 a quantidade de comandos que voc realiza com uma Ação Comum e Bônus aumenta em um (no nível 6, uma Ação Comum permitiria duas Invocações realizarem uma ação complexa ou uma Invocação realizar duas ações complexas).",
        requisito: ""
    },
{
        nome: "Aceleração",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, você pode fazer com que uma Invocação se mova duas vezes ao invés de uma.",
        requisito: ""
    },
    {
        nome: "Camuflagem Aprimorada",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Como uma Ação Comum, você pode se camuflar entre invocações adjacentes: para cada invocação, ataques contra você têm 10% de chance de erro (1 em 1d10). Dura até que não haja mais invocações adjacentes.",
        requisito: ""
    },
    {
        nome: "Chamado Destruidor",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Quando uma de suas invocações consegue um acerto crítico, você pode pagar 2 PE (Ação Livre) para fazer outra invocação adjacente atacar o mesmo alvo.",
        requisito: ""
    },
    {
        nome: "Companheiro Amaldiçoado",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Escolha uma invocação: uma vez por rodada, ela pode usar a ação Apoiar como Ação Livre. Você pode trocar o companheiro durante um descanso caso o anterior seja exorcizado.",
        requisito: ""
    },
    {
        nome: "Dor Partilhada",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Ao usar Invocar, crie um laço: se você e a invocação receberem dano de uma mesma habilidade em área, ambos recebem apenas o menor valor de dano entre os dois.",
        requisito: ""
    },
    {
        nome: "Frenesi da Invocação",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, uma invocação ataca duas vezes em vez de uma. Porém, por uma rodada, ataques contra ela têm vantagem e ela sofre -5 na Defesa e testes de resistência.",
        requisito: ""
    },
    {
        nome: "Guarda Viva",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Sua Defesa aumenta em +1 para cada invocação sua que estiver dentro de 3 metros de você.",
        requisito: ""
    },
    {
        nome: "Invocações Móveis",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "O Deslocamento de todas suas Invocações aumenta em 1,5m. Nos níveis 6, 12 e 18, elas recebem +1,5m adicionais.",
        requisito: ""
    },
    {
        nome: "Invocações Resistentes",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Os PV Máximos de todas suas invocações aumentam em um valor igual ao seu Bônus de Treinamento multiplicado por cinco.",
        requisito: ""
    },
    {
        nome: "Invocações Treinadas",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Todas suas invocações se tornam treinadas em Perícias adicionais em quantidade igual a metade do seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Melhoria de Controlador",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Escolha uma das quatro melhorias especificadas no final da especialização. Você pode pegar essa habilidade até quatro vezes (uma para cada melhoria).",
        requisito: ""
    },
    {
        nome: "Otimização de Energia",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Após um descanso, escolha uma habilidade com custo de cada invocação: o custo dessa habilidade é reduzido em 1 PE.",
        requisito: ""
    },
    {
        nome: "Proteger Invocação",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Use sua Reação para: 1) Fazer uma invocação se mover e receber dano por outra que seria exorcizada; ou 2) Reduzir o dano recebido por uma invocação em Xd6 + Mod (X = bônus de treinamento).",
        requisito: ""
    },
    {
        nome: "Rede de Detecção",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Para cada invocação dentro de 3 metros, você recebe +2 em Percepção e seu valor de Atenção aumenta em 2.",
        requisito: ""
    },
    {
        nome: "Técnicas de Combate",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Você se torna treinado em duas armas à escolha e pode usar Presença ou Sabedoria para jogadas de ataque e dano com elas.",
        requisito: ""
    },
    {
        nome: "Visionário",
        categoria: "Controlador",
        nivel: "2° NÍVEL",
        desc: "Sempre que criar uma invocação, ela recebe ações/características adicionais iguais a metade do seu bônus de treinamento (o custo aumenta normalmente).",
        requisito: ""
    },
        {
        nome: "Controle Aprimorado",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Você é naturalmente mais capaz em comandar invocações, aprimorando o desempenho e aplicação delas. Suas invocações recebem um bônus em testes que realizarem igual a +2, aumentando em +1 para cada grau acima do quarto (+3 para terceiro, +4 para segundo etc.) Além disso, você pode utilizar Aptidões Amaldiçoadas das categorias Controle e Leitura a partir de suas Invocações, fazendo com que elas recebam os efeitos, como o aumento de dano de Canalizar em Golpe; entretanto, não é possível utilizar Punho Divergente e Emoção da Pétala Decadente a partir de Invocações.",
        requisito: ""
    },
    {
        nome: "Ação Corretiva",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Quando uma invocação dentro de 9m realizar uma rolagem de perícia menor que 10, você pode gastar 2 PE para transformar o resultado em 10.",
        requisito: ""
    },
    {
        nome: "Acompanhamento Amaldiçoado",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Ao usar Invocar, uma invocação pode te acompanhar. Quando você ataca um alvo no alcance de ambos, ela pode usar uma Reação para atacar ou auxiliar.",
        requisito: ""
    },
    {
        nome: "Ataque em Conjunto",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Uma vez por rodada (Ação Comum), todas as invocações atacam o mesmo alvo. Custo: 2 PE por invocação além da primeira. Cada participante concede +1 no acerto. Limite de uso: Mod. de Sabedoria ou Presença por descanso longo.",
        requisito: ""
    },
    {
        nome: "Autonomia",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Ao ativar uma invocação, pague +2 PE por grau dela. Ela recebe um turno próprio, podendo se mover e agir sem necessidade de comandos.",
        requisito: ""
    },
    {
        nome: "Companheiro Avançado",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Seu companheiro amaldiçoado torna-se um Aliado (Iniciante). No nível 6 vira Veterano e no nível 12, Mestre.",
        requisito: "Companheiro Amaldiçoado"
    },
    {
        nome: "Crítico Brutal",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Críticos de invocações causam +1 dado de dano. Você pode reduzir o Deslocamento do alvo (1,5m x Bônus de Treino) ou a Defesa (metade do Bônus de Treino) até seu próximo turno.",
        requisito: ""
    },
    {
        nome: "Domador de Maldições",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Você possui vantagem em todas as rolagens para domar maldições e pode anular sua primeira falha no processo.",
        requisito: ""
    },
    {
        nome: "Invocação Às",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Seu companheiro amaldiçoado recebe os benefícios detalhados no final da especialização.",
        requisito: "Companheiro Amaldiçoado"
    },
    {
        nome: "Invocação Parcial",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Você pode usar ações de uma invocação não ativa: Ação Comum para ação complexa ou Ação Bônus para ação simples.",
        requisito: ""
    },
    {
        nome: "Potencial Superior",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Todas as suas invocações recebem +2 pontos de atributo adicionais por grau da criatura.",
        requisito: ""
    },
        {
        nome: "Apogeu",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Você começa a encontrar o caminho que deseja seguir como um controlador, especializando-o em um estilo específico de controle. Escolha entre: Controle Concentrado, Controle Disperso, Controle Sintonizado",
        requisito: ""
    },
    {
        nome: "Controle Disperso",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Você prefere controlar diversas invocações, mantendo a quantidade sempre em número superior. O número de invocações que você pode manter ativas em campo aumenta em 1, assim como a quantidade que você pode invocar/ativar com uma ação aumenta em 1. Além disso, você recebe acesso à ação Criar Horda (p.259). A partir do nível 12, o número de invocações que você pode manter ativas em campo e invocar/ativar com uma ação aumenta em 1, assim como você pode criar duas hordas como parte de uma mesma ação de Criar Horda.",
        requisito: ""
    },
    {
        nome: "Controle Sintonizado",
        categoria: "Controlador",
        nivel: "4° NÍVEL",
        desc: "Você prefere ficar em sintonia com suas invocações, não deixando que apenas elas lutem sozinhas. Uma vez por rodada, quando uma invocação em campo realizar um ataque contra um alvo dentro do seu alcance, você pode pagar 2PE para, como uma Ação Livre, realizar um ataque contra o mesmo alvo. Além disso, para cada invocação que possua em campo, você recebe +1 em acerto e dano, com elas te auxiliando.",
        requisito: ""
    },
    {
        nome: "Controle Concentrado",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Você opta por concentrar suas forças e foco em uma única invocação, a qual sozinha se torna uma arma absoluta. Ao invés de invocar/ativar duas invocações como uma ação bônus, você pode invocar apenas uma como ação livre.",
        requisito: ""
    },
    {
        nome: "Combate em Alcateia",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Enquanto maneja uma arma escolhida em Técnicas de Combate, seu dano com ela aumenta em 1 nível para cada Invocação que esteja com a criatura no alcance de ataque dela.",
        requisito: "Técnicas de Combate e Apogeu - Controle Sintonizado"
    },
    {
        nome: "Concentrar Poder",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Enquanto estiver com apenas uma invocação em campo, você recebe benefícios de acordo com o seu nível de personagem (detalhes no final da especialização).",
        requisito: "Apogeu - Controle Concentrado"
    },
    {
        nome: "Hoste Amaldiçoada",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Ao usar Criar Horda, você pode reduzir o limite de grau do Líder em 1 para criar duas hordas em vez de uma. Elas contam como apenas uma para o seu limite.",
        requisito: "Apogeu - Controle Disperso"
    },
    {
        nome: "Invocações Econômicas",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Escolha duas invocações para terem o custo de ativação reduzido em 2. No nível 12 e 18, você pode escolher mais uma em cada nível.",
        requisito: ""
    },
    {
        nome: "Proteção Avançada de Invocação",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Ao receber dano por sua invocação (Reação), você recebe apenas metade do dano. A redução de dano normal aumenta para Xd8. Se estiver adjacente, pode gastar 2 PE para usar como Ação Livre.",
        requisito: "Proteger Invocação"
    },
    {
        nome: "Táticas de Alcateia",
        categoria: "Controlador",
        nivel: "6° NÍVEL",
        desc: "Se uma criatura for flanqueada por uma de suas invocações, a Defesa dela e seus testes de resistência diminuem em um valor igual a metade do seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Aptidões de Controle",
        categoria: "Controlador",
        nivel: "8° NÍVEL",
        desc: "Você pode aumentar o seu nível de aptidão em Aura, Controle e Leitura ou Barreira em 1. Você pode pegar esta habilidade três vezes, uma para cada aptidão.",
        requisito: ""
    },
    {
        nome: "Atacar e Invocar",
        categoria: "Controlador",
        nivel: "8° NÍVEL",
        desc: "Quando utilizar a ação Atacar, você pode gastar 2 PE para trazer uma invocação ao campo, considerando como se ela já estivesse presente para efeitos de habilidades como Acompanhamento Amaldiçoado.",
        requisito: ""
    },
    {
        nome: "Golpes Ágeis",
        categoria: "Controlador",
        nivel: "8° NÍVEL",
        desc: "Uma vez por rodada, quando uma Invocação sua usar o efeito de Acompanhamento Amaldiçoado, você pode gastar 2 PE para realizar um ataque armado ou desarmado adicional.",
        requisito: "Acompanhamento Amaldiçoado"
    },
    {
        nome: "Técnicas de Oportunidade",
        categoria: "Controlador",
        nivel: "8° NÍVEL",
        desc: "Suas invocações podem usar Ações de Ataque como uma reação (Ataque de Oportunidade). Não é possível utilizar Ações com Custo como oportunidade.",
        requisito: ""
    },
    {
        nome: "Teste de Resistência Mestre",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Você se torna treinado em um segundo teste de resistência e mestre no concedido pela sua especialização.",
        requisito: ""
    },
    {
        nome: "Reserva para Invocação",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Você cria uma reserva dedicada para invocar ou ativar as suas invocações. Uma vez por descanso curto, você pode optar por usar a ação Invocar para trazer duas invocações com o custo reduzido pela metade ou uma invocação sem custo. Caso utilize esta habilidade para Criar Horda, o custo total dela é reduzido pela metade.",
        requisito: ""
    },
    {
        nome: "Buchas de Canhão",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Você não precisa mais pagar PEs adicionais para colocar invocações de quarto grau como membros de uma horda ou invocá-la.",
        requisito: ""
    },
    {
        nome: "Crítico Aprimorado",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Um 19 se torna crítico para suas invocações. Ao conseguir um crítico, você escolhe dois efeitos (em vez de um) e pode optar por: diminuir o acerto do inimigo em metade do seu bônus de treinamento ou diminuir todas as RDs dele pelo valor do seu bônus de treinamento.",
        requisito: "Crítico Brutal"
    },
    {
        nome: "Flanco Avançado",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Se uma criatura estiver no alcance de pelo menos duas invocações, ela sofre os efeitos de Táticas de Alcateia e recebe 1d8 de dano adicional por ataque (aumentando em +1d8 para cada invocação além das duas primeiras).",
        requisito: "Táticas de Alcateia"
    },
    {
        nome: "Resistência Sobrecarregada",
        categoria: "Controlador",
        nivel: "10° NÍVEL",
        desc: "Ao ativar uma invocação, você pode gastar PE igual a metade do seu bônus de treinamento. Para cada 1 PE gasto, a invocação recebe +10 PV.",
        requisito: "Invocações Resistentes"
    },
    {
        nome: "Fantoche Supremo",
        categoria: "Controlador",
        nivel: "16° NÍVEL",
        desc: "Durante um descanso longo, escolha uma invocação para ser seu Fantoche Supremo. Ela recebe: PV extras (Bônus de Treino x 5); Defesa extra (Dobro do Bônus de Treino); +4,5m de movimento e uma ação complexa adicional por turno. Você só pode invocar o Fantoche Supremo uma vez por descanso longo.",
        requisito: ""
    },
    {
        nome: "Mestre do Controle",
        categoria: "Controlador",
        nivel: "16° NÍVEL",
        desc: "Uma vez por rodada, como uma ação livre, você pode gastar 2 PE para fazer com que uma invocação sua se mova e realize uma ação complexa adicional.",
        requisito: ""
    },
    {
        nome: "Ápice do Controle",
        categoria: "Controlador",
        nivel: "16° NÍVEL",
        desc: "Você alcançou o ápice do controle, levando além do limite a arte de ter invocações e as controlar, sendo uma presença única no mundo. Suas invocações recebem duas ações/características adicionais, as quais não influenciam no custo delas; você passa a poder invocar ou ativar suas invocações como uma ação livre (caso ela já pudesse ser invocada como Ação Livre, ela tem seu custo reduzido em 2 PE). Além disso, conhecendo bem as táticas para utilizar invocações, você consegue prever parte dos movimentos delas: invocações de outras criaturas possuem desvantagem para realizar ações ofensivas contra você.",
        requisito: ""
    },
    //SUPORTE//
    {
        nome: "Suporte em Combate",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Um suporte dispõe de um leque de capacidades que o permite auxiliar dentro do combate: • Você pode usar Apoiar como uma ação bônus. • Você pode, como uma ação bônus, curar uma criatura em alcance de toque em um valor igual a 2d6 + seu modificador de Presença ou Sabedoria, uma quantidade de vezes igual ao seu modificador de Presença ou Sabedoria, por descanso curto ou longo. No nível 4, essa cura se torna 2d12, no nível 8, se torna 3d12, no nível 12 se torna 6d8, no nível 16 se torna 6d10..",
        requisito: ""
    },
    {
        nome: "Presença Inspiradora",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Sua presença inspira aqueles ao seu redor a tentarem seu máximo. Você pode pagar 2 pontos de energia amaldiçoada para fazer com que, durante uma cena, todo aliado dentro de 9 metros de você fique inspirado. Um aliado inspirado recebe um bônus de +1 em toda rolagem de perícia. Ao utilizar esta habilidade, você pode gastar uma quantidade de PE adicional igual a metade do seu modificador de Presença, aumentando o bônus em +1 para cada PE gasto dessa maneira.",
        requisito: ""
    },
    {
        nome: "Amizade Inquebrável",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Escolha um Aliado Jogador como seu 'Amigo'. Ao terminar seu turno ao lado dele, você pode (Ação Livre) realizar a ação Apoiar no mesmo. Troca de amigo disponível apenas em interlúdios.",
        requisito: ""
    },
    {
        nome: "Análise Profunda",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Como Ação Comum (1 PE), realize Percepção (CD 15+ND) em uma criatura. Se passar, descobre uma característica (PV, bônus, etc.). Para cada 5 pontos acima da CD, descobre uma adicional. Limite: 1x por criatura na cena.",
        requisito: ""
    },
    {
        nome: "Apoio Avançado",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Ao utilizar a ação Apoiar, você pode fortalecer seu apoio com um efeito à sua escolha (lista no final da especialização).",
        requisito: ""
    },
    {
        nome: "Conceder Outra Chance",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Ao ver um aliado em até 6m falhar em um teste, gaste 3 PE para fazê-lo rolar novamente com o melhor resultado. Usos: bônus de treinamento por descanso longo (recupera metade no curto).",
        requisito: ""
    },
    {
        nome: "Comando Motivador",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Como Ação Livre, gaste 2 PE e dê um comando a um aliado: ele recebe bônus igual ao seu bônus de treinamento na rolagem da ação comandada.",
        requisito: ""
    },
    {
        nome: "Desvendar Terreno",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Como Ação de Movimento, teste Percepção (CD Narrador) para achar pontos estratégicos. Se passar, recebe seu bônus de treino em testes de Percepção para encontrar coisas/pessoas até o fim da cena.",
        requisito: ""
    },
    {
        nome: "Expandir Repertório",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Torna-se treinado em perícias (metade do seu bônus de treino) e recebe +2 em uma perícia qualquer.",
        requisito: ""
    },
    {
        nome: "Mobilidade Avançada",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Recebe +3m de movimento. Se um aliado cair nas portas da morte, você pode (Reação) mover-se metade do seu movimento na direção dele.",
        requisito: ""
    },
    {
        nome: "Otimização de Espaço",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Recebe espaços de inventário adicionais iguais ao seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Pronto para Agir",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Soma Mod. Presença na Iniciativa. Aliados recebem metade desse bônus.",
        requisito: ""
    },
    {
        nome: "Protetor",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Se um aliado em 1,5m for atacado, gaste 1 PE (Ação Livre) para reduzir o dano em Xd10 + Mod. Presença/Sabedoria (X = bônus de treino). Requer Escudo.",
        requisito: ""
    },
    {
        nome: "Técnicas de Combate",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "Torna-se treinado em duas armas e usa Presença ou Sabedoria nos ataques e dano com elas.",
        requisito: ""
    },
    {
        nome: "Transmitir Conhecimento",
        categoria: "Suporte",
        nivel: "2° NÍVEL",
        desc: "No descanso curto, concede treino em perícias suas para aliados (limite: metade do bônus de treino). No descanso longo, limite igual ao bônus total.",
        requisito: ""
    },
    {
        nome: "Versatilidade",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Sempre que realizar uma rolagem com uma perícia na qual você não seja treinado, você pode pagar 1 ponto de energia amaldiçoada para considerar como se fosse treinado. Você pode utilizar esta habilidade uma quantidade de vezes igual ao seu modificador de Sabedoria, por descanso curto ou longo.",
        requisito: ""
    },
    {
        nome: "Teste de Resistência Mestre",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Você se torna treinado em um segundo teste de resistência e mestre no concedido pela sua especialização.",
        requisito: ""
    },

    {
        nome: "Apoios Versáteis",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Você aprende um apoio avançado adicional. No 10° nível, você recebe outro apoio avançado.",
        requisito: ""
    },
    {
        nome: "Guarda Sincronizada",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Como Ação Bônus, sintonize aliados em até 7,5m: para cada aliado no alcance, todos os outros recebem +1 na Defesa.",
        requisito: ""
    },
    {
        nome: "Inspirar Aliados",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Uma vez por cena (Ação Bônus, 1 PE), inspire aliados (limite: metade do bônus de treino). Por 10 min, eles podem adicionar 2d3 em um ataque ou teste (limite de usos: seu Mod. Presença/Sabedoria).",
        requisito: ""
    },
    {
        nome: "Intervenção",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Como Ação Comum (3 PE), encerre uma condição FRACA em um aliado (toque). Nível 6: Média (6 PE); Nível 12: Forte (9 PE); Nível 18: Extrema (12 PE).",
        requisito: ""
    },
    {
        nome: "Negação Crítica",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Pague 3 PE para negar uma falha crítica em até 12m. Usos por cena: 1 + metade do seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "No Último Segundo",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Se houver aliado com 2 falhas na Porta da Morte, ganhe +5 Iniciativa. Se agir antes dele, anula terreno difícil, ganha +4,5m de movimento e +5 Defesa contra ataques de oportunidade.",
        requisito: ""
    },
    {
        nome: "Pré-Análise",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Você não pode ser surpreendido e recebe +5 de Atenção. Pode escolher um aliado para também não ser surpreendido.",
        requisito: "Treinado em Percepção"
    },
    {
        nome: "Recompensa pelo Sucesso",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Ao usar Comando Motivador, você pode reduzir o bônus pela metade. Se o aliado ainda assim suceder, ele recupera 2 PE.",
        requisito: "Comando Motivador"
    },
    {
        nome: "Sintonização Vital",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Ao curar um aliado, gaste 3 PE para que outra criatura em até 3m (ou você) recupere metade do valor curado.",
        requisito: ""
    },
    {
        nome: "Contra-Ataque",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Como Reação (1 PE), aumente a Defesa de um aliado pelo seu bônus de treino. Se o ataque errar por causa disso, você ou o aliado podem pagar +1 PE para realizar um ataque imediato. Usos: 2x seu Mod. Presença/Sabedoria.",
        requisito: ""
    },
    {
        nome: "Cura Avançada em Grupo",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Ao curar um alvo, pague +2 PE por cada alvo adicional que desejar curar (limite de alvos extras igual ao seu bônus de treinamento).",
        requisito: ""
    },
    {
        nome: "Devolver na Mesma Moeda",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Quando um aliado for afetado por uma condição, gaste 2 PE (Ação Livre): o próximo teste de resistência de um inimigo para evitar uma condição desse aliado terá desvantagem.",
        requisito: ""
    },
    {
        nome: "Disseminar Cura",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Ao usar um Feitiço de cura, escolha um alvo adicional gastando PE extra igual ao nível da técnica.",
        requisito: ""
    },
    {
        nome: "Incitar Vigor",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Como Ação Bônus (3 PE), toque uma criatura: ela pode gastar seus próprios dados de vida imediatamente para se curar.",
        requisito: ""
    },
    {
        nome: "Inimigo Comum",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "Como Ação Bônus (2 PE), marque um inimigo para aliados (limite: seu Mod. Presença/Sab). Aliados ganham +metade do seu Mod no acerto e o Mod inteiro no dano contra ele. O bônus acaba se atacarem outro alvo enquanto o comum estiver vivo.",
        requisito: ""
    },
    {
        nome: "Posicionamento Estratégico",
        categoria: "Suporte",
        nivel: "6° NÍVEL",
        desc: "No seu turno, você pode reduzir seu movimento a 0 para permitir que um aliado se mova imediatamente como Ação Livre.",
        requisito: ""
    },
    {
        nome: "Aptidões de Suporte",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Aumente o nível de aptidão em Aura, Controle e Leitura ou Energia Reversa em 1. Pode ser adquirida 3 vezes (uma para cada aptidão).",
        requisito: ""
    },
    {
        nome: "Contaminar com Determinação",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Uma vez por cena (Ação Comum, 4 PE), você e dois aliados recebem vantagem em todos os testes de resistência por 2 rodadas. Cada aliado extra custa +2 PE.",
        requisito: ""
    },
    {
        nome: "Criar Medicina",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "No descanso, crie remédios portáteis (metade do bônus de treino no curto, bônus inteiro no longo). Custo: recupera menos PE no descanso. O remédio cura o valor do seu Suporte em Combate (Ação Comum para usar).",
        requisito: "Treinado em Ferramentas de Médico"
    },
    {
        nome: "Cura Aperfeiçoada",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Se tirar 1 ou 2 em um dado de cura, você pode rolar novamente e ficar com o melhor resultado.",
        requisito: ""
    },
    {
        nome: "Elevar Sucesso",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Quando um aliado em até 4,5m suceder em um teste de resistência, você pode (Reação, 2 PE) somar +5 ao resultado, podendo torná-lo um crítico.",
        requisito: ""
    },
    {
        nome: "Físico Controlado",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Você passa a somar Mod. de Presença ou Sabedoria nos PV (limite de +4) em vez de Constituição. Recalcule sua vida total ao adquirir esta habilidade.",
        requisito: "Treinado em Fortitude"
    },
    {
        nome: "Motivação pelo Triunfo",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Quando um inimigo cai a 0 PV, todos os aliados que deram dano nele recebem PV Temporários (2x seu nível de Suporte). Se for lacaio, o valor cai pela metade.",
        requisito: ""
    },
    {
        nome: "Pressão do Médico",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Ao entrar nas Portas da Morte, você não fica inconsciente. Pode tentar se estabilizar sozinho (CD +10), mas recebe uma falha garantida nos testes de morte ao tentar.",
        requisito: "Mestre em Medicina"
    },
    {
        nome: "Sustentação Avançada",
        categoria: "Suporte",
        nivel: "8° NÍVEL",
        desc: "Pode manter um feitiço sustentado adicional. No início do combate, pode ativar um feitiço sustentado (custo Bônus ou inferior) como Ação Livre.",
        requisito: ""
    },
    {
        nome: "Medicina Infalível",
        categoria: "Suporte",
        nivel: "4° NÍVEL",
        desc: "Você consegue dominar seus conhecimentos médicos e auxiliares ao ponto de elevá-los para um patamar superior. Uma quantidade de vezes igual a metade do seu nível de Suporte + bônus de treinamento, você pode, quando realizar uma rolagem para curar uma criatura, maximizar o valor de um dos dados dessa cura; você pode gastar vários usos para maximizar mais de um dado da mesma cura. Você recupera os usos após um descanso curto ou longo. Além disso, você soma o seu bônus de treinamento no total de toda cura que realizar.",
        requisito: ""
    },
    {
        nome: "Descarga Reanimadora",
        categoria: "Suporte",
        nivel: "10° NÍVEL",
        desc: "Como Ação Completa (10 PE), toque um aliado na Porta da Morte: ele estabiliza instantaneamente e cura o valor do seu Suporte em Combate. Se ele perdeu o turno por estar caído, ele age imediatamente após você.",
        requisito: "Aptidão Cura Amplificada"
    },
    {
        nome: "Necessidade de Continuar",
        categoria: "Suporte",
        nivel: "10° NÍVEL",
        desc: "Se estiver com menos de 50% de vida, você ganha PV Temporários (Medicina + Mod. Presença/Sab) no início do seu turno. Usos: 4x por cena.",
        requisito: "Treinado em Vontade"
    },
    {
        nome: "Olhar Aguçado",
        categoria: "Suporte",
        nivel: "10° NÍVEL",
        desc: "Como Ação Bônus (2 PE), analise um inimigo: o primeiro ataque de cada aliado contra ele causa dano extra (Bônus de Treino x 5). Limite: 2x por criatura.",
        requisito: "Treinado em Percepção"
    },
    {
        nome: "Táticas Defensivas",
        categoria: "Suporte",
        nivel: "10° NÍVEL",
        desc: "Escolha um tipo de dano Elemental: você e dois aliados recebem resistência a ele. Pode trocar o elemento e os aliados em um descanso longo.",
        requisito: ""
    },
    {
        nome: "Ajustes em Equipamento",
        categoria: "Suporte",
        nivel: "12° NÍVEL",
        desc: "No descanso curto, aplique um Encantamento temporário em itens (limite: seu Bônus de Treino). No descanso longo, o limite dobra. O efeito dura até o próximo descanso.",
        requisito: "Treinado em Ferramentas de Ferreiro"
    },
    {
        nome: "Interferência",
        categoria: "Suporte",
        nivel: "12° NÍVEL",
        desc: "Como Reação (2 PE), force um inimigo em até 9m a rerolar um teste com o pior resultado. Após isso, conceda vantagem na próxima rolagem de um aliado em até 4,5m.",
        requisito: ""
    },
    {
        nome: "Não Desista!",
        categoria: "Suporte",
        nivel: "12° NÍVEL",
        desc: "Se um aliado cair (3 PE), faça um teste de Persuasão (CD Estabilização). Se passar, ele fica de pé com 0 PV por 1 rodada e o limite para morte vira -100. Pode ser usada para anular penalidades de habilidades como 'Mesmo Morto' (limite: metade do bônus de treino).",
        requisito: ""
    },
    {
        nome: "Sobrecura",
        categoria: "Suporte",
        nivel: "12° NÍVEL",
        desc: "Ao curar, o excedente vira o dobro em PV Temporários (limite: 2x seu nível). Se o alvo já estiver cheio, conceda PV Temporários iguais a 5x seu Mod. Presença/Sabedoria.",
        requisito: ""
    },
    {
        nome: "Reação Necessária",
        categoria: "Suporte",
        nivel: "12° NÍVEL",
        desc: "Uma vez por rodada, se você não tiver mais sua reação, você pode gastar 3 PE para realizar uma reação adicional imediatamente.",
        requisito: ""
    },
    {
        nome: "Apoio Abrangente",
        categoria: "Suporte",
        nivel: "14° NÍVEL",
        desc: "Ao utilizar a habilidade Apoio Avançado, você pode escolher e aplicar dois efeitos simultâneos em vez de apenas um.",
        requisito: "Apoio Avançado"
    },
    {
        nome: "Purificação da Alma",
        categoria: "Suporte",
        nivel: "16° NÍVEL",
        desc: "Você pode restaurar a Integridade de alguém em 50% (usos: seu Mod. de Presença). Além disso, você soma seu Bônus de Treinamento ao número total de usos da sua cura de Suporte.",
        requisito: ""
    },
    {
        nome: "Sustentação Mestre",
        categoria: "Suporte",
        nivel: "16° NÍVEL",
        desc: "Você pode manter três feitiços sustentados simultaneamente. O custo para sustentar feitiços é reduzido em 1 (mínimo de 1 PE).",
        requisito: "Sustentação Avançada"
    },
    {
        nome: "Suporte Absoluto",
        categoria: "Suporte",
        nivel: "16° NÍVEL",
        desc: "Você é o suporte absoluto que se pode ter em campo, mudando o rumo da batalha para todos seus aliados. Uma vez por rodada, você pode utilizar Apoiar como uma Ação Livre. Além disso, sua quantidade de usos da habilidade Suporte em Combate são dobrados e você soma seu modificador de atributo escolhido para CD de especialização em toda cura que realizar.",
        requisito: "Sustentação Avançada"
    },
    //RESTRINGIDO
    {
        nome: "Ataque Furtivo",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Uma vez por turno, ao realizar um ataque surpresa ou contra um inimigo desprevenido, você pode adicionar 1d8 ao dano dele. Caso você esteja flanqueando um inimigo, não é necessário ser um ataque surpresa ou um alvo desprevenido para aplicar o dano adicional. No nível 3, o dano se torna 2d8, no nível 6 se torna 3d8, no nível 9 se torna 4d8, no nível 12 se torna 5d8, no nível 15 se torna 6d8.",
        requisito: ""
    },
    {
        nome: "Versatilidade",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Você pretende se tornar um pouco mais versátil em tudo. Você recebe +1 em todas as perícias. No 10° nível esse bônus se torna +2.",
        requisito: ""
    },
    {
        nome: "Ataque Inconsequente",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, receba Vantagem no ataque e +5 no dano. Porém, você fica Desprevenido por 1 rodada.",
        requisito: ""
    },
    {
        nome: "Apropriar-se",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Você recebe +3 em testes para Desarmar ou para evitar ser desarmado.",
        requisito: ""
    },
    {
        nome: "Aproximação Instintiva",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Quando um inimigo termina o turno a uma distância de até metade do seu movimento, você pode (Ação Livre) se mover até ele sem gerar ataques de oportunidade. Pode gastar 2 Estamina para realizar uma manobra se chegar no alcance.",
        requisito: ""
    },
    {
        nome: "Existência Imperceptível",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Recebe +2 em Furtividade. A penalidade por atacar ou fazer ações chamativas escondido é reduzida para apenas -4.",
        requisito: ""
    },
    {
        nome: "Finta Melhorada",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Use Destreza em vez de Presença para Enganação (Fintar). Acertar um inimigo desprevenido pela sua finta causa +1 dado de dano.",
        requisito: ""
    },
    {
        nome: "Golpe Impactante",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Uma vez por rodada, ao acertar um ataque corpo a corpo, você pode Empurrar o alvo como parte do ataque. Se o empurrão suceder, causa +Xd6 de dano (X = metade da sua Força).",
        requisito: ""
    },
    {
        nome: "Imitação",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Como Reação, copie uma habilidade marcial, manobra ou postura que viu. Deve usar no próximo turno. Pode tentar aprender permanentemente (Percepção CD 35, diminui em 2 por cópia). Se a técnica original custar PE, você paga em Estamina.",
        requisito: ""
    },
    {
        nome: "Manejo Superior",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "O dano de toda arma que manejar aumenta em um passo (nível) e você recebe bônus no dano igual ao seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Roubo de Habilidade",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Aprenda uma habilidade de Especialista ou Lutador (sem custo de Energia). Pode pegar esta habilidade um número de vezes igual ao seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Surto de Adrenalina",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Como Ação Livre (3 Estamina), ganhe por 1 rodada: RD a tudo igual a metade do nível; +1 e +metade do bônus de treino em Fortitude/Reflexos; bônus em Percepção igual ao bônus de treino. Manter custa +1 Estamina por rodada.",
        requisito: ""
    },
    {
        nome: "Valorizar Invocação",
        categoria: "Restringido",
        nivel: "2° NÍVEL",
        desc: "Se uma invocação em 3m for ser exorcizada, use Reação (1 Estamina) para receber o golpe por ela. Você ganha PV Temporários iguais ao seu nível de personagem ao fazer isso.",
        requisito: ""
    },
    {
        nome: "Esquiva Sobre-humana.",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Você recebe +1 em sua Defesa e em rolagens de Reflexos. No nível 9 e no nível 16, esse bônus aumenta em +1. Além disso, a partir do 10° nível, o valor necessário para obter um sucesso crítico nela reduz em um valor igual a metade do seu bônus de treinamento.",
        requisito: ""
    },
    {
        nome: "Implemento Celeste",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Você recebe +2 na CD de suas habilidades de restringido e técnicas marciais. Esse bônus aumenta em 1 nos níveis 8° e 16° de Restringido.",
        requisito: ""
    },
    {
        nome: "Ação Ágil",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Uma vez por turno, gaste 2 Estamina para receber uma Ação Ágil. Pode ser usada para: Andar, Desengajar ou Esconder.",
        requisito: ""
    },
    {
        nome: "Adrenalina Intensificadora",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Ao entrar em Surto de Adrenalina, pague +2 Estamina para distribuir +4 em Atletismo e Acrobacia. Pode pagar +1 Estamina para ganhar vantagem em um teste de cada perícia por cena. (Bônus vira +8 com Restrição Definitiva).",
        requisito: "Surto de Adrenalina"
    },
    {
        nome: "Caçador de Feiticeiros",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "No início da cena, gaste 2 Estamina: ganhe 2 RD, +1 em resistências/ataques e +1d6 de dano contra feiticeiros. A cada 5 níveis, pode pagar +2 Estamina para aumentar esses bônus proporcionalmente.",
        requisito: ""
    },
    {
        nome: "Desenvolver Ideias",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Você expande seu repertório marcial e recebe duas técnicas marciais adicionais imediatamente.",
        requisito: ""
    },
    {
        nome: "Foco no Inimigo",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Gaste 2 Estamina para marcar um foco: ganhe +2 no acerto, +1d6 de dano (escala até 1d12 no nível 16) e +5 em Percepção/Atenção contra ele. Se o foco morrer, use Reação para transferir em até 9m.",
        requisito: ""
    },
    {
        nome: "Ponto Cego",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Mover-se pelo espaço do inimigo não é terreno difícil. No espaço dele, você ganha Camuflagem Leve (20% falha). Nível 10: Se vencer a Atenção dele com Furtividade, ganha Camuflagem Total (40% falha).",
        requisito: ""
    },
    {
        nome: "Resiliência pela Adrenalina",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Durante o Surto, pague 1 Estamina para somar 2d3 em um teste de resistência. Se não for treinado e falhar, você pode rolar novamente.",
        requisito: "Surto de Adrenalina"
    },
    {
        nome: "Técnicas de Memorização",
        categoria: "Restringido",
        nivel: "4° NÍVEL",
        desc: "Você pode aprender uma habilidade adicional através da Imitação. Se possuir Imitação Perfeita, aprende mais uma.",
        requisito: "Imitação"
    },
    {
        nome: "Aprimoramento Celeste",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Você passa a somar metade do modificador do seu atributo chave na sua CD de Especialização.",
        requisito: ""
    },
    {
        nome: "Ataque Extra",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Ao realizar a ação Atacar, você pode gastar 2 Estamina para realizar dois ataques em vez de um.",
        requisito: ""
    },
    {
        nome: "Ataque Inconsequente Aprimorado",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "O bônus de dano do Ataque Inconsequente sobe para +10 e você recebe 2d6+4 PV Temporários ao usar a habilidade.",
        requisito: "Ataque Inconsequente"
    },
    {
        nome: "Corpo de Aço",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Seus PV máximos aumentam pelo valor da sua CON. Por 2 Estamina, você ganha cura acelerada de 2d8+CON por turno durante uma cena. Nível 10 e 15: pode pagar +1 Estamina para +1d8 de cura.",
        requisito: ""
    },
    {
        nome: "Corredor Fantasma",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Pode andar em paredes durante o movimento. Recebe +2 para reduzir dano de queda. Com Agilidade Exímia, pode correr em tetos.",
        requisito: ""
    },
    {
        nome: "Disparada Trovejante",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Ao sofrer um ataque corpo-a-corpo, use sua Reação (3 Estamina) para reduzir o dano à metade e se mover 4,5m para longe.",
        requisito: ""
    },
    {
        nome: "Frenesi",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Durante o Surto de Adrenalina, seus ataques causam +4 de dano (sobe para +8 no nível 12 e +12 no nível 16).",
        requisito: "Surto de Adrenalina"
    },
    {
        nome: "Movimento Reativo",
        categoria: "Restringido",
        nivel: "6° NÍVEL",
        desc: "Uma vez por rodada, se um oponente em alcance de movimento gerar um ataque de oportunidade, você pode (2 Estamina) se mover até ele como ação livre e usar sua reação para atacar.",
        requisito: ""
    },
    {
        nome: "Teste de Resistência Mestre",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Você se torna mestre nos dois Testes de Resistência conferidos por sua Especialização.",
        requisito: ""
    },
    {
        nome: "Ainda de Pé",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "1x por descanso, ao cair a 0 PV, cure 3d10 + nível. O dado aumenta nos níveis 12, 16 e 20. Se o dano for morte instantânea, você fica com 1 PV (mas cai com o próximo dano). Se morrer, você morre de pé.",
        requisito: ""
    },
    {
        nome: "Arremetida Encoberta",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Recebe vantagem no Ataque Furtivo da rodada. Se o acerto já estava garantido, o dano do Ataque Furtivo aumenta em +1 dado.",
        requisito: ""
    },
    {
        nome: "Barreira Inamovível",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Em testes de Fortitude, se o dado for menor que sua CON, gaste 2 Estamina para trocar o valor do dado pela sua CON. Você não pode ser movido à força e tem vantagem contra agarrar.",
        requisito: ""
    },
    {
        nome: "Força Imparável",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Em testes de Reflexos, se o dado for menor que sua DES, gaste 2 Estamina para trocar o valor do dado pela sua DES. Torna-se treinado em um TR e Mestre em outro que já possua.",
        requisito: ""
    },
    {
        nome: "Imitação Perfeita",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Pode copiar habilidades passivas e estilos de combate até o fim do próximo turno. Para aprender permanentemente, a CD é 40 (diminui em 2 por tentativa).",
        requisito: "Imitação"
    },
    {
        nome: "Presença Ameaçadora",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Gaste 1 Estamina: inimigos que te veem fazem TR de Vontade. Falha: Amedrontado (2 rodadas). Sucesso: Abalado. Limite: 1x por criatura na cena.",
        requisito: ""
    },
    {
        nome: "Reação Rápida",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Uma vez por rodada, se já tiver usado sua reação, gaste 2 Estamina para realizar uma reação adicional.",
        requisito: ""
    },
    {
        nome: "Respeito Celeste",
        categoria: "Restringido",
        nivel: "8° NÍVEL",
        desc: "Você recebe uma Dádiva do Céu adicional. Pode pegar esta habilidade novamente no nível 12.",
        requisito: ""
    },
    {
        nome: "Restrição Definitiva",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Seu nível de energia amaldiçoada alcançou o zero absoluto, rejeitando-a por completo em troca de um físico absoluto. Você recebe os seguintes benefícios: • Você tem vantagem em testes de furtividade contra qualquer usuário de energia amaldiçoada e eles possuem desvantagem em testes para o perceber. • Você passa a ver o traçado da alma (veja página 312), assim como não necessita mais de uma ferramenta amaldiçoada para enxergar maldições. • Toda arma que você manejar conta como um nível de dano acima e seu valor de deslocamento aumenta em 3 metros. • Se for mestre em uma perícia ou teste de resistência que utilize Força, Destreza ou Constituição você soma seu bônus de treinamento inteiro ao invés de metade dele na perícia. • Você se torna imune a expansões de domínio, veja a página 246.",
        requisito: ""
    },
    {
        nome: "Assassinar",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Na primeira rodada, seu primeiro ataque contra um alvo desprevenido (vindo de furtividade ou surpresa) é um crítico garantido.",
        requisito: ""
    },
    {
        nome: "Mente Limpa",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Você recebe vantagem em testes de resistência contra as condições: Amedrontado, Cego, Enfeitiçado e Surdo.",
        requisito: ""
    },
    {
        nome: "Perceber o Ar",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Imune a dano de queda (até o dobro do seu movimento). Pode realizar pulos duplos no ar (triplos no nível 13, quádruplos no 17). Como Reação (2 Estamina), pode tentar desviar de um ataque vencendo um teste de Acrobacia vs Reflexos do atacante.",
        requisito: ""
    },
    {
        nome: "Precisão Forçada",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Uma vez por rodada, ao fazer um ataque corpo-a-corpo, gaste 3 Estamina: se acertar, você causa o DANO MÁXIMO automaticamente, sem rolar dados.",
        requisito: ""
    },
    {
        nome: "Retaliação",
        categoria: "Restringido",
        nivel: "10° NÍVEL",
        desc: "Se receber dano de um inimigo em alcance, use sua Reação (2 Estamina) para realizar um ataque imediato contra ele.",
        requisito: ""
    },
    {
        nome: "Adrenalina Absoluta",
        categoria: "Restringido",
        nivel: "12° NÍVEL",
        desc: "Ao iniciar um Surto, você pode pagar 4 Estamina (e 2 para manter) para entrar no estado Absoluto: Seu Ataque Extra custa apenas 1 PE, você ganha +3m de Deslocamento e sua DEF aumenta em +2.",
        requisito: "Surto de Adrenalina"
    },
    {
        nome: "Pináculo Físico",
        categoria: "Restringido",
        nivel: "12° NÍVEL",
        desc: "Aumenta sua Estamina Máxima em +4. Escolha dois atributos (FOR, DES ou CON) para aumentar em +2. No nível 16, esses mesmos atributos aumentam em mais +2.",
        requisito: ""
    },
    {
        nome: "Rejeitar a Morte",
        categoria: "Restringido",
        nivel: "12° NÍVEL",
        desc: "Nas Portas da Morte, você pode aceitar uma falha automática para testar Fortitude (CD 15 + 1 a cada 3 de PV negativo). Se passar, volta a ter 1 PV e recebe 1 nível de Exaustão.",
        requisito: "Ainda de Pé"
    },
    {
        nome: "Entre as Sombras",
        categoria: "Restringido",
        nivel: "16° NÍVEL",
        desc: "O Ataque Furtivo agora aplica-se também em camuflagem ou cobertura. Você pode acumular uma vantagem adicional (3d20) no ataque. Se for um acerto garantido, a margem de crítico reduz em 2.",
        requisito: "Arremetida Encoberta"
    },
    {
        nome: "Instintos Aguçados",
        categoria: "Restringido",
        nivel: "16° NÍVEL",
        desc: "Enquanto sua Estamina e Vida estiverem acima de 50%, você recebe uma reação adicional por rodada (acumula com Reação Rápida).",
        requisito: "Reação Rápida"
    },
    {
        nome: "Mesmo Morto",
        categoria: "Restringido",
        nivel: "16° NÍVEL",
        desc: "Ao cair a 0 PV (sem 'Ainda de Pé'), você continua lutando normalmente. No fim de cada turno, teste Fortitude (CD 25 + 1 a cada 5 PV negativos). Se falhar, cai com 1 falha na morte.",
        requisito: "Rejeitar a Morte"
    },
    {
        nome: "Libertação do Destino",
        categoria: "Restringido",
        nivel: "16° NÍVEL",
        desc: "Subvertendo a sua restrição celeste, você se libertou completamente do destino, alcançando um nível de poder invejável e único para um ser humano como você. Você recebe resistência a todo tipo de dano físico (cortante, perfurante e de impacto), além de mais um tipo de dano a sua escolha, exceto na alma. Você também recebe +5 em rolagens de ataque e soma metade do seu nível de personagem no total de dano.",
        requisito: ""
    },
    {
        nome: "Afinidade com Técnica",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Você recebe um Feitiço adicional imediatamente. Nos níveis 5, 10, 15 e 20, você recebe mais um Feitiço adicional automaticamente.",
        requisito: ""
    },
    {
        nome: "Artesão Amaldiçoado",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Capaz de criar Ferramentas Amaldiçoadas (pág. 153). Torna-se treinado em Ofício (Ferreiro ou Canalizador). Se já for treinado em ambos, torna-se Mestre em um deles.",
        requisito: ""
    },
    {
        nome: "Ataque Infalível",
        categoria: "Talento",
        nivel: "Geral",
        desc: "1x por rodada, pode repetir a rolagem de dano de um ataque (armado ou desarmado), mantendo o novo resultado. Seus níveis de dano de arma não podem ser reduzidos.",
        requisito: ""
    },
    {
        nome: "Atenção Infalível",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Recebe +5 em Atenção. Você não pode ser surpreendido enquanto estiver consciente.",
        requisito: ""
    },
    {
        nome: "Dedicação Recompensadora",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta a quantidade de itens recebidos por Grau (não cumulativo). Ex: No 1º Grau recebe +2 itens de custo 3 e +1 de custo 4.",
        requisito: ""
    },
    {
        nome: "Favorecido pela Sorte",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Você tem 3 pontos de sorte por descanso longo. Gaste 1 ponto para rolar um d20 adicional e escolher o melhor resultado. Recupera 1 ponto se um inimigo tirar 20 natural contra você.",
        requisito: ""
    },
    {
        nome: "Guarda Infalível",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Em caso de Desastre num ataque, você não concede ataque de reação ao inimigo. Recebe +3 para resistir a efeitos que reduzam sua Defesa ou imponham penalidades em testes de resistência.",
        requisito: ""
    },
    {
        nome: "Incremento de Atributo",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta o valor e o limite de um atributo à sua escolha em 2. Pode ser pego várias vezes, mas apenas uma vez para cada atributo.",
        requisito: ""
    },
    {
        nome: "Investida Aprimorada",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Na Investida: +3m de movimento, bônus de acerto vira seu Bônus de Treinamento (em vez de +2). Se acertar, o alvo faz Atletismo contra o seu ou é Derrubado.",
        requisito: ""
    },
    {
        nome: "Mestre das Armas",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta FOR ou DES em 2. Além disso, escolha entre: Treino em 4 armas quaisquer OU acesso ao efeito de crítico de um grupo de armas.",
        requisito: ""
    },
    {
        nome: "Mestre Defensivo",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta FOR ou CON em 2 e ganha treino em Escudos. Se já for treinado, a RD do escudo aumenta em 50% (ex: Escudo Pesado vai de 6 para 9 RD).",
        requisito: ""
    },
    {
        nome: "Perceber Oportunidade",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Pode realizar até 2 Golpes de Oportunidade por rodada (ignora regra de repetição). Todos os seus golpes de oportunidade possuem Vantagem.",
        requisito: ""
    },
    {
        nome: "Provocação Desafiadora",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Alvos provocados devem realizar pelo menos um ataque contra você. Pode usar Provocar como Ação Livre um número de vezes igual a metade da sua Presença.",
        requisito: ""
    },
    {
        nome: "Resiliência Melhorada",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Escolha um TR (exceto Integridade): torna-se treinado (ou mestre, se já era treinado). O atributo desse TR aumenta em 1.",
        requisito: ""
    },
    {
        nome: "Saltador Constante",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Se pular e terminar perto de uma parede/objeto, pode pular de novo (ação livre, metade da distância). Se atacar após o pulo: +2 no acerto e +FOR no dano.",
        requisito: ""
    },
    {
        nome: "Técnicas Agressivas de Escudo",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Use Ação Bônus para Empurrar com o escudo. Se o alvo for empurrado, sofre Xd6+FOR de impacto (X = Mod. FOR). Você pode escolher empurrar +4,5m ou Derrubar o alvo.",
        requisito: ""
    },
    {
        nome: "Técnicas de Arremesso",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Com armas de arremesso, você recebe +2 no acerto e +3 no dano.",
        requisito: ""
    },
    {
        nome: "Técnicas de Reação Rápida",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Recebe +5 de Iniciativa. Se não for o primeiro na ordem após a rolagem, você pode rolar a iniciativa novamente e escolher o melhor resultado.",
        requisito: ""
    },
    {
        nome: "Técnicas Defensivas de Escudo",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Soma o bônus do escudo em TRs de Reflexos. (Usos = Bônus de Treino) Pode usar Reação para reduzir a margem de crítico de um TR de Reflexos em 3.",
        requisito: ""
    },
    {
        nome: "Tempestade de Ideias",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta um atributo em 1. Ganha treino em uma perícia e uma ferramenta. Escolha uma perícia treinada: ganha vantagem nela (usos = metade do treino por descanso curto).",
        requisito: ""
    },
    {
        nome: "Adepto de Medicina",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ganha o segundo efeito de 'Suporte em Combate'. A cura baseia-se no seu nível, mas a quantidade de usos é reduzida pela metade.",
        requisito: "Mestre em Medicina, máximo de 2 talentos 'Adepto'"
    },
    {
        nome: "Adepto de Briga",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ataque desarmado: +3 acerto e dano aumenta 2 níveis. Se o ataque não causar dano, pode Agarrar/Derrubar/Empurrar como ação livre (+metade do treino).",
        requisito: "Mestre em Atletismo, máximo de 2 talentos 'Adepto'"
    },
    {
        nome: "Adepto de Combate",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Você aprende um Estilo de Combate da especialização 'Especialista em Combate'. Considere seu Nível de Personagem para os efeitos do estilo.",
        requisito: "Mestre em Intuição, não possuir mais que dois talentos 'Adepto'"
    },
    {
        nome: "Adepto de Feitiçaria",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Recebe uma Mudança de Fundamento (exceto Técnica Rápida). Pode reduzir o custo da mudança em 1 PE uma quantidade de vezes igual ao bônus de treinamento por cena.",
        requisito: "Mestre em Feitiçaria, possuir Feitiços, não possuir mais que dois talentos 'Adepto'"
    },
    {
        nome: "Alma Inquebrável",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Torna-se treinado em Integridade. Recebe RD contra Dano na Alma igual a 1/4 do seu Nível de Personagem.",
        requisito: "Constituição 14"
    },
    {
        nome: "Apaziguador de Técnica",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ao ver inimigo usar técnica (Ação Comum ou +) em alcance corpo-a-corpo, use Reação para ataque de oportunidade. Se o alvo falhar na Concentração, o feitiço é penalizado ou anulado.",
        requisito: "Treinado em Astúcia, Nível 8"
    },
    {
        nome: "Aptidão Desenvolvida",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta o nível de uma Aptidão Amaldiçoada em 1. Pode ser pego múltiplas vezes, mas apenas uma vez para cada aptidão diferente.",
        requisito: "Nível 4"
    },
    {
        nome: "Determinado a Viver",
        categoria: "Talento",
        nivel: "Geral",
        desc: "1x por dia, ao chegar a 0 PV, pode ficar com 1 PV. Recebe vantagem em todos os testes de morte a partir do segundo.",
        requisito: "Treinado em Vontade, Constituição 16"
    },
    {
        nome: "Discurso Motivador",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Gaste 10 min (fora de combate) ou Ação Completa (em combate) para inspirar aliados: ganham PV Temporário = (Nível * 2) + [PRE * (Treino / 2)]. Limite: 1x por descanso.",
        requisito: "Treinado em perícia de Presença"
    },
    {
        nome: "Especialista em Concussão",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta FOR ou CON em 1. Dano de impacto corpo-a-corpo aumenta um nível. 1x por turno, ao causar dano de impacto, empurre o alvo 3m para espaço vazio.",
        requisito: "Nível 8"
    },
    {
        nome: "Especialista em Cortes",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta FOR ou DES em 1. Dano cortante corpo-a-corpo aumenta um nível. 1x por turno, ao causar dano cortante, reduza o movimento do alvo em 4,5m.",
        requisito: "Nível 8"
    },
    {
        nome: "Especialista em Perfuração",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Aumenta FOR ou DES em 1. Dano perfurante corpo-a-corpo aumenta um nível. 1x por turno, ao causar dano perfurante, pode rerrolar os dados de dano e usar o melhor total.",
        requisito: "Nível 8"
    },
    {
        nome: "Mestre da Criação",
        categoria: "Talento",
        nivel: "Geral",
        desc: "No interlúdio de Criação de Itens, cria +2 itens adicionais. Recebe +2 em duas perícias de Ofício à sua escolha.",
        requisito: "Treinado em dois Ofícios, Nível 4"
    },
    {
        nome: "Mestre do Arremesso",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Dano de armas de arremesso aumenta em um dado. Bônus de ataque vira +4 (acerto) e +6 (dano). Alcance aumenta em 6m.",
        requisito: "Técnicas de Arremesso, Nível 8"
    },
    {
        nome: "Mestre dos Chicotes",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ataques com chicote: +4 dano e +1,5m alcance. 1x por turno, se acertar, alvo faz TR Fortitude ou é puxado 3m em sua direção.",
        requisito: "Nível 5"
    },
    {
        nome: "Movimentos Acrobáticos",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ao ser derrubado/caído, faça Acrobacia vs Atletismo/CD da técnica. Se vencer, levanta como ação livre, move-se 3m (sem golpes de oportunidade) e recebe +metade da DES na DEF por 1 rodada.",
        requisito: "Treinado em Acrobacia"
    },
    {
        nome: "Robustez Aprimorada",
        categoria: "Talento",
        nivel: "Geral",
        desc: "PV máximo aumenta em valor igual ao seu nível. Cada novo nível dá +1 PV adicional. Recebe +2 em testes de Fortitude.",
        requisito: "Constituição 14"
    },
    {
        nome: "Técnicas de Empunhadura Dupla",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Recebe +1 na DEF com duas armas. Pode usar duas armas não-leves (desde que não sejam pesadas ou de duas mãos). Pode sacar duas armas gastando metade do movimento de Andar.",
        requisito: "Força ou Destreza 14"
    },
    {
        nome: "Técnicas de Mobilidade",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Movimento +3 metros. 1x por rodada, ao atacar, teste Reflexos vs Reflexos do alvo; se vencer, o alvo não pode realizar ataques de oportunidade contra você no turno.",
        requisito: "Destreza 14"
    },
    {
        nome: "Técnicas de Ocultamento",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Bônus em Furtividade igual ao seu Bônus de Treinamento. Ao deixar alvo Desprevenido por surpresa, o prejuízo aplica-se em TODOS os TRs (não apenas Reflexos).",
        requisito: "Treinado em Furtividade"
    },
    {
        nome: "Técnicas do Sentinela",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ataque de oportunidade bem-sucedido reduz movimento do alvo em 4,5m. Se inimigo a 1,5m atacar outro alvo, você pode usar Reação para atacá-lo.",
        requisito: "Nível 5"
    },
    {
        nome: "Wrestling",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Pode forçar teste de FOR vs FOR para manter agarrão. Pode soltar o alvo ao atacar para dar dano extra e deixá-lo Caído (sem teste) ou Arremessá-lo (3m * MOD FOR) causando dano de impacto.",
        requisito: "Nível 4"
    },
    {
        nome: "Voto Malevolente",
        categoria: "Talento",
        nivel: "Geral",
        desc: "Ao realizar Votos Emergenciais, o voto não precisa ter um malefício maior que o benefício, sendo realizado normalmente.",
        requisito: "Nível 12"
    },
    {
        nome: "Familiaridade com Técnica",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Redução de custo da Marca Registrada aumenta para 2 PE. Pode escolher feitiços Marca Registrada adicionais igual a metade do seu Bônus de Treinamento.",
        requisito: "Origem Inato, Nível 12"
    },
    {
        nome: "Manual de Técnica",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Cria feitiço 1 nível acima do máximo (custo +50%). Se já tiver Nível 5, recarga da Técnica Máxima reduz em 1 rodada.",
        requisito: "Origem Herdado, Treino em História ou Ocultismo, Nível 5"
    },
    {
        nome: "Expansão de Reserva",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Recuperar reserva vira Ação Livre e concede PE temporários. Uso passa a ser 1x por descanso longo.",
        requisito: "Origem Derivado, Nível 8"
    },
    {
        nome: "Quebra de Limites",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Aumenta dois atributos diferentes (exceto o maior) em +2 no valor e no limite.",
        requisito: "Origem Derivado, Nível 6"
    },
    {
        nome: "Físico Aperfeiçoado",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Escolha um: +4,5m Deslocamento; +2 Acrobacia/Atletismo; +3m em Empurrar; ou Saltos +50% de distância.",
        requisito: "Origem Feto Amaldiçoado Híbrido, Nível 6"
    },
    {
        nome: "Reposição Sanguínea",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Vigor Maldito pode ser usado como Ação Bônus ou Reação ao receber dano; cura aumenta em +5.",
        requisito: "Origem Feto Amaldiçoado Híbrido, Nível 6"
    },
    {
        nome: "Estudo Amaldiçoado",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Aumenta dois Níveis de Aptidão diferentes em +1.",
        requisito: "Origem Sem Técnica, Nível 8"
    },
    {
        nome: "Noção e Preparação",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Bônus de +2 em resistências contra Aptidões Amaldiçoadas. Aumenta em +1 nos níveis 8, 12 e 16.",
        requisito: "Origem Sem Técnica, Nível 4"
    },
        {
        nome: "Talento Natural",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Você recebe um Talento a sua escolha no 1° nível. Além disso, uma única vez a partir do 4° nível, você pode escolher receber um talento adicional a sua escolha ao subir de nível.",
        requisito: "Origem Inato"
    },
        {
        nome: "Marca Registrada",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Sendo capaz de usar sua Técncia de diferentes formas uma delas se destaca como a sua marca registrada. Você recebe um Feitiço adicional, o qual terá o seu custo reduzido em 1 PE.",
        requisito: "Origem Inato"
    },
    {
        nome: "Potencial Lendário",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Em todo nível par você recebe 1 ponto de energia amaldiçoada adicional. Além disso, você também recebe 1 Feitiço adicional no primeiro nível e mais um nos níveis 5, 10, 15 e 20.",
        requisito: "Origem Herdado Clã Gojo"
    },
    {
        nome: "Olhos de Cobra e Presas",
        categoria: "Origens",
        nivel: "Geral",
        desc: "uma quantidade de vezes igual ao seu bônus de treinamento, você pode dar o comando de uma ação bônus para um aliado, o qual pode a realizar como uma reação. Você recupera os usos dessa habilidade após um descanso longo.",
        requisito: "Origem Herdado Clã Inumaki"
    },
    {
        nome: "Valor do Sangue",
        categoria: "Origens",
        nivel: "Geral",
        desc: "Sempre que subir de nível, sua vida máxima aumenta em 1 ponto adicional. A partir do nível 10, você soma o seu modificador de Constituição ao seu total de vida.",
        requisito: "Origem Herdado Clã Kamo"
    },
        {
        nome: "Foco no Poder.",
        categoria: "Origens",
        nivel: "Geral",
        desc: "No primeiro nível, você pode escolher um Feitiço para ser um Feitiço Focado. Um Feitiço Focado pode: causar um dado de dano a mais, curar um dado de vida a mais, ter o dobro do alcance ou ter a dificuldade do teste para resistir aumentada em um valor igual ao seu bônus de treinamento. Nos níveis 5, 10, 15 e 20 você pode escolher outro Feitiço para ser um Feitiço Focado.",
        requisito: "Origem Herdado Clã Zenin"
    },
    {
    nome: "Energia Antinatural",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Sua energia deriva de uma fonte anormal e possui traços únicos. Você recebe uma Aptidão Amaldiçoada de Aura (deve atender aos requisitos). Além disso, possui uma reserva oculta: como uma Ação Bônus em combate, pode recuperar energia igual ao dobro do seu bônus de treinamento. Uso: 1x por dia.",
    requisito: "Origem Derivado"
},
{
    nome: "Desenvolvimento Inesperado",
    categoria: "Origens",
    nivel: "Geral",
    desc: "O seu desenvolvimento é imprevisível. A cada quatro níveis, você recebe um ponto de atributo adicional e aumenta o limite máximo desse atributo escolhido em 1.",
    requisito: "Origem Derivado"
},
{
    nome: "Físico Abençoado",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Seu físico é esculpido de maneira única. Seu Deslocamento aumenta em 3 metros, você se torna imune a doenças mundanas e recebe vantagem em testes de resistência contra venenos. Em descansos curtos, adiciona metade do seu bônus de treinamento à quantidade de dados curados. Além disso, recebe acesso à especialização Restringido.",
    requisito: "Origem Restringido"
},
{
    nome: "Ápice Corporal Humano",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Seu corpo pode alcançar o ápice humano. O limite para FOR, DES e CON passa a ser 30. A cada 6 níveis, escolha um desses atributos para receber +2. Sempre que realizar testes de Atletismo para erguer peso ou saltar, dobre o limite de peso ou a distância saltada.",
    requisito: "Origem Restringido"
},
{
    nome: "Resiliência Imediata",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Ao receber dano, você pode escolher reduzi-lo em (metade do nível * 5). Alternativamente, pode usar esta habilidade para evitar um desmembramento. Uso: Quantidade de vezes igual ao bônus de treinamento. Recuperação: Descanso longo.",
    requisito: "Origem Restringido"
},
{
    nome: "Herança Maldita",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Como híbrido, toda cura de energia reversa recebida é reduzida pela metade. Caso possua cura por energia reversa, você pode usá-la gastando 2 PE (Energia Amaldiçoada) em vez de 1 ponto de energia reversa para se curar pelo valor completo.",
    requisito: "Origem Feto Amaldiçoado"
},
{
    nome: "Físico Amaldiçoado",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Seu corpo possui propriedades especiais. Você recebe uma Característica de Anatomia no nível 1 e ganha uma nova característica adicional a cada 5 níveis, representando o desenvolvimento contínuo do seu corpo híbrido.",
    requisito: "Origem Feto Amaldiçoado"
},
{
    nome: "Vigor Maldito",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Como ação bônus, cure 5 + MOD. CON. Você ganha usos extras e +5 na cura base nos níveis 4, 8 e 12. É possível gastar múltiplos usos simultaneamente para aumentar a cura. Uso: 1x por descanso longo (inicialmente).",
    requisito: "Origem Feto Amaldiçoado"
},
{
    nome: "Forma de Vida Sintética",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Como forma de vida artificial, seu organismo funciona de modo único: você é imune a dano venenoso e à condição envenenado. No entanto, você não recebe benefícios de refeições nem de itens do tipo Medicina.",
    requisito: "Origem Corpo Mutante"
},
{
    nome: "Mutação Abrupta",
    categoria: "Origens",
    nivel: "Geral",
    desc: "Sua alma é dividida em diferentes núcleos e você produz sua própria energia. Você inicia com três núcleos, escolhendo um como Primário. Em combate, alternar o núcleo ativo custa uma Ação Bônus. (Veja regras detalhadas em Núcleos Múltiplos).",
    requisito: "Origem Corpo Mutante"
},
{
        nome: "Alma Maldita",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Sua alma é impregnada com energia amaldiçoada, assumindo um aspecto maldito e difícil de se alterar. Quando uma criatura for causar dano na sua alma, esse dano é reduzido à metade antes do teste de Integridade; a partir do nível 15, ele é anulado. Essa habilidade funciona 2 vezes por dia, 3 no nível 6, 4 no nível 12 e 5 no nível 18.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Anatomia Incompreensível",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "O seu corpo tem uma forma que é difícil de compreender. Você tem 25% de chance (resultado '1' em 1d4) de ignorar o dano adicional de um ataque crítico ou um ataque furtivo. No nível 15, se torna 50% (resultado '1 ou 2' em 1d4).",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Arma Natural",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Com uma fisionomia estranha, você possui garras, dentes afiados, cauda ou outro apêndice corporal próprio para ataques. Você recebe um ataque natural que causa 1d8 de dano Cortante, Perfurante ou de Impacto com os traços: Fineza e Enérgica. Esta arma natural conta como um ataque desarmado e se beneficia de efeitos que afetariam ataques desarmados. Caso seu dano desarmado seja superior ao da arma natural, ao invés disso aumente o seu dano desarmado em 1 nível.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Articulações Extensas",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Suas juntas são mais longas, ou suas garras são estendidas, aumentando a distância com que pode atacar. O alcance dos seus ataques corpo a corpo aumenta em 1,5 metros.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Braços Extras",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Seu corpo possui um par de braços adicionais. Você recebe +2 em testes de prestidigitação e, se tiver pelo menos duas mãos livres, aplica esse bônus em testes de atletismo. E recebe um par adicional de mãos, permitindo você equipar dois equipamentos de uma mão ou um equipamento de duas mãos adicional, assim como agarrar duas criaturas e outros benefícios à discrição do Narrador.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Capacidade de Voo",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "No seu corpo repousa uma capacidade de voo, que com um estímulo de energia se torna ativa. Como uma ação livre, você pode gastar 1 ponto de energia para transformar seu Deslocamento de Caminhada em Deslocamento de Voo por uma rodada.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Carapaça Mutante",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Uma carapaça cobre o seu corpo, sendo uma mutação bizarra, mas resistente. Você recebe redução de dano contra danos físicos igual ao seu bônus de treinamento; no nível 10, você recebe resistência a um tipo de dano físico à sua escolha. Depois de feita essa escolha não pode ser mudada.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Corpo Especializado",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Seu corpo se desenvolve de maneira a possuir um foco. Escolha uma perícia: você recebe um bônus de 1d4 nela.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Desenvolvimento Exagerado",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Seu corpo se desenvolve de maneira exagerada, ultrapassando o formato e o porte padrão. Você aumenta sua categoria de tamanho em 1 e recebe 1 ponto de vida adicional por nível.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Devorador de Energia",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Sendo envolvido com a própria energia, você pode a devorar quando resiste a uma habilidade originada dela. Quando passar em um teste de resistência para resistir a um Feitiço, você recebe 1 ponto de energia temporário cumulativo.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Instinto Sanguinário",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Em sua essência há um instinto por sangue e violência. Você adiciona o seu bônus de treinamento na sua Iniciativa; enquanto em uma cena de combate, você também adiciona seu bônus de treinamento na sua Atenção.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Olhos Sombrios",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Seus olhos guardam escuridão, sendo sombrios por natureza e aguçados. Você recebe Visão no Escuro (p.297). Além disso, você se torna treinado em Percepção e recebe um bônus de +2 em rolagens com a perícia. No 12º nível você passa a ignorar completamente efeitos de escuridão Leve e Total.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Pernas Extras",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "No seu corpo cresce um par de pernas extras. Seu deslocamento aumenta em 4,5 metros e você passa a ignorar terreno difícil que esteja no solo.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Presença Nefasta",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "Com um semblante vil, a sua própria presença é nefasta. Toda criatura hostil, ao vê-lo pela primeira vez, deve realizar um teste de resistência de Vontade contra sua CD Amaldiçoada. Em uma falha, ela fica amedrontada por uma rodada. Em um sucesso, ela consegue lidar parcialmente com a sua presença, ficando abalada por uma rodada.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    },
    {
        nome: "Sangue Tóxico",
        categoria: "Anatomia",
        nivel: "Geral",
        desc: "O seu sangue é tóxico, capaz de corroer o que entra em contato com. Sempre que sofrer dano de um ataque corpo a corpo, o atacante perde vida igual ao seu modificador de Constituição.",
        requisito: "Feto Amaldiçoado ou Corpo Amaldiçoado"
    }
    

];

let minhasHabilidades = [];

// 2. FUNÇÕES DO COMPÊNDIO (MODAL)
window.abrirCompendio = function() {
    const modal = document.getElementById('modal-biblioteca-hab');
    if (modal) {
        modal.style.display = 'flex';
        
        // Procure o botão que tem o texto "Talento" ou "Talentos"
        const btnTalento = Array.from(document.querySelectorAll('.tab-premium'))
                                .find(btn => btn.innerText.trim() === 'Talento');

        if (btnTalento) {
            filtrarCompendio('Talento', btnTalento);
        } else {
            // Caso não ache o botão de Talento, abre no primeiro botão da lista
            const primeiroBtn = document.querySelector('.tab-premium');
            if (primeiroBtn) filtrarCompendio(primeiroBtn.innerText.trim(), primeiroBtn);
        }
    }
};
window.fecharModalHabilidades = function() {
    const modal = document.getElementById('modal-biblioteca-hab');
    if (modal) modal.style.display = 'none';
};

// Variáveis de controle globais
let categoriaAtiva = 'Todos';
let nivelAtivo = 'Todos';

window.filtrarCompendio = function(categoria, botao) {
    // 1. Atualizar visual das abas principais
    document.querySelectorAll('.tab-premium').forEach(aba => aba.classList.remove('active'));
    botao.classList.add('active');

    categoriaAtiva = categoria;
    nivelAtivo = 'Todos';

    // 2. LISTA PERMITIDA (Só aparece nestas categorias)
    // O texto deve ser IDENTICO ao que você passa no onclick do HTML
    const exibirNiveisApenasEm = [
        'Lutador', 
        'Especialista em Combate', 
        'Especialista em Técnica', 
        'Controlador', 
        'Suporte', 
        'Restringido'
    ];

    const containerNiveis = document.getElementById('sub-filtros-niveis');
    
    // Se a categoria clicada estiver na lista permitida, mostra. Se não, esconde.
    if (exibirNiveisApenasEm.includes(categoria)) {
        containerNiveis.style.setProperty('display', 'grid', 'important');
    } else {
        containerNiveis.style.setProperty('display', 'none', 'important');
    }

    // 3. Resetar botões de sub-nível visualmente
    document.querySelectorAll('.sub-tab-premium').forEach(sub => sub.classList.remove('active'));
    const btnTodosNivel = document.querySelector('.sub-tab-premium');
    if(btnTodosNivel) btnTodosNivel.classList.add('active');

    renderizarCompendioFiltrado();
};

// Ajuste a função de toggle para aceitar o ID em String
// Função de toggle atualizada para IDs de texto
window.toggleHabCompendio = function(id) {
    const card = document.getElementById(`item-cp-${id}`);
    if (card) {
        card.classList.toggle('open');
    }
};

// Nova função para filtrar por nível
window.filtrarPorNivel = function(nivel, botao) {
    nivelAtivo = nivel;
    document.querySelectorAll('.sub-tab-premium').forEach(sub => sub.classList.remove('active'));
    botao.classList.add('active');
    renderizarCompendioFiltrado();
};

function renderizarCompendioFiltrado() {
    const container = document.getElementById('conteudo-biblioteca');
    if (!container) return;
    container.innerHTML = ''; 

    const filtradas = compendioHabilidades.filter(h => {
        const bateCategoria = (categoriaAtiva === 'Todos' || h.categoria === categoriaAtiva);
        const bateNivel = (nivelAtivo === 'Todos' || h.nivel === nivelAtivo);
        return bateCategoria && bateNivel;
    });

    filtradas.forEach((hab) => {
        // Criamos um ID limpo (sem espaços) para o HTML
        const idLimpo = hab.nome.replace(/\s+/g, '-').toLowerCase();

        container.innerHTML += `
            <div class="hab-card-compendio" id="item-cp-${idLimpo}">
                <div class="hab-header-compendio" onclick="toggleHabCompendio('${idLimpo}')">
                    <div class="hab-title-compendio">
                        <i class="fas fa-chevron-right hab-arrow-compendio"></i>
                        <span>${hab.nome}</span>
                    </div>
                    <button class="btn-add-bib" onclick="event.stopPropagation(); adicionarHabilidadeDireto('${hab.nome}', '${hab.desc.replace(/'/g, "\\'")}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="hab-body-compendio">
                    <div class="hab-inner-compendio">
                        <div class="hab-desc-text">${hab.desc}</div>
                        ${hab.requisito ? `<div class="hab-req-text"><strong>Pré-requisito:</strong> ${hab.requisito}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
}

// 3. LOGICA DE ADICIONAR E SALVAR
window.adicionarHabilidadeDireto = function(nome, desc) {
    const jaExiste = minhasHabilidades.some(h => h.nome === nome);
    if (jaExiste) {
        alert("Você já possui esta técnica!");
        return;
    }

    minhasHabilidades.push({ nome, desc });
    salvarHabilidadesNoPersonagem();
    renderizarListaFicha();
    fecharModalHabilidades();
};

window.salvarHabilidadesNoPersonagem = function() {
    let dados = JSON.parse(localStorage.getItem('personagem_atual')) || {};
    dados.habilidades_lista = minhasHabilidades;
    localStorage.setItem('personagem_atual', JSON.stringify(dados));
    if (typeof atualizarTudo === 'function') atualizarTudo();
};

// 4. RENDERIZAÇÃO NA FICHA (FORA DO MODAL)
window.renderizarListaFicha = function() {
    const lista = document.getElementById('lista-minhas-habilidades');
    
    if (!lista) {
        console.error("ERRO CRÍTICO: O elemento 'lista-minhas-habilidades' não existe na página!");
        return;
    }

    // Log para depuração
    console.log("Estado atual da Array 'minhasHabilidades':", minhasHabilidades);

    if (!minhasHabilidades || minhasHabilidades.length === 0) {
        lista.innerHTML = '<p style="color: #666; text-align: center;">Nenhuma habilidade selecionada.</p>';
        return;
    }

    let conteudoHTML = '';

    minhasHabilidades.forEach((hab, i) => {
        conteudoHTML += `
            <div class="habilidade-card" onclick="toggleHabilidade(this)" style="cursor:pointer; margin-bottom: 5px; background: rgba(20, 20, 25, 0.8); border-left: 3px solid #ff0000; padding: 8px;">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i class="fas fa-chevron-right arrow-icon" style="color:#ff0000; font-size:0.7rem;"></i>
                        <span style="color:#fff; font-size:0.8rem; font-weight:bold; text-transform:uppercase;">${hab.nome}</span>
                    </div>
                    <span style="font-size: 0.6rem; color: #555;">${hab.categoria}</span>
                </div>
                
                <div class="habilidade-desc-container" style="display:none; margin-top:5px; border-top:1px solid #222; padding-top:5px;">
                    <p style="color:#bbb; font-size:0.75rem; line-height:1.4;">${hab.desc}</p>
                    <div style="display:flex; justify-content:flex-end; margin-top:5px;">
                        <button onclick="event.stopPropagation(); removerHab(${i})" style="background:none; border:1px solid #ff0000; color:#ff0000; padding:2px 5px; font-size:0.6rem; border-radius:2px;">REMOVER</button>
                    </div>
                </div>
            </div>
        `;
    });

    lista.innerHTML = conteudoHTML;
};

window.toggleHabilidade = function(elemento) {
    const desc = elemento.querySelector('.habilidade-desc-container');
    const seta = elemento.querySelector('.arrow-icon');
    
    if (desc) {
        // Verifica se está escondido ou não
        const estaEscondido = desc.style.display === 'none' || desc.style.display === '';
        
        desc.style.display = estaEscondido ? 'block' : 'none';
        
        if (seta) {
            seta.style.transform = estaEscondido ? 'rotate(90deg)' : 'rotate(0deg)';
            seta.style.transition = "transform 0.2s";
        }
    }
};

window.removerHab = function(index) {
    minhasHabilidades.splice(index, 1);
    salvarHabilidadesNoPersonagem();
    renderizarListaFicha();
};

window.salvarHabilidadeManual = function() {
    const nome = document.getElementById('manual-hab-nome').value.trim();
    const desc = document.getElementById('manual-hab-desc').value.trim();
    if (nome && desc) {
        minhasHabilidades.push({ nome, desc });
        salvarHabilidadesNoPersonagem();
        renderizarListaFicha();
        document.getElementById('modal-nova-hab-manual').style.display = 'none';
    }
};

window.buscarNoCompendio = function() {
    const termo = document.getElementById('input-busca-compendio').value.toLowerCase();
    const cards = document.querySelectorAll('.hab-card-compendio');
    
    cards.forEach(card => {
        // Busca o nome dentro do card gerado
        const nome = card.querySelector('.hab-title-compendio span').innerText.toLowerCase();
        
        // Exibe apenas se o nome bater com a busca
        if (nome.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
};

function atualizarBarrasVisuais() {
    // Adicionei 'preparo' na lista abaixo
    const status = ['pv', 'pe', 'pi', 'preparo', 'estamina'];
    
    status.forEach(s => {
        const atual = parseFloat(document.getElementById(`${s}-atual`)?.value) || 0;
        const max = parseFloat(document.getElementById(`${s}-max`)?.value) || 1;
        const fill = document.getElementById(`bar-${s}-fill`);
        
        if (fill) {
            let porcentagem = (atual / max) * 100;
            porcentagem = Math.max(0, Math.min(porcentagem, 100));
            fill.style.width = porcentagem + "%";
            
            // Lógica de perigo apenas para Vida (PV)
            if (s === 'pv' && porcentagem < 25) {
                fill.classList.add('pulse-danger'); 
            } else {
                fill.classList.remove('pulse-danger');
            }
        }
    });
}
// =========================================================
// 5. SISTEMA DE ESPECIALIZAÇÕES E HABILIDADES AUTOMÁTICAS
// =========================================================

window.verificarHabilidadesDeClasse = function() {
    const especializacaoView = document.getElementById('view-especializacao');
    if (!especializacaoView) return;

    const especializacao = especializacaoView.innerText.trim().toLowerCase();
    let novasHabilidades = [];

    if (especializacao.includes('lutador')) {

        novasHabilidades.push({
            nome: "Corpo Treinado",
            categoria: "Lutador",
            nivel: "1º Nível",
            desc: "Você treinou o seu corpo para que ele seja sua própria arma. Recebe as seguintes capacidades:\n• Quando realizar um ataque desarmado ou com arma marcial, pode realizar um ataque desarmado como ação bônus.\n• Dano desarmado se torna 1d8 (aumenta em níveis superiores).\n• Pode usar Força ou Destreza para ataques desarmados e armas marciais."
        });
        novasHabilidades.push({
            nome: "Empolgação",
            categoria: "Lutador",
            nivel: "1º Nível",
            desc: "Uma boa luta é empolgante e te motiva a se arriscar mais e mais, permitindo movimentos mais fortes e únicos.\n• Começa o combate com Nível de Empolgação 1.\n• Se acertar pelo menos um ataque ou manobra (agarrar, empurrar, etc.) durante seu turno, no começo do próximo turno você sobe um nível de empolgação, até um máximo de 5 níveis.\n• Cada manobra especial pode ser usada apenas uma vez por rodada.\n• Caso passe uma rodada sem acertar um ataque, você desce um nível de empolgação.\n• As manobras especiais são fortalecidas pelo Dado de Empolgação, cujo valor varia com o nível.\n• Você aprende duas das manobras inicialmente, podendo aprender outras nos níveis 6, 12 e 18."
        });
    } 
    else if (especializacao.includes('especialista em combate')) {

        novasHabilidades.push({
            nome: "Repertório do Especialista",
            categoria: "Especialista em Combate",
            nivel: "1º Nível",
            desc: "Como um Especialista em Combate, você pode escolher um estilo principal para seguir em sua especialização. No primeiro nível, você recebe um dos estilos de combate. Você recebe um novo estilo de combate no nível 6 e outro no 12, complementando suas capacidades dentro de combate."
        });

        novasHabilidades.push({
            nome: "Artes do Combate",
            categoria: "Especialista em Combate",
            nivel: "1º Nível",
            desc: "Levando o combate como uma arte a se estudar e aperfeiçoar, você sabe como se preparar e usar desse preparo para o possibilitar realizar ações especiais dentro de um combate. Você recebe uma quantidade de Pontos de Preparo igual ao seu nível de Especialista em Combate + Modificador de Sabedoria, os quais são usados para realizar artes de combate. Você sabe as seguintes artes de combate:"
        });

    }
    else if (especializacao.includes('especialista em técnica') || especializacao.includes('especialista em tecnica')) {

        novasHabilidades.push({
            nome: "Domínio dos Fundamentos",
            categoria: "Especialista em Técnica",
            nivel: "1º Nível",
            desc: "Como um especialista em técnicas, você tem uma maior dominância sobre os fundamentos da energia amaldiçoada e das suas habilidades. Você aprende duas das Mudanças de Fundamento abaixo no primeiro nível e uma adicional no nível 12."
        });

    } 
    else if (especializacao.includes('controlador')) {

        novasHabilidades.push({
            nome: "Treinamento em Controle",
            categoria: "Controlador",
            nivel: "1º Nível",
            desc: "Você ganha maior controle sobre Invocações: começa com duas Invocações e recebe adicionais nos níveis 3, 6, 9, 10, 12, 15 e 18. O número de Invocações ativas em campo aumenta em 1, e a quantidade de comandos também aumenta."
        });

    } 
    else if (especializacao.includes('suporte')) {

        novasHabilidades.push({
            nome: "Suporte em Combate",
            categoria: "Suporte",
            nivel: "1º Nível",
            desc: "O suporte pode auxiliar usando Apoiar como ação bônus. Também pode curar uma criatura em alcance de toque como ação bônus (2d6 + mod Presença ou Sabedoria), um número de vezes igual a esse mod por descanso."
        });

    } 
    else if (especializacao.includes('restringido')) {

        novasHabilidades.push({
            nome: "Restrito pelos Céus",
            categoria: "Restringido",
            nivel: "1º Nível",
            desc: "Compensa a falta de energia amaldiçoada com benefícios: adiciona mod Força ou Constituição na Defesa, começa com ferramenta de 4° grau, vê maldições e acessa o Arsenal Amaldiçoado no 2° nível."
        });

    }

    // 🔥 Adiciona apenas as que ainda não existem
    if (novasHabilidades.length > 0) {

        let adicionou = false;

        novasHabilidades.forEach(hab => {
            const jaPossui = minhasHabilidades.some(h => h.nome === hab.nome);
            if (!jaPossui) {
                minhasHabilidades.push(hab);
                console.log(`Habilidade ${hab.nome} adicionada com sucesso!`);
                adicionou = true;
            }
        });

        if (adicionou) {
            salvarHabilidadesNoPersonagem();
            renderizarListaFicha();
        }
    }
};

window.verificarHabilidadesDeOrigem = function() {
    const origemElemento = document.getElementById('view-origem');
    if (!origemElemento) return;

    // O .toLowerCase() faz "Derivado" virar "derivado", evitando erros de digitação
    const origemNome = origemElemento.innerText.trim().toLowerCase();
    
    let novasHabilidades = [];

    // Limpa apenas habilidades de origem para não duplicar
    minhasHabilidades = minhasHabilidades.filter(hab => hab.categoria !== "Origens");

    // --- LOGICA DE COMPARAÇÃO ---
    if (origemNome === "inato") {
        novasHabilidades.push(
            { nome: "Talento Natural", categoria: "Origens", nivel: "Geral", desc: "Você recebe um Talento a sua escolha no 1° nível. Além disso, uma única vez a partir do 4° nível, você pode escolher receber um talento adicional a sua escolha ao subir de nível.", requisito: "Inato" },
            { nome: "Marca Registrada", categoria: "Origens", nivel: "Geral", desc: "Sua técnica é inata e exclusiva para si, o que o torna naturalmente mais familiar com ela. Sendo capaz de usá-la de diferentes formas, uma delas se destaca como a sua marca registrada. Você recebe um Feitiço adicional, o qual terá o seu custo reduzido em 1 PE.", requisito: "Inato" }
        );
    } 
    else if (origemNome === "derivado") {
        novasHabilidades.push(
            { nome: "Energia Antinatural", categoria: "Origens", nivel: "Geral", desc: "Você recebe uma Aptidão Amaldiçoada deAura, a qual você deve atender os requisitos. Além disso, você possui uma pequena reserva oculta de energia no seu âmago, da qual pode extrair quando necessário: como uma Ação Bônus, dentro de combate, você pode recuperar um valor de energia amaldiçoada igual ao dobro do seu bônus de treinamento. Você pode usar essa característica uma vez por dia.", requisito: "Derivado" },
            { nome: "Desenvolvimento Inesperado", categoria: "Origens", nivel: "Geral", desc: "O desenvolvimento de um Derivado é inesperado, podendo surpreender e ir além do esperado. A cada quatro níveis, você recebe um ponto de atributo adicional e aumenta seu limite de atributo para o atributo escolhido em 1.", requisito: "Derivado" }
        );
    } 
else if (origemNome === "restringido") {
        novasHabilidades.push(
            { 
                nome: "Físico Abençoado", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Seu físico é esculpido de maneira única, potencializando suas capacidades. Seu Deslocamento aumenta em 3 metros, você se torna imune a doenças mundanas e recebe vantagem em testes de resistência contra venenos, em um descanso curto você adiciona metade do seu bônus de treinamento à quantidade de dados curados. Além disso, você recebe acesso a especialização Restringido.", 
                requisito: "Restringido" 
            },
            { 
                nome: "Ápice Corporal Humano", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Seu corpo tem um potencial extraordinário, sendo capaz de alcançar o ápice das capacidades físicas humanas. Seu limite de atributo para Força, Destreza e Constituição é 30 ao invés de 20. Além disso, a cada 6 níveis, escolha um desses atributos para receber +2 em seu valor. Sempre que realizar um teste de Atletismo para erguer peso ou saltar distâncias, dobre o limite de peso ou a distância saltada.", 
                requisito: "Restringido" 
            },
            { 
                nome: "Resiliência Imediata", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Seu corpo é mais resistente do que o padrão humano, permitindo-o encarar a dor facilmente. Uma quantidade de vezes igual ao seu bônus de treinamento, ao receber dano, você pode escolher reduzir esse dano em um valor igual à metade do seu nível (mínimo 1) multiplicado por 5. Alternativamente, você pode escolher gastar um uso dessa habilidade para evitar um desmembramento. Você recupera os usos após um descanso longo.", 
                requisito: "Restringido" 
            }
        );
    }
    else if (origemNome.includes("feto amaldiçoado")) {
        novasHabilidades.push(
            { 
                nome: "Herança Maldita", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Como um híbrido entre humano e maldição, você carrega uma herança amaldiçoada. Toda cura que você receber provinda de energia reversa é reduzida pela metade. Caso obtenha uma habilidade de energia reversa de cura, você pode a utilizar tratando a energia reversa como energia amaldiçoada, curando-se o valor completo. Ao invés de 1 ponto de energia reversa, você gasta diretamente 2 pontos de energia amaldiçoada.", 
                requisito: "Feto Amaldiçoado" 
            },
            { 
                nome: "Físico Amaldiçoado", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Sendo meio maldição, o seu físico é único, desenvolvendo um corpo com propriedades especiais. Você recebe uma Característica de Anatomia, entre as listadas na próxima página. A cada 5 níveis, seu corpo desenvolve mais, dando-o outra característica de anatomia.", 
                requisito: "Feto Amaldiçoado" 
            },
            { 
                nome: "Vigor Maldito", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Você pode, uma vez por descanso longo, usar uma ação bônus para recuperar uma quantidade de pontos de vida igual a 5 + seu mod. de constituição. Nos níveis 4, 8, e 12 você recebe um uso adicional desta característica, assim como o valor base da cura aumenta em 5. Caso possua mais de um uso, você pode escolher gastar mais usos simultaneamente, aumentando a cura.", 
                requisito: "Feto Amaldiçoado" 
            }
        );
    }
    else if (origemNome.includes("corpo amaldiçoado")) {
        novasHabilidades.push(
            { 
                nome: "Forma de Vida Sintética", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Você é uma forma de vida artificial, o que afeta grandemente o funcionamento de seu corpo e organismo: você é imune a dano venenoso e a condição envenenado, mas você não recebe os efeitos de refeições nem de itens do tipo Medicina.", 
                requisito: "Corpo Amaldiçoado" 
            },
            { 
                nome: "Mutação Abrupta", 
                categoria: "Origens", 
                nivel: "Geral", 
                desc: "Como um corpo amaldiçoado, você passou por uma abrupta mutação que o concedeu a capacidade de produzir energia amaldiçoada por si mesmo, ser consciente e ter a essência da sua alma dividida em diferentes núcleos. Você inicia com três núcleos, sendo necessário escolher um deles como seu Núcleo Primário. Dentro de combate, alternar o núcleo ativo é uma Ação Bônus. Criar, desenvolver e utilizar os núcleos possui vários detalhes, os quais estão explicados na próxima página, em Núcleos Múltiplos.", 
                requisito: "Corpo Amaldiçoado" 
            }
        );
    }
    else if (origemNome === "gojo") {
        novasHabilidades.push({
            nome: "Potencial Lendário",
            categoria: "Origens",
            nivel: "Geral",
            desc: "Em todo nível par você recebe 1 ponto de energia amaldiçoada adicional. Além disso, você também recebe 1 Feitiço adicional no primeiro nível e mais um nos níveis 5, 10, 15 e 20.",
            requisito: "Clã Gojo"
        });
    }
    else if (origemNome === "inumaki") {
        novasHabilidades.push({
            nome: "Olhos de Cobra e Presas",
            categoria: "Origens",
            nivel: "Geral",
            desc: "uma quantidade de vezes igual ao seu bônus de treinamento, você pode dar o comando de uma ação bônus para um aliado, o qual pode a realizar como uma reação. Você recupera os usos dessa habilidade após um descanso longo.",
            requisito: "Clã Inumaki"
        });
    }
        else if (origemNome === "kamo") {
        novasHabilidades.push({
            nome: "Valor do Sangue",
            categoria: "Origens",
            nivel: "Geral",
            desc: "Sempre que subir de nível, sua vida máxima aumenta em 1 ponto adicional. A partir do nível 10, você soma o seu modificador de Constituição ao seu total de vida. Caso, ao subir de nível, você role para aumentar a sua vida máxima e o valor obtido seja menor do que a média, você pode rolar novamente e ficar com o maior valor.",
            requisito: "Clã Kamo"
        });
    }
        else if (origemNome === "zenin") {
        novasHabilidades.push({
            nome: "Foco no Poder",
            categoria: "Origens",
            nivel: "Geral",
            desc: "No primeiro nível, você pode escolher um Feitiço para ser um Feitiço Focado. Um Feitiço Focado pode: causar um dado de dano a mais, curar um dado de vida a mais, ter o dobro do alcance ou ter a dificuldade do teste para resistir aumentada em um valor igual ao seu bônus de treinamento. Nos níveis 5, 10, 15 e 20 você pode escolher outro Feitiço para ser um Feitiço Focado.",
            requisito: "Clã Zenin"
        });
    }


    if (novasHabilidades.length > 0) {
        novasHabilidades.forEach(hab => minhasHabilidades.push(hab));
        console.log("Habilidades adicionadas para:", origemNome);
    } else {
        console.warn("Nenhuma habilidade configurada para o nome:", origemNome);
    }
};

function gerenciarPaineisEspeciais() {
    const especializacaoView = document.getElementById('view-especializacao');
    const painelTecnica = document.getElementById('painel-especialista-tecnica');
    const painelLutador = document.getElementById('painel-lutador');

    if (!especializacaoView) return;

    const verificar = () => {
        const valor = especializacaoView.innerText.trim().toLowerCase();
        
        // 1. Mostrar/Esconder Painel do Especialista
        if (painelTecnica) {
            if (valor.includes('especialista em técnica') || valor.includes('especialista em tecnica')) {
                painelTecnica.style.setProperty('display', 'block', 'important');
            } else {
                painelTecnica.style.display = 'none';
            }
        }

        // 2. Mostrar/Esconder Painel do Lutador
        if (painelLutador) {
            if (valor.includes('lutador')) {
                painelLutador.style.setProperty('display', 'block', 'important');
            } else {
                painelLutador.style.display = 'none';
            }
        }

        // 3. Entregar as habilidades automáticas da classe escolhida
        if (typeof verificarHabilidadesDeClasse === 'function') {
            verificarHabilidadesDeClasse();
        }
    };

    verificar();

    // Vigia se a especialização for alterada na ficha
    const observer = new MutationObserver(verificar);
    observer.observe(especializacaoView, { childList: true, characterData: true, subtree: true });
}

// Inicializadores (Apenas UMA vez para evitar duplicidade)
document.addEventListener('DOMContentLoaded', gerenciarPaineisEspeciais);
window.addEventListener('load', gerenciarPaineisEspeciais);



// ===============================
//  COMPÊNDIO DE TÉCNICAS
// ===============================

let minhasTecnicas = [];

// -------------------------------
// ABRIR / FECHAR MODAL
// -------------------------------

window.abrirCompendioTec = function() {
    const modal = document.getElementById('modal-biblioteca-tecnica');
    if (modal) {
        modal.style.display = 'flex';

        const primeiroBtn = document.querySelector('#modal-biblioteca-tecnica .tab-premium');
        if (primeiroBtn) {
            filtrarCompendioTec(primeiroBtn.innerText.trim(), primeiroBtn);
        }
    }
};

window.fecharModalTec = function() {
    const modal = document.getElementById('modal-biblioteca-tecnica');
    if (modal) modal.style.display = 'none';
};


// -------------------------------
// CONTROLE DE FILTRO
// -------------------------------

let categoriaTecAtiva = 'Todos';
let nivelTecAtivo = 'Todos';

window.filtrarCompendioTec = function(categoria, botao) {

    document.querySelectorAll('#modal-biblioteca-tecnica .tab-premium')
        .forEach(aba => aba.classList.remove('active'));

    botao.classList.add('active');

    categoriaTecAtiva = categoria;
    nivelTecAtivo = 'Todos';

    document.querySelectorAll('#modal-biblioteca-tecnica .sub-tab-premium')
        .forEach(sub => sub.classList.remove('active'));

    const btnTodos = document.querySelector('#modal-biblioteca-tecnica .sub-tab-premium');
    if (btnTodos) btnTodos.classList.add('active');

    renderizarCompendioTecFiltrado();
};

window.filtrarNivelTec = function(nivel, botao) {
    nivelTecAtivo = nivel;

    document.querySelectorAll('#modal-biblioteca-tecnica .sub-tab-premium')
        .forEach(sub => sub.classList.remove('active'));

    botao.classList.add('active');

    renderizarCompendioTecFiltrado();
};


// -------------------------------
// TOGGLE CARD DO COMPÊNDIO
// -------------------------------

window.toggleTecCompendio = function(id) {
    const card = document.getElementById(`item-tec-${id}`);
    if (card) card.classList.toggle('open');
};


// -------------------------------
// RENDER DO COMPÊNDIO
// -------------------------------

function renderizarCompendioTecFiltrado() {

    const container = document.getElementById('conteudo-biblioteca-tecnica');
    if (!container) return;

    container.innerHTML = '';

    const filtradas = compendioTecnicas.filter(t => {
        const bateCategoria = (categoriaTecAtiva === 'Todos' || t.categoria === categoriaTecAtiva);
        const bateNivel = (
    nivelTecAtivo === 'Todos' ||
    Number(t.nivel) === Number(nivelTecAtivo)
);
        return bateCategoria && bateNivel;
    });

    filtradas.forEach((tec, index) => {

        const idLimpo = tec.nome.replace(/\s+/g, '-').toLowerCase();

        container.innerHTML += `
            <div class="hab-card-compendio" id="item-tec-${idLimpo}">
                <div class="hab-header-compendio" onclick="toggleTecCompendio('${idLimpo}')">
                    <div class="hab-title-compendio">
                        <i class="fas fa-chevron-right hab-arrow-compendio"></i>
                        <span>${tec.nome}</span>
                    </div>
                    <button class="btn-add-bib"
                        onclick="event.stopPropagation(); adicionarTecnicaDireto('${tec.nome}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="hab-body-compendio">
                    <div class="hab-inner-compendio">
                        <div class="hab-desc-text">${tec.desc}</div>
                        ${tec.requisito ? `<div class="hab-req-text"><strong>Pré-requisito:</strong> ${tec.requisito}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
}


// -------------------------------
// ADICIONAR TÉCNICA
// -------------------------------
window.adicionarTecnicaDireto = function(nome) {

    const tec = compendioTecnicas.find(t => t.nome === nome);
    if (!tec) return;

    if (minhasTecnicas.some(t => t.nome === nome)) {
        alert("Você já possui esta técnica!");
        return;
    }

    minhasTecnicas.push({
        nome: tec.nome,
        desc: tec.desc,
        nivel: tec.nivel   // 🔥 SALVA O NÍVEL
    });

    salvarTecnicasNoPersonagem();
renderizarListaTecnicas();
};
// -------------------------------
// SALVAR
// -------------------------------
window.salvarTecnicasNoPersonagem = function() {

    const personagemSalvo = localStorage.getItem('personagem_atual');
    if (!personagemSalvo) return;

    const dados = JSON.parse(personagemSalvo);

    // só atualiza técnicas
    dados.tecnicas_lista = minhasTecnicas;

    localStorage.setItem('personagem_atual', JSON.stringify(dados));
};

// -------------------------------
// RENDER NA FICHA
// -------------------------------

window.renderizarListaTecnicas = function() {

    const lista = document.getElementById('lista-tecnicas');
    if (!lista) return;

    if (minhasTecnicas.length === 0) {
        lista.innerHTML = '<p style="color:#666;text-align:center;">Nenhuma técnica.</p>';
        return;
    }

    lista.innerHTML = '';

    minhasTecnicas.forEach((tec, i) => {

        const custo = custoPorNivel[tec.nivel] ?? 0;

        lista.innerHTML += `
            <div class="habilidade-card" onclick="toggleTecnica(this)" style="cursor:pointer;">

                <div class="habilidade-header-content" 
                     style="display:flex; justify-content:space-between; align-items:center;">

                    <!-- ESQUERDA -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <i class="fas fa-chevron-right arrow-icon" 
                           style="color:#ff0000; font-size:0.7rem;"></i>

                        <span style="
                            color:#fff; 
                            font-size:0.85rem; 
                            font-weight:bold; 
                            text-transform:uppercase;">
                            ${tec.nome}
                        </span>

                        <span style="
                            color:#00ffd5;
                            font-size:0.75rem;
                            font-weight:bold;
                        ">
                            (${custo} PE)
                        </span>
                    </div>

                    <!-- DIREITA -->
                    <span style="
                        background:#ff0000;
                        color:#fff;
                        padding:2px 8px;
                        border-radius:6px;
                        font-size:0.65rem;
                        font-weight:bold;
                    ">
                        NÍVEL ${tec.nivel}
                    </span>

                </div>

                <div class="habilidade-desc-container" 
                     style="display:none; margin-top:8px; border-top:1px solid #333; padding-top:8px;">
                    
                    <p style="color:#ccc; font-size:0.8rem; line-height:1.4; margin:0;">
                        ${tec.desc}
                    </p>

                    <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                        <button onclick="event.stopPropagation(); removerTecnica(${i})"
                            style="background:none; border:1px solid #ff2f92; color:#ff2f92; padding:2px 6px; font-size:0.65rem; border-radius:3px;">
                            REMOVER
                        </button>
                    </div>

                </div>

            </div>
        `;
    });
};


// -------------------------------
// TOGGLE FICHA
// -------------------------------

window.toggleTecnica = function(elemento) {

    const desc = elemento.querySelector('.habilidade-desc-container');
    const seta = elemento.querySelector('.arrow-icon');

    const estaEscondido = desc.style.display === 'none' || desc.style.display === '';

    desc.style.display = estaEscondido ? 'block' : 'none';

    if (seta) {
        seta.style.transform = estaEscondido ? 'rotate(90deg)' : 'rotate(0deg)';
        seta.style.transition = "transform 0.2s";
    }
};


// -------------------------------
// REMOVER
// -------------------------------

window.removerTecnica = function(index) {
    minhasTecnicas.splice(index, 1);
    salvarTecnicasNoPersonagem();
    renderizarListaTecnicas();
};


// -------------------------------
// SALVAR MANUAL
// -------------------------------

window.salvarTecManual = function() {

    const nome = document.getElementById('nome-tecnica').value.trim();
    const desc = document.getElementById('desc-tecnica').value.trim();

    if (nome && desc) {
        minhasTecnicas.push({ nome, desc });

        salvarTecnicasNoPersonagem();
        renderizarListaTecnicas();

        document.getElementById('modal-nova-tecnica').style.display = 'none';
    }
};


// -------------------------------
// BUSCA
// -------------------------------

window.buscarTecCompendio = function() {

    const termo = document.getElementById('busca-tecnica').value.toLowerCase();
    const cards = document.querySelectorAll('#modal-biblioteca-tecnica .hab-card-compendio');

    cards.forEach(card => {
        const nome = card.querySelector('.hab-title-compendio span')
            .innerText.toLowerCase();

        card.style.display = nome.includes(termo) ? "block" : "none";
    });
};


function carregarTecnicasDoPersonagem() {
    const salvas = localStorage.getItem("tecnicasPersonagem");
    if (salvas) {
        minhasTecnicas = JSON.parse(salvas);
    } else {
        minhasTecnicas = [];
    }
}

// =========================================================
// 6. AUTO SAVE GLOBAL UNIVERSAL
// =========================================================
document.addEventListener('change', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        if (typeof atualizarTudo === 'function') atualizarTudo();
    }
});

document.addEventListener('input', function(e) {
    if (e.target.classList.contains('input-status')) {
        if (typeof atualizarTudo === 'function') atualizarTudo();
    }
});

const descricoesOrigens = {
    // --- ORIGENS E CLÃS ---
    "INATO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-star"></i> ORIGEM: INATO
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    O Inato é a origem mais comum no mundo do Jujutsu, representando aqueles que 
                    nasceram com afinidade natural para usar energia amaldiçoada e com uma técnica própria. 
                    Essa técnica se manifesta em algum momento da infância, normalmente entre os cinco e seis anos, 
                    bastando ser treinada e aprimorada.
                    <br><br>
                    Por ser única, sua técnica é imprevisível e cheia de potencial para inovação. 
                    É comum que indivíduos inatos, ao despertarem suas habilidades, sejam levados ao 
                    Colégio de Jujutsu para receber treinamento adequado. 
                    Exemplos de inatos incluem Nobara Kugisaki e Kento Nanami.
                    <br><br>
                    Geralmente, uma pessoa possui apenas uma técnica inata, pois múltiplas técnicas 
                    poderiam sobrecarregar o cérebro. Devido à sua versatilidade e singularidade, 
                    o Inato combina bem com a maioria das especializações e conceitos de personagem.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 um atributo à sua escolha e +1 em outro atributo diferente.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">TALENTO NATURAL</span>
                        <p>
                            Sua afinidade com energia amaldiçoada é algo instintivo. 
                            Você recebe 1 Talento à sua escolha no 1º nível.
                            <br><br>
                            Além disso, uma única vez a partir do 4º nível, você pode escolher 
                            receber um Talento adicional ao subir de nível.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">MARCA REGISTRADA</span>
                    <p>
                        Sua técnica é inata e exclusiva, tornando você naturalmente mais 
                        familiarizado com ela. Entre as diferentes formas de utilizá-la, 
                        uma se destaca como sua assinatura.
                        <br><br>
                        Você recebe 1 Feitiço adicional, e o custo dele é reduzido em -1 PE.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

"KAMO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-tint"></i> CLÃ KAMO (HERDADO)
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    O Clã Kamo valoriza profundamente os laços de sangue, considerando a herança 
                    de sua técnica o maior símbolo de prestígio. Sua técnica herdada é a 
                    Manipulação de Sangue, dominada pelo membro de maior destaque do clã, 
                    Noritoshi Kamo. Admirada por seu equilíbrio e versatilidade, essa técnica 
                    é especialmente valorizada por aqueles que compreendem o verdadeiro poder do sangue.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 a Constituição ou Sabedoria, e +1 no atributo que não foi escolhido.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">TREINAMENTOS DE CLÃ</span>
                        <p>
                            Você se torna treinado em 2 perícias entre Atletismo, Medicina e Persuasão. 
                            Alternativamente, pode escolher se tornar especialista em apenas uma delas.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">VALOR DO SANGUE</span>
                    <p>
                        Os membros do Clã Kamo compreendem o verdadeiro valor do sangue, 
                        o que lhes concede maior vitalidade.
                        <br><br>
                        Sempre que você subir de nível, sua vida máxima aumenta em +1 ponto adicional.
                        <br><br>
                        A partir do nível 10, você adiciona também o seu modificador de Constituição 
                        ao seu total de vida.
                        <br><br>
                        Caso, ao subir de nível, você role para determinar o aumento da sua vida 
                        máxima e o resultado seja menor que a média do dado, você pode rolar novamente 
                        e ficar com o maior valor obtido.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

    "INUMAKI_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-comment-dots"></i> CLÃ INUMAKI (HERDADO)
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    O Clã Inumaki é uma das diversas famílias menores de feiticeiros. Embora não seja 
                    considerado um dos grandes clãs, sua técnica amaldiçoada, a Fala Amaldiçoada, é 
                    amplamente respeitada. Seus membros carregam o sigilo característico da família: 
                    marcas ao redor da boca que simbolizam olhos de cobra e presas. 
                    O membro de maior destaque é Toge Inumaki.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 a Inteligência ou Presença, e +1 no atributo que não foi escolhido.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">TREINAMENTOS DE CLÃ</span>
                        <p>
                            Você se torna treinado em 2 perícias entre Feitiçaria, Percepção e Intuição. 
                            Alternativamente, pode escolher se tornar especialista em apenas uma delas.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">OLHOS DE COBRA E PRESAS</span>
                    <p>
                        Os membros do Clã Inumaki possuem uma marca única ao redor da boca, 
                        no formato de olhos de cobra e presas. Essa marca canaliza a técnica 
                        herdada do clã, concedendo poder às palavras do usuário.
                        <br><br>
                        Um número de vezes igual ao seu bônus de treinamento, você pode usar 
                        uma ação bônus para comandar um aliado. O aliado pode executar esse 
                        comando como uma reação.
                        <br><br>
                        Você recupera todos os usos dessa habilidade após um descanso longo.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

    "ZENIN_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-fire"></i> CLÃ ZENIN (HERDADO)
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    O Clã Zenin representa todos os valores tradicionais de um grande clã, 
                    acreditando que técnicas amaldiçoadas poderosas estão acima de tudo. 
                    Essa mentalidade, no entanto, pode gerar conflitos com aqueles que não 
                    demonstram grande potencial. O clã possui diversas técnicas herdadas, 
                    mantendo sempre um alto nível de poder e versatilidade.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 um atributo à sua escolha e +1 em outro atributo diferente.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">TREINAMENTOS DE CLÃ</span>
                        <p>
                            Você se torna treinado em 2 perícias quaisquer. 
                            Alternativamente, pode escolher se tornar especialista em apenas uma delas.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">FOCO NO PODER</span>
                    <p>
                        O Clã Zenin dedica-se completamente ao aprimoramento de suas técnicas, 
                        elevando ao máximo seu potencial.
                        <br><br>
                        No 1º nível, você pode escolher um Feitiço para se tornar um 
                        <strong>Feitiço Focado</strong>. Um Feitiço Focado pode receber um dos seguintes benefícios:
                        <br>• Causar +1 dado de dano;
                        <br>• Curar +1 dado de vida;
                        <br>• Ter o alcance dobrado;
                        <br>• Aumentar a dificuldade do teste para resistir em um valor igual ao seu bônus de treinamento.
                        <br><br>
                        Nos níveis 5, 10, 15 e 20, você pode escolher outro Feitiço para se tornar um Feitiço Focado.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

    "GOJO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-eye"></i> CLÃ GOJO (HERDADO)
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    O Clã Gojo descende do lendário feiticeiro ancestral de Jujutsu, Michizane Sugawara, 
                    e possui como técnicas herdadas o Ilimitado e os Seis Olhos, que juntos formam 
                    um poder incomparável. Seu membro mais notável é Satoru Gojo, o feiticeiro mais forte 
                    da atualidade, cujo poder sozinho mantém o clã entre os mais respeitados e influentes.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 a Inteligência ou Sabedoria, e +1 no atributo que não foi escolhido.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">TREINAMENTOS DE CLÃ</span>
                        <p>
                            Você se torna treinado em 2 perícias entre Feitiçaria, Percepção e Intuição. 
                            Alternativamente, pode escolher se tornar especialista em apenas uma delas.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">POTENCIAL LENDÁRIO</span>
                    <p>
                        Fazer parte do Clã Gojo garante um enorme potencial de energia e maior facilidade 
                        para desenvolver feitiços. A cada nível par, você recebe +1 ponto de Energia Amaldiçoada. 
                        Além disso, ganha 1 feitiço adicional no nível 1 e mais um nos níveis 5, 10, 15 e 20.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

"DERIVADO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-bolt"></i> ORIGEM: DERIVADO
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    Existem casos raros de indivíduos cuja energia e técnica amaldiçoada 
                    derivaram de uma fonte alternativa, despertando em momentos posteriores 
                    da vida e, muitas vezes, de forma não natural — seja pelo consumo de um 
                    objeto amaldiçoado, alterações na alma ou outros eventos extraordinários. 
                    Essa transformação muda a pessoa para sempre.
                    <br><br>
                    Exemplos conhecidos incluem Yuuji Itadori, que despertou ao consumir 
                    um dos dedos de Sukuna, e Junpei, cuja alma foi alterada por Mahito. 
                    A existência de um Derivado costuma gerar conflitos e riscos, como no 
                    caso de Itadori, que passou a ser considerado uma ameaça.
                    <br><br>
                    Por sua natureza singular, o Derivado tende a se desenvolver de forma 
                    intensa e focada, rompendo limites e superando expectativas naquilo 
                    em que decide se especializar.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 um atributo à sua escolha e +1 em outro atributo diferente.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">ENERGIA ANTINATURAL</span>
                        <p>
                            Sua energia possui traços únicos, oriundos de sua origem anormal. 
                            Você recebe uma Aptidão Amaldiçoada de Aura, desde que atenda aos requisitos.
                            <br><br>
                            Além disso, você possui uma reserva oculta de energia: 
                            como Ação Bônus em combate, pode recuperar uma quantidade de 
                            Energia Amaldiçoada igual ao dobro do seu bônus de treinamento.
                            <br><br>
                            Você pode usar essa característica uma vez por dia.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">DESENVOLVIMENTO INESPERADO</span>
                    <p>
                        O crescimento de um Derivado é imprevisível e pode ultrapassar 
                        limites considerados naturais.
                        <br><br>
                        A cada 4 níveis, você recebe +1 ponto de atributo adicional e 
                        aumenta em +1 o limite máximo do atributo escolhido.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

"RESTRINGIDO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-fist-raised"></i> ORIGEM: RESTRINGIDO
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    Alguns indivíduos nascem com uma quantidade quase nula de energia amaldiçoada. 
                    Em compensação, recebem um físico extraordinário...
                </p>
                <div class="divisor-premium"></div>
                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>Seus valores de Força, Destreza e Constituição aumentam em +1.</p>
                    </div>
                    <div class="item-premium">
                        <span class="titulo-vermelho">FÍSICO ABENÇOADO</span>
                        <p>Imunidade a doenças mundanas e Deslocamento +3m.</p>
                    </div>
                </div>
                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">ÁPICE CORPORAL HUMANO</span>
                    <p>Seu limite de atributo para Força, Destreza e Constituição passa a ser 30.</p>
                </div>
            </div>
        </div>
    </div>`,

"FETO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-dna"></i> ORIGEM: FETO AMALDIÇOADO HÍBRIDO
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    Um Feto Amaldiçoado é um espírito amaldiçoado em estado embrionário que, 
                    sob condições específicas, pode se tornar um híbrido entre humano e maldição. 
                    Essa fusão resulta em uma constituição única e na capacidade de dominar o 
                    jujutsu de forma instintiva.
                    <br><br>
                    Um exemplo é Choso, nascido da união entre humano e maldição, possuindo 
                    sangue tóxico e a capacidade de se regenerar com energia amaldiçoada. 
                    Embora tenha corpo de carne e osso, sua natureza permanece amaldiçoada.
                    <br><br>
                    Trata-se de uma origem complexa, com interação singular com energia reversa 
                    e uma progressão baseada na evolução da própria anatomia.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Aumenta em +2 um atributo à sua escolha e +1 em outro atributo diferente.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">HERANÇA MALDITA</span>
                        <p>
                            Como híbrido, você carrega uma natureza amaldiçoada.
                            <br><br>
                            Toda cura recebida por meio de Energia Reversa é reduzida pela metade.
                            <br><br>
                            Caso possua uma habilidade de cura por Energia Reversa, você pode 
                            utilizá-la tratando a Energia Reversa como Energia Amaldiçoada, 
                            curando o valor completo. Em vez de gastar 1 ponto de Energia Reversa, 
                            você gasta 2 pontos de Energia Amaldiçoada.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">FÍSICO AMALDIÇOADO</span>
                    <p>
                        Seu corpo possui propriedades únicas. Você recebe 1 Característica de 
                        Anatomia dentre as listadas na próxima página.
                        <br><br>
                        A cada 5 níveis, seu corpo evolui, concedendo uma nova Característica de Anatomia.
                    </p>

                    <div style="margin-top: 12px;"></div>

                    <span class="titulo-vermelho">VIGOR MALDITO</span>
                    <p>
                        Uma vez por descanso longo, você pode usar uma Ação Bônus para 
                        recuperar 5 + seu modificador de Constituição em pontos de vida.
                        <br><br>
                        Nos níveis 4, 8 e 12, você recebe +1 uso adicional dessa característica, 
                        e o valor base da cura aumenta em +5.
                        <br><br>
                        Caso possua múltiplos usos disponíveis, pode gastá-los simultaneamente 
                        para aumentar proporcionalmente a cura recebida.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

"SEMTECNICA_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-sword"></i> ORIGEM: SEM TÉCNICA
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    Nem todos nascem com uma técnica amaldiçoada, possuindo apenas o uso básico 
                    da energia amaldiçoada. Embora isso seja um limitador, é possível compensar 
                    essa ausência por meio de treino extremo, disciplina e dedicação absoluta.
                    <br><br>
                    Exemplos incluem Kasumi Miwa e Atsuya Kusakabe, que, mesmo sem técnica, 
                    se destacam por sua maestria com armas e pelo domínio de recursos como o 
                    Domínio Simples.
                    <br><br>
                    O Sem Técnica é uma origem versátil, capaz de se especializar e dominar 
                    determinadas áreas. Contudo, um personagem Sem Técnica não possui 
                    técnica amaldiçoada, não tem acesso a Feitiços e não pode escolher a 
                    especialização Especialista em Técnicas.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Você recebe +4 pontos para distribuir entre seus atributos,
                            com um máximo de +3 no mesmo atributo.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">ESTUDOS DEDICADOS</span>
                        <p>
                            Você se torna treinado em 2 perícias à sua escolha.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">EMPENHO IMPLACÁVEL</span>
                    <p>
                        Sua evolução ocorre por esforço constante. Conforme sobe de nível:
                        <br><br>
                        • Nível 1: Recebe 1 Talento ou Aptidão Amaldiçoada à sua escolha.
                        <br>• Nível 3: +1 em 2 perícias e +1 em um tipo de jogada de ataque ou TR.
                        <br>• Nível 6: Recebe 1 habilidade de especialização adicional.
                        <br>• Nível 10: Recebe 1 Talento ou Aptidão Amaldiçoada.
                        <br>• Nível 13: +2 em 2 perícias e +1 em um tipo de jogada de ataque ou TR.
                        <br>• Nível 15: Recebe 1 habilidade de especialização adicional.
                        <br>• Nível 17: +3 em 2 perícias e +2 em um tipo de jogada de ataque ou TR.
                        <br>• Nível 19: Recebe 1 habilidade de especialização e 1 Talento adicional.
                        <br><br>
                        No 4º nível, você recebe acesso ao Novo Estilo da Sombra e à 
                        Aptidão Amaldiçoada Domínio Simples.
                    </p>
                </div>

                <div class="divisor-premium"></div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">NOVO ESTILO DA SOMBRA</span>
                    <p>
                        Técnica desenvolvida por usuários sem técnica, baseada na 
                        customização do Domínio Simples.
                        <br><br>
                        A partir do 4º nível, adicione o Novo Estilo da Sombra ao seu 
                        Perfil Amaldiçoado como equivalente à sua técnica.
                        <br><br>
                        Sempre que utilizar Domínio Simples, você pode imbuí-lo com 
                        uma Técnica de Estilo. No início de cada turno seu, enquanto 
                        o Domínio Simples estiver ativo, você pode trocar a Técnica de Estilo em uso.
                        <br><br>
                        Ao aprender o estilo, você recebe 1 Técnica de Estilo. 
                        Nos níveis 8, 12, 16 e 20, recebe outra adicional.
                        Caso aprenda Domínio Simples em nível superior, recebe 
                        uma quantidade de Técnicas de Estilo equivalente ao seu nível.
                        <br><br>
                        Técnicas de Estilo priorizam qualidade em vez de quantidade, 
                        sendo desenvolvidas para complementar seu método de combate.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

"CORPO_ORIGEM": `
    <div class="espacamento-card">
        <div class="card-premium-unificado">
            <div class="header-premium">
                <i class="fas fa-robot"></i> ORIGEM: CORPO AMALDIÇOADO MUTANTE
            </div>
            <div class="body-premium">
                <p class="lore-text">
                    Um Corpo Amaldiçoado Mutante passa por um processo que concede consciência própria, 
                    uma fonte renovável de energia amaldiçoada e a capacidade de possuir múltiplos núcleos, 
                    cada um com características únicas e foco diferenciado dentro e fora de combate.
                    <br><br>
                    Um exemplo é Panda, criado por Masamichi Yaga, que possui três núcleos distintos.
                </p>

                <div class="divisor-premium"></div>

                <div class="grid-informacoes">
                    <div class="item-premium">
                        <span class="titulo-vermelho">BÔNUS EM ATRIBUTO</span>
                        <p>
                            Recebe +2 pontos para distribuir entre seus atributos.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">FORMA DE VIDA SINTÉTICA</span>
                        <p>
                            Você é uma forma de vida artificial:
                            <br>• Imune a dano venenoso e condição Envenenado;
                            <br>• Não recebe efeitos de refeições nem de itens do tipo Medicina.
                        </p>
                    </div>

                    <div class="item-premium">
                        <span class="titulo-vermelho">MUTAÇÃO ABRUPTA</span>
                        <p>
                            Você possui múltiplos núcleos (inicia com 3) e deve escolher um como Núcleo Primário. 
                            Alternar o núcleo ativo é uma Ação Bônus. Cada núcleo possui atributos, Feitiços e treinamentos semelhantes, seguindo regras específicas de Núcleos Múltiplos.
                        </p>
                    </div>
                </div>

                <div class="box-especial-lendario">
                    <span class="titulo-vermelho">NÚCLEOS MÚLTIPLOS</span>
                    <p>
                        • O Núcleo Primário define limites máximos de vida, energia e técnica amaldiçoada para todos os núcleos.
                        <br>• Todos os núcleos compartilham treinamentos em perícias e equipamentos do Núcleo Primário.
                        <br>• Nível 1: criatura Pequena; Nível 6: Média; Nível 15: opção de Grande.
                        <br>• Atributos de outros núcleos podem ser redistribuídos, mantendo os valores totais.
                        <br>• Pontos de Vida e Energia Amaldiçoada atuais são ajustados ao alternar núcleos.
                        <br>• Modificador de Destreza altera iniciativa; deslocamento e Atenção seguem regras de habilidades.
                        <br>• Dano na alma reduz a vida máxima de todos os núcleos; núcleos a 0 são destruídos.
                        <br>• Integridade da Alma = soma das integridades de todos os núcleos ÷ 2. Se chegar a 0, todos os núcleos são destruídos.
                        <br>• Durante combate, se um núcleo atingir 0, pode-se usar Reação para alternar núcleo em vez de morrer.
                        <br>• Núcleo destruído ou danificado não pode ser usado ou restaurado sem talentos específicos.
                        <br>• Habilidades de Especialização e Aptidões Amaldiçoadas: níveis ímpares fixos para todos os núcleos, níveis pares versáteis, escolhidos por núcleo.
                        <br>• Habilidades Base de Especialização seguem especialização e nível do núcleo.
                        <br>• Multiclasse não é permitida em nenhum núcleo.
                    </p>
                </div>
            </div>
        </div>
    </div>
`,

    // --- ESPECIALIZAÇÕES ---
    "LUTADOR_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-fist-raised"></i> LUTADOR</div>
        <div class="body-premium">
            <p class="lore-text">
                O Lutador é um especialista no combate físico, podendo se dedicar a armas marciais ou transformar seu próprio corpo na arma. Suas habilidades permitem aperfeiçoar o corpo em resistência, mobilidade e potência, conseguindo se manter de pé enquanto derruba os outros. Rápidos, destruidores e resistentes, também podem se render a uma brutalidade extrema, encontrando uma zona onde o poder flui perfeitamente, debochar e se arriscar, tornando-se intocáveis e aplicando manobras em combate.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CARACTERÍSTICAS DE ESPECIALIZAÇÃO</span>
            <p>
                <strong>Pontos de Vida no Primeiro Nível:</strong> 12 + Modificador de Constituição.<br>
                <strong>Pontos de Vida em Níveis Subsequentes:</strong> 1d10 + Modificador de Constituição (ou 6 + Modificador).<br>
                <strong>Treinamentos:</strong> Armas Simples, Armas Marciais e Escudo Leve. Um Teste de Resistência entre Fortitude ou Reflexos. Uma perícia de Ofício, Atletismo ou Acrobacia e outras três quaisquer.<br>
                <strong>Pontos de Energia Amaldiçoada:</strong> 4 por nível.<br>
                <strong>Atributos Chave:</strong> Força ou Destreza, usados para calcular a CD das habilidades.<br>
                <strong>Requisitos para Multiclasse:</strong> Força ou Destreza 16.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">HABILIDADES BASE DE LUTADOR</span>
            <p>
                <strong>Corpo Treinado (nível 1):</strong> O corpo é sua arma. Ataques desarmados: 1d8 (cresce com níveis). Pode usar Força ou Destreza nos ataques desarmados e com armas marciais.<br>
                <strong>Empolgação (nível 1):</strong> Ao acertar ataques, você aumenta níveis de empolgação (máx. 5), podendo usar Dado de Empolgação em manobras especiais: Ajuste, Comando, Desarme, Esquiva, Trabalho de Pés.<br>
                <strong>Reflexo Evasivo (nível 2):</strong> Redução de dano igual à metade do nível de Lutador (exceto alma).<br>
                <strong>Implemento Marcial (nível 4):</strong> +2 na CD de Habilidades de Especialização, Feitiços e Aptidões Amaldiçoadas (aumenta em +1 nos níveis 8 e 16).<br>
                <strong>Gosto pela Luta (nível 5):</strong> +2 em ataques desarmados ou armas marciais e +1 em Fortitude e dano (bônus aumenta com níveis).<br>
                <strong>Teste de Resistência Mestre (nível 9):</strong> Treinado em um segundo teste e mestre no teste da especialização.<br>
                <strong>Empolgação Máxima (nível 11):</strong> Dados de empolgação aumentam para 2d4, 2d6, 2d8 e 3d6.<br>
                <strong>Lutador Superior (nível 20):</strong> Ataques desarmados causam 1 dado de dano adicional, ataque desarmado como ação livre gastando 2 PE e inicia combate com +1 Nível de Empolgação.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">RESISTÊNCIA FÍSICA</span>
            <p>
                Recebe bônus em Fortitude e Atletismo, além de Vida Adicional por nível.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">EXEMPLOS DE LUTADORES</span>
            <p>
                Yuuji Itadori, Kinji Hakari e Hajime Kashimo.
            </p>
        </div>
    </div>
</div>`,

    "ESPECIALISTA EM COMBATE_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-swords"></i> ESPECIALISTA EM COMBATE</div>
        <div class="body-premium">
            <p class="lore-text">
                Mestre no uso de armas amaldiçoadas e táticas de combate avançadas. Trata o combate como uma arte, focando em manuseio complexo de armas, versatilidade, estratégia e domínio do campo de batalha. Adaptável a qualquer situação, pode seguir caminhos de resistência, letalidade ou controle de campo.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CARACTERÍSTICAS DE ESPECIALIZAÇÃO</span>
            <p>
                <strong>Pontos de Vida no Primeiro Nível:</strong> 12 + Modificador de Constituição.<br>
                <strong>Pontos de Vida em Níveis Subsequentes:</strong> 1d10 + Modificador de Constituição (ou 6 + Modificador).<br>
                <strong>Treinamentos:</strong> Todas as armas e escudos. Um teste de resistência entre Fortitude ou Reflexos. Duas perícias de Ofício, Atletismo ou Acrobacia e três outras quaisquer.<br>
                <strong>Pontos de Energia Amaldiçoada:</strong> 4 por nível.<br>
                <strong>Atributos Chave:</strong> Força, Destreza ou Sabedoria.<br>
                <strong>Requisitos para Multiclasse:</strong> Força ou Destreza 16.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">HABILIDADES BASE DE ESPECIALISTA EM COMBATE</span>
            <p>
                <strong>Repertório do Especialista (nível 1):</strong> Escolha um estilo de combate: Defensivo, Arremessador, Duelista, Interceptador, Protetor, Distante, Duplo ou Massivo. Recebe novos estilos nos níveis 6 e 12.<br>
                <strong>Artes do Combate (nível 1):</strong> Gasta Pontos de Preparo para realizar manobras como Arremesso Ágil, Distração Letal, Execução Silenciosa, Golpe Descendente e Investida Imediata. Recupera Pontos de Preparo eliminando inimigos, analisando o campo ou em descansos.<br>
                <strong>Golpe Especial (nível 4):</strong> Personaliza ataques ou artes com efeitos como Amplo, Atroz, Impactante, Letal, Longo, Penetrante, Preciso, Sanguinário, Lento, Sacrifício ou Desfocado. Custo mínimo: 1 PE.<br>
                <strong>Implemento Marcial (nível 4):</strong> +2 na CD de Habilidades de Especialização, Feitiços e Aptidões Amaldiçoadas (aumenta +1 nos níveis 8 e 16).<br>
                <strong>Renovação pelo Sangue (nível 6):</strong> Ao acertar crítico ou reduzir um inimigo a 0 PV, recupera 1 PE.<br>
                <strong>Teste de Resistência Mestre (nível 9):</strong> Treinado em um segundo teste e mestre no teste da especialização.<br>
                <strong>Autossuficiente (nível 20):</strong> Recebe 3 PE temporários ao usar Golpe Especial (uma vez por cena pode transformar em 6) e todos os ataques causam 1 dado de dano adicional da arma.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">DOMÍNIO DE ARMAS</span>
            <p>
                Ganha proficiência com todas as armas amaldiçoadas e bônus em rolagens de dano.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">EXEMPLOS DE ESPECIALISTAS</span>
            <p>
                Kento Nanami, Yuta Okkotsu e Atsuya Kusakabe.
            </p>
        </div>
    </div>
</div>`,

    "ESPECIALISTA EM TÉCNICA_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-magic"></i> ESPECIALISTA EM TÉCNICA</div>
        <div class="body-premium">
            <p class="lore-text">O Especialista em Técnicas se dedica completamente em maximizar o potencial da sua energia amaldiçoada e da sua técnica, recebendo um leque de habilidades que potencializa e otimiza todos os seus Feitiços. São estratégicos, imponentes e imprevisíveis. Exemplos: <strong>Satoru Gojo e Ryomen Sukuna.</strong></p>
            
            <div class="divisor-premium"></div>
            
            <div class="grid-detalhes-tecnicos">
                <div>
                    <span class="titulo-vermelho">PONTOS DE VIDA (PV)</span>
                    <p>• <strong>1º Nível:</strong> 10 + Mod. CON<br>
                    • <strong>Subsequentes:</strong> 1d8 (ou 5) + Mod. CON</p>
                </div>
                <div>
                    <span class="titulo-vermelho">ENERGIA AMALDIÇOADA (PE)</span>
                    <p>• <strong>6 Pontos por nível</strong> + Mod. de Atributo de Técnica.</p>
                </div>
            </div>

            <div class="divisor-premium"></div>

            <span class="titulo-vermelho">TREINAMENTOS E REQUISITOS</span>
            <p>• <strong>Armas:</strong> Simples e à Distância.<br>
            • <strong>Resistência:</strong> Astúcia ou Vontade.<br>
            • <strong>Perícias:</strong> Ofício, Feitiçaria, Ocultismo + 2 quaisquer.<br>
            • <strong>Multiclasse:</strong> INT ou SAB 16.</p>

            <div class="divisor-premium"></div>

            <span class="titulo-vermelho">DOMÍNIO DOS FUNDAMENTOS (NÍVEL 1)</span>
            <p style="font-size: 0.9em; margin-bottom: 10px;"><em>Como um especialista em técnicas, você tem uma
maior dominância sobre os fundamentos da energia amaldiçoada e das suas
habilidades. Você aprende duas das Mudanças de Fundamento abaixo no
primeiro nível e uma adicional no nível 12.</em></p>
            <ul class="lista-habilidades-tecnica">
                <li><strong>Feitiço Cruel:</strong> Quando usar um Feitiço que força um Teste de
Resistência você pode gastar 1 ponto de energia amaldiçoada para
aumentar a CD do teste em 2 ou 2 pontos para aumentar em 4.</li>
                <li><strong>Feitiço Distante:</strong> Quando usar um Feitiço a distância, você pode
gastar 2 pontos de energia amaldiçoada para dobrar seu alcance. Caso
seja um Feitiço corpo-a-corpo, você pode gastar 2 pontos de energia
para a dar um alcance de 9 metros.</li>
                <li><strong>Feitiço Duplicado:</strong> Uma vez por rodada, quando usar um Feitiço
de dano cujo alvo seja apenas uma criatura, você pode gastar
pontos de energia para dar um segundo alvo a habilidade. O
custo é igual ao dobro do nível do Feitiço (considere 1 para
Feitiços nível 0).</li>
                <li><strong>Feitiço Expansivo:</strong> Quando usar um Feitiço em área,
você pode gastar 3 pontos de energia amaldiçoada p a r a
aumentar a área em um valor igual a metade da área p a d r ã o
(1,5x do total).</li>
                <li><strong>Feitiço Potente:</strong> Quando usar um Feitiço de dano, você pode gastar 2 pontos de
energia amaldiçoada e rolar novamente uma quantidade de dados de dano igual
ao seu modificador de Inteligência ou Sabedoria, utilizando os melhores resultados.</li>
                <li><strong>Feitiço Preciso:</strong> Quando usar um Feitiço que utilize um teste de ataque, você pode
gastar 1 ponto de energia amaldiçoada para receber +2 de acerto ou 2 pontos de
energia amaldiçoada para receber +4 de acerto.</li>
                <li><strong>Feitiço Rápido (Nvl 6):</strong> Uma vez por rodada, quando for utilizar um Feitiço cuja conjuração
seja uma Ação Completa ou Comum, você pode gastar PE para reduzir seu custo em
ação em um (Completa para Comum ou Comum para Bônus). O custo é igual ao
dobro do nível do Feitiço (considere 1 para Feitiços nível 0). Pré-Requisito: Nível 6.</li>
            </ul>

            <div class="divisor-premium"></div>

            <span class="titulo-vermelho">CONJURAÇÃO APRIMORADA</span>
            <p>Todos podem utilizar Feitiços, mas você consegue os
aprimorar e extrair um maior potencial. Sempre que utilizar um Feitiço que cause
dano, você soma um bônus ao total de dano causado baseado no nível do Feitiço, de
acordo com a tabela abaixo. Além disso, você passa a receber novos Feitiços em todo
nível, ao invés de apenas nos níveis pares.</p>

            <div class="divisor-premium"></div>

            <span class="titulo-vermelho">EVOLUÇÃO DA CARREIRA</span>
            <p>• <strong>Nvl 4 - Adiantar Evolução:</strong> Acesso antecipado a níveis de Feitiço (Nvl 2 no 4, Nvl 3 no 7, Nvl 4 no 11, Nvl 5 no 15).</p>
            <p>• <strong>Nvl 9 - Resistência Mestre:</strong> Treinado em 2º teste e Mestre no inicial.</p>
            <p>• <strong>Nvl 10 - Foco Amaldiçoado:</strong> Escolha entre <strong>Destruição</strong> (+1 dano p/ dado), <strong>Economia</strong> (-2 custo PE) ou <strong>Refino</strong> (+Aptidão e +1/2 Bônus Treino na CD).</p>
            <p>• <strong>Nvl 20 - O HONRADO:</strong> Custos de Nvl 1 a 3 caem pela metade. +5 na CD e +5 no Acerto de todos os Feitiços.</p>
        </div>
    </div>
</div>`,

    "CONTROLADOR_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-chess-king"></i> CONTROLADOR</div>
        <div class="body-premium">
            <p class="lore-text">
                Mestre em manipular o campo de batalha e as emoções dos inimigos através de energia. Especializa-se em controlar invocações, como shikigamis ou corpos amaldiçoados, podendo atacar junto delas, ser protegido por elas ou mantê-las vivas mais tempo em combate. Dominantes, criativos e impactantes.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CARACTERÍSTICAS DE ESPECIALIZAÇÃO</span>
            <p>
                <strong>Pontos de Vida no Primeiro Nível:</strong> 10 + Modificador de Constituição.<br>
                <strong>Pontos de Vida em Níveis Subsequentes:</strong> 1d8 + Modificador de Constituição (ou 5 + Modificador).<br>
                <strong>Treinamentos:</strong> Armas Simples e Armas à Distância. Um teste de resistência entre Astúcia ou Vontade. Perícias: Ofício, Percepção, Persuasão + duas quaisquer.<br>
                <strong>Pontos de Energia Amaldiçoada:</strong> 5 por nível + modificador de Técnica.<br>
                <strong>Atributos Chave:</strong> Presença ou Sabedoria.<br>
                <strong>Requisitos para Multiclasse:</strong> Presença ou Sabedoria 16.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">HABILIDADES BASE DE CONTROLADOR</span>
            <p>
                <strong>Treinamento em Controle (nível 1):</strong> Recebe duas Invocações iniciais. Níveis 3, 6, 9, 10, 12, 15 e 18 ganham uma Invocação adicional. Aumenta o número de invocações em campo e comandos com Ação Comum/Bônus nos níveis 6, 12 e 18.<br>
                <strong>Controle Aprimorado (nível 4):</strong> Invocações recebem bônus +2 (aumenta com graus). Pode usar Aptidões Amaldiçoadas de Controle e Leitura via Invocações.<br>
                <strong>Apogeu (nível 6):</strong> Escolha estilo: Controle Concentrado (foco em 1 invocação), Controle Disperso (mais invocações e Criar Horda) ou Controle Sintonizado (invocações auxiliam em ataque, +1 acerto/dano por invocação).<br>
                <strong>Teste de Resistência Mestre (nível 9):</strong> Treinado em um segundo teste e mestre no teste da especialização.<br>
                <strong>Reserva para Invocação (nível 10):</strong> Uma vez por descanso curto, invocar duas invocações com custo reduzido ou uma sem custo; custo de Criar Horda reduzido pela metade.<br>
                <strong>Ápice do Controle (nível 20):</strong> Invocações recebem duas ações/características adicionais, podem ser invocadas como ação livre ou com custo reduzido. Invocações inimigas têm desvantagem para ações ofensivas contra você.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">AUTORIDADE AMALDIÇOADA</span>
            <p>
                Bônus em Intuição e Persuasão, com foco em debuffs e controle de área.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">EXEMPLOS DE CONTROLADORES</span>
            <p>
                Megumi Fushiguro, Kokichi Muta e Suguru Geto.
            </p>
        </div>
    </div>
</div>`,

    "SUPORTE_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-hand-holding-heart"></i> SUPORTE</div>
        <div class="body-premium">
            <p class="lore-text">
                Especialista em auxílio tático e utilização de Técnica Amaldiçoada Reversa para cura. Foca em apoiar aliados, amplificando suas capacidades e controlando a energia reversa, podendo ser letal contra maldições. Atenciosos, protetores e estratégicos em campo de batalha.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CARACTERÍSTICAS DE ESPECIALIZAÇÃO</span>
            <p>
                <strong>Pontos de Vida no Primeiro Nível:</strong> 10 + Modificador de Constituição.<br>
                <strong>Pontos de Vida em Níveis Subsequentes:</strong> 1d8 + Modificador de Constituição (ou 5 + Modificador).<br>
                <strong>Treinamentos:</strong> Armas Simples e Escudos. Um teste de resistência entre Astúcia ou Vontade. Perícias: Ofício, Medicina, Prestidigitação + três quaisquer.<br>
                <strong>Pontos de Energia Amaldiçoada:</strong> 5 por nível + modificador de Técnica.<br>
                <strong>Atributos Chave:</strong> Presença ou Sabedoria.<br>
                <strong>Requisitos para Multiclasse:</strong> Presença ou Sabedoria 16.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">HABILIDADES BASE DE SUPORTE</span>
            <p>
                <strong>Suporte em Combate (nível 1):</strong> Pode usar Apoiar como ação bônus. Cura toque: 2d6 + mod. Presença/Sabedoria (uso igual ao mod.) – aumenta para 2d12 no nível 4, 3d12 no 8, 6d8 no 12 e 6d10 no 16.<br>
                <strong>Presença Inspiradora (nível 3):</strong> Paga 2 PE para inspirar aliados em 9m durante a cena (+1 em perícias). Pode gastar PE adicionais para aumentar bônus.<br>
                <strong>Versatilidade (nível 5):</strong> Pode pagar 1 PE para tratar perícia não treinada como treinada. Usos = mod. Sabedoria.<br>
                <strong>Aptidão Amaldiçoada Energia Reversa (nível 6) e Liberação de Energia Reversa (nível 8).</strong><br>
                <strong>Teste de Resistência Mestre (nível 9):</strong> Treinado em um segundo teste e mestre no teste da especialização.<br>
                <strong>Medicina Infalível (nível 10):</strong> Maximiza dados de cura; pode maximizar múltiplos dados usando vários usos. Usos = metade do nível + bônus de treinamento. Adiciona bônus de treinamento a toda cura.<br>
                <strong>Suporte Absoluto (nível 20):</strong> Pode usar Apoiar como Ação Livre uma vez por rodada. Usos de Suporte em Combate dobrados e adiciona modificador de atributo para CD em toda cura.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">REGENERAÇÃO E AUXÍLIO</span>
            <p>
                Pode curar aliados e conceder PE temporário como ação bônus.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">EXEMPLOS DE SUPORTES</span>
            <p>
                Shoko Ieiri, Hana Kurusu e Kirara Hoshi.
            </p>
        </div>
    </div>
</div>`,

    "RESTRINGIDO_CLASSE": `
<div class="espacamento-card">
    <div class="card-premium-unificado">
        <div class="header-premium"><i class="fas fa-chain-broken"></i> RESTRINGIDO (RESTRIÇÃO CELESTIAL)</div>
        <div class="body-premium">
            <p class="lore-text">
                Possui zero energia amaldiçoada em troca de um corpo físico que desafia os limites humanos. Restringidos dominam artes marciais, armas e seu físico único para superar adversários. São únicos, poderosos e sobre-humanos. Ex.: Toji Fushiguro, Maki Zenin.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CARACTERÍSTICAS DE ESPECIALIZAÇÃO</span>
            <p>
                <strong>Pontos de Vida no Primeiro Nível:</strong> 16 + Modificador de Constituição.<br>
                <strong>Pontos de Vida em Níveis Subsequentes:</strong> 1d12 + Modificador (ou 7 + Modificador).<br>
                <strong>Treinamentos:</strong> Todas as armas e escudos. Testes de Resistência: Fortitude e Reflexos. Perícias: Ofício + 4 quaisquer, exceto Feitiçaria.<br>
                <strong>Atributos Chave:</strong> Qualquer atributo.<br>
                <strong>Requisitos para Multiclasse:</strong> Não permitido.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">HABILIDADES BASE DE RESTRINGIDO</span>
            <p>
                <strong>Restrito pelos Céus (nível 1):</strong> Adiciona mod. Força ou Constituição à Defesa. Recebe uma ferramenta amaldiçoada e meio de ver maldições. Pontos de Estamina: 4 iniciais +4 por nível, recupera total em descanso longo e metade em curto. Estilo Marcial incluso.<br>
                <strong>Ataque Furtivo (nível 2):</strong> 1d8 dano extra em ataque surpresa ou flanqueamento; aumenta nos níveis 3 (2d8), 6 (3d8), 9 (4d8), 12 (5d8), 15 (6d8).<br>
                <strong>Versatilidade (nível 2):</strong> +1 em todas perícias (nível 10 = +2).<br>
                <strong>Esquiva Sobre-humana (nível 3):</strong> +1 Defesa e Reflexos, aumenta nos níveis 9 e 16. Reduz crítico a partir do nível 10.<br>
                <strong>Implemento Celeste (nível 4):</strong> +2 na CD de habilidades, aumenta em 1 nos níveis 8 e 16.<br>
                <strong>Teste de Resistência Mestre (nível 9):</strong> Mestre nos dois testes da especialização.<br>
                <strong>Restrição Definitiva (nível 10):</strong> Vantagem em furtividade contra usuários de energia, vê traçado da alma, armas +1 nível de dano, deslocamento +3m, soma bônus completo em perícias de Força/Destreza/Constituição, imune a expansões de domínio.<br>
                <strong>Libertação do Destino (nível 20):</strong> Resistência a todo dano físico + 1 tipo extra, +5 em ataques, soma metade do nível no dano.
            </p>
            <div class="divisor-premium"></div>
            <span class="titulo-vermelho">CORPO DIVINO</span>
            <p>
                Imunidade a detecção de energia e bônus massivo em Defesa e Percepção.
            </p>
        </div>
    </div>
</div>`
};

function carregarTalentosAutomatico() {
    const divDestino = document.getElementById('conteudo-dinamico-talentos');
    const viewOrigemElem = document.getElementById('view-origem');
    const viewEspecElem = document.getElementById('view-especializacao');

    if (!divDestino || !viewOrigemElem) return; // segurança

    // Limpa conteúdo antigo
    divDestino.innerHTML = "";

    // Normaliza os textos da ficha
    const textoOrigemFicha = viewOrigemElem.innerText?.trim().toUpperCase() || "";
    const textoEspecFicha = viewEspecElem?.innerText?.trim().toUpperCase() || "";

    // Cria HTML final local
    let htmlFinal = "";

    // Parte 1: origem
    const chaveOrigemDireta = textoOrigemFicha + "_ORIGEM";
    if (descricoesOrigens[chaveOrigemDireta]) {
        htmlFinal += descricoesOrigens[chaveOrigemDireta];
    } else {
        for (let chave in descricoesOrigens) {
            if (chave.endsWith("_ORIGEM") && textoOrigemFicha.includes(chave.replace("_ORIGEM", ""))) {
                htmlFinal += descricoesOrigens[chave];
                break;
            }
        }
    }

    // Parte 2: especialização
    const chaveEspecDireta = textoEspecFicha + "_CLASSE";
    if (descricoesOrigens[chaveEspecDireta]) {
        htmlFinal += descricoesOrigens[chaveEspecDireta];
    } else {
        for (let chave in descricoesOrigens) {
            if (chave.endsWith("_CLASSE") && textoEspecFicha.includes(chave.replace("_CLASSE", ""))) {
                htmlFinal += descricoesOrigens[chave];
                break;
            }
        }
    }

    // Injeta o conteúdo somente se houver HTML
    if (htmlFinal) {
        divDestino.innerHTML = htmlFinal;
    }
}
/* IMPORTANTE: Você precisa chamar carregarTalentosAutomatico() 
   dentro da sua função que troca as abas (ex: openTab).
*/

// 5. ESSENCIAL: Escuta o clique em todas as abas para limpar/carregar o conteúdo
document.querySelectorAll('.tab-button, [data-tab]').forEach(botao => {
    botao.addEventListener('click', () => {
        // Pequeno delay para o sistema de abas processar a troca antes de checar a visibilidade
        setTimeout(carregarTalentosAutomatico, 100);
    });
});

// Executa assim que a página abre
window.addEventListener('load', carregarTalentosAutomatico);


let minhasAptidoes = [];

/* ABRIR / FECHAR */

window.abrirCompendioAptidoes = function() {
    document.getElementById('modal-biblioteca-apt').style.display = 'flex';
    renderizarCompendioAptidoes();
};

window.fecharModalAptidoes = function() {
    document.getElementById('modal-biblioteca-apt').style.display = 'none';
};

/* DADOS DO COMPÊNDIO (EXEMPLO) */
const compendioAptidoes = [
{
    nome: "Afinidade Ampliada",
    categoria: "Aura",
    desc: "Sua aura é aprimorada para ter uma maior afinidade com um elemento específico. Ao obter essa habilidade, você escolhe um tipo de dano elemental. Sempre que você infligir dano desse tipo específico, você causa dano adicional igual a 1 + o seu Nível de Aptidão em Aura no total de dano."
},
{
    nome: "Aura Anuladora",
    categoria: "Aura",
    desc: "A aura que o cobre obtém uma propriedade anuladora, capaz de protegê-lo de certos efeitos. Uma quantidade de vezes igual ao seu bônus de treinamento, caso você fosse sofrer uma condição, você pode pagar uma quantidade variável de energia para ignorá-la, a depender do nível da condição. Esta aptidão não pode anular manobras e efeitos físicos, como a ação Agarrar ou Ferimentos Complexos. Anular uma condição fraca custa 2PE; anular uma média custa 4PE; uma forte custa 6PE e uma extrema custa 10PE. Você recupera esses usos em um descanso longo."
},
{
    nome: "Aura Chamativa",
    categoria: "Aura",
    desc: "Você cria uma aura ao seu redor que é chamativa, atraente e mágica, cativando a atenção facilmente. Toda criatura que não for seu aliado, e começar um turno dentro de 4,5 metros de você, precisa realizar um teste de resistência de vontade (atributo principal da técnica). Em uma falha, ela fica enfeitiçada, podendo repetir o teste no próximo turno dela, deixando de estar enfeitiçada em um sucesso. Para cada vez que a criatura falhar no TR, ela recebe um bônus de +2 para resistir a esta aptidão ou deixar de estar enfeitiçada, até o final da cena. [Pré-Requisito: Presença 18 e Nível 6]"
},
{
    nome: "Aura Controlada",
    categoria: "Aura",
    desc: "Você refinou seu controle sobre a aura, impedindo que ela se revele quando é inconveniente, ajudando-o a se ocultar e esconder sua presença. Você soma metade do seu Nível de Aptidão em Aura em testes de Furtividade. Sempre que realizar uma rolagem de Furtividade, você pode gastar 1 ponto de energia amaldiçoada para receber o seu nível de aptidão de aura por completo, ao invés de metade, controlando ainda mais a sua aura. [Pré-Requisito: Treinado em Furtividade e Destreza 16]"
},
{
    nome: "Aura de Contenção",
    categoria: "Aura",
    desc: "Com foco em conter, tem-se uma aura mais pesada e densa. Sempre que for agarrar um alvo, você adiciona metade do seu Nível de Aptidão em Aura na rolagem de Atletismo, assim como na rolagem para evitar que uma criatura escape. Uma quantidade de vezes por cena igual a metade do seu Nível de Aptidão em Aura, você pode também gastar 1 ponto de energia amaldiçoada para receber vantagem para agarrar ou impor desvantagem na criatura que tentar escapar. [Pré-Requisito: Força ou Constituição 16]"
},
{
    nome: "Aura do Bastião",
    categoria: "Aura",
    desc: "Sua aura protege aliados. Todos os aliados a até 4,5m recebem bônus na Defesa igual ao seu Nível de Aptidão em Aura."
},
{
    nome: "Aura do Comandante",
    categoria: "Aura",
    desc: "Sua presença inspira aliados. Como Ação Bônus, você pode expandir sua aura para cobrir aliados a até 4,5m, concedendo 1 + metade do seu Nível de Aptidão em Aura em dano e testes de perícia em combate. Custa 2 pontos de energia amaldiçoada por turno ativo. Pré-Requisito: Presença 16 e Nível 8."
},
{
  nome: "Aura do Comandante Evoluída",
  categoria: "Aura",
  desc: "Sua presença como comandante se torna ainda mais forte e significante.\nQuando utilizar Aura do Comandante, você pode optar por somar seu Nível de Aptidão em Aura total ao invés de 1 + metade e, também, conceder um bônus de +2 em jogadas de ataques e TRs.\nEntretanto, o custo para manter aumenta de 2 para 4 PE.\n[Pré-Requisito: Aura do Comandante e Nível 12]"
},
{
    nome: "Aura do Comandante Evoluída",
    categoria: "Aura",
    desc: `Sua presença como comandante se torna ainda mais forte e significante.
Quando utilizar Aura do Comandante, você pode optar por somar seu Nível de Aptidão em Aura total ao invés de 1 + metade e, também, conceder um bônus de +2 em jogadas de ataques e TRs.
Entretanto, o custo para manter aumenta de 2 para 4 PE.
[Pré-Requisito: Aura do Comandante e Nível 12]`
},

{
    nome: "Aura Drenadora",
    categoria: "Aura",
    desc: `Uma aura vampiresca capaz de drenar a vida dos seus alvos.
Sempre que matar um inimigo, você recebe PV temporários igual a Xd8 + seu modificador de Constituição, onde X é igual ao seu Nível de Aptidão em Aura.
Eles podem acumular.
[Pré-Requisito: Nível de Aptidão em Aura 2 e Nível 6]`
},

{
    nome: "Aura Elemental",
    categoria: "Aura",
    desc: `Você converte as propriedades da sua aura, imbuindo-a com um elemento.
Seus ataques passam a causar dano elemental escolhido e recebem dano adicional.
1d4 adicional.
Nível de Aptidão 2: 1d6.
Nível 3: 1d8.
Nível 5: 1d10.
Pode desativar como ação livre.
[Pré-Requisito: Nível 6]`
},

{
    nome: "Aura Elemental Reforçada",
    categoria: "Aura",
    desc: `Você reforça sua familiaridade com o elemento da sua aura.
Recebe RD ao tipo de dano da aura igual à redução de Aura Reforçada somado ao seu Nível de Aptidão em Aura.
[Pré-Requisito: Aura Elemental e Aura Reforçada]`
},

{
    nome: "Absorção Elemental",
    categoria: "Aura",
    desc: `Você pode absorver dano elemental usando reação.
Não reduz o dano recebido.
No próximo ataque causa Xd6 adicional do mesmo tipo.
Nível 3: d8.
Nível 5: d10.
Não é cumulativa.
[Pré-Requisito: Aura Elemental]`
},

{
    nome: "Aura Embaçada",
    categoria: "Aura",
    desc: `Como ação bônus, paga 2 PE para ativar.
Custa 2 PE por rodada para manter.
Enquanto ativa, ataques corpo-a-corpo ou à distância têm 20% de chance de falhar (1 ou 2 em 1d10).
[Pré-Requisito: Nível 6]`
},

{
    nome: "Aura Inofensiva",
    categoria: "Aura",
    desc: `Sua aura parece menor do que realmente é.
Ao iniciar combate, teste de Feitiçaria contra Atenção dos inimigos.
Se superar, fica escondido automaticamente.
Segue regras normais de Furtividade.
[Pré-Requisito: Presença 16]`
},
{
    nome: "Casulo de Energia",
    categoria: "Aura",
    desc: `Evoluindo ao limite o fluxo da aura, você a torna tão densa que forma um casulo protetivo.
Como Ação Comum, você pode formar um casulo por 1 rodada, gastando 6 PE.
Enquanto ativo:
• Imunidade a dano cortante, perfurante e impacto de fontes mundanas.
• Contra técnicas, recebe RD adicional igual ao dobro do seu Nível de Aptidão em Aura.
[Pré-Requisito: Aura Impenetrável, Nível de Aptidão em Aura 5 e Nível 16]`
},

{
    nome: "Aura Excessiva",
    categoria: "Aura",
    desc: `O fluxo da sua aura se torna exageradamente intenso.
No começo de cada rodada, você pode pagar 2 PE.
Se fizer isso, recebe RD contra todos os tipos de dano (exceto dano na alma),
igual ao valor fornecido por Aura Reforçada.
[Pré-Requisito: Aura Reforçada, Constituição 16 e Nível 8]`
},

{
    nome: "Concentrar Aura",
    categoria: "Aura",
    desc: `Você concentra sua aura em sua arma.
Como ação livre, pode desabilitar aptidões de aura passivas por 1 rodada.
Para cada aptidão desabilitada:
• Após acertar ataque desarmado ou com arma, causa 1d8 de dano energético adicional.
Pode desabilitar até 1 + seu Nível de Aptidão em Aura.
Não funciona em Feitiços.`
},

{
    nome: "Enganação Projetada",
    categoria: "Aura",
    desc: `Você projeta sua aura antes do ataque, criando uma ilusão de timing.
Ao atacar:
• O alvo faz teste de resistência de Astúcia.
• Se falhar, você tem vantagem no ataque.
Para cada ataque adicional no turno:
• Paga 1 PE.
[Pré-Requisito: Treinado em Enganação, Destreza 18 e Nível 4]`
},

{
    nome: "Golpe com Aura",
    categoria: "Aura",
    desc: `Você imbuí uma aptidão de aura em um golpe.
Gasta 1 PE para aplicar.
Se o ataque acertar:
• O alvo realiza teste de resistência.
• A CD aumenta igual ao seu Nível de Aptidão em Aura.
Se causar dano, aplica após o ataque.
Não funciona com Feitiços.`
},

{
    nome: "Transferência de Aura",
    categoria: "Aura",
    desc: `Você transfere uma aptidão de aura para outro.
Como ação bônus:
• Paga 2 PE.
• Escolhe criatura até 9m.
• Transfere uma Aptidão de Aura por 1 rodada.
Para manter:
• 1 PE por rodada adicional.`
},

{
    nome: "Aura Lacerante",
    categoria: "Aura",
    desc: `Sua aura é afiada e causa dano por contato.
Como ação livre, ativa por 1 rodada.
Criaturas que iniciarem o turno até 3m devem fazer teste de Fortitude.
Falha: recebem Xd6 + modificador do atributo principal de dano energético.
X = seu Nível de Aptidão em Aura.
Nível 3: dado vira d8.
Nível 5: dado vira d10.`
},

{
    nome: "Aura Macabra",
    categoria: "Aura",
    desc: `Sua aura perturba inimigos próximos.
Criaturas agressivas que iniciam turno até 1,5m fazem teste de Vontade.
Falha: ficam Abaladas.
Podem repetir no turno seguinte.
Como ação livre, paga 1 PE para expandir alcance para 4,5m por 1 rodada.
Nível 3: inflige Amedrontado ao invés de Abalado.`
},

{
    nome: "Aura Maciça",
    categoria: "Aura",
    desc: `Sua aura se torna extremamente densa.
Sua Defesa aumenta em valor igual ao seu Nível de Aptidão em Aura.
[Pré-Requisito: Constituição 16]`
},

{
    nome: "Aura Movediça",
    categoria: "Aura",
    desc: `Você dificulta movimentação ao redor.
Quadrados adjacentes viram terreno difícil.
Nível 2: alcance 3m.
Nível 4: 4,5m.
Nível 5: 6m.
Não pode ser ampliada por Expandir Aura.`
},

{
    nome: "Aura Redirecionadora",
    categoria: "Aura",
    desc: `Pode imbuir projétil ou arma de arremesso pagando 2 PE.
Se errar o ataque:
• Pode rolar novamente contra alvo até 6m do primeiro.
• Recebe bônus no acerto igual a 1 + metade do Nível de Aptidão em Aura.
[Pré-Requisito: Destreza 16]`
},

{
    nome: "Aura Reforçada",
    categoria: "Aura",
    desc: `Você recebe redução contra danos físicos (corte, perfuração e impacto)
igual ao dobro do seu Nível de Aptidão em Aura.`
},

{
    nome: "Aura Impenetrável",
    categoria: "Aura",
    desc: `Como Ação Bônus, paga 3 PE para ativar por 1 rodada.
Enquanto ativa, recebe resistência a dano cortante, perfurante e impacto.
[Pré-Requisito: Aura Reforçada, Nível de Aptidão em Aura 3 e Nível 10]`
},

{
    nome: "Canalizar em Golpe",
    categoria: "Controle e Leitura",
    desc: `Você se torna capaz de concentrar sua energia amaldiçoada em suas armas e golpes, potencializando sua capacidade destrutiva em troca de energia.
Como uma Ação de Movimento, você pode gastar uma quantidade de PE igual ao seu Nível de Aptidão em Controle e Leitura para adicionar dano: para cada ponto gasto, seu próximo ataque causa +1d6 de dano adicional.
A habilidade funciona apenas para um ataque e não pode ser utilizada em Feitiços.
Errar o ataque não consome esse uso.`
},

{
    nome: "Canalização Avançada",
    categoria: "Controle e Leitura",
    desc: `Você aperfeiçoa a prática de canalizar energia em golpes, realizando-a mais rapidamente e com mais poder.
Canalizar energia em um golpe também pode ser feito como uma Reação ao realizar um ataque, e o bônus passa de +1d6 para +1d8 por ponto gasto.
A habilidade continua funcionando apenas para um ataque e não é consumida em caso de erro.
[Pré-Requisito: Canalizar em Golpe, Nível de Aptidão em Controle e Leitura 2 e Nível 8]`
},

{
    nome: "Canalização Máxima",
    categoria: "Controle e Leitura",
    desc: `Você alcança o ápice da técnica de canalizar energia nos seus golpes, elevando-a a um nível superior.
Ao usar Canalizar em Golpe, você pode gastar 1 PE adicional para aumentar o bônus por ponto gasto de +1d8 para +1d10.
Além disso, você soma seu Nível de Aptidão em Aura ao total de dano concedido por esta Aptidão.
[Pré-Requisito: Canalização Avançada, Nível de Aptidão em Controle e Leitura 4 e Nível 16]`
},

{
    nome: "Cobrir-se",
    categoria: "Controle e Leitura",
    desc: `Você se torna capaz de concentrar sua energia amaldiçoada em seu corpo, amenizando impactos em troca de energia imediata.
Como uma Reação, ao receber dano, você pode gastar uma quantidade de PE igual a 2 + (2 x seu CL) para receber Pontos de Vida Temporários.
Para cada ponto gasto, você recebe 4 PVs temporários.
Esses PVs são independentes de outras fontes, não seguem o limite comum de PVs temporários e duram até o final do turno da criatura contra a qual você utilizou a Reação.`
},

{
    nome: "Cobertura Avançada",
    categoria: "Controle e Leitura",
    desc: `Você desenvolve sua capacidade de revestir e cobrir seu corpo com energia amaldiçoada, resistindo melhor a golpes.
Ao usar sua Reação para Cobrir-se, cada ponto de PE gasto passa a conceder 8 Pontos de Vida Temporários.
[Pré-Requisito: Cobrir-se, Nível de Aptidão em Controle e Leitura 2 e Nível 10]`
},

{
    nome: "Estímulo Muscular",
    categoria: "Controle e Leitura",
    desc: `Você se torna proficiente em utilizar energia para estimular e reforçar seu corpo, aprimorando força e agilidade.
Quando realizar uma Ação de Movimento ou uma ação envolvendo as perícias Acrobacia ou Atletismo, você pode, como parte da mesma ação, utilizar energia para aplicar um dos seguintes estímulos:

 Ação de Movimento: você pode gastar 1 PE para aumentar a distância percorrida em um valor igual à metade do seu Deslocamento.

 Teste (comum ou oposto): você pode gastar até uma quantidade de PE igual ao seu Nível de Aptidão em Controle e Leitura, recebendo +1 no teste para cada PE gasto. O bônus dura até o começo do seu próximo turno.

 Empurrar criatura ou arremessar objeto (ações como Desarmar ou Empurrar): você pode gastar 2 PE para aumentar a distância em um valor igual ao seu Nível de Aptidão em Controle e Leitura  1,5 metros.

 Ação de Pular: você pode gastar 1 PE para dobrar a distância percorrida.

Você pode utilizar cada estímulo apenas uma vez por rodada.`
},

{
    nome: "Estímulo Muscular Avançado",
    categoria: "Controle e Leitura",
    desc: `Seu controle ao imbuir os músculos com energia torna-se ainda mais apurado.
Você passa a poder utilizar cada estímulo duas vezes por rodada, e eles recebem as seguintes melhorias:

 Aumento de Deslocamento: ao invés de 1 PE para ganhar metade do Deslocamento, você pode gastar 2 PE para aumentar em um valor igual ao seu Deslocamento total.

 Bônus em Teste: cada PE gasto passa a conceder +2 no teste ao invés de +1.

 Empurrar criatura ou arremessar objeto: a distância passa a ser aumentada em um valor igual ao seu Nível de Aptidão em Controle e Leitura × 3 metros.

[Pré-Requisito: Estímulo Muscular, Nível de Aptidão em Controle e Leitura 3 e Nível 4]`
},

{
    nome: "Expandir Aura",
    categoria: "Controle e Leitura",
    desc: `Você se torna capaz de controlar plenamente sua energia, incluindo aquela que compõe sua aura, podendo expandi-la com uma descarga energética.
No seu turno, como uma Ação Livre, você pode gastar 2 PE para expandir sua aura, dobrando o alcance de todas as suas Aptidões de Aura passivas por 1 rodada.
Para cada rodada adicional após a primeira, você deve pagar +1 PE para mantê-la expandida.

[Pré-Requisito: Nível 6]`
},

{
    nome: "Leitura de Aura",
    categoria: "Controle e Leitura",
    desc: `Compreendendo profundamente a energia e as propriedades que ela pode assumir em auras, você é capaz de lê-las e identificar seus efeitos.
Ao ver uma criatura que possua uma aura amaldiçoada, você pode realizar um teste de Feitiçaria para tentar ler e descobrir suas propriedades.
A CD do teste é igual à CD Amaldiçoada da criatura.
Em caso de sucesso, você descobre as propriedades passivas e ativas da aura da criatura.`
},

{
    nome: "Leitura Rápida de Energia",
    categoria: "Controle e Leitura",
    desc: `Treinando e se adaptando a ler rapidamente auras, você desenvolve maior capacidade de prever as ações de usuários de energia amaldiçoada, favorecendo-se ofensiva e defensivamente.
Como uma Ação de Movimento, você pode realizar um teste de Percepção contra a CD Amaldiçoada de uma criatura, recebendo um bônus igual ao seu CL.
Em caso de sucesso, até o final da cena:
 Você não pode receber desvantagem ou prejuízos para acertar o inimigo por causa de aura.
 Você ignora aumentos de Defesa fornecidos por auras.`
},

{
    nome: "Projetar Energia",
    categoria: "Controle e Leitura",
    desc: `Ao invés de canalizar energia em um objeto, você a concentra e a libera como um projétil explosivo.
Você pode gastar uma quantidade de PE igual a 1 + seu Nível de Aptidão em Controle e Leitura e transformá-la em um projétil, disparando-o como uma Ação Comum.

Para cada ponto gasto, o projétil causa 1d10 de dano energético, somando o modificador do seu maior atributo ao total.

Alcance: 9 metros + (1,5 metros x bônus de treinamento).

Você pode escolher:
 Realizar uma rolagem de ataque amaldiçoada (não pode resultar em crítico); ou
 Forçar o alvo a realizar um Teste de Resistência de Reflexos (baseado no maior atributo), anulando o dano em caso de sucesso.`
},

{
    nome: "Projeção Avançada",
    categoria: "Controle e Leitura",
    desc: `Dominando a prática de concentrar e disparar projéteis de energia, você eleva o poder da sua projeção.
O dano por ponto gasto aumenta para 2d8 e você passa a somar o dobro do seu modificador ao total.

Além disso:
 Se usar como ataque, recebe +2 para acertar.
 Se forçar um Teste de Resistência, a dificuldade aumenta em +2.

[Pré-Requisito: Projetar Energia, Nível de Aptidão em Controle e Leitura 2 e Nível 8]`
},

{
    nome: "Projeção Máxima",
    categoria: "Controle e Leitura",
    desc: `Você leva a prática de disparar energia projetada ao seu ápice, criando projéteis devastadores.
O dano por ponto gasto aumenta de 2d8 para 3d8.

Além disso:
 O bônus para acertar passa a ser +6.
 O aumento na dificuldade do Teste de Resistência passa a ser +4.
 Caso escolha forçar um Teste de Resistência, um sucesso do alvo reduz o dano à metade ao invés de anulá-lo.

[Pré-Requisito: Projeção Avançada, Nível de Aptidão em Controle e Leitura 4 e Nível 16]`
},

{
    nome: "Projeção Dividida",
    categoria: "Controle e Leitura",
    desc: `Você descobre uma nova forma de disparar sua energia projetada, dividindo-a em dois projéteis no meio do trajeto.
Ao realizar um disparo de energia contra um alvo, você pode pagar até metade da energia gasta no disparo para duplicá-lo como parte da mesma ação.

O projétil duplicado:
 Deve ter como alvo uma criatura a até 4,5 metros do alvo original.
 Causa dano equivalente à quantidade de energia gasta nele, seguindo o cálculo padrão de Projetar Energia.
 Sempre utiliza o método de Teste de Resistência da aptidão.

[Pré-Requisito: Projeção Avançada, Nível de Aptidão em Controle e Leitura 3 e Nível 12]`
},

{
    nome: "Punho Divergente",
    categoria: "Controle e Leitura",
    desc: `Uma técnica peculiar de controle do fluxo de energia. O impacto de seus golpes diverge e se divide em dois momentos: ao acertar o golpe e após um curto período de tempo.

Ao acertar um ataque desarmado, você pode escolher causar apenas metade do dano e guardar a outra metade para ser causada no turno seguinte.

Esta aptidão não pode ser utilizada em um ataque que seja um Raio Negro, devido à aplicação extremamente rápida da energia.

Caso escolha causar o restante do dano no turno seguinte, a criatura atingida deve realizar um Teste de Resistência de Fortitude (baseado no maior atributo físico). Em caso de falha, o dano é causado como se o alvo tivesse vulnerabilidade.

Além disso, quanto maior a potência do primeiro impacto, mais difícil é resistir ao segundo: para cada 5 pontos de dano causados na primeira metade, a CD do teste aumenta em +1.`
},

{
    nome: "Emoção da Pétala Decadente",
    categoria: "Controle e Leitura",
    desc: `Uma arte secreta transmitida entre as Três Grandes Famílias Jujutsu como contramedida para Expansões de Domínio, embora não se limite apenas a essa aplicação.

Você se cobre com energia e contra-ataca quando um ataque de acerto garantido iria atingi-lo.

Como uma Reação à ativação de uma Expansão de Domínio ou como uma Ação Bônus, você pode ativar Emoção da Pétala Decadente. Esta aptidão exige Concentração.

Enquanto estiver ativa:
 Sempre que receber um acerto garantido físico proveniente de uma Expansão de Domínio, você pode gastar uma quantidade de PE igual ao nível de DOM da criatura que expandiu o domínio. Se o fizer, o acerto garantido é anulado.

Além disso:
 Caso uma criatura entre no seu alcance corpo a corpo ou você comece seu turno com uma criatura nesse alcance, como uma Ação Livre, você pode gastar 5 PE para realizar um ataque corpo a corpo com sucesso garantido, sem necessidade de teste.

Se utilizar a aptidão de forma ofensiva, você não pode se proteger contra acertos garantidos até o começo do seu próximo turno.

[Pré-Requisito: Nível 5, aprender com um dos Três Grandes Clãs (Zenin, Gojo ou Kamo), Cobrir-se e Nível de Aptidão em Controle e Leitura 3]`
},

{
    nome: "Rastreio Avançado",
    categoria: "Controle e Leitura",
    desc: `Você refina e amplia suas capacidades de detectar e rastrear energia amaldiçoada.

Em uma cena onde energia amaldiçoada tenha sido utilizada ou deixado vestígios (Feitiços, Aptidões ou presença de Maldições), você detecta imediatamente esses rastros.

Se já conhecer a origem da energia, você a identifica automaticamente.

Caso não conheça, pode realizar um teste de Investigação ou Percepção contra a CD Amaldiçoada de quem originou o vestígio. Em caso de sucesso, você:
 Identifica características da energia (se é humana ou maldição, tempo aproximado desde sua presença, entre outros detalhes).
 É capaz de seguir o rastro até o ponto onde ele termina.`
},

{
    nome: "Revestimento de Domínio",
    categoria: "Domínio",
    desc: `Você se cobre com um domínio fino, sem qualquer Feitiço imbuído, permitindo neutralizar técnicas ao derramá-las no espaço do revestimento.

Você pode gastar 5 PE e uma Ação Bônus — ou usar uma Reação ao ser alvo dos efeitos de um Feitiço — para ativar o Revestimento.
Enquanto estiver ativo, você pode gastar 5 PE no início de cada um dos seus turnos para sustentar o efeito.

Efeitos do Revestimento de Domínio:
 Reduz o dano de técnicas ofensivas que o afetarem em um valor igual ao seu nível de personagem. Essa redução não pode ser ignorada.
 Caso a Técnica seja de nível menor ou igual à metade do seu Nível de DOM (arredondado para cima), ela é completamente anulada.
 O efeito se aplica apenas a Feitiços que não afetem diretamente sua energia amaldiçoada (como Boogie Woogie ou Nulificação).
 Seus golpes anulam completamente efeitos passivos, ativos, sustentados ou duradouros provenientes de Feitiços, desde que sejam de um nível que você possa anular. O funcionamento básico é considerado como Feitiço de 1º nível.

Enquanto estiver com o Revestimento de Domínio ativo, você não pode utilizar nem estar sob efeito de qualquer Feitiço.

[Pré-Requisito: Nível de Aptidão em Controle e Leitura 3, Nível de Aptidão em Domínio 1 e Nível 10]`
},

{
    nome: "Anular Técnica",
    categoria: "Domínio",
    desc: `Você aprimora seu Domínio Simples, tornando-o eficaz não apenas contra Expansões de Domínio, mas contra técnicas amaldiçoadas em geral, sendo capaz de anulá-las se agir rapidamente.

Quando for alvo ou submetido a um Feitiço, você pode usar sua Reação para tentar anulá-lo.
Você só pode tentar anular um Feitiço de nível ao qual você tenha (ou teria) acesso.

Para isso:
 Você gasta uma quantidade de PE igual à utilizada para conjurar o Feitiço.
 Realiza um teste de Feitiçaria contra a Feitiçaria do conjurador.

Se o Feitiço for em área e você o anular com sucesso, nenhuma criatura afetada sofre seus efeitos.

Por ser uma técnica complexa e exaustiva, você pode utilizar esta habilidade uma quantidade de vezes igual ao seu Nível de Aptidão em Domínio por descanso longo.

[Pré-Requisito: Domínio Simples, Nível de Aptidão em Domínio 3 e Nível 8]`
},
{
    nome: "Expansão de Domínio Incompleta",
    categoria: "Domínio",
    desc: `Iniciando-se na parte mais complexa do Jujutsu, você passa a ser capaz de expandir seu domínio interno, ainda que de maneira incompleta.

Como uma Ação Comum, desde que esteja com as duas mãos livres, você pode gastar 15 PE para expandir seu Domínio Incompleto.
Ele se espalha por uma área igual a 4,5 metros x seu bônus de treinamento, adaptando-se ao ambiente ao seu redor.

Enquanto a expansão estiver ativa, efeitos específicos são aplicados, os quais devem ser definidos de acordo com o Guia de Criação de Expansões de Domínio.

Duração padrão: 1 + seu Nível de Aptidão em Domínio (em rodadas).

[Pré-Requisito: Nível de Aptidão em Domínio 1 e Nível 8]`
},

{
    nome: "Expansão de Domínio Completa",
    categoria: "Domínio",
    desc: `Aperfeiçoando sua técnica de expansão, você alcança um novo patamar, sendo capaz de fechar uma barreira e aprisionar seus alvos dentro dela.

Como uma Ação Comum, desde que esteja com as duas mãos livres, você pode gastar 20 PE para expandir seu Domínio Completo.
A expansão cria uma área esférica com 9 metros de raio.

Enquanto estiver ativa, efeitos específicos são aplicados, os quais devem ser definidos de acordo com o Guia de Criação de Expansões de Domínio.

Duração padrão: 3 + seu Nível de Aptidão em Domínio (em rodadas).

[Pré-Requisito: Técnicas de Barreira, Expansão de Domínio Incompleta, Nível de Aptidão em Barreira 3, Nível de Aptidão em Domínio 3 e Nível 10]`
},

{
    nome: "Acerto Garantido",
    categoria: "Domínio",
    desc: `Você alcança o ápice das técnicas de Domínio, tornando-se capaz de utilizar o efeito Acerto Garantido, característica marcante de uma Expansão de Domínio letal.

Ao obter esta aptidão, você pode adicionar o efeito Acerto Garantido à sua Expansão de Domínio. Esse efeito não conta para o limite máximo de efeitos da expansão, imbuindo sua técnica nas barreiras criadas.

O funcionamento específico do Acerto Garantido deve ser elaborado de acordo com o Guia de Criação de Domínios.

Adicionar Acerto Garantido a uma Expansão de Domínio Completa aumenta seu custo em +5 PE.

[Pré-Requisito: Expansão de Domínio Completa, Treinamento em Feitiçaria, Nível de Aptidão em Barreira 4, Nível de Aptidão em Domínio 4 e Nível 14]`
},

{
    nome: "Expansão de Domínio Sem Barreiras",
    categoria: "Domínio",
    desc: `Assim como conter água sem um recipiente ou desenhar no céu sem uma tela, existe uma forma extremamente avançada de expandir um Domínio que exige controle absoluto sobre a energia amaldiçoada, sendo possível apenas para os mais talentosos.

A Expansão de Domínio Sem Barreiras possui os mesmos efeitos e custo de uma Expansão Completa com Acerto Garantido, porém não ergue barreiras físicas.

Em compensação, o alcance do Acerto Garantido é superior, podendo inclusive ultrapassar as barreiras de outras Expansões de Domínio e atacá-las pelo lado externo.

[Pré-Requisito: Acerto Garantido, Mestre em Feitiçaria, Nível de Aptidão em Barreira 5, Nível de Aptidão em Domínio 5 e Nível 20]`
},

{
    nome: "Técnicas de Barreira",
    categoria: "Barreira",
    desc: `Você se torna capaz de erguer e manipular barreiras, podendo utilizá-las tanto para defesa quanto para aprisionar oponentes.

Como uma Ação Comum, você pode criar até 6 paredes ao seu redor, cada uma custando 1 PE.
Cada parede possui:
 Tamanho: 1,5 metros.
 Pontos de Vida: 5 + (seu Nível de Aptidão em Barreira x metade do seu nível de personagem).

As paredes podem servir como obstáculo ou para prender inimigos.
Você pode manipulá-las ou movê-las utilizando outra Ação Comum.

[Pré-Requisito: Nível de Aptidão em Barreira 1]`
},

{
    nome: "Paredes Resistentes",
    categoria: "Barreira",
    desc: `As paredes que você cria tornam-se significativamente mais resistentes.

Os Pontos de Vida de cada parede passam a ser:
10 + (seu Nível de Aptidão em Barreira x seu nível de personagem).

[Pré-Requisito: Técnicas de Barreira, Nível de Aptidão em Barreira 2 e Nível 4]`
},

{
    nome: "Barreira Rápida",
    categoria: "Barreira",
    desc: `Com treino e repetição, você passa a erguer e manipular barreiras com maior agilidade.

Erguer ou manipular barreiras passa a ser uma Ação Bônus.

[Pré-Requisito: Técnicas de Barreira, Nível de Aptidão em Barreira 3 e Nível 6]`
},

{
    nome: "Cesta Oca de Vime",
    categoria: "Barreira",
    desc: `Uma antiga e esotérica técnica amaldiçoada utilizada contra Domínios, anterior ao Domínio Simples.

Como Ação Bônus ou Reação à ativação de uma Expansão de Domínio, você pode gastar 3 PE para criar um trançado de vime ao seu redor.

Enquanto a Cesta Oca de Vime estiver ativa:
 Você não é afetado pelo efeito de Acerto Garantido de uma Expansão de Domínio.
 A aptidão exige Concentração.
 Possui Durabilidade igual ao seu Nível de BAR + 1.

Regras de Durabilidade:
 Sempre que falhar em um teste de Concentração, a Durabilidade reduz em 1.
 No início do seu turno, caso você devesse ter sido atingido por um Acerto Garantido, a Cesta perde 1 de Durabilidade.
 No início do seu turno, você pode manter o selo da técnica ocupando as duas mãos; enquanto fizer isso, a Cesta não perde Durabilidade por qualquer efeito que não seja falha de Concentração.
 Se a Cesta Oca de Vime quebrar, você sofre imediatamente o efeito do Acerto Garantido.

[Pré-Requisito: Ser de uma época em que a técnica era utilizada ou Mestre em História, Nível de Aptidão em Barreira 1 e Nível 5]`
},

{
    nome: "Cortina",
    categoria: "Barreira",
    desc: `A Cortina é uma técnica de barreira comum, manifestando-se como um grande campo de força negro que isola uma área específica, impedindo que pessoas de fora vejam seu interior.

Seu funcionamento básico é o ocultamento, mas condições adicionais podem ser aplicadas para ampliar sua utilidade.

Ao criar uma Cortina:
 Você gasta 1 PE para cada 9 metros de área coberta.
 Não há custo para mantê-la ativa.
 Você pode definir condições no momento da criação, seguindo as regras específicas sobre Cortinas.

[Pré-Requisito: Técnicas de Barreira]`
},

{
    nome: "Energia Reversa",
    categoria: "Energia Reversa",
    desc: `Você desenvolve a capacidade de produzir Energia Reversa, multiplicando a energia amaldiçoada por si mesma e convertendo o negativo em positivo.

Ao adquirir esta aptidão, você libera acesso às aptidões da categoria Energia Reversa, que utilizam Pontos de Energia Reversa (PER). 
1 PER equivale a 2 Pontos de Energia Amaldiçoada (PE).

Cura Básica:
 Para cada PER gasto, você se cura em 2d6 + seu modificador de Presença ou Sabedoria.
 Nos níveis 10, 15 e 20, a cura aumenta em +1d6.
 Você pode gastar no máximo 1 + metade do seu Nível de Aptidão (em PER) por uso.
 Curar-se em combate exige uma Ação Comum.
 Esta habilidade não pode ser usada para curar outras criaturas.

[Pré-Requisito: Treinado em Feitiçaria, Nível de Aptidão em Controle e Leitura 3 e Nível 8]`
},

{
    nome: "Cura Amplificada",
    categoria: "Energia Reversa",
    desc: `Sua capacidade de cura por Energia Reversa torna-se mais poderosa e eficiente.

Melhorias:
 O dado de cura passa de d6 para d8.
 Você passa a somar o dobro do seu modificador de Presença ou Sabedoria.
 O limite máximo de PER gastos por uso passa a ser 1 + seu Nível de Aptidão.

[Pré-Requisito: Energia Reversa, Nível de Aptidão em Energia Reversa 3 e Nível 12]`
},

{
    nome: "Fluxo Constante",
    categoria: "Energia Reversa",
    desc: `Com maior domínio sobre a Energia Reversa, você estabelece um fluxo contínuo dela em seu corpo, preservando e restaurando sua integridade automaticamente.

No começo do seu turno, você pode se curar utilizando Energia Reversa seguindo as regras da Cura Básica, porém como uma Ação Livre.

Caso opte por não se curar no início do turno, você pode utilizar a cura como Reação ao ter seus Pontos de Vida reduzidos.

[Pré-Requisito: Energia Reversa, Nível de Aptidão em Energia Reversa 3 e Nível 12]`
},

{
    nome: "Regeneração Aprimorada",
    categoria: "Energia Reversa",
    desc: `Aprofundando seu domínio sobre a Energia Reversa, você adquire a capacidade de regenerar danos severos.

Como uma Ação Comum, você pode regenerar Ferimentos Complexos, gastando 8 PER por ferimento.

Regras adicionais:
 Desmembramentos só podem ser regenerados se o membro tiver sido perdido há menos de 1 dia ou ainda não tiver cicatrizado.
 Você pode gastar PER adicionais na mesma ativação para recuperar múltiplos membros ou ferimentos.
 Se possuir o membro em mãos, a ação se torna uma Ação Bônus e o custo para restaurá-lo passa a ser 3 PER.
 Você pode remover os efeitos de um veneno gastando uma Ação Bônus e 4 PER.

Aprimoramento:
 Ao atingir Nível de Aptidão em Energia Reversa 5, você pode gastar 10 PER para usar esta aptidão como Ação Livre.

Além disso, ao regenerar uma ferida, você recupera Pontos de Vida equivalentes à metade dos PER gastos na regeneração (ex: ao gastar 8 PER, recupera o equivalente a 4 PER conforme a aptidão Energia Reversa).

[Pré-Requisito: Cura Amplificada, Nível de Aptidão em Energia Reversa 4 e Nível 15]`
},

{
    nome: "Liberação de Energia Reversa",
    categoria: "Energia Reversa",
    desc: `Além de utilizar Energia Reversa para curar a si mesmo, você aprende a liberá-la externamente, processo mais complexo e delicado.

Você passa a poder utilizar a aptidão Energia Reversa para curar outras criaturas, desde que estejam ao seu alcance de toque.

[Pré-Requisito: Energia Reversa e Nível 10]`
},

{
    nome: "Canalizar Energia Reversa",
    categoria: "Energia Reversa",
    desc: `A Energia Reversa é especialmente nociva a Maldições, e você aprende a canalizá-la de forma ofensiva.

Como uma Ação de Movimento, você pode gastar uma quantidade de PER igual ao seu bônus de treinamento para adicionar dano de Energia Reversa a um ataque.

Para cada PER gasto:
 O ataque causa +2d6 de dano adicional de Energia Reversa.

Regras:
 A habilidade funciona apenas para um único ataque.
 O alvo deve ser uma Maldição.
 Não pode ser utilizada em Feitiços.
 Errar o ataque não consome o uso.
 Não é possível utilizar Canalizar em Golpe e Canalizar Energia Reversa simultaneamente no mesmo ataque; apenas um dos dois pode ser aplicado.

[Pré-Requisito: Liberação de Energia Reversa e Canalizar em Golpe]`
},

{
    nome: "Cura em Grupo",
    categoria: "Energia Reversa",
    desc: `Ao invés de curar apenas uma criatura, você aprende a projetar Energia Reversa entre diferentes membros de um grupo.

Ao utilizar Energia Reversa, você pode optar por:
 Realizar a rolagem de cura normalmente;
 Dividir o total do resultado entre todas as criaturas dentro de um alcance igual a 4,5 metros + 1,5 metros para cada Nível de Aptidão em Energia Reversa.

Além disso, a quantidade máxima de PER que pode ser gasta por uso aumenta em +2.

[Pré-Requisito: Liberação de Energia Reversa]`
},

{
    nome: "Raio Negro",
    categoria: "Especial",
    desc: `O Raio Negro — ou Kokusen — é um fenômeno do Jujutsu em que um golpe é amplificado devido a uma distorção espacial causada quando a energia amaldiçoada é aplicada 0,000001 segundos antes do impacto.

Quando ocorre, a energia do feiticeiro brilha em negro e o poder destrutivo do golpe é drasticamente ampliado. Além disso, experienciar o Kokusen aumenta permanentemente a compreensão sobre energia amaldiçoada.

Efeitos:

 Compreensão Avançada:
Após usar o Kokusen pela primeira vez, sua compreensão da energia amaldiçoada se expande.
— Seu máximo de Energia Amaldiçoada aumenta em um valor igual ao seu nível de personagem.
— Seu Nível de Aptidão em Aura aumenta em +1.
— Ao subir de nível, o aumento de energia é atualizado.

 Raio Negro:
O Kokusen não é consciente; ele ocorre apenas em momentos específicos.
— Ao tirar 20 natural em um ataque corpo a corpo, o golpe se torna um Kokusen.
— O golpe causa dano adicional igual à metade do total obtido na rolagem de dano (total × 1,5).
— Dano Após Ataque é aplicado depois do Kokusen.
— O dano ignora qualquer tipo de resistência ou redução.

• Estado de Consciência Absoluta:
Após ativar um Kokusen, você entra em um estado de foco extremo, extraindo 120% do seu potencial.
— Durante 1 rodada, o valor necessário para ativar Kokusen reduz em 1.
— Caso ative outro Kokusen nesse período, a duração é renovada e o valor necessário reduz novamente.
— O valor pode ser reduzido um número de vezes igual à metade do seu Nível de Aptidão em Controle e Leitura.

[Pré-Requisito: Nível de Aptidão em Controle e Leitura 3, Força ou Destreza 16 e Nível 10]`
},

{
    nome: "Abençoado pelas Faíscas Negras",
    categoria: "Especial",
    desc: `Embora o Raio Negro seja originalmente incontrolável, você passa a atrair as Faíscas Negras com maior frequência, sendo abençoado por elas.

Melhorias:

 Você ativa Kokusen com 19 ou 20 natural no dado.
 Enquanto estiver em Estado de Consciência Absoluta, pode reduzir o valor necessário para Kokusen uma vez adicional além do limite normal.
 Após acertar um Kokusen, você recebe:
  — Bônus nas jogadas de ataque igual à metade do seu Nível de Aptidão em Controle e Leitura.
  — Bônus nas rolagens de dano igual ao seu Nível total de Aptidão.
  — Esses bônus duram pelo restante da cena.

[Pré-Requisito: Raio Negro, Nível de Aptidão em Controle e Leitura 4, Nível de Aptidão em Aura 3 e Nível 15]`
},

{
    nome: "Domínio Simples",
    categoria: "Especial",
    desc: `Originalmente conhecido como "Domínio dos Fracos”, o Domínio Simples cria uma barreira ao redor do usuário junto ao seu próprio domínio, neutralizando os efeitos e o Acerto Garantido de uma Expansão de Domínio.

Ativação:
 Como Reação ao ser alvo de uma Expansão de Domínio.
 Ou como Ação Bônus no seu turno.
 Custo: 5 PE.

Efeito:
Você cria uma esfera ao seu redor com raio de:
1,5m + (Nível de Aptidão em Domínio x 1,5m).

Você e todas as criaturas dentro da área:
— Não são afetadas pelo Acerto Garantido.
— Ignoram os efeitos ambientais da Expansão de Domínio ativa.

Mecânica:
 Exige Concentração.
 Possui Durabilidade igual a: Nível de Aptidão em Barreira + 1.

Regras de Deterioração:
— Sempre que falhar em um teste de Concentração, a Durabilidade diminui em 1.
— No início do seu turno, se você deveria ter sido atingido por um Acerto Garantido, o Domínio Simples perde 1 de Durabilidade.
— Sempre que perder 1 ponto de Durabilidade, o raio da área é reduzido em 1,5m.

Quebra:
Se a Durabilidade ou a Área chegarem a 0:
— O Domínio Simples se rompe.
— Você e todas as criaturas dentro da área sofrem imediatamente o Acerto Garantido.

[Pré-Requisito: Nível de Aptidão em Barreira 1 e Nível 5]`
},

{
    nome: "Reversão de Técnica",
    categoria: "Especial",
    desc: `Por meio de um processo complexo, você aprende a utilizar Energia Reversa para alimentar sua técnica, produzindo um efeito oposto ao original e de maior potência.

Ao adquirir esta aptidão:

 Sempre que obtiver um novo Feitiço, você pode optar por criar uma Reversão de Técnica em vez de um feitiço comum.
 Uma Reversão:
  — Possui custo aumentado em um valor igual ao nível do Feitiço.
  — Deve obrigatoriamente inverter o conceito base da técnica original.
    (Exemplo: uma técnica que puxa pode passar a empurrar.)

 Ao obter esta aptidão, você recebe imediatamente um Feitiço adicional, que obrigatoriamente deve ser uma Reversão de Técnica.

[Pré-Requisito: Energia Reversa e Nível 12]`
},
{
    nome: "Técnica Máxima",
    categoria: "Especial",
    desc: `Entre os feiticeiros jujutsu, poucos conseguem levar sua técnica ao ápice absoluto, criando uma habilidade definitiva derivada dela. A Técnica Máxima representa a expressão suprema da sua arte.

Ao adquirir esta aptidão:

 Você pode criar uma Técnica Máxima.
 Você recebe um novo Feitiço que:
  — Caso tenha acesso apenas até Feitiços de Nível 4, utiliza os valores de Nível 5 para sua criação.
  — Quando passar a ter acesso a Feitiços de Nível 5, sua Técnica Máxima passa a utilizar os valores próprios desse nível.

Regras de Uso:
 Custo: 25 PE.
 Após utilizar a Técnica Máxima, você deve esperar um número de rodadas igual a:
  6  metade do seu Bônus de Treinamento
  antes de poder usá-la novamente.

[Pré-Requisito: Mestre em Feitiçaria, Capacidade de Conjurar Feitiços Nível 4]`
}

];

let categoriaAptAtiva = "Todos";
let container = document.getElementById('conteudo-biblioteca-apt');

// Registrar listener **uma vez** fora da renderização
if (container) {
    container.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-add-bib');
        if (!btn) return;
        e.stopPropagation();
        const nome = decodeURIComponent(btn.dataset.nome);
        const desc = decodeURIComponent(btn.dataset.desc);
        adicionarAptidao(nome, desc);
    });
}

/* RENDER COMPÊNDIO */
function renderizarCompendioAptidoes() {
    if (!container) return;
    container.innerHTML = '';

    const filtradas = compendioAptidoes.filter(apt => {
        return categoriaAptAtiva === "Todos" || apt.categoria === categoriaAptAtiva;
    });

    filtradas.forEach(apt => {
        const idLimpo = apt.nome.replace(/\s+/g, '-').toLowerCase();

        container.innerHTML += `
            <div class="hab-card-compendio" id="apt-${idLimpo}">
                <div class="hab-header-compendio" onclick="this.parentElement.classList.toggle('open')">
                    <div class="hab-title-compendio">
                        <i class="fas fa-chevron-right hab-arrow-compendio"></i>
                        <span>${apt.nome}</span>
                    </div>
                    <button class="btn-add-bib" 
                        data-nome="${encodeURIComponent(apt.nome)}" 
                        data-desc="${encodeURIComponent(apt.desc)}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="hab-body-compendio">
                    <div class="hab-inner-compendio">
                        <div class="hab-desc-text">${apt.desc}</div>
                    </div>
                </div>
            </div>
        `;
    });
}

/* ADICIONAR APTIDÃO */
window.adicionarAptidao = function(nome, desc) {
    // Remove verificação de repetido
    minhasAptidoes.push({ nome, desc });
    salvarAptidoes();
    renderizarListaAptidoes();
    fecharModalAptidoes();
};

/* SALVAR NO LOCALSTORAGE */
function salvarAptidoes() {
    let dados = JSON.parse(localStorage.getItem('personagem_atual')) || {};
    dados.aptidoes_lista = minhasAptidoes;
    localStorage.setItem('personagem_atual', JSON.stringify(dados));
}

/* RENDER LISTA DE APTIDÕES */
window.renderizarListaAptidoes = function() {
    const lista = document.getElementById('lista-minhas-aptidoes');

    if (minhasAptidoes.length === 0) {
        lista.innerHTML = '<p style="color:#666; text-align:center;">Nenhuma aptidão.</p>';
        return;
    }

    lista.innerHTML = '';
    minhasAptidoes.forEach((apt, i) => {
        lista.innerHTML += `
            <div class="habilidade-card" onclick="toggleHabilidade(this)" style="cursor:pointer;">
                <div class="habilidade-header-content">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fas fa-chevron-right arrow-icon" style="color:#00bfff; font-size:0.7rem;"></i>
                        <span style="color:#fff; font-size:0.85rem; font-weight:bold; text-transform:uppercase;">${apt.nome}</span>
                    </div>
                </div>
                
                <div class="habilidade-desc-container" style="display:none; margin-top:8px; border-top:1px solid #333; padding-top:8px;">
                    <p style="color:#ccc; font-size:0.8rem;">${apt.desc}</p>
                    <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                        <button onclick="event.stopPropagation(); removerApt(${i})" style="background:none; border:1px solid #ff2f92; color:#ff2f92; padding:2px 6px; font-size:0.65rem;">REMOVER</button>
                    </div>
                </div>
            </div>
        `;
    });
};

/* REMOVER APTIDÃO */
window.removerApt = function(index) {
    minhasAptidoes.splice(index, 1);
    salvarAptidoes();
    renderizarListaAptidoes();
};

/* ADICIONAR MANUALMENTE */
window.salvarAptidaoManual = function() {
    const nome = document.getElementById('manual-apt-nome').value.trim();
    const desc = document.getElementById('manual-apt-desc').value.trim();

    if (nome && desc) {
        minhasAptidoes.push({ nome, desc });
        salvarAptidoes();
        renderizarListaAptidoes();
        document.getElementById('modal-nova-apt-manual').style.display = 'none';
    }
};

/* BUSCA NO COMPÊNDIO */
window.buscarNoCompendioApt = function() {
    const termo = document.getElementById('input-busca-apt').value.toLowerCase();
    const cards = document.querySelectorAll('#conteudo-biblioteca-apt .hab-card-compendio');

    cards.forEach(card => {
        const nome = card.querySelector('span').innerText.toLowerCase();
        card.style.display = nome.includes(termo) ? "block" : "none";
    });
};

/* FILTRO POR CATEGORIA */
window.filtrarCompendioApt = function(categoria, botao) {
    categoriaAptAtiva = categoria;
    document.querySelectorAll('.tab-apt').forEach(btn => btn.classList.remove('active'));
    botao.classList.add('active');
    renderizarCompendioAptidoes();
};

/* ATUALIZAR NÍVEIS */
function atualizarNiveisAptidoes() {
    document.getElementById("nivel-aura").textContent = personagem.nivelAura || 0;
    document.getElementById("nivel-controle").textContent = personagem.nivelControle || 0;
    document.getElementById("nivel-dominio").textContent = personagem.nivelDominio || 0;
    document.getElementById("nivel-barreira").textContent = personagem.nivelBarreira || 0;
    document.getElementById("nivel-reversa").textContent = personagem.nivelReversa || 0;
    document.getElementById("nivel-especial").textContent = personagem.nivelEspecial || 0;
}

/* ALTERAR NÍVEL */
function alterarNivel(id, valor) {
    const input = document.getElementById(id);
    let atual = parseInt(input.value) || 0;
    const limiteMaximo = 5;
    const limiteMinimo = 0;
    let novoValor = atual + valor;
    if (novoValor > limiteMaximo) novoValor = limiteMaximo;
    if (novoValor < limiteMinimo) novoValor = limiteMinimo;
    input.value = novoValor;
    atualizarTudo(); // chama o sistema principal da ficha
}



//SHIKIGAMIS MODAL






/* ==========================================================================
   SISTEMA DE SHIKIGAMIS - VERSÃO DEFINITIVA COMPLETA
   ========================================================================== */

const compendioShikigamis = [
{
    nome: "Cãe Divinos",
    titulo: "Shikigami Canino",
    categoria: "Dez Sombras",
    nd: 4,

    tamanho: "Médio",
    movimento: "9 Metros",

    pv: { normal: 19, dificil: 19 },
    defesa: 15,

    atributos: { for:8, dex:16, con:16, int:6, sab:6, car:6 },

    resistencias: {
        fort: 6,
        reflexos: 6,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 6,
    atencao: 6,

    periciasBonus: 6,
    rdGeral: 0,

    acoes: [
        {
            nome:"Mordida",
            ataque:6,
            dano:"1d8+3",
            descricao:"Avança contra o alvo e causa dano perfurante."
        }
    ],

    caracteristicas: [
        "Combate Grupal: Recebe +2 em ataques se houver aliado a 3m.",
        "Rastreio: Pode rastrear um alvo por 1 hora se tiver seu rastro de energia."
    ]
},

{
    nome: "Gamma O Sapo",
    titulo: "Sapo de Suporte",
    categoria: "Dez Sombras",
    nd: 4,

    tamanho: "Médio",
    movimento: "9 Metros",

    pv: { normal: 19, dificil: 19 },
    defesa: 12,

    atributos: { for:14, dex:10, con:16, int:6, sab:6, car:6 },

    resistencias: {
        fort: 6,
        reflexos: 0,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 0,
    atencao: 6,

    periciasBonus: 5,
    rdGeral: 0,

    acoes: [
        {
            nome:"Puxar",
            ataque:5,
            descricao:"Puxa criatura em até 6m se acertar teste contra Defesa."
        },
        {
            nome:"Segurar",
            descricao:"Após Puxar, testa Atletismo vs Atletismo para deixar agarrado."
        }
    ],

    caracteristicas: [
        "Língua Poderosa: +2 em Atletismo para manter alvo agarrado."
    ]
},

{
    nome: "Nue",
    titulo: "Ave Eletrizante",
    categoria: "Dez Sombras",
    nd: 3,

    tamanho: "Médio",
    movimento: "9 Metros (Voo)",

    pv: { normal: 33, dificil: 33 },
    defesa: 20,

    atributos: { for:8, dex:20, con:16, int:6, sab:6, car:9 },

    resistencias: {
        fort: 0,
        reflexos: 10,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 10,
    atencao: 6,

    periciasBonus: 10,
    rdGeral: 0,

    acoes: [
        {
            nome:"Descarga de Energia",
            ataque:10,
            dano:"1d12+5",
            descricao:"Ataque à distância até 9m. Dano chocante."
        },
        {
            nome:"Acúmulo de Carga",
            descricao:"Armazena +1d6 dano chocante extra para próxima descarga."
        }
    ],

    caracteristicas: [
        "Armazenar Energia: Se sofrer dano chocante, pode armazenar +1d6 por 2 rodadas.",
        "Alado: Movimento de voo."
    ]
},

{
    nome: "Orochi A Grande Serpente",
    titulo: "Serpente Venenosa",
    categoria: "Dez Sombras",
    nd: 3,

    tamanho: "Grande",
    movimento: "9 Metros",

    pv: { normal: 35, dificil: 35 },
    defesa: 14,

    atributos: { for:16, dex:9, con:20, int:6, sab:6, car:6 },

    resistencias: {
        fort: 10,
        reflexos: 0,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 0,
    atencao: 6,

    periciasBonus: 8,
    rdGeral: 0,

    acoes: [
        {
            nome:"Bote Venenoso",
            ataque:8,
            dano:"1d12+3",
            descricao:"Avança até 9m e causa dano venenoso."
        },
        {
            nome:"Entrelaçar",
            descricao:"Teste Atletismo vs Atletismo para deixar alvo agarrado."
        }
    ],

    caracteristicas: [
        "Golpe Ardiloso: Ao ser invocado, força teste de Reflexos ou alvo fica desprevenido.",
        "Físico Aprimorado: +4 em Atletismo para manter alvo agarrado."
    ]
},

{
    nome: "Elefante Abundante",
    titulo: "Elefante das Águas",
    categoria: "Dez Sombras",
    nd: 2,

    tamanho: "Grande",
    movimento: "9 Metros",

    pv: { normal: 59, dificil: 59 },
    defesa: 24,

    atributos: { for:20, dex:10, con:20, int:6, sab:6, car:6 },

    resistencias: {
        fort: 13,
        reflexos: 0,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 0,
    atencao: 6,

    periciasBonus: 13,
    rdGeral: 0,

    acoes: [
        {
            nome:"Enxurrada",
            dano:"1d10+5",
            descricao:"Cone de 4,5m. Criaturas fazem TR de Reflexos. Dano de impacto em falha."
        },
        {
            nome:"Tromba D’água",
            descricao:"Aumenta alcance da Enxurrada para 6m e cria terreno difícil por 1 rodada."
        },
        {
            nome:"Queda",
            dano:"2d8+5",
            descricao:"Invocado em queda. Alvo testa Fortitude. +1d6 a cada 3m acima do alvo."
        }
    ],

    caracteristicas: [
        "Defesa Alternativa: Usa Constituição no lugar de Destreza na Defesa.",
        "Criatura de Massa: Pode ser invocado de cima causando dano adicional."
    ]
},

{
    nome: "Fuga Dos Coelhos",
    titulo: "Lutador Energético",
    categoria: "Dez Sombras",
    nd: 2,

    tamanho: "Médio",
    movimento: "18 Metros",

    pv: { normal: 59, dificil: 59 },
    defesa: 24,

    atributos: { for:10, dex:20, con:20, int:6, sab:6, car:6 },

    resistencias: {
        fort: 0,
        reflexos: 13,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 13,
    atencao: 6,

    periciasBonus: 13,
    rdGeral: 0,

    acoes: [
        {
            nome:"Golpe de Karatê",
            ataque:13,
            dano:"2d8+5",
            descricao:"Avança até 15m e causa dano energético."
        },
        {
            nome:"Natureza Estimuladora",
            dano:"4d6",
            descricao:"Adiciona 4d6 ao Golpe de Karatê e é desinvocado após o ataque."
        }
    ],

    caracteristicas: [
        "Raio Negro: Em 20 natural causa dano crítico máximo.",
        "Movimentação Ágil: +9m de deslocamento."
    ]
},

{
    nome: "O Boi Perfurante",
    titulo: "Besta de Investida",
    categoria: "Dez Sombras",
    nd: 2,

    tamanho: "Grande",
    movimento: "18 Metros",

    pv: { normal: 59, dificil: 59 },
    defesa: 19,

    atributos: { for:20, dex:10, con:20, int:6, sab:6, car:6 },

    resistencias: {
        fort: 13,
        reflexos: 0,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 0,
    atencao: 6,

    periciasBonus: 13,
    rdGeral: 0,

    acoes: [
        {
            nome:"Investida Perfurante",
            ataque:13,
            dano:"2d8+5",
            descricao:"Avança até o alvo e causa dano perfurante."
        },
        {
            nome:"Levantar",
            descricao:"Após Investida, alvo testa Fortitude ou fica caído."
        }
    ],

    caracteristicas: [
        "Massa e Aceleração: +1d4+1 dano a cada 3m percorridos (limite = mod Força).",
        "Disparador Natural: +9m de deslocamento."
    ]
},

{
    nome: "Tigre Mórbido",
    titulo: "Arauto da Morte",
    categoria: "Dez Sombras",
    nd: 1,

    tamanho: "Grande",
    movimento: "21 Metros",

    pv: { normal: 81, dificil: 81 },
    defesa: 29,

    atributos: { for:10, dex:22, con:22, int:6, sab:6, car:6 },

    resistencias: {
        fort: 0,
        reflexos: 17,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 17,
    atencao: 6,

    periciasBonus: 17,
    rdGeral: 0,

    acoes: [
        {
            nome:"Garras Malditas",
            ataque:17,
            dano:"2d12+6",
            descricao:"Avança até o alcance do deslocamento e causa dano necrótico."
        },
        {
            nome:"Expelir Morte",
            descricao:"Alvo em até 21m testa Reflexos ou fica Envenenado por 2 rodadas."
        }
    ],

    caracteristicas: [
        "Arauto do Funeral: Alvos só podem curar metade do dano sofrido por Kosō por 1 rodada.",
        "Montaria: Pode carregar criaturas menores.",
        "Abastecido pela Morte: Ao finalizar criatura recebe +6 em ataques por 1 rodada.",
        "Movimentação Ágil: +12m de deslocamento."
    ]
},

{
    nome: "Cervo Circular",
    titulo: "Arauto dos Vivos",
    categoria: "Dez Sombras",
    nd: 1,

    tamanho: "Médio",
    movimento: "9 Metros",

    pv: { normal: 81, dificil: 81 },
    defesa: 23,

    atributos: { for:6, dex:10, con:22, int:6, sab:22, car:6 },

    resistencias: {
        fort: 17,
        reflexos: 0,
        vontade: 0,
        astucia: 17
    },

    iniciativa: 0,
    atencao: 22,

    periciasBonus: 17,
    rdGeral: 0,

    acoes: [
        {
            nome:"Cura Concentrada",
            cura:"1d12+1d8+6",
            descricao:"Cura um alvo com energia reversa."
        },
        {
            nome:"Liberação de Energia Reversa",
            cura:"1d8+6",
            descricao:"Cura aliados em área de 6m."
        }
    ],

    caracteristicas: [
        "Fluxo Reverso: Objetos e aliados em 3m recebem +6 contra técnicas amaldiçoadas.",
        "Pronto Socorro: Pode conceder vantagem a criatura nos Portões da Morte.",
        "Arauto dos Vivos: Pode remover condição forte ao invés de curar."
    ]
},


{
    nome: "Divino General Imoral da Espada de Oito Cabos Mahoraga",
    titulo: "General Divino (Dez Sombras)",
    categoria: "Dez Sombras",
    nd: 0,

    tamanho: "Grande",
    movimento: "9 Metros",

    pv: { normal: 122, dificil: 122 },
    defesa: 37,

    atributos: { for:28, dex:14, con:28, int:6, sab:6, car:6 },

    resistencias: {
        fort: 22,
        reflexos: 0,
        vontade: 0,
        astucia: 0
    },

    iniciativa: 0,
    atencao: 6,

    periciasBonus: 22,
    rdGeral: 0,

    acoes: [
        {
            nome:"Golpe Com Punho",
            ataque:22,
            dano:"2d12+1d10+18",
            descricao:"Ataque corpo a corpo até 3m. Dano de impacto."
        },
        {
            nome:"Lâmina Nirvana",
            ataque:22,
            dano:"2d12+1d10+18",
            descricao:"Ataque corpo a corpo até 3m. Dano de energia reversa ou cortante."
        },
        {
            nome:"Regeneração",
            cura:"2d12+1d6+18",
            descricao:"Recupera pontos de vida."
        }
    ],

    caracteristicas: [
        "Dharma Adaptativo: Possui sistema adaptativo explicado na descrição completa do Dharma."
    ]
},
{
    nome: "Rika Orimoto",
    titulo: "A Rainha das Maldições (Calamidade)",
    categoria: "Espírito Amaldiçoado",
    nd: 20,

    tamanho: "Enorme",
    movimento: "18 Metros",

    pv: { normal: 1600, dificil: 1600 },
    defesa: 50,
    pe: 50, // Pontos de Energia específicos dela

    atributos: { for: 30, dex: 28, con: 30, int: 26, sab: 28, car: 20 },

    resistencias: {
        fort: 31,
        reflexos: 18,
        vontade: 18,
        astucia: 18
    },

    iniciativa: 24,
    atencao: 44,

    periciasBonus: 45, // Bônus base de Corpo a Corpo / Atletismo
    rdGeral: 0, // Resistência a Danos Físicos (mencionado no texto)

    acoes: [
        {
            nome: "Mordida",
            ataque: 60,
            dano: "9d10+71",
            descricao: "Alcance de 4.5m. Dano perfurante."
        },
        {
            nome: "Soco",
            ataque: 60,
            dano: "9d10+71",
            descricao: "Alcance de 4.5m. Dano de Impacto."
        },
        {
            nome: "Disparo de Energia",
            custo: "5 PE",
            ataque: 60,
            dano: "12d10+60",
            descricao: "Alcance de 36m. Dano energético."
        },
        {
            nome: "Repor Energia",
            descricao: "Recupera PE do portador igual a metade do nível dele (1x por Descanso Longo)."
        },
        {
            nome: "Amor Mútuo",
            custo: "20 PE",
            dano: "20d12+90",
            descricao: "Linha de 24m (6m largura). TR Fortitude reduz metade. Causa Ferida Extrema. (Uso único permanente)."
        }
    ],

    caracteristicas: [
        "Armazém Amaldiçoado: Armazena itens (limite = Mod. FOR). Pode retirar itens mesmo sem invocá-la.",
        "Proteção Apaixonada: Se o portador chegar a 0 PV, Rika nega o dano por completo (1x por Descanso Curto/Longo). Ativa mesmo não invocada.",
        "Resistências: Resistência a Danos Físicos."
    ]
}
];

/* ===========================
   LOCAL STORAGE
=========================== */

function getShikigamis(){
    const p = JSON.parse(localStorage.getItem("personagem_atual")) || {};
    if(!p.shikigamis) p.shikigamis = [];
    return p.shikigamis;
}

function salvarShikigamis(arr){
    const p = JSON.parse(localStorage.getItem("personagem_atual")) || {};
    p.shikigamis = arr;
    localStorage.setItem("personagem_atual", JSON.stringify(p));
}

/* ===========================
   RENDER PRINCIPAL
=========================== */

function renderizarMeusShikigamis(){
    const lista = document.getElementById("lista-shikigamis");
    if(!lista) return;

    const shks = getShikigamis();
    lista.innerHTML = "";

    shks.forEach((shk,i)=>{

        if(shk.pvAtual === undefined && shk.pv?.normal){
            shk.pvAtual = shk.pv.normal;
        }

        lista.innerHTML += `
        <div style="margin-bottom:15px;border:1px solid #252525;background:#121214;">
            <div onclick="toggleFicha(${i})"
                 style="padding:15px;cursor:pointer;display:flex;justify-content:space-between;">
                <span style="color:white;font-weight:900;">
                    <i id="seta-${i}" class="fas fa-chevron-right"
                       style="color:#ff0000;margin-right:8px;"></i>
                    ${shk.nome}
                </span>
                <span style="color:#ff0000;font-size:0.7rem;">
                    ${shk.categoria}
                </span>
            </div>

            <div id="ficha-${i}" style="display:none;padding:20px;" onclick="event.stopPropagation()">
                ${montarFichaShikigami(shk,i)}
                <div style="text-align:right;margin-top:10px;">
                    <button onclick="removerShikigami(${i})"
                        style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">
                        [ DISPENSAR ]
                    </button>
                </div>
            </div>
        </div>
        `;
    });

    salvarShikigamis(shks);
}

function toggleFicha(i){
    const ficha = document.getElementById(`ficha-${i}`);
    const seta = document.getElementById(`seta-${i}`);

    if(ficha.style.display === "none"){
        ficha.style.display = "block";
        seta.style.transform = "rotate(90deg)";
    } else {
        ficha.style.display = "none";
        seta.style.transform = "rotate(0deg)";
    }
}

function removerShikigami(i){
    if(!confirm("Remover invocação?")) return;
    const arr = getShikigamis();
    arr.splice(i,1);
    salvarShikigamis(arr);
    renderizarMeusShikigamis();
}

/* ===========================
   ADICIONAR DO COMPÊNDIO
=========================== */

function adicionarShikigami(index){

    const base = compendioShikigamis[index];
    if(!base) return;

    const copia = JSON.parse(JSON.stringify(base));
    copia.pvAtual = copia.pv?.normal || 0;

    const arr = getShikigamis();
    arr.push(copia);

    salvarShikigamis(arr);
    renderizarMeusShikigamis();
}

/* ===========================
   FICHA VISUAL
=========================== */

function montarFichaShikigami(shk,index){

    const porcentagem = shk.pv?.normal
        ? (shk.pvAtual / shk.pv.normal) * 100
        : 0;

    return `
    <div class="shiki-ficha">

        <div style="margin-bottom:20px;">
<div class="titulo">
    ${shk.nome}
</div>
<div class="subtitulo">
    ${shk.titulo ?? ""} • ND ${shk.nd ?? "-"}
</div>
        </div>

        <div style="color:white;margin-bottom:10px;">
            <b>Pontos de Vida:</b> ${shk.pv?.normal ?? "-"}
            ${shk.pv?.dificil ? `( ${shk.pv.dificil} no modo difícil )` : ""}
            | <b>Defesa:</b> ${shk.defesa ?? "-"}
        </div>

        <div style="color:white;margin-bottom:10px;">
            <b>Tamanho:</b> ${shk.tamanho ?? "-"} |
            <b>Movimento:</b> ${shk.movimento ?? "-"}
        </div>

        ${shk.pv?.normal ? `
        <div style="margin-bottom:20px;">
<div style="display:flex;justify-content:space-between;align-items:center;color:white;font-weight:900;">
    <span>HP Atual</span>
    <div>
        <input 
            type="number"
            value="${shk.pvAtual}"
            min="0"
            max="${shk.pv.normal}"
            onchange="editarHP(${index}, this.value)"
            onclick="event.stopPropagation()"
            style="
                width:70px;
                background:#111;
                border:1px solid #ff0000;
                color:white;
                text-align:center;
                padding:4px;
                font-weight:900;
            ">
        / ${shk.pv.normal}
    </div>
</div>

            <div style="background:#222;height:16px;border-radius:4px;margin-top:6px;overflow:hidden;">
<div class="barra-hp" style="
    height:100%;
    width:${porcentagem}%;
    background:${porcentagem > 50 ? '#ff0000' : '#ff4d4d'};
    transition:0.3s;">
</div>
            </div>

            <div style="display:flex;gap:5px;margin-top:10px;">
                <button onclick="alterarHP(${index}, -10)"
                    style="flex:1;background:#ff4d4d;border:none;color:white;cursor:pointer;">-10</button>
                <button onclick="alterarHP(${index}, 10)"
                    style="flex:1;background:#00ff88;border:none;color:black;cursor:pointer;">+10</button>
            </div>
        </div>
        ` : ""}

        ${montarAtributos(shk.atributos)}

        <div style="color:white;margin-top:15px;">
            <b>Testes de Resistência:</b>
            Astúcia +${shk.resistencias?.astucia ?? "-"},
            Fortitude +${shk.resistencias?.fort ?? "-"},
            Reflexos +${shk.resistencias?.reflexos ?? "-"},
            Vontade +${shk.resistencias?.vontade ?? "-"}
        </div>

        <div style="color:white;margin-top:8px;">
            <b>Iniciativa:</b> +${shk.iniciativa ?? "-"} |
            <b>Atenção:</b> ${shk.atencao ?? "-"}
        </div>

        <div style="color:white;margin-top:8px;">
            <b>Perícias:</b> +${shk.periciasBonus ?? "-"} em todas |
            <b>Resistência:</b> ${shk.rdGeral ?? "-"} RD Geral
        </div>

       ${shk.caracteristicas ? `
<div style="margin-top:20px;">
    <div style="color:#ff0000;font-weight:900;margin-bottom:8px;">
        CARACTERÍSTICAS
    </div>
    ${shk.caracteristicas.map(c=>`
        <div style="color:#ccc;margin-bottom:6px;">
            • ${c}
        </div>
    `).join("")}
</div>
` : ""}

<div style="margin-top:20px;">
    <div style="color:#ff0000;font-weight:900;margin-bottom:8px;">
        AÇÕES
    </div>
    ${montarAcoes(shk.acoes,index)}
</div>

    </div>
    `;
}

/* ===========================
   ATRIBUTOS
=========================== */

function montarAtributos(atr){
    if(!atr) return "";

    let html = `<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;">`;

    for(let key in atr){
        const val = atr[key];
        const mod = Math.floor((val-10)/2);

        html += `
        <div style="background:#111;padding:10px;text-align:center;border:1px solid #ff0000;">
            <div style="color:#ff0000;font-size:0.7rem;font-weight:900;">
                ${key.toUpperCase()}
            </div>
            <div style="color:white;font-size:1.2rem;font-weight:900;">
                ${val}
            </div>
            <div style="color:#888;font-size:0.8rem;">
                ${mod>=0?'+':''}${mod}
            </div>
        </div>
        `;
    }

    html += `</div>`;
    return html;
}

/* ===========================
   AÇÕES
=========================== */

function montarAcoes(acoes,index){
    if(!acoes) return "Nenhuma ação.";

    let html = "";

    acoes.forEach(a=>{

        html += `
        <div style="background:#111;padding:12px;margin-bottom:8px;border:1px solid #ff0000;">
            <div style="color:white;font-weight:800;">
                • ${a.nome}
            </div>
        `;

        if(a.dano){
            html += `
            <div style="color:#ff4d4d;">
                +${a.ataque} para acertar | ${a.dano}
            </div>
            <div style="color:#aaa;font-size:0.85rem;">
                ${a.descricao ?? ""}
            </div>
            <button onclick="rolarDanoDireto('${a.nome}','${a.dano}')"
                style="margin-top:6px;background:#ff0000;border:none;color:white;padding:4px 8px;cursor:pointer;">
                ROLAR DANO
            </button>
            `;
        }

        if(a.cura){
            html += `
            <div style="color:#00ff88;">
                Cura ${a.cura} PV
            </div>
            <div style="color:#aaa;font-size:0.85rem;">
                ${a.descricao ?? ""}
            </div>
<button 
    style="margin-top:6px;background:#00ff88;border:none;color:black;padding:4px 8px;cursor:pointer;"
    onclick="aplicarCuraFormula(${index}, '${a.cura}')">
    APLICAR CURA
</button>
            `;
        }

        html += `</div>`;
    });

    return html;
}

/* ===========================
   SISTEMA DE HP
=========================== */

function alterarHP(index, valor){
    const arr = getShikigamis();
    const shk = arr[index];

    shk.pvAtual += valor;

    if(shk.pvAtual > shk.pv.normal) shk.pvAtual = shk.pv.normal;
    if(shk.pvAtual < 0) shk.pvAtual = 0;

    salvarShikigamis(arr);

    atualizarHPVisual(index);
}

function alterarHPManual(index){
    const valor = parseInt(prompt("Digite valor (use negativo para dano):"));
    if(isNaN(valor)) return;
    alterarHP(index, valor);
}

function aplicarCuraFormula(index, formula) {
    const arr = getShikigamis();
    const shk = arr[index];
    if (!shk) return;

    // Rola a fórmula
    const resultado = calcularFormula(formula); 

    // Pega APENAS o número do total para a conta matemática
    const valorParaSomar = Number(resultado.total);

    // Soma e trava no limite máximo
    let novoPV = Number(shk.pvAtual) + valorParaSomar;
    const pvMax = Number(shk.pv.normal);
    
    shk.pvAtual = novoPV > pvMax ? pvMax : novoPV;

    salvarShikigamis(arr);
    atualizarHPVisual(index);

    // No log, passamos o resultado.total para o número grandão
    exibirLog(
        shk.nome + " - Regeneração",
        formula,
        resultado.bonus || 0,
        resultado.total
    );
}

/* ===========================
   ROLAR DANO
=========================== */

function rolarDanoDireto(nome, formula){

    const partes = formula.split("+");
    const dadosParte = partes[0];
    const bonus = partes[1] ? parseInt(partes[1]) : 0;

    const [quantidade, dado] = dadosParte.toLowerCase().split("d").map(Number);

    let total = 0;
    let resultados = [];

    for(let i=0; i<quantidade; i++){
        const roll = Math.floor(Math.random() * dado) + 1;
        resultados.push(roll);
        total += roll;
    }

    total += bonus;

    alert(
`${nome}
Rolagens: [${resultados.join(", ")}]
Bônus: +${bonus}
Total: ${total}`
    );
}

/* ===========================
   INIT
=========================== */

document.addEventListener("DOMContentLoaded", ()=>{
    renderizarMeusShikigamis();
});

/* ===========================
   MODAL COMPÊNDIO
=========================== */

function abrirCompendioShikigami(){
    const modal = document.getElementById("modal-biblioteca-shikigami");
    if(modal) modal.style.display = "flex";
    renderizarCompendioShikigami(compendioShikigamis);
}

function fecharModalShikigami(){
    const modal = document.getElementById("modal-biblioteca-shikigami");
    if(modal) modal.style.display = "none";
}

function renderizarCompendioShikigami(lista){

    const container = document.getElementById("conteudo-biblioteca-shikigami");
    container.innerHTML = "";

    lista.forEach((shikigami, index) => {

        const card = document.createElement("div");
        card.className = "card-compendio-shikigami";

        card.innerHTML = `
            <div class="comp-header">
                <div>
                    <h3>${shikigami.nome}</h3>
                    <span class="badge-categoria">${shikigami.categoria || "—"}</span>
                </div>
                <button onclick="adicionarShikigami(${index})">
                    + Adicionar
                </button>
            </div>

            <div class="comp-stats">
                <span><strong>ND:</strong> ${shikigami.nd || "-"}</span>
                <span><strong>PV:</strong> ${shikigami.pv?.normal || "-"}</span>
                <span><strong>Defesa:</strong> ${shikigami.defesa || "-"}</span>
            </div>
        `;

        container.appendChild(card);
    });
}

function buscarShikigamiCompendio(){
    const termo = document.getElementById("busca-shikigami").value.toLowerCase();
    const filtrados = compendioShikigamis.filter(s =>
        s.nome.toLowerCase().includes(termo)
    );
    renderizarCompendioShikigami(filtrados);
}

function filtrarCompendioShikigami(cat, btn){

    document.querySelectorAll(".tab-shikigami").forEach(b=>{
        b.style.background = "transparent";
        b.style.color = "#ccc";
        b.style.border = "1px solid #333";
    });

    btn.style.background = "#ff0000";
    btn.style.color = "white";
    btn.style.border = "none";

    if(cat === "Todos"){
        renderizarCompendioShikigami(compendioShikigamis);
    } else {
        const filtrados = compendioShikigamis.filter(s => s.categoria === cat);
        renderizarCompendioShikigami(filtrados);
    }
}

function editarHP(index, valor){
    const arr = getShikigamis();
    const shk = arr[index];

    let novoValor = parseInt(valor);
    if(isNaN(novoValor)) return;

    if(novoValor > shk.pv.normal) novoValor = shk.pv.normal;
    if(novoValor < 0) novoValor = 0;

    shk.pvAtual = novoValor;

    salvarShikigamis(arr);

    atualizarHPVisual(index);
}

function atualizarHPVisual(index){
    const arr = getShikigamis();
    const shk = arr[index];

    const porcentagem = (shk.pvAtual / shk.pv.normal) * 100;

    const input = document.querySelector(`#ficha-${index} input[type="number"]`);
    if(input) input.value = shk.pvAtual;

    const barra = document.querySelector(`#ficha-${index} .barra-hp`);
    if(barra){
        barra.style.width = porcentagem + "%";
        barra.style.background = porcentagem > 50 ? "#ff0000" : "#ff4d4d";
    }
}

/* ===========================
   MODAL NOVO SHIKIGAMI
=========================== */

function abrirModalNovoShikigami(){
    const modal = document.getElementById("modal-novo-shikigami");
    if(modal) modal.style.display = "flex";
}

function fecharModalNovoShikigami(){
    const modal = document.getElementById("modal-novo-shikigami");
    if(modal) modal.style.display = "none";
}


/* ===========================
   SALVAR MANUAL
=========================== */

function salvarShikigamiManual(){

    const nome = document.getElementById("nome-shikigami").value.trim();
    const categoria = document.getElementById("categoria-shikigami").value.trim();
    const descricao = document.getElementById("desc-shikigami").value.trim();

    if(!nome){
        alert("Digite um nome.");
        return;
    }

    const novo = {
        nome: nome,
        titulo: "Invocação Personalizada",
        categoria: categoria || "Personalizado",
        nd: "-",

        tamanho: "-",
        movimento: "-",

        pv: { normal: 100 },
        pvAtual: 100,

        defesa: "-",

        atributos: {
            for:10,
            dex:10,
            con:10,
            int:10,
            sab:10,
            car:10
        },

        resistencias: {
            fort: 0,
            reflexos: 0,
            vontade: 0,
            astucia: 0
        },

        iniciativa: 0,
        atencao: 0,
        periciasBonus: 0,
        rdGeral: 0,

        acoes: [],

        caracteristicas: descricao
            ? descricao.split("\n").filter(l=>l.trim() !== "")
            : ["Sem características definidas."]
    };

    const arr = getShikigamis();
    arr.push(novo);
    salvarShikigamis(arr);

    fecharModalNovoShikigami();
    renderizarMeusShikigamis();

    // limpar campos
    document.getElementById("nome-shikigami").value = "";
    document.getElementById("categoria-shikigami").value = "";
    document.getElementById("desc-shikigami").value = "";
}

function adicionarCampoAcao(){
    const container = document.getElementById("lista-acoes-novo");

    container.innerHTML += `
    <div style="border:1px solid #333;padding:10px;margin-bottom:10px;">
        <input class="acao-nome" placeholder="Nome da Ação"
            style="width:100%;margin-bottom:5px;background:#1a1a1a;border:1px solid #333;color:white;padding:5px;">
        <input class="acao-ataque" type="number" placeholder="+ Ataque"
            style="width:100%;margin-bottom:5px;background:#1a1a1a;border:1px solid #333;color:white;padding:5px;">
        <input class="acao-dano" placeholder="Dano (ex: 6d10+15)"
            style="width:100%;margin-bottom:5px;background:#1a1a1a;border:1px solid #333;color:white;padding:5px;">
        <input class="acao-desc" placeholder="Descrição"
            style="width:100%;background:#1a1a1a;border:1px solid #333;color:white;padding:5px;">
    </div>
    `;
}

function salvarNovoShikigamiCompleto(){

    const nome = document.getElementById("novo-nome").value.trim();
    if(!nome){ alert("Nome obrigatório"); return; }

    const novo = {
        nome: nome,
        titulo: "Criado Manualmente",
        categoria: document.getElementById("novo-categoria").value || "Personalizado",
        nd: document.getElementById("novo-nd").value || "-",

        tamanho: "-",
        movimento: document.getElementById("novo-movimento").value || "-",

        pv: { normal: parseInt(document.getElementById("novo-pv").value) || 100 },
        pvAtual: parseInt(document.getElementById("novo-pv").value) || 100,

        defesa: parseInt(document.getElementById("novo-defesa").value) || 10,

        atributos: {
            for: parseInt(document.getElementById("atr-for").value) || 10,
            dex: parseInt(document.getElementById("atr-dex").value) || 10,
            con: parseInt(document.getElementById("atr-con").value) || 10,
            int: parseInt(document.getElementById("atr-int").value) || 10,
            sab: parseInt(document.getElementById("atr-sab").value) || 10,
            car: parseInt(document.getElementById("atr-car").value) || 10
        },

        resistencias: { fort:0, reflexos:0, vontade:0, astucia:0 },

        iniciativa: 0,
        atencao: 0,
        periciasBonus: 0,
        rdGeral: 0,

        acoes: [],

        caracteristicas: document.getElementById("novo-caracteristicas").value
            .split("\n")
            .filter(l=>l.trim()!=="")
    };

    // coletar ações
    const nomes = document.querySelectorAll(".acao-nome");
    const ataques = document.querySelectorAll(".acao-ataque");
    const danos = document.querySelectorAll(".acao-dano");
    const descs = document.querySelectorAll(".acao-desc");

    for(let i=0;i<nomes.length;i++){
        if(nomes[i].value.trim() !== ""){
            novo.acoes.push({
                nome: nomes[i].value,
                ataque: parseInt(ataques[i].value) || 0,
                dano: danos[i].value,
                descricao: descs[i].value
            });
        }
    }

    const arr = getShikigamis();
    arr.push(novo);
    salvarShikigamis(arr);

    fecharModalNovoShikigami();
    renderizarMeusShikigamis();
}

function rolarFormula(formula){

    let total = 0;

    formula.split("+").forEach(parte => {

        parte = parte.trim();

        if(parte.includes("d")){
            const [qtd, faces] = parte.split("d").map(Number);

            for(let i=0;i<qtd;i++){
                total += Math.floor(Math.random()*faces)+1;
            }
        } else {
            total += Number(parte);
        }

    });

    return total;
}

//=======================================//
//           TREINAMENTO                 //
//======================================//
// ======================================
// DADOS DOS TREINOS
// ======================================

const TREINOS = [
{
    id: "agilidade",
    nome: "Treino de Agilidade",
    etapas: [
        { nome: "1° Etapa", beneficio: "Deslocamento +1,5m" },
        { nome: "2° Etapa", beneficio: "+2 em Acrobacia" },
        { nome: "3° Etapa", beneficio: "+2 em Iniciativa (Des 14)" },
        { nome: "4° Etapa", beneficio: "+2 em Reflexos (Des 16)" }
    ],
    bonusFinal: "Margem crítica Reflexos -2 e Deslocamento +4,5m"
},

{
    id: "barreiras",
    nome: "Treino de Barreiras",
    etapas: [
        { nome: "1° Etapa", beneficio: "Paredes +10 PV" },
        { nome: "2° Etapa", beneficio: "Aptidão em Barreiras +1" },
        { nome: "3° Etapa", beneficio: "Paredes +10 PV (Apt 2)" },
        { nome: "4° Etapa", beneficio: "+2 paredes máximas (Apt 3)" }
    ],
    bonusFinal: "Paredes recebem RD = Nível de Aptidão"
},

{
    id: "compreensao",
    nome: "Treino de Compreensão",
    etapas: [
        { nome: "1° Etapa", beneficio: "Máx. Energia Amaldiçoada +2" },
        { nome: "2° Etapa", beneficio: "+1 em Feitiçaria e Ocultismo" },
        { nome: "3° Etapa", beneficio: "Máx. Energia Amaldiçoada +3 (Aura 2)" },
        { nome: "4° Etapa", beneficio: "+2 em Feitiçaria e Ocultismo (Aura 3)" }
    ],
    bonusFinal: "Aumenta 1 nível de Aptidão à sua escolha."
},

{
    id: "controle-energia",
    nome: "Treino de Controle de Energia",
    etapas: [
        { nome: "1° Etapa", beneficio: "Máx. Energia Amaldiçoada +2" },
        { nome: "2° Etapa", beneficio: "Recebe 4 PE temporários ao iniciar combate" },
        { nome: "3° Etapa", beneficio: "Máx. Energia Amaldiçoada +3 (Controle e Leitura 2)" },
        { nome: "4° Etapa", beneficio: "Aumenta Aptidão em Controle e Leitura +1 (CL 3)" }
    ],
    bonusFinal: "No início de cada rodada em combate, ganha PE temporário = metade do bônus de treinamento."
},

{
    id: "dominios",
    nome: "Treino de Domínios",
    etapas: [
        { nome: "1° Etapa", beneficio: "+1 em confrontos de Expansão (Domínio Incompleto)" },
        { nome: "2° Etapa", beneficio: "Área da Expansão +3m" },
        { nome: "3° Etapa", beneficio: "+1 em confrontos de Expansão (Domínio Completo)" },
        { nome: "4° Etapa", beneficio: "Pode adicionar efeito extra na Expansão (Domínio 5)" }
    ],
    bonusFinal: "Recebe a Aptidão Amaldiçoada: Modificação Completa."
},

{
    id: "energia-reversa",
    nome: "Treino de Energia Reversa",
    etapas: [
        { nome: "1° Etapa", beneficio: "+1 gasto máximo em Aptidões de Energia Reversa" },
        { nome: "2° Etapa", beneficio: "Aptidão em Energia Reversa +1" },
        { nome: "3° Etapa", beneficio: "Regeneração Aprimorada -2 custo (ER 4)" },
        { nome: "4° Etapa", beneficio: "Fluxo Constante pode regenerar membros (ER 5)" }
    ],
    bonusFinal: "Pode curar exaustão de técnica da Expansão reduzindo 1 turno por 2 ER."
},

{
    id: "luta",
    nome: "Treino de Luta",
    etapas: [
        { nome: "1° Etapa", beneficio: "Dano desarmado +1 nível" },
        { nome: "2° Etapa", beneficio: "+2 Defesa e ações Agarrar/Derrubar/Empurrar" },
        { nome: "3° Etapa", beneficio: "Dano desarmado +1 nível (FOR ou DES 14)" },
        { nome: "4° Etapa", beneficio: "Dano desarmado +2 níveis (FOR ou DES 16)" }
    ],
    bonusFinal: "Recebe crítico em ataques desarmados e 1x por rodada pode ter vantagem em Acrobacia ou Atletismo."
},

{
    id: "manejo-arma",
    nome: "Treino de Manejo de Arma",
    etapas: [
        { nome: "1° Etapa", beneficio: "Torna-se treinado com uma arma (+2 dano se já for)" },
        { nome: "2° Etapa", beneficio: "+1 ataque com a arma escolhida" },
        { nome: "3° Etapa", beneficio: "Recebe efeito crítico da arma" },
        { nome: "4° Etapa", beneficio: "+1 ataque e +2 dano com a arma" }
    ],
    bonusFinal: "Arma recebe Encantamento adicional de ferramenta amaldiçoada."
},

{
    id: "pericia",
    nome: "Treino de Perícia",
    etapas: [
        { nome: "1° Etapa", beneficio: "Treinado em uma perícia (+1 se já for)" },
        { nome: "2° Etapa", beneficio: "2x por descanso pode testar com vantagem" },
        { nome: "3° Etapa", beneficio: "Torna-se mestre (+2 se já for)" },
        { nome: "4° Etapa", beneficio: "1x por cena sucesso garantido (não oposto)" }
    ],
    bonusFinal: "Se rolar menos que 5 no d20, pode rolar novamente e manter o melhor."
},

{
    id: "potencial-fisico",
    nome: "Treino de Potencial Físico",
    etapas: [
        { nome: "1° Etapa", beneficio: "Máx. Estamina +2" },
        { nome: "2° Etapa", beneficio: "+2 pontos em atributos físicos (Nv 4)" },
        { nome: "3° Etapa", beneficio: "Máx. Estamina +4" },
        { nome: "4° Etapa", beneficio: "Recebe uma Dádiva do Céu adicional" }
    ],
    bonusFinal: "No início de cada rodada em combate, ganha Estamina temporária = metade do bônus de treinamento."
},

{
    id: "resistencia",
    nome: "Treino de Resistência",
    etapas: [
        { nome: "1° Etapa", beneficio: "PV máximo +4" },
        { nome: "2° Etapa", beneficio: "+2 dados de vida por descanso" },
        { nome: "3° Etapa", beneficio: "+2 em Fortitude (CON 14)" },
        { nome: "4° Etapa", beneficio: "PV máximo +6 (CON 16)" }
    ],
    bonusFinal: "Margem crítica de Fortitude -2, ignora 1ª falha em teste de morte por cena e +10 PV máximo."
}

];


// ======================================
// RENDERIZAÇÃO
// ======================================

function renderTreinos() {

    const container = document.getElementById("lista-treinamentos");
    if (!container) return;

    container.innerHTML = "";

    TREINOS.forEach(treino => {

        const progressoSalvo = JSON.parse(localStorage.getItem(treino.id)) || [];

        const card = document.createElement("div");
        card.classList.add("card-treino");

        let etapasHTML = "";

        treino.etapas.forEach((etapa, index) => {

            const checked = progressoSalvo[index] ? "checked" : "";

            etapasHTML += `
                <label class="etapa">
                    <input type="checkbox" data-id="${treino.id}" data-index="${index}" ${checked}>
                    <div>
                        <strong>${etapa.nome}</strong><br>
                        <span>${etapa.beneficio}</span>
                    </div>
                </label>
            `;
        });

        const completo =
            progressoSalvo.length === treino.etapas.length &&
            progressoSalvo.every(v => v === true);

        card.innerHTML = `
            <h3>${treino.nome}</h3>
            ${etapasHTML}
            <div class="bonus-final ${completo ? "ativo" : ""}">
                Bônus Final: ${treino.bonusFinal}
            </div>
        `;

        container.appendChild(card);
    });

    ativarEventosTreino();
}


// ======================================
// EVENTOS + SALVAMENTO
// ======================================

function ativarEventosTreino() {

    const checkboxes = document.querySelectorAll("#lista-treinamentos input[type='checkbox']");

    checkboxes.forEach(checkbox => {

        checkbox.addEventListener("change", function () {

            const id = this.dataset.id;
            const index = this.dataset.index;

            let progresso = JSON.parse(localStorage.getItem(id)) || [];

            progresso[index] = this.checked;

            localStorage.setItem(id, JSON.stringify(progresso));

            renderTreinos();

        });

    });
}


// ======================================
// INICIALIZAÇÃO
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    renderTreinos();
});

function etapasTreino(idTreino) {
    const progresso = JSON.parse(localStorage.getItem(idTreino)) || [];
    return progresso.filter(v => v === true).length;
}

window.previewImage = function(event) {
    // 1. Verifica se o evento e o alvo existem
    if (!event || !event.target || !event.target.files) {
        console.warn("Nenhum arquivo detectado no evento.");
        return;
    }

    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const reader = new FileReader();
    const imageField = document.getElementById('view-img'); 

    // 2. Verifica se a tag de imagem existe no seu HTML
    if (!imageField) {
        console.error("Erro: Não encontrei nenhuma tag com o ID 'view-img' no seu HTML.");
        return;
    }

    reader.onload = function() {
        if (reader.readyState === 2) {
            imageField.src = reader.result;
            
            // 3. Salva no localStorage (se a variável 'dados' existir)
            if (typeof dados !== 'undefined') {
                dados.imagem = reader.result;
                localStorage.setItem('personagem_atual', JSON.stringify(dados));
                console.log("Foto da ficha atualizada e salva!");
            }
        }
    }

    reader.readAsDataURL(arquivo);
};