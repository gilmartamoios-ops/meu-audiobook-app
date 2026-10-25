// Banco de Textos Inicial
const BOOKS = {
  dom_casmurro: {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    paragraphs: [
      "Uma noite destas, vindo da cidade para o Engenho Novo, encontrei no trem da Central um rapaz aqui do bairro, que eu conheço de vista e de chapéu.",
      "Cumprimentou-me, sentou-se ao pé de mim, falou da lua e dos ministros, e acabou recitando-me versos. A viagem era curta, e os versos pode ser que não fossem maus, mas eu estava cansado, fechei os olhos, fiz que dormia; não obstante, ele continuou a recitar.",
      "Quando abri os olhos, o trem parava na minha estação. Agradeci-lhe o favor do descanso, e saí rapidamente. No dia seguinte, o rapaz disse a um vizinho que eu era um casmurro, e a alcunha pegou.",
      "Não te enfades com a palavra. Ela é útil para explicar como o título deste livro se formou. Casmurro não é apenas o homem calado e recolhido; é também o teimoso e de opinião forte."
    ]
  },
  arte_guerra: {
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    paragraphs: [
      "A arte da guerra é de vital importância para o Estado. É um domínio onde se decidem a vida e a morte, o caminho para a segurança ou para a ruína.",
      "Portanto, é um assunto de estudo que não pode ser negligenciado sob nenhuma hipótese.",
      "A guerra é baseada no engano. Por isso, quando formos capazes de atacar, devemos parecer incapazes; ao utilizar nossas forças, devemos parecer inativos.",
      "Quando estivermos perto, devemos fazer o inimigo acreditar que estamos longe; quando estivermos longe, devemos fazê-lo acreditar que estamos perto."
    ]
  }
};

// Estado da Aplicação
let currentBook = BOOKS.dom_casmurro;
let currentParagraphIndex = 0;
let isPlaying = false;
let synth = window.speechSynthesis;
let utterance = null;
let voices = [];
let secondsRead = 0;
let timerInterval = null;

// Elementos do DOM
const readerContent = document.getElementById('readerContent');
const bookSelect = document.getElementById('bookSelect');
const customInputGroup = document.getElementById('customInputGroup');
const customTextInput = document.getElementById('customTextInput');
const applyCustomText = document.getElementById('applyCustomText');
const fileInput = document.getElementById('fileInput');

const btnPlay = document.getElementById('btnPlay');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');
const btnStop = document.getElementById('btnStop');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeLabel = document.getElementById('fontSizeLabel');
const rateSlider = document.getElementById('rateSlider');
const rateLabel = document.getElementById('rateLabel');
const voiceSelect = document.getElementById('voiceSelect');

const timeGoalText = document.getElementById('timeGoalText');
const timeProgressBar = document.getElementById('timeProgressBar');
const statWords = document.getElementById('statWords');
const readingProgress = document.getElementById('readingProgress');

// Carregar Vozes do Sistema
function loadVoices() {
  voices = synth.getVoices().filter(v => v.lang.includes('pt'));
  voiceSelect.innerHTML = '';
  
  if (voices.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'Voz Português (Padrão do Sistema)';
    voiceSelect.appendChild(option);
    return;
  }

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Renderizar Texto
function renderText() {
  readerContent.innerHTML = '';
  currentBook.paragraphs.forEach((pText, idx) => {
    const p = document.createElement('p');
    p.id = `para-${idx}`;
    p.textContent = pText;
    p.className = 'cursor-pointer p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition';
    p.onclick = () => jumpToParagraph(idx);
    readerContent.appendChild(p);
  });
  highlightCurrentParagraph();
  updateProgress();
}

// Destacar Parágrafo Ativo
function highlightCurrentParagraph() {
  document.querySelectorAll('#readerContent p').forEach((p, idx) => {
    if (idx === currentParagraphIndex) {
      p.classList.add('active-paragraph');
      p.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      p.classList.remove('active-paragraph');
    }
  });
}

// Atualizar Indicadores
function updateProgress() {
  readingProgress.textContent = `Parágrafo ${currentParagraphIndex + 1} de ${currentBook.paragraphs.length}`;
  
  // Total de palavras
  const totalWords = currentBook.paragraphs.reduce((acc, curr) => acc + curr.split(' ').length, 0);
  statWords.textContent = totalWords;
}

// Controle de Áudio (Speech)
function speakCurrentParagraph() {
  synth.cancel();

  if (currentParagraphIndex >= currentBook.paragraphs.length) {
    stopReading();
    return;
  }

  highlightCurrentParagraph();

  const text = currentBook.paragraphs[currentParagraphIndex];
  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = parseFloat(rateSlider.value);

  if (voices.length > 0 && voiceSelect.value !== '') {
    utterance.voice = voices[voiceSelect.value];
  }

  utterance.onend = () => {
    if (isPlaying) {
      currentParagraphIndex++;
      if (currentParagraphIndex < currentBook.paragraphs.length) {
        speakCurrentParagraph();
      } else {
        stopReading();
      }
    }
  };

  utterance.onerror = () => {
    stopReading();
  };

  synth.speak(utterance);
}

function startReading() {
  isPlaying = true;
  playIcon.textContent = '⏸️';
  playText.textContent = 'Pausar';
  speakCurrentParagraph();
  startTimer();
}

function pauseReading() {
  isPlaying = false;
  playIcon.textContent = '▶️';
  playText.textContent = 'Continuar';
  synth.cancel();
  stopTimer();
}

function stopReading() {
  isPlaying = false;
  playIcon.textContent = '▶️';
  playText.textContent = 'Ouvir e Ler';
  synth.cancel();
  currentParagraphIndex = 0;
  highlightCurrentParagraph();
  stopTimer();
}

function jumpToParagraph(index) {
  currentParagraphIndex = index;
  if (isPlaying) {
    speakCurrentParagraph();
  } else {
    highlightCurrentParagraph();
    updateProgress();
  }
}

// Cronômetro do Treino Cognitivo
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    secondsRead++;
    const minutes = Math.floor(secondsRead / 60);
    timeGoalText.textContent = `${minutes} / 15 min`;
    const percent = Math.min((minutes / 15) * 100, 100);
    timeProgressBar.style.width = `${percent}%`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Event Listeners
btnPlay.onclick = () => {
  if (isPlaying) {
    pauseReading();
  } else {
    startReading();
  }
};

btnStop.onclick = stopReading;

btnNext.onclick = () => {
  if (currentParagraphIndex < currentBook.paragraphs.length - 1) {
    jumpToParagraph(currentParagraphIndex + 1);
  }
};

btnPrev.onclick = () => {
  if (currentParagraphIndex > 0) {
    jumpToParagraph(currentParagraphIndex - 1);
  }
};

// Troca de Obra
bookSelect.onchange = (e) => {
  stopReading();
  const val = e.target.value;
  if (val === 'custom') {
    customInputGroup.classList.remove('hidden');
  } else {
    customInputGroup.classList.add('hidden');
    currentBook = BOOKS[val];
    renderText();
  }
};

// Texto Personalizado
applyCustomText.onclick = () => {
  const text = customTextInput.value.trim();
  if (!text) return;
  
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  currentBook = {
    title: "Texto Personalizado",
    author: "Você",
    paragraphs: paragraphs
  };
  stopReading();
  renderText();
};

fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    customTextInput.value = event.target.result;
    applyCustomText.click();
  };
  reader.readAsText(file);
};

// Controles Visuais e Acessibilidade
fontSizeSlider.oninput = (e) => {
  const size = e.target.value;
  fontSizeLabel.textContent = `${size}px`;
  readerContent.style.fontSize = `${size}px`;
};

rateSlider.oninput = (e) => {
  rateLabel.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
  if (isPlaying) {
    speakCurrentParagraph();
  }
};

// Temas
document.getElementById('themeLight').onclick = () => {
  document.documentElement.className = 'h-full';
  document.body.className = 'bg-slate-50 text-slate-800 min-h-full flex flex-col font-sans';
};

document.getElementById('themeDark').onclick = () => {
  document.documentElement.className = 'h-full dark';
  document.body.className = 'bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-full flex flex-col font-sans';
};

document.getElementById('themeSepia').onclick = () => {
  document.documentElement.className = 'h-full sepia-mode';
  document.body.className = 'bg-[#fbf0d9] text-[#5f4b32] min-h-full flex flex-col font-sans';
};

// Inicialização
loadVoices();
renderText();
