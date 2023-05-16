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
      this.speed = 2;
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
    // paths.style.top = numToPx(top);
    // paths.style.left = numToPx(left);
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
    worldObjects.push(grass);
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

    // dudeEl.style.left = numToPx(left);
    // dudeEl.style.top = numToPx(top);

    setTimeout(function(el) {
      el.style.opacity = 1;
    }, 70, dudeEl)

    mainDiv.appendChild(dudeEl);
    
    return new ExploreDude(dudeEl, left, top);
  }
  
  ///----- MECHANICS -----\\\
  function loopBG() {
    if (Math.abs(background.x) > GRID_SIZE) {
      background.x = background.x % GRID_SIZE
    }
    if (Math.abs(background.y) > GRID_SIZE) {
      background.y = background.y % GRID_SIZE
    }
    grass.x = background.x;
    grass.y = 0;
  }

  function doMovement() {
    let moveX = 0;
    let moveY = 0;

    if (inputs.left) {
      moveX = -dude.speed;
    }
    if (inputs.right) {
      moveX = dude.speed;
    }
    if (inputs.up) {
      moveY = -dude.speed;
    }
    if (inputs.down) {
      moveY = dude.speed
    }

    // Update map position
    dude.worldX += moveX;
    dude.worldY += moveY;

    // let x0 = dude.centerX;
    // let y0 = dude.centerY;
    
    // let xDist = x0 + moveX;
    // let yDist = y0 + moveY;


    camera.worldX += (dude.worldX - camera.worldX) / 20
    camera.worldY += (dude.worldY - camera.worldY) / 20

    // dude.x = (camera.centerX - x0) / 9
    // dude.y = (camera.centerY - y0) / 9
    // dude.x = camera.centerX + (moveX / 1.1)
    // dude.y = camera.centerY + (moveY / 1.1)
    

    updateObjects();
  }

  function updateObjects() {
    for (let i=0; i<worldObjects.length; i++) {
      let el = worldObjects[i];
      el.x = camera.centerX + (el.worldX - camera.worldX)
      el.y = camera.centerY + (el.worldY - camera.worldY)
    }
  }

  function updateCamera() {
    camera.width = window.innerWidth;
    camera.height = window.innerHeight - (
      pxToNum(headerStyle["height"])
      + pxToNum(headerStyle["padding-top"])
      + pxToNum(headerStyle["padding-bottom"])
    )
    camera.centerX = camera.width / 2;
    camera.centerY = camera.height / 2;
  }

  // Set up and get important components
  let mainDiv = document.getElementsByClassName("main")[0]
  lockNav();
  let background = makeBG(mainDiv);
  let grass = touchGrass();
  let dude = makeDude(mainDiv);
  worldObjects.push(dude);

  let mainStyle = getComputedStyle(mainDiv);
  let headerStyle = getComputedStyle(document.getElementsByTagName("header")[0]);
  let camera = {
    worldX:  0, worldY:  0,
    centerX: 0, centerY: 0,
    width:   0, height:  0
  };

  updateCamera();
  camera.worldX = camera.centerX;
  camera.worldY = camera.centerY;

  // Explore loop
  function step() {
    updateCamera();
    doMovement();
    loopBG();

    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); // start the loop


})();