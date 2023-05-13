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
  parseInput(): ExpressionNode | IError {
    const input = this.match(tokenTypesList.INPUT);
    if (input != null) {
      return new InputNode(input);
    }
    const header = this.match(tokenTypesList.HEADER);
    if (header != null) {
      return new HeaderNode(header);
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

  parseVariable(): ExpressionNode | IError {
    if (this.match(tokenTypesList.QUOTES) !== null) {
      // если в начале есть кавычка
      let variable = this.match(tokenTypesList.VARIABLE);
      let node: any = new VariableNode(); // внутри может находится значение
      while (variable !== null) {
        node.addNode(variable);
        variable = this.match(tokenTypesList.VARIABLE);
      }
      const info = this.require(tokenTypesList.QUOTES); // ожидаем что она закрыта
      const error = info as IError;
      return error?.errorMessage ? error : node; // возвращаем узел
    } else {
      return {
        errorCode: 1,
        errorMessage: `Ожидаются кавчки на ${this.pos} позиции`,
      };
    }
  }

  parseParentheses(): ExpressionNode | IError {
    if (this.match(tokenTypesList.DESCRIPTION) !== null) {
      return this.parseVariable();
    } else if (this.match(tokenTypesList.QUOTES) !== null) {
      this.pos -= 1;
      return this.parseVariable();
    } else if (this.match(tokenTypesList.BRACKETS_LEFT) !== null) {
      const node = this.parseFormula();
      const info = this.require(tokenTypesList.BRACKETS_RIGHT);
      const error = info as IError;
      return error?.errorMessage ? error : node;
    } else {
      return this.parseInput(); // для обработки типа или значения, возвращаем
    }
  }

  //правый операнд
  parseFormula(): ExpressionNode | IError {
    let leftNode = this.parseParentheses();
    let operator = this.match(tokenTypesList.COMMA);

    if (operator !== null) {
      const rightNode = this.parseParentheses();
      leftNode = new BinOperationNode(operator, leftNode, rightNode);
      operator = this.match(tokenTypesList.COMMA);
    }

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
    let variableAndInput = this.parseInput(); // вызываем метод для обработки типов
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

  stringCreate(item: any) {
    return (
      item instanceof VariableNode &&
      item.variable.map((item: any) => item.name).join(" ")
    );
  }

  typeInput(item: string): string {
    // обработка типов
    switch (item) {
      case "ТИП_ПАРОЛЬ":
        return "password";
      case "ТИП_ТЕКСТ":
        return "text";
      case "ТИП_ПОЧТА":
        return "email";
      case "ТИП_ЧЕКБОКС_КНОПКА":
        return "checkbox";
      case "ТИП_РАДИО_КНОПКА":
        return "radio";
    }
    return "text";
  }

  getInfoInput(item: any): string {
    // обработка типов
    if (item instanceof BinOperationNode) {
      switch (
        item.operator.type.name // смотрим на оператор
      ) {
        case tokenTypesList.COMMA.name:
          if (
            item.rightNode instanceof VariableNode &&
            item.leftNode instanceof TypeInputNode
          ) {
            const type =
              item.leftNode.type instanceof Token &&
              this.typeInput(item.leftNode.type.name);
            const placeholder: any = this.stringCreate(item.rightNode);

            return type === "radio" || type === "checkbox"
              ? `<label><input type="${type}" name="radio"/>${
                  placeholder[0].toUpperCase() + placeholder.slice(1)
                }</label>`
              : `<input type="${type}" placeholder="${
                  placeholder[0].toUpperCase() + placeholder.slice(1)
                }"/>\n`;
          }
      }
      return "";
    }
    return "";
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
              const getValue: any = this.stringCreate(item.rightNode);
              // если заголовок
              const value = `<h1>${
                getValue[0].toUpperCase() + getValue.slice(1)
              }</h1>\n`;
              return value ? value : "";
            } else if (item.leftNode instanceof InputNode) {
              if (item.rightNode instanceof BinOperationNode) {
                // если тип
                const value = this.getInfoInput(item.rightNode);
                return value;
              } else {
                return `\n`;
              }
            } else if (item.leftNode instanceof SubmitNode) {
              const getValue: any = this.stringCreate(item.rightNode);
              // если кнопка отправить
              const value = `<button type="submit">${
                getValue[0].toUpperCase() + getValue.slice(1)
              }</button>\n`;

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
