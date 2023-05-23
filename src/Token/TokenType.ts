export default class TokenType {
  // тип токена
  name: string; // название типа
  regex: string; // регулярное выражение

  constructor(name: string, regex: string) {
    //конструктор
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  NUMBER: new TokenType("NUMBER", "[0-9]*"),
  TYPE: new TokenType(
    "TYPE",
    "(ТИП_ПОЧТА|ТИП_ТЕКСТ|ТИП_ЧЕКБОКС_КНОПКА|ТИП_РАДИО_КНОПКА|ТИП_ПАРОЛЬ)"
  ),
  LIGHT: new TokenType("LIGHT", "СВЕТЛАЯ_ТЕМА"),
  DARK: new TokenType("DARK", "ТЕМНАЯ_ТЕМА"),
  COLOR: new TokenType("COLOR", "ЦВЕТНАЯ_ТЕМА"),
  VARIABLE: new TokenType("VARIABLE", "[а-я]*"),
  SEMICOLON: new TokenType("SEMICOLON", "\\n"),
  SPACE: new TokenType("SPACE", "[ \\t\\r]"),
  ASSIGN: new TokenType("ASSIGN", "\\="),
  INPUT: new TokenType("INPUT", "ПОЛЕ_ВВОДА"),
  HEADER: new TokenType("HEADER", "ЗАГОЛОВОК"),
  QUOTES: new TokenType("QUOTES", `[\\"\\']`),
  BRACKETS_LEFT: new TokenType("BRACKETS_LEFT", `\\(`),
  BRACKETS_RIGHT: new TokenType("BRACKETS_RIGHT", `\\)`),
  COMMA: new TokenType("COMMA", `\\,`),
  DESCRIPTION: new TokenType("DESCRIPTION", "ОПИСАНИЕ"),
  SUBMIT: new TokenType("SUBMIT", "ОТПРАВИТЬ"),
  START: new TokenType("START", "НАЧАЛО_ФОРМЫ"),
  FINISH: new TokenType("FINISH", "КОНЕЦ_ФОРМЫ"),
};
