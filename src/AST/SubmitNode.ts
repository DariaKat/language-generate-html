import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class SubmitNode extends ExpressionNode {
  // для кнопки отправки формы
  submit: Token;

  constructor(header: Token) {
    super();
    this.submit = header;
  }
}
