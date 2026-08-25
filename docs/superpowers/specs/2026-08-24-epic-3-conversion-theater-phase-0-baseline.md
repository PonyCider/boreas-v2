# EPIC 3 — Fase 0: línea base del Teatro de conversión

**Fecha:** 2026-08-24  
**Rama inspeccionada:** `jafet`  
**Alcance:** diagnóstico visual, interactivo y técnico. Sin cambios de implementación.

## Resultado ejecutivo

La sección actual funciona y no desborda horizontalmente, pero no tiene la presencia de un selling point principal. El layout pierde escala en pantallas anchas, desperdicia mucha altura en móvil y el `OptionWheel` introduce una relación débil entre selector y motor.

La arquitectura de carga también contradice el objetivo portable: todos los motores actuales se evalúan con la landing, y el iframe real de Cal.com existe antes de que el usuario se acerque a la sección.

## Evidencia visual

| Ancho | Alto del viewport | Alto de la sección | Alto del documento | Overflow horizontal |
|---:|---:|---:|---:|---:|
| 390 px | 844 px | 2541.59 px | 13240 px | No |
| 768 px | 1024 px | 2404.34 px | 11382 px | No |
| 1024 px | 900 px | 1810.64 px | 9706 px | No |
| 1440 px | 1000 px | 1675.70 px | 8500 px | No |
| 2560 px | 1200 px | 1676.59 px | 8721 px | No |

Capturas:

- `phase0-motors-390.png`
- `phase0-motors-768.png`
- `phase0-motors-1024.png`
- `phase0-motors-1440.png`
- `phase0-motors-2560.png`
- `phase0-motors-preview-1440.png`

Las capturas están fuera del repositorio, en el directorio de visualizaciones de la sesión.

## Hallazgos confirmados

### Presencia y composición

- En 2560 px el contenido conserva casi la misma escala que en 1440 px. El escenario queda como una isla pequeña dentro de una superficie oscura muy grande.
- En 390 px hay un vacío considerable entre la introducción y el motor. El selector ocupa una zona alta sin comunicar progreso ni relación espacial con el contenido.
- El motor se presenta como una tarjeta convencional. No existe una secuencia clara de entrada, descubrimiento, prueba y desenlace.
- `/motores-preview` sirve como galería técnica de motores, pero no prueba la navegación ni la dramaturgia de la landing.

### Interacción del selector

- Teclado: `ArrowDown` cambia `aria-selected` inmediatamente, pero el motor visible tarda cerca de 450 ms en alcanzarlo.
- Ráfaga de teclado: el desfase visible se sostuvo entre 790 y 800 ms antes de sincronizar.
- Rueda: una pasada abajo y arriba terminó sincronizada. La rueda sigue interceptando una acción que normalmente desplaza la página.
- Arrastre: un gesto vertical de aproximadamente 300 px saltó de `Agendamiento` directamente a `Dental`. El control es demasiado sensible y poco predecible.
- Movimiento reducido: con `prefers-reduced-motion: reduce`, selector y motor cambiaron juntos de forma inmediata. Este comportamiento debe preservarse.
- No se reprodujo una desincronización permanente en esta pasada. Sí se confirmó el desfase transitorio entre estado anunciado y contenido visible.

### Carga y portabilidad

- El build de producción carga 15 scripts iniciales para `/`.
- Suma local aproximada de esos scripts: 1,327,391 bytes sin comprimir y 424,033 bytes gzip. Es una suma por archivo, no una medición de transferencia de campo.
- El chunk que contiene el contenido y los motores actuales pesa 57,764 bytes sin comprimir y 20,301 bytes gzip. Está marcado como `async: false` para la landing.
- `OptionWheel` comparte un chunk de 206,931 bytes sin comprimir y 69,907 bytes gzip con otros módulos; no es posible atribuirle todo ese peso.
- El iframe real de Cal.com está en el DOM durante la carga inicial, a unos 1919 px de la parte superior en 1440 px y 2657 px en 390 px. Su solicitud empieza antes de que el usuario llegue a Motores.
- OGL ya forma parte de la ruta crítica por el Hero actual. Cualquier Canvas del Teatro debe vivir en un chunk adicional separado y no cargar si la mejora se rechaza.

### Rendimiento local de producción

Medición local con cache caliente. Sirve para comparar regresiones dentro del mismo entorno; no reemplaza datos de campo.

**1440 × 1000, WebGL por software:**

- LCP: 1584 ms.
- CLS inicial: 0.00035.
- CLS después de entrar a Motores: 0.00117.
- No apareció una nueva tarea larga de 50 ms o más al entrar a Motores.
- La entrada añadió aproximadamente 55 ms de script y 386 ms de tiempo agregado de tareas durante una ventana de 1.8 s.
- La carga inicial produjo tareas largas de 1528 ms y 168 ms bajo SwiftShader. Este resultado está dominado por el fallback de WebGL y no representa una GPU normal.

**390 × 844:**

- LCP: 208 ms.
- CLS: 0.
- Sin tareas largas iniciales ni al entrar a Motores.
- La entrada añadió aproximadamente 52 ms de script y 331 ms de tiempo agregado de tareas durante una ventana de 1.8 s.

### Robustez y consola

- Navegador de desarrollo: sin `warning` ni `error` después de navegar, usar teclado, rueda y arrastre.
- Chrome headless sin contexto WebGL: la landing cae en el error global de Next.js.
- Error heredado observado: `unable to create webgl context`, seguido de `TypeError: Cannot set properties of null (setting 'renderer')`.
- Con SwiftShader habilitado la landing carga completa. El fallo pertenece al Hero/OGL actual, no a Motores, pero condiciona cualquier decisión de añadir otro Canvas.

## Comportamientos que se preservan

- Tema oscuro fijo de la sección.
- Navegación completa por teclado.
- Cambio inmediato y sincronizado con movimiento reducido.
- Cero overflow horizontal en los cinco anchos auditados.
- Demos de especialidad locales, sin guardar ni enviar datos.
- Cal.com como única excepción real, con aviso explícito y sin simular confirmaciones.
- Mensajes de resultado honestos: una demo termina como `demo-completada`, no como cita o solicitud recibida.

## Presupuestos congelados para la implementación

- El wrapper del Teatro puede añadir como máximo **10 KB gzip** al JavaScript inicial.
- El código exclusivo de motores debe quedar fuera de la ruta crítica inicial.
- Dental V2 puede precargarse al acercarse la sección, con `rootMargin` de referencia de 600 px.
- Los demás motores se cargan por intención: foco, hover, selección o navegación directa.
- Cal.com no debe montar su iframe hasta que Agenda sea visible o elegida.
- Un Canvas opcional debe ser un chunk independiente y no solicitarse si la mejora está desactivada o se rechaza.
- En el mismo harness local, LCP no puede empeorar más de 100 ms frente a la mediana de la línea base equivalente.
- Entrar a Motores no puede introducir tareas largas nuevas de 50 ms o más.
- CLS total atribuible a la sección debe permanecer por debajo de 0.01.
- Cero overflow horizontal entre 390 y 2560 px.

## Validación técnica

- `npm test`: 10 archivos, 89 pruebas aprobadas.
- `npx tsc --noEmit`: aprobado.
- `npm run build`: aprobado; `/` y `/motores-preview` permanecen estáticas.
- Lint enfocado: falla únicamente en `components/ui/option-wheel.tsx` con tres errores heredados:
  - actualización de `onChangeRef.current` durante render;
  - actualización de `cfgRef.current` durante render;
  - `runFrame` accedido antes de su declaración.

## Gate

Fase 0 completa. La siguiente fase autorizable es **Fase 0.5: auditoría de solo lectura de los motores existentes en `boreas-template`**. No se inicia sin aprobación explícita.
