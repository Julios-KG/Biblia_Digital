export interface BookInfo {
  /** Autoría según la tradición; se indican las discusiones cuando existen. */
  author: string
  /** Fecha aproximada de composición (las fechas son estimaciones). */
  written: string
  genre: string
  summary: string
  context: string
  themes: string[]
}

/**
 * Información introductoria por libro. Es contenido educativo propio y breve;
 * las fechas y autorías indican la tradición y las posturas más comunes, y no
 * pretenden cerrar debates académicos.
 */
export const BOOK_INFO: Record<string, BookInfo> = {
  GEN: {
    author: 'Tradicionalmente atribuido a Moisés',
    written: 'Compilación tradicional hacia el siglo XV–XIII a. C.',
    genre: 'Narrativa y genealogías',
    summary:
      'Relata el origen del mundo, de la humanidad y del pueblo de Israel: la creación, la caída, el diluvio, Babel y las historias de Abraham, Isaac, Jacob y José.',
    context:
      'Se sitúa en el antiguo Cercano Oriente: Mesopotamia, Canaán y Egipto. Presenta a un único Dios creador frente a los relatos de origen de las culturas vecinas.',
    themes: ['Creación', 'Pacto con Abraham', 'Promesa y bendición'],
  },
  EXO: {
    author: 'Tradicionalmente atribuido a Moisés',
    written: 'Tradición: siglo XV–XIII a. C.',
    genre: 'Narrativa y ley',
    summary:
      'Cuenta la esclavitud en Egipto, la liberación por medio de Moisés, el paso del mar, el pacto en el Sinaí y la construcción del tabernáculo.',
    context:
      'Egipto en la Edad del Bronce tardío. La fecha exacta del éxodo se discute (una fecha temprana en el siglo XV a. C. y otra tardía en el XIII a. C.).',
    themes: ['Liberación', 'Pacto en el Sinaí', 'Presencia de Dios'],
  },
  LEV: {
    author: 'Tradicionalmente atribuido a Moisés',
    written: 'Tradición: siglo XV–XIII a. C.',
    genre: 'Ley y ritual',
    summary:
      'Reúne instrucciones sobre sacrificios, sacerdocio, pureza ritual, fiestas y santidad para vivir cerca de la presencia de Dios.',
    context:
      'Está ambientado en el Sinaí, mientras Israel acampa alrededor del tabernáculo. Sus normas servían a una comunidad que se organizaba como pueblo de Dios.',
    themes: ['Santidad', 'Expiación', 'Culto'],
  },
  NUM: {
    author: 'Tradicionalmente atribuido a Moisés',
    written: 'Tradición: siglo XV–XIII a. C.',
    genre: 'Narrativa, censos y ley',
    summary:
      'Narra los años de Israel desde el Sinaí hasta las llanuras de Moab: censos, quejas del pueblo, la desobediencia en Cades y la espera de la tierra prometida.',
    context:
      'Un largo periodo en el desierto del Sinaí y el Négueb. Recoge el paso de una generación a otra antes de entrar en Canaán.',
    themes: ['Fidelidad de Dios', 'Incredulidad', 'Peregrinaje'],
  },
  DEU: {
    author: 'Tradicionalmente atribuido a Moisés',
    written: 'Tradición: siglo XV–XIII a. C.',
    genre: 'Discursos y ley',
    summary:
      'Contiene los discursos de despedida de Moisés en Moab: repaso de la historia, renovación del pacto y llamado a amar y obedecer a Dios.',
    context:
      'Israel está a punto de cruzar el Jordán. El libro se parece a los tratados de pacto del antiguo Oriente, con prólogo histórico, estipulaciones, bendiciones y maldiciones.',
    themes: ['Renovación del pacto', 'Amor y obediencia', 'Memoria'],
  },
  JOS: {
    author: 'Anónimo; la tradición lo vincula con Josué y su entorno',
    written: 'Aproximadamente entre los siglos XIII y VI a. C. (se discute)',
    genre: 'Narrativa histórica',
    summary:
      'Describe la entrada en Canaán bajo Josué, las campañas militares, el reparto de la tierra y la renovación del pacto en Siquem.',
    context:
      'Canaán estaba dividida en ciudades-estado. El libro interpreta estos hechos como cumplimiento de la promesa hecha a los patriarcas; el modo y el ritmo de la conquista son tema de debate histórico.',
    themes: ['Cumplimiento de la promesa', 'Tierra', 'Fidelidad al pacto'],
  },
  JDG: {
    author: 'Anónimo (la tradición judía menciona a Samuel)',
    written: 'Probablemente durante la monarquía (siglos XI–VI a. C.)',
    genre: 'Narrativa histórica',
    summary:
      'Recoge ciclos de apostasía, opresión, clamor y liberación en tiempos de los jueces, como Débora, Gedeón y Sansón.',
    context:
      'Periodo previo a la monarquía, sin gobierno central. El libro repite la idea de que cada uno hacía lo que le parecía bien, y prepara el surgimiento de los reyes.',
    themes: ['Ciclo de pecado y liberación', 'Liderazgo', 'Necesidad de fidelidad'],
  },
  RUT: {
    author: 'Anónimo (tradicionalmente asociado con Samuel)',
    written: 'Ambientado en la época de los jueces; fecha de redacción discutida',
    genre: 'Narrativa breve',
    summary:
      'Cuenta cómo Rut, una moabita viuda, permanece fiel a su suegra Noemí y encuentra amparo en Booz, quien actúa como pariente redentor.',
    context:
      'Betlehem, durante la época de los jueces. Muestra costumbres como la espiga rebuscada y el levirato, y enlaza con la genealogía del rey David.',
    themes: ['Lealtad', 'Redención', 'Inclusión de extranjeros'],
  },
  '1SA': {
    author: 'Anónimo; la tradición menciona a Samuel, Natán y Gad',
    written: 'Probablemente entre los siglos X y VI a. C.',
    genre: 'Narrativa histórica',
    summary:
      'Narra el paso de los jueces a la monarquía: Samuel, el reinado de Saúl y el ascenso de David.',
    context:
      'Israel enfrenta la amenaza de los filisteos y pide un rey. El libro reflexiona sobre qué significa que el rey dependa de Dios.',
    themes: ['Reyes y liderazgo', 'Obediencia', 'Elección de Dios'],
  },
  '2SA': {
    author: 'Anónimo; ver 1 Samuel',
    written: 'Probablemente entre los siglos X y VI a. C.',
    genre: 'Narrativa histórica',
    summary:
      'Relata el reinado de David: la unificación del reino, Jerusalén como capital, el pacto davídico, su pecado y las crisis dentro de su familia.',
    context:
      'Hacia el 1000 a. C. Jerusalén se vuelve centro político y religioso. El libro presenta a David con logros y fallas.',
    themes: ['Pacto con David', 'Arrepentimiento', 'Consecuencias del pecado'],
  },
  '1KI': {
    author: 'Anónimo (la tradición judía lo atribuye a Jeremías)',
    written: 'Compilado durante o después del exilio (siglo VI a. C.)',
    genre: 'Narrativa histórica',
    summary:
      'Cubre el reinado de Salomón, la construcción del templo, la división del reino y el ministerio de Elías.',
    context:
      'Del reino unido a Israel (norte) y Judá (sur). Evalúa a los reyes según su fidelidad al pacto y al culto en Jerusalén.',
    themes: ['Templo', 'División del reino', 'Profetas frente a los reyes'],
  },
  '2KI': {
    author: 'Anónimo; ver 1 Reyes',
    written: 'Compilado durante o después del exilio (siglo VI a. C.)',
    genre: 'Narrativa histórica',
    summary:
      'Sigue la historia de ambos reinos, el ministerio de Eliseo, la caída de Samaria (722 a. C.) y la de Jerusalén (586 a. C.).',
    context:
      'Asiria y luego Babilonia dominan la región. El libro explica el exilio como resultado de la infidelidad persistente al pacto.',
    themes: ['Juicio y exilio', 'Reformas', 'Esperanza residual'],
  },
  '1CH': {
    author: 'Anónimo; tradicionalmente asociado con Esdras',
    written: 'Después del exilio (siglos V–IV a. C.)',
    genre: 'Genealogías e historia',
    summary:
      'Repasa la historia desde Adán, con énfasis en la genealogía de Israel y en el reinado de David y los preparativos del templo.',
    context:
      'Escrito para una comunidad que regresó del exilio y necesitaba recordar su identidad, su linaje y su vida de culto.',
    themes: ['Identidad', 'Culto y templo', 'Linaje de David'],
  },
  '2CH': {
    author: 'Anónimo; ver 1 Crónicas',
    written: 'Después del exilio (siglos V–IV a. C.)',
    genre: 'Narrativa histórica',
    summary:
      'Narra el reinado de Salomón y la historia de los reyes de Judá hasta el exilio, y termina con el edicto de Ciro que permite el regreso.',
    context:
      'Mira el pasado desde la perspectiva del templo y la fidelidad. Se centra en Judá y en la dinastía de David.',
    themes: ['Avivamiento', 'Búsqueda de Dios', 'Esperanza de restauración'],
  },
  EZR: {
    author: 'Tradicionalmente atribuido a Esdras',
    written: 'Siglo V a. C. (aprox.)',
    genre: 'Narrativa histórica',
    summary:
      'Cuenta el regreso de los desterrados desde Babilonia, la reconstrucción del templo y la reforma religiosa dirigida por Esdras.',
    context:
      'Imperio persa. Ciro, Darío y Artajerjes aparecen en el relato. La comunidad reconstruye su vida alrededor de la ley y el culto.',
    themes: ['Restauración', 'Ley', 'Identidad de la comunidad'],
  },
  NEH: {
    author: 'Tradicionalmente atribuido a Nehemías',
    written: 'Siglo V a. C. (aprox.)',
    genre: 'Narrativa y memorias',
    summary:
      'Relata la reconstrucción de los muros de Jerusalén bajo Nehemías, la lectura pública de la ley y las reformas sociales y religiosas.',
    context:
      'Jerusalén, bajo dominio persa, sin defensas ni seguridad. El libro destaca la oración, la organización y la oposición externa.',
    themes: ['Liderazgo y oración', 'Reconstrucción', 'Renovación del pacto'],
  },
  EST: {
    author: 'Anónimo',
    written: 'Siglo V–IV a. C. (aprox.)',
    genre: 'Narrativa',
    summary:
      'Una joven judía llega a ser reina de Persia y ayuda a salvar a su pueblo de un decreto de exterminio.',
    context:
      'Susa, capital persa, bajo Asuero (Jerjes I). El libro no menciona explícitamente a Dios, pero muestra su providencia en los acontecimientos.',
    themes: ['Providencia', 'Valentía', 'Fiesta de Purim'],
  },
  JOB: {
    author: 'Anónimo',
    written: 'Fecha incierta; ambientado en tiempos patriarcales',
    genre: 'Poesía sapiencial',
    summary:
      'Job sufre pérdidas profundas, dialoga con sus amigos sobre el sentido del dolor y finalmente Dios le responde.',
    context:
      'Se desarrolla en un entorno ajeno a Israel (la tierra de Uz). Cuestiona las explicaciones simples que vinculan sufrimiento con culpa personal.',
    themes: ['Sufrimiento', 'Sabiduría de Dios', 'Fe honesta'],
  },
  PSA: {
    author: 'David, Asaf, los hijos de Coré, Salomón, Moisés y otros',
    written: 'Compuestos a lo largo de varios siglos',
    genre: 'Poesía y oración',
    summary:
      'Colección de 150 cantos y oraciones: alabanza, lamento, acción de gracias, confianza, sabiduría y salmos reales.',
    context:
      'Estaban ligados al culto en el templo y a la vida personal. Se agruparon en cinco libros y reflejan experiencias de muchos momentos históricos.',
    themes: ['Alabanza', 'Lamento', 'Reinado de Dios'],
  },
  PRO: {
    author: 'Salomón, y otros sabios (Agur, Lemuel y compiladores)',
    written: 'Siglos X–V a. C. (aprox.)',
    genre: 'Sabiduría',
    summary:
      'Dichos breves y discursos que enseñan a vivir con prudencia, justicia y temor de Dios en la vida diaria.',
    context:
      'Pertenece a la tradición de sabiduría del antiguo Oriente. Sus sentencias describen tendencias generales, no promesas absolutas.',
    themes: ['Sabiduría', 'Temor de Dios', 'Vida cotidiana'],
  },
  ECC: {
    author: 'Tradicionalmente atribuido a Salomón (el Predicador; se debate)',
    written: 'Fecha discutida',
    genre: 'Sabiduría reflexiva',
    summary:
      'Un maestro reflexiona sobre el sentido de la vida, el trabajo y la muerte, y concluye con una invitación a temer a Dios y disfrutar sus dones.',
    context:
      'Examina la vida "bajo el sol", es decir, sin ver más allá de la experiencia humana inmediata.',
    themes: ['Vanidad y límites', 'Disfrutar los dones', 'Temor de Dios'],
  },
  SNG: {
    author: 'Tradicionalmente atribuido a Salomón',
    written: 'Siglo X a. C. según la tradición',
    genre: 'Poesía lírica',
    summary:
      'Poema de amor entre dos amantes que celebra el afecto, el deseo y el compromiso.',
    context:
      'Se ha leído literalmente como poesía amorosa y también de modo simbólico en la tradición judía y cristiana.',
    themes: ['Amor', 'Compromiso', 'Belleza del matrimonio'],
  },
  ISA: {
    author: 'Isaías de Jerusalén; algunos estudiosos distinguen otras manos en los caps. 40–66',
    written: 'Siglos VIII–VI a. C.',
    genre: 'Profecía',
    summary:
      'Anuncia juicio por la injusticia y la idolatría, y también consuelo, restauración y la venida de un siervo de Dios.',
    context:
      'Judá enfrenta la amenaza de Asiria y luego la de Babilonia. Los caps. 40–55 hablan al pueblo en el exilio.',
    themes: ['Santidad de Dios', 'Siervo', 'Esperanza'],
  },
  JER: {
    author: 'Jeremías, con la ayuda de su escriba Baruc',
    written: 'Siglos VII–VI a. C.',
    genre: 'Profecía',
    summary:
      'El profeta advierte sobre el juicio venidero sobre Judá, vive el sitio de Jerusalén y anuncia un nuevo pacto.',
    context:
      'Los últimos años de Judá y la caída de Jerusalén (586 a. C.). Jeremías sufre rechazo y persecución.',
    themes: ['Arrepentimiento', 'Nuevo pacto', 'Costo de ser fiel'],
  },
  LAM: {
    author: 'Tradicionalmente atribuido a Jeremías',
    written: 'Poco después del 586 a. C.',
    genre: 'Lamento poético',
    summary:
      'Cinco poemas de duelo por la destrucción de Jerusalén, con una expresión de esperanza en la fidelidad de Dios.',
    context:
      'Escritos tras la caída de la ciudad. Usan estructuras alfabéticas para ordenar el dolor.',
    themes: ['Duelo', 'Confesión', 'Misericordia'],
  },
  EZK: {
    author: 'Ezequiel',
    written: 'Siglo VI a. C. (aprox. 593–571 a. C.)',
    genre: 'Profecía y visiones',
    summary:
      'Ezequiel, sacerdote en el exilio, proclama el juicio, ve la gloria de Dios abandonar el templo y anuncia la restauración del pueblo.',
    context:
      'Babilonia, entre los deportados. Combina acciones simbólicas, visiones y mensajes de esperanza como el valle de huesos secos.',
    themes: ['Gloria de Dios', 'Responsabilidad', 'Renovación'],
  },
  DAN: {
    author: 'Daniel (la fecha de composición se discute)',
    written: 'Siglo VI a. C. según la tradición; otros proponen el siglo II a. C.',
    genre: 'Narrativa y apocalíptica',
    summary:
      'Cuenta la fidelidad de Daniel y sus compañeros en la corte babilónica y presenta visiones sobre reinos y el reino de Dios.',
    context:
      'Exilio babilónico y persa. Contiene secciones en hebreo y en arameo.',
    themes: ['Fidelidad en el exilio', 'Soberanía de Dios', 'Esperanza final'],
  },
  HOS: {
    author: 'Oseas',
    written: 'Siglo VIII a. C.',
    genre: 'Profecía',
    summary:
      'Usa su propio matrimonio como imagen del amor fiel de Dios hacia un pueblo infiel.',
    context:
      'Reino del norte (Israel) poco antes de la caída de Samaria, en medio de idolatría e inestabilidad política.',
    themes: ['Amor leal', 'Infidelidad', 'Restauración'],
  },
  JOL: {
    author: 'Joel',
    written: 'Fecha discutida (entre los siglos IX y IV a. C.)',
    genre: 'Profecía',
    summary:
      'Una plaga de langostas se convierte en señal del día del Señor, junto con un llamado al arrepentimiento y una promesa del Espíritu.',
    context:
      'Judá enfrenta una calamidad. El libro interpreta la crisis como oportunidad para volver a Dios.',
    themes: ['Día del Señor', 'Arrepentimiento', 'Derramamiento del Espíritu'],
  },
  AMO: {
    author: 'Amós, pastor y cultivador de higos de Tecoa',
    written: 'Siglo VIII a. C.',
    genre: 'Profecía',
    summary:
      'Denuncia la injusticia social y el culto vacío en el reino del norte, y anuncia juicio con una promesa final de restauración.',
    context:
      'Prosperidad económica con grandes desigualdades bajo Jeroboam II.',
    themes: ['Justicia', 'Culto auténtico', 'Juicio y esperanza'],
  },
  OBA: {
    author: 'Abdías',
    written: 'Probablemente después del 586 a. C.',
    genre: 'Profecía',
    summary:
      'Un mensaje breve contra Edom por su actitud hacia Judá en el momento de su caída.',
    context:
      'Edom, vecino al sureste, aparece como pueblo hermano que no ayudó en la crisis.',
    themes: ['Justicia de Dios', 'Orgullo', 'Reino del Señor'],
  },
  JON: {
    author: 'Anónimo (la tradición menciona a Jonás)',
    written: 'Ambientado en el siglo VIII a. C.',
    genre: 'Narrativa profética',
    summary:
      'Jonás huye de la misión de predicar en Nínive, pero termina viendo a la ciudad arrepentirse y aprende sobre la compasión de Dios.',
    context:
      'Nínive era capital de Asiria, una potencia temida. El libro desafía una visión estrecha de la misericordia.',
    themes: ['Compasión de Dios', 'Obediencia', 'Misión a las naciones'],
  },
  MIC: {
    author: 'Miqueas de Moréset',
    written: 'Siglo VIII a. C.',
    genre: 'Profecía',
    summary:
      'Denuncia la injusticia de los líderes y anuncia esperanza, con un gobernante que surgirá de Belén.',
    context:
      'Judá en tiempos de Isaías y de la amenaza asiria.',
    themes: ['Justicia y misericordia', 'Líderes', 'Esperanza mesiánica'],
  },
  NAM: {
    author: 'Nahúm',
    written: 'Antes de la caída de Nínive (612 a. C.)',
    genre: 'Profecía',
    summary:
      'Anuncia la caída de Nínive como señal de que Dios juzga la violencia y protege a los suyos.',
    context:
      'Asiria había oprimido a Israel y a Judá. El libro responde a esa memoria con un mensaje de justicia.',
    themes: ['Justicia divina', 'Consuelo', 'Fin de la opresión'],
  },
  HAB: {
    author: 'Habacuc',
    written: 'Finales del siglo VII a. C.',
    genre: 'Profecía y oración',
    summary:
      'Habacuc dialoga con Dios sobre la injusticia y recibe una respuesta que enseña a esperar con fe.',
    context:
      'Judá, ante el crecimiento de Babilonia. El libro termina con una oración de confianza.',
    themes: ['Preguntas a Dios', 'Fe', 'Esperar en Dios'],
  },
  ZEP: {
    author: 'Sofonías',
    written: 'Siglo VII a. C. (reinado de Josías)',
    genre: 'Profecía',
    summary:
      'Anuncia el día del Señor, juicio sobre Judá y las naciones, y una promesa de restauración.',
    context:
      'Antes de las reformas de Josías, con idolatría extendida en Judá.',
    themes: ['Día del Señor', 'Humildad', 'Restauración'],
  },
  HAG: {
    author: 'Hageo',
    written: '520 a. C. aprox.',
    genre: 'Profecía',
    summary:
      'Anima a los regresados a reconstruir el templo y a dar prioridad a la presencia de Dios.',
    context:
      'Primer periodo persa, con una comunidad pequeña y desanimada.',
    themes: ['Prioridades', 'Templo', 'Ánimo'],
  },
  ZEC: {
    author: 'Zacarías (la unidad de los caps. 9–14 se discute)',
    written: 'Finales del siglo VI a. C.',
    genre: 'Profecía y visiones',
    summary:
      'Visiones y mensajes para animar la reconstrucción del templo y anunciar al rey humilde y pastor.',
    context:
      'Contemporáneo de Hageo, dirigido a la comunidad que volvió del exilio.',
    themes: ['Esperanza', 'Purificación', 'Rey venidero'],
  },
  MAL: {
    author: 'Malaquías',
    written: 'Siglo V a. C. (aprox.)',
    genre: 'Profecía y disputas',
    summary:
      'Confronta la falta de compromiso en el culto y la vida diaria, y anuncia al mensajero que prepara la venida del Señor.',
    context:
      'Comunidad postexílica desanimada y espiritualmente indiferente. Es el último libro del Antiguo Testamento en el orden cristiano.',
    themes: ['Fidelidad', 'Justicia', 'Anuncio del mensajero'],
  },
  MAT: {
    author: 'Tradicionalmente Mateo, discípulo de Jesús',
    written: 'Aprox. años 60–85 d. C.',
    genre: 'Evangelio',
    summary:
      'Presenta a Jesús como Mesías y rey, cumplidor de las Escrituras, con cinco grandes discursos, entre ellos el Sermón del monte.',
    context:
      'Dirigido a lectores con fuerte trasfondo judío. Insiste en el cumplimiento de la Ley y los profetas.',
    themes: ['Reino de los cielos', 'Cumplimiento', 'Discipulado'],
  },
  MRK: {
    author: 'Tradicionalmente Juan Marcos, ligado a Pedro',
    written: 'Aprox. años 55–70 d. C.',
    genre: 'Evangelio',
    summary:
      'Un relato ágil que muestra a Jesús en acción, sus milagros, sus enseñanzas y el camino a la cruz.',
    context:
      'Probablemente escrito para lectores gentiles, explica costumbres judías. Es el Evangelio más breve.',
    themes: ['Siervo sufriente', 'Discipulado', 'Identidad de Jesús'],
  },
  LUK: {
    author: 'Tradicionalmente Lucas, médico y compañero de Pablo',
    written: 'Aprox. años 60–85 d. C.',
    genre: 'Evangelio',
    summary:
      'Narra la vida de Jesús con atención a los marginados, la compasión y la alegría de la salvación.',
    context:
      'Primer tomo de una obra en dos partes, junto con Hechos. Dirigido a Teófilo, con interés histórico y ordenado.',
    themes: ['Salvación para todos', 'Oración', 'Compasión'],
  },
  JHN: {
    author: 'Tradicionalmente Juan, el discípulo amado',
    written: 'Aprox. años 80–95 d. C.',
    genre: 'Evangelio',
    summary:
      'Presenta señales y discursos de Jesús para que el lector crea y tenga vida, con las declaraciones "Yo soy".',
    context:
      'Tiene un estilo y selección de hechos propios respecto a los otros evangelios. Insiste en la identidad divina de Jesús.',
    themes: ['Vida', 'Fe', 'Amor'],
  },
  ACT: {
    author: 'Tradicionalmente Lucas',
    written: 'Aprox. años 60–90 d. C.',
    genre: 'Narrativa histórica',
    summary:
      'Cuenta la expansión de la iglesia desde Jerusalén hasta Roma, con Pedro y Pablo como figuras principales.',
    context:
      'Mundo mediterráneo bajo el Imperio romano. Presenta viajes, juicios y comunidades diversas.',
    themes: ['Espíritu Santo', 'Misión', 'Unidad en la diversidad'],
  },
  ROM: {
    author: 'Pablo',
    written: 'Aprox. 55–57 d. C.',
    genre: 'Carta',
    summary:
      'Explica el evangelio, la justificación por la fe, la vida en el Espíritu y la relación entre judíos y gentiles.',
    context:
      'Escrita a la comunidad de Roma desde Corinto, antes de su visita a la ciudad.',
    themes: ['Justificación', 'Gracia', 'Vida cristiana'],
  },
  '1CO': {
    author: 'Pablo',
    written: 'Aprox. 53–55 d. C.',
    genre: 'Carta',
    summary:
      'Aborda divisiones, ética, culto, dones espirituales, el amor y la resurrección en la comunidad de Corinto.',
    context:
      'Corinto era un puerto próspero y diverso. La comunidad enfrentaba problemas muy concretos.',
    themes: ['Unidad', 'Amor', 'Resurrección'],
  },
  '2CO': {
    author: 'Pablo',
    written: 'Aprox. 55–57 d. C.',
    genre: 'Carta',
    summary:
      'Pablo defiende su ministerio, habla de la debilidad y la fortaleza de Cristo, y anima a la generosidad.',
    context:
      'Escrita tras tensiones con la comunidad de Corinto. Es una de sus cartas más personales.',
    themes: ['Reconciliación', 'Debilidad y poder', 'Generosidad'],
  },
  GAL: {
    author: 'Pablo',
    written: 'Aprox. 48–55 d. C. (se discute la fecha)',
    genre: 'Carta',
    summary:
      'Defiende que la salvación se recibe por fe en Cristo y no por obras de la ley.',
    context:
      'Dirigida a comunidades de Galacia que estaban siendo presionadas a adoptar prácticas judías como condición.',
    themes: ['Libertad', 'Fe', 'Vida en el Espíritu'],
  },
  EPH: {
    author: 'Pablo (algunos estudiosos discuten la autoría)',
    written: 'Aprox. 60–62 d. C.',
    genre: 'Carta',
    summary:
      'Describe el propósito de Dios en Cristo, la unidad de la iglesia y la vida que corresponde a ese llamado.',
    context:
      'Escrita desde la prisión y probablemente circular entre iglesias de Asia Menor.',
    themes: ['Unidad', 'Gracia', 'Vida nueva'],
  },
  PHP: {
    author: 'Pablo',
    written: 'Aprox. 60–62 d. C.',
    genre: 'Carta',
    summary:
      'Una carta de gratitud y ánimo que habla de la alegría, la humildad de Cristo y la perseverancia.',
    context:
      'Escrita desde la cárcel a la comunidad de Filipos, la primera que Pablo fundó en Europa.',
    themes: ['Gozo', 'Humildad', 'Perseverancia'],
  },
  COL: {
    author: 'Pablo',
    written: 'Aprox. 60–62 d. C.',
    genre: 'Carta',
    summary:
      'Presenta la supremacía de Cristo y advierte contra enseñanzas que reducen su obra.',
    context:
      'Dirigida a Colosas, ciudad del valle del Lico, con influencias religiosas diversas.',
    themes: ['Supremacía de Cristo', 'Vida nueva', 'Libertad'],
  },
  '1TH': {
    author: 'Pablo',
    written: 'Aprox. 50–51 d. C.',
    genre: 'Carta',
    summary:
      'Anima a una comunidad joven que sufre persecución y responde dudas sobre el regreso de Cristo.',
    context:
      'Tesalónica, importante ciudad macedonia. Es una de las cartas más antiguas del Nuevo Testamento.',
    themes: ['Esperanza', 'Perseverancia', 'Regreso de Cristo'],
  },
  '2TH': {
    author: 'Pablo (algunos estudiosos discuten la autoría)',
    written: 'Aprox. 50–52 d. C.',
    genre: 'Carta',
    summary:
      'Aclara malentendidos sobre el día del Señor y exhorta a seguir trabajando con constancia.',
    context:
      'Dirigida a la misma comunidad que 1 Tesalonicenses, pocos meses después.',
    themes: ['Perseverancia', 'Día del Señor', 'Responsabilidad'],
  },
  '1TI': {
    author: 'Pablo (algunos estudiosos discuten la autoría)',
    written: 'Aprox. 62–65 d. C.',
    genre: 'Carta pastoral',
    summary:
      'Instrucciones a Timoteo sobre doctrina, culto, liderazgo y cuidado de la comunidad en Éfeso.',
    context:
      'Escrita a un colaborador joven que debía dirigir una iglesia en medio de falsas enseñanzas.',
    themes: ['Liderazgo', 'Sana doctrina', 'Conducta en la iglesia'],
  },
  '2TI': {
    author: 'Pablo (algunos estudiosos discuten la autoría)',
    written: 'Aprox. 64–67 d. C.',
    genre: 'Carta pastoral',
    summary:
      'Palabras finales de Pablo a Timoteo, con un llamado a permanecer firme y transmitir el evangelio.',
    context:
      'Según la tradición, escrita desde Roma poco antes de la muerte de Pablo.',
    themes: ['Perseverancia', 'Herencia de la fe', 'Fidelidad'],
  },
  TIT: {
    author: 'Pablo (algunos estudiosos discuten la autoría)',
    written: 'Aprox. 62–65 d. C.',
    genre: 'Carta pastoral',
    summary:
      'Pablo orienta a Tito sobre el orden de las iglesias en Creta y la vida que debe acompañar a la fe.',
    context:
      'Creta, isla con comunidades cristianas jóvenes y desafíos éticos.',
    themes: ['Buenas obras', 'Liderazgo', 'Gracia'],
  },
  PHM: {
    author: 'Pablo',
    written: 'Aprox. 60–62 d. C.',
    genre: 'Carta personal',
    summary:
      'Pablo intercede ante Filemón por Onésimo, un esclavo que regresa, pidiendo que lo reciba como hermano.',
    context:
      'La carta se escribe en un mundo donde la esclavitud era común y presenta un criterio nuevo de fraternidad.',
    themes: ['Reconciliación', 'Fraternidad', 'Perdón'],
  },
  HEB: {
    author: 'Anónimo (se propusieron Pablo, Bernabé, Apolos y otros)',
    written: 'Probablemente antes del 70 d. C.',
    genre: 'Carta y exhortación',
    summary:
      'Muestra que Cristo supera el sacerdocio, el templo y los sacrificios del antiguo pacto y llama a perseverar en la fe.',
    context:
      'Dirigida a creyentes de trasfondo judío tentados a abandonar su fe ante la presión.',
    themes: ['Superioridad de Cristo', 'Fe', 'Perseverancia'],
  },
  JAS: {
    author: 'Santiago, tradicionalmente hermano de Jesús',
    written: 'Aprox. años 45–62 d. C.',
    genre: 'Carta de sabiduría',
    summary:
      'Una carta práctica sobre una fe que se demuestra con obras, el control de la lengua, la paciencia y la justicia.',
    context:
      'Dirigida a creyentes judíos dispersos. Tiene afinidad con la literatura sapiencial.',
    themes: ['Fe y obras', 'Sabiduría', 'Justicia'],
  },
  '1PE': {
    author: 'Pedro',
    written: 'Aprox. años 62–65 d. C.',
    genre: 'Carta',
    summary:
      'Anima a creyentes que sufren a vivir con esperanza, santidad y buen testimonio.',
    context:
      'Dirigida a comunidades de Asia Menor que enfrentaban hostilidad social.',
    themes: ['Esperanza', 'Sufrimiento', 'Identidad'],
  },
  '2PE': {
    author: 'Pedro (algunos estudiosos discuten la autoría)',
    written: 'Aprox. años 64–68 d. C.',
    genre: 'Carta',
    summary:
      'Exhorta a crecer en el conocimiento de Cristo y advierte sobre falsos maestros.',
    context:
      'Se presenta como despedida de Pedro, ante amenazas de enseñanzas engañosas.',
    themes: ['Crecimiento', 'Falsos maestros', 'Esperanza'],
  },
  '1JN': {
    author: 'Tradicionalmente Juan',
    written: 'Aprox. años 85–95 d. C.',
    genre: 'Carta',
    summary:
      'Ofrece criterios para reconocer la vida en Cristo: la verdad, la obediencia y el amor.',
    context:
      'Escrita a comunidades afectadas por divisiones y enseñanzas que negaban la humanidad de Jesús.',
    themes: ['Amor', 'Verdad', 'Seguridad'],
  },
  '2JN': {
    author: 'Tradicionalmente Juan, "el anciano"',
    written: 'Aprox. años 85–95 d. C.',
    genre: 'Carta breve',
    summary:
      'Anima a andar en la verdad y en el amor, y a tener cuidado con quienes enseñan error.',
    context:
      'Dirigida a una "señora elegida" y a sus hijos, probablemente una iglesia local.',
    themes: ['Verdad', 'Amor', 'Discernimiento'],
  },
  '3JN': {
    author: 'Tradicionalmente Juan, "el anciano"',
    written: 'Aprox. años 85–95 d. C.',
    genre: 'Carta breve',
    summary:
      'Elogia la hospitalidad de Gayo hacia los hermanos que viajan y corrige la actitud de Diótrefes.',
    context:
      'Muestra la vida práctica de las iglesias primitivas y el apoyo a los misioneros.',
    themes: ['Hospitalidad', 'Verdad', 'Humildad'],
  },
  JUD: {
    author: 'Judas, hermano de Santiago (tradicionalmente de Jesús)',
    written: 'Aprox. años 60–80 d. C.',
    genre: 'Carta',
    summary:
      'Llama a defender la fe recibida y advierte contra quienes la corrompen.',
    context:
      'Escrita a creyentes expuestos a enseñanzas que justificaban la inmoralidad.',
    themes: ['Perseverancia', 'Fidelidad', 'Misericordia'],
  },
  REV: {
    author: 'Juan (tradicionalmente el apóstol)',
    written: 'Aprox. años 90–96 d. C.',
    genre: 'Apocalíptico y profético',
    summary:
      'Revela mediante visiones la victoria de Cristo, el juicio del mal y la creación nueva, con cartas a siete iglesias.',
    context:
      'Escrito en Asia Menor durante presión del Imperio romano. Usa un lenguaje simbólico propio del género apocalíptico, que se interpreta de formas distintas.',
    themes: ['Victoria de Cristo', 'Perseverancia', 'Nueva creación'],
  },
}
