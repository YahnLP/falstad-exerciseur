// Regroupe les composants par type
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] ||= []).push(item);
    return acc;
  }, {});
}

// Parse le circuit Falstad exporté en une structure exploitable
function parseCircuit(text) {
  const components = [];
  const lines = text.trim().split('\n');

  for (let line of lines) {
    const tokens = line.trim().split(/\s+/);
    const type = tokens[0];
    if (!/^[vdrclq]/.test(type)) continue; // v: voltage, d: diode, r: résistance, c: capa, l: inductance, q: transistor...

    components.push({
      type,
      n1: `${tokens[1]},${tokens[2]}`,
      n2: `${tokens[3]},${tokens[4]}`,
      raw: line
    });
  }

  return {
    components,
    byType: groupBy(components, 'type')
  };
}

// Vérification générique + appel d’un script spécifique par exercice si défini
async function verifierExercice(studentText, solutionText, meta) {
  const feedback = [];
  const student = parseCircuit(studentText);
  const solution = parseCircuit(solutionText);

  // Vérification de base : composants requis
  const required = meta.required || {};
  for (let [type, minCount] of Object.entries(required)) {
    const actual = (student.byType[type] || []).length;
    if (actual >= minCount) {
      feedback.push(`✅ ${type.toUpperCase()} : ${actual} (attendu ≥ ${minCount})`);
    } else {
      feedback.push(`❌ ${type.toUpperCase()} : ${actual}, attendu ≥ ${minCount}`);
    }
  }

  // Appel de la vérification personnalisée si spécifiée
  if (meta.customVerifier && meta.id) {
    try {
      const module = await import(`./exercices/${meta.id}/verif.js`);
      const resultPerso = module.verify(student, solution);
      feedback.push(...resultPerso);
    } catch (err) {
      feedback.push(`⚠️ Erreur lors de la vérification personnalisée : ${err.message}`);
    }
  }

  return feedback;
}

// Fonction principale appelée depuis index.html
async function verifierDepuisInterface() {
  const resultDiv = document.getElementById("result");
  const studentCircuit = document.getElementById("studentCircuit").value.trim();
  const metaURL = document.getElementById("metaURL").value.trim();
  const solutionURL = document.getElementById("solutionURL").value.trim();

  if (!studentCircuit || !metaURL || !solutionURL) {
    resultDiv.innerHTML = "⚠️ Circuit, méta-données ou solution manquants.";
    resultDiv.style.color = "orange";
    return;
  }

  try {
    const metaRes = await fetch(metaURL);
    const meta = await metaRes.json();

    const solutionRes = await fetch(solutionURL);
    const solutionText = await solutionRes.text();

    const feedback = await verifierExercice(studentCircuit, solutionText, meta);

    resultDiv.innerHTML = feedback.map(f => `<div>${f}</div>`).join('');
    resultDiv.style.color = "black";
  } catch (err) {
    resultDiv.innerHTML = `❌ Erreur de chargement ou d’analyse : ${err.message}`;
    resultDiv.style.color = "red";
  }
}
