<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// const file = './house2.tri.gz'
// const v4Meta = [
//   140.60497, -1150.8385, 17.481358, 140.60497, -0.5007324, 17.481358, 0, 0, 1,
//   0.58823526,
// ]

// const file = './house1.tri.gz'
// const v4Meta = [
//   10.000002, 4.165, 17.252731, 10.000002, 4.165, -6.5, 0, 1, 0, 0.58823526,
// ]

// const file = './man.tri.gz'
// const v4Meta = [
//   0.30215168, 0.95275545, 47.369423, 0.30215168, 0.95275545, 19.701006, 0, 1, 0,
//   0.58823526,
// ]

const file = './car.tri.gz'
const v4Meta = [
  -7.6472816, 0.24464417, 288.56067, -7.6472816, 0.24464417, 1.4371033, 0, 1, 0,
  0.58823526,
]

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x888888, 1)
renderer.setSize(window.innerWidth, window.innerHeight)
updateCamera(v4Meta)
const controls = new OrbitControls(camera, renderer.domElement)

// camera.position.z = 5

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
  buildTriangleMeshes(decodeTriangleMesh(xhr.response))
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

//創建面================================================================

const triangleMeshWireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x222222,
})
const triangleMeshMaterial = new THREE.MeshBasicMaterial({
  color: 0xf9f9f9,
  polygonOffset: true,
  polygonOffsetFactor: 1, // positive value pushes polygon further away
  polygonOffsetUnits: 1,
})

function buildTriangleMeshes(res) {
  const triangleMeshWireframe = []
  const triangleMesh = []
  for (var i = 0; i < res.triangleMeshes.length; i++) {
    let triangleMeshes = res.triangleMeshes[i]
    const geometry = new THREE.BufferGeometry()
    const vertices = triangleMeshes.vertex
    const index = triangleMeshes.index
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex(index)
    geometry.computeBoundingBox()
    let mesh = new THREE.Mesh(geometry, triangleMeshMaterial)
    let wireframe = mesh.clone()
    wireframe.material = triangleMeshWireframeMaterial
    wireframe.material.wireframe = true
    scene.add(wireframe)
    wireframe.add(mesh)
    triangleMeshWireframe.push(wireframe)
    triangleMesh.push(mesh)
  }
}

//解碼檔案 =================================================
function decodeTriangleMesh(bin) {
  const result = {
    triangleMeshes: [],
  }
  if (bin.byteLength <= 0) {
    return result
  }
  let dataview = new DataView(bin)
  let meshObjCount = new Int32Array(1)
  meshObjCount = dataview.getInt32(0, true)
  let meshObjs = []
  for (let i = 0; i < meshObjCount * 4; i = i + 4) {
    let offset = 1
    let vertexStart = dataview.getInt32((offset + i) * 4, true)
    let vertexEnd = dataview.getInt32((offset + i + 1) * 4, true)
    let indexStart = dataview.getInt32((offset + i + 2) * 4, true)
    let indexEnd = dataview.getInt32((offset + i + 3) * 4, true)
    meshObjs.push({
      vertexStart,
      vertexEnd,
      indexStart,
      indexEnd,
    })
  }
  for (let j = 0; j < meshObjs.length; j++) {
    let vertexLength = meshObjs[j].vertexEnd / 4 - meshObjs[j].vertexStart / 4
    let vertex = new Float32Array(vertexLength)
    let index = []
    let vertexIndex = 0
    for (
      let i = meshObjs[j].vertexStart / 4;
      i < meshObjs[j].vertexEnd / 4;
      i = i + 3
    ) {
      let x = dataview.getFloat32(i * 4, true)
      let y = dataview.getFloat32((i + 1) * 4, true)
      let z = dataview.getFloat32((i + 2) * 4, true)
      vertex[vertexIndex++] = x
      vertex[vertexIndex++] = y
      vertex[vertexIndex++] = z
    }

    for (
      let i = meshObjs[j].indexStart / 4;
      i < meshObjs[j].indexEnd / 4;
      i = i + 3
    ) {
      let p1 = dataview.getInt32(i * 4, true)
      let p2 = dataview.getInt32((i + 1) * 4, true)
      let p3 = dataview.getInt32((i + 2) * 4, true)
      index.push(p1)
      index.push(p2)
      index.push(p3)
    }
    result.triangleMeshes.push({ vertex, index })
  }
  return result
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
