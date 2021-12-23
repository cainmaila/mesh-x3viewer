import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
function buildRenderer() {
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
  const controls = new OrbitControls(camera, renderer.domElement)
  // const light = new THREE.AmbientLight(0xffffff, 1) // soft white light
  // scene.add(light)

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', onWindowResize)
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  return {
    scene,
    camera,
    renderer,
    controls,
  }
}
export default buildRenderer
