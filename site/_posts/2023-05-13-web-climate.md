---
layout: post
title: Climate Impacts of the Web
tags: web environment
---

## Background
We don't often think about websites as having an impact on the environment. Long story short: they do. The basic reason for this is that energy is required to run the web servers and data centres you use. If you want more science, I encourage you to do your own research. The general takeaway is that the carbon footprint of web use is not insignificant.

I became aware of this quite recently relative to how long I have been using the web. I was browsing various personal blogs for inspiration in designing this website when I saw a badge for [Website Carbon](https://www.websitecarbon.com/) on [chenbrian.ca](https://chenbrian.ca). This is a website that roughly calculates the relative environmental impact of a given webpage.

With this in mind, I tried to make my own website as climate conscious as possible, while still maintaining functionality and appearance. I was fairly succesful: see [results](https://www.websitecarbon.com/website/rowan-gaertner-ca/).

## Strategies
So how do you make a website environmentally friendly? (As environmentally friendly as any website can be, that is).

Here are some strategies I used:
 1. Use a static site! This way there is much less server processing with each webpage visit.
 2. Make all your images small. You can do this by compressing the file with JPEG compression or similar, or by using small thumbnails at first and only loading larger versions when needed. Both is the best! For my [photography page](/photos/), I used a python script to compress images to the two different sizes.
 3. Avoid loading large JS libraries (cough cough ~~jquery~~).
 4. **If** you want to use non-system fonts, use efficient file types ([WOFF/WOFF2](https://en.wikipedia.org/wiki/Web_Open_Font_Format)), and subset the fonts to only the required characters.
 5. Use an environmentally friendly web host (generally one that uses clean energy or at least has carbon offset initiatives). [This list](https://www.thegreenwebfoundation.org/directory/) is a good place to start.

And finally, even if you don't care too much about the relatively small impacts of your little personal site, there are other benefits to following the above tips. The common theme behind all the advice is to make everything as lightweight as possible. This has another massive benefit: it makes your website *faster*!