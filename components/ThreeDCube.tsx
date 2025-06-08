'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function ThreeDModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMouseActive, setIsMouseActive] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0); // 배경색: 검정
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model: THREE.Object3D;

    loader.load('/models/male_model2.glb', (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1); // 필요 시 크기 조절
      scene.add(model);
      animate(); // 모델이 로드된 후 애니메이션 시작
    });

    let mouseX = 0;
    let mouseY = 0;

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      mouseX = (clientX / innerWidth) * 2 - 1;
      mouseY = (clientY / innerHeight) * 2 - 1;
      setIsMouseActive(true);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', () => setIsMouseActive(false));

    const animate = () => {
      requestAnimationFrame(animate);
      if (model) {
        if (isMouseActive) {
          model.rotation.y += (mouseX - model.rotation.y) * 0.1;
          model.rotation.x += (mouseY - model.rotation.x) * 0.1;
        } else {
          model.rotation.y += 0.01;
          //model.rotation.x += 0.01;
        }
      }
      renderer.render(scene, camera);
    };

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, [isMouseActive]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}

export default ThreeDModel;
