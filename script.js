const revealElements = document.querySelectorAll(".reveal");
const stars = document.getElementById("stars");
const orbitToggle = document.getElementById("orbitToggle");
const orbits = document.querySelectorAll(".orbit");
const loadingEnter = document.querySelector(".loading-enter");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const createStars = () => {
  if (!stars) {
    return;
  }

  const starCount = window.innerWidth < 760 ? 70 : 130;

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${2.8 + Math.random() * 3.6}s`;

    const size = 1 + Math.random() * 2.8;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    stars.appendChild(star);
  }
};

createStars();

if (loadingEnter) {
  window.setTimeout(() => {
    if (document.visibilityState === "visible") {
      window.location.href = loadingEnter.href;
    }
  }, 3200);
}

if (orbitToggle) {
  let paused = false;

  orbitToggle.addEventListener("click", () => {
    paused = !paused;

    orbits.forEach((orbit) => {
      orbit.classList.toggle("is-paused", paused);
    });

    orbitToggle.textContent = paused ? "Play Orbit" : "Pause Orbit";
  });
}
