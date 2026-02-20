---
title: Vigenere Cipher Tool
thumbnail: /assets/images/thumbnails/vig_sc.png
date: 2020-05-01
date_range: May 2020 - June 2020
---

A Python tool with a Tkinter GUI for encrypting, decrypting, and cracking Vigenere ciphers using letter frequency analysis.

![Vigenere Cipher Tool](/assets/images/resized/vig_sc.png)

Originally a school assignment to build a command line tool that encrypts and decrypts with a known key, I extended it to also guess the key given the key length. This works by analyzing letter frequencies at each interval and matching them against known English letter frequencies. Because the frequency tables I found online didn't cite their sources, I downloaded a dataset of approximately 20,000 blogs and wrote a script to parse the XML and calculate my own. The GUI was added later as a way to learn Tkinter.
