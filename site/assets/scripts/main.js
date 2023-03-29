(function main() {
  
  class NavPlayer {
    element = document.getElementsByClassName("dude")[0];
    state = window.getComputedStyle(this.element);
    style = this.element.style;
    width = this.element.getBoundingClientRect().width;
    height = this.element.getBoundingClientRect().height;
    middlePath = document.getElementsByClassName("vertical")[0];
    middleWidth = this.middlePath.getBoundingClientRect().width;
    #target = [this.middlePath, "left"];

    constructor(animation) {
      this.style.left = this.getMiddle() + "px";
      this.style.top = this.middlePath.offsetTop + 5 + "px";

      this.style.opacity = 1;
      this.aStart = animation.findRule("0%").style
      this.aStage1 = animation.findRule("33%").style
      this.aStage2 = animation.findRule("67%").style
      this.aEnd = animation.findRule("100%").style
    }

    getMiddle() {
      return (
        this.middlePath.offsetLeft
        + ((this.middleWidth - this.width) / 2)
      );
    }

    set target(newTarget) {
      if (this.#target[0] !== newTarget[0]) {
        this.#target = newTarget;
        this.makeAnimation();
      }
    }

    makeAnimation() {
      this.style.top = this.state.getPropertyValue("top");
      this.style.left = this.state.getPropertyValue("left");
      this.style.animation = "";

      // initial position
      this.aStart.top = this.style.top;
      this.aStart.left = this.style.left;

      // Go to middle, same height
      this.aStage1.top = this.style.top;
      this.aStage1.left = this.getMiddle() + "px";

      // Stay in middle, go to correct height
      this.aStage2.top = this.#target[0].offsetTop + 8 + "px";
      this.aStage2.left = this.getMiddle() + "px";

      // Go to final position
      let signOffset;
      if (this.#target[1] == "left") {
        signOffset = -(this.width + 4);
      } else {
        let width = this.#target[0].getBoundingClientRect().width;
        signOffset = width + 4;
      }
      this.aEnd.top = this.#target[0].offsetTop + 8 + "px";
      this.aEnd.left = this.#target[0].offsetLeft + signOffset + "px";

      this.style.animation = "dudemove 0.8s linear forwards";
    }

  }

  function onHover(event, index) {
    // Find parent sign that was hovered
    let target = event.target;
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