// ========================
// 編集していいエリア（初期値）
// ========================

// 初期タブ名
const INITIAL_TABS = [
  "朝の準備",
  "帰ってから",
  "寝る前"
];

// 各タブの初期タスク
const INITIAL_TASKS = [
  [
    "トイレに行ったかな？",
    "着替えてパジャマを片付けよう！",
    "宿題で忘れているものはない？",
    "ランドセル・バッグの中をチェック",
    "水筒は用意したかな？",
    "歯みがきできたかな？",
    "いってきますのあいさつ"
  ],
  [
    "手は洗ったかな？",
    "おたより・プリントは出したかな？",
    "宿題がんばってね！",
    "明日の持ち物はそろってるかな？",
    "ランドセルと上着を片付けよう！",
    "帽子・水筒ケースはいつもの場所にあるかな？",
    "健康チェックをするよ！"
  ],
  [
    "歯みがきをしよう！",
    "お風呂に入ろう！",
    "髪を乾かしたかな？",
    "お顔にクリームを塗ってね！",
    "お水を飲んでね！",
    "明日予定を確認したかな？",
    "おやすみのあいさつ"
  ]
];

// アクセサリー開放の設定
// ※id は好きな名前でOK。ラベル名もあとで変えて大丈夫です。
const ACCESSORY_CONFIG = [
  { id: "none",   label: "なし",           requiredCount: 0,  src: null },
  { id: "acc16",  label: "リボン",         requiredCount: 0,  src: "asset/asset16.svg" },
  { id: "acc2",   label: "ねこ",           requiredCount: 1,  src: "asset/asset2.svg" },
  { id: "acc3",   label: "ぱんだ",         requiredCount: 3,  src: "asset/asset3.svg" },
  { id: "acc4",   label: "きつね",         requiredCount: 5, src: "asset/asset4.svg" },
  { id: "acc5",   label: "コアラ",         requiredCount: 8, src: "asset/asset5.svg" },
  { id: "acc6",   label: "ヤギ",           requiredCount: 11, src: "asset/asset6.svg" },
  { id: "acc7",   label: "くま",           requiredCount: 14, src: "asset/asset7.svg" },
  { id: "acc17",  label: "星",             requiredCount: 17, src: "asset/asset17.svg" },
  { id: "acc8",   label: "いぬ",           requiredCount: 20, src: "asset/asset8.svg" },
  { id: "acc9",   label: "ライオン",       requiredCount: 23, src: "asset/asset9.svg" },
  { id: "acc10",  label: "ねずみ",         requiredCount: 26, src: "asset/asset10.svg" },
  { id: "acc11",  label: "キリン",         requiredCount: 29, src: "asset/asset11.svg" },
  { id: "acc1",   label: "うさぎ",         requiredCount: 32, src: "asset/asset1.svg" },
  { id: "acc12",  label: "シカ",           requiredCount: 35, src: "asset/asset12.svg" },
  { id: "acc13",  label: "トラ",           requiredCount: 38, src: "asset/asset13.svg" },
  { id: "acc14",  label: "うし",           requiredCount: 41, src: "asset/asset14.svg" },
  { id: "acc15",  label: "クラウン",       requiredCount: 44, src: "asset/asset15.svg" },
];

// ぽよのメッセージ候補
const POYO_MESSAGES_NORMAL_ADD = [
  "まず一つやってみよう。",
  "ゆっくりでもだいじょうぶ。",
  "できるところからでいいよ。",
  "今やることを見よう。",
  "一つずつでOKだよ。",
  "あわてなくていいよ。",
  "今日はここからだね。",
  "少しずつでいいよ。"
];

const POYO_MESSAGES_CHECK_ADD = [
  "いいね。一つできた。",
  "ちゃんと進んでるよ。",
  "そのやり方で大丈夫。",
  "今のペースでいこう。",
  "一つ前に進んだね。",
  "よく考えてできたね。",
  "その調子だよ。",
  "力がついてきたね。"
];

const POYO_MESSAGES_ALL_DONE_ADD = [
  "ぜんぶ終わったね。",
  "今日の分、できたね。",
  "はなまるいっぱい！",
  "ちゃんとやりきったね。",
  "安心して休もう。",
  "今日は大成功だね。",
  "自分でできたね。",
  "また明日もやろう。"
];

// ========================
// ここから下は基本いじらなくてOK
// ========================

const STORAGE_KEY = "poyoTodoData_v1";

let state = {
  templateMode: "weekday", // "weekday" or "holiday"
  weekday: {
    tabs: [...INITIAL_TABS],
    tasks: INITIAL_TASKS.map(list => [...list]),
    checks: INITIAL_TASKS.map(list => list.map(() => false))
  },
  holiday: {
    tabs: ["ゆっくりの朝", "お昼から", "寝る前"],
    tasks: [
      ["朝ごはんを食べよう！", "お手伝いをしよう！", "好きなことをしよう！"],
      ["お昼ごはんを食べよう！", "お出かけの準備をしよう！", "宿題があればやろう！"],
      ["歯みがきをしよう！", "お風呂に入ろう！", "明日の予定を確認しよう！", "おやすみのあいさつ"]
    ],
    checks: [
      [false, false, false],
      [false, false, false],
      [false, false, false, false]
    ]
  },
  lastResetDate: null,
  activeTab: 0,
  guardianMode: false,
  accessory: "none",
  accessoryPanelVisible: true,
  perfectCount: 0
};

let guardianDraft = null;

// 現在のテンプレートデータを取得
function getCurrentTemplate() {
  return state[state.templateMode];
}

// 今日は休日かどうか判定（土日祝）
function isTodayHoliday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // 土日判定
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }
  
  // 祝日判定（ライブラリが読み込まれている場合）
  if (typeof JapaneseHolidays !== 'undefined' && JapaneseHolidays.isHoliday) {
    return JapaneseHolidays.isHoliday(today);
  }
  
  return false;
}

// 自動テンプレート判定
function autoSwitchTemplate() {
  state.templateMode = isTodayHoliday() ? "holiday" : "weekday";
}

// state から下書きを作る
function resetGuardianDraftFromState() {
  const template = getCurrentTemplate();
  guardianDraft = {
    tabs: template.tabs.map((t) => t),
    tasks: template.tasks.map((list) => [...list]),
    checks: template.checks.map((list) => [...list]),
  };
}

// ========================
// はなまる（タブ完了）
// ========================
let hanamaruTimer = null;
let lastAllDoneByTab = INITIAL_TABS.map(() => false);

function isTabAllDone(tabIndex) {
  const template = getCurrentTemplate();
  const tasks = template.tasks[tabIndex] || [];
  const checks = template.checks[tabIndex] || [];
  if (!tasks.length) return false;
  return tasks.every((_, i) => !!checks[i]);
}

// 全タブのチェック状態から「全部チェックの日」かどうか判定
function isAllTasksAllDoneAcrossTabs() {
  let totalCheckboxes = 0;
  let anyUnchecked = false;

  const template = getCurrentTemplate();
  template.tasks.forEach((tasks, tabIndex) => {
    const checks = template.checks[tabIndex] || [];
    tasks.forEach((_, i) => {
      totalCheckboxes++;
      if (!checks[i]) {
        anyUnchecked = true;
      }
    });
  });

  // チェックボックスが1個もない日はカウントしない
  if (totalCheckboxes === 0) {
    return false;
  }
  return !anyUnchecked;
}

function showHanamaru() {
  const overlay = document.getElementById("hanamaru-overlay");
  if (!overlay) return;
  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");

  // 自動で消す（タップでも消せる）
  if (hanamaruTimer) clearTimeout(hanamaruTimer);
  hanamaruTimer = setTimeout(() => {
    hideHanamaru();
  }, 1400);
}

function hideHanamaru() {
  const overlay = document.getElementById("hanamaru-overlay");
  if (!overlay) return;
  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
  if (hanamaruTimer) {
    clearTimeout(hanamaruTimer);
    hanamaruTimer = null;
  }
}

function syncHanamaruForActiveTab({ celebrate }) {
  const tab = state.activeTab;
  const nowAllDone = isTabAllDone(tab);
  const prevAllDone = !!lastAllDoneByTab[tab];
  lastAllDoneByTab[tab] = nowAllDone;

  if (!nowAllDone) {
    hideHanamaru();
    return;
  }

  // celebrate=true のときだけ「達成した瞬間」に出す
  if (celebrate && !prevAllDone) {
    showHanamaru();
  }
}

// 日付文字列（YYYY-MM-DD）
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    state.lastResetDate = todayKey();
    autoSwitchTemplate(); // 自動判定
    return;
  }
  try {
    const data = JSON.parse(raw);
    if (data) {
      // 新形式のデータ
      if (data.weekday && data.holiday) {
        state.templateMode = data.templateMode || "weekday";
        state.weekday = data.weekday;
        state.holiday = data.holiday;
      }
      // 旧形式のデータ（互換性のため）
      else if (Array.isArray(data.tabs) && Array.isArray(data.tasks) && Array.isArray(data.checks)) {
        state.weekday.tabs = data.tabs;
        state.weekday.tasks = data.tasks;
        state.weekday.checks = data.checks;
      }
      
      state.lastResetDate = data.lastResetDate || todayKey();
      state.activeTab = data.activeTab || 0;
      state.guardianMode = !!data.guardianMode;
      state.accessory = data.accessory || "none";
      state.accessoryPanelVisible =
        Object.prototype.hasOwnProperty.call(data, "accessoryPanelVisible")
          ? !!data.accessoryPanelVisible
          : true;
      state.perfectCount =
        typeof data.perfectCount === "number" ? data.perfectCount : 0;
    }
    
    // 起動時に自動判定
    autoSwitchTemplate();
  } catch (e) {
    console.error(e);
    state.lastResetDate = todayKey();
    autoSwitchTemplate();
  }
}

function saveState() {
  const data = {
    templateMode: state.templateMode,
    weekday: state.weekday,
    holiday: state.holiday,
    lastResetDate: state.lastResetDate,
    activeTab: state.activeTab,
    guardianMode: state.guardianMode,
    accessory: state.accessory,
    accessoryPanelVisible: state.accessoryPanelVisible,
    perfectCount: state.perfectCount
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 日付が変わったら「全部チェックの日」をカウントしてからチェックをリセット
function resetIfNeeded() {
  const nowKey = todayKey();
  if (state.lastResetDate === nowKey) {
    return false;
  }

  // 前の日（lastResetDate の日）の状態として、「全部チェックの日」だったか判定
  if (isAllTasksAllDoneAcrossTabs()) {
    state.perfectCount = (state.perfectCount || 0) + 1;
  }

  // 平日・休日両方のチェックをリセット
  state.weekday.checks = state.weekday.tasks.map(list => list.map(() => false));
  state.holiday.checks = state.holiday.tasks.map(list => list.map(() => false));
  state.lastResetDate = nowKey;

  // テンプレート自動判定
  autoSwitchTemplate();
  // アクセサリーの解放状況を更新
  updateAccessoryOptions();

  saveState();
  return true;
}

function handleDayChangeIfNeeded() {
  const changed = resetIfNeeded();
  if (!changed) return;

  // リセット後に画面が古いままにならないように更新
  renderTabs();
  renderTasks();
  syncHanamaruForActiveTab({ celebrate: false });
  refreshPoyoMessageForActiveTab();
  applyAccessoryFromState();
}

// 時計表示
function updateClock() {
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  const y = now.getFullYear();
  const mo = now.getMonth() + 1;
  const d = now.getDate();
  const day = days[now.getDay()];

  if (clockEl) clockEl.textContent = `${h}:${m}`;
  if (dateEl) dateEl.textContent = `${y}年${mo}月${d}日（${day}）`;
}

// タブ表示更新
function renderTabs() {
  const template = getCurrentTemplate();
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach((btn, index) => {
    btn.textContent = template.tabs[index] || `タブ${index + 1}`;
    if (index === state.activeTab) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// タスクリスト表示更新
function renderTasks() {
  const container = document.getElementById("task-list");
  if (!container) return;
  container.innerHTML = "";

  const template = getCurrentTemplate();
  const tabIndex = state.activeTab;
  const tasks = template.tasks[tabIndex] || [];
  const checks = template.checks[tabIndex] || [];

  tasks.forEach((text, i) => {
    const item = document.createElement("label");
    item.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!checks[i];

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    if (checkbox.checked) {
      item.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      template.checks[tabIndex][i] = checkbox.checked;
      if (checkbox.checked) {
        item.classList.add("completed");
      } else {
        item.classList.remove("completed");
      }
      saveState();

      // ✅ チェックを「入れた」ときだけ表情＆メッセージを変える
      if (checkbox.checked) {
        handleTaskChecked();
      }

      // ✅ タブ内が全部チェックになったら、はなまる
      syncHanamaruForActiveTab({ celebrate: true });
    });

    item.appendChild(checkbox);
    item.appendChild(span);
    container.appendChild(item);
  });
}

// アクセサリーの反映
function applyAccessoryFromState() {
  const ribbonEl = document.getElementById("poyo-ribbon");
  if (!ribbonEl) return;

  const conf = ACCESSORY_CONFIG.find(item => item.id === state.accessory);

  // "なし" など画像がない場合
  if (!conf || !conf.src) {
    ribbonEl.style.display = "none";
    return;
  }

  ribbonEl.style.display = "";
  ribbonEl.src = conf.src;
}

// アクセサリー名＋残り日数の表示更新
function updateAccessoryOptions() {
  const select = document.getElementById("accessory-select");
  if (!select) return;

  const perfect = state.perfectCount || 0;

  ACCESSORY_CONFIG.forEach(conf => {
    const option = select.querySelector(`option[value="${conf.id}"]`);
    if (!option) return;

    if (conf.requiredCount <= perfect) {
      // 開放済み
      option.disabled = false;
      option.textContent = conf.label;
    } else {
      // まだ開放されていない → 残り日数を表示
      const remaining = conf.requiredCount - perfect;
      option.disabled = true;
      option.textContent = `${conf.label}（あと${remaining}日）`;
    }
  });

  // もし今選んでいるアクセサリーがロック状態になっていたら、
  // 使えるものの中から先頭のものに戻す
  const current = ACCESSORY_CONFIG.find(c => c.id === state.accessory);
  if (!current || current.requiredCount > perfect) {
    const firstUnlocked = ACCESSORY_CONFIG.find(c => c.requiredCount <= perfect);
    if (firstUnlocked) {
      state.accessory = firstUnlocked.id;
      select.value = firstUnlocked.id;
      applyAccessoryFromState();
    }
  }
}

function setupAccessorySelect() {
  const select = document.getElementById("accessory-select");
  if (!select) return;

  // 一旦クリアしてアクセサリー一覧から作り直す
  select.innerHTML = "";
  ACCESSORY_CONFIG.forEach(conf => {
    const option = document.createElement("option");
    option.value = conf.id;
    select.appendChild(option);
  });

  // 残り日数表示・使用可/不可を反映
  updateAccessoryOptions();

  // 初期選択
  if (!state.accessory) {
    state.accessory = "none";
  }
  select.value = state.accessory;
  applyAccessoryFromState();

  // 選択されたとき
  select.addEventListener("change", () => {
    state.accessory = select.value;
    saveState();
    applyAccessoryFromState();
  });
}

// アクセサリー選択ボックスの表示／非表示トグル
function setupAccessoryToggle() {
  const accessoryBar = document.querySelector(".accessory-bar");
  const toggleBtn = document.getElementById("accessory-toggle-btn");
  if (!accessoryBar || !toggleBtn) return;

  let isVisible = state.accessoryPanelVisible;

  function apply() {
    accessoryBar.classList.toggle("is-hidden", !isVisible);
    toggleBtn.setAttribute("aria-pressed", isVisible ? "true" : "false");
  }

  toggleBtn.addEventListener("click", () => {
    isVisible = !isVisible;
    state.accessoryPanelVisible = isVisible;
    saveState();
    apply();
  });

  // 起動時の状態を反映
  apply();
}

// ========================
// 保護者モード かけ算クイズ
// ========================
let guardianQuiz = { a: 2, b: 3 };

function openGuardianQuiz() {
  const overlay = document.getElementById("guardian-quiz-overlay");
  const aEl = document.getElementById("guardian-quiz-a");
  const bEl = document.getElementById("guardian-quiz-b");
  const answerInput = document.getElementById("guardian-quiz-answer");
  const errorEl = document.getElementById("guardian-quiz-error");

  if (!overlay || !aEl || !bEl || !answerInput || !errorEl) return;

  guardianQuiz.a = Math.floor(Math.random() * 8) + 2;
  guardianQuiz.b = Math.floor(Math.random() * 8) + 2;

  aEl.textContent = guardianQuiz.a;
  bEl.textContent = guardianQuiz.b;

  answerInput.value = "";
  errorEl.textContent = "";

  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    answerInput.focus();
  }, 0);
}

function closeGuardianQuiz() {
  const overlay = document.getElementById("guardian-quiz-overlay");
  const errorEl = document.getElementById("guardian-quiz-error");
  if (!overlay || !errorEl) return;

  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
  errorEl.textContent = "";
}

// ========================
// 保護者モード（タブ・タスク編集）
// ========================
function applyGuardianModeState() {
  const body = document.body;
  const btn = document.getElementById("guardian-toggle-btn");
  if (!body) return;

  if (state.guardianMode) {
    body.classList.add("guardian-mode");
    if (btn) btn.setAttribute("aria-pressed", "true");
  } else {
    body.classList.remove("guardian-mode");
    if (btn) btn.setAttribute("aria-pressed", "false");
  }

  syncGuardianEditor();
}

function syncGuardianEditor() {
  const editor = document.getElementById("guardian-editor");
  const nameInput = document.getElementById("guardian-tab-name");
  const listContainer = document.getElementById("guardian-task-editor-list");
  const addBtn = document.getElementById("guardian-add-task");

  if (!editor || !nameInput || !listContainer || !addBtn) return;

  if (!state.guardianMode) {
    editor.setAttribute("aria-hidden", "true");
    listContainer.innerHTML = "";
    return;
  }

  editor.setAttribute("aria-hidden", "false");

  // 編集元は guardianDraft （なければ getCurrentTemplate から作る）
  if (!guardianDraft) {
    resetGuardianDraftFromState();
  }
  const src = guardianDraft;

  const tabIndex = state.activeTab;
  const tasks = src.tasks[tabIndex] || [];

  // タブ名
  nameInput.value = src.tabs[tabIndex] || "";
  nameInput.oninput = (event) => {
    src.tabs[tabIndex] = event.target.value;
  };

  // タスク編集
  listContainer.innerHTML = "";
  tasks.forEach((text, i) => {
    const row = document.createElement("div");
    row.className = "guardian-task-row";
    row.dataset.index = String(i); // 並び替え後に使う

    // ドラッグ用ハンドル
    const handle = document.createElement("span");
    handle.className = "guardian-task-handle";
    handle.textContent = "≡";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "guardian-task-input";
    input.value = text;
    input.addEventListener("input", (event) => {
      src.tasks[tabIndex][i] = event.target.value;
    });

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "guardian-task-delete";
    delBtn.textContent = "削除";
    delBtn.addEventListener("click", () => {
      src.tasks[tabIndex].splice(i, 1);
      src.checks[tabIndex].splice(i, 1);
      // インデックスが変わるので描画し直し
      syncGuardianEditor();
    });

    row.appendChild(handle);
    row.appendChild(input);
    row.appendChild(delBtn);
    listContainer.appendChild(row);
  });

  // タスク追加
  addBtn.onclick = () => {
    const idx = state.activeTab;
    if (!src.tasks[idx]) {
      src.tasks[idx] = [];
      src.checks[idx] = [];
    }
    src.tasks[idx].push("新しいやること");
    src.checks[idx].push(false);
    syncGuardianEditor();
  };

  // ★ 並べ替え（ドラッグ＆ドロップ）を有効化
  if (window.Sortable) {
    // 前回のインスタンスがあれば破棄
    if (listContainer._sortableInstance) {
      listContainer._sortableInstance.destroy();
      listContainer._sortableInstance = null;
    }

    listContainer._sortableInstance = Sortable.create(listContainer, {
      animation: 120,
      handle: ".guardian-task-handle",
      ghostClass: "guardian-task-row-ghost",
      onEnd: () => {
        const tabIndex = state.activeTab;
        const oldTasks = src.tasks[tabIndex];
        const oldChecks = src.checks[tabIndex];
        const newTasks = [];
        const newChecks = [];

        listContainer.querySelectorAll(".guardian-task-row").forEach((rowEl) => {
          const idx = Number(rowEl.dataset.index);
          if (!Number.isNaN(idx) && oldTasks[idx] !== undefined) {
            newTasks.push(oldTasks[idx]);
            newChecks.push(oldChecks[idx]);
          }
        });

        src.tasks[tabIndex] = newTasks;
        src.checks[tabIndex] = newChecks;

        // data-index を振り直すために再描画
        syncGuardianEditor();
      }
    });
  }
}

function setupGuardianQuiz() {
  const overlay = document.getElementById("guardian-quiz-overlay");
  const answerInput = document.getElementById("guardian-quiz-answer");
  const okBtn = document.getElementById("guardian-quiz-ok");
  const cancelBtn = document.getElementById("guardian-quiz-cancel");
  const errorEl = document.getElementById("guardian-quiz-error");
  const toggleBtn = document.getElementById("guardian-toggle-btn");

  if (!overlay || !answerInput || !okBtn || !cancelBtn || !errorEl || !toggleBtn) return;

  function handleSubmit() {
    const value = answerInput.value.trim();
    const correct = guardianQuiz.a * guardianQuiz.b;
    const num = Number(value);

    if (!value || !Number.isFinite(num)) {
      errorEl.textContent = "すうじで入れてください。";
      return;
    }
    if (num !== correct) {
      errorEl.textContent = "ちょっとちがうみたい…もう一度どうぞ。";
      return;
    }

    // 正解 → 保護者モードON
    state.guardianMode = true;
    saveState();
    applyGuardianModeState();
    closeGuardianQuiz();
  }

  okBtn.addEventListener("click", handleSubmit);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  });

  cancelBtn.addEventListener("click", () => {
    closeGuardianQuiz();
    // 状態はそのまま（ONになっていなければOFFのまま）
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeGuardianQuiz();
    }
  });
}

// ぽよのメッセージ・動き
let poyoFaceEl = null;
let poyoEyes = null; // 目の要素たち

function startPoyoTalk() {
  // 顔全体
  if (!poyoFaceEl) {
    poyoFaceEl = document.querySelector(".poyo-face");
    if (!poyoFaceEl) return;
  }

  // 目（＾＾用）
  if (!poyoEyes) {
    poyoEyes = Array.from(document.querySelectorAll(".poyo-eye"));
  }

  // いったんリセット
  poyoFaceEl.classList.remove("poyo-speaking");
  if (poyoEyes && poyoEyes.length) {
    poyoEyes.forEach((eye) => eye.classList.remove("smiling"));
  }

  // 再適用のための強制リフロー
  void poyoFaceEl.offsetWidth;

  // 口パク＋目にっこり開始
  poyoFaceEl.classList.add("poyo-speaking");
  if (poyoEyes && poyoEyes.length) {
    poyoEyes.forEach((eye) => eye.classList.add("smiling"));

    // 少し経ったら目だけ元に戻す
    setTimeout(() => {
      poyoEyes.forEach((eye) => eye.classList.remove("smiling"));
    }, 650);
  }
}

function setPoyoMessage(text) {
  const msgEl = document.getElementById("poyo-message");
  if (!msgEl) return;
  msgEl.textContent = text;
  startPoyoTalk();
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function handleTaskChecked() {
  const template = getCurrentTemplate();
  const tabIndex = state.activeTab;
  const tasks = template.tasks[tabIndex] || [];
  const checks = template.checks[tabIndex] || [];
  const allDone = tasks.length > 0 && checks.every(c => c);

  // ここではメッセージと表情だけ変える
  if (allDone) {
    setPoyoMessage(randomFrom(POYO_MESSAGES_ALL_DONE));
  } else {
    setPoyoMessage(randomFrom(POYO_MESSAGES_CHECK));
  }
}

function refreshPoyoMessageForActiveTab() {
  const template = getCurrentTemplate();
  const tabIndex = state.activeTab;
  const tasks = template.tasks[tabIndex] || [];
  const checks = template.checks[tabIndex] || [];

  // 何もタスクがないときは、とりあえず通常メッセージ
  if (!tasks.length) {
    setPoyoMessage(randomFrom(POYO_MESSAGES_NORMAL));
    return;
  }

  const allDone = isTabAllDone(tabIndex);
  const anyChecked = checks.some(Boolean);

  if (allDone) {
    // そのタブが全部終わっているとき
    setPoyoMessage(randomFrom(POYO_MESSAGES_ALL_DONE));
  } else if (anyChecked) {
    // いくつかチェックが入っているけど、全部は終わっていないとき
    setPoyoMessage(randomFrom(POYO_MESSAGES_CHECK));
  } else {
    // まだ1つもチェックが入っていないとき
    setPoyoMessage(randomFrom(POYO_MESSAGES_NORMAL));
  }
}

// ぽよをタップしたときの反応（ぽよーん＋口●、メッセージは変えない）
function setupPoyoTap() {
  const poyo = document.getElementById("poyo");
  if (!poyo) return;

  // 顔パーツ（口）がまだ取れていなければ、一度だけ取得
  if (!poyoFaceEl) {
    poyoFaceEl = document.querySelector(".poyo-face");
  }
  const face = poyoFaceEl;
  if (!face) return;

  poyo.addEventListener("click", () => {
    // からだを「ぽよーん」と弾ませる（タップ専用クラスを使う）
    poyo.classList.remove("poyo-tap");
    void poyo.offsetWidth; // アニメ再適用トリガ
    poyo.classList.add("poyo-tap");

    // アニメが終わったらクラスを外して、常時ぽよぽよに戻す
    setTimeout(() => {
      poyo.classList.remove("poyo-tap");
    }, 600); // poyoTap の時間と合わせる

    // 口のアニメ（しゃべり）をリセットしてから、まんまるの口に
    face.classList.remove("poyo-speaking", "poyo-mouth-open");
    void face.offsetWidth;
    face.classList.add("poyo-mouth-open");

    // 少し経ったら元の口に戻す
    setTimeout(() => {
      face.classList.remove("poyo-mouth-open");
    }, 400);
  });
}

// 全画面ボタン
function setupFullscreenButton() {
  const btn = document.getElementById("fullscreen-btn");
  if (!btn) return;

  // 今フルスクリーン中かどうか判定
  function isFullscreen() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  // アイコン用のクラスと aria を同期
  function syncState() {
    if (isFullscreen()) {
      document.body.classList.add("is-fullscreen");
      btn.setAttribute("aria-pressed", "true");
    } else {
      document.body.classList.remove("is-fullscreen");
      btn.setAttribute("aria-pressed", "false");
    }
  }

  btn.addEventListener("click", () => {
    if (!isFullscreen()) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  });

  // フルスクリーン状態が変わったときに同期
  document.addEventListener("fullscreenchange", syncState);
  document.addEventListener("webkitfullscreenchange", syncState);
  document.addEventListener("MSFullscreenChange", syncState);

  // 初期状態の反映
  syncState();
}

// つかいかたモーダル
function setupHelpOverlay() {
  const helpBtn = document.getElementById("help-btn");
  const overlay = document.getElementById("help-overlay");
  const closeBtn = document.getElementById("help-close");

  if (!helpBtn || !overlay || !closeBtn) return;

  function openHelp() {
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeHelp() {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  helpBtn.addEventListener("click", openHelp);
  closeBtn.addEventListener("click", closeHelp);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeHelp();
    }
  });
}

function setupGuardianMode() {
  const btn = document.getElementById("guardian-toggle-btn");
  if (!btn) return;

  // リロード時の見た目を state に合わせる
  applyGuardianModeState();

  btn.addEventListener("click", () => {
    // すでに ON → OFF にするだけ
    if (state.guardianMode) {
      // 保護者モード終了 → 下書きを捨てる
      state.guardianMode = false;
      guardianDraft = null;
      saveState();
      applyGuardianModeState();

      // 子ども側は state のままなので、念のため再描画
      renderTabs();
      renderTasks();
      syncHanamaruForActiveTab({ celebrate: false });
      refreshPoyoMessageForActiveTab();
      return;
    }

    // OFF → クイズを出して、正解したら ON
    openGuardianQuiz();
  });
}

function setupGuardianSaveButton() {
  const saveBtn = document.getElementById("guardian-save");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    if (!guardianDraft) {
      return;
    }

    // ① 下書き内容を現在のテンプレートに反映
    const template = getCurrentTemplate();
    template.tabs  = guardianDraft.tabs.map((t) => t);
    template.tasks = guardianDraft.tasks.map((list) => [...list]);
    template.checks = guardianDraft.checks.map((list) => [...list]);

    // ② 保護者モードを終了（下書きも破棄）
    state.guardianMode = false;
    guardianDraft = null;

    // ③ 保存・見た目・チェックリストを更新
    saveState();
    applyGuardianModeState();
    renderTabs();
    renderTasks();
    syncHanamaruForActiveTab({ celebrate: false });
    refreshPoyoMessageForActiveTab();
  });
}

// 平日/休日ボタンの切り替え
function setupTemplateSwitchButtons() {
  const weekdayBtn = document.getElementById("template-weekday-btn");
  const holidayBtn = document.getElementById("template-holiday-btn");
  
  if (!weekdayBtn || !holidayBtn) return;

  function updateButtonState() {
    if (state.templateMode === "weekday") {
      weekdayBtn.classList.add("active");
      holidayBtn.classList.remove("active");
    } else {
      weekdayBtn.classList.remove("active");
      holidayBtn.classList.add("active");
    }
  }

function switchTemplate(mode) {
  // 同じモードなら何もしない
  if (state.templateMode === mode) return;

  // テンプレート切り替え
  state.templateMode = mode;

  // 保護者モード中にテンプレ切り替えしたときは、
  // 下書きはそのテンプレート用に作り直したいので一度捨てる
  guardianDraft = null;

  saveState();
  updateButtonState();
  renderTabs();
  renderTasks();
  syncHanamaruForActiveTab({ celebrate: false });
  syncGuardianEditor();
  refreshPoyoMessageForActiveTab();
}


  weekdayBtn.addEventListener("click", () => {
    switchTemplate("weekday");
  });

  holidayBtn.addEventListener("click", () => {
    switchTemplate("holiday");
  });

  // 初期状態の反映
  updateButtonState();
}

// 初期化
function init() {
  loadState();
  resetIfNeeded();
  renderTabs();
  renderTasks();
  setupGuardianMode();
  setupTemplateSwitchButtons();
  setupGuardianSaveButton();
  setupGuardianQuiz();
  setupAccessorySelect();
  setupAccessoryToggle();
  syncHanamaruForActiveTab({ celebrate: false }); // 起動時の状態反映
  refreshPoyoMessageForActiveTab();
  updateClock();
  setInterval(updateClock, 1000);
  
    // 開きっぱなしで0時を跨いでもリセットされるように監視
  setInterval(handleDayChangeIfNeeded, 60 * 1000);

  // スリープ復帰やタブ復帰でも拾う
  window.addEventListener("focus", handleDayChangeIfNeeded);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) handleDayChangeIfNeeded();
  });

  // タブ切り替え
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.tab || 0);
      state.activeTab = idx;
      saveState();
      renderTabs();
      renderTasks();
      syncHanamaruForActiveTab({ celebrate: false });
      syncGuardianEditor();
      refreshPoyoMessageForActiveTab();  // ← ここでタブの状態に合わせてセリフ更新
    });
  });

  // ぽよを触ったときだけ、ぽよーんと弾ませて口を●にする
  setupPoyoTap();

  setupFullscreenButton();
  setupHelpOverlay();

  // はなまるをタップしたら閉じる
  const overlay = document.getElementById("hanamaru-overlay");
  if (overlay) {
    overlay.addEventListener("click", hideHanamaru);
  }
}

document.addEventListener("DOMContentLoaded", init);

// Service Worker の登録（対応ブラウザのみ）
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}