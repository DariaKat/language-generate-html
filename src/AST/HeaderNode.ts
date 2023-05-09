import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class HeaderNode extends ExpressionNode {
  // для заголовка
  header: Token;

  constructor(header: Token) {
    super();
    this.header = header;
  }
}
