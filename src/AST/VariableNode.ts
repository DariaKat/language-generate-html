import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class VariableNode extends ExpressionNode {
  // для значений
  variable: Token[] = [];

  addNode(variable: Token) {
    this.variable.push(variable);
  }
}
