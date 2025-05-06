export function verify(student, solution) {
  const feedback = [];
  const diodes = student.byType['d'] || [];

  const sharedNodes = {};
  diodes.forEach(d => {
    sharedNodes[d.n1] = (sharedNodes[d.n1] || 0) + 1;
    sharedNodes[d.n2] = (sharedNodes[d.n2] || 0) + 1;
  });

  const common = Object.entries(sharedNodes).filter(([_, v]) => v > 1);
  if (common.length >= 2) {
    feedback.push("✅ Connexion centrale des diodes détectée.");
  } else {
    feedback.push("❌ Les diodes ne semblent pas bien reliées pour former un pont.");
  }

  return feedback;
}
