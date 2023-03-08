/* Malaya Heflin
 * CMSC398K-0101
 * March 10 2023
*/

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


class MyWorld {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    // setup renderer
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    // create camera
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(75, 20, 0);

    // init scene
    this._scene = new THREE.Scene();

    // lighting
    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 100, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0x101010);
    this._scene.add(light);

    // orbit controls
    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    // skybox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './veniceSkybox/px.jpg',
        './veniceSkybox/nx.jpg',
        './veniceSkybox/py.jpg',
        './veniceSkybox/ny.jpg',
        './veniceSkybox/pz.jpg',
        './veniceSkybox/nz.jpg',
    ]);
    this._scene.background = texture;

    // scene objects
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(10, 20, 15),
      new THREE.MeshStandardMaterial({
          color: 0x48D349
        }));
    cone.castShadow = true;
    cone.receiveShadow = true;
    cone.position.set(0, 20, -20);
    this._scene.add(cone);

    //for custom normal shader
    const _VS = `
    varying vec3 v_Normal;
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      v_Normal = normal;
    }
    `;
    const _FS = `
    varying vec3 v_Normal;
    void main() {
      vec3 scaled = v_Normal * 0.5 + vec3(0.5);
      gl_FragColor = vec4(scaled, 1.0);
    }
    `;

    const coolShape = new THREE.Mesh(
      new THREE.DodecahedronGeometry(12, 0),
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: _VS,
        fragmentShader: _FS,
      }));
    coolShape.castShadow = true;
    coolShape.receiveShadow = true;
    coolShape.position.set(0, 20, 20);
    this._scene.add(coolShape);

    this._RAF();
  }

  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera);
      this._RAF();
    });
  }
}


let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new MyWorld();
});