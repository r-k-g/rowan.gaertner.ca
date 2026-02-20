---
title: Automatic Laser Pointer
thumbnail: /assets/images/thumbnails/laser_pointer.png
date: 2023-10-01
date_range: October 2023 - November 2023
---

Holding a laser pointer is too complicated. This project automates the process by tracking your hand and shining a laser where you direct it.

![Automatic Laser Pointer](/assets/images/resized/laser_pointer.png)

This was done for an open ended project for SE101. Hand tracking is done with a webcam and OpenCV, and targets are then sent to a Raspberry Pi over local network. The Pi then controls two servos to act as a gimbal and point the laser at the target. 

![Laser Pointer Demo](/assets/images/resized/laser_pointer_demo.png)

The system includes hand gestures to turn on/off the laser, and also to freeze the position temporarily. It mostly worked quite well, and I found using it to be pretty fun and intuitive. The one limitation was that there was some set up required, as you had to calibrate it for how far away the wall was. To get around this, I made a quick python GUI where you could see the camera and manually set the corners of the wall.

![Laser Pointer R Pi](/assets/images/resized/laser_pointer_rpi.png)
