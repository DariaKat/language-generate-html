import ExpressionNode from "./ExpressionNode";
import Token from "../Token/Token";

export default class TypeInputNode extends ExpressionNode {
    type: Token;
    
    constructor(type: Token) {
        super();
        this.type = type;
    }
}