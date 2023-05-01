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
  }

  let worldObjects = [];
  let background;

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
    
    // let title = document.getElementsByTagName("h1")[0];
    // let rect = title.getBoundingClientRect()
    // title.style.position = "absolute";
    // title.style.top = rect.top + "px";
    // title.style.left = rect.left + "px";
    // title.style.width = rect.width + "px";
    // worldObjects.push(new WorldElement(title, rect.top, rect.left))
    let mainLand = document.getElementsByClassName("main")[0]
    mainLand.className += " nobg"
  
    background = document.createElement("div")
    background.className += " background"
    mainLand.appendChild(background)
  }

  lockElements();
  

  function handleBG(x, y) {
    // CONTINUE HERE
    /** THOUGHTS
     * make background a worldelement
     * it moves normally as worldelements do
     * this function just loops it around to not go offscreen
     * (check if x/y greater than grid size, subtract/add grid size appropriately)
     */
    background.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
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
    }
  }

  // World loop
  function step() {
    handleCamera();
    handleBG
    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); //kick off the first step!
})();