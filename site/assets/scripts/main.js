let inputs = {
  left: false, right: false,
  up: false, down: false,
  mouseX: 0, mouseY: 0,
  mouseDown: false,
  enter: false
};

function pxToNum(val) {
  if (typeof(val) === "string") {
    if (val.substring(val.length-2, val.length) === "px")
      return +val.substring(0, val.length - 2);
  }
  else {
    return +val;
  }
}

function numToPx(val) {
  return val + "px";
}


(function main() {
  let inNav = true;
  let day = true;

  class NavNode {
    constructor(action=null) {
      // Adjacent nodes
      this.up = null;
      this.down = null;
      this.left = null;
      this.right = null;
      
      // The reference sign, if any
      this.xRef = null;
      this.yRef = null;
      
      this.middle = false; // flag if in middle
      this.onLeft = false; // flag if on left side
      this.action = action;
    }

    getX() {
      if (this.onLeft)
        return this.xRef.offsetLeft + this.xRef.getBoundingClientRect().width + 4;
      else
        return this.xRef.offsetLeft - 4;
    }

    getY() {
      return this.yRef.offsetParent.offsetTop;
    }
  }

  class NavDude {
    element = document.getElementsByClassName("dude")[0];
    state = window.getComputedStyle(this.element);
    style = this.element.style;
    width = this.element.getBoundingClientRect().width;
    height = this.element.getBoundingClientRect().height;
    middlePath = document.getElementsByClassName("vertical")[0];
    middleWidth = this.middlePath.getBoundingClientRect().width;
    #target = nodes[0][1];

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
      if (newTarget && this.#target !== newTarget) {
        this.#target = newTarget;
        this.doAnimation();
      }
    }

    get target() {
      return this.#target;
    }

    doAnimation() {
      this.style.top = this.state.getPropertyValue("top");
      this.style.left = this.state.getPropertyValue("left");
      
      this.clearAnimation();
      let time = this.makeAnimation();

      this.style.animation = `dudemove ${time}s linear forwards`;
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

    makeAnimation() {
      // initial position
      this.aStart.top = this.style.top;
      this.aStart.left = this.style.left;

      let middle = this.getMiddle()
      let top = pxToNum(this.style.top);
      let left = pxToNum(this.style.left);

      // Target position
      let goalTop = this.#target.getY() + 8;
      let goalLeft;
      if (this.#target.middle) {
        goalLeft = middle;
      }
      else {
        goalLeft = this.#target.getX() + (-this.width * !this.#target.onLeft)
      }

      let dtotal = Math.abs(left - middle) + Math.abs(goalLeft - middle) + Math.abs(top - goalTop);
      let velocity = 400; // pixels/s  
      let tTotal = dtotal / velocity;

      let t1 = Math.abs(left - middle) / velocity; // time at keyframe 1
      let t2 = t1 + (Math.abs(top - goalTop) / velocity); // time at keyframe 2

      let p1 = Math.round((t1 / tTotal) * 100); // Percentage for keyframe 1
      let p2 = Math.round((t2 / tTotal) * 100); // Percentage for keyframe 2

      // If it is 0, assume already at that position
      if (p1 != 0 && p1 != 100) {
        let stage1 = `${p1}% {top: ${this.style.top}; left: ${middle + "px"};}`;
        this.animation.appendRule(stage1)
      }

      if (p2 != 0 && p2 != 100) {
        if (p1 == p2) {
          p2++;
        }
        
        let stage2 = `${p2}% {top: ${goalTop + "px"}; left: ${middle + "px"};}`;
        this.animation.appendRule(stage2)
      }

      // Set final position
      this.aEnd.top = goalTop + "px";
      this.aEnd.left = goalLeft + "px";

      return tTotal;
    }
  }

  // Add hover listener to signs
  signs = document.getElementsByClassName("sign");
  let nodes = Array.from(
    {length: signs.length - 1}, () => [new NavNode(), new NavNode()]
  );
  
  let exitNode = new NavNode(startExplore)
  nodes.push(signs.length % 2 ? [null, exitNode] : [exitNode, null]);
  
  function assignNodes(i) {
    let signNode, midNode;
    let first = (i === 0);
    let last = (i === signs.length - 1);

    if (i % 2 === 0) { // Sign on left      
      signNode = nodes[i][0];
      midNode = nodes[i][1];
      
      if (signNode) {
        signNode.right = midNode;
        signNode.onLeft = true;
      }

      midNode.left = signNode;
      if (!first)
        midNode.up = nodes[i-1][0];
      if (!last)
        midNode.down = nodes[i+1][0];
    }
    
    else {
      signNode = nodes[i][1];
      midNode = nodes[i][0];

      if (signNode) {
        signNode.left = midNode;
        signNode.onLeft = false;
      }

      midNode.right = signNode;
      if (!first)
        midNode.up = nodes[i-1][1];
      if (!last)
        midNode.down = nodes[i+1][1];

    }
    
    if (signNode) {
      signNode.xRef = signs[i];
      signNode.yRef = signs[i];
    }
    midNode.middle = true;
    midNode.yRef = signs[i];
  }

  for (let i=0; i<signs.length; i++) {
    assignNodes(i);

    let targetNode = i === signs.length - 1 ? nodes[i][+!(i%2)] : nodes[i][i%2];
    signs[i].addEventListener("mouseover",
      (event) => {navDude.target = targetNode;}
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
  
  function watchInputs() {
    document.addEventListener("keydown", function(event) {
      let key = event.key;
      switch (key) {
        case "ArrowRight":
        case "d":
          inputs.right = true;
          break;
      
        case "ArrowLeft":
        case "a":
          inputs.left = true;
          break;
      
        case "ArrowUp":
        case "w":
          inputs.up = true;
          break;
      
        case "ArrowDown":
        case "s":
          inputs.down = true;
          break;
        
        case "Enter":
          inputs.enter = true;
          break;

        default:
          break;
      }

      navLoop();
    });
        
    document.addEventListener("keyup", function(event) {
      let key = event.key;
      switch (key) {
        case "ArrowRight":
        case "d":
          inputs.right = false
          break;
      
        case "ArrowLeft":
        case "a":
          inputs.left = false
          break;
      
        case "ArrowUp":
        case "w":
          inputs.up = false
          break;
      
        case "ArrowDown":
        case "s":
          inputs.down = false
          break;

        case "Enter":
          inputs.enter = false;
          break;
  
        default:
          break;
      }
      navLoop();
    });
  }
  watchInputs();

  function navLoop() {
    if (!inNav) return;

    if (inputs.right) {
      navDude.target = navDude.target.right;
    }
    if (inputs.left) {
      navDude.target = navDude.target.left;
    }
    if (inputs.up) {
      navDude.target = navDude.target.up;
    }
    if (inputs.down) {
      navDude.target = navDude.target.down;
    }
    if (inputs.enter) {
      let sign = navDude.target.xRef;
      if (sign && sign.firstElementChild.href)
        window.location.href = sign.firstElementChild.href
      else if (navDude.target.action)
        navDude.target.action();
    }
  }

  // Use of the word "G@M3" is avoided to maybe not get flagged by content blockers
  function startExplore() {
    if (!inNav) return;
    inNav = false;

    if (!day) toggleDayNight();

    let sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "/assets/css/explore-styles.css"

    sheet.onload = function() {
      let script = document.createElement("script");
      script.src = "/assets/scripts/explore.js";
      script.type = "text/javascript"; 
      document.getElementsByTagName("head")[0].appendChild(script);
      navDude.style.display = "none";
    }

    document.getElementsByTagName("head")[0].appendChild(sheet);
  }

  document.getElementsByClassName("exit")[0]
    .addEventListener("click", function(event) {
      startExplore();
    })

  function toggleDayNight() {
    day = !day;

    // Toggle image of sun
    let sun = document.getElementsByClassName("sun")[0];
    sun.classList.toggle("moon");
    
    setTimeout(() => {
      if (day) {
        sun.src = "/assets/images/funsun.png";
      } else {
        sun.src = "/assets/images/coolmoon.png";
      }
    }, 100);

    // Toggle dark filter
    let main = document.getElementsByClassName("main")[0];
    main.classList.toggle("dark");

    let clouds = document.getElementsByClassName("cloud");
    for (let cloud of clouds) {
      cloud.classList.toggle("dark");
    }

    // Change sky background color
    let sky = document.getElementsByTagName("header")[0];
    sky.style.backgroundColor = day ? "rgb(63, 194, 255)" : "rgb(29, 38, 68)"

  }
  
  document.getElementsByClassName("sun")[0]
    .addEventListener("click", function(event) {
      toggleDayNight();
    })

})();