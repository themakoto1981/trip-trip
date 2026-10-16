---
layout: page
title: 行きたい場所
permalink: /trips/j8k2m9x4qz/spots/
sitemap: false
robots: noindex
---

<style>
  .site-header, .page-heading, .site-footer, #back-to-top, h1 { display: none !important; }
  .tj-hidden { display: none !important; }
  .tj-wrap { max-width: 720px; margin: 0 auto; }

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
  .tj-error { color: #B3432D; font-size: 0.85rem; }

  .tj-spots-header { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 0.7rem; }
  .tj-back-link { font-size: 0.8rem; color: var(--sb-brown-soft); text-decoration: none; }
  .tj-title { font-size: 1.2rem; font-weight: 700; color: var(--sb-green-dark); line-height: 1.3; }

  .tj-card { background: var(--sb-card); border: 1px solid var(--sb-border); border-radius: 12px; padding: 0.7rem; margin-bottom: 0.6rem; }
  .tj-item-del { border: none; background: none; cursor: pointer; color: var(--sb-brown-soft); font-size: 0.85rem; }
  .tj-empty { color: var(--sb-brown-soft); font-size: 0.85rem; padding: 1rem 0; }

  #tjSpotSearchBox { margin-bottom: 0.5rem; }
  #tjSpotSearchBox gmp-place-autocomplete { width: 100%; }
  #tjSpotMap { width: 100%; height: 320px; border-radius: 10px; overflow: hidden; margin-bottom: 0.5rem; background: var(--sb-cream); }
  .tj-spot-item { position: relative; padding: 0.5rem 1.8rem 0.5rem 0; border-top: 1px solid var(--sb-border); }
  .tj-spot-item:first-child { border-top: none; }
  .tj-spot-name a { font-size: 0.85rem; font-weight: 700; color: var(--sb-green-dark); text-decoration: none; }
  .tj-spot-addr { font-size: 0.72rem; color: var(--sb-brown-soft); margin-top: 0.1rem; }
  .tj-spot-item .tj-item-del { position: absolute; top: 0.4rem; right: 0; }
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

  <!-- SPOTS APP -->
  <div id="tjApp" class="tj-hidden">
    <div class="tj-spots-header">
      <a class="tj-back-link" href="/trips/j8k2m9x4qz/">← 旅の記録に戻る</a>
      <div class="tj-title">行きたい場所</div>
    </div>

    <div class="tj-card">
      <div id="tjSpotSearchBox"></div>
      <div id="tjSpotMap"></div>
      <div id="tjSpotList"></div>
    </div>
  </div>

</div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
  import {
    getAuth, signInWithEmailAndPassword, onAuthStateChanged
  } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
  import {
    getFirestore, collection, addDoc, deleteDoc, doc,
    onSnapshot, query, orderBy, serverTimestamp
  } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBmE10Y2CIEpfAbeEswCATqbA3qqL0ZhtQ",
    authDomain: "tripxtrip-3fc0e.firebaseapp.com",
    projectId: "tripxtrip-3fc0e",
    storageBucket: "tripxtrip-3fc0e.firebasestorage.app",
    messagingSenderId: "996558605198",
    appId: "1:996558605198:web:e51fb1615f2cedcb4ab2df"
  };

  const TRIP_ID = "j8k2m9x4qz";
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCQd0WmNOB9Xz5Km4xwmAxV3v8Y5pwHIuo';

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

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
      document.getElementById('tjApp').classList.remove('tj-hidden');
      initSpots();
    } else {
      document.getElementById('tjLogin').classList.remove('tj-hidden');
      document.getElementById('tjApp').classList.add('tj-hidden');
    }
  });

  // ---------- SPOTS (行きたい場所, Google Maps) ----------
  var spotMap = null;
  var spotMarkers = {};
  var spotsInited = false;
  var unsubSpots = null;

  function ensureMapsBootstrap() {
    if (window.google && window.google.maps && window.google.maps.importLibrary) { return; }
    (g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a); })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly'
    });
  }

  function mountSpotAutocomplete() {
    var box = document.getElementById('tjSpotSearchBox');
    box.innerHTML = '';
    var pae = new google.maps.places.PlaceAutocompleteElement();
    box.appendChild(pae);
    pae.addEventListener('gmp-select', function (ev) {
      var place = ev.placePrediction.toPlace();
      place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location', 'id'] }).then(function () {
        addDoc(collection(db, 'trips', TRIP_ID, 'spots'), {
          name: place.displayName || '',
          address: place.formattedAddress || '',
          lat: place.location.lat(),
          lng: place.location.lng(),
          placeId: place.id || '',
          createdAt: serverTimestamp()
        }).then(function () { mountSpotAutocomplete(); });
      });
    });
  }

  function watchSpots() {
    var q = query(collection(db, 'trips', TRIP_ID, 'spots'), orderBy('createdAt', 'desc'));
    unsubSpots = onSnapshot(q, function (snap) {
      Object.keys(spotMarkers).forEach(function (id) { spotMarkers[id].setMap(null); });
      spotMarkers = {};
      var listEl = document.getElementById('tjSpotList');
      if (snap.empty) {
        listEl.innerHTML = '<div class="tj-empty">まだありません</div>';
        return;
      }
      var bounds = new google.maps.LatLngBounds();
      var html = '';
      snap.forEach(function (docSnap) {
        var d = docSnap.data();
        var pos = { lat: d.lat, lng: d.lng };
        var marker = new google.maps.Marker({ position: pos, map: spotMap, title: d.name || '' });
        spotMarkers[docSnap.id] = marker;
        bounds.extend(pos);
        var mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.lat + ',' + d.lng) +
          (d.placeId ? '&query_place_id=' + encodeURIComponent(d.placeId) : '');
        html += '<div class="tj-spot-item">';
        html += '<div class="tj-spot-name"><a href="' + mapsUrl + '" target="_blank" rel="noopener">' + escapeHtml(d.name || '') + '</a></div>';
        html += '<div class="tj-spot-addr">' + escapeHtml(d.address || '') + '</div>';
        html += '<button class="tj-item-del" data-spot-del="' + docSnap.id + '">×</button>';
        html += '</div>';
      });
      listEl.innerHTML = html;
      if (!bounds.isEmpty()) { spotMap.fitBounds(bounds); }
    });
  }
  document.getElementById('tjSpotList').addEventListener('click', function (e) {
    var delId = e.target.getAttribute('data-spot-del');
    if (delId) { deleteDoc(doc(db, 'trips', TRIP_ID, 'spots', delId)); }
  });

  function initSpots() {
    if (spotsInited) return;
    spotsInited = true;
    ensureMapsBootstrap();
    Promise.all([
      google.maps.importLibrary('maps'),
      google.maps.importLibrary('places')
    ]).then(function (libs) {
      var MapsLib = libs[0];
      spotMap = new MapsLib.Map(document.getElementById('tjSpotMap'), {
        center: { lat: 35.681236, lng: 139.767125 }, zoom: 10
      });
      mountSpotAutocomplete();
      watchSpots();
    }).catch(function (e) {
      document.getElementById('tjSpotList').innerHTML = '<div class="tj-empty">' + escapeHtml(e.message) + '</div>';
    });
  }
</script>
