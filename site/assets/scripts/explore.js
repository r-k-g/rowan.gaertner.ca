PIXEL_SIZE = 2;
GRID_SIZE = (16) * PIXEL_SIZE;

(function main() {
  class WorldElement {
    #x;
    #y;
    constructor(el, worldX, worldY, collision=false, useZ=true, moving=false) {
      this.permanent = true;
      this.el = el;
      this.worldX = worldX;
      this.worldY = worldY;

      this.moving = moving;

      this.el.style.transform = "translate3d(0, 0, 0px)";
      this.x = worldX;
      this.y = worldY;

      try {
        this.rect = this.el.getBoundingClientRect();
        this.width = this.rect.width;
        this.height = this.rect.height;
      } catch (error) {}

      if (collision)
        collisionObjects.push(this);

      this.useZ = useZ
      if (useZ)
        this.el.style.zIndex = yToZ(worldY, this.height);

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

      if (this.moving && this.useZ) {
        this.z = yToZ(this.worldY, this.height);
        this.el.style.zIndex = this.z;
      }
    }
  }

  class InteractableObject extends WorldElement {
    constructor(el, worldX, worldY, options={}) {
      super(el, worldX, worldY, options.collision || false, true, false);
      this.interactionRange = options.range || 60;
      this.onInteract = options.onInteract || function() {};
      this.hintText = options.hint || "[E]";
      this.isNearby = false;
      this.useGlow = options.glow || false;

      // Create hint element
      this.hintEl = document.createElement("div");
      this.hintEl.className = "interact-hint";
      this.hintEl.textContent = this.hintText;
      document.body.appendChild(this.hintEl);

      interactableObjects.push(this);
    }

    checkProximity(dude) {
      let dx = (this.worldX + (this.width / 2)) - (dude.worldX + (dude.width / 2));
      let dy = (this.worldY + (this.height / 2)) - (dude.worldY + (dude.height / 2));
      let dist = Math.sqrt(dx * dx + dy * dy);
      return dist < this.interactionRange;
    }

    setNearby(nearby) {
      if (nearby && !this.isNearby) {
        this.isNearby = true;
        if (this.useGlow) this.el.classList.add("interactable-glow");
        this.hintEl.classList.add("visible");
      } else if (!nearby && this.isNearby) {
        this.isNearby = false;
        if (this.useGlow) this.el.classList.remove("interactable-glow");
        this.hintEl.classList.remove("visible");
      }
    }

    updateHintPosition(camera) {
      if (!this.isNearby) return;
      let screenX = camera.width + (this.worldX - camera.worldX) + (this.width / 2);
      let screenY = camera.height + (this.worldY - camera.worldY) - 14;
      this.hintEl.style.transform = `translate(${screenX}px, ${screenY}px)`;
    }
  }

  class ExploreDude extends WorldElement {
    constructor(el, worldX, worldY) {
      super(el, worldX, worldY, false, true, true);

      this.accel = 4;
      this.velX = 0;
      this.velY = 0;
      this.drag = 0.13;

      this.x = worldX;
      this.y = worldY;
    }
  }

  function addStaticObj(image, x, y, width, height) {
    let el = new Image(width, height);
    document.body.appendChild(el);
    el.style.position = "absolute";
    el.src = image;

    let obj = new WorldElement(el, x, y)
    worldObjects.push(obj);

    return obj;
  }

  function addInteractable(x, y, options) {
    let el = document.createElement("div");
    el.className = options.className || "interactable";
    if (options.innerHTML) el.innerHTML = options.innerHTML;
    if (options.style) Object.assign(el.style, options.style);
    document.body.appendChild(el);

    let obj = new InteractableObject(el, x, y, options);
    worldObjects.push(obj);
    return obj;
  }

  function showMessage(text) {
    let existing = document.querySelector(".explore-message");
    if (existing) existing.remove();

    let msg = document.createElement("div");
    msg.className = "explore-message";
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
      msg.style.opacity = "0";
      setTimeout(() => msg.remove(), 1000);
    }, 3000);
  }

  function addDirtTile(x, y) {
    let el = new Image(32, 32);
    el.src = "/assets/images/dirt.png";
    el.style.zIndex = "-1";
    addDecoration(el, x, y);
  }

  function addDirtPath(startX, startY, endX, endY, width) {
    let dx = endX - startX;
    let dy = endY - startY;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let steps = Math.ceil(dist / 22);

    for (let i = 0; i <= steps; i++) {
      let t = i / steps;
      let x = startX + dx * t;
      let y = startY + dy * t;
      for (let w = 0; w < width; w++) {
        let perpX = -dy / dist * (w - width / 2) * 32;
        let perpY = dx / dist * (w - width / 2) * 32;
        addDirtTile(x + perpX, y + perpY);
      }
    }
  }

  function makePond() {
    let tilesWide = 5;
    let tilesTall = 3;
    let tileSize = 32;
    let pondWidth = tilesWide * tileSize;
    let pondHeight = tilesTall * tileSize;
    let startX = -200 - pondWidth / 2;
    let startY = 550 - pondHeight / 2;

    for (let tx = 0; tx < tilesWide; tx++) {
      for (let ty = 0; ty < tilesTall; ty++) {
        let el = new Image(tileSize, tileSize);
        el.src = "/assets/images/water.png";
        addDecoration(el, startX + tx * tileSize, startY + ty * tileSize);
      }
    }

    // Collision hitbox — matches tile rectangle exactly
    let hitbox = document.createElement("div");
    hitbox.style.position = "absolute";
    hitbox.style.width = pondWidth + "px";
    hitbox.style.height = pondHeight + "px";
    document.body.appendChild(hitbox);

    let pondCollision = new WorldElement(hitbox, startX, startY, true, false);
    worldObjects.push(pondCollision);

    // Interactable — matches tile rectangle exactly
    let interactHitbox = document.createElement("div");
    interactHitbox.style.position = "absolute";
    interactHitbox.style.width = pondWidth + "px";
    interactHitbox.style.height = pondHeight + "px";
    document.body.appendChild(interactHitbox);

    let pondInteractable = new InteractableObject(
      interactHitbox, startX, startY, {
        range: 80,
        hint: "[E] Look",
        onInteract: function() {
          showMessage("A quiet pond. You see something moving below the surface...");
        }
      }
    );
    worldObjects.push(pondInteractable);
  }

  function makeMysterySign(x, y) {
    let el = document.createElement("div");
    el.className = "sign";
    el.textContent = "\u13A0\u13B3\u13A2\u13C4";
    el.style.fontSize = "7px";
    el.style.padding = "5px 7px";
    el.style.position = "absolute";
    el.style.bottom = "auto";
    el.style.top = "0px";
    el.style.left = "0px";
    el.style.contain = "none";
    el.style.cursor = "default";
    document.body.appendChild(el);

    let obj = new InteractableObject(el, x, y, {
      range: 55,
      hint: "[E] Read",
      glow: true,
      onInteract: function() {
        showMessage("Update coming soon...");
      }
    });
    worldObjects.push(obj);
    return obj;
  }

  function addBush(x, y) {
    let el = document.createElement("div");
    el.style.width = "24px";
    el.style.height = "18px";
    el.style.backgroundColor = "rgb(45, 110, 40)";
    el.style.position = "absolute";
    el.style.imageRendering = "pixelated";
    document.body.appendChild(el);

    let obj = new WorldElement(el, x, y, false, true);
    worldObjects.push(obj);
    return obj;
  }

  function addRock(x, y) {
    let el = document.createElement("div");
    el.style.width = "16px";
    el.style.height = "12px";
    el.style.backgroundColor = "rgb(140, 140, 140)";
    el.style.position = "absolute";
    document.body.appendChild(el);

    let obj = new WorldElement(el, x, y, false, true);
    worldObjects.push(obj);
    return obj;
  }

  function addDecoration(el, worldX, worldY) {
    el.style.position = "absolute";
    pendingDecorations.push({el, worldX, worldY});
  }

  function addFlower(x, y) {
    let el = new Image(32, 32);
    el.src = "/assets/images/flower.png";
    addDecoration(el, x, y);
  }

  function chunkDecorations(chunkSize) {
    let chunks = {};

    for (let i = 0; i < pendingDecorations.length; i++) {
      let dec = pendingDecorations[i];
      let cx = Math.floor(dec.worldX / chunkSize) * chunkSize;
      let cy = Math.floor(dec.worldY / chunkSize) * chunkSize;
      let key = cx + "," + cy;
      if (!chunks[key]) chunks[key] = {x: cx, y: cy, items: []};
      chunks[key].items.push(dec);
    }

    for (let key in chunks) {
      let chunk = chunks[key];
      let container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "0px";
      container.style.left = "0px";
      container.style.width = (chunkSize + 48) + "px";
      container.style.height = (chunkSize + 48) + "px";

      for (let i = 0; i < chunk.items.length; i++) {
        let item = chunk.items[i];
        item.el.style.left = (item.worldX - chunk.x) + "px";
        item.el.style.top = (item.worldY - chunk.y) + "px";
        container.appendChild(item.el);
      }

      document.body.appendChild(container);
      let worldEl = new WorldElement(container, chunk.x, chunk.y, false, false);
      worldObjects.push(worldEl);
    }

    pendingDecorations = [];
  }

  let worldObjects = [];
  let collisionObjects = [];
  let interactableObjects = [];
  let pendingDecorations = [];

  ///----- SETUP -----\\\
  function loadNav() {
    let nav = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(nav);
    document.body.appendChild(nav)

    nav.style.position = "absolute";
    nav.style.margin = "0px";
    nav.style.width = styles["max-width"];
    nav.style.top = "0px";
    nav.style.left = "0px";

    let left = 0; //camera.width - (pxToNum(styles["max-width"]) / 2);
    let top = headerHeight + 68;

    let navObj = new WorldElement(nav, left, top, true, true)
    worldObjects.push(navObj);
    return navObj;
  }

  function makeBG(mainDiv) {
    mainDiv.className += " nobg";

    let bg = document.createElement("div");
    bg.className += " background";

    document.body.appendChild(bg);

    let background = new WorldElement(
      bg, bg.offsetTop, bg.offsetLeft, false, false
    );
    worldObjects.push(background);
    return background;
  }

  function touchGrass() {
    let grassRule;
    let rules = document.styleSheets[document.styleSheets.length - 1].cssRules;
    for (let rule of rules) {
      if (rule.selectorText === ".main.nobg::before") {
        grassRule = rule;
        break;
      }
    }
    let grass = new WorldElement(grassRule, 0, 0, false, false);
    return grass;
  }

  function loadHeader() {
    let headerEl = document.getElementsByTagName("header")[0];
    let headerStyle = getComputedStyle(headerEl);
    let headerHeight = (
      pxToNum(headerStyle["height"])
      + pxToNum(headerStyle["padding-top"])
      + pxToNum(headerStyle["padding-bottom"])
    );

    let headerObj = new WorldElement(headerEl, 0, 0, false, false);
    worldObjects.push(headerObj);

    return [headerObj, headerHeight]
  }

  function loadTopRow() {
    let contacts = document.getElementsByClassName("contacts")[0];
    let styles = getComputedStyle(contacts);
    document.body.appendChild(contacts);

    contacts.style.position = "absolute";
    contacts.style.margin = "0px";
    contacts.style.width = styles["max-width"];
    contacts.style.top = "0px";
    contacts.style.left = "0px";

    let left = nav.width + 48
    let top = headerHeight;
    let contactsObj = new WorldElement(contacts, left, top, false, true);
    worldObjects.push(contactsObj);

    let info = document.getElementsByClassName("info")[0];
    styles = getComputedStyle(info);
    document.body.appendChild(info);

    info.style.position = "absolute";
    info.style.margin = "0px";
    info.style.width = styles["max-width"];
    info.style.top = "0px";
    info.style.left = "0px";


    left = nav.x - 300;
    top = headerHeight;
    let infoObj = new WorldElement(info, left, top, false, true);
    worldObjects.push(infoObj);
  }

  function loadMain() {
    let mainEl = document.getElementsByClassName("main")[0];
    let mainObj = new WorldElement(mainEl, 0, headerHeight, false, false);
    worldObjects.push(mainObj);
    return [mainObj, mainEl];
  }

  function makeDude() {
    let navRect = nav.el.getBoundingClientRect();
    let dudeEl = document.createElement("div");
    dudeEl.className += " dude";
    let dudeWidth = 20;
    let left, top;

    if (window.exploreReturnToGate) {
      // Position at exit gate (bottom of nav)
      left = navRect.left + (navRect.width / 2) - (dudeWidth / 2);
      top = navRect.bottom + 35;
      dudeEl.style.opacity = 1; // Immediately visible
      window.exploreReturnToGate = false;
    } else {
      left = navRect.left + (navRect.width / 2) - (dudeWidth / 2);
      top = navRect.bottom + 15;
      setTimeout(function(el) { dudeEl.style.opacity = 1; }, 70, dudeEl);
    }

    document.body.appendChild(dudeEl);
    return new ExploreDude(dudeEl, left, top);
  }

  function makeExitInteractable() {
    let exitEl = document.getElementsByClassName("exit")[0];
    if (!exitEl) return;

    // Get position relative to nav
    let gateX = nav.worldX + exitEl.offsetLeft;
    let gateY = nav.worldY + exitEl.offsetTop + exitEl.offsetParent.offsetTop;

    // Create an invisible interactable positioned over the gate
    let hitbox = document.createElement("div");
    hitbox.style.position = "absolute";
    hitbox.style.width = "48px";
    hitbox.style.height = "36px";
    hitbox.style.cursor = "pointer";
    document.body.appendChild(hitbox);

    let obj = new InteractableObject(hitbox, gateX, gateY, {
      range: 70,
      hint: "[E] Return",
      glow: true,
      onInteract: function() {
        window.location.href = '/?explore=return';
      }
    });
    worldObjects.push(obj);
  }

  function populateWorld() {
    // Dirt paths connecting areas of interest
    addDirtPath(250, 450, 250, 700, 2);   // Main path going south
    addDirtPath(250, 550, 500, 400, 2);   // Branch east toward trees
    addDirtPath(250, 600, 0, 650, 2);     // Short path going west

    let xoff = 0
    for (let y=105; y<210; y+=18) {
      for (let x=-140; x<20; x+=40) {
        addFlower(x + xoff, y);
      }
      if (xoff)
        xoff = 0;
      else
        xoff = 15;
    }

    for (let y=480; y<540; y+=14) {
      for (let x=-50; x<60; x+=35) {
        addFlower(x + xoff, y);
      }
      if (xoff)
        xoff = 0;
      else
        xoff = 15;
    }

    xoff=0
    for (let y=350; y<430; y+=35) {
      addStaticObj("/assets/images/maybtree.png", 550 + xoff, y, 40, 48);
      if (xoff)
        xoff = 0;
      else
        xoff = 15;
    }

    // Additional trees in different areas
    addStaticObj("/assets/images/maybtree.png", -350, 380, 40, 48);
    addStaticObj("/assets/images/maybtree.png", -370, 440, 40, 48);
    addStaticObj("/assets/images/maybtree.png", 400, 650, 40, 48);
    addStaticObj("/assets/images/maybtree.png", 420, 720, 40, 48);
    addStaticObj("/assets/images/maybtree.png", -100, 750, 40, 48);

    // Bushes scattered around
    addBush(100, 500);
    addBush(350, 380);
    addBush(-80, 620);
    addBush(480, 550);
    addBush(200, 700);
    addBush(-300, 480);
    addBush(50, 350);

    // Rocks near the pond and paths
    addRock(-150, 620);
    addRock(-380, 450);
    addRock(-50, 430);
    addRock(350, 750);
    addRock(150, 780);

    // Flowers near the pond
    addFlower(-290, 490);
    addFlower(-130, 610);
    addFlower(-260, 620);
    addFlower(-100, 500);
  }

  // not currently used
  function getZMax() {
    let fullHeight = cameraBounds.bottom - cameraBounds.top;
    return Math.floor(fullHeight) * 5
  }


  ///----- MECHANICS -----\\\
  document.addEventListener("mousemove", function(event) {
    inputs.mouseX = event.clientX;
    inputs.mouseY = event.clientY;
    inputs.mouseDown = Boolean(event.buttons % 2);
  });

  document.addEventListener("mousedown", function(event) {
    inputs.mouseDown = true;
  });

  document.addEventListener("mouseup", function(event) {
    inputs.mouseDown = false;
  });

  function checkInteractions() {
    for (let i = 0; i < interactableObjects.length; i++) {
      let obj = interactableObjects[i];
      let nearby = obj.checkProximity(dude);
      obj.setNearby(nearby);
      obj.updateHintPosition(camera);

      if (nearby && inputs.interact) {
        obj.onInteract();
        inputs.interact = false;
      }
    }
  }

  function doMovement() {
    let dx = 0;
    let dy = 0;
    let mouse = false;

    if (inputs.left)  dx += -1;
    if (inputs.right) dx += 1;
    if (inputs.up)    dy += -1;
    if (inputs.down)  dy += 1;

    if (!(inputs.left || inputs.right || inputs.up || inputs.down)) {
      if (inputs.mouseDown) {
        dx = inputs.mouseX - (
          dude.worldX - camera.worldX + (camera.width)
        );
        dy = inputs.mouseY - (
          dude.worldY - camera.worldY + (camera.height)
        );
        mouse = true;
      }
    }

    moveDude(dx, dy, mouse);
    moveCamera();
    checkInteractions();
  }

  function moveDude(dx, dy, mouse) {
    let accelX = 0;
    let accelY = 0;

    if (dx || dy) {
      let hypot = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if (mouse && hypot < 50) {
        dx = dy = 0;
      }
      accelX = (dx / hypot) * dude.accel;
      accelY = (dy / hypot) * dude.accel;
    }

    let dragX = dude.drag * Math.pow(dude.velX, 2) * -Math.sign(dude.velX);
    let dragY = dude.drag * Math.pow(dude.velY, 2) * -Math.sign(dude.velY);

    dude.velX += accelX + dragX;
    dude.velY += accelY + dragY;

    if (Math.abs(dude.velX) < 0.2) dude.velX = 0;
    if (Math.abs(dude.velY) < 0.2) dude.velY = 0;

    // Update map position
    dude.worldX += dude.velX;
    dude.worldY += dude.velY;

    doCollision();
  }

  function doCollision() {
    if (dude.worldY < cameraBounds.top + headerHeight - 25)
      dude.worldY = cameraBounds.top + headerHeight - 25;
    if (dude.worldY + dude.height > cameraBounds.bottom)
      dude.worldY = cameraBounds.bottom - dude.height;
    if (dude.worldX < cameraBounds.left)
      dude.worldX = cameraBounds.left;
    if (dude.worldX + dude.width > cameraBounds.right)
      dude.worldX = cameraBounds.right - dude.width;

    for (let i=0; i<collisionObjects.length; i++) {
      let el = collisionObjects[i];

      dude.worldY -= dude.velY;
      let colliding = checkIntersect(
        dude.worldX, dude.worldY + 25,
        dude.width, dude.height - 25,
        el.worldX, el.worldY,
        el.width, el.height
      )

      if (colliding) {
        dude.worldX = dude.velX > 0 ? el.worldX - dude.width - 2 : el.worldX + el.width + 2;
        dude.velX = 0;
      }

      dude.worldY += dude.velY;
      colliding = checkIntersect(
        dude.worldX, dude.worldY + 25,
        dude.width, dude.height - 25,
        el.worldX, el.worldY,
        el.width, el.height
      )

      if (colliding) {
        dude.worldY = dude.velY > 0 ? el.worldY - dude.height - 2 : el.worldY + el.height - 23;
        dude.velY = 0;
      }
    }
  }

  function checkIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (x1 > x2 + w2 || x1 + w1 < x2 || y1 > y2 + h2 || y1 + h1 < y2)
      return false;
    return true;
  }

  function moveCamera() {
    camera.worldX += (dude.worldX - camera.worldX) / camera.delay;
    camera.worldY += (dude.worldY - camera.worldY) / camera.delay;

    if (camera.worldX + camera.width > cameraBounds.right)
      camera.worldX = cameraBounds.right - camera.width;

    if (camera.worldX - camera.width < cameraBounds.left)
      camera.worldX = cameraBounds.left + camera.width;

    if (camera.worldY - camera.height < cameraBounds.top)
      camera.worldY = cameraBounds.top + camera.height;

    if (camera.worldY + camera.height > cameraBounds.bottom)
      camera.worldY = cameraBounds.bottom - camera.height;


    camera.worldX = Math.max(
      Math.min(camera.worldX, cameraBounds.right),
      cameraBounds.left
    );

    camera.worldY = Math.max(
      Math.min(camera.worldY, cameraBounds.bottom),
      cameraBounds.top
    );

    background.worldX = camera.worldX - camera.width - camera.worldX%GRID_SIZE;
    background.worldY = camera.worldY - camera.height - camera.worldY%GRID_SIZE;

    updateObjects();
    grass.x = background.x;
    grass.y = 0;

    headerObj.x = 0;
    mainObj.x = 0;
  }

  function updateObjects() {
    let xdiff, ydiff, xOOB, yOOB;

    for (let i=0; i<worldObjects.length; i++) {
      let obj = worldObjects[i];
      xdiff = obj.worldX - camera.worldX;
      ydiff = obj.worldY - camera.worldY;

      // Don't move objects if offscreen
      if (camera.loaded) {
        xOOB = Math.abs(xdiff) > camera.width + 50 + obj.width;
        yOOB = Math.abs(ydiff) > camera.height + 50 + obj.height;
        if (xOOB || yOOB)
          continue;
      }

      obj.x = camera.width + (xdiff);
      obj.y = camera.height + (ydiff);
    }
  }

  function updateCamera() {
    camera.width = window.innerWidth / 2;
    camera.height = window.innerHeight / 2;
    if (camera.delay > 20) {
      camera.delay -= 1;
      if (camera.delay < 30)
        camera.loaded = true;
    }
  }

  function yToZ(y, h) {
    return Math.floor((y + h) * 5)
  }

  ///----- DRIVER CODE -----\\\
  // Set up camera
  let camera = {
    worldX: 0, worldY:  0,
    width:  0, height:  0,
    delay: 20, loaded: false
  };
  let cameraBounds = {
    top: 0, bottom: 2200, right: 1800, left: -700
  };

  updateCamera();

  // Get and set up important components
  let [headerObj, headerHeight] = loadHeader();
  let [mainObj, mainEl] = loadMain();
  let nav = loadNav();
  loadTopRow();
  let background = makeBG(mainEl);
  let grass = touchGrass();
  let dude = makeDude(mainEl);
  worldObjects.push(dude);

  // Add exit interactable
  makeExitInteractable();

  // Add decorative objects and dirt paths
  populateWorld();

  // Pond with water tiles and interaction
  makePond();

  // Group ground-level decorations (dirt, flowers, water) into spatial chunks
  chunkDecorations(400);

  // Mystery sign near the path
  makeMysterySign(320, 580);

  // Transfer dark mode from .main to body for explore mode
  let mainSyncEl = document.getElementsByClassName("main")[0];
  if (mainSyncEl.classList.contains("dark")) {
    mainSyncEl.classList.remove("dark");
    document.body.classList.add("dark");
    let clouds = document.getElementsByClassName("cloud");
    for (let cloud of clouds) { cloud.classList.remove("dark"); }
  }

  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";

  const FPS = 60;
  let fpsInterval = 1000 / FPS;
  let lastTime = 0;
  let elapsed;

  // The explore mode loop
  function step(timeStamp) {
    elapsed = timeStamp - lastTime;

    window.requestAnimationFrame(step);

    if (elapsed > fpsInterval) {
      lastTime = timeStamp - (elapsed % fpsInterval);
      updateCamera();
      doMovement();
    }
  }

  // Start the loop after a pause
  setTimeout(step, 500, window.performance.now());

  // Initial camera position
  camera.worldX = nav.width / 2;
  camera.worldY = camera.height;
  doMovement();

  // Ease in camera movement
  camera.delay = 60;
})();
