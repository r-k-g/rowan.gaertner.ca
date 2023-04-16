---
layout: secondary
title: Portfolio
permalink: /portfolio/
---

{% render_card %}
This Website
February 2023 - Present
[GitHub](https://github.com/r-k-g/rowan.gaertner.ca)

![Homepage](/assets/images/homepage_sc.png)
You're looking at it right now. After a few years of thinking "maybe I should have a website," I used a open ended school project as an incentive to actually make one. 

My main ideas going in were that I wanted the website to be fairly lightweight, and that I wanted to avoid using any javascript frameworks. I ended up using Jekyll more or less on a whim, but it seems to serve my purposes fine for now. Pretty much everything was made from scratch: hand coding the html/css, and doing the artwork myself. That last one might be somewhat apparent,even despite my usual trick of using pixel art to hide my artistic inability.
{% endrender_card %}



{% render_card %}
Pattern Memory Game
January 2021 - December 2021
[GitHub](https://github.com/r-k-g/simon-game)

![Simon Game](/assets/images/simon_sc.png)
A simon-like light pattern memory game. Originally an assignment for a computer science class, the task was to recreate the game simon using pyFLTK. With some free time on my hands, I added circular button hit detection, a score saving system, and window resizing.
{% endrender_card %}



{% render_card %}
Vigenere Cipher Tool
May 2020 - June 2020

![Vigenere Cipher Tool](/assets/images/vig_sc.png)
Once upon a time, I had an assignment in school to write a python program that would encrypt and decrypt the Vigenere cipher. This was a simple assignment, asking only for a command line tool that would encrypt or decrypt a file using a known key. I... may have gotten a little bit carried away. 

I decided to add the ability to guess the key used to encrypt text, given that you know the length of the key. This involves looking at intervals and matching encrypted letter frequencies with known letter frequencies. Because letter frequencies I found online didn't say what sources they used, I decided to find my own. To do this, I downloaded a dataset of nearly 20,000 blogs, and wrote a script to parse the XML that they were stored in. Later, when I was trying to learn Tkinter, I decided to make a GUI for the vigenere program.
{% endrender_card %}