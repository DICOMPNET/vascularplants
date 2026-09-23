const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const OpenCC = require('opencc-js');

const datasetRoot = path.resolve(__dirname, '..', 'data');
const toSimplifiedChinese = OpenCC.Converter({ from: 't', to: 'cn' });

function readDataset(name) {
  return JSON.parse(fs.readFileSync(path.join(datasetRoot, name), 'utf8'));
}

test('taxonomy and family representatives have a complete family mapping', () => {
  const taxonomy = readDataset('taxonomy.json');
  const representatives = readDataset('family_representatives.json');
  const representativeIds = new Set(representatives.representatives.map(record => record.familyId));

  assert.equal(taxonomy.meta.totalFamilies, taxonomy.families.length);
  assert.equal(representatives.meta.totalFamilyRecords, representatives.representatives.length);
  assert.deepEqual(new Set(taxonomy.families.map(family => family.id)), representativeIds);
});

test('all family representative images exist in the shared planet dataset', () => {
  const representatives = readDataset('family_representatives.json');
  for (const record of representatives.representatives) {
    assert.ok(fs.existsSync(path.resolve(datasetRoot, '..', record.image)), `${record.familyName} image is missing`);
  }
});

test('every taxonomy node is connected to the vascular plant root', () => {
  const taxonomy = readDataset('taxonomy.json');
  const allNodes = [...taxonomy.nodes, ...taxonomy.families];
  const byId = new Map(allNodes.map(node => [node.id, node]));

  for (const node of allNodes) {
    const seen = new Set();
    let current = node;
    while (current.parent) {
      assert.ok(byId.has(current.parent), `${current.name} has a missing parent`);
      assert.ok(!seen.has(current.id), `${current.name} is part of a cycle`);
      seen.add(current.id);
      current = byId.get(current.parent);
    }
    assert.equal(current.id, 'tracheophyta', `${node.name} does not reach the root`);
  }
});

test('every source observation record has an image or a family-level fallback image', () => {
  const specimens = readDataset('specimens.json');
  const representatives = readDataset('family_representatives.json');
  const fallbackByFamily = new Map(representatives.representatives.map(record => [record.familyName, record.image]));

  for (const specimen of specimens.specimens) {
    const primaryExists = specimen.image && fs.existsSync(path.resolve(datasetRoot, '..', specimen.image));
    const fallback = fallbackByFamily.get(specimen.family);
    const fallbackExists = fallback && fs.existsSync(path.resolve(datasetRoot, '..', fallback));
    assert.ok(primaryExists || fallbackExists, `${specimen.scientificName} has no usable image`);
  }
});

test('display metadata gives every family a Chinese display label and detailed atlas annotation', () => {
  const taxonomy = readDataset('taxonomy.json');
  const displayMetadata = readDataset('display_metadata.json');
  const recordsByFamilyId = new Map(displayMetadata.records.map(record => [record.familyId, record]));

  assert.equal(displayMetadata.summary.totalRecords, taxonomy.families.length);
  assert.equal(displayMetadata.summary.genericLabels, 0);
  assert.equal(
    displayMetadata.summary.sourceObservationNotes + displayMetadata.summary.promptDerivedNotes,
    taxonomy.families.length
  );
  assert.equal(recordsByFamilyId.size, taxonomy.families.length);
  for (const family of taxonomy.families) {
    const record = recordsByFamilyId.get(family.id);
    assert.ok(record, `${family.name} has no display metadata`);
    assert.match(record.displayName, /[\u4e00-\u9fff]/, `${family.name} needs a Chinese display label`);
    assert.ok(record.note && record.note.length > 12, `${family.name} needs an atlas note`);
    assert.ok(record.observationFocus, `${family.name} needs observation focus`);
    assert.ok(record.observationDetail, `${family.name} needs image-specific observation detail`);
    assert.ok(record.familyDescription && record.familyDescription.length > 120, `${family.name} needs a detailed family description`);
    assert.ok(record.representativeIntroduction && record.representativeIntroduction.length > 120, `${family.name} needs a detailed representative introduction`);
    assert.ok(record.familyDescriptionEn && record.familyDescriptionEn.length > 120, `${family.name} needs a detailed English family description`);
    assert.ok(record.representativeIntroductionEn && record.representativeIntroductionEn.length > 120, `${family.name} needs a detailed English representative introduction`);
  }
});

test('display metadata contains simplified Chinese text only', () => {
  const source = fs.readFileSync(path.join(datasetRoot, 'display_metadata.json'), 'utf8');
  assert.equal(toSimplifiedChinese(source), source);
});
