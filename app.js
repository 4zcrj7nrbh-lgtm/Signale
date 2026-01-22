document.addEventListener("DOMContentLoaded", () => {
  const app = document.createElement("div");
  app.innerHTML = `
    <h2>Quiz startet bald…</h2>
    <p>Hier lernst du die Bahn-Signale interaktiv 🚦</p>
    <button id="startBtn">Quiz starten</button>
  `;
  document.body.appendChild(app);

  document.getElementById("startBtn").addEventListener("click", () => {
    alert("Hier kommt gleich das echte Signal-Quiz!");
  });
});
