import type { Scene } from "./types"


export const scenes: Record<string, Scene> = {
  start: {
    id: "start",
    title: "La Casa Abandonada",
    description:
      "Te encuentras frente a una casa victoriana abandonada. Las ventanas están rotas y la puerta principal cuelga de sus bisagras. Escuchas susurros que vienen del interior. Tu investigación sobre las desapariciones en el pueblo te ha llevado hasta aquí.",
    choices: [
      { text: "Entrar por la puerta principal", nextScene: "frontDoor", sanityChange: -5 },
      { text: "Buscar otra entrada", nextScene: "backEntrance", sanityChange: -2 },
      { text: "Irte del lugar", nextScene: "cowardEnding", sanityChange: 0 },
    ],
  },
  frontDoor: {
    id: "frontDoor",
    title: "El Vestíbulo",
    description:
      "El interior está sumido en una oscuridad casi total. Tus pasos resuenan en el suelo de madera podrida. Sientes que algo te observa desde las sombras. En la pared hay fotografías familiares, pero los rostros han sido arrancados.",
    choices: [
      { text: "Subir las escaleras", nextScene: "upstairs", sanityChange: -8 },
      { text: "Explorar la cocina", nextScene: "kitchen", sanityChange: -3 },
      { text: "Examinar las fotografías", nextScene: "photographs", sanityChange: -10 },
    ],
  },
  backEntrance: {
    id: "backEntrance",
    title: "El Jardín Trasero",
    description:
      "El jardín está lleno de maleza y árboles muertos. Encuentras una ventana del sótano entreabierta. Desde abajo llega un olor putrefacto y el sonido de algo arrastrándose.",
    choices: [
      { text: "Bajar al sótano", nextScene: "basement", sanityChange: -15 },
      { text: "Entrar por la ventana de la cocina", nextScene: "kitchen", sanityChange: -5 },
      { text: "Rodear la casa", nextScene: "frontDoor", sanityChange: -2 },
    ],
  },
  upstairs: {
    id: "upstairs",
    title: "El Segundo Piso",
    description:
      "Los pasillos están llenos de puertas cerradas. Escuchas llantos de niños que vienen de una de las habitaciones. Las paredes están cubiertas de arañazos profundos, como si alguien hubiera intentado escapar.",
    choices: [
      { text: "Seguir los llantos", nextScene: "nursery", sanityChange: -12 },
      { text: "Abrir la puerta del dormitorio principal", nextScene: "masterBedroom", sanityChange: -8 },
      { text: "Bajar corriendo", nextScene: "kitchen", sanityChange: -5 },
    ],
  },
  kitchen: {
    id: "kitchen",
    title: "La Cocina",
    description:
      "La cocina está en ruinas. Hay platos sucios apilados con comida podrida de hace décadas. En la mesa encuentras un diario abierto con una entrada reciente... pero eso es imposible.",
    choices: [
      { text: "Leer el diario", nextScene: "diary", sanityChange: -10 },
      { text: "Revisar la despensa", nextScene: "pantry", sanityChange: -5 },
      { text: "Salir por la puerta trasera", nextScene: "backyard", sanityChange: 0 },
    ],
  },
  basement: {
    id: "basement",
    title: "El Sótano",
    description:
      "El sótano está inundado con agua negra hasta los tobillos. Hay cadenas colgando del techo y manchas oscuras en las paredes. Escuchas respiración pesada que no es tuya.",
    choices: [
      { text: "Investigar las cadenas", nextScene: "chains", sanityChange: -20 },
      { text: "Seguir el sonido de la respiración", nextScene: "entity", sanityChange: -25 },
      { text: "Huir inmediatamente", nextScene: "backEntrance", sanityChange: -8 },
    ],
  },
  photographs: {
    id: "photographs",
    title: "Las Fotografías",
    description:
      "Al examinar las fotografías más de cerca, te das cuenta de que los rostros no fueron arrancados... nunca estuvieron ahí. Las fotografías muestran cuerpos sin cabeza en poses familiares. En una de ellas reconoces tu propia ropa.",
    choices: [
      { text: "Huir de la casa", nextScene: "madnessEnding", sanityChange: -30 },
      { text: "Buscar más fotografías", nextScene: "darkTruth", sanityChange: -15 },
      { text: "Negar lo que ves", nextScene: "denial", sanityChange: -10 },
    ],
  },
  nursery: {
    id: "nursery",
    title: "La Habitación de los Niños",
    description:
      "La habitación está llena de juguetes rotos y cunas vacías. Los llantos se detienen abruptamente cuando entras. En la pared hay dibujos infantiles que muestran figuras oscuras llevándose a niños.",
    choices: [
      { text: "Examinar los dibujos", nextScene: "drawings", sanityChange: -15 },
      { text: "Revisar debajo de las camas", nextScene: "underBed", sanityChange: -20 },
      { text: "Salir lentamente", nextScene: "upstairs", sanityChange: -5 },
    ],
  },
  diary: {
    id: "diary",
    title: "El Diario",
    description:
      'La entrada del diario está fechada hoy. Dice: "El nuevo visitante ha llegado. Pronto se unirá a nosotros como los demás. La casa tiene hambre y yo soy su sirviente." La letra es idéntica a la tuya.',
    choices: [
      { text: "Seguir leyendo", nextScene: "darkTruth", sanityChange: -20 },
      { text: "Quemar el diario", nextScene: "burnDiary", sanityChange: -10 },
      { text: "Huir inmediatamente", nextScene: "escapeAttempt", sanityChange: -15 },
    ],
  },
  entity: {
    id: "entity",
    title: "El Encuentro",
    description:
      "En la esquina más oscura del sótano, ves una figura humanoide pero distorsionada. Sus extremidades son demasiado largas y su rostro... no tiene rostro. Te mira directamente y sonríe con una boca que no debería existir.",
    choices: [
      { text: "Enfrentar a la entidad", nextScene: "confrontation", sanityChange: -30 },
      { text: "Intentar comunicarte", nextScene: "communication", sanityChange: -25 },
      { text: "Correr sin mirar atrás", nextScene: "madnessEnding", sanityChange: -35 },
    ],
  },
  darkTruth: {
    id: "darkTruth",
    title: "La Verdad Oscura",
    description:
      "Comprendes la horrible verdad: nunca saliste de la casa. Has estado aquí durante años, décadas tal vez. Eres parte de la casa ahora, atrayendo a nuevos visitantes para alimentar su hambre insaciable.",
    isEnding: true,
    endingType: "truth",
    choices: [],
  },
  madnessEnding: {
    id: "madnessEnding",
    title: "La Locura",
    description:
      "Tu mente se quiebra bajo el peso de lo imposible. Despiertas en un hospital psiquiátrico, pero las enfermeras tienen los mismos rostros sin facciones que viste en las fotografías. ¿Estás realmente despierto?",
    isEnding: true,
    endingType: "madness",
    choices: [],
  },
  cowardEnding: {
    id: "cowardEnding",
    title: "La Huida",
    description:
      "Decides que tu vida vale más que cualquier investigación. Te alejas de la casa, pero en el espejo retrovisor de tu auto ves que la casa te sigue. Cada vez que miras, está más cerca.",
    isEnding: true,
    endingType: "coward",
    choices: [],
  },
  escapeAttempt: {
    id: "escapeAttempt",
    title: "Intento de Escape",
    description:
      "Corres hacia la puerta, pero cada vez que la alcanzas, apareces de nuevo en el vestíbulo. La casa no te dejará ir. Escuchas tu propia risa viniendo de arriba.",
    choices: [
      { text: "Aceptar tu destino", nextScene: "darkTruth", sanityChange: -20 },
      { text: "Seguir intentando escapar", nextScene: "madnessEnding", sanityChange: -25 },
    ],
  },
}