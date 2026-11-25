export interface ExplanationSection {
  heading: string
  body: string
}

export interface Explanation {
  id: string
  title: string
  category: string
  summary: string
  sections: ExplanationSection[]
}

export const EXPLANATIONS: Explanation[] = [
  {
    id: 'como-esta-organizada',
    title: 'Cómo está organizada la Biblia',
    category: 'Fundamentos',
    summary: 'Un mapa general: testamentos, secciones, libros, capítulos y versículos.',
    sections: [
      {
        heading: 'Una biblioteca, no un solo libro',
        body: 'La palabra "Biblia" viene de un término griego que significa "los libros". Es una colección de 66 escritos (en el canon protestante) compuestos a lo largo de muchos siglos, por distintos autores y en distintos géneros.',
      },
      {
        heading: 'Dos testamentos',
        body: 'El Antiguo Testamento tiene 39 libros y cuenta la historia de Israel y de la relación de Dios con su pueblo. El Nuevo Testamento tiene 27 libros y habla de Jesús, la iglesia primitiva y la vida cristiana.',
      },
      {
        heading: 'Capítulos y versículos',
        body: 'Los capítulos y versículos se añadieron mucho después de la escritura, para facilitar la consulta. No son parte del texto original, y a veces la división no coincide con los cambios de tema.',
      },
    ],
  },
  {
    id: 'generos-literarios',
    title: 'Géneros literarios',
    category: 'Cómo leer',
    summary: 'Reconocer si un texto es narrativa, ley, poesía, profecía, carta o apocalíptica ayuda a leerlo bien.',
    sections: [
      {
        heading: 'Por qué importan',
        body: 'No leemos igual una receta, una carta y un poema. En la Biblia ocurre lo mismo: cada género tiene sus reglas, su lenguaje y su forma de comunicar.',
      },
      {
        heading: 'Los principales',
        body: 'Narrativa (Génesis, Hechos), ley (Levítico), poesía (Salmos, Cantares), sabiduría (Proverbios, Eclesiastés), profecía (Isaías, Amós), evangelios, cartas (Romanos, Santiago) y literatura apocalíptica (Daniel, Apocalipsis).',
      },
      {
        heading: 'Un hábito útil',
        body: 'Antes de leer un pasaje, pregunta: ¿qué tipo de texto es? ¿A quién se dirigió? ¿Qué quería lograr con sus primeros lectores?',
      },
    ],
  },
  {
    id: 'que-es-un-pacto',
    title: 'Qué es un pacto',
    category: 'Temas',
    summary: 'Un hilo conductor de la Biblia: la relación entre Dios y su pueblo expresada como pacto.',
    sections: [
      {
        heading: 'La idea básica',
        body: 'Un pacto es un compromiso formal entre partes, con promesas y responsabilidades. En el mundo antiguo se usaban para tratados entre reyes y pueblos.',
      },
      {
        heading: 'Algunos pactos bíblicos',
        body: 'Se suelen señalar los pactos con Noé, Abraham, Moisés en el Sinaí y David, y la promesa de un "nuevo pacto" anunciada por los profetas, que el Nuevo Testamento vincula con Jesús.',
      },
      {
        heading: 'Cómo se lee',
        body: 'Distintas tradiciones cristianas organizan los pactos de maneras diferentes. Conviene reconocer el tema sin asumir que todas las lecturas coinciden.',
      },
    ],
  },
  {
    id: 'leer-evangelios',
    title: 'Cómo leer los evangelios',
    category: 'Cómo leer',
    summary: 'Cuatro relatos de la vida de Jesús con enfoques complementarios.',
    sections: [
      {
        heading: 'Cuatro perspectivas',
        body: 'Mateo, Marcos, Lucas y Juan no son biografías modernas. Son relatos con un propósito: presentar a Jesús y llamar a creer en él. Cada uno selecciona y organiza el material según su audiencia.',
      },
      {
        heading: 'Los sinópticos',
        body: 'Mateo, Marcos y Lucas comparten mucho material y estructura, por eso se llaman sinópticos ("que se ven juntos"). Juan tiene un estilo y una selección más independientes.',
      },
      {
        heading: 'Consejo práctico',
        body: 'Lee un mismo episodio en más de un evangelio y observa qué se repite y qué cambia. Eso muestra los énfasis de cada autor.',
      },
    ],
  },
  {
    id: 'leer-poesia',
    title: 'Cómo leer la poesía hebrea',
    category: 'Cómo leer',
    summary: 'Salmos, Proverbios y buena parte de los profetas están escritos en poesía.',
    sections: [
      {
        heading: 'Paralelismo',
        body: 'La poesía hebrea no se basa en la rima, sino en el paralelismo: una idea se repite, se contrasta o se amplía en la línea siguiente.',
      },
      {
        heading: 'Imágenes',
        body: 'Usa metáforas intensas (roca, escudo, pastor). No se trata de describir literalmente, sino de expresar experiencia y confianza.',
      },
      {
        heading: 'Los salmos',
        body: 'Incluyen alabanza, lamento, acción de gracias y confianza. Algunos expresan queja con franqueza; la Biblia da espacio a esa honestidad ante Dios.',
      },
    ],
  },
  {
    id: 'leer-profetas',
    title: 'Cómo leer a los profetas',
    category: 'Cómo leer',
    summary: 'Los profetas hablaron ante situaciones concretas; sus mensajes combinan denuncia, advertencia y esperanza.',
    sections: [
      {
        heading: 'Más que predicción',
        body: 'Los profetas no se dedicaban solamente a anunciar el futuro. Hablaban a su tiempo: llamaban a la fidelidad, a la justicia y al arrepentimiento.',
      },
      {
        heading: 'Contexto histórico',
        body: 'Conocer la época (Asiria, Babilonia, el exilio, el regreso) ayuda a entender a quién iba dirigido cada mensaje y por qué.',
      },
      {
        heading: 'Lenguaje simbólico',
        body: 'Usan visiones, acciones simbólicas y poesía. Es importante distinguir lo que el texto describe con lenguaje figurado.',
      },
    ],
  },
  {
    id: 'parabolas',
    title: 'Las parábolas de Jesús',
    category: 'Cómo leer',
    summary: 'Historias breves con elementos de la vida cotidiana que invitan a ver las cosas de otra manera.',
    sections: [
      {
        heading: 'Qué son',
        body: 'Son relatos o comparaciones tomadas de la vida diaria: sembradores, pastores, comerciantes, familias. Jesús las usaba para enseñar y retar a sus oyentes.',
      },
      {
        heading: 'Buscar el punto central',
        body: 'Una parábola suele tener una idea central. Conviene evitar convertir cada detalle en un símbolo sin que el texto lo indique.',
      },
      {
        heading: 'Observa el contexto',
        body: 'Mira a quién habla Jesús y qué pregunta o situación provoca la parábola. Muchas veces el evangelista da pistas.',
      },
    ],
  },
  {
    id: 'traducciones-manuscritos',
    title: 'Traducciones y manuscritos',
    category: 'Fundamentos',
    summary: 'De los manuscritos antiguos a las traducciones modernas.',
    sections: [
      {
        heading: 'Idiomas originales',
        body: 'El Antiguo Testamento fue escrito principalmente en hebreo, con algunas partes en arameo. El Nuevo Testamento fue escrito en griego.',
      },
      {
        heading: 'Manuscritos',
        body: 'No conservamos los originales sino miles de copias. Los especialistas comparan manuscritos para establecer el texto, y las notas de muchas ediciones señalan variantes.',
      },
      {
        heading: 'Traducciones',
        body: 'Las traducciones difieren: unas son más literales y otras más dinámicas. Comparar dos o tres versiones ayuda a captar matices. Cada versión tiene sus propios derechos de uso; por eso esta aplicación no incluye texto sin licencia.',
      },
    ],
  },
  {
    id: 'antiguo-y-nuevo',
    title: 'Antiguo y Nuevo Testamento: la relación',
    category: 'Temas',
    summary: 'Cómo se relacionan las dos partes de la Biblia cristiana.',
    sections: [
      {
        heading: 'Una sola historia',
        body: 'El Nuevo Testamento cita y alude constantemente al Antiguo. Para los cristianos, Jesús es el cumplimiento de las promesas hechas a Israel.',
      },
      {
        heading: 'Continuidad y novedad',
        body: 'Hay continuidad (el mismo Dios, el mismo pueblo en proceso) y novedad (una nueva etapa en Cristo). Distintas tradiciones lo explican con matices diferentes.',
      },
      {
        heading: 'Para leerlos juntos',
        body: 'Cuando el Nuevo Testamento cite un texto antiguo, vale la pena abrir el pasaje original y leerlo en su contexto.',
      },
    ],
  },
  {
    id: 'metodo-de-estudio',
    title: 'Un método sencillo de estudio',
    category: 'Estudio',
    summary: 'Cuatro pasos para estudiar un pasaje: observar, comprender, aplicar y orar.',
    sections: [
      {
        heading: '1. Observar',
        body: 'Lee el pasaje varias veces. Anota personajes, lugares, repeticiones, palabras clave y el flujo del texto.',
      },
      {
        heading: '2. Comprender',
        body: 'Pregunta por el contexto histórico, el género y la intención del autor para sus primeros lectores. Usa la información de cada libro como apoyo.',
      },
      {
        heading: '3. Aplicar',
        body: 'Pregúntate qué cambia en tu forma de pensar o de vivir. Escribe una respuesta concreta en tu cuaderno de apuntes.',
      },
      {
        heading: '4. Orar y conversar',
        body: 'Cierra con oración o conversación. Estudiar en comunidad ayuda a corregir errores y a ver más.',
      },
    ],
  },
]
