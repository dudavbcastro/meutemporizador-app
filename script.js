let tempoRestanteMs = 0;
let horarioTermino = null;
let intervaloId = null;
let rodando = false;
let sessaoIniciada = false;

const timerElemento = document.getElementById("timer");
const inputMinutos = document.getElementById("minutos-input");
const inputSegundos = document.getElementById("segundos-input");
const botaoIniciar = document.getElementById("iniciar");
const botaoPausar = document.getElementById("pausar");
const botaoResetar = document.getElementById("resetar");
const som = document.getElementById("som-alarme");

function pegarValorValido(elemento, minimo, maximo) {
    let valor = Math.floor(Number(elemento.value));
    if (isNaN(valor) || valor < minimo) {
        valor = minimo;
    }
    if (valor > maximo) {
        valor = maximo;
    }
    return valor;
}

function pegarTempoConfigurado() {
    let m = pegarValorValido(inputMinutos, 0, 120);
    let s = pegarValorValido(inputSegundos, 0, 59);
    if (m === 0 && s === 0) {
        m = 1;
        s = 0;
    }
    return { minutos: m, segundos: s };
}

function atualizarTela() {
    let totalSegundos = Math.max(0, Math.round(tempoRestanteMs / 1000));
    let minutos = Math.floor(totalSegundos / 60);
    let segundos = totalSegundos % 60;
    let minutosTexto = String(minutos).padStart(2, "0");
    let segundosTexto = String(segundos).padStart(2, "0");
    timerElemento.textContent = minutosTexto + ":" + segundosTexto;
}

function tempoAcabou() {
    clearInterval(intervaloId);
    rodando = false;
    sessaoIniciada = false;
    tempoRestanteMs = 0;
    inputMinutos.disabled = false;
    inputSegundos.disabled = false;
    atualizarTela();
    som.play().catch(function (erro) {
        console.log("Som bloqueado:", erro);
    });
}

function verificarTempo() {
    tempoRestanteMs = horarioTermino - Date.now();
    if (tempoRestanteMs <= 0) {
        tempoAcabou();
        return;
    }
    atualizarTela();
}

function iniciar() {
    som.play().then(function () {
        som.pause();
        som.currentTime = 0;
    }).catch(function () {});

    if (rodando) {
        return;
    }
    if (!sessaoIniciada) {
        let tempo = pegarTempoConfigurado();
        tempoRestanteMs = (tempo.minutos * 60 + tempo.segundos) * 1000;
        atualizarTela();
        sessaoIniciada = true;
    }
    horarioTermino = Date.now() + tempoRestanteMs;
    rodando = true;
    inputMinutos.disabled = true;
    inputSegundos.disabled = true;
    intervaloId = setInterval(verificarTempo, 250);
}

function pausar() {
    clearInterval(intervaloId);
    rodando = false;
}

function resetar() {
    clearInterval(intervaloId);
    rodando = false;
    sessaoIniciada = false;
    let tempo = pegarTempoConfigurado();
    tempoRestanteMs = (tempo.minutos * 60 + tempo.segundos) * 1000;
    inputMinutos.disabled = false;
    inputSegundos.disabled = false;
    atualizarTela();
}

botaoIniciar.addEventListener("click", iniciar);
botaoPausar.addEventListener("click", pausar);
botaoResetar.addEventListener("click", resetar);

atualizarTela();
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js");
}