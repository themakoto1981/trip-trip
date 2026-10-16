---
layout: page
title: 旅の記録
permalink: /trips/j8k2m9x4qz/
sitemap: false
robots: noindex
---

<style>
  .site-header, .page-heading, .site-footer, #back-to-top, h1 { display: none !important; }
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
  .tj-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem; }
  .tj-title { font-size: 1.2rem; font-weight: 700; color: var(--sb-green-dark); line-height: 1.3; }
  .tj-subtitle { font-size: 0.78rem; color: var(--sb-brown-soft); line-height: 1.3; }
  .tj-as { font-size: 0.82rem; color: var(--sb-brown-soft); display: flex; align-items: center; gap: 0.4rem; }
  .tj-as select { border: 1px solid var(--sb-border); border-radius: 6px; padding: 0.25rem 0.5rem; font-family: inherit; }

  /* 2-col layout */
  .tj-grid { display: flex; gap: 0.5rem; align-items: flex-start; }
  .tj-col { min-width: 0; }
  .tj-col:first-child { flex: 1.6; }
  .tj-col:last-child { flex: 1; }

  .tj-day-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; padding-bottom: 0.45rem; border-bottom: 1px solid var(--sb-border); }
  .tj-day-num { font-size: 1.15rem; font-weight: 700; color: var(--sb-green-dark); }
  .tj-day-date { font-size: 0.78rem; color: var(--sb-brown-soft); }
  .tj-hotel-row-display { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .tj-hotel-name { font-size: 0.82rem; color: var(--sb-brown); }
  .tj-hotel-name a { color: var(--sb-green-dark); font-weight: 700; text-decoration: underline; }
  .tj-edit-link { border: none; background: none; font-size: 0.9rem; cursor: pointer; flex-shrink: 0; line-height: 1; padding: 0; }
  .tj-hotel-edit-form { display: flex; flex-direction: column; gap: 0.5rem; }
  .tj-hotel-edit-form input { padding: 0.5rem 0.6rem; border: 1px solid var(--sb-border); border-radius: 8px; font-family: inherit; font-size: 0.85rem; }

  .tj-hour-row { display: flex; gap: 0.5rem; padding: 0.3rem 0; border-top: 1px dotted var(--sb-border); font-size: 0.78rem; min-height: 1.2rem; align-items: baseline; }
  .tj-hour-row:first-child { border-top: none; }
  .tj-hour-time { font-weight: 700; color: var(--sb-brown-soft); width: 2.8rem; flex-shrink: 0; }
  .tj-hour-entry { display: flex; align-items: baseline; gap: 0.35rem; flex: 1; min-width: 0; }
  .tj-hour-entry button { border: none; background: none; color: var(--sb-brown-soft); font-size: 0.72rem; margin-left: auto; flex-shrink: 0; }

  .tj-cal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
  .tj-cal-head button { border: none; background: none; color: var(--sb-brown-soft); font-size: 0.9rem; cursor: pointer; font-family: inherit; }
  .tj-cal-month { font-weight: 700; color: var(--sb-green-dark); font-size: 0.78rem; white-space: nowrap; }
  .tj-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; text-align: center; font-size: 0.62rem; }
  .tj-cal-dow { color: var(--sb-brown-soft); font-weight: 700; padding-bottom: 0.1rem; }
  .tj-cal-day { padding: 0.16rem 0; border-radius: 6px; color: var(--sb-brown); cursor: default; }
  .tj-cal-day.tj-cal-blank { visibility: hidden; }
  .tj-cal-day.tj-cal-trip { background: var(--sb-cream); font-weight: 700; color: var(--sb-green-dark); cursor: pointer; }
  .tj-cal-day.tj-cal-sel { background: var(--sb-green); color: #fff; cursor: pointer; }

  .tj-mini-check { display: flex; align-items: center; gap: 0.4rem; padding: 0.22rem 0; font-size: 0.78rem; border-top: 1px solid var(--sb-border); }
  .tj-mini-check:first-child { border-top: none; }
  .tj-mini-check input[type=checkbox] { width: 15px; height: 15px; accent-color: var(--sb-green); flex-shrink: 0; }
  .tj-mini-check span { flex: 1; min-width: 0; }
  .tj-mini-check.tj-done span { text-decoration: line-through; color: var(--sb-brown-soft); }
  .tj-mini-check-by { font-size: 0.66rem; color: var(--sb-brown-soft); flex-shrink: 0; }

  .tj-mini-check-del { border: none; background: none; color: var(--sb-brown-soft); font-size: 0.7rem; flex-shrink: 0; }
  .tj-check-add-row { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
  .tj-check-add-row input { flex: 1; padding: 0.45rem 0.6rem; border: 1px solid var(--sb-border); border-radius: 8px; font-family: inherit; font-size: 0.8rem; min-width: 0; }

  .tj-card { background: var(--sb-card); border: 1px solid var(--sb-border); border-radius: 12px; padding: 0.7rem; margin-bottom: 0.6rem; }
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
  .tj-time-label { font-size: 0.68rem; color: var(--sb-brown-soft); margin-bottom: 0.15rem; }

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
  .tj-media-breakout { position: relative; width: 100vw; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; margin-bottom: 0.6rem; }
  .tj-media-breakout-top { margin-top: -14px; margin-bottom: 0; }
  .tj-media-add-fab {
    position: absolute; top: 0.6rem; right: 0.6rem; z-index: 2; width: 2.1rem; height: 2.1rem; border-radius: 50%;
    border: none; background: rgba(255,255,255,0.85); color: var(--sb-brown); font-size: 1.1rem;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
  }
  .tj-media-grid .tj-empty { padding: 1rem; }
  .tj-media-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .tj-media-cell { position: relative; flex: 0 0 100%; scroll-snap-align: start; aspect-ratio: 2 / 1; overflow: hidden; }
  .tj-media-cell img, .tj-media-cell video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .tj-media-badge {
    position: absolute; bottom: 0.5rem; left: 0.5rem; background: rgba(17,32,27,0.65); color: #fff;
    font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 999px;
  }
  .tj-media-count {
    position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(17,32,27,0.65); color: #fff;
    font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 999px;
  }
  .tj-media-ok {
    position: absolute; top: 0.5rem; right: 0.5rem; width: 1.1rem; height: 1.1rem; border-radius: 50%;
    background: var(--sb-green); color: #fff; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
  }
  .tj-media-del {
    position: absolute; bottom: 0.5rem; right: 0.5rem; width: 1.7rem; height: 1.7rem; border-radius: 50%;
    border: none; background: rgba(17,32,27,0.65); color: #fff; font-size: 1.05rem; line-height: 1;
    display: flex; align-items: center; justify-content: center; cursor: pointer;
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
    <!-- MEDIA GALLERY (always visible, full-bleed slide, acts as page header) -->
    <div class="tj-media-breakout tj-media-breakout-top">
      <button type="button" class="tj-media-add-fab" id="tjMediaAddToggle">＋</button>
      <div class="tj-media-grid" id="tjMediaGrid"></div>
    </div>

    <div class="tj-header">
      <div>
        <div class="tj-title" id="tjTripName"></div>
        <div class="tj-subtitle" id="tjTripDates"></div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;">
        <div class="tj-as">
          投稿者：
          <select id="tjAsSelect"></select>
        </div>
      </div>
    </div>

    <div class="tj-grid">
      <div class="tj-col" id="tjScheduleCol">
        <div class="tj-card" id="tjDayHeadCard">
          <div class="tj-day-head">
            <span class="tj-day-num" id="tjDayNum"></span>
            <span class="tj-day-date" id="tjDayDate"></span>
          </div>
          <div class="tj-hotel-row-display" id="tjHotelDisplay">
            <div class="tj-hotel-name" id="tjHotelName"></div>
            <button type="button" class="tj-plus-link" id="tjHotelEditToggle">＋</button>
          </div>
          <div class="tj-hotel-edit-form tj-hidden" id="tjHotelEditForm">
            <input type="text" id="tjHotelNameInput" placeholder="ホテル名">
            <input type="text" id="tjHotelUrlInput" placeholder="予約サイトのURL（任意）">
            <button type="button" class="tj-btn secondary" id="tjHotelSave" style="align-self:flex-start;">保存</button>
          </div>
        </div>

        <div class="tj-card" id="tjHourCard">
          <div class="tj-card-title-row">
            <div class="tj-card-title">予定</div>
            <button type="button" class="tj-plus-link" id="tjItemAddToggle">＋</button>
          </div>
          <div id="tjHourList"></div>
          <div class="tj-add-form tj-hidden" id="tjItemAddForm">
            <div class="tj-row">
              <select id="tjItemType">
                <option value="flight">✈️ フライト</option>
                <option value="train">🚆 電車</option>
                <option value="car">🚗 レンタカー</option>
                <option value="bus">🚌 バス</option>
                <option value="other">📍 その他</option>
              </select>
            </div>
            <div class="tj-row">
              <div>
                <div class="tj-time-label">開始</div>
                <input id="tjItemTime" type="time">
              </div>
              <div>
                <div class="tj-time-label">終了（任意）</div>
                <input id="tjItemEndTime" type="time">
              </div>
            </div>
            <label class="tj-check-row">
              <input type="checkbox" id="tjItemEndNextDay"> 終了は翌日（夜便泊など）
            </label>
            <input id="tjItemTitle" type="text" placeholder="例：羽田発 ANA123便">
            <input id="tjItemDetail" type="text" placeholder="補足（任意）">
            <button class="tj-btn secondary" id="tjItemAdd">追加</button>
          </div>
        </div>
      </div>

      <div class="tj-col">
        <div class="tj-card">
          <div class="tj-cal-head">
            <button type="button" id="tjCalPrev">‹</button>
            <div class="tj-cal-month" id="tjCalMonth"></div>
            <button type="button" id="tjCalNext">›</button>
          </div>
          <div class="tj-cal-grid" id="tjCalGrid"></div>
        </div>

        <div class="tj-card">
          <div class="tj-card-title-row">
            <div class="tj-card-title">やりたいこと</div>
            <button type="button" class="tj-plus-link" id="tjChecklistAddToggle">＋</button>
          </div>
          <div id="tjChecklist"></div>
          <div class="tj-check-add-row tj-hidden" id="tjChecklistAddRow">
            <input type="text" id="tjChecklistInput" placeholder="やりたいことを追加">
            <button type="button" class="tj-btn secondary" id="tjChecklistAdd">追加</button>
          </div>
        </div>

        <div class="tj-card">
          <a href="/trips/j8k2m9x4qz/spots/" style="display:flex;align-items:center;justify-content:space-between;color:var(--sb-brown);text-decoration:none;">
            <span class="tj-card-title" style="margin-bottom:0;">行きたい場所</span>
            <span style="color:var(--sb-brown-soft);">›</span>
          </a>
        </div>

        <div class="tj-card">
          <div class="tj-card-title-row">
            <div class="tj-card-title">コスト</div>
            <button type="button" class="tj-plus-link" id="tjCostAddToggle">＋</button>
          </div>
          <div id="tjCostList"></div>
        </div>
      </div>
    </div>

    <!-- COST management (hidden by default, opened via +追加) -->
    <div class="tj-card tj-hidden" id="tjCostManageCard">
      <div class="tj-card-title-row">
        <div class="tj-card-title">コストを追加</div>
        <button type="button" class="tj-plus-link" id="tjCostManageClose">✕</button>
      </div>
      <div class="tj-add-form" style="margin-top:0;border-top:none;padding-top:0;">
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
      <div class="tj-card-title" style="margin-top:0.9rem;">精算</div>
      <div id="tjSettleList"></div>
    </div>

    <!-- MEDIA UPLOAD (hidden, opened via +追加) -->
    <div class="tj-card tj-hidden" id="tjMediaSection">
      <div class="tj-card-title-row">
        <div class="tj-card-title">写真・動画をアップロード</div>
        <button type="button" class="tj-plus-link" id="tjMediaSectionClose">✕</button>
      </div>
      <div class="tj-upload-box">
        写真はそのまま、動画は<strong>3秒以内</strong>のみアップロードできます。
        <br>
        <div style="margin:0.6rem 0;">
          <div class="tj-time-label" style="display:inline;">何日目の写真？</div>
          <select id="tjMediaDay"></select>
        </div>
        <input id="tjMediaFile" type="file" accept="image/*,video/*">
      </div>
      <p id="tjMediaError" class="tj-error"></p>
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
    getStorage, ref, uploadBytes, getDownloadURL, deleteObject
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
  var unsubCosts = null;
  var unsubMedia = null;
  var unsubChecklist = null;
  var setupParticipants = [];
  var weekItemsByDay = {};
  var weekHotelByDay = {};
  var dayUnsubs = [];
  var selectedDayIndex = 1;
  var calViewYear = null;
  var calViewMonth = null;

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

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

    var n = dayCount();
    var todayDiff = Math.round((new Date(new Date().toDateString()) - new Date(tripData.startDate)) / 86400000) + 1;
    selectedDayIndex = (todayDiff >= 1 && todayDiff <= n) ? todayDiff : 1;

    var mediaDaySelect = document.getElementById('tjMediaDay');
    mediaDaySelect.innerHTML = '';
    for (var di = 1; di <= n; di++) {
      var opt = document.createElement('option');
      opt.value = di; opt.textContent = di + '日目 ' + dayDateLabel(di);
      mediaDaySelect.appendChild(opt);
    }
    mediaDaySelect.value = selectedDayIndex;

    var startD = new Date(tripData.startDate);
    calViewYear = startD.getFullYear();
    calViewMonth = startD.getMonth();

    setupDayListeners();
    watchChecklist();
    renderCalendar();
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

  function dayIndexForDate(y, m, dd) {
    var target = new Date(y, m, dd);
    var start = new Date(tripData.startDate);
    var start0 = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    var diff = Math.round((target - start0) / 86400000) + 1;
    return (diff >= 1 && diff <= dayCount()) ? diff : null;
  }

  // ---------- QUICK ADD MENU ----------
  function openItemAddForm() {
    var el = document.getElementById('tjItemAddForm');
    el.classList.toggle('tj-hidden');
    if (!el.classList.contains('tj-hidden')) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
  function openMediaSection() {
    var el = document.getElementById('tjMediaSection');
    el.classList.toggle('tj-hidden');
    if (el.classList.contains('tj-hidden')) { return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openCostManage() {
    var el = document.getElementById('tjCostManageCard');
    el.classList.toggle('tj-hidden');
    if (!el.classList.contains('tj-hidden')) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  document.getElementById('tjItemAddToggle').addEventListener('click', openItemAddForm);
  document.getElementById('tjCostAddToggle').addEventListener('click', openCostManage);
  document.getElementById('tjMediaAddToggle').addEventListener('click', openMediaSection);
  document.getElementById('tjCostManageClose').addEventListener('click', function () {
    document.getElementById('tjCostManageCard').classList.add('tj-hidden');
  });
  document.getElementById('tjMediaSectionClose').addEventListener('click', function () {
    document.getElementById('tjMediaSection').classList.add('tj-hidden');
  });

  var typeIcons = { flight: '✈️', train: '🚆', car: '🚗', bus: '🚌', other: '📍' };

  function timeToMinutes(t) {
    if (!t) return null;
    var parts = t.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  // ---------- SCHEDULE: per-day Firestore listeners ----------
  function setupDayListeners() {
    dayUnsubs.forEach(function (u) { u(); });
    dayUnsubs = [];
    weekItemsByDay = {};
    weekHotelByDay = {};
    var n = dayCount();
    for (var i = 1; i <= n; i++) {
      (function (idx) {
        var qItems = query(collection(db, 'trips', TRIP_ID, 'days', String(idx), 'items'), orderBy('time'));
        var unsub1 = onSnapshot(qItems, function (snap) {
          var arr = [];
          snap.forEach(function (docSnap) {
            var row = { id: docSnap.id };
            var data = docSnap.data();
            for (var k in data) { row[k] = data[k]; }
            arr.push(row);
          });
          weekItemsByDay[idx] = arr;
          if (idx === selectedDayIndex || idx === selectedDayIndex - 1) { renderHourList(); }
        });
        var unsub2 = onSnapshot(doc(db, 'trips', TRIP_ID, 'days', String(idx)), function (snap) {
          var data = snap.exists() ? snap.data() : {};
          weekHotelByDay[idx] = { hotel: data.hotel || '', hotelUrl: data.hotelUrl || '' };
          if (idx === selectedDayIndex) { renderDayHead(); }
        });
        dayUnsubs.push(unsub1, unsub2);
      })(i);
    }
  }

  function selectDay(idx) {
    var n = dayCount();
    if (idx < 1 || idx > n) { return; }
    selectedDayIndex = idx;
    document.getElementById('tjHotelEditForm').classList.add('tj-hidden');
    document.getElementById('tjItemAddForm').classList.add('tj-hidden');
    renderDayHead();
    renderHourList();
    renderCalendar();
  }

  // ---------- SCHEDULE: swipe left/right to change day ----------
  (function () {
    var startX = null, startY = null;
    var col = document.getElementById('tjScheduleCol');
    col.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    col.addEventListener('touchend', function (e) {
      if (startX === null) { return; }
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) { selectDay(selectedDayIndex + 1); } else { selectDay(selectedDayIndex - 1); }
      }
    }, { passive: true });
  })();

  // ---------- SCHEDULE: day head (num/date/hotel) ----------
  function renderDayHead() {
    document.getElementById('tjDayNum').textContent = selectedDayIndex + '日目';
    document.getElementById('tjDayDate').textContent = dayDateLabel(selectedDayIndex);
    var hotelInfo = weekHotelByDay[selectedDayIndex] || {};
    var hotelName = hotelInfo.hotel || '';
    var hotelUrl = hotelInfo.hotelUrl || '';
    var nameEl = document.getElementById('tjHotelName');
    if (hotelName) {
      nameEl.innerHTML = (hotelUrl
        ? ('<a href="' + escapeHtml(hotelUrl) + '" target="_blank" rel="noopener">' + escapeHtml(hotelName) + ' ↗</a>')
        : escapeHtml(hotelName));
    } else {
      nameEl.innerHTML = '<span class="tj-empty" style="padding:0;">宿泊先未設定</span>';
    }
    document.getElementById('tjHotelNameInput').value = hotelName;
    document.getElementById('tjHotelUrlInput').value = hotelUrl;
  }

  document.getElementById('tjHotelEditToggle').addEventListener('click', function () {
    document.getElementById('tjHotelEditForm').classList.toggle('tj-hidden');
  });
  document.getElementById('tjHotelSave').addEventListener('click', function () {
    var nameVal = document.getElementById('tjHotelNameInput').value.trim();
    var urlVal = document.getElementById('tjHotelUrlInput').value.trim();
    setDoc(doc(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex)), { hotel: nameVal, hotelUrl: urlVal, dayIndex: selectedDayIndex }, { merge: true }).then(function () {
      document.getElementById('tjHotelEditForm').classList.add('tj-hidden');
    });
  });

  // ---------- SCHEDULE: hourly list (09:00-21:00, extended for outlying items) ----------
  function renderHourList() {
    var wrap = document.getElementById('tjHourList');
    var items = weekItemsByDay[selectedDayIndex] || [];
    var prevItems = weekItemsByDay[selectedDayIndex - 1] || [];
    var carryOver = prevItems.filter(function (it) { return it.endNextDay && it.endTime; });
    var minHour = 9, maxHour = 21;
    items.forEach(function (it) {
      var m = timeToMinutes(it.time);
      if (m !== null) {
        var h = Math.floor(m / 60);
        if (h < minHour) { minHour = h; }
        if (h > maxHour) { maxHour = h; }
      }
    });
    carryOver.forEach(function (it) {
      var m = timeToMinutes(it.endTime);
      if (m !== null) {
        var h = Math.floor(m / 60);
        if (h < minHour) { minHour = h; }
        if (h > maxHour) { maxHour = h; }
      }
    });
    var byHour = {};
    items.forEach(function (it) {
      var m = timeToMinutes(it.time);
      if (m === null) { return; }
      var h = Math.floor(m / 60);
      if (!byHour[h]) { byHour[h] = []; }
      byHour[h].push({ item: it, carry: false });
    });
    carryOver.forEach(function (it) {
      var m = timeToMinutes(it.endTime);
      if (m === null) { return; }
      var h = Math.floor(m / 60);
      if (!byHour[h]) { byHour[h] = []; }
      byHour[h].unshift({ item: it, carry: true });
    });
    var html = '';
    for (var h = minHour; h <= maxHour; h++) {
      var hLabel = (h < 10 ? '0' + h : h) + ':00';
      html += '<div class="tj-hour-row"><div class="tj-hour-time">' + hLabel + '</div><div style="flex:1;min-width:0;">';
      (byHour[h] || []).forEach(function (entry) {
        var d = entry.item;
        var onTheHour = (d.time || '').endsWith(':00');
        var timeLabel = entry.carry
          ? ('前日' + d.time + '〜' + d.endTime + '着')
          : (d.endTime
              ? ((onTheHour ? '' : d.time) + '〜' + (d.endNextDay ? '翌' : '') + d.endTime)
              : (onTheHour ? '' : (d.time || '')));
        var delDay = entry.carry ? (selectedDayIndex - 1) : selectedDayIndex;
        html += '<div style="display:flex;align-items:baseline;gap:0.3rem;">';
        html += '<span>' + (typeIcons[d.type] || '📍') + ' ' + escapeHtml(d.title || '') + (d.detail ? '（' + escapeHtml(d.detail) + '）' : '') + (timeLabel ? '　' + escapeHtml(timeLabel) : '') + '</span>';
        html += '<button class="tj-item-del" data-item-del-id="' + d.id + '" data-item-del-day="' + delDay + '" style="margin-left:auto;flex-shrink:0;">×</button>';
        html += '</div>';
      });
      html += '</div></div>';
    }
    wrap.innerHTML = html;
  }

  document.getElementById('tjHourList').addEventListener('click', function (e) {
    var delId = e.target.getAttribute('data-item-del-id');
    var delDay = e.target.getAttribute('data-item-del-day') || selectedDayIndex;
    if (delId) { deleteDoc(doc(db, 'trips', TRIP_ID, 'days', String(delDay), 'items', delId)); }
  });

  document.getElementById('tjItemAdd').addEventListener('click', function () {
    var type = document.getElementById('tjItemType').value;
    var time = document.getElementById('tjItemTime').value;
    var endTime = document.getElementById('tjItemEndTime').value;
    var endNextDay = document.getElementById('tjItemEndNextDay').checked;
    var title = document.getElementById('tjItemTitle').value.trim();
    var detail = document.getElementById('tjItemDetail').value.trim();
    if (!title || !time) return;
    if (endTime && !endNextDay && timeToMinutes(endTime) <= timeToMinutes(time)) {
      alert('終了時刻は開始時刻より後にしてください（日をまたぐ場合は「終了は翌日」にチェック）');
      return;
    }
    if (endNextDay && !endTime) {
      alert('「終了は翌日」を選ぶ場合は終了時刻も入力してください');
      return;
    }
    addDoc(collection(db, 'trips', TRIP_ID, 'days', String(selectedDayIndex), 'items'), {
      type: type, time: time, endTime: endTime || null, endNextDay: !!(endTime && endNextDay), title: title, detail: detail,
      postedBy: document.getElementById('tjAsSelect').value, createdAt: serverTimestamp()
    }).then(function () {
      document.getElementById('tjItemTitle').value = '';
      document.getElementById('tjItemDetail').value = '';
      document.getElementById('tjItemTime').value = '';
      document.getElementById('tjItemEndTime').value = '';
      document.getElementById('tjItemEndNextDay').checked = false;
    });
  });

  // ---------- CALENDAR ----------
  function renderCalendar() {
    document.getElementById('tjCalMonth').textContent = calViewYear + '/' + (calViewMonth + 1);
    var firstDow = new Date(calViewYear, calViewMonth, 1).getDay();
    var daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
    var html = '<div class="tj-cal-dow">日</div><div class="tj-cal-dow">月</div><div class="tj-cal-dow">火</div><div class="tj-cal-dow">水</div><div class="tj-cal-dow">木</div><div class="tj-cal-dow">金</div><div class="tj-cal-dow">土</div>';
    for (var b = 0; b < firstDow; b++) { html += '<div class="tj-cal-day tj-cal-blank"></div>'; }
    for (var dd = 1; dd <= daysInMonth; dd++) {
      var idx = dayIndexForDate(calViewYear, calViewMonth, dd);
      var cls = 'tj-cal-day';
      if (idx === selectedDayIndex) { cls += ' tj-cal-sel'; }
      else if (idx !== null) { cls += ' tj-cal-trip'; }
      html += '<div class="' + cls + '"' + (idx !== null ? ' data-cal-day-idx="' + idx + '"' : '') + '>' + dd + '</div>';
    }
    document.getElementById('tjCalGrid').innerHTML = html;
  }
  document.getElementById('tjCalPrev').addEventListener('click', function () {
    calViewMonth--;
    if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
    renderCalendar();
  });
  document.getElementById('tjCalNext').addEventListener('click', function () {
    calViewMonth++;
    if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
    renderCalendar();
  });
  document.getElementById('tjCalGrid').addEventListener('click', function (e) {
    var idx = e.target.getAttribute('data-cal-day-idx');
    if (idx) { selectDay(parseInt(idx, 10)); }
  });

  // ---------- CHECKLIST (やりたいこと) ----------
  document.getElementById('tjChecklistAddToggle').addEventListener('click', function () {
    document.getElementById('tjChecklistAddRow').classList.toggle('tj-hidden');
  });
  function watchChecklist() {
    var q = query(collection(db, 'trips', TRIP_ID, 'checklist'), orderBy('createdAt', 'asc'));
    unsubChecklist = onSnapshot(q, function (snap) {
      var wrap = document.getElementById('tjChecklist');
      if (snap.empty) { wrap.innerHTML = '<div class="tj-empty">まだありません</div>'; return; }
      var html = '';
      snap.forEach(function (docSnap) {
        var d = docSnap.data();
        html += '<div class="tj-mini-check' + (d.done ? ' done' : '') + '">';
        html += '<input type="checkbox" data-check-id="' + docSnap.id + '"' + (d.done ? ' checked' : '') + '>';
        html += '<span>' + escapeHtml(d.text || '') + '</span>';
        html += '<button class="tj-item-del" data-check-del="' + docSnap.id + '">×</button>';
        html += '</div>';
      });
      wrap.innerHTML = html;
    });
  }
  document.getElementById('tjChecklist').addEventListener('click', function (e) {
    var delId = e.target.getAttribute('data-check-del');
    if (delId) { deleteDoc(doc(db, 'trips', TRIP_ID, 'checklist', delId)); return; }
  });
  document.getElementById('tjChecklist').addEventListener('change', function (e) {
    var checkId = e.target.getAttribute('data-check-id');
    if (checkId) { setDoc(doc(db, 'trips', TRIP_ID, 'checklist', checkId), { done: e.target.checked }, { merge: true }); }
  });
  document.getElementById('tjChecklistAdd').addEventListener('click', function () {
    var input = document.getElementById('tjChecklistInput');
    var text = input.value.trim();
    if (!text) return;
    addDoc(collection(db, 'trips', TRIP_ID, 'checklist'), {
      text: text, done: false, postedBy: document.getElementById('tjAsSelect').value, createdAt: serverTimestamp()
    }).then(function () { input.value = ''; });
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
  var mediaAutoTimer = null;
  var mediaAutoPausedUntil = 0;
  function startMediaAutoSlide(grid, count) {
    if (mediaAutoTimer) { clearInterval(mediaAutoTimer); mediaAutoTimer = null; }
    if (count <= 1) return;
    mediaAutoTimer = setInterval(function () {
      if (Date.now() < mediaAutoPausedUntil) return;
      var slideWidth = grid.clientWidth;
      var maxScroll = slideWidth * (count - 1);
      var next = grid.scrollLeft + slideWidth;
      if (next > maxScroll + 5) { next = 0; }
      grid.scrollTo({ left: next, behavior: 'smooth' });
    }, 4000);
  }

  function watchMedia() {
    var grid = document.getElementById('tjMediaGrid');
    grid.addEventListener('touchstart', function () { mediaAutoPausedUntil = Date.now() + 6000; }, { passive: true });
    var q = query(collection(db, 'trips', TRIP_ID, 'media'), orderBy('uploadedAt', 'desc'));
    unsubMedia = onSnapshot(q, function (snap) {
      grid.innerHTML = '';
      if (snap.empty) {
        grid.innerHTML = '<div class="tj-empty">まだ写真・動画がありません</div>';
        if (mediaAutoTimer) { clearInterval(mediaAutoTimer); mediaAutoTimer = null; }
        return;
      }
      var total = snap.size;
      var i = 0;
      snap.forEach(function (docSnap) {
        i++;
        var d = docSnap.data();
        var cell = document.createElement('div');
        cell.className = 'tj-media-cell';
        var media = document.createElement(d.type === 'video' ? 'video' : 'img');
        media.src = d.url;
        if (d.type === 'video') { media.muted = true; media.playsInline = true; media.loop = true; media.addEventListener('mouseenter', function () { media.play(); }); }
        cell.appendChild(media);
        if (total > 1) {
          var count = document.createElement('span');
          count.className = 'tj-media-count';
          count.textContent = i + ' / ' + total;
          cell.appendChild(count);
        }
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
        var del = document.createElement('button');
        del.type = 'button';
        del.className = 'tj-media-del';
        del.textContent = '×';
        del.title = '削除';
        del.addEventListener('click', function () {
          if (!window.confirm('この写真・動画を削除しますか？')) return;
          var tasks = [deleteDoc(doc(db, 'trips', TRIP_ID, 'media', docSnap.id))];
          if (d.storagePath) { tasks.push(deleteObject(ref(storage, d.storagePath)).catch(function () {})); }
          Promise.all(tasks).catch(function (e) { alert('削除に失敗しました: ' + e.message); });
        });
        cell.appendChild(del);
        grid.appendChild(cell);
      });
      startMediaAutoSlide(grid, total);
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

  function resizeImage(file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, maxDim / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var canvas = document.createElement('canvas');
        canvas.width = cw; canvas.height = ch;
        canvas.getContext('2d').drawImage(img, 0, 0, cw, ch);
        URL.revokeObjectURL(img.src);
        canvas.toBlob(function (blob) {
          if (!blob) { reject(new Error('画像の変換に失敗しました')); return; }
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      img.onerror = function () { URL.revokeObjectURL(img.src); reject(new Error('画像を読み込めませんでした')); };
      img.src = URL.createObjectURL(file);
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
      var mediaDayIndex = parseInt(document.getElementById('tjMediaDay').value, 10) || 1;
      var ext = isVideo ? file.name.split('.').pop() : 'jpg';
      var path = 'trips/' + TRIP_ID + '/media/day' + mediaDayIndex + '_' + postedBy + '_' + Date.now() + '.' + ext;
      var sref = ref(storage, path);
      var tokenRefresh = auth.currentUser ? auth.currentUser.getIdToken(true) : Promise.resolve();
      var prep = isVideo ? Promise.resolve(file) : resizeImage(file, 1600, 0.82);
      Promise.all([tokenRefresh, prep]).then(function (results) {
        return uploadBytes(sref, results[1]);
      }).then(function () {
        return getDownloadURL(sref);
      }).then(function (url) {
        return addDoc(collection(db, 'trips', TRIP_ID, 'media'), {
          type: isVideo ? 'video' : 'photo', url: url, storagePath: path,
          dayIndex: mediaDayIndex, postedBy: postedBy, noFace: false, uploadedAt: serverTimestamp()
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
