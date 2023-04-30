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
    let left = paths.offsetLeft;
    let top = paths.offsetTop - pxToNum(styles["margin-top"]);;

    paths.style.position = "absolute";
    paths.style.top = numToPx(top);
    paths.style.left = numToPx(left);
    paths.style.width = styles["max-width"];
    worldObjects.push(new WorldElement(paths, top, left))
    
    let title = document.getElementsByTagName("h1")[0];
    let rect = title.getBoundingClientRect()
    title.style.position = "absolute";
    title.style.top = rect.top + "px";
    title.style.left = rect.left + "px";
    title.style.width = rect.width + "px";
    worldObjects.push(new WorldElement(title, rect.top, rect.left))
  }

  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  // document.getElementsByClassName("main")[0].className += " active"
  lockElements();

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