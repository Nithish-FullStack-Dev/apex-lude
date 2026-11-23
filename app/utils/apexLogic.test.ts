import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCrankKinematics,
  getEngineStageFromProgress,
  filterProductsByQuery,
  validateContactInquiry,
} from './apexLogic';
import { PRODUCT_CATEGORIES } from '../data/apexData';

test('calculateCrankKinematics returns top-dead-center at 0 radians and bottom-dead-center at PI', () => {
  const tdc = calculateCrankKinematics(0, 0.4, 1.2);
  assert.ok(Math.abs(tdc.pistonOffset - 0.4) < 1e-6);
  assert.ok(Math.abs(tdc.rodAngleRad) < 1e-6);

  const bdc = calculateCrankKinematics(Math.PI, 0.4, 1.2);
  assert.ok(Math.abs(bdc.pistonOffset - -0.4) < 1e-6);
  assert.ok(Math.abs(bdc.rodAngleRad) < 1e-6);
});

test('getEngineStageFromProgress maps scroll bounds cleanly to stages 0, 1, 2', () => {
  assert.equal(getEngineStageFromProgress(-0.2).stageIndex, 0);
  assert.equal(getEngineStageFromProgress(0.15).stageIndex, 0);
  assert.equal(getEngineStageFromProgress(0.5).stageIndex, 1);
  assert.equal(getEngineStageFromProgress(0.85).stageIndex, 2);
  assert.equal(getEngineStageFromProgress(1.4).stageIndex, 2);
});

test('filterProductsByQuery matches API/ISO grades and product names accurately', () => {
  const all = filterProductsByQuery(PRODUCT_CATEGORIES, '');
  assert.equal(all.length, PRODUCT_CATEGORIES.length);

  const hydraulic = filterProductsByQuery(PRODUCT_CATEGORIES, 'ISO VG 46');
  assert.ok(hydraulic.some((item) => item.id === 'hydraulic-oils'));

  const hydraulicUnique = filterProductsByQuery(PRODUCT_CATEGORIES, 'anti-wear hydraulic');
  assert.equal(hydraulicUnique.length, 1);
  assert.equal(hydraulicUnique[0].id, 'hydraulic-oils');

  const dexron = filterProductsByQuery(PRODUCT_CATEGORIES, 'Dexron');
  assert.equal(dexron.length, 1);
  assert.equal(dexron[0].id, 'gear-transmission-oils');

  const none = filterProductsByQuery(PRODUCT_CATEGORIES, 'nonexistent_xyz');
  assert.equal(none.length, 0);
});

test('validateContactInquiry rejects empty or malformed fields and accepts valid submissions', () => {
  const invalid = validateContactInquiry({
    name: 'A',
    email: 'not-an-email',
    company: '',
    category: 'Diesel Engine Oils',
    message: 'Hi',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactInquiry({
    name: 'Tariq Al Mansoori',
    email: 'procurement@fleetuae.ae',
    company: 'Gulf Logistics',
    category: 'Diesel Engine Oils',
    message: 'Requesting technical data sheet and bulk quote for SAE 15W-40 API CI-4.',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});
