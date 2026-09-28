---
layout: page
title: 国から探す
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
