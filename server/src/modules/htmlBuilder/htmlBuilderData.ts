export const HTML_BUILDER_ID = "html-builder";
export const HTML_BUILDER_NAME = "HTML Builder";

export interface HtmlBuilderLevel {
  id: number;
  title: string;
  description: string;
  requiredTags: string[];
  targetHtml: string;
  rules: string[];
}

export const HTML_BUILDER_LEVELS: HtmlBuilderLevel[] = [
  {
    id: 1,
    title: "Кольорові контейнери",
    description: "Створи червоний і синій контейнери",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="red">Червоний блок</div><div class="blue">Синій блок</div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути всередині <html> і перед <body>",
      "<body> має бути всередині <html> і після <head>",
      "Перший <div> з класом 'red' має бути всередині <body>",
      "Другий <div> з класом 'blue' має бути всередині <body>"
    ]
  },
  {
    id: 2,
    title: "Вкладені контейнери",
    description: "Створи синій контейнер всередині червоного",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="red">Червоний блок<div class="blue">Синій блок</div></div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути перед <body>",
      "Зовнішній <div> з класом 'red' має бути всередині <body>",
      "Внутрішній <div> з класом 'blue' має бути всередині червоного блоку"
    ]
  },
  {
    id: 3,
    title: "Три кольорові блоки",
    description: "Додай червоний, синій і зелений блоки у body",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="red">Червоний блок</div><div class="blue">Синій блок</div><div class="green">Зелений блок</div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути перед <body>",
      "Усередині <body> мають бути три блоки <div>",
      "Порядок у <body>: red, потім blue, потім green"
    ]
  },
  {
    id: 4,
    title: "Подвійна вкладеність",
    description: "Вклади синій блок у червоний, а зелений — у синій",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="red">Червоний блок<div class="blue">Синій блок<div class="green">Зелений блок</div></div></div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути перед <body>",
      "Червоний блок має бути всередині <body>",
      "Синій блок має бути всередині червоного",
      "Зелений блок має бути всередині синього"
    ]
  },
  {
    id: 5,
    title: "Два внутрішні блоки",
    description: "Всередині червоного блоку розмісти синій і зелений",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="red">Червоний блок<div class="blue">Синій блок</div><div class="green">Зелений блок</div></div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути перед <body>",
      "Червоний блок має бути всередині <body>",
      "Синій і зелений блоки мають бути всередині червоного",
      "Порядок усередині червоного блоку: blue, потім green"
    ]
  },
  {
    id: 6,
    title: "Зелений зовні",
    description: "Зроби зелений блок зовнішнім контейнером",
    requiredTags: ["html", "head", "body", "div"],
    targetHtml: '<html><head></head><body><div class="green">Зелений блок<div class="red">Червоний блок</div><div class="blue">Синій блок</div></div></body></html>',
    rules: [
      "<html> має бути кореневим елементом",
      "<head> має бути перед <body>",
      "Зелений блок має бути всередині <body>",
      "Червоний і синій блоки мають бути всередині зеленого",
      "Порядок усередині зеленого блоку: red, потім blue"
    ]
  }
];
