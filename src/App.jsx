import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./App.css";
import istanbulImg from "./assets/city-istanbul.jpg";
import bucharestImg from "./assets/city-bucharest.jpg";
import belgradeImg from "./assets/city-belgrade.jpg";
import florenceImg from "./assets/city-florence.jpg";
import niceImg from "./assets/city-nice.jpg";
import valenciaImg from "./assets/city-valencia.jpg";
import ibizaImg from "./assets/city-ibiza.jpg";
import shot1 from "./assets/1.jpeg";
import shot2 from "./assets/2.jpeg";
import shot3 from "./assets/3.jpg";
import shot4 from "./assets/4.jpg";
import shot5 from "./assets/5.jpg";
import shot6 from "./assets/6.jpg";

const vibeShots = [shot1, shot2, shot3, shot4, shot5, shot6];

const cities = [
  {
    id: "istanbul",
    name: "Istanbul",
    date: "Sep 20th - 21st",
    coords: [92.5, 60.5],
    accent: "#ff492f",
    summary: "Launch grid on the Bosphorus, rolling start into Europe.",
    vibe: "night cruise • launch party • bridge visuals",
    facts: [
      "Start line energy with Istanbul skyline glow",
      "Bosphorus lit up with escort cars and media drones",
    ],
    moments: [
      "Golden-hour rollout across the Bosphorus bridge with fans lining both sides.",
      "Custom livery reveals under the Galataport cranes before the night stage.",
      "Convoy pause for drone light show above the waterfront paddock.",
    ],
    photo: istanbulImg,
  },
  {
    id: "bucharest",
    name: "Bucharest",
    date: "Sep 21st",
    coords: [84.5, 39.5],
    accent: "#ff492f",
    summary: "Neon nights and cobblestone echoes through the old town.",
    vibe: "victory arch fly-bys • old town crowds",
    facts: ["Victory Arch parade moment", "Retro metro backdrops + LED glow"],
    moments: [
      "Triumphal Arch fly-bys with LEDs synced to the engine revs.",
      "Old Town street stage with live DJ while crews handed out posters.",
      "Late-night metro garage shoot turned into an impromptu meet and greet.",
    ],
    photo: bucharestImg,
  },
  {
    id: "belgrade",
    name: "Belgrade",
    date: "Sep 22nd",
    coords: [70, 30],
    accent: "#f37f1f",
    summary: "High-speed stint across the Balkans into fortress city views.",
    vibe: "old town grid • Danube ripples • tire smoke",
    facts: [
      "Checkpoint at Kalemegdan views",
      "Fans swarming the bridge entries",
    ],
    moments: [
      "Sunset arrival over Branko’s Bridge with riverboats honking along.",
      "Kalemegdan overlook meet-up: merch pop-up and charity raffle.",
      "Night sprint along the riverfront with fireworks from the barges.",
    ],
    photo: belgradeImg,
  },
  {
    id: "florence",
    name: "Florence",
    date: "Sep 23rd",
    coords: [48, 47.5],
    accent: "#f4a300",
    summary: "Tuscan dusk, river reflection shots, V12 reverb off cathedrals.",
    vibe: "arno riverside • piazza pit stop • late blue hour",
    facts: [
      "Ponte Vecchio backdrop for the grid",
      "Streetlight glow on matte wraps",
    ],
    moments: [
      "Sunset lineup on Lungarno with cathedral bells timed to the start.",
      "Ponte Vecchio photo call with crowd-signed hood panels for charity.",
      "Midnight espresso stop turned into a rolling parade through the piazzas.",
    ],
    photo: florenceImg,
  },
  {
    id: "nice",
    name: "Nice",
    date: "Sep 24th",
    coords: [36, 37],
    accent: "#f6c344",
    summary: "Sea spray, promenade tunnel pulls, Côte d’Azur sunset.",
    vibe: "promenade burnout • yacht horns • coastal drift",
    facts: [
      "Promenade des Anglais takeover",
      "Switchback climb toward Monaco vibe",
    ],
    moments: [
      "Promenade des Anglais tunnel pulls with neon underglow reflecting off the sea.",
      "Beachfront charity auction where crews raffled ride-alongs for donations.",
      "Night climb toward the corniche with synchronized drone shots over the yachts.",
    ],
    photo: niceImg,
  },
  {
    id: "valencia",
    name: "Valencia",
    date: "Sep 25th",
    coords: [17.5, 58],
    accent: "#f8462f",
    summary: "Port-side crowds, orange haze, and sprint to the Med.",
    vibe: "city of arts run • harbor night shots",
    facts: [
      "Boxy pits near the marina",
      "Orange glow fountains as color match",
    ],
    moments: [
      "City of Arts pit lane with laser projections on the white arches.",
      "Oranges-and-smoke burnout show framed by the marina cranes.",
      "Crowds along the Turia Gardens cheering a night rollout toward the coast.",
    ],
    photo: valenciaImg,
  },
  {
    id: "ibiza",
    name: "Ibiza",
    date: "Sep 26th - Sat 27th",
    coords: [21.5, 71],
    accent: "#ffd54f",
    summary: "Finale on island time — lasers, foam, and Mediterranean finish.",
    vibe: "sunset docks • neon beach clubs",
    facts: [
      "Finish arch at the marina",
      "Afterparty lights bouncing off carbon",
    ],
    moments: [
      "Harbor finish arch with flares and confetti cannons greeting the convoy.",
      "Sunset dockside stage: live sets while teams signed gear for charity.",
      "Final parade through the marina clubs, ending in a foam-cannon sendoff.",
    ],
    photo: ibizaImg,
  },
];

const labelAboveCities = new Set(["valencia", "nice", "belgrade"]);

function App() {
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("theme") || "dark"
  );
  const [path, setPath] = useState(window.location.pathname);
  const [activeCityId, setActiveCityId] = useState(cities[0].id);
  const [cursorGlow, setCursorGlow] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [hoverCityId, setHoverCityId] = useState(null);
  const [garageError, setGarageError] = useState(null);
  const [garageLoading, setGarageLoading] = useState(true);
  const glowFrame = useRef(null);
  const garageRef = useRef(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 68 }, (_, idx) => ({
        id: idx,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1.2,
        duration: Math.random() * 14 + 12,
        delay: Math.random() * 12,
        driftX: (Math.random() - 0.5) * 16,
        driftY: (Math.random() - 0.5) * 16,
        scale: Math.random() * 0.6 + 0.8,
        opacity: Math.random() * 0.6 + 0.2,
      })),
    []
  );
  const activeCity = useMemo(
    () => cities.find((city) => city.id === activeCityId),
    [activeCityId]
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleMouseMove = (event) => {
    if (glowFrame.current) return;
    glowFrame.current = requestAnimationFrame(() => {
      setCursorGlow({ x: event.clientX, y: event.clientY });
      glowFrame.current = null;
    });
  };

  const navigate = (to) => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isMapPage = path === "/map";
  useEffect(() => {
    const container = garageRef.current;
    if (!container) return;

    setGarageError(null);
    setGarageLoading(true);

    let renderer;
    let scene;
    let camera;
    let controls;
    let frameId;
    let carModel = null;

    const cleanup = () => {
      if (frameId) cancelAnimationFrame(frameId);
      controls?.dispose();
      renderer?.dispose();
      if (
        renderer?.domElement &&
        renderer.domElement.parentElement === container
      ) {
        container.removeChild(renderer.domElement);
      }
    };

    const { clientWidth = 640, clientHeight = 400 } = container;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      100
    );
    camera.position.set(2.6, 1.6, 3.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(clientWidth, clientHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.target.set(0, 0.4, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 64),
      new THREE.MeshStandardMaterial({
        color: 0x0b0c10,
        transparent: true,
        opacity: 0.12,
      })
    );
    floor.receiveShadow = false;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.45;
    scene.add(floor);

    const loader = new GLTFLoader();
    loader.load(
      "/assets/aventador.glb",
      (gltf) => {
        carModel = gltf.scene;
        carModel.scale.set(1.05, 1.05, 1.05);
        carModel.position.set(0, -0.45, 0);
        carModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(carModel);
        setGarageLoading(false);
      },
      undefined,
      () => {
        setGarageLoading(false);
        setGarageError(
          "Could not load Aventador. Place aventador.glb in public/assets/."
        );
      }
    );

    const handleResize = () => {
      const { clientWidth: w = 640, clientHeight: h = 400 } = container;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      if (carModel) carModel.rotation.y += 0.0025;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cleanup();
    };
  }, []);

  return (
    <div className={`page theme-${theme}`} onMouseMove={handleMouseMove}>
      <div className="background-effects" aria-hidden="true">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="particle-field">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                "--driftX": `${particle.driftX}vw`,
                "--driftY": `${particle.driftY}vh`,
                "--particle-scale": particle.scale,
                "--particle-opacity": particle.opacity,
              }}
            />
          ))}
        </div>
        <div
          className="cursor-glow"
          style={{ left: `${cursorGlow.x}px`, top: `${cursorGlow.y}px` }}
        />
      </div>
      <div className="top-controls">
        <button
          className="nav-logo impact-title"
          onClick={() => navigate("/")}
          aria-label="Go to home"
        >
          Gumball 3000
        </button>
        <div className="toggle-wrap">
          <span className="tagline">Theme</span>
          <label className="toggle">
            <input
              type="checkbox"
              checked={theme === "light"}
              onChange={toggleTheme}
            />
            <span className="slider" />
            <span className="toggle-label">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </label>
        </div>
      </div>

      {!isMapPage && (
        <div className="content-shell">
          <header className="hero" id="top">
            <div className="hero-logo-wrap">
              <img
                src="/I2I.webp"
                alt="Gumball 3000 logo"
                className="hero-logo"
              />
            </div>
            <div className="hero-headline center">
              <span className="impact-title accent">GUMBALL 3000</span>
              <span className="impact-title">Experience</span>
            </div>
            <p className="hero-copy center">
              3,000 miles of moving art, music, and city takeovers. Get the
              essentials, feel the Foundation impact, then jump into the live
              map from Istanbul to Ibiza.
            </p>
            <div className="hero-actions center">
              <button className="cta primary" onClick={() => navigate("/map")}>
                Enter route explorer
              </button>
              <a
                className="cta ghost"
                href="https://grid.gumball3000foundation.org/grid/"
                target="_blank"
                rel="noreferrer"
              >
                Gumball Foundation
              </a>
            </div>
            <div className="hero-note center">
              1999 → today · culture in motion
            </div>
          </header>

          <section className="vibe-reel">
            <div className="vibe-head">
              <div className="section-label">Visual energy</div>
              <div className="section-title">Culture in motion</div>
              <p>
                A moving gallery of the rally — liveries, night shots, and
                coastline pulls stitched into one strip.
              </p>
            </div>
            <div className="reel-shell">
              <div className="reel-track">
                {[...vibeShots, ...vibeShots].map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="reel-card"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="garage-section" id="garage">
            <div className="garage-head">
              <div>
                <div className="section-label">Garage</div>
                <div className="section-title">
                  2022 Lamborghini Aventador Ultimae
                </div>
                <span className="subline">
                  Spin, zoom, and inspect the rally ready final edition
                  Aventador finished in Nero Pegaso.
                </span>
              </div>
              <div className="garage-controls">
                <span>Drag to orbit</span>
                <span>Scroll to zoom</span>
              </div>
            </div>
            <div className="garage-shell">
              <div className="garage-canvas" ref={garageRef}>
                {garageLoading && !garageError && (
                  <div className="garage-status">Loading Aventador…</div>
                )}
                {garageError && (
                  <div className="garage-status error">{garageError}</div>
                )}
              </div>
            </div>
          </section>

          <section className="story-rail" id="foundation">
            <div className="story-lead">
              <div className="section-label">The Rally</div>
              <div className="section-title">Gumball 3000, distilled</div>
              <p>
                A 3,000-mile cultural tour: supercars as moving art, music and
                nightlife at every stop, and city streets packed with fans.
                Since 1999 the route has crossed 40+ countries with 100+ teams —
                no timing, just spectacle.
              </p>
              <div className="highlight-row">
                <div className="highlight">
                  <div>Founded</div>
                  <div className="stat-figure impact-title">1999</div>
                </div>
                <div className="highlight">
                  <div>Countries</div>
                  <div className="stat-figure impact-title">40+</div>
                </div>
                <div className="highlight">
                  <div>Teams</div>
                  <div className="stat-figure impact-title">100+</div>
                </div>
              </div>
            </div>
          </section>

          <section className="story-rail story-row" id="foundation">
            <div className="story-block">
              <div className="section-label">Foundation</div>
              <div className="section-title">Youth & community impact</div>
              <p>
                The Gumball Foundation funds skate parks, creative labs, and
                sport programs in rally cities. Auctions, live art, and partner
                drops turn hype into grants.
              </p>
              <div className="highlight-row">
                <div className="highlight">
                  <div className="stat-figure impact-title">$10M+</div>
                  <div>donated to youth projects</div>
                </div>
                <div className="highlight">
                  <div className="stat-figure impact-title">20+</div>
                  <div>countries reached</div>
                </div>
                <div className="highlight">
                  <div className="stat-figure impact-title">100K+</div>
                  <div>fans at city stops yearly</div>
                </div>
              </div>
            </div>
            <div className="story-row split-two">
              <div className="story-block">
                <div className="section-label">How it runs</div>
                <p>
                  Daily legs with curated checkpoints, photo calls, and night
                  events. Ferries or shipping keep the fleet tight when
                  geography demands. Plazas and squares get ready for the
                  convoy.
                </p>
              </div>
              <div className="story-block">
                <div className="section-label">What to watch</div>
                <p>
                  Streetwear-inspired liveries, golden-hour roll-ins, impromptu
                  meetups, charity lots, and Foundation drops. No stopwatch —
                  the crowd and crews shape the moment.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {isMapPage && (
        <main className="layout" id="route">
          <section className="map-panel">
            <div className="section-head">
              <div>
                <div className="impact-title large">Istanbul → Ibiza</div>
                <p className="subline">
                  Hover to highlight, click a city to see details.
                </p>
              </div>
            </div>
            <div className="map-shell">
              <div className="map-bg" />

              {cities.map((city) => (
                <button
                  key={city.id}
                  className={`pin ${activeCityId === city.id ? "active" : ""} ${
                    hoverCityId === city.id ? "hovered" : ""
                  }`}
                  style={{
                    left: `${city.coords[0]}%`,
                    top: `${city.coords[1]}%`,
                  }}
                  onMouseEnter={() => setHoverCityId(city.id)}
                  onMouseLeave={() => setHoverCityId(null)}
                  onClick={() => setActiveCityId(city.id)}
                >
                  <span
                    className="pulse"
                    style={{ backgroundColor: city.accent }}
                  />
                  <span className="dot" style={{ borderColor: city.accent }} />
                  <span
                    className={`pin-label ${
                      labelAboveCities.has(city.id) ? "pin-label-top" : ""
                    }`}
                  >
                    <span className="impact-title tiny">{city.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="detail-panel">
            <div className="detail-header">
              <div>
                <div className="impact-title large">{activeCity?.name}</div>
                <p className="subline">{activeCity?.date}</p>
              </div>
              <div className="badge accent-pill">Gumball 3000</div>
            </div>

            <div className="detail-body">
              <div className="visual">
                <div
                  className="visual-fill"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0), rgba(0,0,0,0)), url('${activeCity?.photo}')`,
                  }}
                />
                <div className="glow-ring" />
              </div>
              <div className="copy">
                <p className="summary">{activeCity?.summary}</p>
                <div className="vibe">
                  <span className="impact-title tiny">Vibe</span>
                  <span>{activeCity?.vibe}</span>
                </div>
                <div className="memoir">
                  <div className="memoir-title">memories</div>
                  <ul className="memoir-list">
                    {activeCity?.moments?.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <ul className="fact-list">
                  {activeCity?.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="timeline">
              {cities.map((city) => (
                <button
                  key={city.id}
                  className={`timeline-card ${
                    activeCityId === city.id ? "is-active" : ""
                  } ${hoverCityId === city.id ? "is-hovered" : ""}`}
                  onMouseEnter={() => setHoverCityId(city.id)}
                  onMouseLeave={() => setHoverCityId(null)}
                  onClick={() => setActiveCityId(city.id)}
                >
                  <div className="impact-title tiny">{city.name}</div>
                  <div className="timeline-date">{city.date}</div>
                  <div
                    className="timeline-accent"
                    style={{ background: city.accent }}
                  />
                </button>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
