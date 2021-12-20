<script setup>
import { onMounted, reactive, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
// import * as THREE from 'three'
import dat from 'dat.gui'
import buildRenderer from './renderer.js'
import {
  decodeTriangleMesh,
  buildTriangleMeshes,
  loadModel,
} from './meshTools.js'

// const route = useRoute()
// console.log('route!', route.params)

const models = reactive({
  file: 'car',
  isLoading: true,
})

let modelSetting = null
let modelMesh = null
const { scene, camera, renderer } = buildRenderer()

watch(
  () => models.file,
  async (file) => {
    await loadMesh(modelSetting[file])
  },
)

onMounted(async () => {
  document.getElementById('MeshView').appendChild(renderer.domElement)
  const { data } = await axios.get('./model.json')
  modelSetting = data
  await loadMesh(modelSetting[models.file])
})

function loadMesh(modelMeta) {
  models.isLoading = true
  return new Promise(async (resolve) => {
    const _response = await loadModel('./' + modelMeta.path)
    const _group = buildTriangleMeshes(
      decodeTriangleMesh(_response),
      modelMeta.isRotateX,
    )
    changeMesh(_group)
    updateCamera(modelMeta.v4)
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
  camera.lookAt(status[3], status[4], status[5])
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
    Loading...
  </div>
</template>

<style lang="postcss" scoped>
a {
  color: #42b983;
}
</style>
