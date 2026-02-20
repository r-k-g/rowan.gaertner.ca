---
title: This Website
thumbnail: /assets/images/thumbnails/homepage_sc.png
date: 2023-02-01
date_range: February 2023 - Present
---

My personal website built from scratch with no frontend frameworks, using Jekyll as a static site generator with hand-coded HTML, SCSS, and vanilla JS.

_An older version of the front page_

![Homepage](/assets/images/resized/homepage_sc.png)

The site uses Jekyll's templating and collections for different content types like blog posts, notes, and projects.

The front page walking animation between signs is handled by a graph-based navigation system that takes keyboard and mouse input, and dynamically generates CSS keyframe animations. The retro pixel-art aesthetic is intentionally lightweight through extensive use of hand-drawn tiling graphics.

I think more websites should be whimsical.

Other random things I had fun with:
- The fence around the front page links and the cloud border on secondary pages (eg. About, Portfolio) uses CSS `border-image`, based off of the following graphics:

![Cloud Border](/assets/images/cloudborder.png)
![Fence Border](/assets/images/fence.png)

- The notepad matching the windows 10 notepad exactly serves no purpose at all but was a good time
- "Explore mode" (when you leave the fenced area on the front page) just moves all elements around the screen using CSS `translate3d`. I thought there might be performance concerns and I'd have to use canvas or something, but it seems to work fine
  - You can hide behind the trees (this does nothing)
- The scroll up transition when clicking links on the front page is set by adding "?t=down" to the url, and then animating a fake front page off the screen when loading the new page
- Everything (mostly) works without JavaScript, there are some fallbacks that you can only see if you disable it

_You can find the project code on [GitHub](https://github.com/r-k-g/rowan.gaertner.ca)_
