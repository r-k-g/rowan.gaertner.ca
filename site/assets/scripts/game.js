(function main() {
  console.log("Pastaman is BACK BABYYYYY");

  function lock_elements() {
    let paths = document.getElementsByClassName("paths")[0];
    let styles = getComputedStyle(paths);
    let rect = paths.getBoundingClientRect()
    paths.style.position = "absolute";
    paths.style.top = rect.top - styles["margin-top"] + "px";
    paths.style.left = rect.left + "px";
    paths.style.width = styles["max-width"];
    
    let title = document.getElementsByTagName("h1")[0];
    rect = title.getBoundingClientRect()
    title.style.position = "absolute";
    title.style.top = rect.top + "px";
    title.style.left = rect.left + "px";
    title.style.width = rect.width + "px";
  }

  lock_elements();
})();