import TokenType from "./TokenType";

export default class Token { 
    type: TokenType; // тип токена
    name: string; // например, название переменной, оператор и тд.
    pos: number; // позиция в коде

    constructor(type: TokenType, name: string, pos:number) { //конструктор, для создания объектов их этого класса
        this.type = type;
        this.name = name;
        this.pos = pos;
    }
} 