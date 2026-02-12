export const HTML_QUIZ_ID = "html-basics";
export const HTML_QUIZ_NAME = "Базові знання HTML";
export const HTML_QUIZ_QUESTIONS = [
    {
        levelId: "level-1",
        question: "Що означає HTML?",
        options: [
            "Hyperlinks and Text Markup Language",
            "HyperText Markup Language",
            "Home Tool Markup Language",
            "Hyper Transfer Markup Language",
        ],
        correctIndex: 1,
    },
    {
        levelId: "level-2",
        question: "Який тег створює посилання?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctIndex: 1,
    },
    {
        levelId: "level-3",
        question: "Який атрибут вказує адресу посилання?",
        options: ["src", "href", "alt", "title"],
        correctIndex: 1,
    },
    {
        levelId: "level-4",
        question: "Який тег використовується для нумерованого списку?",
        options: ["<ul>", "<ol>", "<li>", "<dl>"],
        correctIndex: 1,
    },
    {
        levelId: "level-5",
        question: "Який тег робить текст найважливішим заголовком?",
        options: ["<h1>", "<head>", "<header>", "<h6>"],
        correctIndex: 0,
    },
];
export const getHtmlQuestion = (levelId) => HTML_QUIZ_QUESTIONS.find((question) => question.levelId === levelId);
