import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class TypeInputNode extends ExpressionNode {
  // для обработки типов полей ввода
  type: Token;

  constructor(type: Token) {
    super();
    this.type = type;
  }
}
