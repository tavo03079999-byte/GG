import { BookCollection } from '../types';

export const DEFAULT_BOOK_COLLECTIONS: BookCollection[] = [
  {
    id: 'babilonia',
    title: 'El hombre más rico de Babilonia',
    author: 'George S. Clason',
    category: 'Finanzas & Sabiduría Clásica',
    summary: 'Las leyes universales del dinero contadas a través de parábolas milenarias de la antigua Babilonia para alcanzar la riqueza y la libertad financiera.',
    coverGradient: 'from-amber-600 via-amber-700 to-yellow-900',
    shorts: [
      {
        id: 'babilonia-1',
        title: '💰 Regla #1: Págate a ti mismo primero',
        bookTitle: 'El hombre más rico de Babilonia',
        author: 'George S. Clason',
        category: 'Riqueza Personal',
        readTime: '45s',
        hook: 'Si ganas $1,000 y gastas $1,000, estás trabajando como esclavo de todos excepto de ti mismo.',
        coreInsight: 'De cada diez monedas que pongas en tu bolsa, gasta solo nueve. El 10% de todo lo que ganas te pertenece por derecho y debe quedarse contigo para edificar tu futuro imperio.',
        steps: [
          'Separa el 10% el mismo día que recibes tu dinero (no al final del mes).',
          'Aprende a vivir cómodamente con el 90% restante sin sacrificar lo esencial.',
          'Ese 10% no es para gastar en caprichos: es el capital semilla de tu libertad.'
        ],
        actionableTakeaway: 'Configura hoy una transferencia automática del 10% de tus ingresos a una cuenta intocable tan pronto caiga la nómina.',
        quote: 'Una parte de todo lo que gano me pertenece para conservarla.',
        visualTheme: 'gold',
        keyPhrases: ['Págate primero', 'Guarda el 10%', 'El poder de la semilla'],
        fullNarration: 'En la antigua Babilonia, Arkad, el hombre más acaudalado, reveló el mayor misterio del dinero: una parte de todo lo que ganas debe ser tuya para conservarla. Si ganas diez monedas, saca solo nueve para tus gastos. Ese diez por ciento no es lo que sobra a final de mes, es lo primero que apartas. Es la semilla dorada que construirá tu libertad.',
        likes: 1240,
        quiz: {
          question: '¿Cuál es la proporción mínima recomendada por Arkad para conservar de todo ingreso?',
          options: ['El 5% de las ganancias netas', 'Al menos una décima parte (10%)', 'Lo que sobre tras pagar las facturas', 'El 50% de tus inversiones'],
          correctAnswerIndex: 1,
          explanation: 'Arkad enseña que una décima parte (10%) es el mínimo innegociable para empezar a llenar tu bolsa.'
        }
      },
      {
        id: 'babilonia-2',
        title: '✂️ Regla #2: Controla tus gastos',
        bookTitle: 'El hombre más rico de Babilonia',
        author: 'George S. Clason',
        category: 'Control de Gastos',
        readTime: '40s',
        hook: '¿Por qué todos nos quejamos de que el dinero no alcanza, sin importar cuánto ganemos?',
        coreInsight: 'Confundimos habitualmente nuestros "deseos" con nuestras "necesidades necesarias". Los gastos que llamamos obligatorios crecen siempre hasta igualar a nuestros ingresos a menos que los frenemos con disciplina.',
        steps: [
          'Haz una lista honesta de cada gasto y clasifícalo: ¿Vital o capricho?',
          'Presupuesta únicamente para satisfacer tus necesidades y tus metas reales.',
          'No toques jamás el 10% reservado bajo ninguna excusa emocional.'
        ],
        actionableTakeaway: 'Aplica la regla de las 72 horas: antes de cualquier compra no esencial superior a $30, espera 3 días.',
        quote: 'No confundas tus gastos necesarios con tus deseos. Cada uno de nosotros tiene más deseos de los que sus ingresos pueden satisfacer.',
        visualTheme: 'amber',
        keyPhrases: ['Deseos vs Necesidades', 'Presupuesto implacable', 'Domina el impulso'],
        fullNarration: 'Los ciudadanos de Babilonia le preguntaban a Arkad: ¿cómo podemos ahorrar si apenas nos alcanza para vivir? Arkad sonrió y dijo: los gastos que llaman necesarios siempre crecen hasta devorar todo lo que ganan. Un deseo no es una necesidad. Graben en arcilla su presupuesto y no toquen la décima parte destinada a enriquecerse.',
        likes: 980,
        quiz: {
          question: 'Según el libro, ¿qué le ocurre a nuestros gastos si no se controlan activamente?',
          options: ['Disminuyen con la experiencia', 'Se mantienen estables', 'Crecen siempre hasta igualar o superar los ingresos', 'Se adaptan solos a la inflación'],
          correctAnswerIndex: 2,
          explanation: 'La ley humana demuestra que los gastos siempre se expanden hasta absorber todo ingreso disponible a menos que se fijen límites.'
        }
      },
      {
        id: 'babilonia-3',
        title: '🛡️ Regla #3: Invierte con expertos',
        bookTitle: 'El hombre más rico de Babilonia',
        author: 'George S. Clason',
        category: 'Inversión Inteligente',
        readTime: '45s',
        hook: 'Arkad perdió todos sus ahorros de un año por confiarle su dinero a un fabricante de ladrillos para comprar joyas.',
        coreInsight: 'Protege tu tesoro contra la pérdida asegurando el principal. Consulta solo a hombres con experiencia comprobada en el manejo de ese negocio específico. El consejo imprudente es la vía más rápida a la bancarrota.',
        steps: [
          'Nunca inviertas en promesas de ganancias milagrosas o rentabilidades absurdas.',
          'Si quieres invertir en bienes raíces, consulta a constructores; no a joyeros.',
          'La primera ley de la inversión no es ganar dinero, es no perder el capital.'
        ],
        actionableTakeaway: 'Antes de invertir en cualquier activo nuevo, verifica que el asesor viva de su propio éxito en ese campo y no de venderte cursos.',
        quote: 'El oro busca la protección de quien sabe cuidarlo y huye de quien se deja llevar por fantasías de enriquecimiento exprés.',
        visualTheme: 'emerald',
        keyPhrases: ['Protege tu principal', 'Cero milagros', 'Consejo de sabios'],
        fullNarration: 'Arkad confesó su mayor error de juventud: ahorró un año entero y le dio sus monedas a un fabricante de ladrillos llamado Azmur para que le trajera joyas preciosas de Tiro. Los fenicios engañaron a Azmur con pedazos de vidrio sin valor. Arkad aprendió que consultar a quien no conoce el oficio es tirar el oro al mar.',
        likes: 1530,
        quiz: {
          question: '¿Qué lección aprendió Arkad al perder su dinero con Azmur el ladrillero?',
          options: ['Que nunca se debe invertir', 'Que solo debes pedir consejo a expertos en la materia de la inversión', 'Que las joyas nunca tienen valor', 'Que debe prestar dinero a interés alto'],
          correctAnswerIndex: 1,
          explanation: 'Pedir consejo financiero a quien desconoce el rubro garantiza la ruina. Pide consejo sobre joyas a quien comercia con joyas.'
        }
      },
      {
        id: 'babilonia-4',
        title: '⚔️ Regla #4: Haz que tu oro trabaje para ti',
        bookTitle: 'El hombre más rico de Babilonia',
        author: 'George S. Clason',
        category: 'Interés Compuesto',
        readTime: '40s',
        hook: 'El oro acumulado en una caja fuerte es solo metal dormido. Tu dinero debe ser un ejército de esclavos dorados.',
        coreInsight: 'La verdadera riqueza no es el tamaño de tu bolsa, sino el flujo constante de ingresos que entra en ella sin importar si estás despierto, durmiendo o viajando.',
        steps: [
          'Pon cada moneda a trabajar para que genere hijos (intereses).',
          'Haz que los hijos de tus monedas también trabajen y generen nietos.',
          'Crea un torrente inagotable de ingresos pasivos diversificados.'
        ],
        actionableTakeaway: 'Reinvierte automáticamente todos los dividendos o rendimientos de tus ahorros en lugar de gastarlos para activar el interés compuesto.',
        quote: 'Cada moneda de oro que ganas debe convertirse en un esclavo que trabaja para ti y engendra nuevos trabajadores.',
        visualTheme: 'violet',
        keyPhrases: ['Ejército de oro', 'Ingresos pasivos', 'Interés compuesto'],
        fullNarration: 'Tener una bolsa llena de oro es solo el primer paso. El oro guardado en una vasija no produce nada. Arkad convirtió cada moneda en un trabajador incansable. Prestó a comerciantes solventes y reinvirtió los intereses, creando un río de riqueza constante que alimentaba su fortuna día y noche.',
        likes: 2100,
        quiz: {
          question: '¿Qué simbolizan los "hijos y nietos de las monedas de oro" en la parábola de Arkad?',
          options: ['Los impuestos del rey', 'Los intereses y dividendos reinvertidos (interés compuesto)', 'Las deudas acumuladas', 'El valor de la propiedad física'],
          correctAnswerIndex: 1,
          explanation: 'Los hijos del oro son las ganancias generadas, y sus nietos son los rendimientos de reinvertir esas ganancias: el interés compuesto.'
        }
      },
      {
        id: 'babilonia-5',
        title: '🚀 Regla #5: Aumenta tu capacidad de ganar',
        bookTitle: 'El hombre más rico de Babilonia',
        author: 'George S. Clason',
        category: 'Habilidades & Mentalidad',
        readTime: '45s',
        hook: 'El hombre que desea ganar más debe primero volverse más valioso.',
        coreInsight: 'A medida que el artesano perfecciona su oficio, su recompensa aumenta. Cultiva tus facultades, aprende nuevas destrezas, sé puntual, respeta tus deudas y mantén un deseo ardiente y definido de progreso.',
        steps: [
          'No desees vagamente "ser rico". Desea metas específicas y medibles.',
          'Dedica tiempo cada semana a dominar las mejores técnicas de tu profesión.',
          'Paga tus deudas con honor y dignidad para que tu reputación te abra puertas.'
        ],
        actionableTakeaway: 'Dedica 20 minutos diarios a estudiar una habilidad de alto valor que multiplique tu productividad profesional.',
        quote: 'Cuanta más sabiduría adquirimos, más podemos ganar. Aquel hombre que busca aprender más de su oficio será abundantemente recompensado.',
        visualTheme: 'cyan',
        keyPhrases: ['Aprende más para ganar más', 'Metas concretas', 'Reputación de acero'],
        fullNarration: 'Los deseos vagos como "quiero mucho dinero" no tienen fuerza. Un deseo fuerte debe ser claro, pequeño y concreto. Quien aprende mejor los secretos de su oficio gana más que sus colegas. La sabiduría práctica es el mayor multiplicador de ingresos que existe sobre la tierra.',
        likes: 1840,
        quiz: {
          question: '¿Cuál es el requisito clave de un deseo de progreso para que se haga realidad según Babilonia?',
          options: ['Que dependa de la suerte de los dioses', 'Que sea concreto, definido y no una simple ilusión vaga', 'Que se mantenga en secreto', 'Que requiera poco esfuerzo'],
          correctAnswerIndex: 1,
          explanation: 'Los deseos deben ser definidos y alcanzables paso a paso; los deseos generales carecen de poder de acción.'
        }
      }
    ]
  },
  {
    id: 'habitos-atomicos',
    title: 'Hábitos Atómicos',
    author: 'James Clear',
    category: 'Productividad & Comportamiento',
    summary: 'El método definitivo para crear buenos hábitos, romper los malos y lograr cambios exponenciales mediante micro-mejoras del 1% diario.',
    coverGradient: 'from-blue-600 via-indigo-700 to-purple-900',
    shorts: [
      {
        id: 'habitos-1',
        title: '📈 El efecto del 1% diario',
        bookTitle: 'Hábitos Atómicos',
        author: 'James Clear',
        category: 'Mejora Continua',
        readTime: '40s',
        hook: 'Si mejoras un 1% cada día durante un año, terminarás 37 veces mejor. Si empeoras 1%, descenderás a cero.',
        coreInsight: 'Los hábitos son el interés compuesto de la superación personal. Los efectos de tus hábitos diarios se multiplican con el tiempo exactamente igual que el dinero invertido.',
        steps: [
          'Olvida las metas gigantescas; enfócate en tus sistemas diarios.',
          'Una pequeña decisión hoy parece insignificante, pero define tu década.',
          'El éxito no depende de grandes saltos, sino de la acumulación silenciosa.'
        ],
        actionableTakeaway: 'Elige un hábito clave y mejóralo solo un 1% hoy (1 página más de lectura, 1 repetición más de ejercicio).',
        quote: 'No te elevas al nivel de tus metas. Caes al nivel de tus sistemas.',
        visualTheme: 'indigo',
        keyPhrases: ['37x mejor', 'Sistemas > Metas', 'El interés compuesto del hábito'],
        fullNarration: 'A menudo nos convencemos de que un cambio revolucionario requiere una acción descomunal. James Clear demuestra lo contrario: mejorar apenas un 1% cada día parece invisible hoy, pero al cabo de un año te convierte en una persona 37 veces más capaz. Tus hábitos son el interés compuesto de tu identidad.',
        likes: 2450,
        quiz: {
          question: '¿Por qué James Clear afirma que los sistemas son más importantes que las metas?',
          options: ['Porque las metas son inútiles', 'Porque tanto los ganadores como los perdedores comparten las mismas metas, lo que cambia es el sistema diario', 'Porque las metas quitan motivación', 'Porque los sistemas no requieren esfuerzo'],
          correctAnswerIndex: 1,
          explanation: 'Todos los atletas quieren la medalla de oro (misma meta). Solo quien tiene el mejor sistema de entrenamiento diario la consigue.'
        }
      },
      {
        id: 'habitos-2',
        title: '⏱️ La regla de los 2 minutos',
        bookTitle: 'Hábitos Atómicos',
        author: 'James Clear',
        category: 'Anti-Procrastinación',
        readTime: '35s',
        hook: '¿Cómo empezar a hacer ejercicio o leer cuando tu cerebro tiene cero ganas?',
        coreInsight: 'Cuando empieces un nuevo hábito, debe tomarte menos de dos minutos hacerlo. Haz que comenzar sea tan ridículamente fácil que no puedas decir que no.',
        steps: [
          '"Leer 30 libros al año" se convierte en "leer una sola página".',
          '"Correr 10 kilómetros" se convierte en "ponerte las zapatillas de correr".',
          'Estandariza antes de optimizar. No puedes mejorar un hábito que no existe.'
        ],
        actionableTakeaway: 'Para cualquier hábito que estés procrastinando, reduce su primer paso a una acción de 120 segundos.',
        quote: 'Un hábito debe ser establecido antes de que pueda ser mejorado.',
        visualTheme: 'cyan',
        keyPhrases: ['2 minutos mágicos', 'Estandariza primero', 'Derrota la inercia'],
        fullNarration: 'El mayor obstáculo de cualquier hábito es el arranque. La regla de los 2 minutos dice: reduce cualquier acción deseada a una versión de 120 segundos. Ponerte la ropa de deporte, abrir el libro y leer tres líneas. Una vez que superas la fricción inicial, el impulso natural te mantiene en movimiento.',
        likes: 3120,
        quiz: {
          question: '¿Cuál es el objetivo principal de la regla de los 2 minutos?',
          options: ['Terminar la tarea rápido para descansar', 'Superar la fricción de inicio para estandarizar la conducta', 'Hacer ejercicio muy intenso por poco tiempo', 'Medir la velocidad de lectura'],
          correctAnswerIndex: 1,
          explanation: 'La regla elimina la resistencia psicológica del inicio. Una vez empezado, es infinitamente más fácil continuar.'
        }
      },
      {
        id: 'habitos-3',
        title: '🪞 Identidad basada en hábitos',
        bookTitle: 'Hábitos Atómicos',
        author: 'James Clear',
        category: 'Transformación Mental',
        readTime: '45s',
        hook: 'No digas: "Estoy intentando dejar de fumar". Di: "No soy fumador".',
        coreInsight: 'El cambio de conducta más profundo ocurre a nivel de identidad. Tu objetivo no es leer un libro, el objetivo es convertirte en un lector. Cada acción que tomas es un voto por la persona que deseas ser.',
        steps: [
          'Capa 1: Cambiar resultados (perder peso). Poco duradero.',
          'Capa 2: Cambiar procesos (ir al gimnasio). Bueno pero incompleto.',
          'Capa 3: Cambiar identidad (soy una persona saludable). Imparable.'
        ],
        actionableTakeaway: 'Ante cualquier dilema hoy, pregúntate: "¿Qué haría en mi lugar la persona en la que quiero convertirme?"',
        quote: 'Cada acción que tomas es un voto a favor del tipo de persona en la que te convertirás.',
        visualTheme: 'rose',
        keyPhrases: ['Cambio de identidad', 'Emite tu voto diario', 'Sé el tipo de persona'],
        fullNarration: 'Hay tres niveles de cambio: resultados, procesos e identidad. Si cambias la meta pero tu mente sigue creyendo que eres indisciplinado, volverás a caer. Cambia la identidad: no corres para bajar kilos, corres porque eres un atleta. Cada vez que tomas una buena decisión, depositas un voto en la urna de tu nuevo yo.',
        likes: 2890,
        quiz: {
          question: '¿Cuál es el nivel más profundo y sostenible de cambio de hábitos?',
          options: ['El nivel de recompensas materiales', 'El nivel de resultados y premios externos', 'El nivel de identidad y autoconcepto', 'El nivel de presión social'],
          correctAnswerIndex: 2,
          explanation: 'Cuando una conducta se alinea con quién crees que eres (tu identidad), ya no luchas contra ti mismo para mantenerla.'
        }
      }
    ]
  },
  {
    id: 'psicologia-dinero',
    title: 'La Psicología del Dinero',
    author: 'Morgan Housel',
    category: 'Finanzas Conductuales',
    summary: 'Lecciones intemporales sobre la riqueza, la codicia y la felicidad donde el comportamiento importa mucho más que la inteligencia matemática.',
    coverGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    shorts: [
      {
        id: 'psicologia-1',
        title: '🕊️ La libertad: el dividendo supremo',
        bookTitle: 'La Psicología del Dinero',
        author: 'Morgan Housel',
        category: 'Filosofía Financiera',
        readTime: '40s',
        hook: 'Tener un Ferrari impresiona a los demás; tener control sobre tus mañanas te hace libre.',
        coreInsight: 'La mayor ganancia intrínseca que el dinero puede comprar es el control sobre tu tiempo. Poder levantarte cada día y decir: "Hoy puedo hacer lo que quiera, con quien quiera y por el tiempo que quiera".',
        steps: [
          'La riqueza invisible es el dinero que NO gastas en lucirte.',
          'Un colchón financiero te da el poder de renunciar a un mal trabajo o emprender.',
          'La felicidad humana correlaciona más con la autonomía que con el salario.'
        ],
        actionableTakeaway: 'Calcula cuántos meses de vida cubre tu fondo de emergencia. Esa es tu verdadera cota de libertad personal.',
        quote: 'El mayor dividendo del dinero es la capacidad de controlar tu propio tiempo.',
        visualTheme: 'emerald',
        keyPhrases: ['Control de tu tiempo', 'Riqueza invisible', 'Autonomía = Felicidad'],
        fullNarration: 'Morgan Housel cuenta que la gente cree que quiere mansiones y autos de lujo para sentirse respetada, pero en realidad descubren que los demás miran al auto, no a quien lo conduce. El verdadero superpoder del dinero ahorrado es la autonomía: despertarte cada mañana siendo el dueño absoluto de tu calendario.',
        likes: 1980,
        quiz: {
          question: '¿Cómo define Morgan Housel la verdadera riqueza en el libro?',
          options: ['El valor de los bienes de lujo que compras', 'La riqueza es lo que no ves: los autos no comprados y el dinero ahorrado que te da libertad', 'El sueldo más alto en tu círculo de amigos', 'Tener muchas propiedades con hipoteca'],
          correctAnswerIndex: 1,
          explanation: 'La riqueza es la opción financiera no gastada que otorga tranquilidad y margen de maniobra, no el consumo ostentoso.'
        }
      },
      {
        id: 'psicologia-2',
        title: '🛑 La trampa del "Nunca es Suficiente"',
        bookTitle: 'La Psicología del Dinero',
        author: 'Morgan Housel',
        category: 'Control de la Codicia',
        readTime: '45s',
        hook: 'Rajat Gupta era multimillonario, director de McKinsey y asesor de presidentes. Lo arriesgó todo por codicia.',
        coreInsight: 'La habilidad financiera más difícil es lograr que los postes de la meta dejen de moverse. Arriesgar lo que tienes y necesitas por lo que no tienes y no necesitas es la mayor locura humana.',
        steps: [
          'La comparación social es una batalla infinita donde nadie gana.',
          'Definir tu propio "suficiente" es el mayor escudo de paz mental.',
          'La reputación y la libertad no tienen precio de reposición.'
        ],
        actionableTakeaway: 'Escribe en una nota cuál es tu número mensual de felicidad sostenible y celébralo cuando lo alcances.',
        quote: 'No hay ninguna razón para arriesgar lo que tienes y necesitas por conseguir lo que no tienes y no necesitas.',
        visualTheme: 'violet',
        keyPhrases: ['Define tu suficiente', 'Detén los postes de la meta', 'Paz sobre codicia'],
        fullNarration: 'En una fiesta en Nueva York, el escritor Kurt Vonnegut le dijo a Joseph Heller que el anfitrión, un gestor de fondos de cobertura, ganaba en un solo día más de lo que Heller había ganado con toda su famosa novela. Heller contestó: Sí, pero yo tengo algo que él nunca tendrá: la noción de suficiente.',
        likes: 1670,
        quiz: {
          question: '¿Por qué la habilidad de definir "suficiente" es tan crucial en las finanzas?',
          options: ['Porque te impide ganar dinero', 'Porque si la meta se mueve constantemente, jamás experimentarás satisfacción ni paz mental', 'Porque ahorras en impuestos', 'Porque el mercado bursátil lo exige'],
          correctAnswerIndex: 1,
          explanation: 'Si cada aumento de ingresos solo incrementa tus deseos, siempre vivirás con ansiedad de escasez.'
        }
      }
    ]
  }
];
