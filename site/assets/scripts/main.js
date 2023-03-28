(function main() {
  
  class NavPlayer {
    element = document.getElementsByClassName("dude")[0];
    state = window.getComputedStyle(this.element);
    style = this.element.style
    left = this.style.left
    top = this.style.top
    width = this.element.getBoundingClientRect().width;
    height = this.element.getBoundingClientRect().height;
    middlePath = document.getElementsByClassName("vertical")[0];
    middleWidth = this.middlePath.getBoundingClientRect().width;
    #target = [this.middlePath, "left"];

    constructor(animation) {
      this.left = this.getMiddle() + "px";
      this.top = this.middlePath.offsetTop + 5 + "px";
      this.style.opacity = 1;
      this.aStart = animation.findRule("0%").style
      this.aStage1 = animation.findRule("33%").style
      this.aStage2 = animation.findRule("67%").style
      this.aEnd = animation.findRule("100%").style
    }

    set target(newTarget) {
      if (this.#target[0] !== newTarget[0]) {
        this.#target = newTarget;
        this.makeAnimation();
      }

    }

    makeAnimation() {
      this.top = this.state.getPropertyValue("top");
      this.left = this.state.getPropertyValue("left");

      // initial position
      this.aStart.top = this.top;
      this.aStart.left = this.left;

      // Go to middle, same height
      this.aStage1.top = this.top;
      this.aStage1.left = this.getMiddle();

      // Stay in middle, go to correct height
      this.aStage2.top = this.#target[0].offsetTop - 3 + "px";
      this.aStage2.left = this.getMiddle();

      // Go to final position
      this.aEnd.top = this.#target[0].offsetTop - 3 + "px";
      this.aEnd.left = this.#target[0].offsetLeft + "px";

      this.style.animation = "";
      this.style.animation = "dudemove 2s linear";
    }

    getMiddle() {
      return (
        this.middlePath.offsetLeft
        + ((this.middleWidth - this.width) / 2)
      );
    }
  }

  function onHover(event, index) {
    console.log(`YOU HOVER! ${index}???`);
    
    // Find parent sign that was hovered
    let target = event.target
    while (!target.classList.contains("sign")) {
      target = target.parentNode;
    }    

    // Which side of the sign to go to
    let side = index % 2 ? "left" : "right";
    navPlayer.target = [target, side];
  }
  
  // Add hover listener to signs
  signs = document.getElementsByClassName("sign");
  for (let i=0; i<signs.length; i++) {
    signs[i].addEventListener("mouseover",
      (event) => {onHover(event, i);}
    );
  }
  
  // Find animation for player
  let animation;
  let rules =  document.styleSheets[0].cssRules;
  for (let rule of rules) {
    if (rule.name == "dudemove") {
      animation = rule;
    }
  }

  // Create player the first time mouse enters path area
  let navPlayer;
  document.getElementsByClassName("paths")[0]
    .addEventListener("mouseover",
      (event) => {
        navPlayer = new NavPlayer(animation);
      },
      {once: true}
    )

})();