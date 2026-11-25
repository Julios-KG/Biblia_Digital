export type EntryKind = 'persona' | 'lugar'

export interface EncyclopediaEntry {
  id: string
  kind: EntryKind
  name: string
  /** Subcategoría: Patriarca, Rey, Profeta, Apóstol, Ciudad, Región, Monte, etc. */
  category: string
  summary: string
  /** Referencias bíblicas orientativas */
  reference: string
  bookIds: string[]
  /** Aviso opcional cuando la ubicación, fecha o identificación se discute. */
  note?: string
}

export const PEOPLE: EncyclopediaEntry[] = [
  { id: 'adan-eva', kind: 'persona', name: 'Adán y Eva', category: 'Orígenes', summary: 'Los primeros seres humanos en el relato de Génesis, creados a imagen de Dios y colocados en el huerto de Edén.', reference: 'Génesis 1–5', bookIds: ['GEN'] },
  { id: 'noe', kind: 'persona', name: 'Noé', category: 'Orígenes', summary: 'Hombre justo que construyó el arca antes del diluvio y recibió el pacto del arcoíris.', reference: 'Génesis 6–9', bookIds: ['GEN'] },
  { id: 'abraham', kind: 'persona', name: 'Abraham', category: 'Patriarca', summary: 'Llamado a salir de su tierra, recibió la promesa de descendencia y bendición para todas las naciones.', reference: 'Génesis 11–25', bookIds: ['GEN'] },
  { id: 'sara', kind: 'persona', name: 'Sara', category: 'Matriarca', summary: 'Esposa de Abraham y madre de Isaac, que nació cuando ya era anciana.', reference: 'Génesis 11–23', bookIds: ['GEN'] },
  { id: 'isaac', kind: 'persona', name: 'Isaac', category: 'Patriarca', summary: 'Hijo de la promesa de Abraham y Sara, padre de Jacob y Esaú.', reference: 'Génesis 21–35', bookIds: ['GEN'] },
  { id: 'jacob', kind: 'persona', name: 'Jacob (Israel)', category: 'Patriarca', summary: 'Hijo de Isaac que recibió el nombre de Israel. De sus doce hijos provienen las tribus.', reference: 'Génesis 25–50', bookIds: ['GEN'] },
  { id: 'jose', kind: 'persona', name: 'José', category: 'Patriarca', summary: 'Hijo de Jacob vendido como esclavo a Egipto, donde llegó a ser gobernante y salvó a su familia del hambre.', reference: 'Génesis 37–50', bookIds: ['GEN'] },
  { id: 'moises', kind: 'persona', name: 'Moisés', category: 'Líder', summary: 'Guía del éxodo y mediador del pacto del Sinaí. La tradición lo asocia con los primeros cinco libros.', reference: 'Éxodo – Deuteronomio', bookIds: ['EXO', 'LEV', 'NUM', 'DEU'] },
  { id: 'josue', kind: 'persona', name: 'Josué', category: 'Líder', summary: 'Sucesor de Moisés que condujo a Israel a la tierra prometida.', reference: 'Josué', bookIds: ['JOS'] },
  { id: 'debora', kind: 'persona', name: 'Débora', category: 'Jueza y profetisa', summary: 'Líder de Israel que, junto con Barac, guió la victoria sobre el ejército de Sísara.', reference: 'Jueces 4–5', bookIds: ['JDG'] },
  { id: 'gedeon', kind: 'persona', name: 'Gedeón', category: 'Juez', summary: 'Juez llamado a liberar a Israel de Madián con un grupo muy reducido.', reference: 'Jueces 6–8', bookIds: ['JDG'] },
  { id: 'rut', kind: 'persona', name: 'Rut', category: 'Mujer destacada', summary: 'Moabita fiel a Noemí que se estableció en Belén y fue antepasada de David.', reference: 'Rut', bookIds: ['RUT'] },
  { id: 'samuel', kind: 'persona', name: 'Samuel', category: 'Profeta y juez', summary: 'Último juez y profeta que ungió a Saúl y a David.', reference: '1 Samuel 1–25', bookIds: ['1SA'] },
  { id: 'david', kind: 'persona', name: 'David', category: 'Rey', summary: 'Pastor que llegó a ser rey de Israel, asociado con muchos salmos y con la promesa de una dinastía.', reference: '1 Samuel 16 – 1 Reyes 2', bookIds: ['1SA', '2SA', 'PSA'] },
  { id: 'salomon', kind: 'persona', name: 'Salomón', category: 'Rey', summary: 'Hijo de David, conocido por su sabiduría y por construir el templo en Jerusalén.', reference: '1 Reyes 1–11', bookIds: ['1KI', 'PRO', 'ECC', 'SNG'] },
  { id: 'elias', kind: 'persona', name: 'Elías', category: 'Profeta', summary: 'Profeta del reino del norte que confrontó la idolatría en tiempos del rey Acab.', reference: '1 Reyes 17 – 2 Reyes 2', bookIds: ['1KI', '2KI'] },
  { id: 'eliseo', kind: 'persona', name: 'Eliseo', category: 'Profeta', summary: 'Discípulo y sucesor de Elías, con un ministerio de milagros y de consejo a reyes.', reference: '2 Reyes 2–13', bookIds: ['2KI'] },
  { id: 'isaias', kind: 'persona', name: 'Isaías', category: 'Profeta', summary: 'Profeta en Jerusalén durante la amenaza asiria, con mensajes de juicio y esperanza.', reference: 'Isaías', bookIds: ['ISA'] },
  { id: 'jeremias', kind: 'persona', name: 'Jeremías', category: 'Profeta', summary: 'Profeta que anunció la caída de Jerusalén y la promesa de un nuevo pacto.', reference: 'Jeremías', bookIds: ['JER', 'LAM'] },
  { id: 'daniel', kind: 'persona', name: 'Daniel', category: 'Profeta', summary: 'Joven llevado al exilio que sirvió en la corte de Babilonia y mantuvo su fe.', reference: 'Daniel', bookIds: ['DAN'] },
  { id: 'ester', kind: 'persona', name: 'Ester', category: 'Mujer destacada', summary: 'Reina de Persia que intercedió por su pueblo ante un decreto de exterminio.', reference: 'Ester', bookIds: ['EST'] },
  { id: 'nehemias', kind: 'persona', name: 'Nehemías', category: 'Líder', summary: 'Copero del rey persa que dirigió la reconstrucción de los muros de Jerusalén.', reference: 'Nehemías', bookIds: ['NEH'] },
  { id: 'juan-bautista', kind: 'persona', name: 'Juan el Bautista', category: 'Profeta', summary: 'Predicador del desierto que preparó el camino para Jesús y lo bautizó.', reference: 'Mateo 3; Lucas 1–3; Juan 1', bookIds: ['MAT', 'LUK', 'JHN'] },
  { id: 'maria', kind: 'persona', name: 'María', category: 'Nuevo Testamento', summary: 'Madre de Jesús, que aparece en los relatos de su nacimiento y en momentos de su ministerio.', reference: 'Lucas 1–2; Juan 19', bookIds: ['LUK', 'MAT', 'JHN'] },
  { id: 'jesus', kind: 'persona', name: 'Jesús de Nazaret', category: 'Nuevo Testamento', summary: 'Figura central del Nuevo Testamento: maestro, Mesías y Señor según la fe cristiana.', reference: 'Los cuatro evangelios', bookIds: ['MAT', 'MRK', 'LUK', 'JHN'] },
  { id: 'pedro', kind: 'persona', name: 'Pedro', category: 'Apóstol', summary: 'Pescador de Galilea y uno de los doce, destacado entre los primeros líderes de la iglesia.', reference: 'Evangelios; Hechos 1–12', bookIds: ['MAT', 'ACT', '1PE', '2PE'] },
  { id: 'juan-apostol', kind: 'persona', name: 'Juan', category: 'Apóstol', summary: 'Uno de los doce. La tradición lo asocia con el cuarto evangelio, tres cartas y el Apocalipsis.', reference: 'Evangelios; Hechos', bookIds: ['JHN', '1JN', '2JN', '3JN', 'REV'] },
  { id: 'pablo', kind: 'persona', name: 'Pablo (Saulo de Tarso)', category: 'Apóstol', summary: 'Perseguidor convertido en misionero a los gentiles, autor de varias cartas del Nuevo Testamento.', reference: 'Hechos 9–28', bookIds: ['ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL'] },
  { id: 'timoteo', kind: 'persona', name: 'Timoteo', category: 'Colaborador', summary: 'Colaborador joven de Pablo, destinatario de dos cartas.', reference: 'Hechos 16; 1–2 Timoteo', bookIds: ['ACT', '1TI', '2TI'] },
  { id: 'lucas', kind: 'persona', name: 'Lucas', category: 'Colaborador', summary: 'Médico y compañero de Pablo, tradicionalmente autor del tercer evangelio y de Hechos.', reference: 'Colosenses 4:14; 2 Timoteo 4:11', bookIds: ['LUK', 'ACT'] },
]

export const PLACES: EncyclopediaEntry[] = [
  { id: 'eden', kind: 'lugar', name: 'Edén', category: 'Región', summary: 'El huerto donde Génesis sitúa a los primeros seres humanos.', reference: 'Génesis 2–3', bookIds: ['GEN'], note: 'Su ubicación geográfica no está determinada.' },
  { id: 'ur', kind: 'lugar', name: 'Ur de los caldeos', category: 'Ciudad', summary: 'Ciudad de Mesopotamia de donde partió la familia de Abraham.', reference: 'Génesis 11:27–32', bookIds: ['GEN'] },
  { id: 'haran', kind: 'lugar', name: 'Harán', category: 'Ciudad', summary: 'Ciudad del norte de Mesopotamia donde vivió Abraham antes de ir a Canaán y donde Jacob trabajó con Labán.', reference: 'Génesis 11–12; 28–31', bookIds: ['GEN'] },
  { id: 'canaan', kind: 'lugar', name: 'Canaán', category: 'Región', summary: 'Tierra prometida a Abraham, ubicada entre el Mediterráneo y el Jordán.', reference: 'Génesis 12; Josué', bookIds: ['GEN', 'JOS'] },
  { id: 'egipto', kind: 'lugar', name: 'Egipto', category: 'Región', summary: 'Tierra donde José gobernó y donde Israel fue esclavizado antes del éxodo.', reference: 'Génesis 37–50; Éxodo 1–15', bookIds: ['GEN', 'EXO'] },
  { id: 'sinai', kind: 'lugar', name: 'Monte Sinaí', category: 'Monte', summary: 'Montaña donde Israel recibió la ley y celebró el pacto.', reference: 'Éxodo 19–24', bookIds: ['EXO'], note: 'La ubicación exacta se discute.' },
  { id: 'jerico', kind: 'lugar', name: 'Jericó', category: 'Ciudad', summary: 'Primera ciudad conquistada por Israel tras cruzar el Jordán.', reference: 'Josué 2–6', bookIds: ['JOS'] },
  { id: 'jerusalen', kind: 'lugar', name: 'Jerusalén', category: 'Ciudad', summary: 'Capital de David y sede del templo. Escenario central de la vida de Jesús en su última semana.', reference: '2 Samuel 5; 1 Reyes 6; Evangelios', bookIds: ['2SA', '1KI', 'MAT', 'LUK', 'JHN'] },
  { id: 'belen', kind: 'lugar', name: 'Belén', category: 'Ciudad', summary: 'Pueblo de Rut, David y, según los evangelios, del nacimiento de Jesús.', reference: 'Rut 1; 1 Samuel 16; Mateo 2', bookIds: ['RUT', '1SA', 'MAT', 'LUK'] },
  { id: 'nazaret', kind: 'lugar', name: 'Nazaret', category: 'Ciudad', summary: 'Pueblo de Galilea donde Jesús creció.', reference: 'Lucas 1–2; 4', bookIds: ['LUK', 'MAT'] },
  { id: 'capernaum', kind: 'lugar', name: 'Capernaúm', category: 'Ciudad', summary: 'Ciudad a orillas del mar de Galilea que sirvió de centro del ministerio de Jesús.', reference: 'Marcos 1–2', bookIds: ['MRK', 'MAT'] },
  { id: 'galilea', kind: 'lugar', name: 'Mar de Galilea', category: 'Mar o río', summary: 'Lago del norte de Israel, escenario de pesca, travesías y enseñanzas.', reference: 'Mateo 4; Juan 6', bookIds: ['MAT', 'MRK', 'JHN'] },
  { id: 'jordan', kind: 'lugar', name: 'Río Jordán', category: 'Mar o río', summary: 'Río cruzado por Josué, y donde Juan bautizaba.', reference: 'Josué 3; Mateo 3', bookIds: ['JOS', 'MAT'] },
  { id: 'samaria', kind: 'lugar', name: 'Samaria', category: 'Región', summary: 'Región y ciudad del reino del norte, después con población mixta y tensiones con los judíos.', reference: '1 Reyes 16; Juan 4', bookIds: ['1KI', '2KI', 'JHN'] },
  { id: 'carmelo', kind: 'lugar', name: 'Monte Carmelo', category: 'Monte', summary: 'Montaña donde Elías confrontó a los profetas de Baal.', reference: '1 Reyes 18', bookIds: ['1KI'] },
  { id: 'babilonia', kind: 'lugar', name: 'Babilonia', category: 'Ciudad', summary: 'Capital imperial que destruyó Jerusalén en 586 a. C. y donde vivió el exilio.', reference: '2 Reyes 24–25; Daniel', bookIds: ['2KI', 'DAN', 'EZK', 'JER'] },
  { id: 'ninive', kind: 'lugar', name: 'Nínive', category: 'Ciudad', summary: 'Capital de Asiria, destino de la misión de Jonás.', reference: 'Jonás; Nahúm', bookIds: ['JON', 'NAM'] },
  { id: 'susa', kind: 'lugar', name: 'Susa', category: 'Ciudad', summary: 'Capital persa donde se desarrolla la historia de Ester.', reference: 'Ester; Nehemías 1', bookIds: ['EST', 'NEH'] },
  { id: 'damasco', kind: 'lugar', name: 'Damasco', category: 'Ciudad', summary: 'Ciudad de Siria, camino en el que Saulo tuvo su encuentro con Cristo.', reference: 'Hechos 9', bookIds: ['ACT'] },
  { id: 'antioquia', kind: 'lugar', name: 'Antioquía de Siria', category: 'Ciudad', summary: 'Lugar donde los discípulos fueron llamados cristianos por primera vez y base de los viajes de Pablo.', reference: 'Hechos 11; 13', bookIds: ['ACT'] },
  { id: 'efeso', kind: 'lugar', name: 'Éfeso', category: 'Ciudad', summary: 'Gran ciudad de Asia Menor con una iglesia importante y destinataria de una carta.', reference: 'Hechos 19; Efesios', bookIds: ['ACT', 'EPH', '1TI'] },
  { id: 'corinto', kind: 'lugar', name: 'Corinto', category: 'Ciudad', summary: 'Puerto próspero de Grecia, destinatario de dos cartas de Pablo.', reference: 'Hechos 18; 1–2 Corintios', bookIds: ['ACT', '1CO', '2CO'] },
  { id: 'roma', kind: 'lugar', name: 'Roma', category: 'Ciudad', summary: 'Capital del Imperio. Pablo le escribió y llegó allí prisionero.', reference: 'Hechos 28; Romanos', bookIds: ['ACT', 'ROM'] },
  { id: 'patmos', kind: 'lugar', name: 'Patmos', category: 'Isla', summary: 'Isla del Egeo donde Juan recibió las visiones del Apocalipsis.', reference: 'Apocalipsis 1:9', bookIds: ['REV'] },
]

export const ENCYCLOPEDIA: EncyclopediaEntry[] = [...PEOPLE, ...PLACES]
