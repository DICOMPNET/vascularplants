#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const OpenCC = require('opencc-js');

const appRoot = path.resolve(__dirname, '..');
const dataDir = path.join(appRoot, 'data');
const taxonomyPath = path.join(dataDir, 'taxonomy.json');
const representativesPath = path.join(dataDir, 'family_representatives.json');
const observationSeedsPath = path.join(dataDir, 'specimens.json');
const outputPath = path.join(dataDir, 'display_metadata.json');
const concurrency = 6;
const requestAttempts = 3;
const refreshVernacularNames = process.argv.includes('--refresh-names');
const toSimplifiedChinese = OpenCC.Converter({ from: 't', to: 'cn' });
const chineseLanguage = /^(zh|zho|chi)/i;
const hanCharacters = /\p{Script=Han}/u;
const familyChineseNameOverrides = {
  Thyrsopteridaceae: { name: '伞序蕨科', source: 'Wikidata and Chinese Wikipedia' },
  Loxsomataceae: { name: '偏环蕨科', source: 'Wikidata' },
  Culcitaceae: { name: '垫囊蕨科', source: 'Chinese Wikipedia' },
  Metaxyaceae: { name: '蚌桫蕨科', source: 'Chinese Wikipedia' },
  Didymochlaenaceae: { name: '翼囊蕨科', source: 'Wikidata' },
  Tectariaceae: { name: '三叉蕨科', source: 'Wikidata' },
  Salvadoraceae: { name: '刺茉莉科', source: 'Wikidata' },
  Schoepfiaceae: { name: '青皮木科', source: 'Wikidata' },
  Adoxaceae: { name: '五福花科', source: 'Wikidata' }
};
const observationFeatureRules = [
  { pattern: /\b(frond|fronds|pinna|pinnae|pinnule|pinnules|leaf|leaves|foliage|blade|blades|microphyll|microphylls|needle|needles)\b/i, label: '叶片形态' },
  { pattern: /\b(flower|flowers|floral|petal|petals|blossom|blossoms|inflorescence|inflorescences|floret|florets|corolla|calyx)\b/i, label: '花与花序' },
  { pattern: /\b(fruit|fruits|berry|berries|seed|seeds|pod|pods|capsule|capsules|nut|nuts|samara|samaras|drupe|drupes)\b/i, label: '果实或种子' },
  { pattern: /\b(stem|stems|shoot|shoots|branch|branches|trunk|trunks|bark|rachis|rachises|rhizome|rhizomes|stipe|stipes|vine|vines|liana|lianas)\b/i, label: '茎干与枝条' },
  { pattern: /\b(strobilus|strobili|sporangium|sporangia|sporocarp|sporocarps|sorus|sori|fertile|synangium|synangia|cone|cones)\b/i, label: '繁殖结构' },
  { pattern: /\b(root|roots|rootstock|rootstocks|tuber|tubers|bulb|bulbs|corm|corms)\b/i, label: '根系或地下器官' },
  { pattern: /\b(spine|spines|thorn|thorns|prickle|prickles)\b/i, label: '刺与防御结构' },
  { pattern: /\b(aquatic|water|wetland|marsh|floating|submerged)\b/i, label: '水生或湿地习性' },
  { pattern: /\b(tree|trees|shrub|shrubs|herb|herbs|climbing|trailing|creeping|rosette)\b/i, label: '整体株形' }
];
const observationTraitRules = [
  { pattern: /\b(bipinnate|tripinnate)\b/i, label: '多回羽状分裂叶' },
  { pattern: /\b(pinnate|pinnae|pinnule|pinnules|frond|fronds)\b/i, label: '羽状叶或蕨叶轮廓' },
  { pattern: /\b(microphyll|microphylls)\b/i, label: '细小微叶' },
  { pattern: /\b(palmate|fan-shaped|umbrella-like)\b/i, label: '掌状或扇形叶片' },
  { pattern: /\b(linear|grass-like|quill-like|needle|needles)\b/i, label: '线形或针状叶' },
  { pattern: /\b(scale-like|scaly)\b/i, label: '鳞片状叶' },
  { pattern: /\b(jointed)\b/i, label: '节状茎' },
  { pattern: /\b(hollow)\b/i, label: '中空茎' },
  { pattern: /\b(woody|trunk|bark)\b/i, label: '木质茎干' },
  { pattern: /\b(leathery|fleshy|succulent|thick)\b/i, label: '革质或肉质叶' },
  { pattern: /\b(lobed|lobes|cleft|split)\b/i, label: '明显裂片或深裂叶' },
  { pattern: /\b(rosette)\b/i, label: '莲座状叶丛' },
  { pattern: /\b(whorl|whorls|whorled)\b/i, label: '轮生枝叶' },
  { pattern: /\b(dichotom|fork|forking|forked)\b/i, label: '二歧或叉状分枝' },
  { pattern: /\b(climbing|twining|vine|vines|liana|lianas)\b/i, label: '攀援或缠绕生长' },
  { pattern: /\b(trailing|creeping|prostrate|sprawling)\b/i, label: '匍匐或横展的茎叶' },
  { pattern: /\b(rhizome|rhizomes|bulb|bulbs|tuber|tubers|corm|corms)\b/i, label: '根茎或地下器官' },
  { pattern: /\b(strobilus|strobili|sporangium|sporangia|sporocarp|sporocarps|sorus|sori|synangium|synangia|cone|cones)\b/i, label: '可见的繁殖结构' },
  { pattern: /\b(flower|flowers|petal|petals|inflorescence|inflorescences|blossom|blossoms)\b/i, label: '花或花序' },
  { pattern: /\b(fruit|fruits|berry|berries|seed|seeds|pod|pods|capsule|capsules|nut|nuts|samara|samaras|drupe|drupes)\b/i, label: '果实或种子' },
  { pattern: /\b(aquatic|water|wetland|marsh|floating|submerged)\b/i, label: '水生或湿地株形' },
  { pattern: /\b(spine|spines|thorn|thorns|prickle|prickles)\b/i, label: '刺或防御结构' }
];
const observationLabelsEn = {
  '叶片形态': 'leaf form',
  '花与花序': 'flowers and inflorescences',
  '果实或种子': 'fruits or seeds',
  '茎干与枝条': 'stems and branching',
  '繁殖结构': 'reproductive structures',
  '根系或地下器官': 'roots or underground organs',
  '刺与防御结构': 'spines and defensive structures',
  '水生或湿地习性': 'aquatic or wetland habit',
  '整体株形': 'overall growth form',
  '多回羽状分裂叶': 'multiply pinnate leaves',
  '羽状叶或蕨叶轮廓': 'pinnate or frond-like outlines',
  '细小微叶': 'small microphylls',
  '掌状或扇形叶片': 'palmate or fan-shaped leaves',
  '线形或针状叶': 'linear or needle-like leaves',
  '鳞片状叶': 'scale-like leaves',
  '节状茎': 'jointed stems',
  '中空茎': 'hollow stems',
  '木质茎干': 'woody stems or trunks',
  '革质或肉质叶': 'leathery or fleshy leaves',
  '明显裂片或深裂叶': 'distinct lobes or deep divisions',
  '莲座状叶丛': 'rosette growth',
  '轮生枝叶': 'whorled branches or leaves',
  '二歧或叉状分枝': 'dichotomous or forked branching',
  '攀援或缠绕生长': 'climbing or twining growth',
  '匍匐或横展的茎叶': 'trailing or spreading stems and leaves',
  '根茎或地下器官': 'rhizomes or other underground organs',
  '可见的繁殖结构': 'visible reproductive structures',
  '花或花序': 'flowers or inflorescences',
  '果实或种子': 'fruits or seeds',
  '水生或湿地株形': 'aquatic or wetland form',
  '刺或防御结构': 'spines or defensive structures'
};

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

function compactSystemName(system) {
  return String(system || '分类体系')
    .replace(' (2016)', '')
    .replace(' (2022)', '');
}

function simplifiedText(value) {
  return toSimplifiedChinese(String(value || ''));
}

function taxonomyLabel(node) {
  if (!node) return '';
  if (node.cnName && node.name) return `${simplifiedText(node.cnName)}（${node.name}）`;
  return simplifiedText(node.cnName || node.name || '');
}

function buildTaxonomyContexts(taxonomy) {
  const nodes = new Map([...taxonomy.nodes, ...taxonomy.families].map(node => [node.id, node]));
  const contexts = new Map();

  taxonomy.families.forEach(family => {
    const lineage = [];
    let current = family;
    while (current) {
      lineage.unshift(current);
      current = current.parent ? nodes.get(current.parent) : null;
    }
    const order = lineage.find(node => node.rank === 'order');
    const classNode = lineage.find(node => node.rank === 'class');
    const division = lineage.find(node => node.rank === 'division');
    contexts.set(family.id, {
      order: taxonomyLabel(order),
      className: taxonomyLabel(classNode),
      division: taxonomyLabel(division),
      orderScientific: order?.name || '',
      classScientific: classNode?.name || '',
      divisionScientific: division?.name || '',
      familyDescription: family.description || ''
    });
  });

  return contexts;
}

function observationEnglish(value) {
  return String(value || '')
    .split('、')
    .map(term => observationLabelsEn[term] || term)
    .filter(Boolean)
    .join(', ');
}

function buildEnglishFields({ record, taxonomyContext, system, scientificName, observationFocus, observationDetail, representative, familyCnName }) {
  const familyName = record.familyName;
  const order = taxonomyContext?.orderScientific || taxonomyContext?.order || record.taxonomyParent || 'the relevant order';
  const higher = [taxonomyContext?.classScientific, taxonomyContext?.divisionScientific].filter(Boolean).join(' and ');
  const focus = observationEnglish(observationFocus) || 'visible plant form';
  const detail = observationEnglish(observationDetail) || focus;
  const sourceDescription = taxonomyContext?.familyDescription || `${familyName} is accepted here as a family-level unit in the atlas taxonomy.`;
  const familyDescriptionEn = `${familyName} is treated here as a living vascular plant family within the ${system} framework. It is placed under ${order}${higher ? `, within ${higher}` : ''}, following the classification backbone recorded for this atlas. ${sourceDescription} The entry uses ${scientificName} as its visual representative and keeps ${detail} visible in the plate. Compare it with neighboring families through ${focus}; this is an illustrated guide for exploration, not a substitute for a full botanical diagnosis or field identification.`;
  const authority = representative?.scientificNameWithAuthority || scientificName;
  const occurrenceCount = representative?.occurrenceCount;
  const occurrenceSummary = Number.isFinite(occurrenceCount)
    ? `The linked GBIF record currently summarizes ${Intl.NumberFormat('en-US').format(occurrenceCount)} occurrences.`
    : 'No occurrence total is attached to this representative record.';
  const selection = representative?.selectionMethod === 'curated_representative_preserved'
    ? 'The existing curated representative has been preserved.'
    : 'The representative follows the atlas selection policy for accepted species.';
  const representativeIntroductionEn = `${scientificName} (${authority}) serves as the representative species for ${familyName}. The illustration presents one complete specimen, retaining ${detail} so that the family can be compared through ${focus}. These visual cues describe the selected species and should not be read as traits shared identically by every member of the family. ${selection} ${occurrenceSummary}`;
  return {
    observationFocusEn: focus,
    observationDetailEn: detail,
    noteEn: `Observation focus: ${detail}. Use ${focus} as a starting point when comparing this representative plate with related families.`,
    familyDescriptionEn,
    representativeIntroductionEn
  };
}

function buildPlacementSentence(system, taxonomyContext) {
  const order = taxonomyContext?.order;
  const higherLineage = [taxonomyContext?.className, taxonomyContext?.division].filter(Boolean);
  if (order) {
    return `在本图谱采用的 ${system} 分类框架中，它归入 ${order}${higherLineage.length ? `；上层分类为${higherLineage.join('、')}` : ''}。`;
  }
  if (higherLineage.length) {
    return `在本图谱采用的 ${system} 分类框架中，它位于${higherLineage.join('、')}。`;
  }
  return `在本图谱中，它按 ${system} 作为独立的科级单元处理。`;
}

function fallbackObservationFocus(system) {
  if (String(system).startsWith('PPG I')) return '叶片形态、茎干与枝条、繁殖结构';
  if (String(system).startsWith('Yang')) return '叶片形态、茎干与枝条、果实或种子';
  return '叶片形态、花与花序、整体株形';
}

function observationFocusFromPrompt(prompt, system) {
  const features = observationFeatureRules
    .filter(rule => rule.pattern.test(prompt))
    .map(rule => rule.label);
  return unique(features).slice(0, 3).join('、') || fallbackObservationFocus(system);
}

function observationDetailFromPrompt(prompt, observationFocus) {
  const positivePrompt = prompt
    .replace(/\b(?:explicitly|clearly)?\s*(?:no|avoid|forbid)\b[^.;]*/gi, '')
    .replace(/\b(?:critical correction is mandatory|takes priority)[^.]*\./gi, '');
  const traits = observationTraitRules
    .filter(rule => rule.pattern.test(positivePrompt))
    .map(rule => rule.label);
  return unique(traits).slice(0, 4).join('、') || observationFocus;
}

function buildObservationNote({ sourceNote, observationFocus, observationDetail, scientificName, familyCnName, familyName }) {
  const familyLabel = familyCnName || familyName;
  if (sourceNote) {
    return `${simplifiedText(sourceNote)} 还可留意${observationDetail}。图像以 ${scientificName} 呈现 ${familyLabel} 的代表形态。`;
  }
  return `观察重点：${observationDetail}；可结合${observationFocus}进行比较。图像以 ${scientificName} 呈现 ${familyLabel} 的代表形态。`;
}

function selectionSummary(selectionMethod) {
  if (selectionMethod === 'curated_representative_preserved') return '该物种沿用图谱既有的代表种选择。';
  if (selectionMethod === 'highest_gbif_occurrence_count') return '该物种按 GBIF 出现记录数从可接受物种中选取。';
  if (selectionMethod === 'manual_current_classification_override') return '该物种经人工确认，以对应本图谱采用的当前分类处理。';
  return '该物种作为本图谱的科级代表记录。';
}

function buildFamilyDescription({
  familyCnName,
  familyName,
  system,
  taxonomyContext,
  scientificName,
  observationFocus,
  observationDetail
}) {
  const familyLabel = familyCnName || familyName;
  const placement = buildPlacementSentence(system, taxonomyContext);
  return `${familyLabel}（${familyName}）${placement}本条目以 ${scientificName} 作为视觉代表，并在完整植株构图中突出${observationDetail}等线索。浏览时可先从${observationFocus}入手，再与同一分类支中的其他科并置比较；这是一则图像导览，不替代野外鉴定或完整的科级形态描述。`;
}

function buildRepresentativeIntroduction({
  displayName,
  scientificName,
  scientificNameWithAuthority,
  familyCnName,
  familyName,
  representative,
  observationFocus,
  observationDetail
}) {
  const familyLabel = familyCnName || familyName;
  const scientificLabel = scientificNameWithAuthority || scientificName;
  const occurrenceCount = representative?.occurrenceCount;
  const occurrenceSummary = Number.isFinite(occurrenceCount)
    ? `GBIF 汇总 ${Intl.NumberFormat('zh-CN').format(occurrenceCount)} 条出现记录。`
    : '该代表记录未附可用的 GBIF 出现计数。';
  return `${displayName}（${scientificLabel}）是${familyLabel}在本图谱中的代表物种。插画以单个完整标本呈现，重点保留${observationDetail}等可见形态，便于从${observationFocus}辨认这张代表图像；这些线索不意味着该科所有物种都具有完全相同的外观。${selectionSummary(representative?.selectionMethod)}${occurrenceSummary}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreChineseName(name, kind) {
  let score = hanCharacters.test(name) ? 100 : 0;
  if (kind === 'family' && /科$/.test(name)) score += 20;
  if (kind === 'species' && !/科$/.test(name)) score += 10;
  if (/^[\u4e00-\u9fff（）()·\-\s]+$/u.test(name)) score += 5;
  return score - name.length / 1000;
}

function chooseChineseName(entries, kind) {
  const candidates = entries
    .filter(entry => chineseLanguage.test(String(entry.language || '')))
    .map(entry => ({
      name: simplifiedText(entry.vernacularName).trim(),
      source: entry.source || 'GBIF Backbone Taxonomy'
    }))
    .filter(candidate => hanCharacters.test(candidate.name));

  const names = unique(candidates.map(candidate => candidate.name));
  const name = names.sort((a, b) => scoreChineseName(b, kind) - scoreChineseName(a, kind))[0] || '';
  return name ? candidates.find(candidate => candidate.name === name) : { name: '', source: null };
}

async function loadVernacularNames(usageKey) {
  if (!usageKey) return { entries: [], source: null };

  let lastError;
  for (let attempt = 1; attempt <= requestAttempts; attempt += 1) {
    try {
      const response = await fetch(`https://api.gbif.org/v1/species/${usageKey}/vernacularNames?limit=300`);
      if (!response.ok) throw new Error(`GBIF request failed with ${response.status}`);
      const body = await response.json();
      const entries = Array.isArray(body.results) ? body.results : [];
      return {
        entries,
        source: entries.find(entry => entry.source)?.source || 'GBIF Backbone Taxonomy'
      };
    } catch (error) {
      lastError = error;
      if (attempt < requestAttempts) {
        await new Promise(resolve => setTimeout(resolve, attempt * 200));
      }
    }
  }

  return { entries: [], source: null, retrievalError: lastError?.message || 'Unknown GBIF error' };
}

async function buildDisplayRecord(record, sourceNote, taxonomyContext, previousRecord) {
  const representative = record.representative || {};
  const shouldFetchSpeciesName = refreshVernacularNames || !previousRecord;
  const shouldFetchFamilyName = refreshVernacularNames || !previousRecord?.familyCnName;
  const [speciesResult, familyResult] = await Promise.all([
    shouldFetchSpeciesName ? loadVernacularNames(representative.gbifKey) : { entries: [], source: null },
    shouldFetchFamilyName ? loadVernacularNames(record.gbifFamily?.usageKey) : { entries: [], source: null }
  ]);
  const speciesName = chooseChineseName(speciesResult.entries, 'species');
  const familyOverride = familyChineseNameOverrides[record.familyName];
  const fetchedFamilyName = chooseChineseName(familyResult.entries, 'family');
  const speciesCnName = simplifiedText(speciesName.name || previousRecord?.speciesCnName || '');
  const fetchedFamilyCnName = fetchedFamilyName.name;
  const familyCnName = simplifiedText(fetchedFamilyCnName || familyOverride?.name || previousRecord?.familyCnName || '');
  const system = compactSystemName(record.taxonomySystem);
  const scientificName = representative.scientificName || record.familyName;
  const displayName = speciesCnName || (familyCnName ? `${familyCnName}代表种` : '科级代表');
  const observationFocus = observationFocusFromPrompt(record.imageGeneration?.prompt || '', record.taxonomySystem);
  const observationDetail = observationDetailFromPrompt(record.imageGeneration?.prompt || '', observationFocus);
  const note = buildObservationNote({
    sourceNote,
    observationFocus,
    observationDetail,
    scientificName,
    familyCnName,
    familyName: record.familyName
  });
  const familyDescription = buildFamilyDescription({
    familyCnName,
    familyName: record.familyName,
    system,
    taxonomyContext,
    scientificName,
    observationFocus,
    observationDetail
  });
  const representativeIntroduction = buildRepresentativeIntroduction({
    displayName,
    scientificName,
    scientificNameWithAuthority: representative.scientificNameWithAuthority,
    familyCnName,
    familyName: record.familyName,
    representative,
    observationFocus,
    observationDetail
  });
  const englishFields = buildEnglishFields({
    record,
    taxonomyContext,
    system,
    scientificName,
    observationFocus,
    observationDetail,
    representative,
    familyCnName
  });

  return {
    familyId: record.familyId,
    familyName: record.familyName,
    familyCnName,
    scientificName,
    speciesCnName,
    displayName,
    displayNameKind: speciesCnName ? 'species' : familyCnName ? 'family-representative' : 'generic-representative',
    observationFocus,
    observationDetail,
    noteKind: sourceNote ? 'source-observation' : 'image-prompt',
    note,
    familyDescription,
    representativeIntroduction,
    ...englishFields,
    sources: {
      speciesCnName: speciesName.source || previousRecord?.sources?.speciesCnName || null,
      familyCnName: fetchedFamilyCnName
        ? fetchedFamilyName.source
        : familyOverride?.source || previousRecord?.sources?.familyCnName || null
    }
  };
}

function buildFallbackRecord(record, sourceNote, taxonomyContext, previousRecord, error) {
  const familyCnName = simplifiedText(previousRecord?.familyCnName || familyChineseNameOverrides[record.familyName]?.name || '');
  const scientificName = record.representative?.scientificName || record.familyName;
  const observationFocus = observationFocusFromPrompt(record.imageGeneration?.prompt || '', record.taxonomySystem);
  const observationDetail = observationDetailFromPrompt(record.imageGeneration?.prompt || '', observationFocus);
  const system = compactSystemName(record.taxonomySystem);
  const displayName = simplifiedText(previousRecord?.displayName || (familyCnName ? `${familyCnName}代表种` : '科级代表'));
  const englishFields = buildEnglishFields({
    record,
    taxonomyContext,
    system,
    scientificName,
    observationFocus,
    observationDetail,
    representative: record.representative,
    familyCnName
  });

  return {
    familyId: record.familyId,
    familyName: record.familyName,
    familyCnName,
    scientificName,
    speciesCnName: simplifiedText(previousRecord?.speciesCnName || ''),
    displayName,
    displayNameKind: previousRecord?.displayNameKind || (familyCnName ? 'family-representative' : 'generic-representative'),
    observationFocus,
    observationDetail,
    noteKind: sourceNote ? 'source-observation' : 'image-prompt',
    note: buildObservationNote({
      sourceNote,
      observationFocus,
      observationDetail,
      scientificName,
      familyCnName,
      familyName: record.familyName
    }),
    familyDescription: buildFamilyDescription({
      familyCnName,
      familyName: record.familyName,
      system,
      taxonomyContext,
      scientificName,
      observationFocus,
      observationDetail
    }),
    representativeIntroduction: buildRepresentativeIntroduction({
      displayName,
      scientificName,
      scientificNameWithAuthority: record.representative?.scientificNameWithAuthority,
      familyCnName,
      familyName: record.familyName,
      representative: record.representative,
      observationFocus,
      observationDetail
    }),
    ...englishFields,
    sources: {
      speciesCnName: previousRecord?.sources?.speciesCnName || null,
      familyCnName: previousRecord?.sources?.familyCnName || familyChineseNameOverrides[record.familyName]?.source || null
    },
    retrievalError: error.message
  };
}

async function mapWithConcurrency(items, mapper, fallback) {
  const output = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        output[index] = await mapper(items[index]);
      } catch (error) {
        output[index] = fallback(items[index], error);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return output;
}

async function main() {
  const taxonomy = readJson(taxonomyPath);
  const representatives = readJson(representativesPath);
  const observationSeeds = readJson(observationSeedsPath);
  const previousRecords = fs.existsSync(outputPath) ? readJson(outputPath).records || [] : [];
  const previousRecordsByFamilyId = new Map(previousRecords.map(record => [record.familyId, record]));
  const taxonomyContexts = buildTaxonomyContexts(taxonomy);
  const sourceNotesByFamily = new Map(observationSeeds.specimens.map(record => [record.family.toLowerCase(), simplifiedText(record.note)]));
  const records = await mapWithConcurrency(
    representatives.representatives,
    record => buildDisplayRecord(
      record,
      sourceNotesByFamily.get(record.familyName.toLowerCase()) || '',
      taxonomyContexts.get(record.familyId),
      previousRecordsByFamilyId.get(record.familyId)
    ),
    (record, error) => buildFallbackRecord(
      record,
      sourceNotesByFamily.get(record.familyName.toLowerCase()) || '',
      taxonomyContexts.get(record.familyId),
      previousRecordsByFamilyId.get(record.familyId),
      error
    )
  );
  const payload = {
    schemaVersion: '1.2.0',
    title: 'Bilingual Display Metadata for Vascular Plant Atlas',
    generatedAt: new Date().toISOString(),
    source: {
      id: 'GBIF_Backbone_Taxonomy',
      url: 'https://api.gbif.org/v1/',
      method: 'Cached Chinese vernacular names supplemented from GBIF when missing; observation focus extracted from each local image prompt'
    },
    summary: {
      totalRecords: records.length,
      speciesChineseNames: records.filter(record => record.speciesCnName).length,
      familyChineseNames: records.filter(record => record.familyCnName).length,
      genericLabels: records.filter(record => record.displayNameKind === 'generic-representative').length,
      sourceObservationNotes: records.filter(record => record.noteKind === 'source-observation').length,
      promptDerivedNotes: records.filter(record => record.noteKind === 'image-prompt').length,
      englishFamilyDescriptions: records.filter(record => record.familyDescriptionEn).length,
      englishRepresentativeIntroductions: records.filter(record => record.representativeIntroductionEn).length
    },
    records
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${records.length} display records to ${path.relative(appRoot, outputPath)}`);
  console.log(JSON.stringify(payload.summary));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
