---
layout: secondary
title: Projects
permalink: /projects/
---

Currently incomplete - see my [GitHub](https://github.com/r-k-g/) for more.

{% render_card %}
This Website
February 2023 - Present
[GitHub](https://github.com/r-k-g/rowan.gaertner.ca)

![Homepage](/assets/images/homepage_sc.png)
You're looking at it right now. After a few years of thinking "I'd like to have a website," I took the opportunity provided by some free time in my grade 12 year to actually make one. 

My guiding ideas going in were that I wanted the website to be lightweight, and that I wanted to avoid using complex frameworks—I wanted to it all myself. I ended up using Jekyll more or less on a whim, but it seems to serve my purposes pretty well for now. Almost everything was made from scratch: hand coding the html/css, and doing the artwork by hand too... which might be apparent. I was going for a retro game aesthetic with the design, which played in nicely with making the website lightweight: I make extensive use of tiling graphics.
{% endrender_card %}



{% render_card %}
Nautical Twilight
March 2021 - March 2021
[GitHub](https://github.com/SubwayMan/jamegam)
[PixelPAD](https://pixelpad.io/app/lfgzohcupbm/?edit=1)

![Nautical Twilight](/assets/images/nautical_thumb.png)
This was the winner of the 2021 PixelPAD March Break Game Jam, and my first exposure to PixelPAD. Developed in a team with one other developer, Nautical Twilight is a short game about an octopus.
{% endrender_card %}



{% render_card %}
MP3 Player
December 2021 - January 2021

![MP3 Player](/assets/images/mp3player_sc.png)
This is a pyFLTK GUI for organizing MP3 files and playing them using headless VLC. With _definitely_ intentional retro styling, functionality includes playlists, custom queues, and play history.
{% endrender_card %}



{% render_card %}
Pattern Memory Game
January 2021 - December 2021
[GitHub](https://github.com/r-k-g/simon-game)

![Simon Game](/assets/images/simon_sc.png)
A simon-like light pattern memory game. Originally an assignment for a computer science class, the task was to recreate the game simon using pyFLTK. With some free time on my hands, I added circular button hit detection, a score saving system, and nice window resizing.
{% endrender_card %}



{% render_card %}
Vigenere Cipher Tool
May 2020 - June 2020

![Vigenere Cipher Tool](/assets/images/vig_sc.png)
Once upon a time, I had an assignment in school to write a python program that would encrypt and decrypt the Vigenere cipher. This was a simple assignment, asking only for a command line tool that would encrypt or decrypt a file using a known key. I... may have gotten a little bit carried away. 

I decided to add the ability to guess the key used to encrypt text, given that you know the length of the key. This involves looking at intervals and matching encrypted letter frequencies with known letter frequencies. Because letter frequencies I found online didn't say what sources they used, I decided to find my own. To do this, I downloaded a dataset of nearly 20,000 blogs, and wrote a script to parse the XML that they were stored in. Later, when I was trying to learn Tkinter, I decided to make a GUI for the vigenere program.
{% endrender_card %}
