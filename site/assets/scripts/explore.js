(function main() {
  console.log("Pastaman is BACK BABYYYYY");

  class WorldElement {
    constructor(el, worldX, worldY) {
      this.permanent = true;
      this.element = el;
      this.worldX = worldX;
      this.worldY = worldY;
      this.screenX;
      this.screenY;
    }
  }

  worldObjects = [];

  function lockElements() {
    let paths = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(paths);
    let rect = paths.getBoundingClientRect()
    paths.style.position = "absolute";
    let pTop = rect.top - pxToNum(styles["margin-top"]);
    paths.style.top = numToPx(pTop);
    paths.style.left = rect.left + "px";
    paths.style.width = styles["max-width"];
    worldObjects.push(new WorldElement(paths, pTop, rect.left))
    
    let title = document.getElementsByTagName("h1")[0];
    rect = title.getBoundingClientRect()
    title.style.position = "absolute";
    title.style.top = rect.top + "px";
    title.style.left = rect.left + "px";
    title.style.width = rect.width + "px";
    worldObjects.push(new WorldElement(title, rect.top, rect.left))
  }
  lockElements();
  document.getElementsByClassName("main")[0].className += " active"

  function handleCamera() {
    if (inputs.left) {
      // pasta man eats pasta here
    }
    if (inputs.right) {
       // masta pan meats hasta pere
    }
  }

  // World loop
  function step() {
    handleCamera();
    window.requestAnimationFrame(() => {
      step();
    })
  }
  step(); //kick off the first step!
})();