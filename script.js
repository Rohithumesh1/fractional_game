let circles = [];

document.addEventListener('DOMContentLoaded', function() {
  const addCircleBtn = document.getElementById('addCircleBtn');
  const submitBtn = document.getElementById('submitBtn');

  addCircleBtn.addEventListener('click', addCircle);
  submitBtn.addEventListener('click', submitFraction);
});

function createCircle() {
  const circle = document.createElement('div');
  circle.className = 'circle';
  return circle;
}

function addCircle() {
  const circlesContainer = document.getElementById('circlesContainer');
  const circleContainer = document.createElement('div');
  circleContainer.className = 'circle-container';

  const circle = createCircle();

  const controls = document.createElement('div');
  controls.className = 'circle-controls';

  const removeBtn = createButton('Remove circle', () => removeCircle(circleContainer));
  const addSectionBtn = createButton('Add section', () => addSection(circle));
  const removeSectionBtn = createButton('Remove section', () => removeSection(circle));

  controls.appendChild(removeBtn);
  controls.appendChild(addSectionBtn);
  controls.appendChild(removeSectionBtn);

  circleContainer.appendChild(circle);
  circleContainer.appendChild(controls);

  circlesContainer.appendChild(circleContainer);

  circles.push(circle);

  updateSubmitButton();
}

function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

function removeCircle(circleContainer) {
  circleContainer.remove();
  circles = circles.filter(circle => circle !== circleContainer.querySelector('.circle'));
  updateSubmitButton();
}

function addSection(circle) {
  const sections = circle.querySelectorAll('.section');
  if (sections.length >= 12) return; // Max 12 sections

  const section = document.createElement('div');
  section.className = 'section';

  circle.appendChild(section);
  updateSections(circle);

  section.addEventListener('click', () => toggleSectionColor(section));
}

function removeSection(circle) {
  const sections = circle.querySelectorAll('.section');
  if (sections.length > 0) {
    sections[sections.length - 1].remove();
    updateSections(circle);
  }
}

function updateSections(circle) {
  const sections = circle.querySelectorAll('.section');
  const totalSections = sections.length;
  
  sections.forEach((section, index) => {
    section.style.position = 'absolute';
    section.style.width = '100%';
    section.style.height = '100%';
    section.style.top = '0';
    section.style.left = '0';
    section.style.transform = 'none';
    section.style.clipPath = 'none';
    section.style.borderRadius = '0';

    if (totalSections === 1) {
      section.style.transform = 'none';
      section.style.width = '100%';
      section.style.height = '100%';
      section.style.top = '0';
      section.style.left = '0';
    } else if (totalSections === 2) {
      section.style.height = '50%';
      section.style.top = index === 0 ? '0' : '50%';
      section.style.borderBottom = index === 0 ? '1px solid black' : 'none';
    } else if (totalSections === 3) {
      const angle = 120 * index;
      section.style.transform = `rotate(${angle}deg) skew(150deg)`;
      section.style.width = '100%';
      section.style.height = '100%';
      section.style.top = '50%';
      section.style.left = '50%';
    } else {
      // For 4 or more sections, use the original logic
      const angle = (360 / totalSections) * index;
      const skew = 90 - (360 / totalSections);
      section.style.width = '50%';
      section.style.height = '50%';
      section.style.top = '50%';
      section.style.left = '50%';
      section.style.transform = `rotate(${angle}deg) skew(${skew}deg)`;
    }
  });
}

function toggleSectionColor(section) {
  section.classList.toggle('colored');
}

function updateSubmitButton() {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.style.display = circles.length > 0 ? 'inline-block' : 'none';
}

function submitFraction() {
  const inputFraction = document.getElementById('fractionInput').value;
  const parsedFraction = parseFraction(inputFraction);
  const coloredFraction = calculateColoredFraction();

  const score = calculateScore(parsedFraction, coloredFraction);

  // Display the score and fractions for debugging
  const scoreContainer = document.getElementById('scoreContainer');
  scoreContainer.innerHTML = `Score: ${score}<br>`;
  scoreContainer.innerHTML += `Your input: ${formatFraction(parsedFraction)}<br>`;
  scoreContainer.innerHTML += `Colored fraction: ${coloredFraction.numerator}/${coloredFraction.denominator}`;

  // Add feedback based on the score
  if (score === 1) {
    scoreContainer.innerHTML += "<br>Perfect!";
  } else if (score >= 0.5) {
    scoreContainer.innerHTML += "<br>Close!";
  } else {
    scoreContainer.innerHTML += "<br>Try again!";
  }
}

// Make sure this event listener is properly set
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitBtn');
  submitBtn.addEventListener('click', submitFraction);
})

// Helper function to simplify fractions
function simplifyFraction(numerator, denominator) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

function parseFraction(input) {
  // Remove any whitespace
  input = input.replace(/\s/g, '');
  
  // Regular expressions for different fraction formats
  const mixedFractionRegex = /^(-?\d+)\s*(\d+)\/(\d+)$/;
  const simpleFractionRegex = /^(-?\d+)\/(\d+)$/;
  const wholeNumberRegex = /^(-?\d+)$/;
  
  let whole = 0, numerator, denominator;
  
  if (mixedFractionRegex.test(input)) {
    const [, w, num, den] = input.match(mixedFractionRegex);
    whole = parseInt(w);
    numerator = parseInt(num);
    denominator = parseInt(den);
  } else if (simpleFractionRegex.test(input)) {
    const [, num, den] = input.match(simpleFractionRegex);
    numerator = parseInt(num);
    denominator = parseInt(den);
  } else if (wholeNumberRegex.test(input)) {
    whole = parseInt(input);
    numerator = 0;
    denominator = 1;
  } else {
    throw new Error('Invalid fraction format');
  }
  
  // Convert to improper fraction
  numerator = Math.abs(whole) * denominator + numerator;
  if (whole < 0) numerator = -numerator;
  
  // Simplify the fraction
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), denominator);
  
  return {
    whole: 0,
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}

function calculateColoredFraction() {
  let totalSections = 0;
  let coloredSections = 0;
  let wholeColoredCircles = 0;

  circles.forEach(circle => {
    const sections = circle.querySelectorAll('.section');
    const coloredSectionsInCircle = Array.from(sections).filter(s => s.classList.contains('colored')).length;
    
    if (sections.length === coloredSectionsInCircle && sections.length === 1) {
      wholeColoredCircles++;
    } else {
      totalSections += sections.length;
      coloredSections += coloredSectionsInCircle;
    }
  });

  // Add whole colored circles to the fraction
  coloredSections += wholeColoredCircles * totalSections;

  return simplifyFraction(coloredSections, totalSections);
}

function calculateScore(input, colored) {
  let score = 0;
  
  // Compare fractions
  const inputDecimal = input.numerator / input.denominator;
  const coloredDecimal = colored.numerator / colored.denominator;
  
  if (inputDecimal === coloredDecimal) {
    score = 1; // Exact match
  } else {
    const difference = Math.abs(inputDecimal - coloredDecimal);
    
    if (difference < 0.001) {
      score = 0.5; // Close match
    }
  }

  return score;
}

function formatFraction(fraction) {
  const { whole, numerator, denominator } = fraction;
  let formattedFraction = '';

  if (whole !== 0) {
    formattedFraction += whole;
    if (numerator !== 0) {
      formattedFraction += ' ';
    }
  }

  if (numerator !== 0) {
    formattedFraction += `${Math.abs(numerator)}/${denominator}`;
  }

  return formattedFraction || '0';
}

// Helper function to simplify fractions
function simplifyFraction(numerator, denominator) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(Math.abs(numerator), denominator);
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor
  };
}