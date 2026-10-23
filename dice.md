---
layout: page
title: サイコロで行き先を決める
nav_title: サイコロで決める
permalink: /dice/
hide_header: true
---

<div id="dice-stage">
  <canvas id="dice-canvas"></canvas>
  <div id="dice-shadow"></div>
  <div id="dice-impact-flash"></div>
</div>

<div id="dice-controls">
  <button type="button" id="dice-roll-btn" class="dice-roll-btn">サイコロを振る</button>
</div>

<div id="dice-result-wrap" style="position: relative; max-width: 420px; margin: 0 auto;">
  <div id="dice-result" class="dice-result" hidden>
    <img id="dice-result-photo" class="dice-result-photo" alt="">
    <div class="dice-result-body">
      <div class="dice-result-label">次の行き先はここ</div>
      <div id="dice-result-name" class="dice-result-name"></div>
      <a id="dice-result-link" class="dice-result-link" href="#">記事を見る ▶</a>
    </div>
  </div>
  <div id="dice-confetti"></div>
</div>

<style>
  #dice-stage {
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1 / 1;
    margin: 0 auto 1.25rem;
    touch-action: none;
    position: relative;
    background: radial-gradient(circle at 50% 62%, rgba(62,125,92,0.16) 0%, rgba(62,125,92,0) 70%);
  }
  #dice-canvas { width: 100%; height: 100%; display: block; position: relative; z-index: 2; }
  #dice-shadow {
    position: absolute;
    left: 50%;
    bottom: 10%;
    width: 44%;
    height: 9%;
    background: radial-gradient(ellipse at center, rgba(40,60,45,0.38) 0%, rgba(40,60,45,0) 72%);
    transform: translateX(-50%) scale(1);
    pointer-events: none;
    z-index: 1;
  }
  #dice-stage.shake { animation: diceShake 0.22s ease-out; }
  @keyframes diceShake {
    0% { transform: translate(0, 0); }
    20% { transform: translate(-6px, 2px); }
    40% { transform: translate(5px, -3px); }
    60% { transform: translate(-4px, 1px); }
    80% { transform: translate(3px, -1px); }
    100% { transform: translate(0, 0); }
  }
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
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.85rem 2.4rem;
    box-shadow: 0 6px 18px rgba(62,125,92,0.4);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    animation: dicePulse 2s ease-in-out infinite;
  }
  .dice-roll-btn:hover { background: var(--sb-green-dark); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(62,125,92,0.5); }
  .dice-roll-btn:active { transform: translateY(1px) scale(0.97); }
  .dice-roll-btn:disabled { opacity: 0.55; cursor: default; animation: none; box-shadow: none; }
  @keyframes dicePulse {
    0%, 100% { box-shadow: 0 6px 18px rgba(62,125,92,0.4); }
    50% { box-shadow: 0 6px 26px rgba(62,125,92,0.75); }
  }
  .confetti-piece {
    position: absolute;
    width: 8px;
    height: 8px;
    top: 50%;
    left: 50%;
    pointer-events: none;
    opacity: 0;
    z-index: 5;
  }
  .confetti-piece.fly {
    animation: confettiFly 0.9s cubic-bezier(.17,.89,.32,1.49) forwards;
  }
  @keyframes confettiFly {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6) rotate(0deg); }
    100% { opacity: 0; transform: var(--confetti-end) scale(1) rotate(var(--confetti-spin)); }
  }
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
    opacity: 0;
    transform: scale(0.82) translateY(14px);
  }
  .dice-result.show {
    animation: diceResultPop 0.5s cubic-bezier(.22, 1, .36, 1) forwards;
  }
  @keyframes diceResultPop {
    0% { opacity: 0; transform: scale(0.7) translateY(22px); }
    55% { opacity: 1; transform: scale(1.08) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .dice-result.show .dice-result-name {
    display: inline-block;
    animation: diceNamePunch 0.55s cubic-bezier(.17,.89,.32,1.49) both;
  }
  @keyframes diceNamePunch {
    0% { transform: scale(2.6); opacity: 0; }
    55% { transform: scale(0.88); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  #dice-impact-flash {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 68%);
    opacity: 0;
    pointer-events: none;
    z-index: 3;
  }
  #dice-impact-flash.flash { animation: diceFlash 0.4s ease-out; }
  @keyframes diceFlash {
    0% { opacity: 0.95; }
    100% { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .dice-result.show { animation: none; opacity: 1; transform: none; }
    .dice-result.show .dice-result-name { animation: none; }
    #dice-impact-flash.flash { animation: none; }
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
  var diceShadow = document.getElementById('dice-shadow');
  var confettiContainer = document.getElementById('dice-confetti');
  var impactFlash = document.getElementById('dice-impact-flash');

  if (!destinations || !destinations.length || typeof THREE === 'undefined') {
    if (stage) stage.hidden = true;
    return;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  var cameraDefaultZ = 5.6;
  var cameraZoomZ = 2.65;
  camera.position.set(0, 0, cameraDefaultZ);

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
  var rimLight = new THREE.DirectionalLight(0xffd56a, 0.5);
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);

  var geometry = new THREE.IcosahedronGeometry(1.3, 0).toNonIndexed();
  var posAttr = geometry.attributes.position;
  var faceCount = posAttr.count / 3;

  var faceGroups = [];
  for (var g = 0; g < faceCount; g++) faceGroups.push([]);
  destinations.forEach(function (d, i) {
    faceGroups[i % faceCount].push(d);
  });

  var faceNormals = [];
  var faceUps = [];
  var uvs = new Float32Array(posAttr.count * 2);
  for (var f = 0; f < faceCount; f++) {
    var base = f * 3;
    uvs[(base + 0) * 2 + 0] = 0.5; uvs[(base + 0) * 2 + 1] = 1.0;
    uvs[(base + 1) * 2 + 0] = 0.0; uvs[(base + 1) * 2 + 1] = 0.0;
    uvs[(base + 2) * 2 + 0] = 1.0; uvs[(base + 2) * 2 + 1] = 0.0;
    geometry.addGroup(base, 3, f);

    var va = new THREE.Vector3().fromBufferAttribute(posAttr, base);
    var vb = new THREE.Vector3().fromBufferAttribute(posAttr, base + 1);
    var vc = new THREE.Vector3().fromBufferAttribute(posAttr, base + 2);
    var normal = new THREE.Vector3().subVectors(vb, va).cross(new THREE.Vector3().subVectors(vc, va)).normalize();
    faceNormals.push(normal);
    var baseMid = vb.clone().add(vc).multiplyScalar(0.5);
    var upLocal = va.clone().sub(baseMid).normalize();
    faceUps.push(upLocal);
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();

  function makeFaceTexture(names) {
    var canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    var ctx = canvas.getContext('2d');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    function wrapByChars(label, maxChars) {
      var line = '';
      var lines = [];
      for (var i = 0; i < label.length; i++) {
        line += label[i];
        if (line.length >= maxChars) { lines.push(line); line = ''; }
      }
      if (line) lines.push(line);
      return lines;
    }

    function buildFlatLines(maxChars) {
      var flat = [];
      names.forEach(function (d, idx) {
        if (idx > 0) flat.push('・');
        flat = flat.concat(wrapByChars(d.name, maxChars));
      });
      return flat;
    }

    var fontSize = names.length > 1 ? 24 : 30;
    var maxChars = names.length > 1 ? 5 : 6;
    var flatLines, lineHeight, startY;

    for (var attempt = 0; attempt < 7; attempt++) {
      ctx.font = 'bold ' + fontSize + 'px "Hiragino Sans", "Noto Sans JP", sans-serif';
      flatLines = buildFlatLines(maxChars);
      lineHeight = fontSize + 6;
      startY = 195 - (flatLines.length - 1) * lineHeight / 2;

      var fits = true;
      for (var i = 0; i < flatLines.length; i++) {
        var y = startY + i * lineHeight;
        var topEdge = y - fontSize / 2;
        var halfAvail = Math.max(14, topEdge / 2) * 0.82;
        var w = ctx.measureText(flatLines[i]).width;
        if (w / 2 > halfAvail) { fits = false; break; }
      }
      if (fits || fontSize <= 14) break;
      fontSize -= 2;
      if (maxChars > 4) maxChars -= 1;
    }

    var grad = ctx.createRadialGradient(128, 90, 20, 128, 160, 220);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#e3ddd0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#2a2420';
    ctx.font = 'bold ' + fontSize + 'px "Hiragino Sans", "Noto Sans JP", sans-serif';
    flatLines.forEach(function (line, i) {
      ctx.fillText(line, 128, startY + i * lineHeight);
    });

    return new THREE.CanvasTexture(canvas);
  }

  var materials = faceGroups.map(function (group) {
    return new THREE.MeshStandardMaterial({ map: makeFaceTexture(group), flatShading: true, roughness: 0.22, metalness: 0.06 });
  });

  var dice = new THREE.Mesh(geometry, materials);
  scene.add(dice);

  function faceAlignQuat(idx, baseQuat) {
    var normal = faceNormals[idx].clone().applyQuaternion(baseQuat).normalize();
    var targetCam = new THREE.Vector3(0, 0, 1);
    var rotQuat = new THREE.Quaternion().setFromUnitVectors(normal, targetCam);
    var result = baseQuat.clone().premultiply(rotQuat);

    var upAfterAlign = faceUps[idx].clone().applyQuaternion(result);
    upAfterAlign.z = 0;
    if (upAfterAlign.lengthSq() > 0.0001) {
      upAfterAlign.normalize();
      var twistQuat = new THREE.Quaternion().setFromUnitVectors(upAfterAlign, new THREE.Vector3(0, 1, 0));
      result.premultiply(twistQuat);
    }
    return result;
  }

  dice.quaternion.copy(faceAlignQuat(0, new THREE.Quaternion()));

  var edges = new THREE.EdgesGeometry(geometry);
  var edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xbdb5a3, linewidth: 1 }));
  dice.add(edgeLines);

  resize();
  window.addEventListener('resize', resize);

  var rolling = false;
  var bounceY = 0;
  var bounceVelY = 0;
  var posXVel = 0;
  var gravity = -0.013;
  var restitution = 0.5;
  var velocity = { x: 0, y: 0, z: 0 };
  var rafId = null;

  var settling = false;
  var settleStartTime = 0;
  var settleDuration = 480;
  var settleFromQuat = new THREE.Quaternion();
  var settleToQuat = new THREE.Quaternion();

  function render() {
    renderer.render(scene, camera);
  }

  var shakeTimeout = null;
  var autoNavTimeout = null;
  function triggerShake() {
    if (reduceMotion) return;
    stage.classList.remove('shake');
    void stage.offsetWidth;
    stage.classList.add('shake');
    clearTimeout(shakeTimeout);
    shakeTimeout = setTimeout(function () { stage.classList.remove('shake'); }, 260);
  }

  var confettiColors = ['#3e7d5c', '#ffd56a', '#f4efe4', '#e07a3f', '#2c6b4a'];
  function spawnConfetti() {
    if (reduceMotion) return;
    for (var i = 0; i < 18; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      var angle = Math.random() * Math.PI * 2;
      var dist = 70 + Math.random() * 90;
      var ex = Math.cos(angle) * dist;
      var ey = Math.sin(angle) * dist - 20;
      piece.style.setProperty('--confetti-end', 'translate(' + ex + 'px, ' + ey + 'px)');
      piece.style.setProperty('--confetti-spin', (Math.random() * 540 - 270) + 'deg');
      confettiContainer.appendChild(piece);
      void piece.offsetWidth;
      piece.classList.add('fly');
      (function (el) {
        setTimeout(function () { el.remove(); }, 1000);
      })(piece);
    }
  }

  var settleFromPosX = 0;

  function startSettleAnimation() {
    var idx = topFaceIndex();
    settleFromQuat.copy(dice.quaternion);
    settleToQuat.copy(faceAlignQuat(idx, dice.quaternion));
    settleFromPosX = dice.position.x;
    settling = true;
    settleStartTime = performance.now();
  }

  function tick() {
    if (settling) {
      var elapsed = performance.now() - settleStartTime;
      var t = Math.min(elapsed / settleDuration, 1);
      var te = 1 - Math.pow(1 - t, 3);
      dice.quaternion.slerpQuaternions(settleFromQuat, settleToQuat, te);
      dice.position.x = settleFromPosX * (1 - te);
      var punch = 1 + 0.22 * Math.sin(te * Math.PI);
      dice.scale.setScalar(punch);
      camera.position.z = cameraDefaultZ + (cameraZoomZ - cameraDefaultZ) * te;
      if (t >= 1) {
        settling = false;
        dice.scale.setScalar(1);
        onRollEnd();
      }
      render();
      rafId = requestAnimationFrame(tick);
      return;
    }
    if (rolling) {
      dice.rotation.x += velocity.x;
      dice.rotation.y += velocity.y;
      dice.rotation.z += velocity.z;
      velocity.x *= 0.978;
      velocity.y *= 0.978;
      velocity.z *= 0.978;

      posXVel *= 0.952;
      dice.position.x += posXVel;

      bounceVelY += gravity;
      bounceY += bounceVelY;
      if (bounceY <= 0) {
        bounceY = 0;
        var impactStrength = Math.abs(bounceVelY);
        bounceVelY = -bounceVelY * restitution;
        if (Math.abs(bounceVelY) < 0.01) bounceVelY = 0;
        if (impactStrength > 0.025) {
          triggerShake(impactStrength);
          var kick = impactStrength * (1.2 + Math.random() * 1.1);
          velocity.x += (Math.random() - 0.5) * kick;
          velocity.y += (Math.random() - 0.5) * kick;
          velocity.z += (Math.random() - 0.5) * kick;
          posXVel += (Math.random() - 0.5) * impactStrength * 0.7;
        }
      }
      dice.position.y = bounceY;

      var shadowT = Math.max(0, 1 - Math.min(bounceY / 2.2, 1));
      diceShadow.style.transform = 'translateX(-50%) scale(' + (0.55 + 0.45 * shadowT) + ')';
      diceShadow.style.opacity = (0.25 + 0.75 * shadowT).toFixed(2);

      var settled = Math.abs(velocity.x) + Math.abs(velocity.y) + Math.abs(velocity.z) < 0.01;
      var bounced = bounceY === 0 && bounceVelY === 0;
      if (settled && bounced) {
        rolling = false;
        startSettleAnimation();
      }
    }
    render();
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function topFaceIndex() {
    var best = 0;
    var bestDot = -Infinity;
    var worldNormal = new THREE.Vector3();
    for (var f = 0; f < faceNormals.length; f++) {
      worldNormal.copy(faceNormals[f]).applyQuaternion(dice.quaternion);
      var dot = worldNormal.z;
      if (dot > bestDot) { bestDot = dot; best = f; }
    }
    return best;
  }

  function showResult() {
    var group = faceGroups[topFaceIndex()];
    var pick = group[Math.floor(Math.random() * group.length)];
    resultPhoto.src = pick.photo;
    resultPhoto.alt = pick.name;
    resultName.textContent = pick.name;
    resultLink.href = pick.url;
    resultLink.textContent = 'この記事へ移動します ▶';
    resultBox.hidden = false;
    resultBox.classList.remove('show');
    void resultBox.offsetWidth;
    resultBox.classList.add('show');
    spawnConfetti();
    impactFlash.classList.remove('flash');
    void impactFlash.offsetWidth;
    impactFlash.classList.add('flash');
    clearTimeout(autoNavTimeout);
    autoNavTimeout = setTimeout(function () {
      window.location.href = pick.url;
    }, 2500);
  }

  function onRollEnd() {
    btn.disabled = false;
    showResult();
  }

  btn.addEventListener('click', function () {
    if (rolling || settling) return;
    clearTimeout(autoNavTimeout);
    btn.disabled = true;
    resultBox.hidden = true;
    camera.position.z = cameraDefaultZ;
    if (reduceMotion) {
      dice.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
      render();
      showResult();
      btn.disabled = false;
      return;
    }
    rolling = true;
    dice.position.x = 0;
    velocity.x = 0.42 + Math.random() * 0.4;
    velocity.y = 0.48 + Math.random() * 0.42;
    velocity.z = 0.26 + Math.random() * 0.3;
    posXVel = (Math.random() - 0.5) * 0.16;
    bounceY = 0;
    bounceVelY = 0.3 + Math.random() * 0.1;
  });
})();
</script>
<!-- rebuild trigger -->

