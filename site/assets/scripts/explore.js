PIXEL_SIZE = 2;
GRID_SIZE = (16) * PIXEL_SIZE;

(function main() {
  console.log("Pastaman is BACK BABYYYYY");

  class WorldElement {
    #x;
    #y;
    constructor(el, worldX, worldY) {
      this.permanent = true;
      this.el = el;
      this.worldX = worldX;
      this.worldY = worldY;
      this.screenX;
      this.screenY;
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

  let worldObjects = [];
  let background, grass;

  let grassRule
  let rules = document.styleSheets[document.styleSheets.length - 1].cssRules;
  for (let rule of rules)  {
    if (rule.selectorText === ".main.nobg::before") {
      grassRule = rule;
    }
  }
  grass = new WorldElement(grassRule, 0, 0);
  worldObjects.push(grass);

  function lockElements() {
    let paths = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(paths);
    let left = paths.offsetLeft;
    let top = paths.offsetTop - pxToNum(styles["margin-top"]);

    paths.style.position = "absolute";
    paths.style.top = numToPx(top);
    paths.style.left = numToPx(left);
    paths.style.width = styles["max-width"];
    worldObjects.push(new WorldElement(paths, top, left))
    
    let mainLand = document.getElementsByClassName("main")[0]
    mainLand.className += " nobg"
  
    let bg = document.createElement("div")
    bg.className += " background"
    mainLand.appendChild(bg)
    background = new WorldElement(
      bg, bg.offsetTop, bg.offsetLeft
    )
    worldObjects.push(background);
  }

  lockElements();
  
  function loopBG() {
    if (Math.abs(background.x) > GRID_SIZE) {
      background.x -= GRID_SIZE * Math.sign(background.x)
    }
    if (Math.abs(background.y) > GRID_SIZE) {
      background.y -= GRID_SIZE * Math.sign(background.y)
    }
    grass.x = background.x;
  }

  function handleCamera() {
    for (let i=0; i<worldObjects.length; i++) {
      let el = worldObjects[i];
      if (inputs.left) {
        el.x += 1;
      }
      if (inputs.right) {
        el.x -= 1
      }
      if (inputs.up) {
        el.y += 1;
      }
      if (inputs.down) {
        el.y -= 1
      }
    }
  }

  // World loop
  function step() {
    handleCamera();
    loopBG();
    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); //kick off the first step!
})();