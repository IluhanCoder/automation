export const HTML_QUIZ_ID = "html-basics";
export const HTML_QUIZ_NAME = "Базові знання HTML";
export const HTML_QUIZ_QUESTIONS = [
    {
        levelId: "level-1",
        question: "Який тег це найбільший заголовок?",
        options: ["<h3>", "<h1>", "<h6>", "<header>"],
        correctIndex: 1,
    },
    {
        levelId: "level-2",
        question: "Як правильно написати тег H2?",
        options: ["{h2}Текст{/h2}", "<h2>Текст</h2>", "[h2]Текст[/h2]", "<H2>Текст</h2>"],
        correctIndex: 1,
    },
    {
        levelId: "level-3",
        question: "Який тег робить просто звичайний текст на сторінці?",
        options: ["<text>", "<body>", "<p>", "<div>"],
        correctIndex: 2,
    },
    {
        levelId: "level-4",
        question: "Як правильно вставити посилання на сайт?",
        options: [
            "<link>https://google.com</link>",
            "<a href='https://google.com'>Посилання</a>",
            "<url>https://google.com</url>",
            "<a src='https://google.com'>Посилання</a>",
        ],
        correctIndex: 1,
    },
    {
        levelId: "level-5",
        question: "Який тег використовується для вставлення картинки?",
        options: ["<picture>", "<img>", "<image>", "<photo>"],
        correctIndex: 1,
    },
    {
        levelId: "level-6",
        question: "Яке правильне написання тегу для картинки?",
        options: [
            "<img src='picture.jpg' href='picture.jpg'>",
            "<image>picture.jpg</image>",
            "<img src='picture.jpg'>",
            "<img href='picture.jpg'>",
        ],
        correctIndex: 2,
    },
    {
        levelId: "level-7",
        question: "Де розташовується тег <title>?",
        options: ["У тілі сторінки <body>", "У головній частині <head>", "На початку HTML файлу", "Де завгодно на сторінці"],
        correctIndex: 1,
    },
    {
        levelId: "level-8",
        question: "Який тег це контейнер для групування вмісту?",
        options: ["<section>", "<div>", "<container>", "<block>"],
        correctIndex: 1,
    },
    {
        levelId: "level-9",
        question: "Де розташовується тег <body>?",
        options: ["Всередині <head>", "Всередині <html>, після <head>", "На початку HTML файлу", "На кінці HTML файлу"],
        correctIndex: 1,
    },
    {
        levelId: "level-10",
        question: "Як правильно написати H3 заголовок?",
        options: [
            "<H3>Заголовок</h3>",
            "<h3>Заголовок</h3>",
            "<h3>Заголовок<h3>",
            "[h3]Заголовок[/h3]",
        ],
        correctIndex: 1,
    },
    {
        levelId: "level-11",
        question: "Де знаходяться CSS стилі звичайно?",
        options: ["У тегу <title>", "У тегу <style>", "У тегу <head>", "Варіанти 2 та 3 правильні"],
        correctIndex: 3,
    },
    {
        levelId: "level-12",
        question: "Яке правильне написання посилання з текстом?",
        options: [
            "<a>Google</a href='https://google.com'>",
            "<a href='https://google.com'>Google</a>",
            "<link href='https://google.com'>Google</link>",
            "<a src='https://google.com'>Google</a>",
        ],
        correctIndex: 1,
    },
];
export const getHtmlQuestion = (levelId) => HTML_QUIZ_QUESTIONS.find((question) => question.levelId === levelId);
