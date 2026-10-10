---
layout: page
title: 季節で探す
permalink: /season/
---

<style>
  .season-intro { color: var(--sb-brown-soft); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.75rem; }

  .month-picker {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;
    margin-bottom: 1.75rem;
  }
  @media (max-width: 480px) {
    .month-picker { grid-template-columns: repeat(4, 1fr); }
  }
  .month-btn {
    appearance: none;
    border: 1px solid var(--sb-border);
    background: var(--sb-card);
    color: var(--sb-brown);
    border-radius: 10px;
    padding: 0.6rem 0.3rem;
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .month-btn:hover { border-color: var(--sb-green); }
  .month-btn.active {
    background: var(--sb-green);
    border-color: var(--sb-green);
    color: #fff;
  }

  .season-tag-section { margin-bottom: 1.75rem; }
  .season-tag-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--sb-brown-soft);
    margin-bottom: 0.5rem;
  }
  .season-tag-picker {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.4rem;
  }
  @media (max-width: 600px) {
    .season-tag-picker { grid-template-columns: repeat(4, 1fr); }
  }
  .season-tag-btn {
    appearance: none;
    border: 1px solid var(--sb-border);
    background: var(--sb-card);
    color: var(--sb-brown);
    border-radius: 999px;
    padding: 0.5rem 0.3rem;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .season-tag-btn:hover { border-color: var(--sb-green); }
  .season-tag-btn.active {
    background: var(--sb-green-dark);
    border-color: var(--sb-green-dark);
    color: #fff;
  }

  .season-result-summary {
    font-size: 0.88rem;
    color: var(--sb-brown-soft);
    margin-bottom: 1rem;
  }
  .season-result-summary strong { color: var(--sb-green-dark); }

  .season-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.9rem;
    margin-bottom: 2.5rem;
  }

  .season-card {
    background: var(--sb-card);
    border: 1px solid var(--sb-border);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
  }
  .season-card.dim { opacity: 0.4; }
  .season-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .season-card-country {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--sb-green);
    letter-spacing: 0.02em;
  }
  .season-card-badges { display: flex; flex-wrap: wrap; gap: 0.3rem; justify-content: flex-end; }
  .season-card-badge {
    font-size: 0.68rem;
    font-weight: 700;
    color: #fff;
    background: var(--sb-gold);
    border-radius: 999px;
    padding: 0.15rem 0.55rem;
    white-space: nowrap;
  }
  .season-card-badge.score { background: var(--sb-green); }
  .season-card-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--sb-brown);
    line-height: 1.4;
  }
  .season-card-months {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.1rem;
  }
  .season-month-chip {
    font-size: 0.72rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: var(--sb-cream);
    border: 1px solid var(--sb-border);
    color: var(--sb-brown-soft);
  }
  .season-month-chip.is-selected {
    background: var(--sb-green);
    border-color: var(--sb-green);
    color: #fff;
    font-weight: 700;
  }

  .season-matrix-section h2 {
    font-size: 1.1rem;
    color: var(--sb-green-dark);
    margin: 0 0 0.9rem;
  }
  .season-matrix-wrap { overflow-x: auto; border: 1px solid var(--sb-border); border-radius: 12px; }
  .season-matrix-wrap table { border-collapse: collapse; width: 100%; font-size: 0.78rem; min-width: 680px; margin-bottom: 0; }
  .season-matrix-wrap th, .season-matrix-wrap td { padding: 0.5rem 0.4rem; text-align: center; border-bottom: 1px solid var(--sb-border); white-space: nowrap; }
  .season-matrix-wrap thead th { background: var(--sb-card); color: var(--sb-green-dark); font-weight: 700; position: sticky; top: 0; }
  .season-matrix-wrap tbody th {
    text-align: left;
    font-weight: 600;
    color: var(--sb-brown);
    background: var(--sb-card);
    position: sticky;
    left: 0;
  }
  .season-matrix-wrap tbody tr:last-child td, .season-matrix-wrap tbody tr:last-child th { border-bottom: none; }
  .season-dot { color: var(--sb-green); font-weight: 700; }
</style>

<p class="season-intro">月を選ぶとベストシーズンの行き先が上に表示されます。タグを2つ選べば、その組み合わせに合う順に並び替わります。</p>

<div class="month-picker" id="seasonMonthPicker"></div>

<div class="season-tag-section">
  <div class="season-tag-label">どんな旅がしたい？（任意・最大2つ）</div>
  <div class="season-tag-picker" id="seasonTagPicker"></div>
</div>

<div class="season-result-summary" id="seasonResultSummary"></div>
<div class="season-grid" id="seasonCardGrid"></div>

<section class="season-matrix-section">
  <h2>全体表</h2>
  <div class="season-matrix-wrap">
    <table id="seasonMatrixTable"></table>
  </div>
</section>

<script>
(function () {
  var destinations = {{ site.data.destinations | jsonify }};

  var tagLabels = {
    beach: "ビーチ", resort: "リゾート", island: "島", city_base: "街拠点",
    sightseeing: "観光", relax: "まったり", party: "パーティ", activity: "アクティブ"
  };
  var tagOrder = ["beach","resort","island","city_base","sightseeing","relax","party","activity"];

  var monthPicker = document.getElementById('seasonMonthPicker');
  var tagPicker = document.getElementById('seasonTagPicker');
  var cardGrid = document.getElementById('seasonCardGrid');
  var resultSummary = document.getElementById('seasonResultSummary');
  var matrixTable = document.getElementById('seasonMatrixTable');

  var selectedMonth = (new Date().getMonth() + 1);
  var selectedTags = [];

  function renderMonthPicker() {
    monthPicker.innerHTML = '';
    for (var m = 1; m <= 12; m++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'month-btn' + (m === selectedMonth ? ' active' : '');
      btn.textContent = m + '月';
      btn.addEventListener('click', function (month) {
        return function () { selectedMonth = month; renderAll(); };
      }(m));
      monthPicker.appendChild(btn);
    }
  }

  function renderTagPicker() {
    tagPicker.innerHTML = '';
    tagOrder.forEach(function (key) {
      var btn = document.createElement('button');
      btn.type = 'button';
      var isActive = selectedTags.indexOf(key) !== -1;
      btn.className = 'season-tag-btn' + (isActive ? ' active' : '');
      btn.textContent = tagLabels[key];
      btn.addEventListener('click', function () {
        if (isActive) {
          selectedTags = selectedTags.filter(function (t) { return t !== key; });
        } else {
          selectedTags.push(key);
          if (selectedTags.length > 2) { selectedTags.shift(); }
        }
        renderAll();
      });
      tagPicker.appendChild(btn);
    });
  }

  function renderCards() {
    var hasTags = selectedTags.length === 2;

    var withScores = destinations.map(function (d) {
      var months = d.best_months || [];
      var isMonthMatch = months.indexOf(selectedMonth) !== -1;
      var tagScore = (hasTags && d.tags) ? ((d.tags[selectedTags[0]] || 0) + (d.tags[selectedTags[1]] || 0)) : null;
      return { d: d, isMonthMatch: isMonthMatch, tagScore: tagScore };
    });

    withScores.sort(function (a, b) {
      if (a.isMonthMatch !== b.isMonthMatch) { return a.isMonthMatch ? -1 : 1; }
      if (hasTags && a.tagScore !== b.tagScore) { return b.tagScore - a.tagScore; }
      return 0;
    });

    var matchCount = withScores.filter(function (x) { return x.isMonthMatch; }).length;
    var summary = selectedMonth + '月がベストシーズンの行き先：<strong>' + matchCount + '件</strong>（全' + destinations.length + '件中）';
    if (hasTags) {
      summary += '　・　条件：<strong>' + tagLabels[selectedTags[0]] + ' × ' + tagLabels[selectedTags[1]] + '</strong>で並び替え';
    }
    resultSummary.innerHTML = summary;

    cardGrid.innerHTML = '';
    withScores.forEach(function (item) {
      var d = item.d;
      var isMatch = item.isMonthMatch;
      var months = d.best_months || [];
      var a = document.createElement('a');
      a.href = d.url;
      a.className = 'season-card' + (isMatch ? '' : ' dim');

      var top = document.createElement('div');
      top.className = 'season-card-top';
      var country = document.createElement('span');
      country.className = 'season-card-country';
      country.textContent = d.country || '';
      top.appendChild(country);

      var badges = document.createElement('div');
      badges.className = 'season-card-badges';
      if (isMatch) {
        var badge = document.createElement('span');
        badge.className = 'season-card-badge';
        badge.textContent = 'ベストシーズン';
        badges.appendChild(badge);
      }
      if (hasTags) {
        var scoreBadge = document.createElement('span');
        scoreBadge.className = 'season-card-badge score';
        scoreBadge.textContent = '相性 ' + item.tagScore + '/10';
        badges.appendChild(scoreBadge);
      }
      top.appendChild(badges);
      a.appendChild(top);

      var name = document.createElement('div');
      name.className = 'season-card-name';
      name.textContent = d.name;
      a.appendChild(name);

      var monthsRow = document.createElement('div');
      monthsRow.className = 'season-card-months';
      months.forEach(function (m) {
        var chip = document.createElement('span');
        chip.className = 'season-month-chip' + (m === selectedMonth ? ' is-selected' : '');
        chip.textContent = m + '月';
        monthsRow.appendChild(chip);
      });
      a.appendChild(monthsRow);

      cardGrid.appendChild(a);
    });
  }

  function renderMatrix() {
    var thead = '<thead><tr><th>行き先</th>';
    for (var m = 1; m <= 12; m++) { thead += '<th>' + m + '</th>'; }
    thead += '</tr></thead>';

    var tbody = '<tbody>';
    destinations.forEach(function (d) {
      var months = d.best_months || [];
      tbody += '<tr><th>' + d.name + '</th>';
      for (var m = 1; m <= 12; m++) {
        var hit = months.indexOf(m) !== -1;
        tbody += '<td' + (m === selectedMonth ? ' style="background:var(--sb-cream)"' : '') + '>' + (hit ? '<span class="season-dot">&#9679;</span>' : '') + '</td>';
      }
      tbody += '</tr>';
    });
    tbody += '</tbody>';

    matrixTable.innerHTML = thead + tbody;
  }

  function renderAll() {
    renderMonthPicker();
    renderTagPicker();
    renderCards();
    renderMatrix();
  }

  renderAll();
})();
</script>
