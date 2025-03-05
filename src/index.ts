interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToHSL(hex: string): HSL {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number = 0, s: number, l: number = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return {h, s: s * 100, l: l * 100};
}

function hslToHex({h, s, l}: HSL) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

interface Formula {
  hShift: number;
  sShift: number;
  lShift: number;
}

function computeFormula(sourceBase: string, sourceResult: string): Formula {
  const baseHSL = hexToHSL(sourceBase);
  const resultHSL = hexToHSL(sourceResult);
  return {
    hShift: resultHSL.h - baseHSL.h,
    sShift: resultHSL.s - baseHSL.s,
    lShift: resultHSL.l - baseHSL.l
  };
}

function applyFormula(targetBase: string, formula: Formula) {
  const baseHSL = hexToHSL(targetBase);
  const newH = (baseHSL.h + formula.hShift) % 360;
  const newS = Math.min(100, Math.max(0, baseHSL.s + formula.sShift));
  const newL = Math.min(100, Math.max(0, baseHSL.l + formula.lShift));
  return hslToHex({h: newH, s: newS, l: newL});
}

// Example usage:
const sourceBase = "#3498db";  // Example brand colour
const sourceResult = "#2980b9"; // A darker shade of it
const targetBase = "#e74c3c";  // Your primary brand colour

const formula = computeFormula(sourceBase, sourceResult);
const targetResult = applyFormula(targetBase, formula);

console.log(targetResult)
