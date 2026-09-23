"use client";

import { useState } from "react";

const BUTTONS = [
  ["C", "(", ")", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const OPERATORS = ["÷", "×", "-", "+", "="];

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function calculate() {
    if (!expression) return;
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error");
      const value = String(Number(data.result.toPrecision(12)));
      setResult(value);
      setExpression(value);
      setError("");
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Could not reach the backend." : err.message);
    }
  }

  function press(key) {
    setError("");
    if (key === "C") {
      setExpression("");
      setResult("");
    } else if (key === "⌫") {
      setExpression((e) => e.slice(0, -1));
    } else if (key === "=") {
      calculate();
    } else {
      setExpression((e) => e + key);
    }
  }

  return (
    <main className="container">
      <h1>Calculator</h1>
      <p className="subtitle">Calculated by the FastAPI backend</p>

      <div className="display">
        <div className="expression">{expression || "0"}</div>
        <div className={error ? "result error" : "result"}>{error || result}</div>
      </div>

      <div className="keypad">
        {BUTTONS.flat().map((key) => (
          <button
            key={key}
            onClick={() => press(key)}
            className={key === "=" ? "key equals" : OPERATORS.includes(key) ? "key op" : "key"}
          >
            {key}
          </button>
        ))}
      </div>
    </main>
  );
}
