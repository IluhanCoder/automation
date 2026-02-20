export const HTML_BUILDER_ID = "html-builder";
export const HTML_BUILDER_NAME = "HTML Builder";
export const HTML_BUILDER_LEVELS = [
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
    },
    {
        id: 7,
        title: "Заголовок та абзац",
        description: "Додай заголовок h1 і абзац p у body",
        requiredTags: ["html", "head", "body", "title", "h1", "p"],
        targetHtml: '<html><head><title>мій сайт</title></head><body><h1>всесвітня історія</h1><p>просто абзац з текстом</p></body></html>',
        rules: [
            "<html> має бути кореневим елементом",
            "<head> має містити <title>",
            "<body> має містити <h1> і <p>",
            "Порядок у <body>: h1, потім p"
        ]
    },
    {
        id: 8,
        title: "Абзац і заголовок",
        description: "Змінюй порядок: спочатку абзац, потім заголовок",
        requiredTags: ["html", "head", "body", "title", "h1", "p"],
        targetHtml: '<html><head><title>мій сайт</title></head><body><p>просто абзац з текстом</p><h1>всесвітня історія</h1></body></html>',
        rules: [
            "<html> має бути кореневим елементом",
            "<head> має містити <title>",
            "<body> має містити <p> і <h1>",
            "Порядок у <body>: p, потім h1"
        ]
    },
    {
        id: 9,
        title: "Заголовок у червоному блоці",
        description: "Помісти h1 всередину червоного контейнера",
        requiredTags: ["html", "head", "body", "title", "div", "h1"],
        targetHtml: '<html><head><title>мій сайт</title></head><body><div class="red">Червоний блок<h1>всесвітня історія</h1></div></body></html>',
        rules: [
            "<html> має бути кореневим елементом",
            "<head> має містити <title>",
            "<body> має містити червоний <div>",
            "<h1> має бути всередині червоного блоку"
        ]
    },
    {
        id: 10,
        title: "Абзац у синьому блоці",
        description: "Розмісти p всередині синього контейнера",
        requiredTags: ["html", "head", "body", "title", "div", "p"],
        targetHtml: '<html><head><title>мій сайт</title></head><body><div class="blue">Синій блок<p>просто абзац з текстом</p></div></body></html>',
        rules: [
            "<html> має бути кореневим елементом",
            "<head> має містити <title>",
            "<body> має містити синій <div>",
            "<p> має бути всередині синього блоку"
        ]
    },
    {
        id: 11,
        title: "Текстова структура",
        description: "Створи зелений блок із h1 і p всередині",
        requiredTags: ["html", "head", "body", "title", "div", "h1", "p"],
        targetHtml: '<html><head><title>мій сайт</title></head><body><div class="green">Зелений блок<h1>всесвітня історія</h1><p>просто абзац з текстом</p></div></body></html>',
        rules: [
            "<html> має бути кореневим елементом",
            "<head> має містити <title>",
            "<body> має містити зелений <div>",
            "Всередині зеленого блоку: h1, потім p"
        ]
    }
];
