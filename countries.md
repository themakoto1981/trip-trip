---
layout: page
title: 国から決める
description: "インドネシア・マレーシア・フィリピン・タイ・ベトナムなど、国ごとの特徴から旅行先の島を探せます。気候やビザ、文化の違いを比較して選べます。"
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Padar_Island%2C_Komodo_National_Park%2C_Indonesia%2C_20250822_0929_2659.jpg/960px-Padar_Island%2C_Komodo_National_Park%2C_Indonesia%2C_20250822_0929_2659.jpg"
permalink: /countries/
---

<ul class="country-hub-list">
  {%- for c in site.countries -%}
  <li>
    <a href="{{ c.url | relative_url }}">
      <span class="country-flag">{{ c.flag }}</span>
      <span class="country-name">{{ c.title }}</span>
    </a>
    <p class="country-excerpt">{{ c.excerpt }}</p>
  </li>
  {%- endfor -%}
</ul>
