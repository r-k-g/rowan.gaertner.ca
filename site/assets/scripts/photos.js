let currentIndex = -1;

function getGalleryImages() {
  return Array.from(document.querySelectorAll(".gallery img"));
}

function openImage(src) {
  let newSrc = src.split("/");
  newSrc.splice(newSrc.length - 1, 0, "large");
  let name = newSrc.slice(newSrc.length-1)
  newSrc = newSrc.join("/");

  let overlay = document.getElementsByClassName("overlayBG")[0];
  overlay.innerHTML = `<img class="overlayImg" src="${newSrc}" alt="${name}">`;
  overlay.style.display = "flex"

  // Track which photo is open
  let images = getGalleryImages();
  currentIndex = images.findIndex(img => img.src === src || img.getAttribute("src") === src.replace(location.origin, ""));
  if (currentIndex === -1) {
    // Fallback: try matching by filename
    let filename = src.split("/").pop();
    currentIndex = images.findIndex(img => img.src.includes(filename));
  }

  addArrows(overlay);
}

function navigatePhoto(direction) {
  let images = getGalleryImages();
  if (images.length === 0) return;

  currentIndex = (currentIndex + direction + images.length) % images.length;
  let img = images[currentIndex];
  openImage(img.src);
}

function addArrows(overlay) {
  // Remove existing arrows first
  overlay.querySelectorAll(".overlay-arrow").forEach(el => el.remove());

  let leftArrow = document.createElement("div");
  leftArrow.className = "overlay-arrow overlay-arrow-left";
  leftArrow.textContent = "\u25C0";
  leftArrow.addEventListener("click", function(e) {
    e.stopPropagation();
    navigatePhoto(-1);
  });

  let rightArrow = document.createElement("div");
  rightArrow.className = "overlay-arrow overlay-arrow-right";
  rightArrow.textContent = "\u25B6";
  rightArrow.addEventListener("click", function(e) {
    e.stopPropagation();
    navigatePhoto(1);
  });

  overlay.appendChild(leftArrow);
  overlay.appendChild(rightArrow);
}

(function main() {
  let overlay = document.createElement("div")
  overlay.classList.add("overlayBG");
  document.getElementsByTagName("body")[0].appendChild(overlay);
  overlay.style.display = "none";

  document.addEventListener("keydown", function(event) {
    if (overlay.style.display !== "none") {
      if (event.key === "Escape") {
        overlay.style.display = "none";
      } else if (event.key === "ArrowLeft") {
        navigatePhoto(-1);
      } else if (event.key === "ArrowRight") {
        navigatePhoto(1);
      }
    }
  });

  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });
})()
