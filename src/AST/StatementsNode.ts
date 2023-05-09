import ExpressionNode from "./ExpressionNode";

export default class StatementsNode extends ExpressionNode {
  // хранит строки кода
  codeStrings: ExpressionNode[] = [];

  addNode(node: ExpressionNode) {
    // записываем массив узлов
    this.codeStrings.push(node);
  }
}
