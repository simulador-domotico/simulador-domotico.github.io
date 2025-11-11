import { THREE, camera, renderer } from './core.js';

// Sistema de carteles informativos
let activeCards = new Map(); // deviceId -> {card, line, targetObject, updateFunction}
let cardContainer = null;
let animationFrameId = null;

// Configuración de líneas para cada dispositivo
const deviceLineConfig = {
  // Configuración por defecto
  default: {
    horizontalDistance: 150,
    verticalDistance: 100,
    lineThickness: 4,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  
  // Configuraciones de los actuadores que realmente se usan en el código
  
  // Luces (se usan en src/lightsUi.js)
  'Luz 1': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'left',
    manualConfig: true
  },
  
  'Luz 2': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'left',
    manualConfig: true
  },
  
  'Luz 3': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  'Luz 4': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  // Cortinas (se usan en main.js)
  'Cortina Extra': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  'Cortina Delantera': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'left',
    manualConfig: true
  },
  
  'Cortina Trasera': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'left',
    manualConfig: true
  },
  
  // Puertas (se usan en main.js)
  'Puerta Principal': {
    horizontalDistance: 0,
    verticalDistance: 250,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  'Puerta Cuarto': {
    horizontalDistance: 0,
    verticalDistance: 250,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  'Puerta Baño': {
    horizontalDistance: 0,
    verticalDistance: 250,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  // Portones (se usan en main.js)
  'Portón Delantero': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  },
  
  'Portón Trasero': {
    horizontalDistance: 60,
    verticalDistance: 200,
    lineThickness: 2,
    lineColor: '#000000',
    borderRadius: 2,
    shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    lineDirection: 'right',
    manualConfig: true
  }
};

// Configuración de texto para cada dispositivo
const deviceTextConfig = {
  // Configuración por defecto
  default: {
    title: null, // null = usar deviceName
    statusText: null, // null = usar deviceType + " activado"
    showIcon: false,
    icon: '🔧'
  },
  
  // Configuraciones específicas por dispositivo
  'Luz 1': {
    title: 'MODULO RELE',
    statusText: "Un relé es un interruptor eléctrico que utiliza un electroimán para abrir o cerrar un circuito, permitiendo controlar el encendido y apagado de las luces a través de una señal de Arduino",
    showIcon: true,
    imageUrl: 'assets/rele.png',
    imageAlt: 'Relé',
    imageWidth: 120
  },
  
  'Luz 2': {
    title: 'MODULO RELE',
    statusText: "Un relé es un interruptor eléctrico que utiliza un electroimán para abrir o cerrar un circuito, permitiendo controlar el encendido y apagado de las luces a través de una señal de Arduino",
    showIcon: true,
    imageUrl: 'assets/rele.png',
    imageAlt: 'Relé',
    imageWidth: 120
  },
  
  'Luz 3': {
    title: 'MODULO RELE',
    statusText: "Un relé es un interruptor eléctrico que utiliza un electroimán para abrir o cerrar un circuito, permitiendo controlar el encendido y apagado de las luces a través de una señal de Arduino",
    showIcon: true,
    imageUrl: 'assets/rele.png',
    imageAlt: 'Relé',
    imageWidth: 120
  },
  
  'Luz 4': {
    title: 'MODULO RELE',
    statusText: "Un relé es un interruptor eléctrico que utiliza un electroimán para abrir o cerrar un circuito, permitiendo controlar el encendido y apagado de las luces a través de una señal de Arduino",
    showIcon: true,
    imageUrl: 'assets/rele.png',
    imageAlt: 'Relé',
    imageWidth: 120
  },
  
  'Cortina Extra': {
    title: 'MOTOR CORTINA',
    statusText: 'Un motor de cortina es un actuador eléctrico que utiliza un sistema de poleas o rieles para deslizar o enrollar las cortinas. Permite controlar su apertura y cierre (o subir/bajar) a través de una señal de Arduino.',
    showIcon: true,
    imageUrl: 'assets/motor_para_cortinas.png',
    imageAlt: 'Motor para cortinas',
    imageWidth: 120
  },
  
  'Cortina Delantera': {
    title: 'MOTOR CORTINA',
    statusText: 'Un motor de cortina es un actuador eléctrico que utiliza un sistema de poleas o rieles para deslizar o enrollar las cortinas. Permite controlar su apertura y cierre (o subir/bajar) a través de una señal de Arduino.',
    showIcon: true,
    imageUrl: 'assets/motor_para_cortinas.png',
    imageAlt: 'Motor para cortinas',
    imageWidth: 120
  },
  
  'Cortina Trasera': {
    title: 'MOTOR CORTINA',
    statusText: 'Un motor de cortina es un actuador eléctrico que utiliza un sistema de poleas o rieles para deslizar o enrollar las cortinas. Permite controlar su apertura y cierre (o subir/bajar) a través de una señal de Arduino.',
    showIcon: true,
    imageUrl: 'assets/motor_para_cortinas.png',
    imageAlt: 'Motor para cortinas',
    imageWidth: 120
  },
  
  'Puerta Principal': {
    title: 'MOTOR PUERTA',
    statusText: 'Una cerradura eléctrica es un actuador que permite abrir o cerrar la puerta mediante una señal de Arduino, controlando el mecanismo de bloqueo. Se complementa con un motor puertas, que mediante engranajes o actuadores lineales realiza el movimiento físico de apertura y cierre del acceso',
    showIcon: true,
    imageUrl: 'assets/cerradura.png',
    imageAlt: 'cerradura',
    imageWidth: 80
  },
  
  'Puerta Cuarto': {
    title: "MOTOR PUERTA",
    statusText: 'Una cerradura eléctrica es un actuador que permite abrir o cerrar la puerta mediante una señal de Arduino, controlando el mecanismo de bloqueo. Se complementa con un motor puertas, que mediante engranajes o actuadores lineales realiza el movimiento físico de apertura y cierre del acceso',
    showIcon: true,
    imageUrl: 'assets/cerradura.png',
    imageAlt: 'cerradura',
    imageWidth: 80
  },
  
  'Puerta Baño': {
    title: 'MOTOR PUERTA',
    statusText: 'Una cerradura eléctrica es un actuador que permite abrir o cerrar la puerta mediante una señal de Arduino, controlando el mecanismo de bloqueo. Se complementa con un motor puertas, que mediante engranajes o actuadores lineales realiza el movimiento físico de apertura y cierre del acceso',
    showIcon: true,
    imageUrl: 'assets/cerradura.png',
    imageAlt: 'cerradura',
    imageWidth: 80
  },
  
  'Portón Delantero': {
    title: 'MOTOR PORTÓN',
    statusText: 'Un motor para portones es un actuador eléctrico de alta potencia que utiliza mecanismos de engranajes o actuadores lineales para generar el movimiento. Permite controlar la apertura y cierre físico del acceso a través de una señal de Arduino.',
    showIcon: true,
    imageUrl: 'assets/motor_puertas_y_porton.png',
    imageAlt: 'Motor para puertas y portones',
    imageWidth: 80
  },
  
  'Portón Trasero': {
    title: 'MOTOR PORTÓN',
    statusText: 'Un motor para portones es un actuador eléctrico de alta potencia que utiliza mecanismos de engranajes o actuadores lineales para generar el movimiento. Permite controlar la apertura y cierre físico del acceso a través de una señal de Arduino.',
    showIcon: true,
    imageUrl: 'assets/motor_puertas_y_porton.png',
    imageAlt: 'Motor para puertas y portones',
    imageWidth: 80
  }
};

// Función para obtener la configuración de texto para un dispositivo
function getTextConfig(deviceName) {
  return deviceTextConfig[deviceName] || deviceTextConfig.default;
}

// Función para actualizar la configuración de texto de un dispositivo
function updateTextConfig(deviceName, newConfig) {
  if (deviceTextConfig[deviceName]) {
    deviceTextConfig[deviceName] = { ...deviceTextConfig[deviceName], ...newConfig };
  } else {
    deviceTextConfig[deviceName] = { ...deviceTextConfig.default, ...newConfig };
  }
}

// Función para obtener la configuración de líneas para un dispositivo
function getLineConfig(deviceName) {
  return deviceLineConfig[deviceName] || deviceLineConfig.default;
}

// Función para actualizar la configuración de líneas de un dispositivo
function updateLineConfig(deviceName, newConfig, isManual = false) {
  if (deviceLineConfig[deviceName]) {
    deviceLineConfig[deviceName] = { 
      ...deviceLineConfig[deviceName], 
      ...newConfig,
      manualConfig: isManual
    };
  } else {
    deviceLineConfig[deviceName] = { 
      ...deviceLineConfig.default, 
      ...newConfig,
      manualConfig: isManual
    };
  }
}

// Función para actualizar configuración manual (desde consola)
function setManualLineConfig(deviceName, newConfig) {
  updateLineConfig(deviceName, newConfig, true);
  console.log(`✅ Configuración manual actualizada para ${deviceName}:`, newConfig);
}

// Función para ajustar automáticamente las líneas basándose en la posición del actuador
// Solo se aplica si no hay configuración manual previa
function adjustLineConfigByPosition(deviceName, worldPosition) {
  // Verificar si ya existe una configuración manual
  const existingConfig = deviceLineConfig[deviceName];
  if (existingConfig && existingConfig.manualConfig) {
    // Si ya hay configuración manual, no aplicar ajuste automático
    return;
  }
  
  const screenPos = worldToScreen(worldPosition);
  
  // Calcular ajustes basados en la posición en pantalla
  let horizontalDistance = 150; // Valor por defecto
  let verticalDistance = 100;    // Valor por defecto
  let lineThickness = 4;        // Valor por defecto
  let lineColor = '#000000';    // Valor por defecto
  
  // Ajustar distancia horizontal basada en la posición X
  if (screenPos.x < window.innerWidth * 0.3) {
    // Actuador en el lado izquierdo - línea más larga
    horizontalDistance = 180;
  } else if (screenPos.x > window.innerWidth * 0.7) {
    // Actuador en el lado derecho - línea más larga
    horizontalDistance = 180;
  } else {
    // Actuador en el centro - línea más corta
    horizontalDistance = 120;
  }
  
  // Ajustar distancia vertical basada en la posición Y
  if (screenPos.y < window.innerHeight * 0.3) {
    // Actuador arriba - línea más larga
    verticalDistance = 130;
  } else if (screenPos.y > window.innerHeight * 0.7) {
    // Actuador abajo - línea más corta
    verticalDistance = 80;
  } else {
    // Actuador en el centro vertical - distancia media
    verticalDistance = 100;
  }
  
  // Ajustar grosor basado en la distancia del centro
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const distanceFromCenter = Math.sqrt(
    Math.pow(screenPos.x - centerX, 2) + Math.pow(screenPos.y - centerY, 2)
  );
  
  if (distanceFromCenter > 300) {
    // Actuador lejos del centro - línea más gruesa
    lineThickness = 5;
  } else if (distanceFromCenter < 150) {
    // Actuador cerca del centro - línea más delgada
    lineThickness = 3;
  } else {
    // Actuador a distancia media - grosor normal
    lineThickness = 4;
  }
  
  // Aplicar los ajustes
  updateLineConfig(deviceName, {
    horizontalDistance,
    verticalDistance,
    lineThickness,
    lineColor
  });
}

// Crear contenedor para carteles
function createCardContainer() {
  if (cardContainer) return cardContainer;
  
  cardContainer = document.createElement('div');
  cardContainer.id = 'info-cards-container';
  cardContainer.style.position = 'fixed';
  cardContainer.style.top = '0';
  cardContainer.style.left = '0';
  cardContainer.style.width = '100%';
  cardContainer.style.height = '100%';
  cardContainer.style.pointerEvents = 'none';
  cardContainer.style.zIndex = '1000';
  document.body.appendChild(cardContainer);
  
  return cardContainer;
}

// Convertir posición 3D a coordenadas de pantalla
function worldToScreen(worldPosition) {
  const vector = worldPosition.clone();
  vector.project(camera);
  
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = (vector.y * -0.5 + 0.5) * renderer.domElement.clientHeight;
  
  return { x, y };
}

// Crear cartel informativo
function createInfoCard(deviceName, deviceType, worldPosition, targetObject = null) {
  const container = createCardContainer();
  
  // SIMPLE: Solo permitir un cartel a la vez
  // Limpiar TODOS los carteles existentes inmediatamente
  activeCards.forEach((cardData, deviceId) => {
    if (cardData.card && cardData.card.parentNode) {
      cardData.card.remove();
    }
    if (cardData.line && cardData.line.parentNode) {
      cardData.line.remove();
    }
  });
  activeCards.clear();
  
  const card = document.createElement('div');
  card.className = 'info-card';
  card.style.position = 'absolute';
  card.style.background = '#666666';
  card.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  card.style.borderRadius = '8px';
  card.style.padding = '12px 16px';
  card.style.color = '#ffffff';
  card.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
  card.style.fontSize = '14px';
  card.style.fontWeight = '500';
  card.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
  card.style.backdropFilter = 'blur(8px)';
  card.style.pointerEvents = 'auto';
  card.style.display = 'flex';
  card.style.flexDirection = 'row';
  card.style.alignItems = 'stretch';
  card.style.gap = '12px';
  // Obtener configuración de texto para el dispositivo
  const textConfig = getTextConfig(deviceName);
  
  // Contenido del cartel
  // Contenedor de texto (izquierda)
  const textWrap = document.createElement('div');
  textWrap.style.display = 'flex';
  textWrap.style.flexDirection = 'column';
  textWrap.style.minWidth = '0';

  const title = document.createElement('div');
  title.textContent = textConfig.title || deviceName;
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '8px';
  title.style.fontSize = '16px';
  
  const info = document.createElement('div');
  info.textContent = textConfig.statusText || `${deviceType} activado`;
  info.style.fontSize = '12px';
  info.style.opacity = '0.8';
  info.style.lineHeight = '1.4';
  info.style.whiteSpace = 'pre-line'; // Permitir saltos de línea
  
  // Agregar icono si está configurado
  if (textConfig.showIcon && textConfig.icon) {
    const icon = document.createElement('span');
    icon.textContent = textConfig.icon;
    icon.style.marginRight = '6px';
    icon.style.fontSize = '14px';
    title.insertBefore(icon, title.firstChild);
  }
  
  textWrap.appendChild(title);
  textWrap.appendChild(info);
  card.appendChild(textWrap);

  // Imagen opcional a la derecha del contenido
  if (textConfig.imageUrl) {
    const imgWrap = document.createElement('div');
    imgWrap.style.display = 'flex';
    imgWrap.style.alignItems = 'center';
    imgWrap.style.justifyContent = 'center';
    imgWrap.style.flex = '0 0 auto';
    const img = document.createElement('img');
    img.src = textConfig.imageUrl;
    img.alt = textConfig.imageAlt || '';
    img.style.width = (textConfig.imageWidth || 56) + 'px';
    img.style.height = 'auto';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '4px';
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);
  }
  
  // Ajustar el tamaño del cartel al contenido
  card.style.maxWidth = '360px'; // permite texto + imagen
  card.style.minWidth = '120px';
  card.style.width = 'auto'; // Ancho automático
  card.style.height = 'auto'; // Altura automática
  
  // Línea de conexión con círculo en la punta
  const connectionLine = document.createElement('div');
  connectionLine.className = 'connection-line';
  connectionLine.style.position = 'absolute';
  connectionLine.style.pointerEvents = 'none';
  connectionLine.style.zIndex = '999';
  
  // Crear el círculo en la punta que apunta al actuador
  const circle = document.createElement('div');
  circle.style.position = 'absolute';
  circle.style.width = '12px';
  circle.style.height = '12px';
  circle.style.borderRadius = '50%';
  circle.style.background = 'rgba(100, 150, 255, 0.9)';
  circle.style.border = '2px solid rgba(255, 255, 255, 0.8)';
  circle.style.transform = 'translate(-50%, -50%)';
  circle.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
  
  // Crear la línea que conecta al cartel (forma L)
  const line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.background = '#000000';
  line.style.height = '4px';
  line.style.borderRadius = '2px';
  line.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
  
  connectionLine.appendChild(circle);
  connectionLine.appendChild(line);
  
  container.appendChild(card);
  container.appendChild(connectionLine);
  
  // Ajustar configuración de líneas basándose en la posición
  adjustLineConfigByPosition(deviceName, worldPosition);
  
  // Guardar referencia con datos completos ANTES de posicionar (para que esté disponible en updateCardPosition)
  activeCards.set(deviceName, {
    card: card,
    line: connectionLine,
    targetObject: targetObject,
    updateFunction: null // Se asignará después
  });
  
  // Posicionar cartel
  updateCardPosition(card, connectionLine, worldPosition, deviceName, targetObject);
  
  // Función para actualizar posición del objeto
  const updatePosition = () => {
    if (targetObject && targetObject.position) {
      updateCardPosition(card, connectionLine, targetObject.position, deviceName, targetObject);
    }
  };
  
  // Actualizar la función de actualización en activeCards
  activeCards.get(deviceName).updateFunction = updatePosition;
  
  // Iniciar loop de actualización si no está activo
  if (!animationFrameId) {
    startUpdateLoop();
  }
  
  return card;
}

// Actualizar posición del cartel
function updateCardPosition(card, connectionLine, worldPosition, deviceName = null, targetObject = null) {
  // Para puertas, calcular la posición del borde superior usando el bounding box
  let circleWorldPosition = worldPosition;
  const doorNames = ['Puerta Principal', 'Puerta Cuarto', 'Puerta Baño'];
  
  if (deviceName && doorNames.includes(deviceName)) {
    // Obtener el targetObject desde el parámetro o desde activeCards
    const doorObject = targetObject || (activeCards.get(deviceName)?.targetObject);
    if (doorObject) {
      // Calcular bounding box del objeto de la puerta
      const bbox = new THREE.Box3().setFromObject(doorObject);
      const center = bbox.getCenter(new THREE.Vector3());
      // Calcular el punto superior central (centro en X y Z, máximo en Y)
      const topCenter = new THREE.Vector3(center.x, bbox.max.y, center.z);
      circleWorldPosition = topCenter;
    }
  }
  
  // Convertir posición del círculo a pantalla
  const circleScreenPos = worldToScreen(circleWorldPosition);
  // Convertir posición original a pantalla (para el cartel)
  const screenPos = worldToScreen(worldPosition);
  
  // Obtener dimensiones reales del cartel
  const cardRect = card.getBoundingClientRect();
  const cardWidth = cardRect.width;
  const cardHeight = cardRect.height;
  
  // Obtener configuración específica del dispositivo
  const lineConfig = getLineConfig(deviceName);
  const horizontalDistance = lineConfig.horizontalDistance;
  const verticalDistance = lineConfig.verticalDistance;
  
  let cardX, cardY;
  
  // Determinar dirección de la L basada en la configuración del dispositivo
  let horizontalDirection = 'auto';
  if (lineConfig.lineDirection && lineConfig.lineDirection !== 'auto') {
    horizontalDirection = lineConfig.lineDirection;
  } else {
    // Lógica automática basada en la posición del círculo
    if (circleScreenPos.x < window.innerWidth / 2) {
      horizontalDirection = 'right';
    } else {
      horizontalDirection = 'left';
    }
  }
  
  // Calcular posición del cartel según la dirección (usando posición del círculo)
  if (horizontalDirection === 'right') {
    cardX = circleScreenPos.x + horizontalDistance;
  } else if (horizontalDirection === 'left') {
    cardX = circleScreenPos.x - horizontalDistance - cardWidth;
  } else if (horizontalDirection === 'up') {
    cardX = circleScreenPos.x - cardWidth / 2;
  } else if (horizontalDirection === 'down') {
    cardX = circleScreenPos.x - cardWidth / 2;
  }
  
  // Posición vertical del cartel - siempre arriba del círculo
  cardY = circleScreenPos.y - verticalDistance;
  
  // Calcular el punto de conexión horizontal según la dirección
  let horizontalEndX;
  if (horizontalDirection === 'right') {
    horizontalEndX = circleScreenPos.x + horizontalDistance;
  } else if (horizontalDirection === 'left') {
    horizontalEndX = circleScreenPos.x - horizontalDistance;
  } else if (horizontalDirection === 'up') {
    horizontalEndX = circleScreenPos.x; // Línea vertical directa
  } else if (horizontalDirection === 'down') {
    horizontalEndX = circleScreenPos.x; // Línea vertical directa
  }
  
  // Centrar el cartel en el final de la línea horizontal
  cardX = horizontalEndX - cardWidth / 2;
  
  // Ajustar si se sale de la pantalla
  if (cardX < 10) cardX = 10;
  if (cardX > window.innerWidth - cardWidth - 10) cardX = window.innerWidth - cardWidth - 10;
  if (cardY < 10) cardY = circleScreenPos.y + 20;
  if (cardY > window.innerHeight - cardHeight - 10) cardY = window.innerHeight - cardHeight - 10;
  
  card.style.left = cardX + 'px';
  card.style.top = cardY + 'px';
  
  // Obtener elementos del círculo y la línea
  const circle = connectionLine.querySelector('div:first-child');
  const line = connectionLine.querySelector('div:last-child');
  
  if (!circle || !line) return;
  
  // Posicionar el círculo en el borde superior de la puerta (centrado horizontalmente)
  circle.style.left = circleScreenPos.x + 'px';
  circle.style.top = circleScreenPos.y + 'px';
  
  // Limpiar líneas anteriores
  line.innerHTML = '';
  
  // Crear línea en forma de L perfecta
  // Primero: línea horizontal desde el actuador hacia afuera
  // (horizontalEndX ya fue calculado arriba)
  
  // Crear línea horizontal desde el actuador
  const horizontalLine = document.createElement('div');
  horizontalLine.style.position = 'absolute';
  horizontalLine.style.background = lineConfig.lineColor;
  horizontalLine.style.height = lineConfig.lineThickness + 'px';
  horizontalLine.style.borderRadius = lineConfig.borderRadius + 'px';
  horizontalLine.style.boxShadow = lineConfig.shadow;
  
  // Crear línea horizontal según la dirección
  if (horizontalDirection === 'right') {
    horizontalLine.style.left = circleScreenPos.x + 'px';
    horizontalLine.style.top = circleScreenPos.y + 'px';
    horizontalLine.style.width = horizontalDistance + 'px';
    horizontalLine.style.transform = 'translateY(-50%)';
  } else if (horizontalDirection === 'left') {
    horizontalLine.style.left = horizontalEndX + 'px';
    horizontalLine.style.top = circleScreenPos.y + 'px';
    horizontalLine.style.width = horizontalDistance + 'px';
    horizontalLine.style.transform = 'translateY(-50%)';
  } else if (horizontalDirection === 'up' || horizontalDirection === 'down') {
    // Para direcciones up/down, no crear línea horizontal
    horizontalLine.style.display = 'none';
  }
  
  // Segundo: línea vertical desde el final de la horizontal hacia arriba
  const verticalLine = document.createElement('div');
  verticalLine.style.position = 'absolute';
  verticalLine.style.background = lineConfig.lineColor;
  verticalLine.style.width = lineConfig.lineThickness + 'px';
  verticalLine.style.borderRadius = lineConfig.borderRadius + 'px';
  verticalLine.style.boxShadow = lineConfig.shadow;
  
  // La línea vertical va desde el círculo hacia el centro del borde inferior del cartel
  const cardBottomY = cardY + cardHeight;
  const cardCenterX = cardX + cardWidth / 2;
  const verticalHeight = Math.abs(cardBottomY - circleScreenPos.y);
  const verticalTop = Math.min(circleScreenPos.y, cardBottomY);
  
  // Posicionar la línea vertical según la dirección
  if (horizontalDirection === 'up' || horizontalDirection === 'down') {
    // Línea vertical directa desde el círculo
    verticalLine.style.left = circleScreenPos.x + 'px';
    verticalLine.style.top = verticalTop + 'px';
    verticalLine.style.height = verticalHeight + 'px';
    verticalLine.style.transform = 'translateX(-50%)';
  } else {
    // Línea vertical desde el final de la línea horizontal hacia el centro del borde inferior del cartel
    verticalLine.style.left = cardCenterX + 'px';
    verticalLine.style.top = verticalTop + 'px';
    verticalLine.style.height = verticalHeight + 'px';
    verticalLine.style.transform = 'translateX(-50%)';
  }
  
  // Agregar las líneas al contenedor
  line.appendChild(horizontalLine);
  line.appendChild(verticalLine);
}

// Ocultar cartel
function hideInfoCard(deviceName) {
  const cardData = activeCards.get(deviceName);
  if (cardData) {
    if (cardData.card) {
      cardData.card.style.transition = 'opacity 0.3s ease';
      cardData.card.style.opacity = '0';
    }
    if (cardData.line) {
      cardData.line.style.transition = 'opacity 0.3s ease';
      cardData.line.style.opacity = '0';
    }
    setTimeout(() => {
      if (cardData.card && cardData.card.parentNode) {
        cardData.card.remove();
      }
      if (cardData.line && cardData.line.parentNode) {
        cardData.line.remove();
      }
      activeCards.delete(deviceName);
      
      // Detener loop si no hay más carteles
      if (activeCards.size === 0 && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, 300);
  }
}

// Loop de actualización para seguir el movimiento
function startUpdateLoop() {
  function updateLoop() {
    activeCards.forEach((cardData, deviceName) => {
      if (cardData.updateFunction) {
        cardData.updateFunction();
      }
    });
    
    if (activeCards.size > 0) {
      animationFrameId = requestAnimationFrame(updateLoop);
    }
  }
  
  animationFrameId = requestAnimationFrame(updateLoop);
}

// Mostrar cartel para dispositivo específico
function showDeviceInfo(deviceName, deviceType, worldPosition, targetObject = null) {
  console.log('📋 showDeviceInfo llamado:', { deviceName, deviceType, worldPosition, targetObject });
  
  if (!worldPosition) {
    console.warn('Posición 3D no proporcionada para', deviceName);
    return;
  }
  
  createInfoCard(deviceName, deviceType, worldPosition, targetObject);
}

// Actualizar posiciones de todos los carteles (para cuando cambie la cámara)
function updateAllCardPositions() {
  activeCards.forEach((cardData, deviceName) => {
    if (cardData.targetObject && cardData.targetObject.position) {
      // Actualizar usando la posición del objeto 3D
      updateCardPosition(cardData.card, cardData.line, cardData.targetObject.position, deviceName, cardData.targetObject);
    }
  });
}

// Limpiar todos los carteles
function clearAllCards() {
  activeCards.forEach((cardData) => {
    if (cardData.card && cardData.card.parentNode) {
      cardData.card.remove();
    }
    if (cardData.line && cardData.line.parentNode) {
      cardData.line.remove();
    }
  });
  activeCards.clear();
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

export { 
  showDeviceInfo, 
  hideInfoCard, 
  updateAllCardPositions, 
  clearAllCards,
  createCardContainer,
  updateLineConfig,
  getLineConfig,
  setManualLineConfig,
  adjustLineConfigByPosition,
  deviceLineConfig,
  updateTextConfig,
  getTextConfig,
  deviceTextConfig
};
