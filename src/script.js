import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { DoubleSide } from 'three'


const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// SKYBOX SETUP
const materialArray = [];
const texture_ft = new THREE.TextureLoader().load('indigo_ft.jpg')
const texture_bk = new THREE.TextureLoader().load('indigo_bk.jpg')
const texture_up = new THREE.TextureLoader().load('indigo_up.jpg')
const texture_dn = new THREE.TextureLoader().load('indigo_dn.jpg')
const texture_rt = new THREE.TextureLoader().load('indigo_rt.jpg')
const texture_lf = new THREE.TextureLoader().load('indigo_lf.jpg')

materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}))

for (let i = 0; i < 6; i++) {
    materialArray[i].side = THREE.BackSide;
    
}

// Objects
const geometry = new THREE.TorusKnotGeometry(100, 1, 64, 3, 15, 20);
const skyBoxGeometry = new THREE.BoxGeometry(10000,10000, 10000)
const planeGeo = new THREE.PlaneGeometry(35, 50, 30, 30);

// Materials
const material = new THREE.MeshStandardMaterial({
    transparent:true, 
    color: 0x18acff,
    emissive: 0x0,
    roughness: 0,
    metalness: 1,
})

const planeMat = new THREE.MeshStandardMaterial({
    transparent:true,
    color: 0x18acff,
    side:DoubleSide,
})

// Mesh
const sphere = new THREE.Mesh(geometry, material)
const skyBox = new THREE.Mesh(skyBoxGeometry, materialArray)
const plane =new THREE.Mesh(planeGeo,planeMat)

scene.add(sphere, skyBox )

// Lights
const ambientLight = new THREE.AmbientLight( 0x404040, 10 ); 
const pointLight = new THREE.DirectionalLight(0xffffff, 1)
const pointLight2 = new THREE.PointLight(0xffffff, 10)
const pointLight3 = new THREE.PointLight(0xffffff, 10)

const amblight = gui.addFolder('ambient light')
const light = gui.addFolder('Light 1')
const light2 = gui.addFolder('Light 2')

pointLight.position.set(2,10,1);
pointLight.target.position.set(0,0,0);
pointLight2.position.set(2,3,4)
pointLight3.position.set(2,3,4)

amblight.add(ambientLight.position, 'y').min(-3).max(3).step(0.01);
amblight.add(ambientLight.position, 'x').min(-6).max(6).step(0.01);
amblight.add(ambientLight.position, 'z').min(-3).max(3).step(0.01);
amblight.add(ambientLight, 'intensity').min(0).max(10).step(0.01);

light.add(pointLight.position, 'y').min(-3).max(3).step(0.01);
light.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
light.add(pointLight.position, 'z').min(-3).max(3).step(0.01);
light.add(pointLight, 'intensity').min(0).max(10).step(0.01);

light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01);
light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01);
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01);

scene.add( pointLight, pointLight.target, pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // Mouse Move
    mouse.x = (event.clientX/window.innerWidth) *2-1;
    mouse.y = (event.clientY/window.innerWidth) *2+1;
})

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 45, 30000)
camera.position.set(0,0,200)
scene.add(camera)

// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(new THREE.Color('#1e1c25'), 1)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minDistance = 0;
controls.maxDistance =1500;


/**
 * Animate
 */

const clock = new THREE.Clock()
const render = () => {
    // Raycaster
    raycaster.setFromCamera(mouse, camera);
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.z = .05 * elapsedTime
    // sphere.rotation.x = .05 * elapsedTime
    // sphere.rotation.y = .05 * elapsedTime
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call render again on the next frame
    window.requestAnimationFrame(render)
}
render()

// function onMouseMove(event){
//     mouse.x = (event.clientX/window.innerWidth) *2-1;
//     mouse.y = (event.clientY/window.innerWidth) *2+1;
// }



