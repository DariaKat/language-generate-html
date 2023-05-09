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
    "(ПОЧТА|ТЕКСТ|ЧЕКБОКС_КНОПКА|РАДИО_КНОПКА|ПАРОЛЬ)"
  ),
  VARIABLE: new TokenType("VARIABLE", "[а-я]*"),
  SEMICOLON: new TokenType("SEMICOLON", "\\n"),
  SPACE: new TokenType("SPACE", "[ \\t\\r]"),
  ASSIGN: new TokenType("ASSIGN", "\\="),
  INPUT: new TokenType("INPUT", "ПОЛЕ_ВВОДА"),
  HEADER: new TokenType("HEADER", "ЗАГОЛОВОК"),
  QUOTES: new TokenType("QUOTES", `[\\"\\']`),
  SUBMIT: new TokenType("SUBMIT", "ОТПРАВИТЬ"),
  START: new TokenType("START", "НАЧАЛО_ФОРМЫ"),
  FINISH: new TokenType("FINISH", "КОНЕЦ_ФОРМЫ"),
};
