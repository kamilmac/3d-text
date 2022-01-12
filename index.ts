import './index.css';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

const fontLoader = new FontLoader()

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/checkerboard-8x8.png')

const scene = new THREE.Scene()

const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
fontLoader.load('/helvetiker_regular.typeface.json', (font) => {
    console.log('font loaded')
    const textGeometry = new TextGeometry(
        'Floating Donuts',
        {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
        }
    )
   
    // textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
    textGeometry.computeBoundingBox()
    textGeometry.translate(
        - (textGeometry.boundingBox.max.x - 0.02) * 0.5, // Subtract bevel size
        - (textGeometry.boundingBox.max.y - 0.02) * 0.5, // Subtract bevel size
        - (textGeometry.boundingBox.max.z - 0.03) * 0.5  // Subtract bevel thickness
    )
    // textGeometry.center()
})

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

for(let i = 0; i < 100; i++)
{
    const donut = new THREE.Mesh(donutGeometry, textMaterial)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut)
}


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#canvas')

// Scene

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)
// const material = new THREE.MeshBasicMaterial({
//     map: colorTexture
// })

const material = new THREE.MeshBasicMaterial()

const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()