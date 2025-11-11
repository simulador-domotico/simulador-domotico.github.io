import { THREE } from './core.js';
import { showDeviceInfo } from './infoCards.js';

const lightKeywords = ["luz", "light", "lampara", "lámpara", "farol", "poste", "lamp", "foco"];
let lucesObjetos = [];

function isLightLikeName(name) {
  if (!name) return false;
  const ln = name.toLowerCase();
  return lightKeywords.some(k => ln.includes(k));
}

function getMeshMaterials(mesh) {
  if (!mesh || !mesh.material) return [];
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function cloneMeshMaterials(mesh) {
  const mats = getMeshMaterials(mesh);
  if (mats.length === 0) return;
  if (mesh.userData._materialsCloned) return;
  const cloned = mats.map(m => m.clone());
  mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
  mesh.userData._materialsCloned = true;
}

function saveOriginalMaterialState(mesh) {
  const mats = getMeshMaterials(mesh);
  const original = mats.map(m => ({
    color: m.color ? m.color.clone() : null,
    emissive: m.emissive ? m.emissive.clone() : null,
    emissiveIntensity: typeof m.emissiveIntensity === 'number' ? m.emissiveIntensity : 0,
  }));
  mesh.userData.originalMaterialState = original;
}

function turnLight(mesh, turnOn) {
  if (!mesh) return;
  const mats = getMeshMaterials(mesh);
  if (turnOn) {
    // No cambiar color ni propiedades del material, solo marcar como encendido
    mats.forEach(mat => {
      if (!mat) return;
      // Mantener el color original - no cambiar a blanco
      mat.needsUpdate = true;
    });
    mesh.userData.isOn = true;
  } else {
    const original = mesh.userData.originalMaterialState;
    if (original && original.length === mats.length) {
      mats.forEach((mat, i) => {
        const o = original[i];
        if (!mat || !o) return;
        if (mat.color && o.color) mat.color.copy(o.color);
        if (mat.emissive && o.emissive) mat.emissive.copy(o.emissive);
        if (typeof mat.emissiveIntensity === 'number') mat.emissiveIntensity = o.emissiveIntensity;
        mat.needsUpdate = true;
      });
    }
    mesh.userData.isOn = false;
  }
}

function setupLightButtons(root) {
  lucesObjetos = [];
  root.traverse((child) => {
    if (child.isMesh && isLightLikeName(child.name)) {
      cloneMeshMaterials(child);
      saveOriginalMaterialState(child);
      child.userData.isOn = false;
      lucesObjetos.push(child);
    }
  });

  lucesObjetos = lucesObjetos.slice(0, 4);

  // Insertar directamente en el scroller superior para mantener el mismo layout
  const buttonsContainer = document.querySelector('#controls .controls-scroll');
  if (!buttonsContainer) return;

  lucesObjetos.forEach((mesh, idx) => {
    const btn = document.createElement('button');
    btn.id = `btnLight_${idx}`;
    btn.className = 'ui-button';
    btn.classList.add(mesh.userData.isOn ? 'light-on' : 'light-off');
  // No marcar aro por estado; se marca por última acción
    btn.title = `${mesh.name}`;
    
  // Crear el span para el texto fijo
  const label = document.createElement('span');
  label.textContent = `Luz ${idx + 1}`;
  btn.appendChild(label);
    
    btn.addEventListener('click', () => {
      const newState = !mesh.userData.isOn;
      turnLight(mesh, newState);
      
      // Solo cambiar la clase del botón para actualizar el icono
      btn.classList.remove('light-on', 'light-off');
      btn.classList.add(mesh.userData.isOn ? 'light-on' : 'light-off');
      try { window?.setActiveRingOn?.(btn); } catch (_) {}
      
      // Mostrar cartel informativo
      const action = mesh.userData.isOn ? 'encendida' : 'apagada';
      showDeviceInfo(`Luz ${idx + 1}`, `Luz ${action}`, mesh.position, mesh);
      // Enfocar cámara al actuador si está disponible la función global
      try { window?.focusCameraOnTarget?.(mesh); } catch (_) {}
    });
    
    buttonsContainer.appendChild(btn);
  });
}

export { setupLightButtons, turnLight };


