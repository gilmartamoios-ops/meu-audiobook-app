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
const docGroup = document.getElementById('docGroup');
const docFile = document.getElementById('docFile');
const textGroup = document.getElementById('textGroup');
const customTextInput = document.getElementById('customTextInput');
const btnApplyText = document.getElementById('btnApplyText');
const loadingStatus = document.getElementById('loadingStatus');
const libraryList = document.getElementById('libraryList');

const btnPlay = document.getElementById('btnPlay');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');
const btnStop = document.getElementById('btnStop');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');

const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeLabel = document.getElementById('fontSizeLabel');
const speedSelect = document.getElementById('speedSelect');
const voiceSelect = document.getElementById('voiceSelect');

const timeGoalText = document.getElementById('timeGoalText');
const timeProgressBar = document.getElementById('timeProgressBar');
const statWords = document.getElementById('statWords');
const readingProgress = document.getElementById('readingProgress');

// Carregar Estante do LocalStorage
function getSavedLibrary() {
  try {
    return JSON.parse(localStorage.getItem('bimodal_library')) || [];
  } catch (e) {
    return [];
  }
}

function saveToLibrary(title, paragraphs) {
  let library = getSavedLibrary();
  // Evitar duplicados pelo título
  library = library.filter(item => item.title !== title);
  library.unshift({ title, paragraphs });
  // Manter no máximo 10 itens recentes
  if (library.length > 10) library.pop();
  localStorage.setItem('bimodal_library', JSON.stringify(library));
  renderLibrary();
}

function removeFromLibrary(title) {
  let library = getSavedLibrary();
  library = library.filter(item => item.title !== title);
  localStorage.setItem('bimodal_library', JSON.stringify(library));
  renderLibrary();
}

function renderLibrary() {
  const library = getSavedLibrary();
  libraryList.innerHTML = '';
  if (library.length === 0) {
    libraryList.innerHTML = `<p class="text-xs text-slate-400 italic">Nenhum livro salvo na estante.</p>`;
    return;
  }

  library.forEach(item => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs';
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'font-medium truncate flex-1 cursor-pointer';
    titleSpan.textContent = item.title;
    titleSpan.title = item.title;
    titleSpan.onclick = () => loadBookFromLibrary(item.title);

    const btnRead = document.createElement('button');
    btnRead.className = 'px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px]';
    btnRead.textContent = 'Ler';
    btnRead.onclick = () => loadBookFromLibrary(item.title);

    const btnDiscard = document.createElement('button');
    btnDiscard.className = 'px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold text-[10px]';
    btnDiscard.textContent = 'Descartar';
    btnDiscard.onclick = () => removeFromLibrary(item.title);

    div.appendChild(titleSpan);
    div.appendChild(btnRead);
    div.appendChild(btnDiscard);
    libraryList.appendChild(div);
  });
}

function loadBookFromLibrary(title) {
  const library = getSavedLibrary();
  const found = library.find(item => item.title === title);
  if (found) {
    stopReading();
    currentParagraphs = found.paragraphs;
    currentParagraphIndex = 0;
    renderText();
  }
}

function loadVoices() {
  voices = synth.getVoices().filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
  voiceSelect.innerHTML = '';
  if (voices.length === 0) voices = synth.getVoices();
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
        <p class="text-xs mt-1">Carregue um arquivo ou escolha um item salvo na sua estante lateral.</p>
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
  utterance.rate = parseFloat(speedSelect.value);

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
  const val = e.target.value;
  urlGroup.classList.add('hidden');
  epubGroup.classList.add('hidden');
  docGroup.classList.add('hidden');
  textGroup.classList.add('hidden');

  if (val === 'url') urlGroup.classList.remove('hidden');
  if (val === 'epub') epubGroup.classList.remove('hidden');
  if (val === 'doc') docGroup.classList.remove('hidden');
  if (val === 'text') textGroup.classList.remove('hidden');
};

// Processar Arquivos e Salvar na Estante Local
btnFetchUrl.onclick = async () => {
  const url = urlInput.value.trim();
  if (!url) return;
  loadingStatus.classList.remove('hidden');
  loadingStatus.textContent = "A extrair artigo...";
  stopReading();

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");
    doc.querySelectorAll('script, style, nav, header, footer, iframe, aside').forEach(el => el.remove());

    let extracted = [];
    doc.querySelectorAll('p, h1, h2, h3').forEach(p => {
      let text = p.textContent.trim();
      if (text.length > 30) extracted.push(text);
    });

    if (extracted.length > 0) {
      const title = doc.title || "Artigo Web";
      saveToLibrary(title, extracted);
      loadBookFromLibrary(title);
    }
  } catch (err) {
    alert("Erro ao carregar link.");
  } finally {
    loadingStatus.classList.add('hidden');
  }
};

epubFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadingStatus.classList.remove('hidden');
  loadingStatus.textContent = "A ler EPUB...";
  stopReading();

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const book = ePub(event.target.result);
      await book.ready;
      let allParagraphs = [];
      for (let i = 0; i < book.spine.length; i++) {
        const item = book.spine.get(i);
        const section = await book.load(item.href);
        const doc = new DOMParser().parseFromString(section, "text/html");
        doc.querySelectorAll('p, h1, h2, h3').forEach(p => {
          let text = p.textContent.trim();
          if (text.length > 20) allParagraphs.push(text);
        });
      }
      const title = file.name.replace('.epub', '');
      saveToLibrary(title, allParagraphs);
      loadBookFromLibrary(title);
    } catch (err) {
      alert("Erro ao ler EPUB.");
    } finally {
      loadingStatus.classList.add('hidden');
    }
  };
  reader.readAsArrayBuffer(file);
};

docFile.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  loadingStatus.classList.remove('hidden');
  stopReading();

  const reader = new FileReader();
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.docx')) {
    loadingStatus.textContent = "A ler Word (.docx)...";
    reader.onload = async (event) => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
        const paragraphs = result.value.split('\n').filter(p => p.trim() !== '');
        const title = file.name.replace('.docx', '');
        saveToLibrary(title, paragraphs);
        loadBookFromLibrary(title);
      } catch (err) {
        alert("Erro ao ler Word.");
      } finally {
        loadingStatus.classList.add('hidden');
      }
    };
    reader.readAsArrayBuffer(file);
  } else if (fileName.endsWith('.pdf')) {
    loadingStatus.textContent = "A ler PDF...";
    reader.onload = async (event) => {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument(new Uint8Array(event.target.result)).promise;
        let allParagraphs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          let pageText = textContent.items.map(item => item.str).join(' ');
          let chunks = pageText.split('. ').filter(c => c.trim().length > 10);
          chunks.forEach(c => allParagraphs.push(c.trim() + '.'));
        }
        const title = file.name.replace('.pdf', '');
        saveToLibrary(title, allParagraphs);
        loadBookFromLibrary(title);
      } catch (err) {
        alert("Erro ao ler PDF.");
      } finally {
        loadingStatus.classList.add('hidden');
      }
    };
    reader.readAsArrayBuffer(file);
  }
};

btnApplyText.onclick = () => {
  const text = customTextInput.value.trim();
  if (!text) return;
  stopReading();
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');
  const title = "Texto Personalizado";
  saveToLibrary(title, paragraphs);
  loadBookFromLibrary(title);
};

// Ajustes Visuais e Temas
fontSizeSlider.oninput = (e) => {
  fontSizeLabel.textContent = `${e.target.value}px`;
  readerContent.style.fontSize = `${e.target.value}px`;
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
renderLibrary();
renderText();
