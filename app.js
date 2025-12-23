/* Oráculo del Plan (plano) — MVP
   - Sin frameworks
   - Contenido embebido (luego lo podés mover a JSON aparte)
   - Event logging: stub (console + memory). Luego conectás a Worker/D1.
*/

const APP = document.getElementById("app");
const RESET_BTN = document.getElementById("btn-reset");

/** --------- Contenido (mínimo viable) --------- **/
const CONTENT_VERSION = "0.1.0";

const TAX = {
  relation: [
    { id: "rel_pareja", label: "Pareja" },
    { id: "rel_amigos", label: "Amistad" },
    { id: "rel_familia", label: "Familia" },
    { id: "rel_laburo", label: "Laburo" },
  ],
  plan_type: [
    { id: "p_tranqui", label: "Salida tranqui" },
    { id: "p_social", label: "Salida social" },
    { id: "p_viaje", label: "Viaje / escapada" },
    { id: "p_familia", label: "Visita familiar" },
    { id: "p_compra", label: "Compra grande" },
    { id: "p_rutina", label: "Cambio de rutina" },
    { id: "p_cultura", label: "Plan cultura" },
    { id: "p_aventura", label: "Plan aventura" },
  ],
  stakes: [
    { id: "stk_bajo", label: "Bajo" },
    { id: "stk_medio", label: "Medio" },
    { id: "stk_alto", label: "Alto" },
  ],
  channel: [
    { id: "ch_whatsapp", label: "WhatsApp" },
    { id: "ch_cara", label: "Cara a cara" },
  ],
  mood: [
    { id: "m_cansado", label: "Cansado/a" },
    { id: "m_hambre", label: "Con hambre" },
    { id: "m_estres", label: "Estresado/a" },
    { id: "m_buenhumor", label: "De buen humor" },
    { id: "m_pocotiempo", label: "Con poco tiempo" },
    { id: "m_sensible", label: "Sensible" },
    { id: "m_irritable", label: "Irritable" },
    { id: "m_distraido", label: "Entusiasmado/a con otra cosa" },
    { id: "m_nomolestar", label: "En modo 'no me jodan'" },
    { id: "m_neutral", label: "Neutral" },
  ],
  archetype: [
    { id: "a_practico", label: "Práctico/a" },
    { id: "a_romantico", label: "Romántico/a" },
    { id: "a_abogado", label: "Abogado/a" },
    { id: "a_terco", label: "Terco/a" },
    { id: "a_zen", label: "Zen" },
  ],
  resistance: [
    { id: "r_fiaca", label: "Me da fiaca" },
    { id: "r_tiempo", label: "No tengo tiempo" },
    { id: "r_plata", label: "No tengo plata / está caro" },
    { id: "r_gente", label: "No me pinta con esa gente/lugar" },
    { id: "r_cansancio", label: "Estoy cansado/a" },
    { id: "r_nopinta", label: "No quiero / no me pinta" },
  ],
};

// 60 openers (resumen: usamos los 60 IDs/ideas que armamos; aquí están todos)
const OPENERS = [
  // good
  mkOp("op_001","Te propongo algo, pero lo armamos juntos. ¿Qué tendría que tener para que te cope?","good",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_002","Dame 30 segundos: si no te convence, lo soltamos.","good",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_003","Antes de convencerte, quiero entenderte: ¿qué parte te tranca?","good",["VALIDAR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_004","Te tiro dos opciones: una más vos y una más yo. ¿Cuál te cierra más?","good",["OPCIONES"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_005","Probemos 30 minutos. Si no pinta, nos vamos sin culpa.","good",["PRUEBA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_006","Si ahora estás en modo ‘no’, lo respeto. ¿Lo hablamos después de comer/descansar?","good",["PAUSA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_007","No es ‘un plan’, es un ratito para estar bien. ¿Qué te haría sentir cómodo/a?","good",["MARCO"],["a_romantico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_008","Si yo resuelvo lo pesado (horario/traslado), ¿te cambia algo?","good",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_009","Te propongo A y B con pros y contras. Elegí con evidencia.","good",["OPCIONES"],["a_abogado","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_010","No quiero empujarte. Quiero saber qué te haría decir ‘sí’ de verdad.","good",["VALIDAR"],["a_terco","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_011","Hagamos versión mini: si está bien, lo extendemos; si no, cerramos ahí.","good",["PRUEBA"],["a_terco","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_012","Te tiro una idea en 2 líneas y vos me decís qué le falta para que te cope 🙂","good",["PUENTE"],["ALL"],["ch_whatsapp"]),
  mkOp("op_013","Lo dejo fácil: yo coordino todo. Solo decime ‘A’ o ‘B’.","good",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp"]),
  mkOp("op_014","¿Qué haría que este plan se sienta liviano, no obligación?","good",["VALIDAR"],["a_zen","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_015","Si te diera control total del horario, ¿te subís?","good",["CIERRE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_016","Lo que busco es que terminemos el día mejor que como empezó. ¿Qué plan ayuda a eso?","good",["MARCO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_017","Opción rápida (poco tiempo) vs opción linda (más tiempo). ¿Cuál preferís?","good",["OPCIONES"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_018","Ok, vendeme tu ‘no’: ¿qué lo sostiene?","good",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_019","Tiene sentido que te dé fiaca. ¿Es energía, tiempo o ganas?","good",["VALIDAR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_020","Lo probamos con salida de emergencia: si no va, nos vamos.","good",["PRUEBA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_021","Vengo con una propuesta y cero intención de pelear. Soy una paloma de paz 🕊️","good",["HUMOR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_022","Te propongo algo… y prometo no hacer powerpoint 😅","good",["HUMOR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_023","Yo llevo/gestiono X. Vos solo elegís el horario.","good",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_024","Definamos el criterio: ¿qué sería ‘buen plan’ para vos hoy?","good",["PUENTE"],["a_abogado","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_025","No quiero que sea perfecto, quiero que sea lindo para vos. ¿Qué detalle importa?","good",["MARCO"],["a_romantico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_026","Si hoy no, todo bien. ¿Qué día te sentirías más disponible?","good",["PAUSA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_027","Necesito un ‘sí’ honesto o un ‘no’ con motivo. ¿Cuál es?","good",["CIERRE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_028","Te doy dos alternativas reales. Elegí una o proponé la tuya.","good",["OPCIONES"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_029","No quiero ganarte una discusión; quiero que los dos estemos bien. ¿Qué te serviría?","good",["VALIDAR"],["a_terco","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_030","Si lo hago simple y barato, ¿te pinta más? (sí/no)","good",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp"]),
  // neutral
  mkOp("op_031","Te muestro la idea y la destruís con cariño: ¿qué mejorarías?","neutral",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_032","¿Qué te preocupa más de este plan: tiempo, plata o energía?","neutral",["VALIDAR"],["a_abogado","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_033","¿Preferís algo tranquilo o algo con movimiento?","neutral",["OPCIONES"],["a_zen","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_034","Hagamos versión ‘piloto’. Sin compromiso.","neutral",["PRUEBA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_035","Te traigo un plan con garantía: si no gusta, se devuelve 😄","neutral",["HUMOR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_036","¿Qué tendría que pasar para que tu ‘no’ se vuelva ‘capaz’?","neutral",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_037","Decime tus límites (tiempo/plata) y lo adapto.","neutral",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_038","Me gustaría compartir algo con vos. ¿Qué te haría sentir cuidado/a?","neutral",["MARCO"],["a_romantico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_039","No lo decidas ahora. Solo decime qué parte te pesa y lo ajusto.","neutral",["PAUSA"],["ALL"],["ch_whatsapp"]),
  mkOp("op_040","Te doy el control: elegís el lugar o el horario.","neutral",["CIERRE"],["ALL"],["ch_whatsapp","ch_cara"]),
  // bad
  mkOp("op_041","Dale, no seas así.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_042","Siempre es lo mismo con vos.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_043","Ya está, vamos y punto.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_044","No tiene sentido que digas que no.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_045","Si me quisieras, irías.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_046","Bueno, hacé lo que quieras entonces.","bad",["MALO"],["ALL"],["ch_whatsapp"]),
  mkOp("op_047","No me discutas, solo vení.","bad",["MALO"],["a_abogado","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_048","Te estás poniendo caprichoso/a.","bad",["MALO"],["a_terco","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_049","Dejá de dar vueltas y decidí.","bad",["MALO"],["a_zen","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_050","No cuesta nada, ¿qué te pasa?","bad",["MALO"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_051","Me debés esta.","bad",["MALO"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_052","Si no venís me enojo.","bad",["MALO"],["ALL"],["ch_whatsapp"]),
  // extra “potentes”
  mkOp("op_053","No quiero convencerte: quiero que el plan sea mejor. ¿Qué le falta?","good",["PUENTE"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_054","Elegí: versión mini (corta) o versión comfy (tranqui).","good",["OPCIONES"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_055","Vamos con cláusula de salida: si a los 20 min no pinta, nos vamos.","good",["PRUEBA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_056","Si hoy no te da la energía, te banco. ¿Qué te ayudaría a recargar?","good",["VALIDAR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_057","Yo me ocupo de todo lo incómodo. Vos solo venís a existir.","good",["LOGISTICA"],["a_practico","ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_058","Estoy negociando con ternura, no con presión. ¿Qué oferta te sirve?","good",["HUMOR"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_059","No lo resolvamos en caliente. ¿Lo charlamos cuando estemos tranquis?","good",["PAUSA"],["ALL"],["ch_whatsapp","ch_cara"]),
  mkOp("op_060","Dame una condición justa y lo hacemos a tu manera.","good",["CIERRE"],["ALL"],["ch_whatsapp","ch_cara"]),
];

// Simulación: 6 resistencias, 3 respuestas c/u. En cada ronda se muestran 2 de 3.
const SIM = {
  r_fiaca: [
    simOpt("s1a","VALIDAR_PUENTE","Te entiendo. ¿Es fiaca por cansancio, por el plan o por la gente?", { empathy: 6, other_openness: 4 }),
    simOpt("s1b","PRUEBA","Hagamos versión mini: 30 minutos. Si no pinta, nos vamos.", { friction_down: 6, other_control: 2 }),
    simOpt("s1c","LOGISTICA","La hago fácil: yo organizo todo y vos solo elegís horario.", { friction_down: 4, other_control: 4 })
  ],
  r_tiempo: [
    simOpt("s2a","OPCIONES","Ok. Opción corta (45 min) u opción tranqui (más rato). ¿Cuál te sirve?", { structure: 4, other_control: 2 }),
    simOpt("s2b","PRUEBA","Vamos con límite claro: a tal hora terminamos sí o sí.", { structure: 6, other_control: 2 }),
    simOpt("s2c","PAUSA","Perfecto. ¿Qué día te queda mejor de verdad? Yo me adapto.", { empathy: 4, other_openness: 2 })
  ],
  r_plata: [
    simOpt("s3a","PUENTE","¿Cuánto sería ‘razonable’ para vos hoy?", { empathy: 3, other_control: 3 }),
    simOpt("s3b","OPCIONES","Plan barato vs plan cero gasto. Elegí y lo hacemos igual.", { structure: 4, friction_down: 2 }),
    simOpt("s3c","MARCO","Que no sea caro no significa que sea feo. Hagamos algo simple pero lindo.", { empathy: 4, other_openness: 2 })
  ],
  r_gente: [
    simOpt("s4a","VALIDAR","Bien. ¿Qué de eso te incomoda: la gente, el ambiente o el plan?", { empathy: 5, other_openness: 3 }),
    simOpt("s4b","OPCIONES","Cambiamos la variable: mismo plan en otro lugar, o mismo lugar pero otro plan.", { structure: 4, other_control: 2 }),
    simOpt("s4c","PRUEBA","Vamos un rato y, si no te sentís cómodo/a, nos vamos sin explicación.", { friction_down: 5, other_control: 2 })
  ],
  r_cansancio: [
    simOpt("s5a","VALIDAR","Ok, te re banco. ¿Qué te ayudaría: algo tranqui o quedarnos en modo descanso?", { empathy: 6, other_openness: 2 }),
    simOpt("s5b","OPCIONES","Plan sofá (cero energía) o plan paseo corto (aire y vuelta).", { structure: 4, friction_down: 2 }),
    simOpt("s5c","PAUSA","Hagámoslo mañana. Hoy prioricemos que descanses.", { empathy: 5, other_openness: 2 })
  ],
  r_nopinta: [
    simOpt("s6a","PUENTE","Entiendo. ¿Querés contarme qué te hace decir que no?", { empathy: 5, other_openness: 3 }),
    simOpt("s6b","CIERRE","Ok. Si te diera control total (horario/lugar), ¿cambia algo?", { other_control: 5, structure: 2 }),
    simOpt("s6c","PLAN_B","Perfecto. Entonces plan B: hacemos otra cosa que sí te guste. ¿Qué proponés?", { empathy: 5, friction_down: 3 })
  ]
};

// 5 resultados finales (los combos que definimos)
const RESULTS = [
  {
    id: "res_01_puente_opciones",
    name: "Puente + Dos opciones",
    modules: ["PUENTE", "OPCIONES"],
    baseProb: 0.72,
    baseRange: 0.08,
    bestFor: { archetype: ["a_abogado","a_practico"], stakes: ["stk_medio","stk_alto"] },
    scripts: {
      ch_whatsapp: [
        "Te propongo un plan, pero lo armamos juntos.",
        "¿Qué tendría que tener para que te cope?",
        "Te tiro dos opciones:",
        "A) {optionA}",
        "B) {optionB}",
        "¿Cuál te cierra más?"
      ],
      ch_cara: [
        "Quiero proponerte algo, pero no quiero empujarte.",
        "¿Qué tendría que tener para que te cope?",
        "Te doy dos opciones y elegís vos."
      ]
    }
  },
  {
    id: "res_02_prueba_salida",
    name: "Micro-prueba + Salida elegante",
    modules: ["PRUEBA", "PLAN_B"],
    baseProb: 0.68,
    baseRange: 0.11,
    bestFor: { archetype: ["a_terco"], stakes: ["stk_bajo","stk_medio"] },
    scripts: {
      ch_whatsapp: [
        "Hagamos versión mini: 30 min.",
        "Si no pinta, nos volvemos y listo.",
        "¿Te sirve así?"
      ],
      ch_cara: [
        "No te estoy pidiendo un compromiso.",
        "Probemos un rato. Si a los 20–30 min no pinta, nos vamos sin drama."
      ]
    }
  },
  {
    id: "res_03_validar_logistica",
    name: "Validación + Resolver logística",
    modules: ["VALIDAR", "LOGISTICA"],
    baseProb: 0.75,
    baseRange: 0.085,
    bestFor: { archetype: ["a_practico"], stakes: ["stk_medio","stk_alto","stk_bajo"] },
    scripts: {
      ch_whatsapp: [
        "Te entiendo. ¿Qué te pesa más: tiempo, plata o energía?",
        "Decime cuál y lo dejo armado."
      ],
      ch_cara: [
        "Ok, no te voy a convencer con poesía.",
        "Decime qué te tranca: tiempo, plata o energía.",
        "Lo resuelvo y vos decidís."
      ]
    }
  },
  {
    id: "res_04_pausa_cierre",
    name: "Pausa estratégica + Cierre con elección",
    modules: ["PAUSA", "CIERRE"],
    baseProb: 0.62,
    baseRange: 0.145,
    bestFor: { archetype: ["a_terco","a_abogado","a_zen","a_practico","a_romantico"], stakes: ["stk_alto"] },
    scripts: {
      ch_whatsapp: [
        "Creo que hoy no es el mejor momento para decidirlo.",
        "¿Lo hablamos más tarde / después de comer?",
        "Te voy a traer 2 opciones y elegís."
      ],
      ch_cara: [
        "No quiero que esto termine mal.",
        "Pausamos y lo retomamos cuando estemos tranquis.",
        "Después te traigo dos opciones para elegir."
      ]
    }
  },
  {
    id: "res_05_marco_humor",
    name: "Marco de significado + Humor suave",
    modules: ["MARCO", "HUMOR"],
    baseProb: 0.70,
    baseRange: 0.11,
    bestFor: { archetype: ["a_romantico","a_zen"], stakes: ["stk_bajo","stk_medio"] },
    scripts: {
      ch_whatsapp: [
        "Vengo con una propuesta sin powerpoint 😅",
        "No es por el plan en sí, es por compartir un ratito lindo con vos.",
        "¿Qué haría que te sientas cómodo/a para que te pinte?"
      ],
      ch_cara: [
        "Te propongo esto no para ‘ganar’, sino para estar bien.",
        "Decime qué detalle lo haría lindo para vos. Prometo negociar con ternura."
      ]
    }
  }
];

/** --------- Estado + motor --------- **/
let state = null;

function freshState() {
  const seed = cryptoSeed();
  return {
    contentVersion: CONTENT_VERSION,
    seed,
    rng: mulberry32(seed),
    step: "home",
    startedAt: Date.now(),
    // selections
    relationId: null,
    planTypeId: null,
    stakesId: null,
    channelId: null,
    moodId: null,
    archetypeId: null,
    // openers selection
    openersShown: [],
    openerBestId: null,
    openerWorstId: null,
    // simulation
    resistanceShown: [],
    resistanceId: null,
    simRound: 0,
    simChoices: [],
    // hidden sliders
    sliders: {
      directness: 50,
      empathy: 50,
      structure: 50,
      other_openness: 50,
      other_control: 50,
      sensitivity: 50
    },
    // result
    resultId: null,
    prob: null,
    range: null,
    // events (local)
    events: []
  };
}

function mkOp(id, text, quality, modules, archetypes, channels) {
  return { id, text, quality, modules, archetypes, channels };
}
function simOpt(id, module, text, effects) {
  return { id, module, text, effects };
}

/** --------- Event logging (stub) --------- **/
function logEvent(type, payload) {
  const e = { ts: new Date().toISOString(), type, payload };
  state.events.push(e);
  // En producción: POST a tu Worker (/api/event)
  // Por ahora: consola para ver que funciona
  // eslint-disable-next-line no-console
  console.log("[event]", e);
}

/** --------- Helpers --------- **/
function cryptoSeed() {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] >>> 0;
}

// RNG reproducible
function mulberry32(a) {
  return function() {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sample(arr, n, rng) {
  const copy = arr.slice();
  const out = [];
  const k = Math.min(n, copy.length);
  for (let i = 0; i < k; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function labelFor(tax, id) {
  const item = tax.find(x => x.id === id);
  return item ? item.label : id;
}

function isMoodSpicy(moodId) {
  return ["m_irritable","m_sensible","m_nomolestar","m_hambre"].includes(moodId);
}

function openerCompatible(op) {
  // channel match
  const chOk = op.channels.includes(state.channelId) || op.channels.includes("ch_whatsapp") && state.channelId==="ch_whatsapp" || op.channels.includes("ch_cara") && state.channelId==="ch_cara";
  // archetype match
  const aOk = op.archetypes.includes("ALL") || op.archetypes.includes(state.archetypeId);
  return chOk && aOk;
}

function buildOpenersSet() {
  const rng = state.rng;
  const compat = OPENERS.filter(openerCompatible);

  const goods = compat.filter(o => o.quality === "good");
  const neutrals = compat.filter(o => o.quality === "neutral");
  const bads = compat.filter(o => o.quality === "bad");

  const chosen = [
    ...sample(goods, 2, rng),
    ...sample(neutrals, 1, rng),
    ...sample(bads, 1, rng),
  ];

  // shuffle
  return sample(chosen, chosen.length, rng);
}

function buildDeckPlanTypes() {
  return sample(TAX.plan_type, 4, state.rng);
}
function buildDeckMoods() {
  return sample(TAX.mood, 5, state.rng);
}
function buildDeckResistances() {
  return sample(TAX.resistance, 3, state.rng);
}

function applyOpenerEffects(openerId, isBest) {
  const opener = OPENERS.find(o => o.id === openerId);
  if (!opener) return;

  // Base scoring rules
  if (isBest) {
    if (opener.quality === "good") bumpProb(+0.08);
    if (opener.quality === "neutral") bumpProb(+0.03);
    if (opener.quality === "bad") bumpProb(-0.12);
  } else {
    // "worst"
    if (opener.quality === "bad") bumpProb(+0.08);
    if (opener.quality === "neutral") bumpProb(+0.01);
    if (opener.quality === "good") bumpProb(-0.02); // raro, pero si marca como peor algo bueno, resta un poco
  }

  // Slider nudges
  if (opener.modules.includes("VALIDAR") || opener.modules.includes("PUENTE")) {
    state.sliders.empathy = clamp(state.sliders.empathy + (isBest ? 6 : -2), 0, 100);
    state.sliders.other_openness = clamp(state.sliders.other_openness + (isBest ? 4 : -1), 0, 100);
  }
  if (opener.modules.includes("OPCIONES") || opener.modules.includes("CIERRE")) {
    state.sliders.structure = clamp(state.sliders.structure + (isBest ? 4 : -1), 0, 100);
    state.sliders.other_control = clamp(state.sliders.other_control + (isBest ? 2 : 0), 0, 100);
  }
  if (opener.modules.includes("PRUEBA") || opener.modules.includes("LOGISTICA")) {
    state.sliders.structure = clamp(state.sliders.structure + (isBest ? 2 : 0), 0, 100);
    state.sliders.other_control = clamp(state.sliders.other_control + (isBest ? 1 : 0), 0, 100);
  }
}

function applySimEffects(simId) {
  const all = Object.values(SIM).flat();
  const opt = all.find(o => o.id === simId);
  if (!opt) return;

  // Effects map into sliders/prob bumps
  const ef = opt.effects || {};
  if (ef.empathy) state.sliders.empathy = clamp(state.sliders.empathy + ef.empathy, 0, 100);
  if (ef.structure) state.sliders.structure = clamp(state.sliders.structure + ef.structure, 0, 100);
  if (ef.other_openness) state.sliders.other_openness = clamp(state.sliders.other_openness + ef.other_openness, 0, 100);
  if (ef.other_control) state.sliders.other_control = clamp(state.sliders.other_control + ef.other_control, 0, 100);
  if (ef.friction_down) bumpProb(ef.friction_down * 0.01);

  // Module based bump
  if (opt.module === "PRUEBA") bumpProb(+0.06);
  if (opt.module === "PAUSA" && isMoodSpicy(state.moodId)) bumpProb(+0.06);
  if (opt.module === "VALIDAR" || opt.module === "VALIDAR_PUENTE") bumpProb(+0.04);
}

let probBumpAccum = 0;
function bumpProb(delta) { probBumpAccum += delta; }

/** --------- Result selection + text generation --------- **/
function pickResult() {
  // heuristic: choose result by archetype/mood/stakes/resistance
  const a = state.archetypeId;
  const s = state.stakesId;
  const spicy = isMoodSpicy(state.moodId);

  // If stakes high + spicy mood -> pause/cierre
  if (s === "stk_alto" && spicy) return "res_04_pausa_cierre";

  // If practical archetype or resistance about time/plata -> validar/logistica
  if (a === "a_practico" || ["r_tiempo","r_plata"].includes(state.resistanceId)) return "res_03_validar_logistica";

  // If lawyer -> puente/opciones
  if (a === "a_abogado") return "res_01_puente_opciones";

  // If romantic or zen -> marco/humor (unless stakes high)
  if ((a === "a_romantico" || a === "a_zen") && s !== "stk_alto") return "res_05_marco_humor";

  // If stubborn -> prueba/salida
  if (a === "a_terco" && s !== "stk_alto") return "res_02_prueba_salida";

  // Default: if user chose good opener + good worst, lean to puente/opciones
  return "res_01_puente_opciones";
}

function computeProbability(result) {
  // Base
  let p = result.baseProb;

  // Context penalties
  const spicy = isMoodSpicy(state.moodId);
  if (state.stakesId === "stk_alto" && spicy) p -= 0.06;
  if (state.channelId === "ch_whatsapp" && state.stakesId === "stk_alto" && spicy) p -= 0.04;

  // Context bonuses
  if (state.stakesId !== "stk_alto") p += 0.02;

  // Effects from choices
  p += probBumpAccum;

  // Small jitter (seeded)
  const jitter = (state.rng() * 0.06) - 0.03; // [-0.03,+0.03]
  p += jitter;

  // Clamp
  p = clamp(p, 0.05, 0.95);

  // Range
  let r = result.baseRange;
  if (state.stakesId === "stk_alto") r += 0.02;
  if (spicy) r += 0.02;

  // Reduce uncertainty if user chose pause/validar patterns
  const chosenModules = collectChosenModules();
  if (chosenModules.has("PAUSA") || chosenModules.has("VALIDAR")) r -= 0.01;

  // Contradiction: best was "bad"
  const best = OPENERS.find(o => o.id === state.openerBestId);
  if (best && best.quality === "bad") r += 0.03;

  r = clamp(r, 0.04, 0.22);

  return { p, r };
}

function collectChosenModules() {
  const set = new Set();
  const best = OPENERS.find(o => o.id === state.openerBestId);
  const worst = OPENERS.find(o => o.id === state.openerWorstId);
  if (best) best.modules.forEach(m => set.add(m));
  if (worst) worst.modules.forEach(m => set.add(m));
  // simulation choices
  const all = Object.values(SIM).flat();
  for (const id of state.simChoices) {
    const opt = all.find(o => o.id === id);
    if (opt) set.add(opt.module);
  }
  return set;
}

function makeOptionAB() {
  // Light templates for plan types (keeps it variable)
  const plan = state.planTypeId;
  const rng = state.rng;
  const variants = {
    p_tranqui: [
      ["cortito y cómodo: café/paseo de 45 min", "tranqui pero lindo: merienda + caminata"],
      ["mini: salimos a tomar aire 30–45 min", "comfy: merienda sin apuro"]
    ],
    p_social: [
      ["versión mini: caemos un ratito y nos vamos temprano", "versión full: quedarnos un poco más si pinta"],
      ["plan corto: saludamos y listo", "plan lindo: quedarnos hasta que esté cómodo"]
    ],
    p_viaje: [
      ["escapada mini: ida y vuelta en el día", "escapada comfy: una noche, sin apuro"],
      ["plan seguro: todo organizado y simple", "plan lindo: con un detalle especial"]
    ],
    p_familia: [
      ["pasada corta: saludo, mate y vuelta", "pasada tranqui: vamos con tiempo y nos vamos temprano"],
      ["plan mini: 45 min", "plan comfy: un rato más si estás bien"]
    ],
    p_compra: [
      ["mirar opciones 20 min y listo", "comparar bien y decidir sin apuro"],
      ["solo ver: sin comprar hoy", "ver y cerrar si te convence"]
    ],
    p_rutina: [
      ["probar 1 semana y vemos", "armar un plan cómodo para sostenerlo"],
      ["cambio mini: un ajuste chico", "cambio comfy: con ritmo y sin presión"]
    ],
    p_cultura: [
      ["algo corto y simple (1 hora)", "algo lindo con salida tranquila"],
      ["plan mini: una función corta", "plan comfy: con cafecito antes/después"]
    ],
    p_aventura: [
      ["versión suave: fácil y corta", "versión linda: un poco más completa"],
      ["probar sin compromiso: 30–45 min", "si pinta, lo extendemos"]
    ]
  };
  const list = variants[plan] || variants.p_tranqui;
  const pair = list[Math.floor(rng() * list.length)];
  return { optionA: pair[0], optionB: pair[1] };
}

function renderScriptLines(result, channelId) {
  const key = channelId;
  const lines = (result.scripts[key] || []).slice();
  const { optionA, optionB } = makeOptionAB();
  return lines.map(l => l.replace("{optionA}", optionA).replace("{optionB}", optionB));
}

/** --------- Rendering --------- **/
function setStep(step) {
  state.step = step;
  logEvent("step_view", { step });
  render();
}

function render() {
  switch (state.step) {
    case "home": return renderHome();
    case "relation": return renderPick("Relación", "¿Con quién estás negociando este plan?", TAX.relation, (id)=>{ state.relationId=id; logEvent("choice",{step:"relation",id}); setStep("plan_type"); });
    case "plan_type": return renderDeckPick("Tipo de plan", "Elegí el tipo de plan (baraja aleatoria).", buildDeckPlanTypes(), (id)=>{ state.planTypeId=id; logEvent("choice",{step:"plan_type",id}); setStep("stakes"); });
    case "stakes": return renderPick("Importancia", "¿Qué tan importante es este plan?", TAX.stakes, (id)=>{ state.stakesId=id; logEvent("choice",{step:"stakes",id}); setStep("channel"); });
    case "channel": return renderPick("Canal", "¿Cómo lo vas a proponer?", TAX.channel, (id)=>{ state.channelId=id; logEvent("choice",{step:"channel",id}); setStep("mood"); });
    case "mood": return renderDeckPick("Clima emocional", "¿Cómo está la cosa hoy? (baraja aleatoria)", buildDeckMoods(), (id)=>{ state.moodId=id; logEvent("choice",{step:"mood",id}); setStep("archetype"); });
    case "archetype": return renderPick("NPC del otro", "Elegí el arquetipo (en clichés cariñosos).", TAX.archetype, (id)=>{ state.archetypeId=id; logEvent("choice",{step:"archetype",id}); setStep("openers"); });
    case "openers": return renderOpeners();
    case "resistance": return renderDeckPick("La resistencia típica", "¿Qué te suele tirar cuando intentás cambiar el plan?", state.resistanceShown.length?state.resistanceShown: (state.resistanceShown=buildDeckResistances()), (id)=>{ state.resistanceId=id; logEvent("choice",{step:"resistance",id}); state.simRound=0; state.simChoices=[]; setStep("simulation"); });
    case "simulation": return renderSimulation();
    case "result": return renderResult();
    default: return renderHome();
  }
}

function renderHome() {
  const html = `
    <h1 class="h">Te leo la mano: cómo cambiarle la opinión sobre un plan</h1>
    <p class="p">Respondé decisiones rápidas. Te doy un plan con porcentaje y guión listo para <span class="pill">WhatsApp</span> y <span class="pill">cara a cara</span>.</p>

    <div class="kpi">
      <div class="badge">⏱️ 90–120s</div>
      <div class="badge">🧠 Sin texto libre</div>
      <div class="badge">🕊️ Sin presión ni culpa</div>
    </div>

    <div class="hr"></div>

    <div class="row">
      <button class="btn btn-primary" id="btn-start">Empezar</button>
      <button class="btn btn-ghost" id="btn-how">¿Qué guarda?</button>
    </div>

    <div id="how" style="display:none; margin-top:12px">
      <div class="codebox">Guardamos solo IDs de opciones elegidas (ej. "mood=irritable") + tiempos.
No guardamos nombre, email, ubicación, contactos, ni texto libre.</div>
    </div>
  `;
  APP.innerHTML = html;

  document.getElementById("btn-start").onclick = () => {
    logEvent("session_start", { contentVersion: state.contentVersion, seed: state.seed });
    setStep("relation");
  };
  document.getElementById("btn-how").onclick = () => {
    const el = document.getElementById("how");
    el.style.display = el.style.display === "none" ? "block" : "none";
  };
}

function renderPick(title, desc, items, onPick) {
  APP.innerHTML = `
    <h2 class="h">${escapeHtml(title)}</h2>
    <p class="p">${escapeHtml(desc)}</p>
    <div class="grid2">
      ${items.map(it => `
        <button class="option" data-id="${it.id}">
          <div><strong>${escapeHtml(it.label)}</strong></div>
        </button>
      `).join("")}
    </div>
    <div class="hr"></div>
    <button class="btn btn-ghost" id="btn-back">Atrás</button>
  `;

  APP.querySelectorAll("button.option").forEach(btn => {
    btn.onclick = () => onPick(btn.getAttribute("data-id"));
  });

  document.getElementById("btn-back").onclick = () => navBack();
}

function renderDeckPick(title, desc, items, onPick) {
  APP.innerHTML = `
    <h2 class="h">${escapeHtml(title)}</h2>
    <p class="p">${escapeHtml(desc)}</p>
    <div class="grid2">
      ${items.map(it => `
        <button class="option" data-id="${it.id}">
          <div><strong>${escapeHtml(it.label)}</strong></div>
          <small>Baraja del Oráculo (varía por sesión)</small>
        </button>
      `).join("")}
    </div>
    <div class="hr"></div>
    <button class="btn btn-ghost" id="btn-back">Atrás</button>
  `;

  APP.querySelectorAll("button.option").forEach(btn => {
    btn.onclick = () => onPick(btn.getAttribute("data-id"));
  });

  document.getElementById("btn-back").onclick = () => navBack();
}

function renderOpeners() {
  if (!state.openersShown.length) state.openersShown = buildOpenersSet();

  const phase = state.openerBestId ? "worst" : "best";
  const prompt = phase === "best"
    ? "Elegí la mejor frase para abrir (sin presión)."
    : "Ahora elegí la peor (la que invoca resistencia).";

  APP.innerHTML = `
    <h2 class="h">Primer movimiento</h2>
    <p class="p">${escapeHtml(prompt)}</p>

    <div class="grid2">
      ${state.openersShown.map(op => `
        <button class="option" data-id="${op.id}">
          <div>${escapeHtml(op.text)}</div>
          <small>${renderOpMeta(op)}</small>
        </button>
      `).join("")}
    </div>

    <div class="hr"></div>
    <div class="row">
      <button class="btn btn-ghost" id="btn-back">Atrás</button>
      <span class="pill">Ronda: ${phase === "best" ? "✅ mejor" : "❌ peor"}</span>
    </div>
  `;

  APP.querySelectorAll("button.option").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      if (!state.openerBestId) {
        state.openerBestId = id;
        logEvent("choice", { step: "openers", choice: "best", id });
        applyOpenerEffects(id, true);
        render();
      } else if (!state.openerWorstId && id !== state.openerBestId) {
        state.openerWorstId = id;
        logEvent("choice", { step: "openers", choice: "worst", id });
        applyOpenerEffects(id, false);
        // prepare resistance deck
        state.resistanceShown = buildDeckResistances();
        setStep("resistance");
      }
    };
  });

  document.getElementById("btn-back").onclick = () => navBack();
}

function renderSimulation() {
  const rid = state.resistanceId;
  const options3 = SIM[rid] || [];
  const round = state.simRound; // 0..2
  const totalRounds = 3;

  // pick 2 of 3 each round (seeded via current rng; fine for MVP)
  const shown = sample(options3, 2, state.rng);

  APP.innerHTML = `
    <h2 class="h">Cuando te diga que no…</h2>
    <p class="p">Simulación rápida. Elegí tu respuesta. <span class="pill">Ronda ${round + 1}/${totalRounds}</span></p>

    <div class="kpi">
      <div class="badge">🧩 Resistencia: ${escapeHtml(labelFor(TAX.resistance, rid))}</div>
    </div>

    <div class="grid2">
      ${shown.map(o => `
        <button class="option" data-id="${o.id}">
          <div><strong>${escapeHtml(o.text)}</strong></div>
          <small>Hechizo: ${escapeHtml(modulePretty(o.module))}</small>
        </button>
      `).join("")}
    </div>

    <div class="hr"></div>
    <button class="btn btn-ghost" id="btn-back">Atrás</button>
  `;

  APP.querySelectorAll("button.option").forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      state.simChoices.push(id);
      logEvent("choice", { step: "simulation", round: round + 1, id });
      applySimEffects(id);

      state.simRound += 1;
      if (state.simRound >= 3) {
        finalize();
      } else {
        render();
      }
    };
  });

  document.getElementById("btn-back").onclick = () => navBack();
}

function finalize() {
  // pick result
  const resultId = pickResult();
  state.resultId = resultId;
  const result = RESULTS.find(r => r.id === resultId);

  const { p, r } = computeProbability(result);
  state.prob = p;
  state.range = r;

  logEvent("session_finish", {
    resultId,
    prob: p,
    low: clamp(p - r, 0, 1),
    high: clamp(p + r, 0, 1),
    context: {
      relationId: state.relationId,
      planTypeId: state.planTypeId,
      stakesId: state.stakesId,
      channelId: state.channelId,
      moodId: state.moodId,
      archetypeId: state.archetypeId,
      resistanceId: state.resistanceId
    }
  });

  setStep("result");
}

function renderResult() {
  const result = RESULTS.find(r => r.id === state.resultId);
  const pct = Math.round(state.prob * 100);
  const low = Math.round(clamp(state.prob - state.range, 0, 1) * 100);
  const high = Math.round(clamp(state.prob + state.range, 0, 1) * 100);

  const linesW = renderScriptLines(result, "ch_whatsapp");
  const linesC = renderScriptLines(result, "ch_cara");

  const summary = [
    `Relación: ${labelFor(TAX.relation, state.relationId)}`,
    `Plan: ${labelFor(TAX.plan_type, state.planTypeId)}`,
    `Importancia: ${labelFor(TAX.stakes, state.stakesId)}`,
    `Canal: ${labelFor(TAX.channel, state.channelId)}`,
    `Mood: ${labelFor(TAX.mood, state.moodId)}`,
    `NPC: ${labelFor(TAX.archetype, state.archetypeId)}`
  ].join(" · ");

  APP.innerHTML = `
    <h2 class="h">Resultado del Oráculo</h2>
    <p class="p">${escapeHtml(summary)}</p>

    <div class="kpi">
      <div class="badge">🎯 Probabilidad: <strong>${pct}%</strong></div>
      <div class="badge">📈 Rango: ${low}–${high}%</div>
      <div class="badge">🪄 Hechizo: ${escapeHtml(result.name)}</div>
    </div>

    <div class="hr"></div>

    <h3 style="margin:0 0 8px 0">Guión WhatsApp</h3>
    <div class="codebox" id="scriptW">${escapeHtml(linesW.join("\n"))}</div>

    <div class="hr"></div>

    <h3 style="margin:0 0 8px 0">Guión cara a cara</h3>
    <div class="codebox" id="scriptC">${escapeHtml(linesC.join("\n"))}</div>

    <div class="hr"></div>

    <div class="row">
      <button class="btn btn-primary" id="btn-copy">Copiar WhatsApp</button>
      <button class="btn" id="btn-share">Texto compartible</button>
    </div>

    <div class="hr"></div>

    <p class="p">Cuando lo intentes (si querés), contale al Oráculo qué pasó:</p>
    <div class="row">
      <button class="btn" data-fb="yes">✅ Funcionó</button>
      <button class="btn" data-fb="maybe">➖ Más o menos</button>
      <button class="btn" data-fb="no">❌ No</button>
      <button class="btn btn-ghost" data-fb="skip">🤷 No lo intenté</button>
    </div>

    <div class="hr"></div>

    <div class="row">
      <button class="btn btn-ghost" id="btn-back">Atrás</button>
      <button class="btn btn-ghost" id="btn-again">Jugar otra vez</button>
    </div>
  `;

  document.getElementById("btn-copy").onclick = async () => {
    const text = linesW.join("\n");
    await navigator.clipboard.writeText(text);
    logEvent("copy", { what: "whatsapp_script" });
    toast("Copiado ✅");
  };

  document.getElementById("btn-share").onclick = async () => {
    const shareText =
      `Me salió "${result.name}" (${pct}%, rango ${low}-${high}%).\n` +
      `El Oráculo dice que hoy conviene ${result.modules.join(" + ").toLowerCase()} 😅\n` +
      `Probalo: (pegá acá tu link)`;

    await navigator.clipboard.writeText(shareText);
    logEvent("share", { channel: "copy_text" });
    toast("Texto compartible copiado ✅");
  };

  APP.querySelectorAll("button[data-fb]").forEach(btn => {
    btn.onclick = () => {
      const fb = btn.getAttribute("data-fb");
      logEvent("outcome_feedback", { fb });
      toast("Gracias 🙌");
    };
  });

  document.getElementById("btn-back").onclick = () => navBack();
  document.getElementById("btn-again").onclick = () => reset(true);
}

function modulePretty(m) {
  const map = {
    VALIDAR_PUENTE: "Validar + Preguntar",
    PRUEBA: "Micro-prueba",
    LOGISTICA: "Resolver logística",
    PAUSA: "Pausa estratégica",
    OPCIONES: "Dos opciones",
    PUENTE: "Pregunta puente",
    MARCO: "Marco de significado",
    CIERRE: "Cierre con elección",
    PLAN_B: "Plan B elegante"
  };
  return map[m] || m;
}

function renderOpMeta(op) {
  const qualityTag = op.quality === "bad" ? "⚠️" : (op.quality === "neutral" ? "➖" : "✅");
  const mods = op.modules.map(modulePretty).join(", ");
  return `${qualityTag} ${mods}`;
}

function navBack() {
  // Minimal back logic
  const order = ["home","relation","plan_type","stakes","channel","mood","archetype","openers","resistance","simulation","result"];
  const i = order.indexOf(state.step);

  // Special cases within openers: if selected best but not worst, back should clear best
  if (state.step === "openers" && state.openerBestId && !state.openerWorstId) {
    state.openerBestId = null;
    logEvent("nav_back", { step: "openers_reset_best" });
    render();
    return;
  }

  // If in result, go to simulation
  if (state.step === "result") {
    state.step = "simulation";
    logEvent("nav_back", { step: "result_to_simulation" });
    render();
    return;
  }

  if (i <= 0) return;
  const prev = order[i - 1];
  state.step = prev;
  logEvent("nav_back", { to: prev });
  render();
}

function reset(keepSeed=false) {
  const oldSeed = state?.seed;
  state = freshState();
  if (keepSeed && oldSeed != null) {
    state.seed = oldSeed;
    state.rng = mulberry32(oldSeed);
  }
  probBumpAccum = 0;
  setStep("home");
}

function toast(msg) {
  // tiny toast
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.position = "fixed";
  el.style.left = "50%";
  el.style.bottom = "20px";
  el.style.transform = "translateX(-50%)";
  el.style.padding = "10px 12px";
  el.style.borderRadius = "999px";
  el.style.background = "rgba(17,24,39,0.95)";
  el.style.border = "1px solid rgba(255,255,255,0.12)";
  el.style.color = "#e5e7eb";
  el.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
  el.style.zIndex = "9999";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/** --------- Init --------- **/
RESET_BTN.onclick = () => reset(false);

state = freshState();
render();
