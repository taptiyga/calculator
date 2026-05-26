const display = document.getElementById("display");

const operators = ["+", "-", "*", "/"];

function clearDisplay() {
  display.value = "";
}

function appendNumber(num) {
  display.value += num;
}

function appendDot() {
  const tokens = display.value.split(/[\+\-\*\/\(\)]/);
  const lastToken = tokens[tokens.length - 1];

  if (!lastToken.includes(".")) {
    display.value += ".";
  }
}

function appendBracket(bracket) {
  display.value += bracket;
}

function appendOperator(operator) {
  const value = display.value;

  if (value === "") {
    // Разрешаем только минус в начале
    if (operator === "-") {
      display.value = "-";
    }
    return;
  }

  const lastChar = value.slice(-1);

  // Если последний символ оператор
  if (operators.includes(lastChar)) {
    // Если тот же оператор — ничего не делаем
    if (lastChar === operator) {
      return;
    }

    // Иначе заменяем
    display.value = value.slice(0, -1) + operator;
    return;
  }

  display.value += operator;
}

function tokenize(expression) {
  const tokens = [];
  let number = "";

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if ("0123456789.".includes(char)) {
      number += char;
    } else {
      if (number !== "") {
        tokens.push(number);
        number = "";
      }

      // Отрицательное число
      if (
        char === "-" &&
        (i === 0 ||
          operators.includes(expression[i - 1]) ||
          expression[i - 1] === "(")
      ) {
        number = "-";
      } else {
        tokens.push(char);
      }
    }
  }

  if (number !== "") {
    tokens.push(number);
  }

  return tokens;
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "*" || op === "/") return 2;
  return 0;
}

function applyOperator(values, op) {
  const b = values.pop();
  const a = values.pop();

  switch (op) {
    case "+":
      values.push(a + b);
      break;
    case "-":
      values.push(a - b);
      break;
    case "*":
      values.push(a * b);
      break;
    case "/":
      values.push(a / b);
      break;
  }
}

function evaluate(expression) {
  const tokens = tokenize(expression);

  const values = [];
  const ops = [];

  for (let token of tokens) {
    if (!isNaN(token)) {
      values.push(parseFloat(token));
    } else if (token === "(") {
      ops.push(token);
    } else if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        applyOperator(values, ops.pop());
      }

      ops.pop();
    } else if (operators.includes(token)) {
      while (
        ops.length &&
        precedence(ops[ops.length - 1]) >= precedence(token)
      ) {
        applyOperator(values, ops.pop());
      }

      ops.push(token);
    }
  }

  while (ops.length) {
    applyOperator(values, ops.pop());
  }

  return values[0];
}

function calculate() {
  try {
    const result = evaluate(display.value);

    if (!isFinite(result)) {
      display.value = "Ошибка";
      return;
    }

    display.value = result;
  } catch {
    display.value = "Ошибка";
  }
}
