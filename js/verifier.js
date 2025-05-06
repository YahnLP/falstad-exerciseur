function verifier() {
  const resultDiv = document.getElementById("result");
  const circuitText = document.getElementById("studentCircuit").value.trim();

  if (!circuitText) {
    resultDiv.textContent = "⚠️ Veuillez coller votre circuit.";
    resultDiv.style.color = "orange";
    return;
  }

  const lines = circuitText.split("\n").filter(l => /^[vdr]/.test(l));
  const composants = lines.map(ligne => {
    const tokens = ligne.trim().split(/\s+/);
    return {
      type: tokens[0],
      x1: parseInt(tokens[1]),
      y1: parseInt(tokens[2]),
      x2: parseInt(tokens[3]),
      y2: parseInt(tokens[4]),
      sens: ligne.includes("1") ? "direct" : "inconnu"
    };
  });

  // Analyse simple : nombre de chaque composant
  const stats = { v: 0, d: 0, r: 0 };
  composants.forEach(c => {
    if (stats[c.type] !== undefined) stats[c.type]++;
  });

  const hasAC = stats.v >= 1;
  const hasDiodes = stats.d >= 4;
  const hasResistance = stats.r >= 1;

  if (hasAC && hasDiodes && hasResistance) {
    resultDiv.textContent = "✅ Ton circuit contient bien les éléments nécessaires (AC, 4 diodes, 1 résistance).";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = `❌ Problème détecté :
    - Source AC : ${hasAC ? "OK" : "❌ manquante"}
    - Diodes : ${stats.d} (attendues ≥ 4)
    - Résistances : ${stats.r} (attendues ≥ 1)`;
    resultDiv.style.color = "red";
  }
}
