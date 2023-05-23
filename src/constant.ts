export const valueButton = [
  { id: 1, value: "НАЧАЛО_ФОРМЫ", name: "Начало формы" },
  { id: 3, value: "ПОЛЕ_ВВОДА", name: "Поле ввода" },
  { id: 4, value: "ЗАГОЛОВОК", name: "Заголовок" },
  { id: 6, value: "=", name: "Равно" },
  { id: 7, value: "ОТПРАВИТЬ", name: "Кнопка отправить" },
  { id: 2, value: "КОНЕЦ_ФОРМЫ", name: "Конец формы" },
];

export const typeInput = [
  { id: 1, value: "ТИП_ПАРОЛЬ", name: "пароль" },
  { id: 2, value: "ТИП_ТЕКСТ", name: "текст" },
  { id: 3, value: "ТИП_ЧЕКБОКС_КНОПКА", name: "чекбокс-кнопка" },
  { id: 4, value: "ТИП_ПОЧТА", name: "почта" },
  { id: 5, value: "ТИП_РАДИО_КНОПКА", name: "радио-кнопка" },
];

export const lightStyle = `form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

 input {
  text-align: center;
  border-radius: 7px;
  background: #eee;
  padding: 1em 2em;
  outline: none;
  border: none;
  color: #222;
  transition: 0.3s linear;
  margin: 10px 0;
}

input:focus {
  background: rgba(0, 0, 333, 0.1);
}

label {
  width: 100%;
}

input[type="radio"],
input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}

button {
  background-image: linear-gradient(
    to left,
    rgba(255, 146, 202, 0.75) 0%,
    rgba(145, 149, 251, 0.86) 100%
  );
  box-shadow: 0 9px 25px -5px #df91fb;
  font-family: "Abel", sans-serif;
  padding: 0.5em 1.9em;
  margin: 16px 0 0 0;
  border-radius: 7px;
  font-size: 1.4em;
  cursor: pointer;
  color: #ffffff;
  font-size: 1em;
  outline: none;
  border: none;
  transition: 0.3s linear;
}

button:hover {
  transform: translatey(2px);
}

button:active {
  transform: translatey(5px);
}`;

export const darkStyle = `h1 {
  color: #fff;
}

 form {
  background-color: #15172b;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

label {
  color: #fff;
  width: 100%;
}

input {
  background-color: #303245;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 10px 20px;
  width: 100%;
  margin: 10px 0;
}

button {
  background-color: #08d;
  border-radius: 12px;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  cursor: pointer;
  font-size: 18px;
  height: 50px;
  margin-top: 16px;
  text-align: center;
  width: 100%;
}

input[type="radio"],
input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}`;

export const colorStyle = `form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
}

input {
  font-size: 0.875em;
  padding: 10px 15px;
  margin: 10px 0;
  background: transparent;
  outline: none;
  color: #726659;
  border: solid 1px #b3aca7;
}

input:hover {
  background: #b3aca7;
  color: #e2dedb;
}

 button {
  padding: 10px;
  margin-top: 16px;
  font-size: 0.875em;
  color: #b3aca7;
  outline: none;
  cursor: pointer;
  border: solid 1px #b3aca7;
}

button:hover {
  color: #857366;
}

label {
  width: 100%;
}

input[type="radio"],
input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}
`;
