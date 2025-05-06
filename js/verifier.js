function verifier() {
  const student = document.getElementById("studentCircuit").value.trim();
  const resultDiv = document.getElementById("result");

  const solution = `$ 1 5.0E-6 10.20027730826997 50 5.0 50
v 96 96 96 176 0 1 40.0 50.0 0.0 0.0 0.5
d 176 96 256 96 1 0.805904783
d 96 176 176 176 1 0.805904783
d 256 176 176 176 1 0.805904783
d 176 96 96 96 1 0.805904783
r 256 96 256 176 0 1000.0`;

  if (!student) {
    resultDiv.textContent = "⚠️ Veuillez coller votre circuit.";
    resultDiv.style.color = "orange";
    return;
  }

  const normalize = str => str.replace(/\s/g, '').toLowerCase();
  if (normalize(student) === normalize(solution)) {
    resultDiv.textContent = "✅ Bravo ! Ton circuit est correct.";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = "❌ Le circuit ne correspond pas exactement au modèle.";
    resultDiv.style.color = "red";
  }
}
