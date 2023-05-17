PIXEL_SIZE = 2;
GRID_SIZE = (16) * PIXEL_SIZE;

(function main() {
  class WorldElement {
    #x;
    #y;
    #centerX;
    #centerY;
    constructor(el, worldX, worldY) {
      this.permanent = true;
      this.el = el;
      this.worldX = worldX;
      this.worldY = worldY;

      this.el.style.transform = "translate3d(0, 0, 0px)";
      this.x = worldX;
      this.y = worldY;

      try {
        this.rect = this.el.getBoundingClientRect();
        this.width = this.rect.width;
        this.height = this.rect.height;
      } catch (error) {}
    }

    get x() {
      return this.#x;
    }

    set x(val) {
      this.#x = val;
      this.el.style.transform = `translate3d(${this.#x}px, ${this.#y}px, 0px)`;
    }

    get y() {
      return this.#y;
    }

    set y(val) {
      this.#y = val;
      this.el.style.transform = `translate3d(${this.#x}px, ${this.#y}px, 0px)`;
    }

    get centerX() {
      return this.x + (this.width / 2)
    }

    get centerY() {
      return this.y + (this.height / 2)
    }
  }

  class ExploreDude extends WorldElement {
    constructor(el, worldX, worldY) {
      super(el, worldX, worldY);
      
      this.accel = 4
      this.velX = 0;
      this.velY = 0;
      this.drag = 0.13

      this.x = worldX;
      this.y = worldY;
    }
  }

  let worldObjects = [];

  ///----- SETUP -----\\\
  function lockNav() {
    let paths = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(paths);
    let left = paths.offsetLeft;
    let top = paths.offsetTop - pxToNum(styles["margin-top"]);

    paths.style.position = "absolute";
    paths.style.width = styles["max-width"];
    worldObjects.push(new WorldElement(paths, left, top));
  }
  
  function makeBG(mainDiv) {
    mainDiv.className += " nobg";
  
    let bg = document.createElement("div");
    bg.className += " background";

    mainDiv.appendChild(bg);

    let background = new WorldElement(
      bg, bg.offsetTop, bg.offsetLeft
    )
    worldObjects.push(background);
    return background;
  }

  function touchGrass() {
    let grassRule;
    let rules = document.styleSheets[document.styleSheets.length - 1].cssRules;
    for (let rule of rules)  {
      if (rule.selectorText === ".main.nobg::before") {
        grassRule = rule;
        break;
      }
    }
    let grass = new WorldElement(grassRule, 0, 0);
    // worldObjects.push(grass);
    return grass;
  }

  function makeDude(mainDiv) {
    let nav = document.getElementsByClassName("paths")[0];
    let navRect = nav.getBoundingClientRect();

    let dudeEl = document.createElement("div");
    dudeEl.className += " dude";
    
    let dudeWidth = 20
    let left = navRect.left + (navRect.width / 2) - (dudeWidth / 2);
    let top = navRect.height + nav.offsetTop + 15

    setTimeout(function(el) {
      el.style.opacity = 1;
    }, 70, dudeEl)

    mainDiv.appendChild(dudeEl);
    
    return new ExploreDude(dudeEl, left, top);
  }
  
  ///----- MECHANICS -----\\\
  document.addEventListener("mousemove", function(event) {
    inputs.mouseX = event.clientX;
    inputs.mouseY = event.clientY;
    inputs.mouseDown = Boolean(event.buttons % 2)
  });

  document.addEventListener("mousedown", function(event) {
    inputs.mouseDown = true;
  });

  document.addEventListener("mouseup", function(event) {
    inputs.mouseDown = false;
  });

  function doMovement() {
    let dx = 0;
    let dy = 0;

    if (inputs.left)  dx += -1;
    if (inputs.right) dx += 1;
    if (inputs.up)    dy += -1;
    if (inputs.down)  dy += 1;
    
    if (!(inputs.left || inputs.right || inputs.up || inputs.down)) {
      if (inputs.mouseDown) {
        dx = inputs.mouseX - (
          dude.worldX - camera.worldX + (camera.width)
        );
        dy = inputs.mouseY - headerHeight - (
          dude.worldY - camera.worldY + (camera.height)
        );
      }
    }
    
    moveDude(dx, dy);
    moveCamera();
  }
  
  function moveDude(dx, dy) {
    let accelX = 0;
    let accelY = 0;

    if (dx || dy) {
      let hypot = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      accelX = (dx / hypot) * dude.accel;
      accelY = (dy / hypot) * dude.accel;
    }
    
    let dragX = dude.drag * Math.pow(dude.velX, 2) * -Math.sign(dude.velX);
    let dragY = dude.drag * Math.pow(dude.velY, 2) * -Math.sign(dude.velY);
    
    dude.velX += accelX + dragX;
    dude.velY += accelY + dragY;

    if (Math.abs(dude.velX) < 0.2) dude.velX = 0;
    if (Math.abs(dude.velY) < 0.2) dude.velY = 0;

    // Update map position
    dude.worldX += dude.velX;
    dude.worldY += dude.velY;

  }

  function moveCamera() {
    // console.log(`height: ${camera.height}`);
    
    camera.worldX += (dude.worldX - camera.worldX) / 20;

    // if (dude.worldY < camera.centerY + headerSize) {
    //   headerOffset = Math.min(camera.centerY - dude.worldY, 0);
    //   header.style.transform = `translate3d(0px, ${headerOffset}px, 0px)`;
    //   mainDiv.style.top = `${headerOffset}px`;
    //   // camera.worldY = camera.centerY;
    // } else {
    //   headerOffset = -headerSize;
    //   // camera.worldY += (dude.worldY - camera.worldY) / 20;
    // }
    
    camera.worldY += (dude.worldY - camera.worldY) / 20;

    if (camera.worldX + camera.width > cameraBounds.right)
      camera.worldX = cameraBounds.right - camera.width;
    
    if (camera.worldX - camera.width < cameraBounds.left)
      camera.worldX = cameraBounds.left + camera.width;
    
    if (camera.worldY - camera.height < cameraBounds.top)
      camera.worldY = cameraBounds.top + camera.height;
    
    if (camera.worldY + camera.height > cameraBounds.bottom)
      camera.worldY = cameraBounds.bottom - camera.height;

    
    camera.worldX = Math.max(
      Math.min(camera.worldX, cameraBounds.right),
      cameraBounds.left
    );

    camera.worldY = Math.max(
      Math.min(camera.worldY, cameraBounds.bottom),
      cameraBounds.top
    );
  
    background.worldX = camera.worldX - camera.width - camera.worldX%GRID_SIZE;
    background.worldY = camera.worldY - camera.height - camera.worldY%GRID_SIZE;
  
    updateObjects();
    grass.x = background.x;
    grass.y = 0;
  }

  function updateObjects() {
    for (let i=0; i<worldObjects.length; i++) {
      let el = worldObjects[i];
      el.x = camera.centerX + (el.worldX - camera.worldX)
      el.y = camera.centerY + (el.worldY - camera.worldY)
    }

    // let hy = -headerSize;
    // headerOffset = camera.centerY + (hy - camera.worldY)
    // header.style.transform = `translate3d(0px, ${headerOffset}px, 0px)`;
    
    // let my = 0;
    // let mainOffset = camera.centerY + (my - camera.worldY)
    // mainDiv.style.top = `${mainOffset}px`;
  }

  function updateCamera() {
    headerHeight = headerSize + headerOffset;

    camera.width = window.innerWidth / 2;
    camera.height = (window.innerHeight - headerHeight) / 2;
    camera.centerX = camera.width;
    camera.centerY = camera.height;
  }

  // Set up and get important components
  let mainDiv = document.getElementsByClassName("main")[0]
  lockNav();
  let background = makeBG(mainDiv);
  let grass = touchGrass();
  let dude = makeDude(mainDiv);
  worldObjects.push(dude);

  let header = document.getElementsByTagName("header")[0];
  let headerStyle = getComputedStyle(header);
  let headerSize = (
    pxToNum(headerStyle["height"])
    + pxToNum(headerStyle["padding-top"])
    + pxToNum(headerStyle["padding-bottom"])
  );
  let headerOffset = 0;
  let headerHeight = headerSize;

  let camera = {
    worldX:  0, worldY:  0,
    centerX: 0, centerY: 0,
    width:   0, height:  0
  };
  let cameraBounds = {
    top: 0, bottom: 6000, right: 4000, left: -3000
  };

  updateCamera();
  camera.worldX = camera.centerX;
  camera.worldY = camera.centerY;

  // Explore loop
  function step() {
    updateCamera();
    doMovement();

    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); // start the loop
})();