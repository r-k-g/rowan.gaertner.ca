PIXEL_SIZE = 2;
GRID_SIZE = (16) * PIXEL_SIZE;

(function main() {
  class WorldElement {
    #x;
    #y;
    constructor(el, worldX, worldY, collision=false) {
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

      if (collision) collisionObjects.push(this);
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
  }

  class ExploreDude extends WorldElement {
    constructor(el, worldX, worldY) {
      super(el, worldX, worldY);
      
      this.accel = 4;
      this.velX = 0;
      this.velY = 0;
      this.drag = 0.13;

      this.x = worldX;
      this.y = worldY;
    }
  }

  let worldObjects = [];
  let collisionObjects = [];

  ///----- SETUP -----\\\
  function loadNav() {
    let nav = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(nav);
    document.body.appendChild(nav)

    nav.style.position = "absolute";
    nav.style.margin = "0px";
    nav.style.width = styles["max-width"];
    nav.style.top = "0px";
    nav.style.left = "0px";

    let left = camera.width - (pxToNum(styles["max-width"]) / 2);
    let top = headerHeight + 68;

    let navObj = new WorldElement(nav, left, top, true)
    worldObjects.push(navObj);  
    return navObj;
  }
  
  function makeBG(mainDiv) {
    mainDiv.className += " nobg";
  
    let bg = document.createElement("div");
    bg.className += " background";

    document.body.appendChild(bg);

    let background = new WorldElement(
      bg, bg.offsetTop, bg.offsetLeft
    );
    worldObjects.push(background);
    return background;
  }

  function touchGrass() {
    let grassRule;
    let rules = document.styleSheets[document.styleSheets.length - 1].cssRules;
    for (let rule of rules) {
      if (rule.selectorText === ".main.nobg::before") {
        grassRule = rule;
        break;
      }
    }
    let grass = new WorldElement(grassRule, 0, 0);
    return grass;
  }

  function makeDude() {
    let navRect = nav.el.getBoundingClientRect();

    let dudeEl = document.createElement("div");
    dudeEl.className += " dude";
    
    let dudeWidth = 20;
    let left = navRect.left + (navRect.width / 2) - (dudeWidth / 2);
    let top = navRect.bottom + 15;

    setTimeout(function(el) {
      dudeEl.style.opacity = 1;
    }, 70, dudeEl);

    document.body.appendChild(dudeEl);
    
    return new ExploreDude(dudeEl, left, top);
  }
  
  ///----- MECHANICS -----\\\
  document.addEventListener("mousemove", function(event) {
    inputs.mouseX = event.clientX;
    inputs.mouseY = event.clientY;
    inputs.mouseDown = Boolean(event.buttons % 2);
  });

  document.addEventListener("mousedown", function(event) {
    inputs.mouseDown = true;
    console.log(`dudeX: ${dude.worldX} navX: ${nav.worldX} dudeY: ${dude.worldY} navY: ${nav.worldY}`)
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
        dy = inputs.mouseY - (
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
    
    doCollision();
  }

  function doCollision() {
    if (dude.worldY < cameraBounds.top + headerHeight - 25)
      dude.worldY = cameraBounds.top + headerHeight - 25;
    if (dude.worldY + dude.height > cameraBounds.bottom)
      dude.worldY = cameraBounds.bottom - dude.height;
    if (dude.worldX < cameraBounds.left)
      dude.worldX = cameraBounds.left;
    if (dude.worldX + dude.width > cameraBounds.right)
      dude.worldX = cameraBounds.right - dude.width;

    for (let i=0; i<collisionObjects.length; i++) {
      let el = collisionObjects[i];

      dude.worldY -= dude.velY;
      let colliding = checkIntersect(
        dude.worldX, dude.worldY + 25,
        dude.width, dude.height - 25,
        el.worldX, el.worldY,
        el.width, el.height
      )

      if (colliding) {
        dude.worldX = dude.velX > 0 ? el.worldX - dude.width - 2 : el.worldX + el.width + 2;
        dude.velX = 0;
      }

      dude.worldY += dude.velY;
      colliding = checkIntersect(
        dude.worldX, dude.worldY + 25,
        dude.width, dude.height - 25,
        el.worldX, el.worldY,
        el.width, el.height
      )

      if (colliding) {
        dude.worldY = dude.velY > 0 ? el.worldY - dude.height - 2 : el.worldY + el.height - 23;
        dude.velY = 0;
      }
    }
  }

  function checkIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 > x2 + w2 || x1 + w1 < x2 || y1 > y2 + h2 || y1 + h1 < y2)
      return false;
    return true;
  }

  function moveCamera() {
    camera.worldX += (dude.worldX - camera.worldX) / camera.delay;
    camera.worldY += (dude.worldY - camera.worldY) / camera.delay;

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

    headerObj.x = 0;
    mainObj.x = 0;
  }

  function updateObjects() {
    for (let i=0; i<worldObjects.length; i++) {
      let el = worldObjects[i];
      el.x = camera.width + (el.worldX - camera.worldX);
      el.y = camera.height + (el.worldY - camera.worldY);
    }
  }

  function updateCamera() {
    camera.width = window.innerWidth / 2;
    camera.height = window.innerHeight / 2;
    if (camera.delay > 20)
      camera.delay -= 1; 
  }

  ///----- DRIVER CODE -----\\\
  // Set up camera
  let camera = {
    worldX: 0, worldY:  0,
    width:  0, height:  0,
    delay: 20
  };
  let cameraBounds = {
    top: 0, bottom: 3000, right: 2500, left: -1000
  };

  updateCamera();
  camera.worldX = camera.width;
  camera.worldY = camera.height;

  // Get and set up important components
  let headerEl = document.getElementsByTagName("header")[0];
  let headerStyle = getComputedStyle(headerEl);
  let headerHeight = (
    pxToNum(headerStyle["height"])
    + pxToNum(headerStyle["padding-top"])
    + pxToNum(headerStyle["padding-bottom"])
  );
  let headerObj = new WorldElement(headerEl, 0, 0);
  worldObjects.push(headerObj);
    
  let mainEl = document.getElementsByClassName("main")[0];
  let mainObj = new WorldElement(mainEl, 0, headerHeight);
  worldObjects.push(mainObj);

  let nav = loadNav();
  let background = makeBG(mainEl);
  let grass = touchGrass();
  let dude = makeDude(mainEl);
  worldObjects.push(dude);


  // The explore mode loop
  function step() {
    updateCamera();
    doMovement();

    window.requestAnimationFrame(() => {
      step();
    })
  }

  // Start the loop after a pause
  setTimeout(step, 500);

  // Ease in camera
  camera.delay = 60;
})();