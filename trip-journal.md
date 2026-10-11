---
layout: page
title: 旅の記録
permalink: /trips/j8k2m9x4qz/
sitemap: false
robots: noindex
---

<style>
  .tj-hidden { display: none !important; }
  .tj-wrap { max-width: 720px; margin: 0 auto; }

  /* login */
  .tj-login { max-width: 320px; margin: 3rem auto; display: flex; flex-direction: column; gap: 0.75rem; }
  .tj-login input {
    padding: 0.7rem 0.9rem; border: 1px solid var(--sb-border); border-radius: 8px;
    font-size: 1rem; font-family: inherit;
  }
  .tj-btn {
    appearance: none; border: none; border-radius: 999px; padding: 0.7rem 1.2rem;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: inherit;
    background: var(--sb-green); color: #fff;
  }
  .tj-btn:hover { background: var(--sb-green-dark); }
  .tj-btn.secondary { background: var(--sb-card); color: var(--sb-green-dark); border: 1px solid var(--sb-border); }
  .tj-btn.danger { background: #B3432D; }
  .tj-error { color: #B3432D; font-size: 0.85rem; }

  /* trip setup */
  .tj-setup { max-width: 480px; margin: 2rem auto; display: flex; flex-direction: column; gap: 0.9rem; }
  .tj-setup label { font-size: 0.82rem; font-weight: 700; color: var(--sb-brown-soft); display: block; margin-bottom: 0.3rem; }
  .tj-hint { font-size: 0.78rem; color: var(--sb-brown-soft); margin: 0 0 0.4rem; }
  .tj-setup input {
    width: 100%; box-sizing: border-box; padding: 0.6rem 0.8rem; border: 1px solid var(--sb-border);
    border-radius: 8px; font-size: 0.95rem; font-family: inherit;
  }
  .tj-row { display: flex; gap: 0.6rem; }
  .tj-row > div { flex: 1; }
  .tj-chip-list { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.4rem; }
  .tj-chip {
    display: inline-flex; align-items: center; gap: 0.3rem; background: var(--sb-cream);
    border: 1px solid var(--sb-border); border-radius: 999px; padding: 0.25rem 0.7rem; font-size: 0.82rem;
  }
  .tj-chip button { border: none; background: none; cursor: pointer; color: var(--sb-brown-soft); font-size: 0.9rem; }

  /* header */
  .tj-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
  .tj-title { font-size: 1.4rem; font-weight: 700; color: var(--sb-green-dark); }
  .tj-subtitle { font-size: 0.85rem; color: var(--sb-brown-soft); }
  .tj-as { font-size: 0.82rem; color: var(--sb-brown-soft); display: flex; align-items: center; gap: 0.4rem; }
  .tj-as select { border: 1px solid var(--sb-border); border-radius: 6px; padding: 0.25rem 0.5rem; font-family: inherit; }

  /* tabs */
  .tj-tabs { display: flex; gap: 0.4rem; margin-bottom: 1.25rem; border-bottom: 1px solid var(--sb-border); }
  .tj-tab {
    appearance: none; border: none; background: none; cursor: pointer; font-family: inherit;
    padding: 0.6rem 0.9rem; font-size: 0.9rem; font-weight: 700; color: var(--sb-brown-soft);
    border-bottom: 2px solid transparent;
  }
  .tj-tab.active { color: var(--sb-green-dark); border-bottom-color: var(--sb-green); }

  /* day tabs */
  .tj-day-tabs { display: flex; gap: 0.4rem; overflow-x: auto; margin-bottom: 1rem; padding-bottom: 0.3rem; }
  .tj-day-tab {
    appearance: none; border: 1px solid var(--sb-border); background: var(--sb-card); cursor: pointer;
    font-family: inherit; border-radius: 10px; padding: 0.5rem 0.8rem; font-size: 0.8rem; white-space: nowrap;
  }
  .tj-day-tab.active { background: var(--sb-green); color: #fff; border-color: var(--sb-green); }

  .tj-card { background: var(--sb-card); border: 1px solid var(--sb-border); border-radius: 12px; padding: 1rem; margin-bottom: 0.9rem; }
  .tj-card-title { font-weight: 700; color: var(--sb-brown); margin-bottom: 0.5rem; font-size: 0.95rem; }

  .tj-hotel-row { display: flex; gap: 0.5rem; align-items: center; }
  .tj-hotel-row input { flex: 1; padding: 0.5rem 0.7rem; border: 1px solid var(--sb-border); border-radius: 8px; font-family: inherit; }

  .tj-item { display: flex; gap: 0.6rem; align-items: flex-start; padding: 0.6rem 0; border-top: 1px solid var(--sb-border); }
  .tj-item:first-child { border-top: none; }
  .tj-item-icon { font-size: 1.1rem; width: 1.6rem; text-align: center; flex-shrink: 0; }
  .tj-item-body { flex: 1; min-width: 0; }
  .tj-item-time { font-weight: 700; color: var(--sb-green-dark); font-size: 0.85rem; }
  .tj-item-title { font-size: 0.9rem; color: var(--sb-brown); }
  .tj-item-detail { font-size: 0.78rem; color: var(--sb-brown-soft); }
  .tj-item-del { border: none; background: none; cursor: pointer; color: var(--sb-brown-soft); font-size: 0.85rem; }

  .tj-add-form { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.7rem; border-top: 1px dashed var(--sb-border); padding-top: 0.7rem; }
  .tj-add-form .tj-row input, .tj-add-form .tj-row select { width: 100%; box-sizing: border-box; padding: 0.5rem 0.6rem; border: 1px solid var(--sb-border); border-radius: 8px; font-family: inherit; font-size: 0.85rem; }
  .tj-add-form input[type="text"] { padding: 0.5rem 0.6rem; border: 1px solid var(--sb-border); border-radius: 8px; font-family: inherit; font-size: 0.85rem; }

  /* cost */
  .tj-cost-item { padding: 0.7rem 0; border-top: 1px solid var(--sb-border); }
  .tj-cost-item:first-child { border-top: none; }
  .tj-cost-top { display: flex; justify-content: space-between; align-items: baseline; }
  .tj-cost-title { font-weight: 700; color: var(--sb-brown); font-size: 0.9rem; }
  .tj-cost-amount { font-weight: 700; color: var(--sb-green-dark); font-size: 0.95rem; }
  .tj-cost-meta { font-size: 0.78rem; color: var(--sb-brown-soft); margin-top: 0.2rem; }
  .tj-settle-row { display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.88rem; border-top: 1px solid var(--sb-border); }
  .tj-settle-row:first-child { border-top: none; }
  .tj-settle-plus { color: var(--sb-green-dark); font-weight: 700; }
  .tj-settle-minus { color: #B3432D; font-weight: 700; }

  .tj-check-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; }
  .tj-participant-checks { display: flex; flex-wrap: wrap; gap: 0.5rem; }

  /* media */
  .tj-upload-box {
    border: 2px dashed var(--sb-border); border-radius: 12px; padding: 1.5rem; text-align: center;
    color: var(--sb-brown-soft); font-size: 0.85rem; margin-bottom: 1rem;
  }
  .tj-upload-box input[type="file"] { margin-top: 0.6rem; }
  .tj-media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.6rem; }
  .tj-media-cell { position: relative; border-radius: 8px; overflow: hidden; background: var(--sb-cream); aspect-ratio: 1; }
  .tj-media-cell img, .tj-media-cell video { width: 100%; height: 100%; object-fit: cover; }
  .tj-media-badge {
    position: absolute; bottom: 0.3rem; left: 0.3rem; background: rgba(17,32,27,0.65); color: #fff;
    font-size: 0.65rem; padding: 0.1rem 0.4rem; border-radius: 999px;
  }
  .tj-media-ok {
    position: absolute; top: 0.3rem; right: 0.3rem; width: 1.1rem; height: 1.1rem; border-radius: 50%;
    background: var(--sb-green); color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
  }

  .tj-empty { color: var(--sb-brown-soft); font-size: 0.85rem; padding: 1rem 0; }
</style>

<div class="tj-wrap">

  <!-- LOGIN -->
  <div id="tjLogin" class="tj-login">
    <p style="font-size:0.85rem;color:var(--sb-brown-soft);">共有されたIDとパスワードでログインしてください。</p>
    <input id="tjLoginId" type="text" placeholder="ID">
    <input id="tjLoginPw" type="password" placeholder="パスワード">
    <button class="tj-btn" id="tjLoginBtn">ログイン</button>
    <p id="tjLoginError" class="tj-error"></p>
  </div>

  <!-- TRIP SETUP -->
  <div id="tjSetup" class="tj-setup tj-hidden">
    <h2 style="color:var(--sb-green-dark);margin:0;">旅の情報を入力</h2>
    <div>
      <label>旅行名</label>
      <input id="tjSetupName" type="text" placeholder="例：沖縄旅行2026">
    </div>
    <div>
      <label>行き先</label>
      <input id="tjSetupDest" type="text" placeholder="例：沖縄">
    </div>
    <div class="tj-row">
      <div>
        <label>開始日</label>
        <input id="tjSetupStart" type="date">
      </div>
      <div>
        <label>終了日</label>
        <input id="tjSetupEnd" type="date">
      </div>
    </div>
    <div>
      <label>参加者</label>
      <p class="tj-hint">名前を入力して「追加」を押してください。1人ずつ追加できます。</p>
      <div class="tj-row">
        <input id="tjSetupParticipant" type="text" placeholder="例：まこと">
        <button type="button" class="tj-btn secondary" id="tjSetupParticipantAdd" style="flex:none;">追加</button>
      </div>
      <div class="tj-chip-list" id="tjSetupParticipantList"></div>
    </div>
    <button class="tj-btn" id="tjSetupSave">旅を作成</button>
    <p id="tjSetupError" class="tj-error"></p>
  </div>

  <!-- MAIN APP -->
  <div id="tjApp" class="tj-hidden">
    <div class="tj-header">
      <div>
        <div class="tj-title" id="tjTripName"></div>
        <div class="tj-subtitle" id="tjTripDates"></div>
      </div>
      <div class="tj-as">
        投稿者：
        <select id="tjAsSelect"></select>
      </div>
    </div>

    <div class="tj-tabs">
      <button class="tj-tab active" data-tab="schedule">タイムライン</button>
      <button class="tj-tab" data-tab="cost">コスト</button>
      <button class="tj-tab" data-tab="media">写真・動画</button>
    </div>

    <!-- SCHEDULE TAB -->
    <div id="tjTabSchedule" class="tj-tab-panel">
      <div class="tj-day-tabs" id="tjDayTabs"></div>

      <div class="tj-card">
        <div class="tj-card-title">宿泊先</div>
        <div class="tj-hotel-row">
          <input id="tjHotelInput" type="text" placeholder="ホテル名を入力">
          <button class="tj-btn secondary" id="tjHotelSave">保存</button>
        </div>
      </div>

      <div class="tj-card">
        <div class="tj-card-title">この日の予定</div>
        <div id="tjItemList"></div>
        <div class="tj-add-form">
          <div class="tj-row">
            <select id="tjItemType">
              <option value="flight">✈️ フライト</option>
              <option value="train">🚆 電車</option>
              <option value="car">🚗 レンタカー</option>
              <option value="bus">🚌 バス</option>
              <option value="other">📍 その他</option>
            </select>
            <input id="tjItemTime" type="time">
          </div>
          <input id="tjItemTitle" type="text" placeholder="例：羽田発 ANA123便">
          <input id="tjItemDetail" type="text" placeholder="補足（任意）">
          <button class="tj-btn secondary" id="tjItemAdd">追加</button>
        </div>
      </div>
    </div>

    <!-- COST TAB -->
    <div id="tjTabCost" class="tj-tab-panel tj-hidden">
      <div class="tj-card">
        <div class="tj-card-title">コスト一覧</div>
        <div id="tjCostList"></div>
        <div class="tj-add-form">
          <input id="tjCostTitle" type="text" placeholder="例：夕食代">
          <div class="tj-row">
            <input id="tjCostAmount" type="number" placeholder="金額（円）">
            <select id="tjCostPaidBy"></select>
          </div>
          <div class="tj-check-row">
            <label><input type="checkbox" id="tjCostSplitAll" checked> 全員で割る</label>
          </div>
          <div class="tj-participant-checks tj-hidden" id="tjCostParticipantChecks"></div>
          <button class="tj-btn secondary" id="tjCostAdd">追加</button>
        </div>
      </div>

      <div class="tj-card">
        <div class="tj-card-title">精算</div>
        <div id="tjSettleList"></div>
      </div>
    </div>

    <!-- MEDIA TAB -->
    <div id="tjTabMedia" class="tj-tab-panel tj-hidden">
      <div class="tj-upload-box">
        写真はそのまま、動画は<strong>3秒以内</strong>のみアップロードできます。
        <br>
        <input id="tjMediaFile" type="file" accept="image/*,video/*">
      </div>
      <p id="tjMediaError" class="tj-error"></p>
      <div class="tj-media-grid" id="tjMediaGrid"></div>
    </div>
  </div>
</div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
  import {
    getFirestore, doc, getDoc, setDoc, collection, addDoc, deleteDoc,
    onSnapshot, query, orderBy, serverTimestamp
  } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
  import {
    getStorage, ref, uploadBytes, getDownloadURL
  } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBmE10Y2CIEpfAbeEswCATqbA3qqL0ZhtQ",
    authDomain: "tripxtrip-3fc0e.firebaseapp.com",
    projectId: "tripxtrip-3fc0e",
    storageBucket: "tripxtrip-3fc0e.firebasestorage.app",
    messagingSenderId: "996558605198",
    appId: "1:996558605198:web:e51fb1615f2cedcb4ab2df"
  };

  const TRIP_ID = "j8k2m9x4qz";

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  var tripData = null;
  var selectedDayIndex = 1;
  var unsubItems = null;
  var unsubCosts = null;
  var unsubMedia = null;
  var setupParticipants = [];

  // ---------- AUTH ----------
  document.getElementById('tjLoginBtn').addEventListener('click', function () {
    var id = document.getElementById('tjLoginId').value.trim();
    var pw = document.getElementById('tjLoginPw').value;
    var errEl = document.getElementById('tjLoginError');
    errEl.textContent = '';
    signInWithEmailAndPassword(auth, id, pw).catch(function (e) {
      errEl.textContent = 'ログインできませんでした。IDとパスワードを確認してください。';
    });
  });

  onAuthStateChanged(auth, function (user) {
    if (user) {
      document.getElementById('tjLogin').classList.add('tj-hidden');
      loadTrip();
    } else {
      document.getElementById('tjLogin').classList.remove('tj-hidden');
      document.getElementById('tjSetup').classList.add('tj-hidden');
      document.getElementById('tjApp').classList.add('tj-hidden');
    }
  });

  // ---------- TRIP SETUP ----------
  function loadTrip() {
    var tripRef = doc(db, 'trips', TRIP_ID);
    getDoc(tripRef).then(function (snap) {
      if (snap.exists()) {
        tripData = snap.data();
        showApp();
      } else {
        document.getElementById('tjSetup').classList.remove('tj-hidden');
      }
    });
  }

  function addSetupParticipant() {
    var input = document.getElementById('tjSetupParticipant');
    var v = input.value.trim();
    if (!v) return;
    setupParticipants.push(v);
    input.value = '';
    input.focus();
    renderSetupParticipants();
  }
  document.getElementById('tjSetupParticipantAdd').addEventListener('click', addSetupParticipant);
  document.getElementById('tjSetupParticipant').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    addSetupParticipant();
  });

  function renderSetupParticipants() {
    var wrap = document.getElementById('tjSetupParticipantList');
    wrap.innerHTML = '';
    setupParticipants.forEach(function (name, i) {
      var chip = document.createElement('span');
      chip.className = 'tj-chip';
      chip.innerHTML = '<span></span><button type="button">×</button>';
      chip.querySelector('span').textContent = name;
      chip.querySelector('button').addEventListener('click', function () {
        setupParticipants.splice(i, 1);
        renderSetupParticipants();
      });
      wrap.appendChild(chip);
    });
  }

  document.getElementById('tjSetupSave').addEventListener('click', function () {
    var name = document.getElementById('tjSetupName').value.trim();
    var dest = document.getElementById('tjSetupDest').value.trim();
    var start = document.getElementById('tjSetupStart').value;
    var end = document.getElementById('tjSetupEnd').value;
    var errEl = document.getElementById('tjSetupError');
    if (!name || !start || !end || setupParticipants.length === 0) {
      errEl.textContent = '全ての項目を入力してください（参加者は1人以上）。';
      return;
    }
    var data = { name: name, destination: dest, startDate: start, endDate: end, participants: setupParticipants, createdAt: serverTimestamp() };
    setDoc(doc(db, 'trips', TRIP_ID), data).then(function () {
      tripData = data;
      document.getElementById('tjSetup').classList.add('tj-hidden');
      showApp();
    }).catch(function (e) {
      errEl.textContent = '保存に失敗しました: ' + e.message;
    });
  });

  // ---------- APP SHELL ----------
  function showApp() {
    document.getElementById('tjApp').classList.remove('tj-hidden');
    document.getElementById('tjTripName').textContent = tripData.name;
    document.getElementById('tjTripDates').textContent = tripData.destination + '　' + tripData.startDate + ' 〜 ' + tripData.endDate;

    var asSelect = document.getElementById('tjAsSelect');
    asSelect.innerHTML = '';
    tripData.participants.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p; opt.textContent = p;
      asSelect.appendChild(opt);
    });
    var saved = localStorage.getItem('tj_as_' + TRIP_ID);
    if (saved && tripData.participants.indexOf(saved) !== -1) { asSelect.value = saved; }
    asSelect.addEventListener('change', function () {
      try { localStorage.setItem('tj_as_' + TRIP_ID, asSelect.value); } catch (e) {}
    });
    try { localStorage.setItem('tj_as_' + TRIP_ID, asSelect.value); } catch (e) {}

    renderDayTabs();
    selectDay(1);
    renderCostPaidBy();
    renderCostParticipantChecks();
    watchCosts();
    watchMedia();
  }

  function dayCount() {
    var start = new Date(tripData.startDate);
    var end = new Date(tripData.endDate);
    return Math.max(1, Math.round((end - start) / 86400000) + 1);
  }

  function dayDateLabel(idx) {
    var start = new Date(tripData.startDate);
    var d = new Date(start.getTime() + (idx - 1) * 86400000);
    var w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
    return (d.getMonth() + 1) + '/' + d.getDate() + '(' + w + ')';
  }

  function renderDayTabs() {
    var wrap = document.getElementById('tjDayTabs');
    wrap.innerHTML = '';
    var n = dayCount();
    for (var i = 1; i <= n; i++) {
      (function (idx) {
        var btn = document.createElement('button');
        btn.className = 'tj-day-tab' + (idx === selectedDayIndex ? ' active' : '');
        btn.textContent = idx + '日目 ' + dayDateLabel(idx);
        btn.addEventListener('click', function () { selectDay(idx); });
        wrap.appendChild(btn);
      })(i);
    }
  }

  // ---------- TABS ----------
  document.querySelectorAll('.tj-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tj-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      document.querySelectorAll('.tj-tab-panel').forEach(function (p) { p.classList.add('tj-hidden'); });
      var name = tab.getAttribute('data-tab');
      document.getElementById('tjTab' + name.charAt(0).toUpperCase() + name.slice(1)).classList.remove('tj-hidden');
    });
  });

  // ---------- SCHEDULE: DAY SELECT ----------
  function selectDay(idx) {
    selectedDayIndex = idx;
    renderDayTabs();
    loadHotel();
    watchItems();
  }

  function dayDocRef() {
    return doc(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex));
  }

  function loadHotel() {
    getDoc(dayDocRef()).then(function (snap) {
      document.getElementById('tjHotelInput').value = snap.exists() ? (snap.data().hotel || '') : '';
    });
  }

  document.getElementById('tjHotelSave').addEventListener('click', function () {
    var hotel = document.getElementById('tjHotelInput').value.trim();
    setDoc(dayDocRef(), { hotel: hotel, dayIndex: selectedDayIndex }, { merge: true });
  });

  var typeIcons = { flight: '✈️', train: '🚆', car: '🚗', bus: '🚌', other: '📍' };

  function watchItems() {
    if (unsubItems) { unsubItems(); }
    var q = query(collection(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex), 'items'), orderBy('time'));
    unsubItems = onSnapshot(q, function (snap) {
      var list = document.getElementById('tjItemList');
      list.innerHTML = '';
      if (snap.empty) {
        list.innerHTML = '<div class="tj-empty">まだ予定がありません</div>';
        return;
      }
      snap.forEach(function (docSnap) {
        var d = docSnap.data();
        var row = document.createElement('div');
        row.className = 'tj-item';
        row.innerHTML = '<div class="tj-item-icon">' + (typeIcons[d.type] || '📍') + '</div>' +
          '<div class="tj-item-body"><div class="tj-item-time">' + (d.time || '') + '</div>' +
          '<div class="tj-item-title"></div><div class="tj-item-detail"></div></div>' +
          '<button class="tj-item-del">削除</button>';
        row.querySelector('.tj-item-title').textContent = d.title || '';
        row.querySelector('.tj-item-detail').textContent = d.detail || '';
        row.querySelector('.tj-item-del').addEventListener('click', function () {
          deleteDoc(doc(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex), 'items', docSnap.id));
        });
        list.appendChild(row);
      });
    });
  }

  document.getElementById('tjItemAdd').addEventListener('click', function () {
    var type = document.getElementById('tjItemType').value;
    var time = document.getElementById('tjItemTime').value;
    var title = document.getElementById('tjItemTitle').value.trim();
    var detail = document.getElementById('tjItemDetail').value.trim();
    if (!title) return;
    addDoc(collection(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex), 'items'), {
      type: type, time: time, title: title, detail: detail,
      postedBy: document.getElementById('tjAsSelect').value, createdAt: serverTimestamp()
    }).then(function () {
      document.getElementById('tjItemTitle').value = '';
      document.getElementById('tjItemDetail').value = '';
    });
  });

  // ---------- COST ----------
  function renderCostPaidBy() {
    var sel = document.getElementById('tjCostPaidBy');
    sel.innerHTML = '';
    tripData.participants.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p; opt.textContent = p;
      sel.appendChild(opt);
    });
  }

  function renderCostParticipantChecks() {
    var wrap = document.getElementById('tjCostParticipantChecks');
    wrap.innerHTML = '';
    tripData.participants.forEach(function (p) {
      var label = document.createElement('label');
      label.className = 'tj-check-row';
      label.innerHTML = '<input type="checkbox" checked> ';
      label.appendChild(document.createTextNode(p));
      label.setAttribute('data-name', p);
      wrap.appendChild(label);
    });
  }

  document.getElementById('tjCostSplitAll').addEventListener('change', function () {
    document.getElementById('tjCostParticipantChecks').classList.toggle('tj-hidden', this.checked);
  });

  function watchCosts() {
    var q = query(collection(db, 'trips', TRIP_ID, 'costs'), orderBy('createdAt', 'desc'));
    unsubCosts = onSnapshot(q, function (snap) {
      var list = document.getElementById('tjCostList');
      list.innerHTML = '';
      var costs = [];
      if (snap.empty) {
        list.innerHTML = '<div class="tj-empty">まだコストがありません</div>';
      }
      snap.forEach(function (docSnap) {
        var d = docSnap.data();
        costs.push(d);
        var row = document.createElement('div');
        row.className = 'tj-cost-item';
        row.innerHTML = '<div class="tj-cost-top"><span class="tj-cost-title"></span><span class="tj-cost-amount"></span></div><div class="tj-cost-meta"></div>';
        row.querySelector('.tj-cost-title').textContent = d.title;
        row.querySelector('.tj-cost-amount').textContent = '¥' + Number(d.amount).toLocaleString();
        row.querySelector('.tj-cost-meta').textContent = d.paidBy + 'が支払い　/　' + (d.splitWith || []).join('・') + 'で割り勘';
        list.appendChild(row);
      });
      renderSettle(costs);
    });
  }

  document.getElementById('tjCostAdd').addEventListener('click', function () {
    var title = document.getElementById('tjCostTitle').value.trim();
    var amount = parseFloat(document.getElementById('tjCostAmount').value);
    var paidBy = document.getElementById('tjCostPaidBy').value;
    var splitAll = document.getElementById('tjCostSplitAll').checked;
    var splitWith;
    if (splitAll) {
      splitWith = tripData.participants.slice();
    } else {
      splitWith = [];
      document.querySelectorAll('#tjCostParticipantChecks label').forEach(function (label) {
        if (label.querySelector('input').checked) { splitWith.push(label.getAttribute('data-name')); }
      });
    }
    if (!title || !amount || splitWith.length === 0) return;
    addDoc(collection(db, 'trips', TRIP_ID, 'costs'), {
      title: title, amount: amount, paidBy: paidBy, splitWith: splitWith,
      postedBy: document.getElementById('tjAsSelect').value, createdAt: serverTimestamp()
    }).then(function () {
      document.getElementById('tjCostTitle').value = '';
      document.getElementById('tjCostAmount').value = '';
    });
  });

  function renderSettle(costs) {
    var balance = {};
    tripData.participants.forEach(function (p) { balance[p] = 0; });
    costs.forEach(function (c) {
      var share = c.amount / c.splitWith.length;
      c.splitWith.forEach(function (p) { if (balance[p] !== undefined) balance[p] -= share; });
      if (balance[c.paidBy] !== undefined) balance[c.paidBy] += c.amount;
    });
    var wrap = document.getElementById('tjSettleList');
    wrap.innerHTML = '';
    if (costs.length === 0) { wrap.innerHTML = '<div class="tj-empty">コストを追加すると精算額が表示されます</div>'; return; }
    tripData.participants.forEach(function (p) {
      var row = document.createElement('div');
      row.className = 'tj-settle-row';
      var v = Math.round(balance[p]);
      row.innerHTML = '<span></span><span></span>';
      row.children[0].textContent = p;
      row.children[1].textContent = (v >= 0 ? '+¥' + v.toLocaleString() : '-¥' + Math.abs(v).toLocaleString());
      row.children[1].className = v >= 0 ? 'tj-settle-plus' : 'tj-settle-minus';
      wrap.appendChild(row);
    });
  }

  // ---------- MEDIA ----------
  function watchMedia() {
    var q = query(collection(db, 'trips', TRIP_ID, 'media'), orderBy('uploadedAt', 'desc'));
    unsubMedia = onSnapshot(q, function (snap) {
      var grid = document.getElementById('tjMediaGrid');
      grid.innerHTML = '';
      if (snap.empty) { grid.innerHTML = '<div class="tj-empty">まだ写真・動画がありません</div>'; return; }
      snap.forEach(function (docSnap) {
        var d = docSnap.data();
        var cell = document.createElement('div');
        cell.className = 'tj-media-cell';
        var media = document.createElement(d.type === 'video' ? 'video' : 'img');
        media.src = d.url;
        if (d.type === 'video') { media.muted = true; media.playsInline = true; media.loop = true; media.addEventListener('mouseenter', function () { media.play(); }); }
        cell.appendChild(media);
        var badge = document.createElement('span');
        badge.className = 'tj-media-badge';
        badge.textContent = d.postedBy || '';
        cell.appendChild(badge);
        if (d.noFace) {
          var ok = document.createElement('span');
          ok.className = 'tj-media-ok';
          ok.textContent = '✓';
          ok.title = 'サイト使用可';
          cell.appendChild(ok);
        }
        grid.appendChild(cell);
      });
    });
  }

  function getVideoDuration(file) {
    return new Promise(function (resolve, reject) {
      var video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = function () { reject(new Error('動画を読み込めませんでした')); };
      video.src = URL.createObjectURL(file);
    });
  }

  document.getElementById('tjMediaFile').addEventListener('change', function () {
    var file = this.files[0];
    var errEl = document.getElementById('tjMediaError');
    errEl.textContent = '';
    if (!file) return;
    var isVideo = file.type.indexOf('video') === 0;
    var proceed = function () {
      var postedBy = document.getElementById('tjAsSelect').value;
      var ext = file.name.split('.').pop();
      var path = 'trips/' + TRIP_ID + '/media/day' + selectedDayIndex + '_' + postedBy + '_' + Date.now() + '.' + ext;
      var sref = ref(storage, path);
      uploadBytes(sref, file).then(function () {
        return getDownloadURL(sref);
      }).then(function (url) {
        return addDoc(collection(db, 'trips', TRIP_ID, 'media'), {
          type: isVideo ? 'video' : 'photo', url: url, storagePath: path,
          dayIndex: selectedDayIndex, postedBy: postedBy, noFace: false, uploadedAt: serverTimestamp()
        });
      }).then(function () {
        document.getElementById('tjMediaFile').value = '';
      }).catch(function (e) {
        errEl.textContent = 'アップロードに失敗しました: ' + e.message;
      });
    };
    if (isVideo) {
      if (file.size > 30 * 1024 * 1024) {
        errEl.textContent = '動画のファイルサイズが大きすぎます。';
        return;
      }
      getVideoDuration(file).then(function (duration) {
        if (duration > 3.5) {
          errEl.textContent = '動画は3秒以内のみアップロードできます（この動画は' + duration.toFixed(1) + '秒です）。';
          this.value = '';
        } else {
          proceed();
        }
      }.bind(this)).catch(function (e) {
        errEl.textContent = e.message;
      });
    } else {
      if (file.size > 15 * 1024 * 1024) {
        errEl.textContent = '写真のファイルサイズが大きすぎます。';
        return;
      }
      proceed();
    }
  });
</script>
