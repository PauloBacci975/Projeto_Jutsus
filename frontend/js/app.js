const API_URL = "http://localhost:8080/api/jutsus";

const form = document.getElementById("jutsuForm");
const busca = document.getElementById("busca");
const filtroNatureza = document.getElementById("filtroNatureza");
const filtroRank = document.getElementById("filtroRank");
const listaJutsus = document.getElementById("listaJutsus");
const listaStatus = document.getElementById("listaStatus");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnCancelar = document.getElementById("btnCancelar");
const formTitulo = document.getElementById("formTitulo");
const btnSalvar = document.getElementById("btnSalvar");
const formMensagem = document.getElementById("formMensagem");
const toast = document.getElementById("toast");

const modal = document.getElementById("modalDetalhes");
const fecharModal = document.getElementById("fecharModal");
const detalheNome = document.getElementById("detalheNome");
const detalheConteudo = document.getElementById("detalheConteudo");
const detalheEditar = document.getElementById("detalheEditar");

let jutsuSelecionado = null;
let debounceTimer = null;

document.addEventListener("DOMContentLoaded", carregarJutsus);
btnAtualizar.addEventListener("click", carregarJutsus);
busca.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(carregarJutsus, 250);
});
filtroNatureza.addEventListener("change", carregarJutsus);
filtroRank.addEventListener("change", carregarJutsus);
form.addEventListener("submit", salvarJutsu);
btnCancelar.addEventListener("click", cancelarEdicao);
fecharModal.addEventListener("click", fecharDetalhes);
detalheEditar.addEventListener("click", () => {
    if (jutsuSelecionado) {
        fecharDetalhes();
        editarJutsu(jutsuSelecionado.id);
    }
});

window.addEventListener("click", (event) => {
    if (event.target === modal) fecharDetalhes();
});

async function carregarJutsus() {
    listaStatus.className = "status loading";
    listaStatus.textContent = "Carregando Jutsus...";
    listaJutsus.innerHTML = "";

    const params = new URLSearchParams();

    if (busca.value.trim()) params.set("busca", busca.value.trim());
    if (filtroNatureza.value) params.set("natureza", filtroNatureza.value);
    if (filtroRank.value) params.set("rank", filtroRank.value);

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Não foi possível carregar os Jutsus.");
        }

        const jutsus = await response.json();

        if (jutsus.length === 0) {
            listaStatus.className = "status";
            listaStatus.textContent = "Nenhum Jutsu encontrado.";
            return;
        }

        listaStatus.classList.add("hidden");
        listaJutsus.innerHTML = jutsus.map(criarCard).join("");
    } catch (error) {
        listaStatus.className = "status error";
        listaStatus.textContent =
            "Não foi possível conectar ao backend. Verifique se o Spring Boot está executando na porta 8080.";
    }
}

function criarCard(jutsu) {
    return `
        <article class="jutsu-card">
            <h3>${escaparHtml(jutsu.nome)}</h3>
            <div class="card-meta">
                <div class="meta">
                    <small>ID</small>
                    <strong>#${jutsu.id}</strong>
                </div>
                <div class="meta">
                    <small>Rank</small>
                    <strong>${jutsu.rank}</strong>
                </div>
                <div class="meta">
                    <small>Natureza</small>
                    <strong>${nomeNatureza(jutsu.naturezaChakra)}</strong>
                </div>
                <div class="meta">
                    <small>Custo</small>
                    <strong>${jutsu.custoChakra} pts</strong>
                </div>
            </div>
            <div class="card-actions">
                <button class="secondary-button" onclick="verDetalhes(${jutsu.id})">Detalhes</button>
                <button class="secondary-button" onclick="editarJutsu(${jutsu.id})">Editar</button>
            </div>
        </article>
    `;
}

async function salvarJutsu(event) {
    event.preventDefault();
    limparErros();

    const dados = {
        nome: document.getElementById("nome").value.trim(),
        naturezaChakra: document.getElementById("natureza").value,
        rank: document.getElementById("rank").value,
        custoChakra: Number(document.getElementById("custoChakra").value)
    };

    if (!validarFormulario(dados)) return;

    const id = document.getElementById("jutsuId").value;
    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    btnSalvar.disabled = true;
    btnSalvar.textContent = id ? "Salvando..." : "Cadastrando...";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(resultado.message || "Não foi possível salvar o Jutsu.");
        }

        mostrarMensagem(id ? "Jutsu atualizado com sucesso!" : "Jutsu cadastrado com sucesso!", "success");
        mostrarToast(id ? "Jutsu atualizado." : "Jutsu cadastrado.");
        resetarFormulario();
        await carregarJutsus();
        window.location.hash = "inicio";
    } catch (error) {
        mostrarMensagem(error.message, "error");
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.textContent = id ? "Salvar alterações" : "Cadastrar Jutsu";
    }
}

function validarFormulario(dados) {
    let valido = true;

    if (!dados.nome) {
        mostrarErro("erroNome", "Informe o nome do Jutsu.");
        valido = false;
    }

    if (!dados.naturezaChakra) {
        mostrarErro("erroNatureza", "Selecione a natureza do chakra.");
        valido = false;
    }

    if (!dados.rank) {
        mostrarErro("erroRank", "Selecione o rank.");
        valido = false;
    }

    if (!Number.isInteger(dados.custoChakra) || dados.custoChakra < 0) {
        mostrarErro("erroCusto", "O custo deve ser um número inteiro maior ou igual a zero.");
        valido = false;
    }

    if (dados.rank === "S" && dados.custoChakra < 100) {
        mostrarErro("erroCusto", "Para Rank S, o custo mínimo é 100 pontos.");
        valido = false;
    }

    return valido;
}

async function verDetalhes(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Jutsu não encontrado.");

        const jutsu = await response.json();
        jutsuSelecionado = jutsu;

        detalheNome.textContent = jutsu.nome;
        detalheConteudo.innerHTML = `
            <div class="detail-item">
                <small>ID</small>
                <strong>#${jutsu.id}</strong>
            </div>
            <div class="detail-item">
                <small>Rank</small>
                <strong>${jutsu.rank}</strong>
            </div>
            <div class="detail-item">
                <small>Natureza do Chakra</small>
                <strong>${nomeNatureza(jutsu.naturezaChakra)}</strong>
            </div>
            <div class="detail-item">
                <small>Custo de Chakra</small>
                <strong>${jutsu.custoChakra} pontos</strong>
            </div>
        `;

        modal.classList.remove("hidden");
    } catch (error) {
        mostrarToast(error.message);
    }
}

async function editarJutsu(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Jutsu não encontrado.");

        const jutsu = await response.json();

        document.getElementById("jutsuId").value = jutsu.id;
        document.getElementById("nome").value = jutsu.nome;
        document.getElementById("natureza").value = jutsu.naturezaChakra;
        document.getElementById("rank").value = jutsu.rank;
        document.getElementById("custoChakra").value = jutsu.custoChakra;

        formTitulo.textContent = `Editar Jutsu #${jutsu.id}`;
        btnSalvar.textContent = "Salvar alterações";
        btnCancelar.classList.remove("hidden");
        limparMensagem();

        document.getElementById("cadastro").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
        mostrarToast(error.message);
    }
}

function cancelarEdicao() {
    resetarFormulario();
    mostrarToast("Edição cancelada.");
}

function resetarFormulario() {
    form.reset();
    document.getElementById("jutsuId").value = "";
    formTitulo.textContent = "Novo Jutsu";
    btnSalvar.textContent = "Cadastrar Jutsu";
    btnCancelar.classList.add("hidden");
    limparErros();
}

function limparErros() {
    document.querySelectorAll(".field-error").forEach(element => element.textContent = "");
}

function mostrarErro(id, mensagem) {
    document.getElementById(id).textContent = mensagem;
}

function mostrarMensagem(mensagem, tipo) {
    formMensagem.textContent = mensagem;
    formMensagem.className = `form-message ${tipo}`;
}

function limparMensagem() {
    formMensagem.textContent = "";
    formMensagem.className = "form-message hidden";
}

function mostrarToast(mensagem) {
    toast.textContent = mensagem;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
}

function fecharDetalhes() {
    modal.classList.add("hidden");
    jutsuSelecionado = null;
}

function nomeNatureza(valor) {
    const nomes = {
        FOGO: "Fogo",
        AGUA: "Água",
        VENTO: "Vento",
        TERRA: "Terra",
        RAIO: "Raio"
    };
    return nomes[valor] || valor;
}

function escaparHtml(valor) {
    return String(valor)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

window.verDetalhes = verDetalhes;
window.editarJutsu = editarJutsu;
