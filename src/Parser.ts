import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import HeaderNode from "./AST/HeaderNode";
import InputNode from "./AST/InputNode";
import StatementsNode from "./AST/StatementsNode";
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
      // throw new Error(`На позиции ${this.pos} обнаружена ошибка`);
    }
    return token;
  }

  parseNode(): ExpressionNode {
    const name = this.tokens[this.pos].type.name;
    this.pos += 1;
    return name;
  }

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
    const type = this.match(tokenTypesList.TYPE);
    if (type != null) {
      return new TypeInputNode(type);
    }
    return {
      errorCode: 1,
      errorMessage: `Ожидается заголовок или поле ввода на ${this.pos} позиции`,
    };
  }

  parseParentheses(): ExpressionNode {
    if (this.match(tokenTypesList.QUOTES) != null) {
      const node = this.parseFormula();
      this.require(tokenTypesList.QUOTES);
      return node;
    } else {
      return this.parseVariableAndInput();
    }
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.parseParentheses();
    return leftNode;
  }

  parseExpression(): ExpressionNode | IError {
    if (
      this.match(tokenTypesList.INPUT) === null &&
      this.match(tokenTypesList.HEADER) === null
    ) {
      const node = this.parseNode();
      return node; // возвращаем значение
    }
    this.pos -= 1;
    let variableAndInput = this.parseVariableAndInput();
    const assignOperator = this.match(tokenTypesList.ASSIGN);
    if (assignOperator !== null) {
      const rightFormulaNode = this.parseFormula();
      const binaryNode = new BinOperationNode(
        assignOperator,
        variableAndInput,
        rightFormulaNode
      );
      return binaryNode;
    }
    return {
      errorCode: 1,
      errorMessage: `На позиции ${this.pos} обнаружена ошибка`,
    };
  }

  parseCode(): ExpressionNode | IError {
    if (
      this.tokens[0].type.name === "START" &&
      this.tokens[this.tokens.length - 2].type.name === "FINISH"
    ) {
      const root = new StatementsNode();
      while (this.pos < this.tokens.length) {
        // парсим на строки
        const codeStringNode = this.parseExpression();
        this.require(tokenTypesList.SEMICOLON);
        root.addNode(codeStringNode); // записываем
      }
      return root;
    } else {
      return {
        errorCode: 1,
        errorMessage: `Ошибка: не закрыта или не открыта форма, или нет переноса на след. строку`,
      };
    }
  }

  typeInput(item: string): string[] {
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

  coutCodeHtml(item: any): string {
    if (typeof item === "string") {
      switch (item) {
        case "START":
          return `<form>\n`;
        case "FINISH":
          return `</form>\n`;
        case "SUBMIT":
          return `<input type="submit">\n`;
      }
      return `${item}\n`;
    } else {
      if (item instanceof BinOperationNode) {
        switch (item.operator.type.name) {
          case tokenTypesList.ASSIGN.name:
            if (item.leftNode instanceof HeaderNode) {
              const value =
                item.rightNode instanceof VariableNode &&
                `<h1>${item.rightNode.variable.name[0].toUpperCase() + item.rightNode.variable.name.slice(1)}</h1>\n`;
              return value ? value : "";
            } else if (item.rightNode instanceof TypeInputNode) {
              const value = this.typeInput(item.rightNode.type.name);
              return value.length === 1
                ? `<input type="${value[0]}" />\n`
                : `<input type="${value[0]}" placeholder="${value[1]}"/>\n`;
            } else {
              return `<input type="text" />\n`;
            }
        }
      }
      return "";
    }
  }

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
