// import * as THREE from 'three';
// import SpriteText from 'three-spritetext';

// база для опображения
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight * 0.7);

const container = document.getElementById('canvas-container')
container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.7);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.7);
});

// викторина
const indicator = document.getElementById('indicator');
const indicatorText = document.getElementById('indicator-text');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const timer = document.getElementById('timer-display');

let countdownInterval = null;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight * 0.8), 0.1, 1000);
camera.position.x = new THREE.Vector3(0, 5, 9);
camera.lookAt(0, 0, 0);
let camAngle = 0;

// рандомизация системы координат
const isLeft = Math.floor(Math.random() * 2); // 0, 1
let vectorsDir = [1, 1, 1];
const invNum = Math.floor(Math.random() * 2) * 2 + isLeft;

for (let i = 0; i < invNum; i++) {
    const axis = Math.floor(Math.random() * 3) // 0, 1, 2
    vectorsDir[axis] = -vectorsDir[axis]
}

// обработка кнопок
function updateIndicator(pressedLeft) {
    const isCorrect = (pressedLeft == isLeft);
    indicator.style.background = isCorrect ? '#58ee53' : '#e40202';
    indicator.style.color = isCorrect ? '#000000' : '#ffffff';
    indicatorText.innerText = isCorrect ? 'Верно!' : 'Неверно!';

    if (countdownInterval !== null) return;
    let secondsLeft = 3.0;
    timer.textContent = `Перезагрузка через ${secondsLeft}...`;

    countdownInterval = setInterval(() => {
      secondsLeft -= 0.1;
      if (secondsLeft > 0) {
        timer.textContent = `Перезагрузка через ${Math.round(secondsLeft * 10) / 10}...`;
      }
    }, 100);

    setTimeout(() => {
      clearInterval(countdownInterval);
      location.reload();
    }, 3000);
}

btnLeft.addEventListener('click', () => updateIndicator(true));
btnRight.addEventListener('click', () => updateIndicator(false));

// центр координат (куб)
const geometry = new THREE.BoxGeometry().scale(0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial({ color: 0x222222 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// сетка
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// стрелки и подписи
const origin = new THREE.Vector3(0, 0, 0);

const arrowX = new THREE.ArrowHelper(new THREE.Vector3(vectorsDir[0], 0, 0), origin, 5, 0xff0000);
scene.add(arrowX);

const textX = new SpriteText('X');
textX.color = 'red';
textX.textHeight = 0.5;
textX.position.set(6 * vectorsDir[0], 0, 0);
scene.add(textX);

const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, vectorsDir[1], 0), origin, 5, 0x00ff00);
scene.add(arrowY);

const textY = new SpriteText('Y');
textY.color = 'green';
textY.textHeight = 0.5;
textY.position.set(0, 6 * vectorsDir[1], 0);
scene.add(textY);

const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, vectorsDir[2]), origin, 5, 0x0000ff);
scene.add(arrowZ);

const textZ = new SpriteText('Z');
textZ.color = 'blue';
textZ.textHeight = 0.5;
textZ.position.set(0, 0, 6 * vectorsDir[2]);
scene.add(textZ);

// анимка вращения
function animate() {
  requestAnimationFrame(animate);

  camAngle += 0.005;
  camera.position.x = Math.cos(camAngle) * 9;
  camera.position.y = 5;
  camera.position.z = Math.sin(camAngle) * 9;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

animate();
