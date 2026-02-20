---
title: Realtime Canvas
thumbnail: /assets/images/thumbnails/multicanvas.png
date: 2021-03-01
date_range: March 2021
---

While working for PixelPAD, one of the projects I worked on was creating and deploying an API to enable real-time multiplayer games. This was the project I first created to test the feature.

![MultiCanvas](/assets/images/resized/multicanvas.png)

Although PixelPAD is generally intended for making games, this is more of a general-purpose application. You and another person join a server, and once connected you can both see what the other person draws on the canvas (or, if you're testing it, you open it in two separate tabs...). A few challenges I had fun with:
- Drawing lines to interpolate the points between where mouse locations registered at high speeds
- Implementing text fields from scratch (especially proud of the working cursor)

Since I got it far enough to successfully test that you could make a function real-time multiplayer application, there are also a few limitations:
- Have to manually type in the server ID to join (no clipboard functionality was available). I later developed a lobby system that solved this issue, where you could one-click join existing servers, but didn't put it here
- Chat function not implemented
- If you join a server, you only get new lines that appear; you don't see all of the history

Try it on [PixelPAD](https://pixelpad.io/app/ygthxvrtfuf/).
