import type { LocaleCode } from './landings'

export interface LegalSection {
  h: string
  p: string[]
  list?: string[]
}

export interface LegalPage {
  title: string
  description: string
  updated?: string
  intro: string
  sections: LegalSection[]
}

export type LegalKey = 'privacy' | 'terms' | 'about' | 'contact'

const UPDATED = '2026-10-14'

export const LEGAL: Record<LegalKey, Record<LocaleCode, LegalPage>> = {
  privacy: {
    es: {
      title: 'Política de privacidad',
      description: 'Cómo trata Simple Collage tus datos: tus fotos nunca salen de tu dispositivo.',
      updated: UPDATED,
      intro: 'Simple Collage está diseñado para funcionar sin conocer quién eres. Esta página explica qué datos se procesan, dónde y con qué fin.',
      sections: [
        {
          h: 'Tus fotos',
          p: [
            'Las fotos que añades al editor se procesan exclusivamente en tu navegador. No se suben a ningún servidor de Simple Collage ni de terceros, y nadie más puede verlas.',
            'Para que puedas seguir tu collage más tarde, el editor guarda una copia del proyecto (fotos incluidas) en el almacenamiento local de tu navegador (IndexedDB). Esa copia permanece en tu dispositivo hasta que pulsas «Nuevo» en el editor o borras los datos del sitio en tu navegador.',
          ],
        },
        {
          h: 'Datos que no recogemos',
          p: ['No hay registro de usuarios ni formularios. No pedimos nombre, correo electrónico ni ningún otro dato personal para usar el editor.'],
        },
        {
          h: 'Estadísticas y publicidad',
          p: [
            'Para mantener el servicio gratuito, este sitio puede mostrar anuncios servidos por Google AdSense y medir visitas de forma agregada. Estos servicios pueden usar cookies o identificadores similares para mostrar anuncios, limitar su frecuencia y medir su rendimiento.',
            'Cuando la ley lo exija (por ejemplo, en el Espacio Económico Europeo, el Reino Unido o Suiza), te pediremos tu consentimiento antes de usar cookies no esenciales, y podrás cambiar tu elección en cualquier momento.',
            'Puedes saber más sobre cómo usa Google los datos en policies.google.com/technologies/partner-sites y desactivar la publicidad personalizada en adssettings.google.com.',
          ],
        },
        {
          h: 'Tus derechos',
          p: ['Como no almacenamos datos personales en nuestros servidores, no hay datos tuyos que consultar, corregir o eliminar de nuestra parte. Puedes borrar en cualquier momento los datos guardados en tu navegador desde su configuración.'],
        },
        {
          h: 'Cambios',
          p: ['Si esta política cambia, actualizaremos esta página y la fecha de la última actualización.'],
        },
      ],
    },
    en: {
      title: 'Privacy policy',
      description: 'How Simple Collage handles your data: your photos never leave your device.',
      updated: UPDATED,
      intro: 'Simple Collage is designed to work without knowing who you are. This page explains what data is processed, where, and why.',
      sections: [
        {
          h: 'Your photos',
          p: [
            'Photos you add to the editor are processed only in your browser. They are never uploaded to Simple Collage servers or any third party, and nobody else can see them.',
            'So you can continue your collage later, the editor saves a copy of the project (photos included) in your browser’s local storage (IndexedDB). That copy stays on your device until you press “New” in the editor or clear the site data in your browser.',
          ],
        },
        {
          h: 'Data we don’t collect',
          p: ['There are no user accounts or forms. We don’t ask for your name, email or any other personal data to use the editor.'],
        },
        {
          h: 'Analytics and advertising',
          p: [
            'To keep the service free, this site may show ads served by Google AdSense and measure visits in aggregate. These services may use cookies or similar identifiers to show ads, limit how often you see them and measure their performance.',
            'Where required by law (for example, in the European Economic Area, the United Kingdom or Switzerland), we will ask for your consent before using non-essential cookies, and you can change your choice at any time.',
            'Learn more about how Google uses data at policies.google.com/technologies/partner-sites and turn off personalized ads at adssettings.google.com.',
          ],
        },
        {
          h: 'Your rights',
          p: ['Because we don’t store personal data on our servers, there is no data of yours for us to access, correct or delete. You can clear the data saved in your browser at any time from its settings.'],
        },
        {
          h: 'Changes',
          p: ['If this policy changes, we will update this page and the last-updated date.'],
        },
      ],
    },
    pt: {
      title: 'Política de privacidade',
      description: 'Como o Simple Collage trata seus dados: suas fotos nunca saem do seu dispositivo.',
      updated: UPDATED,
      intro: 'O Simple Collage foi feito para funcionar sem saber quem você é. Esta página explica quais dados são processados, onde e por quê.',
      sections: [
        {
          h: 'Suas fotos',
          p: [
            'As fotos que você adiciona ao editor são processadas apenas no seu navegador. Elas nunca são enviadas aos servidores do Simple Collage nem a terceiros, e ninguém mais pode vê-las.',
            'Para você continuar a colagem depois, o editor salva uma cópia do projeto (com as fotos) no armazenamento local do seu navegador (IndexedDB). Essa cópia fica no seu dispositivo até você tocar em “Nova” no editor ou limpar os dados do site no navegador.',
          ],
        },
        {
          h: 'Dados que não coletamos',
          p: ['Não há cadastro de usuários nem formulários. Não pedimos nome, e-mail ou qualquer outro dado pessoal para usar o editor.'],
        },
        {
          h: 'Estatísticas e publicidade',
          p: [
            'Para manter o serviço gratuito, este site pode exibir anúncios do Google AdSense e medir visitas de forma agregada. Esses serviços podem usar cookies ou identificadores semelhantes para exibir anúncios, limitar sua frequência e medir seu desempenho.',
            'Quando exigido por lei (por exemplo, na LGPD, no Espaço Econômico Europeu ou no Reino Unido), pediremos seu consentimento antes de usar cookies não essenciais, e você poderá mudar sua escolha a qualquer momento.',
            'Saiba mais sobre como o Google usa dados em policies.google.com/technologies/partner-sites e desative anúncios personalizados em adssettings.google.com.',
          ],
        },
        {
          h: 'Seus direitos',
          p: ['Como não armazenamos dados pessoais em nossos servidores, não há dados seus para acessarmos, corrigirmos ou excluirmos. Você pode apagar os dados salvos no navegador a qualquer momento nas configurações dele.'],
        },
        {
          h: 'Alterações',
          p: ['Se esta política mudar, atualizaremos esta página e a data da última atualização.'],
        },
      ],
    },
  },
  terms: {
    es: {
      title: 'Términos de uso',
      description: 'Condiciones para usar Simple Collage.',
      updated: UPDATED,
      intro: 'Al usar Simple Collage aceptas estas condiciones. Son breves porque el servicio es sencillo.',
      sections: [
        { h: 'El servicio', p: ['Simple Collage es una herramienta gratuita para crear collages de fotos en tu navegador. Puede cambiar, mejorar o dejar de estar disponible sin previo aviso.'] },
        { h: 'Tu contenido', p: ['Las fotos y los collages que creas son tuyos. Eres responsable de tener los derechos necesarios sobre las imágenes que usas y de no crear contenido ilegal o que vulnere derechos de terceros.'] },
        { h: 'Uso de los collages', p: ['Puedes usar los collages que crees para cualquier fin, personal o comercial, sin atribución y sin marca de agua.'] },
        { h: 'Sin garantías', p: ['El servicio se ofrece «tal cual». Como los proyectos se guardan solo en tu navegador, te recomendamos descargar tu collage cuando lo termines: si borras los datos del navegador, el proyecto guardado se pierde.'] },
        { h: 'Publicidad', p: ['El sitio puede mostrar anuncios de terceros para financiarse. No nos hacemos responsables del contenido de sitios externos enlazados desde los anuncios.'] },
      ],
    },
    en: {
      title: 'Terms of use',
      description: 'Conditions for using Simple Collage.',
      updated: UPDATED,
      intro: 'By using Simple Collage you agree to these terms. They are short because the service is simple.',
      sections: [
        { h: 'The service', p: ['Simple Collage is a free tool for making photo collages in your browser. It may change, improve or become unavailable without notice.'] },
        { h: 'Your content', p: ['The photos and collages you create are yours. You are responsible for having the rights to the images you use and for not creating illegal content or content that infringes the rights of others.'] },
        { h: 'Using your collages', p: ['You may use the collages you create for any purpose, personal or commercial, with no attribution and no watermark.'] },
        { h: 'No warranty', p: ['The service is provided “as is”. Because projects are saved only in your browser, we recommend downloading your collage when you finish: if you clear your browser data, the saved project is lost.'] },
        { h: 'Advertising', p: ['The site may show third-party ads to fund itself. We are not responsible for the content of external sites linked from ads.'] },
      ],
    },
    pt: {
      title: 'Termos de uso',
      description: 'Condições para usar o Simple Collage.',
      updated: UPDATED,
      intro: 'Ao usar o Simple Collage você aceita estas condições. Elas são curtas porque o serviço é simples.',
      sections: [
        { h: 'O serviço', p: ['O Simple Collage é uma ferramenta gratuita para criar colagens de fotos no navegador. Ele pode mudar, melhorar ou ficar indisponível sem aviso prévio.'] },
        { h: 'Seu conteúdo', p: ['As fotos e colagens que você cria são suas. Você é responsável por ter os direitos sobre as imagens que usa e por não criar conteúdo ilegal ou que viole direitos de terceiros.'] },
        { h: 'Uso das colagens', p: ['Você pode usar as colagens que criar para qualquer fim, pessoal ou comercial, sem atribuição e sem marca d’água.'] },
        { h: 'Sem garantias', p: ['O serviço é oferecido “como está”. Como os projetos ficam salvos só no seu navegador, recomendamos baixar a colagem ao terminar: se você limpar os dados do navegador, o projeto salvo será perdido.'] },
        { h: 'Publicidade', p: ['O site pode exibir anúncios de terceiros para se manter. Não nos responsabilizamos pelo conteúdo de sites externos acessados pelos anúncios.'] },
      ],
    },
  },
  about: {
    es: {
      title: 'Acerca de Simple Collage',
      description: 'Quién hace Simple Collage y por qué.',
      intro: 'Simple Collage nació como un proyecto personal para juntar fotos en un collage sin instalar nada. Hoy es un editor completo que sigue la misma idea: rápido, gratis y sin pedirte nada a cambio de tus fotos.',
      sections: [
        { h: 'Cómo funciona', p: ['Todo el trabajo ocurre en tu navegador: el editor dibuja el collage en tu dispositivo y genera la imagen final ahí mismo. Por eso no necesitas cuenta y tus fotos nunca viajan por internet.'] },
        { h: 'Quién lo hace', p: ['Simple Collage es un proyecto independiente creado por Erick Huamani, desarrollador web.'] },
        { h: 'Cómo se financia', p: ['El sitio es gratuito y puede mostrar anuncios para cubrir sus costos. Los anuncios nunca aparecen dentro del área de edición.'] },
      ],
    },
    en: {
      title: 'About Simple Collage',
      description: 'Who makes Simple Collage and why.',
      intro: 'Simple Collage started as a personal project to put photos together in a collage without installing anything. Today it is a full editor built on the same idea: fast, free and asking nothing in exchange for your photos.',
      sections: [
        { h: 'How it works', p: ['All the work happens in your browser: the editor draws the collage on your device and creates the final image right there. That is why you don’t need an account and your photos never travel over the internet.'] },
        { h: 'Who makes it', p: ['Simple Collage is an independent project created by Erick Huamani, a web developer.'] },
        { h: 'How it is funded', p: ['The site is free and may show ads to cover its costs. Ads never appear inside the editing area.'] },
      ],
    },
    pt: {
      title: 'Sobre o Simple Collage',
      description: 'Quem faz o Simple Collage e por quê.',
      intro: 'O Simple Collage nasceu como um projeto pessoal para juntar fotos em uma colagem sem instalar nada. Hoje é um editor completo com a mesma ideia: rápido, grátis e sem pedir nada em troca das suas fotos.',
      sections: [
        { h: 'Como funciona', p: ['Todo o trabalho acontece no seu navegador: o editor desenha a colagem no seu dispositivo e gera a imagem final ali mesmo. Por isso você não precisa de conta e suas fotos nunca trafegam pela internet.'] },
        { h: 'Quem faz', p: ['O Simple Collage é um projeto independente criado por Erick Huamani, desenvolvedor web.'] },
        { h: 'Como se mantém', p: ['O site é gratuito e pode exibir anúncios para cobrir seus custos. Os anúncios nunca aparecem dentro da área de edição.'] },
      ],
    },
  },
  contact: {
    es: {
      title: 'Contacto',
      description: 'Cómo comunicarte con Simple Collage.',
      intro: '¿Encontraste un error, tienes una idea para una plantilla o quieres hacer una consulta? Escríbenos.',
      sections: [
        { h: 'Sugerencias y errores', p: ['Puedes abrir un reporte en el repositorio público del proyecto en GitHub. Incluye el navegador y el dispositivo que usas si se trata de un error.'] },
      ],
    },
    en: {
      title: 'Contact',
      description: 'How to get in touch with Simple Collage.',
      intro: 'Found a bug, have an idea for a template or want to ask something? Get in touch.',
      sections: [
        { h: 'Suggestions and bugs', p: ['You can open an issue in the project’s public GitHub repository. Please include your browser and device if you are reporting a bug.'] },
      ],
    },
    pt: {
      title: 'Contato',
      description: 'Como falar com o Simple Collage.',
      intro: 'Encontrou um erro, tem uma ideia de modelo ou quer perguntar algo? Fale com a gente.',
      sections: [
        { h: 'Sugestões e erros', p: ['Você pode abrir um relato no repositório público do projeto no GitHub. Inclua o navegador e o dispositivo que você usa se for um erro.'] },
      ],
    },
  },
}

export const REPO_URL = 'https://github.com/ehldev/Simple-collage'
