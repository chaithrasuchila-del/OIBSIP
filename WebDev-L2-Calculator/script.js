const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let justCalculated = false;


// Update calculator display
function updateDisplay() {
    display.value = expression || "0";
}


// Check whether a character is an operator
function isOperator(char) {
    return ["+", "-", "*", "/", "%"].includes(char);
}


// Add number
function appendNumber(number) {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression += number;

    updateDisplay();
}


// Add decimal point
function appendDecimal() {

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    const parts = expression.split(/[+\-*/%]/);
    const currentNumber = parts[parts.length - 1];

    if (!currentNumber.includes(".")) {

        if (currentNumber === "") {
            expression += "0.";
        } else {
            expression += ".";
        }
    }

    updateDisplay();
}


// Add operator
function appendOperator(operator) {

    if (expression === "") {
        return;
    }

    justCalculated = false;

    const lastChar = expression.slice(-1);

    // Replace previous operator
    if (isOperator(lastChar)) {
        expression = expression.slice(0, -1);
    }

    expression += operator;

    updateDisplay();
}


// Clear calculator
function clearDisplay() {

    expression = "";
    justCalculated = false;

    updateDisplay();
}


// Delete last character
function backspace() {

    expression = expression.slice(0, -1);
    justCalculated = false;

    updateDisplay();
}


// Convert expression into tokens
function tokenize(input) {

    const tokens = [];
    let number = "";

    for (let char of input) {

        if (
            (char >= "0" && char <= "9") ||
            char === "."
        ) {

            number += char;

        } else if (isOperator(char)) {

            if (number !== "") {
                tokens.push(parseFloat(number));
                number = "";
            }

            tokens.push(char);

        } else {

            throw new Error("Invalid input");
        }
    }

    if (number !== "") {
        tokens.push(parseFloat(number));
    }

    return tokens;
}


// Calculate expression
function calculate() {

    if (expression === "") {
        return;
    }

    try {

        const tokens = tokenize(expression);

        // Expression cannot end with operator
        if (typeof tokens[tokens.length - 1] === "string") {
            throw new Error("Invalid expression");
        }

        let values = tokens.slice();
        let i = 0;


        // Multiplication, division and modulo
        while (i < values.length) {

            if (
                values[i] === "*" ||
                values[i] === "/" ||
                values[i] === "%"
            ) {

                const left = values[i - 1];
                const right = values[i + 1];

                let result;


                // Multiplication
                if (values[i] === "*") {

                    result = left * right;

                }


                // Division
                else if (values[i] === "/") {

                    if (right === 0) {
                        throw new Error("Cannot divide by zero");
                    }

                    result = left / right;

                }


                // Modulo
                else {

                    if (right === 0) {
                        throw new Error("Cannot divide by zero");
                    }

                    result = left % right;
                }


                values.splice(i - 1, 3, result);

                i = 0;

            } else {

                i++;
            }
        }


        // Addition and subtraction
        let result = values[0];

        for (let j = 1; j < values.length; j += 2) {

            const operator = values[j];
            const number = values[j + 1];

            if (operator === "+") {

                result += number;

            } else if (operator === "-") {

                result -= number;
            }
        }


        // Check result
        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }


        // Round result
        expression = String(
            Math.round(
                (result + Number.EPSILON) * 100000000
            ) / 100000000
        );

        justCalculated = true;

        updateDisplay();

    } catch (error) {

        display.value = error.message;

        expression = "";
        justCalculated = true;
    }
}


// Button click event
buttons.addEventListener("click", function(event) {

    const button = event.target;

    if (button.tagName !== "BUTTON") {
        return;
    }

    const action = button.dataset.action;
    const value = button.dataset.value;


    if (action === "number") {

        appendNumber(value);

    }

    else if (action === "decimal") {

        appendDecimal();

    }

    else if (action === "operator") {

        appendOperator(value);

    }

    else if (action === "clear") {

        clearDisplay();

    }

    else if (action === "backspace") {

        backspace();

    }

    else if (action === "equals") {

        calculate();
    }
});
