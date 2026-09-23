# Vascular Plant Atlas

<p>
  <b>Family-level atlas of living vascular plants</b> · 480 families · APG IV / PPG I / gymnosperm frameworks
</p>

<p>
  <a href="README.md">中文</a> ·
  <a href="https://seanwong17.github.io/Vascular-Plant-atlas/"><b>Live demo</b></a>
</p>

## Overview

This static atlas turns 596 taxonomy nodes into a browsable lineage canvas and pairs all 480 living vascular plant families with a representative botanical plate, a detailed Chinese introduction, and a detailed English introduction. The interface includes Chinese / English switching, lineage navigation, taxonomy-system filters, search, zoom controls, family focus details, and a shuffled representative gallery.

The retained project is `Vascular-Plant-atlas`, including its dataset, license, provenance, GitHub Pages workflow, and repository history. The lineage workbench, Chinese display metadata, detail annotations, and data-contract checks were adapted from `Flora-tree`. The bilingual fields and language-switching pattern were informed by `Chordata-atlas`; animal-specific timeline features were intentionally excluded.

![Desktop lineage workbench](docs/screenshots/atlas-desktop.png)

Mobile English detail view: ![Mobile English detail](docs/screenshots/atlas-mobile-en.png)

## Data and scripts

```text
assets/images/                     480 normalized 800 × 600 WebP botanical plates
data/taxonomy.json                 Taxonomy nodes and sources
data/family_representatives.json   Family representatives and image records
data/specimens.json                Curated observation records
data/images_manifest.json          Image manifest
data/display_metadata.json         Chinese and English family introductions and observations
src/app.js                         Lineage canvas, detail panel, search, and bilingual UI
src/styles.css                     Workbench and responsive styles
scripts/build-display-metadata.js  Generate or update display metadata
scripts/validate-atlas.mjs         Integrity validation
tests/data-contract.test.js        Data-contract tests
```

```bash
npm install
npm start
# open http://localhost:4173

npm run check
npm run data:display
```

The illustrations support educational browsing and morphology comparison. They are not substitutes for specimens, original photographs, specialist plates, or field identification references.

## Sources

- [APG IV (2016)](https://doi.org/10.1111/boj.12385): angiosperms
- [PPG I (2016)](https://doi.org/10.1111/jse.12229): lycophytes and ferns
- [Yang et al. (2022)](https://doi.org/10.1016/j.pld.2022.05.003): gymnosperms
- [GBIF Backbone Taxonomy](https://www.gbif.org/dataset/d7dddbf4-2cf0-4f39-9b2a-bb099caae36c): representative selection and species checks

Full provenance and selection methods are retained in `data/family_representatives.json` and `data/taxonomy.json`.

## License

Code, curated data, and project images are released under [CC BY-NC-SA 4.0](LICENSE). Please retain attribution to Sean Wong and follow the non-commercial, share-alike terms.
