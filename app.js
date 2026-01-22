const signals = [
  { name: "Hp 0", meaning: "Halt" },
  { name: "Hp 1", meaning: "Fahrt" }
];

let current = 0;

document.body.innerHTML += `
  <h2>${signals[current].name}</h2>
  <button onclick="check('Halt')">Halt</button>
  <button onclick="check('Fahrt')">Fahrt</button>
  <p id="result"></p>
`;

function check(answer) {
  const result = document.getElementById("result");
  if (answer === signals[current].meaning) {
    result.textContent = "Richtig ✅";
  } else {
    result.textContent = "Falsch ❌";
  }
}
