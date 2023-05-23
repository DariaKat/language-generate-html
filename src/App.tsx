import { FC, useState, SyntheticEvent } from "react";
import { Button, Input, Alert, Radio, Typography } from "antd";
import "./App.css";
import {
  typeInput,
  valueButton,
  lightStyle,
  darkStyle,
  colorStyle,
} from "./constant";
import Lexer from "./Lexer";
import Parser, { IError } from "./Parser";
import StatementsNode from "./AST/StatementsNode";
import type { RadioChangeEvent } from "antd";
import parse from "html-react-parser";

const { TextArea } = Input;
const { Text } = Typography;

const App: FC = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState("");
  const [style, setStyle] = useState("");
  const [radio, setRadio] = useState<string>("");
  const [error, setError] = useState<IError | null>(null);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setValue(value + e.target?.value);
  };

  const onChange = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget) {
      setValue(event.currentTarget.value);
    }
  };

  const onClickInput = (e: any) => {
    setValue(value + e.currentTarget?.value);
  };

  const styleClick = (item: string) => {
    switch (item) {
      case "LIGHT":
        return lightStyle;
      case "DARK":
        return darkStyle;
      case "COLOR":
        return colorStyle;
      default:
        return lightStyle;
    }
  };

  const onClickGenerate = () => {
    setResult("");
    const lexer = new Lexer(value);
    const parser = new Parser(lexer.lexAnalysis());
    const rootNode = parser.parseCode();
    if (rootNode instanceof StatementsNode) {
      const resultHtml = parser.run(rootNode);
      setResult(resultHtml.data);
      setStyle(styleClick(resultHtml.style));
      setRadio(resultHtml.style.toLowerCase());
      setError(null);
    } else {
      setError(rootNode);
    }
  };

  const onClickClear = () => {
    setValue("");
    setResult("");
    setStyle("");
    setRadio("");
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
      <div className="header">
        <span className="label">Стиль формы: </span>
        <Radio.Group onChange={onChangeRadio} value={radio}>
          <Radio.Button value={"СВЕТЛАЯ_ТЕМА"}>Светлая тема</Radio.Button>
          <Radio.Button value={"ТЕМНАЯ_ТЕМА"}>Темная тема</Radio.Button>
          <Radio.Button value={"ЦВЕТНАЯ_ТЕМА"}>Цветная тема</Radio.Button>
        </Radio.Group>
      </div>
      <div className="main">
        <div className="first_form">
          <TextArea
            onChange={onChange}
            placeholder="Введите код"
            rows={17}
            value={value}
            style={{ resize: "none" }}
          />
        </div>
        <div className="second_form">
          <TextArea
            rows={17}
            placeholder="html-код"
            readOnly
            value={result}
            style={{ resize: "none" }}
          />
        </div>
        <div className="third_form">
          <TextArea
            rows={17}
            placeholder="Стили"
            readOnly
            value={style}
            style={{ resize: "none" }}
          />
        </div>
        <div className="fourth_form">
          <div className={radio.length !== 0 ? radio : "default light"}>
            {result ? (
              parse(result)
            ) : (
              <Text disabled>Здесь будет визуализация формы</Text>
            )}
          </div>
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
