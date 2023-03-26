import { FC, useState, SyntheticEvent } from "react";
import { Button, Input, Alert } from "antd";
import "./App.css";
import { typeInput, valueButton } from "./constant";
import Lexer from "./Lexer";
import Parser, { IError } from "./Parser";
import StatementsNode from "./AST/StatementsNode";

const { TextArea } = Input;

const App: FC = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState<IError | null>(null);

  const onChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget) {
      setValue(event.currentTarget.value);
    }
  };

  const onClickInput = (e: any) => {
    setValue(value + e.currentTarget?.value);
  };

  const onClickGenerate = () => {
    setResult("");
    const lexer = new Lexer(value);
    const parser = new Parser(lexer.lexAnalysis());
    const rootNode = parser.parseCode();
    if (rootNode instanceof StatementsNode) {
      setResult(parser.run(rootNode));
      setError(null);
    } else {
      setError(rootNode);
    }
  };

  const onClickClear = () => {
    setValue("");
    setResult("");
    setError(null);
  };

  return (
    <div className="App">
      <div className="header">
        <span className="label">Составляющие формы: </span>
        {valueButton.map((item) => (
          <Button
            key={item.id}
            className="btn"
            value={item.value}
            onClick={onClickInput}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="header">
        <span className="label">Тип поля ввода: </span>
        {typeInput.map((item) => (
          <Button
            key={item.id}
            className="btn"
            value={item.value}
            onClick={onClickInput}
          >
            {item.name}
          </Button>
        ))}
      </div>
      <div className="main">
        <div className="first_form">
          <TextArea
            onChange={onChange}
            rows={15}
            value={value}
            style={{ resize: "none" }}
          />
        </div>
        <div className="second_form">
          <TextArea
            rows={15}
            readOnly
            value={result}
            style={{ resize: "none" }}
          />
        </div>
      </div>
      <div className="error">
        {error && (
          <>
            <Alert message={error.errorMessage} type="error" />
          </>
        )}
      </div>
      <div className="footer">
        <Button type="primary" onClick={onClickGenerate}>
          Генерировать
        </Button>
        <Button onClick={onClickClear}>Очистить</Button>
      </div>
    </div>
  );
};

export default App;
