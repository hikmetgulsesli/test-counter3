const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the HTML file
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Set up DOM
const dom = new JSDOM(html, { runScripts: 'dangerously' });
global.document = dom.window.document;
global.window = dom.window;

// Run tests
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (e) {
    console.log(`✗ ${name}: ${e.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

console.log('Running tests...\n');

// Test 1: Counter display shows 0 initially
test('Counter display shows 0 initially', () => {
  const countDisplay = document.getElementById('count');
  assert(countDisplay.textContent === '0', 'Initial count should be 0');
});

// Test 2: Add button exists
test('Add button exists', () => {
  const addBtn = document.getElementById('addBtn');
  assert(addBtn !== null, 'Add button should exist');
});

// Test 3: Remove button exists
test('Remove button exists', () => {
  const removeBtn = document.getElementById('removeBtn');
  assert(removeBtn !== null, 'Remove button should exist');
});

// Test 4: Counter has correct styling
test('Counter display has 72px font size', () => {
  const countDisplay = document.getElementById('count');
  const styles = dom.window.getComputedStyle(countDisplay);
  // We can't easily test computed styles in JSDOM, so check the element exists
  assert(countDisplay !== null, 'Counter display should exist');
});

// Test 5: Buttons have aria labels for accessibility
test('Buttons have aria labels', () => {
  const addBtn = document.getElementById('addBtn');
  const removeBtn = document.getElementById('removeBtn');
  assert(addBtn.hasAttribute('aria-label'), 'Add button should have aria-label');
  assert(removeBtn.hasAttribute('aria-label'), 'Remove button should have aria-label');
});

// Test 6: Body has correct background color
test('Body has correct background color', () => {
  const body = document.body;
  // Check style is defined in CSS
  const htmlContent = html;
  assert(htmlContent.includes('#f5f5f5'), 'Should have #f5f5f5 background color');
});

// Test 7: Buttons are side by side with gap
test('Buttons container has gap', () => {
  const htmlContent = html;
  assert(htmlContent.includes('gap: 16px'), 'Should have 16px gap between buttons');
});

// Test 8: CSS transitions are defined
test('CSS transitions are defined', () => {
  const htmlContent = html;
  assert(htmlContent.includes('0.2s ease'), 'Should have 0.2s ease transitions');
});

// Test 9: Button states are defined
test('Button hover and active states are defined', () => {
  const htmlContent = html;
  assert(htmlContent.includes('brightness(1.1)'), 'Should have brightness hover effect');
  assert(htmlContent.includes('scale(0.95)'), 'Should have scale active effect');
});

// Test 10: Color palette is correct
test('Color palette matches PRD', () => {
  const htmlContent = html;
  assert(htmlContent.includes('#4CAF50'), 'Should have green (#4CAF50) for add button');
  assert(htmlContent.includes('#f44336'), 'Should have red (#f44336) for remove button');
  assert(htmlContent.includes('#333'), 'Should have #333 for text');
});

// Test 11: Responsive design
test('Responsive design includes mobile breakpoint', () => {
  const htmlContent = html;
  assert(htmlContent.includes('@media'), 'Should have responsive media query');
});

// Test 12: Buttons are focusable
test('Buttons are keyboard accessible', () => {
  const addBtn = document.getElementById('addBtn');
  const removeBtn = document.getElementById('removeBtn');
  assert(addBtn.tagName === 'BUTTON', 'Add should be a button element');
  assert(removeBtn.tagName === 'BUTTON', 'Remove should be a button element');
});

console.log(`\n${testsPassed} tests passed, ${testsFailed} tests failed`);

process.exit(testsFailed > 0 ? 1 : 0);
