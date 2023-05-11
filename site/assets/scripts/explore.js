PIXEL_SIZE = 2;
GRID_SIZE = (16) * PIXEL_SIZE;

(function main() {
  class WorldElement {
    #x;
    #y;
    constructor(el, worldX, worldY) {
      this.permanent = true;
      this.el = el;
      this.worldX = worldX;
      this.worldY = worldY;
      this.#x=0; //temp val
      this.#y=0; //temp val

      this.el.style.transform = "translate3d(0, 0, 0px)";
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
      this.speed = 3;
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
    paths.style.top = numToPx(top);
    paths.style.left = numToPx(left);
    paths.style.width = styles["max-width"];
    worldObjects.push(new WorldElement(paths, top, left));
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
    let oldDude = document.getElementsByClassName("dude")[0];
    console.log(oldDude.style.left);
    console.log(oldDude.style.top);

    let dudeEl = document.createElement("div");
    dudeEl.className += " dude";
    mainDiv.appendChild(dudeEl);
    
    return new ExploreDude(dudeEl, 0, 0);
  }
  
  
  ///----- MECHANICS -----\\\
  function loopBG() {
    if (Math.abs(background.x) > GRID_SIZE) {
      background.x -= GRID_SIZE * Math.sign(background.x)
    }
    if (Math.abs(background.y) > GRID_SIZE) {
      background.y -= GRID_SIZE * Math.sign(background.y)
    }
    grass.x = background.x;
    grass.y = 0;
  }

  function doMovement() {
    let x0 = dude.x;
    let y0 = dude.y;

    for (let i=0; i<worldObjects.length; i++) {
      let el = worldObjects[i];
      if (inputs.left) {
        el.x += 3;
      }
      if (inputs.right) {
        el.x -= 3;
      }
      if (inputs.up) {
        el.y += 3;
      }
      if (inputs.down) {
        el.y -= 3
      }
    }
  }

  // Set up and get important components
  let mainDiv = document.getElementsByClassName("main")[0]
  lockNav();
  let background = makeBG(mainDiv);
  let grass = touchGrass();
  let dude = makeDude(mainDiv);

  // Explore loop
  function step() {
    doMovement();
    loopBG();
    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); // start the loop


})();