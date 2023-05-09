import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class SubmitNode extends ExpressionNode {
  submit: Token;

  constructor(header: Token) {
    super();
    this.submit = header;
  }
}
