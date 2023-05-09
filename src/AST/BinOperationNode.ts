import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class BinOperationNode extends ExpressionNode {
  operator: Token;
  leftNode: ExpressionNode;
  rightNode: ExpressionNode;

  constructor(
    operator: Token,
    leftNode: ExpressionNode,
    rightNode: ExpressionNode
  ) {
    // для обработки операций
    super();
    this.operator = operator;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}
