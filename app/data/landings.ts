import type { RatioId } from '~/utils/layouts'

export type LocaleCode = 'es' | 'en' | 'pt'

export interface LandingContent {
  /** Texto corto para enlaces internos. */
  label: string
  metaTitle: string
  description: string
  h1: string
  intro: string[]
  tips: string[]
  faq: { q: string, a: string }[]
}

export interface Landing {
  key: string
  layouts: string[]
  ratio?: RatioId
  slugs: Record<LocaleCode, string>
  content: Record<LocaleCode, LandingContent>
}

export const LANDINGS: Landing[] = [
  {
    key: 'two',
    layouts: ['duo-cols', 'duo-rows', 'duo-wide-left'],
    slugs: { es: 'collage-2-fotos', en: '2-photo-collage', pt: 'colagem-2-fotos' },
    content: {
      es: {
        label: 'Collage de 2 fotos',
        metaTitle: 'Collage de 2 fotos gratis: une dos fotos en una',
        description: 'Une dos fotos en una sola imagen, lado a lado o una encima de la otra. Gratis, sin registro y en alta calidad.',
        h1: 'Une dos fotos en un collage',
        intro: [
          'Juntar dos fotos en una es la forma más rápida de contar una historia: un antes y un después, dos momentos del mismo viaje o la misma persona en dos épocas.',
          'Elige si las quieres lado a lado, una encima de la otra o con una foto más grande que la otra, y descarga el resultado listo para publicar.',
        ],
        tips: [
          'Para comparar dos fotos, usa la plantilla lado a lado y el mismo zoom en ambas.',
          'Si una foto es vertical y la otra horizontal, la plantilla con una foto más ancha evita recortes extraños.',
          'Un espaciado fino y fondo blanco da un acabado limpio, como de revista.',
        ],
        faq: [
          { q: '¿Cómo pongo dos fotos juntas en una sola?', a: 'Abre el editor con la plantilla de 2 fotos, toca cada celda para elegir una foto y pulsa Descargar.' },
          { q: '¿Puedo poner una foto encima de la otra?', a: 'Sí. Elige la plantilla de dos filas; funciona muy bien con el formato 4:5 de Instagram.' },
        ],
      },
      en: {
        label: '2-photo collage',
        metaTitle: 'Free 2-photo collage: combine two photos into one',
        description: 'Combine two photos into one image, side by side or one above the other. Free, no sign-up, high quality.',
        h1: 'Combine two photos in one collage',
        intro: [
          'Putting two photos together is the quickest way to tell a story: a before and after, two moments from the same trip or the same person years apart.',
          'Choose side by side, stacked, or one photo bigger than the other, and download the result ready to post.',
        ],
        tips: [
          'To compare two photos, use the side-by-side template and the same zoom on both.',
          'If one photo is portrait and the other landscape, the template with one wider photo avoids awkward crops.',
          'Thin spacing and a white background give a clean, magazine-like finish.',
        ],
        faq: [
          { q: 'How do I put two photos together into one?', a: 'Open the editor with the 2-photo template, tap each cell to pick a photo and press Download.' },
          { q: 'Can I put one photo above the other?', a: 'Yes. Pick the two-row template; it works great with the Instagram 4:5 format.' },
        ],
      },
      pt: {
        label: 'Colagem de 2 fotos',
        metaTitle: 'Colagem de 2 fotos grátis: junte duas fotos em uma',
        description: 'Junte duas fotos em uma só imagem, lado a lado ou uma em cima da outra. Grátis, sem cadastro e em alta qualidade.',
        h1: 'Junte duas fotos em uma colagem',
        intro: [
          'Juntar duas fotos em uma é o jeito mais rápido de contar uma história: um antes e depois, dois momentos da mesma viagem ou a mesma pessoa em épocas diferentes.',
          'Escolha se quer as fotos lado a lado, uma em cima da outra ou uma maior que a outra, e baixe o resultado pronto para publicar.',
        ],
        tips: [
          'Para comparar duas fotos, use o modelo lado a lado e o mesmo zoom nas duas.',
          'Se uma foto é vertical e a outra horizontal, o modelo com uma foto mais larga evita cortes estranhos.',
          'Espaçamento fino e fundo branco dão um acabamento limpo, de revista.',
        ],
        faq: [
          { q: 'Como coloco duas fotos juntas em uma só?', a: 'Abra o editor com o modelo de 2 fotos, toque em cada célula para escolher uma foto e clique em Baixar.' },
          { q: 'Posso colocar uma foto em cima da outra?', a: 'Sim. Escolha o modelo de duas linhas; ele fica ótimo no formato 4:5 do Instagram.' },
        ],
      },
    },
  },
  {
    key: 'three',
    layouts: ['trio-left-big', 'trio-cols', 'trio-top-big', 'trio-bottom-big', 'trio-rows'],
    slugs: { es: 'collage-3-fotos', en: '3-photo-collage', pt: 'colagem-3-fotos' },
    content: {
      es: {
        label: 'Collage de 3 fotos',
        metaTitle: 'Collage de 3 fotos gratis en línea',
        description: 'Plantillas para unir tres fotos: en columnas, en filas o con una foto principal. Descarga gratis en alta calidad.',
        h1: 'Haz un collage de 3 fotos',
        intro: [
          'Tres fotos permiten destacar una imagen principal y acompañarla con dos detalles, o mostrar una secuencia: llegada, momento y despedida.',
          'Las plantillas de 3 fotos incluyen tres columnas para formatos horizontales, tres filas para historias y diseños con una foto grande.',
        ],
        tips: [
          'Pon la foto con más impacto en la celda grande y los detalles en las pequeñas.',
          'Tres columnas funcionan mejor en formato horizontal 16:9; tres filas, en 9:16.',
          'Usa el mismo filtro en las tres fotos para que el collage se vea uniforme.',
        ],
        faq: [
          { q: '¿Qué plantilla de 3 fotos uso para Instagram?', a: 'La de una foto grande arriba y dos abajo, en formato 4:5, ocupa más espacio en el feed.' },
          { q: '¿Puedo cambiar el orden de las fotos?', a: 'Sí. Selecciona una celda, pulsa Intercambiar y toca la celda con la que quieres cambiarla.' },
        ],
      },
      en: {
        label: '3-photo collage',
        metaTitle: 'Free 3-photo collage maker online',
        description: 'Templates to combine three photos: in columns, rows or with a featured photo. Free high-quality download.',
        h1: 'Make a 3-photo collage',
        intro: [
          'Three photos let you feature one main image with two details, or show a sequence: arrival, the moment and goodbye.',
          'The 3-photo templates include three columns for landscape formats, three rows for stories and layouts with one large photo.',
        ],
        tips: [
          'Put your strongest photo in the large cell and the details in the small ones.',
          'Three columns work best in 16:9 landscape; three rows in 9:16.',
          'Use the same filter on all three photos so the collage looks consistent.',
        ],
        faq: [
          { q: 'Which 3-photo template should I use for Instagram?', a: 'One large photo on top and two below, in 4:5, takes up the most space in the feed.' },
          { q: 'Can I change the order of the photos?', a: 'Yes. Select a cell, press Swap and tap the cell you want to swap it with.' },
        ],
      },
      pt: {
        label: 'Colagem de 3 fotos',
        metaTitle: 'Colagem de 3 fotos grátis online',
        description: 'Modelos para juntar três fotos: em colunas, em linhas ou com uma foto principal. Download grátis em alta qualidade.',
        h1: 'Faça uma colagem de 3 fotos',
        intro: [
          'Três fotos permitem destacar uma imagem principal com dois detalhes, ou mostrar uma sequência: chegada, momento e despedida.',
          'Os modelos de 3 fotos incluem três colunas para formatos horizontais, três linhas para stories e layouts com uma foto grande.',
        ],
        tips: [
          'Coloque a foto de maior impacto na célula grande e os detalhes nas pequenas.',
          'Três colunas funcionam melhor em 16:9 horizontal; três linhas, em 9:16.',
          'Use o mesmo filtro nas três fotos para a colagem ficar uniforme.',
        ],
        faq: [
          { q: 'Qual modelo de 3 fotos usar no Instagram?', a: 'O de uma foto grande em cima e duas embaixo, em 4:5, ocupa mais espaço no feed.' },
          { q: 'Posso mudar a ordem das fotos?', a: 'Sim. Selecione uma célula, toque em Trocar e depois na célula com a qual quer trocar.' },
        ],
      },
    },
  },
  {
    key: 'four',
    layouts: ['grid-4', 'four-left-big', 'four-top-big', 'four-mosaic', 'four-strip', 'four-cols'],
    slugs: { es: 'collage-4-fotos', en: '4-photo-collage', pt: 'colagem-4-fotos' },
    content: {
      es: {
        label: 'Collage de 4 fotos',
        metaTitle: 'Collage de 4 fotos gratis: cuadrícula y mosaico',
        description: 'Une cuatro fotos en una cuadrícula 2×2, en mosaico, en tira o con una foto principal. Gratis y sin registro.',
        h1: 'Crea un collage de 4 fotos',
        intro: [
          'La cuadrícula de cuatro fotos es el collage clásico: equilibrada, fácil de leer y perfecta para resumir un día, un viaje o un evento.',
          'Además de la cuadrícula 2×2 tienes mosaicos asimétricos, una tira vertical tipo fotomatón y diseños con una foto destacada.',
        ],
        tips: [
          'En la cuadrícula 2×2, alterna fotos claras y oscuras en diagonal para equilibrar el conjunto.',
          'La tira vertical en formato 9:16 queda perfecta para historias.',
          'Si quieres un estilo más moderno, sube el espaciado y redondea las esquinas.',
        ],
        faq: [
          { q: '¿Cómo hago un collage de 4 fotos en el celular?', a: 'Abre el editor, pulsa Añadir fotos, elige las cuatro de tu galería y se colocarán solas en la cuadrícula.' },
          { q: '¿El collage pierde calidad?', a: 'No, si eliges Alta calidad o Máxima al descargar: el collage se genera a 2160 o 3840 píxeles.' },
        ],
      },
      en: {
        label: '4-photo collage',
        metaTitle: 'Free 4-photo collage: grid and mosaic',
        description: 'Combine four photos in a 2×2 grid, mosaic, strip or with a featured photo. Free and no sign-up.',
        h1: 'Create a 4-photo collage',
        intro: [
          'The four-photo grid is the classic collage: balanced, easy to read and perfect for summing up a day, a trip or an event.',
          'Besides the 2×2 grid you get asymmetric mosaics, a vertical photo-booth strip and layouts with one featured photo.',
        ],
        tips: [
          'In the 2×2 grid, alternate light and dark photos diagonally to balance the whole.',
          'The vertical strip in 9:16 is perfect for stories.',
          'For a more modern look, increase the spacing and round the corners.',
        ],
        faq: [
          { q: 'How do I make a 4-photo collage on my phone?', a: 'Open the editor, tap Add photos, pick four from your gallery and they fill the grid automatically.' },
          { q: 'Does the collage lose quality?', a: 'Not if you choose High quality or Maximum when downloading: the collage is generated at 2160 or 3840 pixels.' },
        ],
      },
      pt: {
        label: 'Colagem de 4 fotos',
        metaTitle: 'Colagem de 4 fotos grátis: grade e mosaico',
        description: 'Junte quatro fotos em uma grade 2×2, mosaico, tira ou com uma foto principal. Grátis e sem cadastro.',
        h1: 'Crie uma colagem de 4 fotos',
        intro: [
          'A grade de quatro fotos é a colagem clássica: equilibrada, fácil de ver e perfeita para resumir um dia, uma viagem ou um evento.',
          'Além da grade 2×2, há mosaicos assimétricos, uma tira vertical estilo cabine de fotos e layouts com uma foto em destaque.',
        ],
        tips: [
          'Na grade 2×2, alterne fotos claras e escuras na diagonal para equilibrar o conjunto.',
          'A tira vertical em 9:16 fica perfeita para stories.',
          'Para um visual mais moderno, aumente o espaçamento e arredonde os cantos.',
        ],
        faq: [
          { q: 'Como faço uma colagem de 4 fotos no celular?', a: 'Abra o editor, toque em Adicionar fotos, escolha quatro da galeria e elas preenchem a grade sozinhas.' },
          { q: 'A colagem perde qualidade?', a: 'Não, se você escolher Alta qualidade ou Máxima ao baixar: a colagem é gerada com 2160 ou 3840 pixels.' },
        ],
      },
    },
  },
  {
    key: 'six',
    layouts: ['grid-6', 'grid-6-tall', 'six-feature', 'five-two-three', 'five-left-big', 'five-top-big'],
    slugs: { es: 'collage-6-fotos', en: '6-photo-collage', pt: 'colagem-6-fotos' },
    content: {
      es: {
        label: 'Collage de 5 y 6 fotos',
        metaTitle: 'Collage de 5 o 6 fotos gratis',
        description: 'Plantillas para 5 y 6 fotos: cuadrículas, mosaicos y diseños con una foto principal. Ideal para resumir un viaje o evento.',
        h1: 'Collage de 5 y 6 fotos',
        intro: [
          'Con cinco o seis fotos ya puedes resumir un viaje completo, una boda o un fin de semana con amigos en una sola imagen.',
          'Elige una cuadrícula uniforme si todas las fotos son igual de importantes, o un diseño con una foto grande si una de ellas es la protagonista.',
        ],
        tips: [
          'Con muchas fotos, un espaciado de 8 a 16 ayuda a separar cada imagen sin perder espacio.',
          'Ordena las fotos por color o por momento del día para que el collage tenga ritmo.',
          'Deja la foto grande para la imagen más amplia, como un paisaje o una foto de grupo.',
        ],
        faq: [
          { q: '¿Puedo añadir las seis fotos a la vez?', a: 'Sí. Selecciónalas todas en Añadir fotos y se reparten automáticamente en las celdas libres.' },
          { q: '¿Qué pasa si tengo más fotos que celdas?', a: 'Las fotos que sobren quedan en la pestaña Fotos; puedes arrastrarlas a cualquier celda o cambiar a una plantilla más grande.' },
        ],
      },
      en: {
        label: '5 and 6-photo collage',
        metaTitle: 'Free 5 or 6-photo collage',
        description: 'Templates for 5 and 6 photos: grids, mosaics and featured-photo layouts. Great for summing up a trip or event.',
        h1: '5 and 6-photo collages',
        intro: [
          'With five or six photos you can sum up a whole trip, a wedding or a weekend with friends in a single image.',
          'Pick an even grid if every photo matters equally, or a layout with one large photo if one of them is the star.',
        ],
        tips: [
          'With many photos, spacing of 8 to 16 separates each image without wasting space.',
          'Order the photos by color or time of day to give the collage rhythm.',
          'Save the large cell for the widest image, like a landscape or group shot.',
        ],
        faq: [
          { q: 'Can I add all six photos at once?', a: 'Yes. Select them all in Add photos and they fill the empty cells automatically.' },
          { q: 'What if I have more photos than cells?', a: 'Extra photos stay in the Photos tab; drag them onto any cell or switch to a bigger template.' },
        ],
      },
      pt: {
        label: 'Colagem de 5 e 6 fotos',
        metaTitle: 'Colagem de 5 ou 6 fotos grátis',
        description: 'Modelos para 5 e 6 fotos: grades, mosaicos e layouts com foto principal. Ideal para resumir uma viagem ou evento.',
        h1: 'Colagem de 5 e 6 fotos',
        intro: [
          'Com cinco ou seis fotos você já resume uma viagem inteira, um casamento ou um fim de semana com amigos em uma só imagem.',
          'Escolha uma grade uniforme se todas as fotos são igualmente importantes, ou um layout com foto grande se uma delas é a protagonista.',
        ],
        tips: [
          'Com muitas fotos, um espaçamento de 8 a 16 separa cada imagem sem desperdiçar espaço.',
          'Organize as fotos por cor ou por horário para dar ritmo à colagem.',
          'Deixe a célula grande para a imagem mais ampla, como uma paisagem ou foto de grupo.',
        ],
        faq: [
          { q: 'Posso adicionar as seis fotos de uma vez?', a: 'Sim. Selecione todas em Adicionar fotos e elas se distribuem nas células livres.' },
          { q: 'E se eu tiver mais fotos que células?', a: 'As fotos extras ficam na aba Fotos; arraste-as para qualquer célula ou mude para um modelo maior.' },
        ],
      },
    },
  },
  {
    key: 'nine',
    layouts: ['grid-9', 'nine-feature', 'seven-bands', 'grid-8', 'grid-12', 'grid-16'],
    slugs: { es: 'collage-9-fotos', en: '9-photo-collage', pt: 'colagem-9-fotos' },
    content: {
      es: {
        label: 'Collage de 9 o más fotos',
        metaTitle: 'Collage de 9, 12 o 16 fotos gratis',
        description: 'Cuadrículas de 7 a 16 fotos para resúmenes del año, viajes y álbumes. Descarga en hasta 4K para imprimir.',
        h1: 'Collage de 9 fotos o más',
        intro: [
          'Una cuadrícula de nueve fotos es ideal para un resumen del año, el mejor momento de cada mes o un álbum de viaje en una sola imagen.',
          'Si necesitas más espacio, hay plantillas de 12 y 16 fotos. Descárgalas en tamaño máximo para imprimirlas sin perder detalle.',
        ],
        tips: [
          'Con muchas celdas pequeñas, elige fotos con un sujeto claro y poco fondo.',
          'Para imprimir, usa el formato A4 o 2:3 y descarga en tamaño Máxima.',
          'Un espaciado pequeño, de 4 a 8, hace que la cuadrícula se vea como un solo bloque.',
        ],
        faq: [
          { q: '¿Cuál es el máximo de fotos en un collage?', a: 'La plantilla más grande tiene 16 fotos en una cuadrícula de 4×4.' },
          { q: '¿Puedo imprimir el collage?', a: 'Sí. Descárgalo en tamaño Máxima (3840 px en el lado largo), suficiente para imprimir en A4 con buena calidad.' },
        ],
      },
      en: {
        label: '9+ photo collage',
        metaTitle: 'Free 9, 12 or 16-photo collage',
        description: 'Grids for 7 to 16 photos for year recaps, trips and albums. Download up to 4K for printing.',
        h1: 'Collages with 9 photos or more',
        intro: [
          'A nine-photo grid is ideal for a year in review, the best moment of each month or a whole travel album in one image.',
          'Need more room? There are 12 and 16-photo templates. Download at maximum size to print without losing detail.',
        ],
        tips: [
          'With many small cells, choose photos with a clear subject and little background.',
          'For printing, use the A4 or 2:3 format and download at Maximum size.',
          'Small spacing, 4 to 8, makes the grid read as one block.',
        ],
        faq: [
          { q: 'What is the most photos a collage can have?', a: 'The largest template holds 16 photos in a 4×4 grid.' },
          { q: 'Can I print the collage?', a: 'Yes. Download it at Maximum size (3840 px on the long side), enough to print A4 in good quality.' },
        ],
      },
      pt: {
        label: 'Colagem de 9 ou mais fotos',
        metaTitle: 'Colagem de 9, 12 ou 16 fotos grátis',
        description: 'Grades de 7 a 16 fotos para retrospectivas, viagens e álbuns. Baixe em até 4K para imprimir.',
        h1: 'Colagem de 9 fotos ou mais',
        intro: [
          'Uma grade de nove fotos é ideal para uma retrospectiva do ano, o melhor momento de cada mês ou um álbum de viagem em uma imagem.',
          'Precisa de mais espaço? Há modelos de 12 e 16 fotos. Baixe no tamanho máximo para imprimir sem perder detalhes.',
        ],
        tips: [
          'Com muitas células pequenas, escolha fotos com um assunto claro e pouco fundo.',
          'Para imprimir, use o formato A4 ou 2:3 e baixe no tamanho Máxima.',
          'Um espaçamento pequeno, de 4 a 8, faz a grade parecer um só bloco.',
        ],
        faq: [
          { q: 'Qual o máximo de fotos em uma colagem?', a: 'O maior modelo tem 16 fotos em uma grade 4×4.' },
          { q: 'Posso imprimir a colagem?', a: 'Sim. Baixe no tamanho Máxima (3840 px no lado maior), suficiente para imprimir em A4 com boa qualidade.' },
        ],
      },
    },
  },
  {
    key: 'instagram',
    layouts: ['four-top-big', 'trio-top-big', 'duo-rows', 'grid-6-tall', 'five-top-big', 'seven-bands'],
    ratio: '4:5',
    slugs: { es: 'collage-para-instagram', en: 'instagram-collage', pt: 'colagem-para-instagram' },
    content: {
      es: {
        label: 'Collage para Instagram',
        metaTitle: 'Collage para Instagram en formato 4:5, gratis',
        description: 'Crea collages en el formato vertical 4:5 que ocupa más espacio en el feed de Instagram. Sin marca de agua.',
        h1: 'Collage para el feed de Instagram',
        intro: [
          'Instagram muestra las publicaciones verticales 4:5 más grandes que las cuadradas, así que un collage en ese formato llama más la atención en el feed.',
          'Estas plantillas ya vienen en 4:5. Añade tus fotos, ajusta el encuadre y descarga en 1080 px, el tamaño que usa Instagram.',
        ],
        tips: [
          'Descarga en tamaño Redes sociales (1080 px): Instagram reduce las imágenes más grandes de todas formas.',
          'Evita texto pequeño cerca de los bordes; en la cuadrícula del perfil se recorta a 3:4.',
          'Para un carrusel, crea varios collages con la misma plantilla y el mismo fondo.',
        ],
        faq: [
          { q: '¿Qué tamaño debe tener un collage para Instagram?', a: 'El formato 4:5 a 1080 × 1350 píxeles es el que más espacio ocupa en el feed.' },
          { q: '¿Puedo publicarlo directo desde el celular?', a: 'Sí. Al descargar, pulsa Compartir y elige Instagram en la lista de apps.' },
        ],
      },
      en: {
        label: 'Instagram collage',
        metaTitle: 'Free Instagram collage in 4:5 format',
        description: 'Make collages in the vertical 4:5 format that takes up the most space in the Instagram feed. No watermark.',
        h1: 'Collages for your Instagram feed',
        intro: [
          'Instagram shows 4:5 vertical posts larger than square ones, so a collage in that format stands out more in the feed.',
          'These templates already come in 4:5. Add your photos, adjust the framing and download at 1080 px, the size Instagram uses.',
        ],
        tips: [
          'Download at Social media size (1080 px): Instagram scales larger images down anyway.',
          'Avoid small text near the edges; the profile grid crops posts to 3:4.',
          'For a carousel, make several collages with the same template and background.',
        ],
        faq: [
          { q: 'What size should an Instagram collage be?', a: 'The 4:5 format at 1080 × 1350 pixels takes up the most space in the feed.' },
          { q: 'Can I post it straight from my phone?', a: 'Yes. After downloading, tap Share and choose Instagram from the list of apps.' },
        ],
      },
      pt: {
        label: 'Colagem para Instagram',
        metaTitle: 'Colagem para Instagram em formato 4:5, grátis',
        description: 'Crie colagens no formato vertical 4:5, que ocupa mais espaço no feed do Instagram. Sem marca d’água.',
        h1: 'Colagem para o feed do Instagram',
        intro: [
          'O Instagram mostra posts verticais 4:5 maiores que os quadrados, então uma colagem nesse formato chama mais atenção no feed.',
          'Estes modelos já vêm em 4:5. Adicione suas fotos, ajuste o enquadramento e baixe em 1080 px, o tamanho usado pelo Instagram.',
        ],
        tips: [
          'Baixe no tamanho Redes sociais (1080 px): o Instagram reduz imagens maiores de qualquer forma.',
          'Evite texto pequeno perto das bordas; a grade do perfil corta os posts em 3:4.',
          'Para um carrossel, crie várias colagens com o mesmo modelo e fundo.',
        ],
        faq: [
          { q: 'Qual o tamanho ideal de uma colagem para Instagram?', a: 'O formato 4:5 com 1080 × 1350 pixels é o que ocupa mais espaço no feed.' },
          { q: 'Posso publicar direto do celular?', a: 'Sim. Ao baixar, toque em Compartilhar e escolha o Instagram na lista de apps.' },
        ],
      },
    },
  },
  {
    key: 'stories',
    layouts: ['trio-rows', 'four-strip', 'duo-rows', 'grid-8-tall', 'grid-6-tall'],
    ratio: '9:16',
    slugs: { es: 'collage-para-historias', en: 'story-collage', pt: 'colagem-para-stories' },
    content: {
      es: {
        label: 'Collage para historias',
        metaTitle: 'Collage para historias de Instagram, TikTok y WhatsApp',
        description: 'Plantillas verticales 9:16 para historias de Instagram, Facebook, WhatsApp y TikTok. Gratis y en alta calidad.',
        h1: 'Collage para historias',
        intro: [
          'Las historias de Instagram, Facebook y WhatsApp, y los videos de TikTok, usan pantalla completa vertical en formato 9:16.',
          'Con estas plantillas tu collage llena toda la pantalla, sin franjas negras ni recortes automáticos.',
        ],
        tips: [
          'Deja libres los 250 px de arriba y de abajo: ahí aparecen el nombre de usuario y la caja de respuesta.',
          'Las tiras de 3 o 4 fotos se leen de arriba abajo, como una secuencia.',
          'Añade un texto grande con contorno para que se lea sobre cualquier foto.',
        ],
        faq: [
          { q: '¿Qué tamaño tiene una historia de Instagram?', a: '1080 × 1920 píxeles, formato 9:16. Es el tamaño de descarga Redes sociales en estas plantillas.' },
          { q: '¿Sirve para estados de WhatsApp?', a: 'Sí. Los estados de WhatsApp usan el mismo formato vertical 9:16.' },
        ],
      },
      en: {
        label: 'Story collage',
        metaTitle: 'Collage for Instagram, TikTok and WhatsApp stories',
        description: 'Vertical 9:16 templates for Instagram, Facebook and WhatsApp stories and TikTok. Free and high quality.',
        h1: 'Collages for stories',
        intro: [
          'Instagram, Facebook and WhatsApp stories, and TikTok videos, use the full vertical screen in 9:16.',
          'With these templates your collage fills the whole screen, with no black bars or automatic crops.',
        ],
        tips: [
          'Keep the top and bottom 250 px clear: that is where the username and reply box appear.',
          'Strips of 3 or 4 photos read top to bottom, like a sequence.',
          'Add large outlined text so it reads over any photo.',
        ],
        faq: [
          { q: 'What size is an Instagram story?', a: '1080 × 1920 pixels, 9:16 format. That is the Social media download size for these templates.' },
          { q: 'Does it work for WhatsApp status?', a: 'Yes. WhatsApp status uses the same vertical 9:16 format.' },
        ],
      },
      pt: {
        label: 'Colagem para stories',
        metaTitle: 'Colagem para stories do Instagram, TikTok e WhatsApp',
        description: 'Modelos verticais 9:16 para stories do Instagram, Facebook, status do WhatsApp e TikTok. Grátis e em alta qualidade.',
        h1: 'Colagem para stories',
        intro: [
          'Os stories do Instagram e Facebook, o status do WhatsApp e os vídeos do TikTok usam a tela vertical inteira em 9:16.',
          'Com estes modelos sua colagem preenche toda a tela, sem faixas pretas nem cortes automáticos.',
        ],
        tips: [
          'Deixe livres os 250 px de cima e de baixo: ali aparecem o nome de usuário e a caixa de resposta.',
          'Tiras de 3 ou 4 fotos são lidas de cima para baixo, como uma sequência.',
          'Adicione um texto grande com contorno para ser lido sobre qualquer foto.',
        ],
        faq: [
          { q: 'Qual o tamanho de um story do Instagram?', a: '1080 × 1920 pixels, formato 9:16. É o tamanho Redes sociais nestes modelos.' },
          { q: 'Serve para o status do WhatsApp?', a: 'Sim. O status do WhatsApp usa o mesmo formato vertical 9:16.' },
        ],
      },
    },
  },
  {
    key: 'birthday',
    layouts: ['six-feature', 'four-left-big', 'nine-feature', 'trio-top-big', 'grid-9'],
    ratio: '1:1',
    slugs: { es: 'collage-de-cumpleanos', en: 'birthday-collage', pt: 'colagem-de-aniversario' },
    content: {
      es: {
        label: 'Collage de cumpleaños',
        metaTitle: 'Collage de cumpleaños gratis con fotos y texto',
        description: 'Haz un collage de cumpleaños con tus fotos, un mensaje y emojis. Gratis, sin registro y listo para compartir o imprimir.',
        h1: 'Collage de cumpleaños',
        intro: [
          'Un collage es un regalo rápido y personal: junta fotos de varios años, añade un mensaje y compártelo en el chat familiar o imprímelo.',
          'Usa una plantilla con foto principal para la persona que cumple años y llena el resto con recuerdos compartidos.',
        ],
        tips: [
          'Añade un título con la tipografía Pacifico o Caveat y una etiqueta de color con la fecha.',
          'Los emojis 🎂 🎉 🎈 funcionan como stickers: añádelos desde la pestaña Texto.',
          'Un fondo con degradado de colores vivos le da un toque de fiesta.',
        ],
        faq: [
          { q: '¿Puedo escribir un mensaje en el collage?', a: 'Sí. En la pestaña Texto añade títulos, etiquetas y emojis, y arrástralos donde quieras.' },
          { q: '¿Puedo imprimirlo como regalo?', a: 'Sí. Elige el formato A4 o 2:3 y descarga en tamaño Máxima para imprimir con buena calidad.' },
        ],
      },
      en: {
        label: 'Birthday collage',
        metaTitle: 'Free birthday collage with photos and text',
        description: 'Make a birthday collage with your photos, a message and emoji. Free, no sign-up, ready to share or print.',
        h1: 'Birthday collage',
        intro: [
          'A collage is a quick, personal gift: gather photos from several years, add a message and share it in the family chat or print it.',
          'Use a template with a featured photo for the birthday person and fill the rest with shared memories.',
        ],
        tips: [
          'Add a title in Pacifico or Caveat and a colored label with the date.',
          'Emoji like 🎂 🎉 🎈 work as stickers: add them from the Text tab.',
          'A bright gradient background adds a party feel.',
        ],
        faq: [
          { q: 'Can I write a message on the collage?', a: 'Yes. In the Text tab add titles, labels and emoji, and drag them wherever you want.' },
          { q: 'Can I print it as a gift?', a: 'Yes. Choose A4 or 2:3 and download at Maximum size to print in good quality.' },
        ],
      },
      pt: {
        label: 'Colagem de aniversário',
        metaTitle: 'Colagem de aniversário grátis com fotos e texto',
        description: 'Faça uma colagem de aniversário com suas fotos, uma mensagem e emojis. Grátis, sem cadastro e pronta para compartilhar ou imprimir.',
        h1: 'Colagem de aniversário',
        intro: [
          'Uma colagem é um presente rápido e pessoal: junte fotos de vários anos, adicione uma mensagem e compartilhe no grupo da família ou imprima.',
          'Use um modelo com foto principal para o aniversariante e preencha o resto com lembranças compartilhadas.',
        ],
        tips: [
          'Adicione um título com a fonte Pacifico ou Caveat e uma etiqueta colorida com a data.',
          'Emojis como 🎂 🎉 🎈 funcionam como adesivos: adicione-os na aba Texto.',
          'Um fundo com degradê de cores vivas dá um clima de festa.',
        ],
        faq: [
          { q: 'Posso escrever uma mensagem na colagem?', a: 'Sim. Na aba Texto adicione títulos, etiquetas e emojis, e arraste-os para onde quiser.' },
          { q: 'Posso imprimir como presente?', a: 'Sim. Escolha o formato A4 ou 2:3 e baixe no tamanho Máxima para imprimir com boa qualidade.' },
        ],
      },
    },
  },
  {
    key: 'before-after',
    layouts: ['duo-cols', 'duo-rows'],
    ratio: '4:5',
    slugs: { es: 'foto-antes-y-despues', en: 'before-and-after-photo', pt: 'foto-antes-e-depois' },
    content: {
      es: {
        label: 'Antes y después',
        metaTitle: 'Foto de antes y después gratis: compara dos fotos',
        description: 'Crea una imagen de antes y después con dos fotos y etiquetas. Ideal para remodelaciones, entrenamientos, peinados y proyectos.',
        h1: 'Foto de antes y después',
        intro: [
          'Una imagen de antes y después muestra un cambio de un vistazo: una habitación remodelada, el progreso en el gimnasio, un corte de pelo o un proyecto terminado.',
          'Pon las dos fotos lado a lado o una encima de otra y añade las etiquetas «Antes» y «Después» desde la pestaña Texto.',
        ],
        tips: [
          'Haz las dos fotos desde el mismo ángulo y con luz parecida: la comparación será más clara.',
          'Usa el mismo zoom en ambas celdas para que los objetos tengan el mismo tamaño.',
          'Una etiqueta con fondo de color se lee bien sobre cualquier foto.',
        ],
        faq: [
          { q: '¿Cómo añado las palabras «antes» y «después»?', a: 'En la pestaña Texto, elige el estilo Etiqueta, escribe la palabra y arrástrala sobre cada foto.' },
          { q: '¿Qué formato es mejor?', a: 'Lado a lado para fotos verticales; una encima de otra, en 4:5, para fotos horizontales.' },
        ],
      },
      en: {
        label: 'Before and after',
        metaTitle: 'Free before and after photo maker',
        description: 'Make a before and after image with two photos and labels. Ideal for renovations, workouts, haircuts and projects.',
        h1: 'Before and after photo',
        intro: [
          'A before and after image shows a change at a glance: a renovated room, gym progress, a haircut or a finished project.',
          'Put the two photos side by side or one above the other and add “Before” and “After” labels from the Text tab.',
        ],
        tips: [
          'Take both photos from the same angle and in similar light for a clearer comparison.',
          'Use the same zoom in both cells so objects appear the same size.',
          'A label with a colored background reads well over any photo.',
        ],
        faq: [
          { q: 'How do I add the words “before” and “after”?', a: 'In the Text tab, choose the Label style, type the word and drag it over each photo.' },
          { q: 'Which format is best?', a: 'Side by side for portrait photos; stacked, in 4:5, for landscape photos.' },
        ],
      },
      pt: {
        label: 'Antes e depois',
        metaTitle: 'Foto de antes e depois grátis: compare duas fotos',
        description: 'Crie uma imagem de antes e depois com duas fotos e etiquetas. Ideal para reformas, treinos, cortes de cabelo e projetos.',
        h1: 'Foto de antes e depois',
        intro: [
          'Uma imagem de antes e depois mostra uma mudança num piscar de olhos: um cômodo reformado, a evolução na academia, um corte de cabelo ou um projeto pronto.',
          'Coloque as duas fotos lado a lado ou uma em cima da outra e adicione as etiquetas “Antes” e “Depois” na aba Texto.',
        ],
        tips: [
          'Tire as duas fotos do mesmo ângulo e com luz parecida para uma comparação mais clara.',
          'Use o mesmo zoom nas duas células para que os objetos tenham o mesmo tamanho.',
          'Uma etiqueta com fundo colorido é fácil de ler sobre qualquer foto.',
        ],
        faq: [
          { q: 'Como adiciono as palavras “antes” e “depois”?', a: 'Na aba Texto, escolha o estilo Etiqueta, digite a palavra e arraste-a sobre cada foto.' },
          { q: 'Qual formato é melhor?', a: 'Lado a lado para fotos verticais; uma em cima da outra, em 4:5, para fotos horizontais.' },
        ],
      },
    },
  },
]

export function findLanding(locale: string, slug: string): Landing | undefined {
  const code = locale as LocaleCode
  return LANDINGS.find(l => l.slugs[code] === slug)
}
