import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class VariableNode extends ExpressionNode {
  // для значений
  variable: Token;

  constructor(variable: Token) {
    super();
    this.variable = variable;
  }
}
