---
layout: page
title: サイコロで行き先を決める
permalink: /dice/
---

<p class="dice-intro">どこへ行くか決められない時は、20面体のサイコロに任せてみませんか。このサイトで紹介している全20の行き先からランダムに1つを選びます。</p>

<div id="dice-stage">
  <canvas id="dice-canvas"></canvas>
</div>

<div id="dice-controls">
  <button type="button" id="dice-roll-btn" class="dice-roll-btn">サイコロを振る</button>
</div>

<div id="dice-result" class="dice-result" hidden>
  <img id="dice-result-photo" class="dice-result-photo" alt="">
  <div class="dice-result-body">
    <div class="dice-result-label">今回の行き先は…</div>
    <div id="dice-result-name" class="dice-result-name"></div>
    <a id="dice-result-link" class="dice-result-link" href="#">記事を見る ▶</a>
  </div>
</div>

<style>
  .dice-intro {
    color: var(--sb-brown-soft);
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  #dice-stage {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1 / 1;
    margin: 0 auto 1.25rem;
    touch-action: none;
  }
  #dice-canvas { width: 100%; height: 100%; display: block; }
  #dice-controls { text-align: center; margin-bottom: 1.5rem; }
  .dice-roll-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: var(--sb-green);
    color: #fff;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    padding: 0.7rem 1.8rem;
  }
  .dice-roll-btn:hover { background: var(--sb-green-dark); }
  .dice-roll-btn:disabled { opacity: 0.55; cursor: default; }
  .dice-result {
    display: flex;
    gap: 1rem;
    align-items: center;
    background: var(--sb-cream);
    border: 1px solid var(--sb-border);
    border-radius: 10px;
    padding: 1rem;
    max-width: 420px;
    margin: 0 auto;
  }
  .dice-result-photo {
    width: 88px;
    height: 88px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .dice-result-label { font-size: 0.78rem; color: var(--sb-brown-soft); }
  .dice-result-name {
    font-family: "Noto Serif JP", serif;
    font-weight: 700;
    font-size: 1.15rem;
    color: var(--sb-green-dark);
    margin: 0.2rem 0 0.5rem;
  }
  .dice-result-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: transparent;
    color: var(--sb-green-dark);
    border: 1px solid var(--sb-border);
    border-radius: 999px;
    padding: 0.22rem 0.75rem;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
  }
  .dice-result-link:hover { background: #fff; border-color: var(--sb-green); }
  @media screen and (max-width: 480px) {
    .dice-result { flex-direction: column; text-align: center; }
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu" crossorigin="anonymous"></script>
<script>
(function () {
  var destinations = {{ site.data.destinations | jsonify }};
  var stage = document.getElementById('dice-stage');
  var canvas = document.getElementById('dice-canvas');
  var btn = document.getElementById('dice-roll-btn');
  var resultBox = document.getElementById('dice-result');
  var resultPhoto = document.getElementById('dice-result-photo');
  var resultName = document.getElementById('dice-result-name');
  var resultLink = document.getElementById('dice-result-link');

  if (!destinations || !destinations.length || typeof THREE === 'undefined') {
    if (stage) stage.hidden = true;
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  function resize() {
    var size = stage.clientWidth;
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);
  var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.35);
  dirLight2.position.set(-4, -2, -3);
  scene.add(dirLight2);

  var geometry = new THREE.IcosahedronGeometry(1.3, 0);
  var material = new THREE.MeshStandardMaterial({ color: 0x3e7d5c, flatShading: true, roughness: 0.55, metalness: 0.05 });
  var dice = new THREE.Mesh(geometry, material);
  scene.add(dice);

  var edges = new THREE.EdgesGeometry(geometry);
  var edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf4efe4, linewidth: 1 }));
  dice.add(edgeLines);

  resize();
  window.addEventListener('resize', resize);

  var rolling = false;
  var velocity = { x: 0, y: 0, z: 0 };
  var rafId = null;

  function render() {
    renderer.render(scene, camera);
  }

  function tick() {
    if (rolling) {
      dice.rotation.x += velocity.x;
      dice.rotation.y += velocity.y;
      dice.rotation.z += velocity.z;
      velocity.x *= 0.965;
      velocity.y *= 0.965;
      velocity.z *= 0.965;
      if (Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z) < 0.01) {
        rolling = false;
        onRollEnd();
      }
    } else {
      dice.rotation.y += 0.003;
    }
    render();
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function showResult() {
    var pick = destinations[Math.floor(Math.random() * destinations.length)];
    resultPhoto.src = pick.photo;
    resultPhoto.alt = pick.name;
    resultName.textContent = pick.name;
    resultLink.href = pick.url;
    resultBox.hidden = false;
  }

  function onRollEnd() {
    btn.disabled = false;
    btn.textContent = 'もう一度振る';
    showResult();
  }

  btn.addEventListener('click', function () {
    if (rolling) return;
    btn.disabled = true;
    resultBox.hidden = true;
    if (reduceMotion) {
      showResult();
      btn.disabled = false;
      btn.textContent = 'もう一度振る';
      return;
    }
    rolling = true;
    velocity.x = 0.25 + Math.random() * 0.25;
    velocity.y = 0.3 + Math.random() * 0.3;
    velocity.z = 0.15 + Math.random() * 0.2;
  });
})();
</script>
