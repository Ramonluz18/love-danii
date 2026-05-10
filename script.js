document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', function (event) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Interatividade 3D para o casal
const couple3d = document.querySelector('.couple-3d');
if (couple3d) {
  couple3d.addEventListener('click', function () {
    this.classList.toggle('rotate');
  });
}

// Interação com corações
const hearts = document.querySelectorAll('.hero__floating-hearts span');
hearts.forEach(heart => {
  heart.addEventListener('click', function () {
    this.style.transform += ' scale(1.5)';
    setTimeout(() => {
      this.style.transform = this.style.transform.replace(' scale(1.5)', '');
    }, 500);
  });
});

// Efeitos 3D no botão "Te Amo"
const btnLove = document.querySelector('.btn-love');
const messageDiv = document.getElementById('message');
let isAnimating = false;

function typeWriter(text, element, speed = 30) {
  element.textContent = '';
  element.classList.add('show');
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        element.classList.remove('show');
      }, 5000);
    }
  }, speed);
}

btnLove.addEventListener('click', function () {
  console.log('Te Amo clicked');
  if (isAnimating) return;
  isAnimating = true;
  // Feedback visual no botão
  btnLove.textContent = 'Amo Você Também!';
  btnLove.style.background = 'linear-gradient(135deg, #ff1493, #ff69b4)';
  setTimeout(() => {
    btnLove.textContent = 'Te Amo';
    btnLove.style.background = 'linear-gradient(135deg, #ff6ba3, #ff1493)';
  }, 3000);

  // Animação de texto
  const text = 'Também te amo,\nse você deixar eu te farei feliz\ne te farei esquecer tudo de ruim que você passou';
  typeWriter(text, messageDiv);

  // Animação da câmera 3D
  const originalZ = camera.position.z;
  const targetZ = originalZ - 5; // Mais zoom
  const duration = 1000;
  const startTime = Date.now();
  function animateCamera() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    camera.position.z = originalZ - (originalZ - targetZ) * progress;
    if (progress < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      // Voltar
      setTimeout(() => {
        const startTime2 = Date.now();
        function animateBack() {
          const elapsed2 = Date.now() - startTime2;
          const progress2 = Math.min(elapsed2 / duration, 1);
          camera.position.z = targetZ + (originalZ - targetZ) * progress2;
          if (progress2 < 1) {
            requestAnimationFrame(animateBack);
          } else {
            isAnimating = false;
          }
        }
        animateBack();
      }, 2000);
    }
  }
  animateCamera();

  // Pulsar o coração 3D
  heart.scale.set(1, 1, 1);
  setTimeout(() => {
    heart.scale.set(2, 2, 2); // Maior pulso
    heart.material.emissive.setHex(0xff0000); // Vermelho brilhante
    setTimeout(() => {
      heart.scale.set(1, 1, 1);
      heart.material.emissive.setHex(0xff1493);
    }, 500);
  }, 250);
});

// Parallax
document.addEventListener('mousemove', function (e) {
  const hero = document.querySelector('.hero');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  hero.style.transform = `translate(${x}px, ${y}px)`;
});

// Cena 3D com Three.js
/*
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Fundo espacial romântico
// const spaceTexture = new THREE.CubeTextureLoader().load([
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/px.jpg', // substitua por texturas espaciais
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nx.jpg',
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/py.jpg',
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/ny.jpg',
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/pz.jpg',
//   'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/nz.jpg'
// ]);
// scene.background = spaceTexture;

// Partículas volumétricas (estrelas/corpoes)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0xff6ba3, size: 0.5 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Objeto flutuante (coração 3D simples)
const heartGeometry = new THREE.TorusGeometry(1, 0.5, 16, 100);
const heartMaterial = new THREE.MeshStandardMaterial({ color: 0xff1493, emissive: 0xff1493, emissiveIntensity: 0.2 });
const heart = new THREE.Mesh(heartGeometry, heartMaterial);
scene.add(heart);

// Luzes
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xff6ba3, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Câmera cinematográfica
camera.position.set(0, 0, 5);

// Post-processing para bloom
// const composer = new THREE.EffectComposer(renderer);
// const renderPass = new THREE.RenderPass(scene, camera);
// composer.addPass(renderPass);
// const bloomPass = new THREE.BloomPass(1.5, 25, 4, 256);
// composer.addPass(bloomPass);
// const copyPass = new THREE.ShaderPass(THREE.CopyShader);
// copyPass.renderToScreen = true;
// composer.addPass(copyPass);

// Animação
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.x += 0.001;
  particles.rotation.y += 0.001;
  heart.rotation.x += 0.01;
  heart.rotation.y += 0.01;
  heart.position.y = Math.sin(Date.now() * 0.001) * 0.5;
  renderer.render(scene, camera); // Usar renderer direto
}
animate();

// Responsivo
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // composer.setSize(window.innerWidth, window.innerHeight);
});
*/
