// Seleção dos elementos do DOM
const campoSenha = document.querySelector('#campo-senha');
const btnCopiar = document.querySelector('#btn-copiar');
const txtTamanho = document.querySelector('#valor-tamanho');
const btnMenos = document.querySelector('#btn-menos');
const btnMais = document.querySelector('#btn-mais');
const btnGerar = document.querySelector('#btn-gerar');
const txtForca = document.querySelector('#texto-forca');
const barraForca = document.querySelector('#barra-forca');
const listaHistorico = document.querySelector('#lista-historico');

// Checkboxes
const chkMaiusculas = document.querySelector('#chk-maiusculas');
const chkMinusculas = document.querySelector('#chk-minusculas');
const chkNumeros = document.querySelector('#chk-numeros');
const chkSimbolos = document.querySelector('#chk-simbolos');
const chkCrypto = document.querySelector('#chk-crypto');

// Bancos de Dados de Caracteres (Atividades 5 e 6)
const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolosSuperFortes = '!@#$%&*()_+-=[]{}|;:,.<>?/~`^';
const caracteresHexa = '0123456789abcdefABCDEF'; // Base criptográfica

let tamanhoSenha = 12; // Começa em 12 caracteres por motivos de Entropia segura
let historicoSenhas = [];

// Função de Validação do Botão Gerar (Atividade 4)
function verificarLimite() {
  txtTamanho.textContent = tamanhoSenha;
  if (tamanhoSenha < 6) {
    btnGerar.disabled = true;
  } else {
    btnGerar.disabled = false;
  }
}

// Eventos de clique para ajustar o tamanho da senha
btnMais.addEventListener('click', () => {
  if (tamanhoSenha < 30) { // Limite máximo para segurança visual do layout
    tamanhoSenha++;
    verificarLimite();
  }
});

btnMenos.addEventListener('click', () => {
  if (tamanhoSenha > 0) {
    tamanhoSenha--;
    verificarLimite();
  }
});

// Medidor e atualizador de Força da Senha via Entropia (Atividade 3 e 6)
function atualizarIndicadorForca(poolSize) {
  // Limpa classes antigas
  barraForca.classList.remove('fraca', 'media', 'forte');
  
  if (tamanhoSenha < 6 || poolSize === 0) {
    txtForca.textContent = "Força da Senha: Insegura";
    return;
  }

  // Cálculo da Entropia matemática: E = L * log2(R)
  const entropia = tamanhoSenha * Math.log2(poolSize);

  if (entropia < 40) {
    txtForca.textContent = "Força da Senha: Fraca 🔴";
    barraForca.classList.add('fraca');
  } else if (entropia >= 40 && entropia < 60) {
    txtForca.textContent = "Força da Senha: Média 🟡";
    barraForca.classList.add('media');
  } else {
    txtForca.textContent = "Força da Senha: Forte 🔥🟢";
    barraForca.classList.add('forte');
  }
}

// Função de Geração de Senha Combinada (Atividades 5, 6 e Melhorias)
function gerarSenha() {
  let caracteresPermitidos = '';
  let senhaGerada = '';

  // Regra do modo criptográfico hexadecimal
  if (chkCrypto.checked) {
    caracteresPermitidos = caracteresHexa;
  } else {
    if (chkMaiusculas.checked) caracteresPermitidos += letrasMaiusculas;
    if (chkMinusculas.checked) caracteresPermitidos += letrasMinusculas;
    if (chkNumeros.checked) caracteresPermitidos += numeros;
    if (chkSimbolos.checked) caracteresPermitidos += simbolosSuperFortes;
  }

  // Validação caso nada esteja selecionado
  if (caracteresPermitidos.length === 0) {
    campoSenha.value = "Selecione uma opção!";
    atualizarIndicadorForca(0);
    return;
  }

  // Sorteio aleatório dos caracteres
  for (let i = 0; i < tamanhoSenha; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
    senhaGerada += caracteresPermitidos[indiceAleatorio];
  }

  // Exibe a senha e atualiza os medidores visuais
  campoSenha.value = senhaGerada;
  atualizarIndicadorForca(caracteresPermitidos.length);
  adicionarAoHistorico(senhaGerada);
}

// Histórico das últimas 3 senhas geradas
function adicionarAoHistorico(novaSenha) {
  historicoSenhas.unshift(novaSenha);
  if (historicoSenhas.length > 3) {
    historicoSenhas.pop();
  }

  listaHistorico.innerHTML = '';
  historicoSenhas.forEach(senha => {
    const li = document.createElement('li');
    li.textContent = senha;
    listaHistorico.appendChild(li);
  });
}

// API de Cópia Rápida para o Clipboard
btnCopiar.addEventListener('click', () => {
  if (campoSenha.value === "Clique em Gerar" || campoSenha.value === "Selecione uma opção!") return;

  navigator.clipboard.writeText(campoSenha.value).then(() => {
    btnCopiar.textContent = 'Copiado! ✓';
    btnCopiar.style.backgroundColor = '#2ecc71';

    setTimeout(() => {
      btnCopiar.textContent = 'Copiar';
      btnCopiar.style.backgroundColor = '';
    }, 1500);
  });
});

// Vincula a função principal ao clique do botão gerar
btnGerar.addEventListener('click', gerarSenha);

// Inicialização da interface ao carregar
verificarLimite();
