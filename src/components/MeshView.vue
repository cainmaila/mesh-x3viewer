<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { decodeTriangleMesh, buildTriangleMeshes } from './meshTools.js'

// const file = './house2.tri.gz'
// const v4Meta = [
//   140.60497, -1150.8385, 17.481358, 140.60497, -0.5007324, 17.481358, 0, 0, 1,
//   0.58823526,
// ]

const file = './house1.tri.gz'
const v4Meta = [
  10.000002, 4.165, 17.252731, 10.000002, 4.165, -6.5, 0, 1, 0, 0.58823526,
]

// const file = './man.tri.gz'
// const v4Meta = [
//   0.30215168, 0.95275545, 47.369423, 0.30215168, 0.95275545, 19.701006, 0, 1, 0,
//   0.58823526,
// ]

// const file = './car.tri.gz'
// const v4Meta = [
//   -7.6472816, 0.24464417, 288.56067, -7.6472816, 0.24464417, 1.4371033, 0, 1, 0,
//   0.58823526,
// ]

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000,
)
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x444444, 1)
renderer.setSize(window.innerWidth, window.innerHeight)
updateCamera(v4Meta)
const controls = new OrbitControls(camera, renderer.domElement)

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

const xhr = new XMLHttpRequest()
xhr.onprogress = (e) => console.log('loading..', e.loaded)
xhr.onloadend = () => {
  console.log('xonloadend...')
  const _group = buildTriangleMeshes(decodeTriangleMesh(xhr.response))
  scene.add(_group)
}
xhr.responseType = 'arraybuffer'
xhr.open('GET', file)
xhr.send()
onMounted(() => {
  document.getElementById('MeshView').appendChild(renderer.domElement)
})

function updateCamera(status) {
  camera.position.x = status[0]
  camera.position.y = status[1]
  camera.position.z = status[2]
  camera.lookAt(status[3], status[4], status[5])
  camera.up.x = status[6]
  camera.up.y = status[7]
  camera.up.z = status[8]
}
</script>

<template>
  <div id="MeshView" class="h-full"></div>
</template>

<style lang="postcss" scoped>
a {
  color: #42b983;
}
</style>
