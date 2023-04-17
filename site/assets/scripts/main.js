(function main() {
  
  class NavDude {
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
      this.animation = animation;
      this.aStart = animation.findRule("0%").style
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
        this.doAnimation();
      }
    }

    doAnimation() {
      this.style.top = this.state.getPropertyValue("top");
      this.style.left = this.state.getPropertyValue("left");
      
      this.clearAnimation();
      this.makeAnimation(0.8);

      this.style.animation = "dudemove 0.8s linear forwards";
    }

    clearAnimation() {
      this.style.animation = "";

      let key, toDelete = [];
      for (let rule of animation.cssRules) {
          key = rule.keyText;
          if (key != "0%" && key != "100%") {
            toDelete.push(key);
          }
      }
      toDelete.forEach((e) => (this.animation.deleteRule(e)));
    }

    makeAnimation(time) {
      // initial position
      this.aStart.top = this.style.top;
      this.aStart.left = this.style.left;

      let middle = this.getMiddle()
      let top = this.stripPX(this.style.top);
      let left = this.stripPX(this.style.left);

      // Target position
      let signOffset;
      if (this.#target[1] == "left") {
        signOffset = -(this.width + 4);
      } else {
        signOffset = this.#target[0].getBoundingClientRect().width + 4;
      }
      let goalTop = this.#target[0].offsetTop + 8;
      let goalLeft = this.#target[0].offsetLeft + signOffset;

      // Find the constant velocity
      let dtotal = Math.abs(left - middle) + Math.abs(goalLeft - middle) + Math.abs(top - goalTop);
      let velocity = dtotal / time;

      let t1 = Math.abs(left - middle) / velocity; // time at keyframe 1
      let t2 = t1 + (Math.abs(top - goalTop) / velocity); // time at keyframe 2

      let p1 = Math.round((t1 / time) * 100); // Percentage for keyframe 1
      let p2 = Math.round((t2 / time) * 100); // Percentage for keyframe 2

      // If it is 0, assume already at that position
      if (p1 != 0) {
        let stage1 = `${p1}% {top: ${this.style.top}; left: ${middle + "px"};}`;
        this.animation.appendRule(stage1)
      }

      if (p2 != 0) {
        if (p1 == p2) {
          p2++;
        }
        
        let stage2 = `${p2}% {top: ${goalTop + "px"}; left: ${middle + "px"};}`;
        this.animation.appendRule(stage2)
      }

      // Set final position
      this.aEnd.top = goalTop + "px";
      this.aEnd.left = goalLeft + "px";
    }

    stripPX(str) {
      return str.substring(0, str.length - 2);
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
    navDude.target = [target, side];
  }
  
  // Add hover listener to signs
  signs = document.getElementsByClassName("sign");
  for (let i=0; i<signs.length; i++) {
    signs[i].addEventListener("mouseover",
      (event) => {onHover(event, i);}
    );
  }
  
  // Find animation for Dude
  let animation;
  let rules =  document.styleSheets[0].cssRules;
  for (let rule of rules) {
    if (rule.name == "dudemove") {
      animation = rule;
    }
  }

  // Create Dude the first time mouse enters path area
  let navDude;
  document.getElementsByClassName("paths")[0]
    .addEventListener("mouseover",
      (event) => {
        if (navDude == undefined) {
          navDude = new NavDude(animation);
        }
      },
      {once: true}
    )

  document.addEventListener("keydown", function(event) {
    if (navDude == undefined) {
      navDude = new NavDude(animation);
    }},
    {once: true}
  )
  
  inputHeld = {left: false, right: false, up: false, down: false}  
  function watchInputs() {
    document.addEventListener("keydown", function(event) {
      let key = event.key;
      switch (key) {
        case "ArrowRight":
        case "d":
          inputHeld.right = true
          break;
      
        case "ArrowLeft":
        case "a":
          inputHeld.left = true
          break;
      
        case "ArrowUp":
        case "w":
          inputHeld.up = true
          break;
      
        case "ArrowDown":
        case "s":
          inputHeld.down = true
          break;
          
          default:
            break;
          }
        });
        
        document.addEventListener("keyup", function(event) {
          let key = event.key;
          switch (key) {
            case "ArrowRight":
            case "d":
              inputHeld.right = false
              break;
          
            case "ArrowLeft":
            case "a":
              inputHeld.left = false
              break;
          
            case "ArrowUp":
            case "w":
              inputHeld.up = false
              break;
          
            case "ArrowDown":
            case "s":
              inputHeld.down = false
              break;
      
        default:
          break;
      }
    });
  }
  watchInputs();

})();