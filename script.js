const display = document.getElementById("display");

function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const expression = display.value;

    const tokens = expression.match(/(\d+(\.\d+)?)|[+\-*/%]/g);

    if (!tokens) {
      display.value = "Ошибка";
      return;
    }

    let stack = [];
    let current = parseFloat(tokens[0]);

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const next = parseFloat(tokens[i + 1]);

      if (operator === "*") {
        current *= next;
      } else if (operator === "/") {
        current /= next;
      } else if (operator === "%") {
        current %= next;
      } else {
        stack.push(current);
        stack.push(operator);
        current = next;
      }
    }

    stack.push(current);

    let result = stack[0];

    for (let i = 1; i < stack.length; i += 2) {
      const operator = stack[i];
      const next = stack[i + 1];

      if (operator === "+") {
        result += next;
      } else if (operator === "-") {
        result -= next;
      }
    }

    display.value = result;
  } catch (e) {
    display.value = "Ошибка";
  }
}
