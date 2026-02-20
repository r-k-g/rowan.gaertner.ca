document.addEventListener("DOMContentLoaded", function () {
  var track = document.querySelector(".carousel-track");
  var prev = document.querySelector(".carousel-prev");
  var next = document.querySelector(".carousel-next");
  if (!track || !prev || !next) return;

  var cards = Array.from(track.children);
  if (cards.length === 0) return;

  // Clone cards for circular scrolling
  cards.forEach(function (card) {
    track.appendChild(card.cloneNode(true));
  });
  cards.forEach(function (card) {
    track.insertBefore(card.cloneNode(true), track.firstChild);
  });

  // Start scrolled to the original cards (past the prepended clones)
  var cardWidth = cards[0].offsetWidth;
  var gap = parseFloat(getComputedStyle(track).gap) || 0;
  var step = cardWidth + gap;
  var offset = cards.length * step;
  track.scrollLeft = offset;

  function checkWrap() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    var totalOriginal = cards.length * step;

    if (track.scrollLeft <= gap) {
      track.scrollLeft += totalOriginal;
    } else if (track.scrollLeft >= maxScroll - gap) {
      track.scrollLeft -= totalOriginal;
    }
  }

  function scroll(direction) {
    track.scrollBy({ left: step * direction, behavior: "smooth" });
    setTimeout(checkWrap, 350);
  }

  prev.addEventListener("click", function () { scroll(-1); });
  next.addEventListener("click", function () { scroll(1); });
});
