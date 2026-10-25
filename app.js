let currentParagraphs = [];
let currentParagraphIndex = 0;
let isPlaying = false;
let synth = window.speechSynthesis;
let utterance = null;
let voices = [];
let secondsRead = 0;
let timerInterval = null;

const readerContent = document.getElementById('readerContent');
const sourceSelect = document.getElementById('sourceSelect');

const urlGroup = document.getElementById('urlGroup');
const urlInput = document.getElementById('urlInput');
const btnFetchUrl = document.getElementById('btnFetchUrl');

const epubGroup = document.getElementById('epubGroup');
const epubFile = document.getElementById('epubFile');

const textGroup = document.getElementById('textGroup');
const customTextInput = document.getElementById('customTextInput');
const txtFile = document.getElementById('txtFile');
const btnApplyText = document.getElementById('btnApplyText');

const loadingStatus = document.getElementById('loadingStatus');

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

function loadVoices() {
  voices = synth.getVoices().filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
  voiceSelect.innerHTML = '';
  if (voices.length === 0) {
    voices = synth.getVoices();
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

function renderText() {
  readerContent.innerHTML = '';
  if (currentParagraphs.length === 0) {
    readerContent.innerHTML = `
      <div class="text-center py-16 text-slate-400 dark:text-slate-500">
        <p class="text-4xl mb-3">📄</p>
        <p class="text-base font-semibold">Nenhum conteúdo carregado.</p>
        <p class="text-xs mt-1">Selecione uma opção na barra lateral para carregar um artigo via link, livro EPUB ou texto.</p>
      </div>`;
    readingProgress.textContent = "Aguardando conteúdo...";
    statWords.textContent = "0";
    return;
  }

  currentParagraphs.forEach((pText, idx) => {
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

function updateProgress() {
  if (currentParagraphs.length === 0) return;
  readingProgress.textContent = `Parágrafo ${currentParagraphIndex + 1} de ${currentParagraphs.length}`;
  const totalWords = currentParagraphs.reduce((acc, curr) => acc + curr.split(' ').length, 0);
  statWords.textContent = totalWords;
}

function speakCurrentParagraph() {
  synth.cancel();
  if (currentParagraphs.length === 0 || currentParagraphIndex >= currentParagraphs.length) {
    stopReading();
    return;
  }
  highlightCurrentParagraph();

  const text = currentParagraphs[currentParagraphIndex];
  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = parseFloat(rateSlider.value);

  if (voices.length > 0 && voiceSelect.value !== '') {
    utterance.voice = voices[voiceSelect.value];
  }

  utterance.onend = () => {
    if (isPlaying) {
      currentParagraphIndex++;
      if (currentParagraphIndex < currentParagraphs.length) {
        speakCurrentParagraph();
      } else {
        stopReading();
      }
    }
  };

  utterance.onerror = () => { stopReading(); };
  synth.speak(utterance);
}

function startReading() {
  if (currentParagraphs.length === 0) return;
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

btnPlay.onclick = () => { isPlaying ? pauseReading() : startReading(); };
btnStop.onclick = stopReading;
btnNext.onclick = () => { if (currentParagraphIndex < currentParagraphs.length - 1) jumpToParagraph(currentParagraphIndex + 1); };
btnPrev.onclick = () => { if (currentParagraphIndex > 0) jumpToParagraph(currentParagraphIndex - 1); };

sourceSelect.onchange = (e) => {
  stopReading();
  const val = e.target.value;
  urlGroup.classList.add('hidden');
  epubGroup.classList.add('hidden');
  textGroup.classList.add('hidden');

  if (val === 'url') urlGroup.classList.remove('hidden');
  if (val === 'epub') epubGroup.classList.remove('hidden');
  if (val === 'text') textGroup.classList.remove('hidden');
};

// Extrair Artigo via URL/Link
btnFetchUrl.onclick = async () => {
  const url = urlInput.value.trim();
  if (!url) return;

  loadingStatus.classList.remove('hidden');
  loadingStatus.textContent = "A extrair texto do artigo...";
  stopReading();

  try {
    // Utiliza um serviço público leitor de artigos (AllOrigins + Parser)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (!data.contents) throw new Error("Não foi possível acessar a página.");

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");

    // Remove elementos de navegação e anúncios
    doc.querySelectorAll('script, style, nav, header, footer, iframe, aside').forEach(el => el.remove());

    const ps = doc.querySelectorAll('p, h1, h2, h3');
    let extracted = [];
    ps.forEach(p => {
      let text = p.textContent.trim();
      if (text.length > 30) { // Ignora links e rodapés curtos
        extracted.push(text);
      }
    });

    if (extracted.length === 0) {
      alert("Não foi possível extrair o texto principal do artigo. O site pode estar bloqueado.");
    } else {
      currentParagraphs = extracted;
      currentParagraphIndex = 0;
      renderText();
    }
  } catch (err) {
    console.error(err);
    alert("Ocorreu um erro ao tentar carregar o artigo do link.");
  } finally {
    loadingStatus.classList.add('hidden');
  }
};

// Leitor de EPUB
epubFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  loadingStatus.classList.remove('hidden');
  loadingStatus.textContent = "A ler livro EPUB...";
  stopReading();

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const buffer = event.target.result;
      const book = ePub(buffer);
      await book.ready;

      let allParagraphs = [];
      const spineItems = book.spine;

      for (let i = 0; i < spineItems.length; i++) {
        const item = spineItems.get(i);
        const section = await book.load(item.href);
        let parser = new DOMParser();
        let doc = parser.parseFromString(section, "text/html");
        let ps = doc.querySelectorAll('p, h1, h2, h3');
        ps.forEach(p => {
          let text = p.textContent.trim();
          if (text.length > 20) allParagraphs.push(text);
        });
      }

      currentParagraphs = allParagraphs;
      currentParagraphIndex = 0;
      renderText();
    } catch (err) {
      alert("Erro ao ler arquivo EPUB.");
    } finally {
      loadingStatus.classList.add('hidden');
    }
  };
  reader.readAsArrayBuffer(file);
};

// Aplicar Texto Manual / TXT
btnApplyText.onclick = () => {
  const text = customTextInput.value.trim();
  if (!text) return;
  stopReading();
  currentParagraphs = text.split('\n').filter(p => p.trim() !== '');
  currentParagraphIndex = 0;
  renderText();
};

txtFile.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    customTextInput.value = event.target.result;
    btnApplyText.click();
  };
  reader.readAsText(file);
};

// Ajustes
fontSizeSlider.oninput = (e) => {
  const size = e.target.value;
  fontSizeLabel.textContent = `${size}px`;
  readerContent.style.fontSize = `${size}px`;
};

rateSlider.oninput = (e) => {
  rateLabel.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
  if (isPlaying) speakCurrentParagraph();
};

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

loadVoices();
renderText();
