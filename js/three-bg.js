// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ⭐ Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;

const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2000;
}

starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0x00d4ff,
  size: 0.7,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// 🎥 Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
});

// 🔄 Animation
function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0005;

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

// 📱 Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});