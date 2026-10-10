---
layout: page
title: 記事一覧
permalink: /articles/
---

<style>
  .articles-intro { color: var(--sb-brown-soft); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.75rem; }
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.25rem;
  }
  .article-card {
    background: var(--sb-card);
    border: 1px solid var(--sb-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.15s;
  }
  .article-card:hover { box-shadow: 0 4px 14px rgba(30,57,50,0.12); }
  .article-card-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
  .article-card-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
  .article-card-meta { display: flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; }
  .article-card-date { color: var(--sb-brown-soft); }
  .article-card-category {
    background: var(--sb-cream);
    border: 1px solid var(--sb-border);
    color: var(--sb-green-dark);
    font-weight: 700;
    border-radius: 999px;
    padding: 0.1rem 0.6rem;
  }
  .article-card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--sb-brown);
    line-height: 1.45;
  }
  .article-card-excerpt {
    font-size: 0.85rem;
    color: var(--sb-brown-soft);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<p class="articles-intro">これまでに公開した島・ビーチのガイド記事一覧です。</p>

<div class="articles-grid">
  {%- for post in site.posts -%}
  <a class="article-card" href="{{ post.url | relative_url }}">
    <img class="article-card-img" src="{{ post.image }}" alt="{{ post.title | escape }}" loading="lazy">
    <div class="article-card-body">
      <div class="article-card-meta">
        <span class="article-card-date">{{ post.date | date: "%Y年%-m月%-d日" }}</span>
        {%- if post.categories.first -%}
        <span class="article-card-category">{{ post.categories.first }}</span>
        {%- endif -%}
      </div>
      <div class="article-card-title">{{ post.title | split: "｜" | first }}</div>
      <div class="article-card-excerpt">{{ post.excerpt | strip_html }}</div>
    </div>
  </a>
  {%- endfor -%}
</div>
