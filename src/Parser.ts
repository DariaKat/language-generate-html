import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import HeaderNode from "./AST/HeaderNode";
import InputNode from "./AST/InputNode";
import StatementsNode from "./AST/StatementsNode";
import SubmitNode from "./AST/SubmitNode";
import TypeInputNode from "./AST/TypeInputNode";
import VariableNode from "./AST/VariableNode";
import Token from "./Token/Token";
import TokenType, { tokenTypesList } from "./Token/TokenType";

export interface IError {
  errorCode?: number;
  errorMessage?: string;
}

export default class Parser {
  tokens: Token[];
  pos: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // возвращать токен из списка
  match(...expected: TokenType[]): Token | null {
    // получаем какой-то тип
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos]; // по текущей позиции достаем токен
      // сравниваем типы, если совпадает
      if (expected.find((type) => type.name === currentToken.type.name)) {
        this.pos += 1; // увеличиваем позицию
        return currentToken; // и возвращаем токен
      }
    }
    return null;
  }

  // для обязательного значения
  require(...expected: TokenType[]): Token | IError {
    const token = this.match(...expected);
    if (!token) {
      // если не находим, то ошибка
      return {
        errorCode: 1,
        errorMessage: `На позиции ${this.pos} обнаружена ошибка`,
      };
    }
    return token;
  }

  // возвращаем тип и двигаемся по позиции
  parseNode(): ExpressionNode {
    const name = this.tokens[this.pos].type.name;
    this.pos += 1;
    return name;
  }

  //парсинг переменных, поля ввода, заголовок, кнопки отправить и типа
  parseVariableAndInput(): ExpressionNode | IError {
    const input = this.match(tokenTypesList.INPUT);
    if (input != null) {
      return new InputNode(input);
    }
    const header = this.match(tokenTypesList.HEADER);
    if (header != null) {
      return new HeaderNode(header);
    }
    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable != null) {
      return new VariableNode(variable);
    }
    const submit = this.match(tokenTypesList.SUBMIT);
    if (submit != null) {
      return new SubmitNode(submit);
    }
    const type = this.match(tokenTypesList.TYPE);
    if (type != null) {
      return new TypeInputNode(type);
    }
    return {
      errorCode: 1,
      errorMessage: `Ожидается заголовок или поле ввода на ${this.pos} позиции`,
    };
  }

  parseParentheses(): ExpressionNode | IError {
    if (this.match(tokenTypesList.QUOTES) != null) {
      // если в начале есть кавычка
      const node = this.parseFormula(); // внутри может находится значение
      const info = this.require(tokenTypesList.QUOTES); // ожидаем что она закрыта

      const error = info as IError;

      return error?.errorMessage ? error : node; // возвращаем узел
    } else {
      return this.parseVariableAndInput(); // для обработки типа или значения, возвращаем
    }
  }

  //правый операнд
  parseFormula(): ExpressionNode | IError {
    let leftNode = this.parseParentheses();
    return leftNode;
  }

  //парсим отдельно взятую строку
  parseExpression(): ExpressionNode | IError {
    // проверка для парсинга
    if (
      //проверка какой первый тип
      this.match(tokenTypesList.INPUT) === null &&
      this.match(tokenTypesList.HEADER) === null &&
      this.match(tokenTypesList.SUBMIT) === null
    ) {
      const node = this.parseNode(); // если это не заголовок, кнопка отправить и поле ввода, то вызываем метод, который вернет строку с типом
      return node; // возвращаем значение
    }
    this.pos -= 1; // если это поле ввода, кнопка отправить или заголовок то возвращаемся на позиуию назад (из-за функции match)
    let variableAndInput = this.parseVariableAndInput(); // вызываем метод для обработки типов
    const assignOperator = this.match(tokenTypesList.ASSIGN); // следующим должен быть оператор присвоения
    if (assignOperator !== null) {
      const rightFormulaNode = this.parseFormula(); // парсим формулу

      const error = rightFormulaNode as IError;

      if (error?.errorMessage) {
        return {
          errorCode: 1,
          errorMessage: error?.errorMessage,
        };
      }

      const binaryNode = new BinOperationNode( // обработка операции
        assignOperator,
        variableAndInput,
        rightFormulaNode
      );
      return binaryNode;
    }
    return {
      // ошибка
      errorCode: 1,
      errorMessage: `На позиции ${this.pos} обнаружена ошибка`,
    };
  }

  parseCode(): ExpressionNode | IError {
    if (
      this.tokens[0].type.name === "START" && // проверка есть ли открытие и закрытие формы, если нет опрокидываем ошибку
      this.tokens[this.tokens.length - 2].type.name === "FINISH"
    ) {
      const root = new StatementsNode();
      while (this.pos < this.tokens.length) {
        // парсим на строки
        const codeStringNode = this.parseExpression(); // парсим строку
        const error = codeStringNode as IError;

        if (error?.errorMessage) {
          return {
            errorCode: 1,
            errorMessage: error?.errorMessage,
          };
        }

        this.require(tokenTypesList.SEMICOLON); //обязательый перенос строки
        root.addNode(codeStringNode); // записываем узел
      }
      return root;
    } else {
      // ошибка
      return {
        errorCode: 1,
        errorMessage: `Ошибка: не закрыта или не открыта форма, или нет переноса на след. строку`,
      };
    }
  }

  typeInput(item: string): string[] {
    // обработка типов
    switch (item) {
      case "ПАРОЛЬ":
        return ["password", "Введите пароль"];
      case "ТЕКСТ":
        return ["text", "Введите текст"];
      case "ПОЧТА":
        return ["email", "Введите почту"];
      case "ЧЕКБОКС_КНОПКА":
        return ["checkbox"];
      case "РАДИО_КНОПКА":
        return ["radio"];
    }
    return ["text"];
  }

  //перевод в html
  coutCodeHtml(item: any): string {
    if (typeof item === "string") {
      // если строка, то обработка следующая
      switch (item) {
        case "START":
          return `<form>\n`;
        case "FINISH":
          return `</form>\n`;
        case "SEMICOLON":
          return `\n`;
      }
      return `${item}\n`;
    } else {
      if (item instanceof BinOperationNode) {
        // иначе это формула
        switch (
          item.operator.type.name // смотрим на оператор
        ) {
          case tokenTypesList.ASSIGN.name:
            if (item.leftNode instanceof HeaderNode) {
              // если заголовок
              const value =
                item.rightNode instanceof VariableNode &&
                `<h1>${
                  item.rightNode.variable.name[0].toUpperCase() +
                  item.rightNode.variable.name.slice(1)
                }</h1>\n`;
              return value ? value : "";
            } else if (item.leftNode instanceof InputNode) {
              if (item.rightNode instanceof TypeInputNode) {
                // если тип
                const value = this.typeInput(item.rightNode.type.name);
                return value.length === 1
                  ? `<input type="${value[0]}" />\n`
                  : `<input type="${value[0]}" placeholder="${value[1]}"/>\n`;
              } else {
                return `<input type='text' placeholder="${
                  item.rightNode instanceof VariableNode &&
                  item.rightNode.variable.name
                }"/>\n`;
              }
            } else if (item.leftNode instanceof SubmitNode) {
              // если кнопка отправить
              const value =
                item.rightNode instanceof VariableNode &&
                `<input type="submit" value="${
                  item.rightNode.variable.name[0].toUpperCase() +
                  item.rightNode.variable.name.slice(1)
                }" />\n`;

              return value ? value : "";
            } else {
              return ``;
            }
        }
      }
      return "";
    }
  }

  //обработка узлов
  run(node: ExpressionNode): any {
    let data = "";
    if (node instanceof StatementsNode) {
      node.codeStrings.forEach((codeString: any) => {
        data += this.coutCodeHtml(codeString);
      });
      return data;
    }
  }
}
