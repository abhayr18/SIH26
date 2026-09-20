import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateHeatIndex,
  calculateWBGT,
  calculateUTCI,
  calculateWetBulb,
  calculateHTSS,
  calculateThermalMetrics,
} from '../lib/thermal-engine';

test('Rothfusz Heat Index matches NOAA reference values', () => {
  // Test case: 35°C (95°F) at 50% RH
  const hi = calculateHeatIndex(35, 50);
  // NOAA calculator yields ~41-42°C (106-107°F)
  assert.ok(hi >= 40 && hi <= 43, `Heat Index ${hi} should be near 41°C`);

  // Low temperature safe condition (25°C, 40% RH)
  const hiMild = calculateHeatIndex(25, 40);
  assert.ok(hiMild <= 27, `Mild HI ${hiMild} should be safe`);
});

test('WBGT accounts for vapor pressure and incident solar load', () => {
  const shadeWBGT = calculateWBGT(38, 45, 0);
  const sunWBGT = calculateWBGT(38, 45, 800); // strong solar radiation

  assert.ok(sunWBGT > shadeWBGT, 'Direct solar radiation must increase WBGT');
  assert.ok(sunWBGT - shadeWBGT >= 6.0, '800 W/m2 solar load should elevate outdoor WBGT significantly');
});

test('Wet bulb calculation accurately captures evaporative limit', () => {
  const tw = calculateWetBulb(40, 30);
  assert.ok(tw < 40, 'Wet bulb must be strictly lower than dry bulb when RH < 100%');
  assert.ok(tw > 20 && tw < 28, `Wet bulb ${tw}°C should be realistic for 40°C, 30% RH`);
});

test('HTSS composite enforces non-compensatory safeguard', () => {
  // Simulate an extreme WBGT spike (35°C WBGT = lethal) with artificially lower HI
  const extremeResult = calculateHTSS(36, 35, 36);
  assert.ok(
    extremeResult.score >= 50,
    `HTSS score ${extremeResult.score} must not drop below critical safeguard under high WBGT`
  );
  assert.strictEqual(extremeResult.primary, 'WBGT', 'Primary contributor should be identified as WBGT');
});

test('Thermal metrics bundle produces valid end-to-end payload', () => {
  const metrics = calculateThermalMetrics(42, 60, 15, 600);
  assert.ok(metrics.htss_score > 60, '42°C with 60% RH must produce high/extreme HTSS');
  assert.strictEqual(typeof metrics.heat_index_c, 'number');
  assert.strictEqual(typeof metrics.wbgt_c, 'number');
  assert.strictEqual(typeof metrics.utci_c, 'number');
  assert.ok(metrics.contributions.UTCI + metrics.contributions.WBGT + metrics.contributions.HeatIndex >= 99);
});
