<!DOCTYPE html>
<html lang="pt" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leitor Bimodal & Treino Cognitivo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Bibliotecas para EPUB, PDF, Word (.docx) e Supabase -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.16/mammoth.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            sepia: {
              bg: '#fbf0d9',
              card: '#f4e4bc',
              text: '#5f4b32',
              highlight: '#fde047'
            }
          }
        }
      }
    }
  </script>
  <style>
    .active-paragraph {
      border-left: 4px solid #2563eb;
      padding-left: 1rem;
      background-color: rgba(37, 99, 235, 0.08);
      border-radius: 0 0.5rem 0.5rem 0;
      transition: all 0.2s ease-in-out;
    }
    .sepia-mode .active-paragraph {
      border-left-color: #b45309;
      background-color: rgba(180, 83, 9, 0.12);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 min-h-full flex flex-col font-sans transition-colors duration-200" id="appBody">

  <!-- Cabeçalho -->
  <header class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
    <div class="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="bg-blue-600 text-white p-2 rounded-xl font-bold text-xl">🧠</div>
        <div>
          <h1 class="text-xl font-bold leading-tight">Leitor Bimodal</h1>
          <p class="text-xs text-slate-500 dark:text-slate-400">Treino Cognitivo com Estante na Nuvem</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Status de Autenticação / Login -->
        <div id="authContainer" class="flex items-center gap-2 text-xs">
          <span id="userEmailDisplay" class="text-slate-500 dark:text-slate-400 hidden"></span>
          <button id="btnLoginModal" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold">Entrar / Criar Conta</button>
          <button id="btnLogout" class="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg font-bold hidden">Sair</button>
        </div>

        <div class="flex items-center gap-2 border-l pl-4 border-slate-200 dark:border-slate-700">
          <button id="themeLight" class="px-3 py-1.5 rounded-lg border text-sm font-medium bg-slate-100 dark:bg-slate-700">Claro</button>
          <button id="themeSepia" class="px-3 py-1.5 rounded-lg border text-sm font-medium bg-[#fbf0d9] text-[#5f4b32]">Sépia</button>
          <button id="themeDark" class="px-3 py-1.5 rounded-lg border text-sm font-medium bg-slate-800 text-white">Escuro</button>
        </div>
      </div>
    </div>
  </header>

  <!-- Modal de Login -->
  <div id="loginModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center hidden">
    <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-700 space-y-4">
      <h3 class="text-lg font-bold">Aceder à sua Estante na Nuvem</h3>
      <p class="text-xs text-slate-500">Entre com o seu e-mail e palavra-passe para sincronizar os seus textos entre o PC e o telemóvel.</p>
      <input type="email" id="authEmail" placeholder="O seu e-mail" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
      <input type="password" id="authPassword" placeholder="Palavra-passe" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-sm">
      <div id="authError" class="text-xs text-rose-500 hidden"></div>
      <div class="flex gap-2 pt-2">
        <button id="btnSignIn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold">Entrar</button>
        <button id="btnSignUp" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold">Criar Conta</button>
      </div>
      <button id="btnCloseModal" class="w-full text-xs text-slate-400 hover:underline pt-2">Cancelar</button>
    </div>
  </div>

  <!-- Conteúdo Principal -->
  <main class="max-w-5xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

    <!-- Painel Lateral -->
    <aside class="space-y-6">
      
      <!-- Metas Cognitivas -->
      <section class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 class="text-base font-bold mb-4 flex items-center gap-2">
          <span>📊</span> Treino Cognitivo Diário
        </h2>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600 dark:text-slate-300">Meta Diária (15 min)</span>
              <span id="timeGoalText" class="font-bold">0 / 15 min</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div id="timeProgressBar" class="bg-blue-600 h-full w-0 transition-all duration-300"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2">
            <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
              <p class="text-xs text-slate-500 dark:text-slate-400">Palavras Lidas</p>
              <p id="statWords" class="text-xl font-bold text-blue-600 dark:text-blue-400">0</p>
            </div>
            <div class="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
              <p class="text-xs text-slate-500 dark:text-slate-400">Sequência</p>
              <p id="statStreak" class="text-xl font-bold text-emerald-600 dark:text-emerald-400">1 Dia</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Fonte da Leitura -->
      <section class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 class="text-base font-bold flex items-center gap-2">
          <span>📚</span> Carregar Novo Conteúdo
        </h2>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Origem do Ficheiro</label>
          <select id="sourceSelect" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium">
            <option value="none">-- Selecione uma opção --</option>
            <option value="url">🌐 Ler Artigo / Página Web por Link (URL)</option>
            <option value="epub">📖 Carregar Livro EPUB (.epub)</option>
            <option value="doc">📂 Carregar Word (.docx) ou PDF</option>
            <option value="text">✍️ Colar Texto ou Arquivo (.txt)</option>
          </select>
        </div>

        <div id="urlGroup" class="hidden space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <input type="url" id="urlInput" placeholder="https://exemplo.com/artigo" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-xs">
          <button id="btnFetchUrl" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs">Extrair Artigo</button>
        </div>

        <div id="epubGroup" class="hidden space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <label class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-xl text-xs font-bold block text-center">
            <span>Carregar EPUB</span>
            <input type="file" id="epubFile" accept=".epub" class="hidden">
          </label>
        </div>

        <div id="docGroup" class="hidden space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <label class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-xl text-xs font-bold block text-center">
            <span>Carregar Word ou PDF</span>
            <input type="file" id="docFile" accept=".docx,.pdf" class="hidden">
          </label>
        </div>

        <div id="textGroup" class="hidden space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <textarea id="customTextInput" rows="3" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-xs" placeholder="Cole o texto..."></textarea>
          <button id="btnApplyText" class="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold">Aplicar Texto</button>
        </div>

        <p id="loadingStatus" class="text-xs text-center text-blue-600 dark:text-blue-400 font-medium hidden">A processar...</p>
      </section>

      <!-- Minha Estante na Nuvem -->
      <section class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h2 class="text-base font-bold flex items-center gap-2">
          <span>☁️</span> Estante na Nuvem
        </h2>
        <div id="libraryList" class="space-y-2 max-h-48 overflow-y-auto">
          <p class="text-xs text-slate-400 italic">Faça login para ver a sua estante sincronizada.</p>
        </div>
      </section>

      <!-- Ajustes -->
      <section class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 class="text-base font-bold flex items-center gap-2"><span>⚙️</span> Ajustes de Leitura</h2>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs mb-1"><span>Tamanho da Fonte</span><span id="fontSizeLabel" class="font-bold">20px</span></div>
            <input type="range" id="fontSizeSlider" min="16" max="32" value="20" class="w-full">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Voz do Sistema</label>
            <select id="voiceSelect" class="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent text-xs">
              <option value="">A carregar vozes...</option>
            </select>
          </div>
        </div>
      </section>

    </aside>

    <!-- Área Principal de Leitura -->
    <section class="lg:col-span-2 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      
      <div class="p-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <button id="btnPrev" class="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-lg" title="Anterior">⏮️</button>
          <button id="btnPlay" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-md">
            <span id="playIcon">▶️</span>
            <span id="playText">Ouvir e Ler</span>
          </button>
          <button id="btnStop" class="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-lg" title="Parar">⏹️</button>
          <button id="btnNext" class="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-lg" title="Próximo">⏭️</button>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600">
          <span class="text-xs font-medium text-slate-500">Velocidade:</span>
          <select id="speedSelect" class="bg-transparent text-xs font-bold text-blue-600 dark:text-blue-400 focus:outline-none">
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>

        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium" id="readingProgress">
          Aguardando conteúdo...
        </div>
      </div>

      <div id="readerContent" class="p-8 flex-1 overflow-y-auto space-y-6 leading-relaxed select-text" style="font-size: 20px;">
        <div class="text-center py-16 text-slate-400 dark:text-slate-500">
          <p class="text-4xl mb-3">📄</p>
          <p class="text-base font-semibold">Nenhum conteúdo carregado.</p>
          <p class="text-xs mt-1">Faça login e carregue um arquivo ou escolha um item da sua estante na nuvem.</p>
        </div>
      </div>

    </section>

  </main>

  <script src="app.js"></script>
</body>
</html>
