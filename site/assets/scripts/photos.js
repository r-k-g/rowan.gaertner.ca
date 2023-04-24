function openImage(src) {
  let newSrc = src.split("/");
  newSrc.splice(newSrc.length - 1, 0, "large");
  let name = newSrc.slice(newSrc.length-1)
  newSrc = newSrc.join("/");

  let overlay = document.getElementsByClassName("overlayBG")[0];
  overlay.innerHTML = `<img class="overlayImg" src="${newSrc}" alt="${name}">`;
  overlay.style.display = "flex"
}

(function main() {
  let overlay = document.createElement("div")
  overlay.classList.add("overlayBG");
  document.getElementsByTagName("body")[0].appendChild(overlay);
  overlay.style.display = "none";
  
  document.addEventListener("keydown", function(event) {
    if (overlay.style.display !== "none") {
      console.log(event.key);
      if (event.key === "Escape") {
        overlay.style.display = "none";
      }
    }
  });

  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });
})()
