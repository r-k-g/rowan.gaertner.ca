---
layout: secondary
title: Portfolio
permalink: /portfolio/
description: "Portfolio of projects by Rowan Gaertner."
---

A collection of things I've worked on over the years.

{% assign sorted_projects = site.projects | sort: "date" | reverse %}
<div class="portfolio-grid">
{% for project in sorted_projects %}
<a href="{{ project.url }}" class="portfolio-card">
    <img src="{{ project.thumbnail }}" alt="{{ project.title }}">
    <span class="portfolio-card-title">{{ project.title }}</span>
</a>
{% endfor %}
</div>

See [GitHub](https://github.com/r-k-g/) for more.
