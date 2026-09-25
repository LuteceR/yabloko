<script setup lang="js">
import { ref, onMounted, computed } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

let camera, scene, renderer, arrowZ, arrowX, arrowY, 
    spriteZ, spriteY, spriteX, 
    vectorY, vectorX, vectorZ, origin
let arcZ, arcX, arcY
const canvas = ref(null);
const orientation = ref(false);

const length = 15;
const hexY = 0x00ff00; // green
const hexX = 0xff0000; // red
const hexZ = 0x0000ff; // blue

const zCoord = computed(() => {
  return orientation.value ? 1 : -1
});

onMounted(() => {
  init()
})

function createRotationArcWithArrows(radius, color, axis) {
  const group = new THREE.Group()
  
  const points = []
  const segments = 50
  
  // Создаём точки дуги от 0 до 90 градусов
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI / 2
    points.push(axis === 'z' ?
      new THREE.Vector3(
        radius * Math.sin(angle),
        radius * Math.cos(angle),
        15
      ) : axis === 'x' ?
      new THREE.Vector3(
        15,
        radius * Math.cos(angle),
        radius * Math.sin(angle)
      ) : new THREE.Vector3(
        radius * Math.cos(angle),
        15,
        radius * Math.sin(angle)
    ))
  }

  // Линия дуги
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ 
    color, 
    linewidth: 2 
  })
  const line = new THREE.Line(geometry, material)
  group.add(line)

  // Стрелка в конце дуги
  const lastPoint = points[points.length - 1]
  const prevPoint = points[points.length - 2]
  
  // Касательный вектор (направление дуги в конце)
  const direction = new THREE.Vector3()
    .subVectors(lastPoint, prevPoint)
    .normalize()

  let position = lastPoint.clone()
  let tangent = direction.clone()

  // Вращаем в зависимости от оси
  if (axis === 'x') {
    position.applyAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2)
    tangent.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
  } else if (axis === 'y') {
    position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    tangent.applyAxisAngle(new THREE.Vector3(0, -1, 0), Math.PI / 2)
  }

  const arrow = new THREE.ArrowHelper(
    tangent,   // направление касательной
    position,  // позиция на конце дуги
    2,         // длина стрелки
    color,
    0.8,       // размер головки
    0.5        // размер основания
  )
  group.add(arrow)

  return group
}

function createTextSprite(text, color) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const size = 256
  canvas.width = size
  canvas.height = size

  // Рисуем текст на canvas
  context.fillStyle = 'rgba(255, 255, 255, 0)'
  context.fillRect(0, 0, size, size)

  context.fillStyle = "#" + color.toString(16).padStart(6, '0');
  context.font = 'italic 100px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, size / 2, size / 2)

  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    sizeAttenuation: true
  })

  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(3, 3, 1)
  return sprite
}

function animate() {
  if (arrowZ) {
    const vectorZ = new THREE.Vector3(0, 0, zCoord.value)
    vectorZ.normalize()
    spriteZ.position.copy(vectorZ.clone().multiplyScalar(length + 3))
    
    // Обновляем стрелку
    arrowZ.setDirection(vectorZ)
    
    // Поворачиваем дугу в зависимости от направления
    if (zCoord.value < 0) {
      arcZ.rotation.x = Math.PI
    } else {
      arcZ.rotation.x = 0
    }
  } if (arrowY) {
    if (zCoord.value < 0) {
      arcY.rotation.z = 0
      arcY.rotation.y = 0
    } else {
      const vectorY = new THREE.Vector3(0, 1, 0)
    
      spriteY.position.copy(vectorY.clone().multiplyScalar(length + 3))
      arrowY.setDirection(vectorY)
      
      // Разворачиваем только дугу, ось Y остаётся на месте
      arcY.rotation.y = Math.PI
    }
  }

  renderer.render(scene, camera)
}

function init() {
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value, 
    antialias: true, 
    alpha: true 
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(1024, 680)
  renderer.setAnimationLoop(animate)

  // camera
  camera = new THREE.PerspectiveCamera(60, 1024 / 680, 1, 1000)
  camera.position.set(15, 20, 30)
  scene.add(camera)

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 20
  controls.maxDistance = 50
  controls.maxPolarAngle = Math.PI / 2

  vectorY = new THREE.Vector3(0, 1, 0);
  vectorX = new THREE.Vector3(1, 0, 0);
  vectorZ = new THREE.Vector3(0, 0, zCoord.value);
  origin = new THREE.Vector3(0, 0, 0);

  arrowY = new THREE.ArrowHelper(vectorY, origin, length, hexY);
  arrowX = new THREE.ArrowHelper(vectorX, origin, length, hexX);
  arrowZ = new THREE.ArrowHelper(vectorZ, origin, length, hexZ);

  scene.add(arrowY);
  scene.add(arrowX);
  scene.add(arrowZ);

  spriteX = createTextSprite('X', hexX)
  spriteX.position.copy(vectorX.clone().multiplyScalar(length + 3))
  scene.add(spriteX)

  spriteY = createTextSprite('Y', hexY)
  spriteY.position.copy(vectorY.clone().multiplyScalar(length + 3))
  scene.add(spriteY)

  spriteZ = createTextSprite('Z', hexZ)
  spriteZ.position.copy(vectorZ.clone().multiplyScalar(length + 3))
  scene.add(spriteZ)

  arcX = createRotationArcWithArrows(6, hexX, 'x')
  arcY = createRotationArcWithArrows(6, hexY, 'y')
  arcZ = createRotationArcWithArrows(6, hexZ, 'z')

  scene.add(arcX)
  scene.add(arcY)
  scene.add(arcZ)
}
</script>

<template>
  <div class="wrapper">
    <canvas ref="canvas"></canvas>
  </div>
  <div class="menu">
    <div class="group">
      <h3>Ориентация</h3>
      <div class="btn">
        <input type="checkbox" v-model="orientation" />
        <span v-if="orientation">Right-handed</span>
        <span v-if="!orientation">Left-handed</span>
      </div>
    </div>
  </div>
</template>

<style scoped> 
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: transparent;
  }
  .group {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex-direction: column;
    gap: 10px;
  }
  .btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
</style>