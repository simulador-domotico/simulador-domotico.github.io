// Configuración de tamaño para las líneas/cortinas simuladas
// Puedes modificar estos valores y recargar la página.

export const curtainConfig = {
  // Cómo calcular el ANCHO de la línea
  // 'garageWidth'  -> usa el ancho del portón del garaje
  // 'modelWidth'   -> usa el ancho total del modelo
  // 'absolute'     -> usa un valor fijo en unidades de la escena (widthValue)
  widthMode: 'garageWidth',
  widthScale: .11,        // antes 1.0 → más angosto en X
  widthValue: 1.2,        // usado solo si widthMode === 'absolute'

  // Cómo calcular la ALTURA MÁXIMA (cuánto baja la línea)
  // 'garageHeight' -> usa el alto del portón del garaje
  // 'modelHeight'  -> usa el alto total del modelo
  // 'absolute'     -> usa un valor fijo (heightValue)
  heightMode: 'garageHeight',
  heightScale: .45,      // multiplicador (si heightMode != 'absolute')
  heightValue: 1.0,       // usado solo si heightMode === 'absolute'

  // Límites mínimos para evitar tamaños cero
  minWidth: 0.05,
  minHeight: 0.05,
};