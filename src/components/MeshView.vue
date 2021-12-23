<script setup>
import { onMounted, reactive, watch, ref } from 'vue'
import axios from 'axios'
import * as THREE from 'three'
// import { useRoute } from 'vue-router'
import dat from 'dat.gui'
import buildRenderer from './renderer.js'
import {
  decodeTriangleMesh,
  buildTriangleMeshes,
  loadModel,
  updateMeshForExplod,
  setMaterialOpacity,
} from './meshTools.js'

// const route = useRoute()
// console.log('route!', route.params)

const models = reactive({
  file: 'house1',
  isLoading: true,
})
const bitsRef = ref(0)
const explodRef = ref(0)
const opacityRef = ref(0.7)
let modelSetting = null
let modelMesh = null
const { scene, camera, renderer, controls } = buildRenderer()

onMounted(async () => {
  document.getElementById('MeshView').appendChild(renderer.domElement)
  const { data } = await axios.get('./model.json')
  modelSetting = data
  await loadMesh(modelSetting[models.file])
})
const zeroPoint = new THREE.Vector3()
function loadMesh(modelMeta) {
  models.isLoading = true
  bitsRef.value = 0
  return new Promise(async (resolve) => {
    const _response = await loadModel('./' + modelMeta.path, bitsRef)
    const _group = buildTriangleMeshes(
      decodeTriangleMesh(_response),
      modelMeta.isRotateX,
    )
    changeMesh(_group)
    updateCamera(modelMeta.v4)
    controls.target = zeroPoint
    models.isLoading = false
    resolve()
  })
}

function changeMesh(mesh) {
  modelMesh && scene.remove(modelMesh)
  modelMesh = mesh
  modelMesh && scene.add(modelMesh)
}

function updateCamera(status) {
  camera.position.x = status[0]
  camera.position.y = status[1]
  camera.position.z = status[2]
  // camera.lookAt(status[3], status[4], status[5])
  camera.lookAt(0, 0, 0)
  camera.up.x = status[6]
  camera.up.y = status[7]
  camera.up.z = status[8]
}
const gui = new dat.GUI({
  name: 'Mesh',
})
gui
  .add(models, 'file', {
    車: 'car',
    雕像: 'man',
    house1: 'house1',
    house2: 'house2',
    飛機: 'airplane',
  })
  .name('模型')
const opacityUi = gui.add(opacityRef, 'value', 0.3, 1.0).name('opacity')
const explodUi = gui.add(explodRef, 'value', 0.0, 2.0).name('爆炸')

watch(
  () => models.file,
  async (file) => {
    explodRef.value = 0
    explodUi.setValue(0)
    await loadMesh(modelSetting[file])
  },
)

watch(explodRef, (val) => {
  updateMeshForExplod(val)
})
watch(opacityRef, (val) => {
  setMaterialOpacity(val)
})
</script>

<template>
  <div id="MeshView" class="h-full"></div>
  <div
    v-if="models.isLoading"
    id="loading"
    class="
      fixed
      top-0
      w-full
      h-full
      bg-black/50
      text-white
      flex
      justify-center
      items-center
    "
  >
    Loading... {{ bitsRef }}
  </div>
</template>

<style lang="postcss" scoped>
a {
  color: #42b983;
}
</style>
