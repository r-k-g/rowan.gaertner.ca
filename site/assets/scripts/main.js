let inputs = {
  left: false, right: false,
  up: false, down: false,
  mouseX: 0, mouseY: 0,
  mouseDown: false,
  enter: false,
  interact: false
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

// Konami Code listener (works in both nav and explore mode)
(function konamiCode() {
  let sequence = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a"
  ];
  let position = 0;
  let lastKeyTime = 0;
  let activated = false;

  function spawnConfetti() {
    let colors = [
      "#ff0000", "#0066ff", "#ffdd00", "#00cc44",
      "#ff66aa", "#ff8800"
    ];
    let particles = [];
    let count = 40;

    for (let i = 0; i < count; i++) {
      let el = document.createElement("div");
      let size = 3 + Math.random() * 2;
      el.style.position = "fixed";
      el.style.top = "0px";
      el.style.left = "0px";
      el.style.width = size + "px";
      el.style.height = size + "px";
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.zIndex = "999999";
      el.style.pointerEvents = "none";
      el.style.imageRendering = "pixelated";
      document.body.appendChild(el);

      particles.push({
        el: el,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 100,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 2 + 1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.15
      });
    }

    function animateConfetti() {
      let alive = false;
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (!p.el) continue;

        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        if (p.y > window.innerHeight + 20) {
          p.el.remove();
          p.el = null;
          continue;
        }

        alive = true;
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
      }

      if (alive) {
        requestAnimationFrame(animateConfetti);
      }
    }

    requestAnimationFrame(animateConfetti);
  }

  function addSunglasses() {
    let dudes = document.getElementsByClassName("dude");
    for (let d of dudes) {
      d.classList.add("sunglasses");
    }
  }

  document.addEventListener("keydown", function(event) {
    if (activated) return;

    let now = Date.now();
    if (position > 0 && now - lastKeyTime > 2000) {
      position = 0;
    }
    lastKeyTime = now;

    if (event.key === sequence[position]) {
      position++;
      if (position === sequence.length) {
        activated = true;
        spawnConfetti();
        addSunglasses();
      }
    } else {
      position = (event.key === sequence[0]) ? 1 : 0;
    }
  });
})();


(function main() {
  let inNav = true;
  let day = true;

  let urlParams = new URLSearchParams(window.location.search);
  let exploreReturn = urlParams.has('explore');
  if (exploreReturn) {
      window.exploreReturnToGate = true;
      history.replaceState(null, '', window.location.pathname);
  }

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
      const spacing = 4
      const rowOffset = this.xRef.offsetParent.offsetLeft;
      if (this.onLeft)
        return rowOffset + this.xRef.offsetLeft + this.xRef.getBoundingClientRect().width + spacing;
      else
        return rowOffset + this.xRef.offsetLeft - spacing;
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

    constructor(animation, initialTarget) {
      this.animation = animation;
      this.aStart = animation.findRule("0%").style;
      this.aEnd = animation.findRule("100%").style;

      if (initialTarget) {
        this.#target = initialTarget;
        let goalTop = initialTarget.getY() + 8;
        let goalLeft = initialTarget.middle ? this.getMiddle() : initialTarget.getX() + (-this.width * !initialTarget.onLeft);
        this.style.left = goalLeft + "px";
        this.style.top = goalTop + "px";
      } else {
        this.style.left = this.getMiddle() + "px";
        this.style.top = this.middlePath.offsetTop + 5 + "px";
      }

      this.style.opacity = 1;
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
  signs = document.getElementsByClassName("nav-sign");
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

        case "e":
        case "E":
          inputs.interact = true;
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

        case "e":
        case "E":
          inputs.interact = false;
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

    // Hide fireflies in explore mode (they use CSS positioning that doesn't work with the camera system)
    let fireflies = document.getElementsByClassName("fireflies")[0];
    if (fireflies) fireflies.style.display = "none";

    let sheet = document.createElement("link");
    sheet.rel = "stylesheet";
    sheet.href = "/assets/css/explore-styles.css"

    sheet.onload = function() {
      let script = document.createElement("script");
      script.src = "/assets/scripts/explore.js";
      script.type = "text/javascript";
      document.getElementsByTagName("head")[0].appendChild(script);
      if (navDude) navDude.style.display = "none";
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

    if (inNav) {
      // Nav mode: darken main area and clouds
      let main = document.getElementsByClassName("main")[0];
      main.classList.toggle("dark");
      let clouds = document.getElementsByClassName("cloud");
      for (let cloud of clouds) {
        cloud.classList.toggle("dark");
      }
    } else {
      // Explore mode: darken everything via body
      document.body.classList.toggle("dark");
    }

    // Change sky background color
    let sky = document.getElementsByTagName("header")[0];
    sky.style.backgroundColor = day ? "rgb(63, 194, 255)" : "rgb(29, 38, 68)";
  }

  document.getElementsByClassName("sun")[0]
    .addEventListener("click", function(event) {
      toggleDayNight();
    });

  let mailSign = document.getElementsByClassName("mail-sign")[0];
  function toggleEmail() {
    document.getElementById("nameTitle").classList.toggle("show-email");
  }
  mailSign.addEventListener("click", toggleEmail);
  mailSign.addEventListener("keydown", function(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleEmail();
    }
  });

  // Auto-create navDude at exit sign if returning from explore
  if (exploreReturn) {
    let exitNodeRef = nodes[nodes.length - 1][0] || nodes[nodes.length - 1][1];
    navDude = new NavDude(animation, exitNodeRef);
  }

})();
