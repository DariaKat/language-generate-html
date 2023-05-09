import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class InputNode extends ExpressionNode {
  // для полей ввода
  input: Token;

  constructor(input: Token) {
    super();
    this.input = input;
  }
}
