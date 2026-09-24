(() => {
  'use strict';

  const DATA_PREFIX = './';
  const ASSET_PREFIX = './';
  const ROOT_ID = 'tracheophyta';
  const GROUP_ROOTS = {
    all: ROOT_ID,
    pteridophyta: 'clade-Pteridophyta',
    gymnosperms: 'clade-Gymnospermae',
    angiosperms: 'clade-Angiospermae'
  };
  const RANK_ORDER = ['clade', 'division', 'class', 'subclass', 'superorder', 'order', 'family'];
  const RANK_LABELS = {
    clade: '类群',
    division: '植物门',
    class: '植物纲',
    subclass: '亚纲',
    superorder: '总目',
    order: '植物目',
    family: '植物科',
    cluster: '待展开分支'
  };
  const RANK_LABELS_EN = {
    clade: 'clade', division: 'division', class: 'class', subclass: 'subclass',
    superorder: 'superorder', order: 'order', family: 'family', cluster: 'collapsed branch'
  };
  const UI_COPY = {
    zh: {
      brandKicker: 'LIVING VASCULAR PLANTS', brandName: '植系图谱', brandSubtitle: 'Flora Atlas',
      headerDescription: '从石松到被子植物，循着 596 个分类节点浏览现生维管植物。', searchLabel: '检索',
      taxonomyEyebrow: 'TAXONOMY EXPLORER', taxonomyTitle: '维管植物的现生分支',
      systemAll: '全部谱系', systemPteridophyta: '石松与蕨类', systemGymnosperms: '裸子植物', systemAngiosperms: '被子植物',
      treeLabel: '谱系画布', treeTitle: '从根系进入一个分支', fitTree: '适配', legendBranch: '主要分支', legendFamily: '植物科', legendCluster: '待展开',
      treeEmpty: '此分支没有可展示的下级分类。', canvasHint: '拖拽浏览，滚轮缩放。点击分类节点进入分支，点击家族节点查看代表种。', familyFocus: 'FAMILY FOCUS',
      imageCaption: '代表性自然史插画', familySummary: '科简介', observationLabel: '观察要点', representativeLabel: '代表物种介绍',
      factRepresentative: '代表种', factPath: '分类路径', factGbif: 'GBIF 记录', locateFamily: '在图谱中定位',
      galleryEyebrow: 'LIVING PLANT INDEX', galleryTitle: '480 个科级代表', shuffleGallery: '随机换一组',
      galleryDisclaimer: '插画为各科代表种的生成式自然史图像，不作野外鉴定依据。', sourcesEyebrow: 'CLASSIFICATION SOURCES',
      sourcesTitle: '三个体系，一张可行走的植物谱系', aboutEyebrow: 'ABOUT THE ATLAS', aboutTitle: '数据、图像与使用方式',
      aboutData: '本图谱内置 data/ 数据集：480 个现生维管植物科被组织进 APG IV、PPG I 与 Yang 等人的裸子植物分类骨架。',
      aboutTree: '画布先呈现可扫描的高层分支；进入任一节点后会展开其下的分类关系。右侧焦点面板和代表切片均来自数据中的代表物种记录。',
      aboutImages: '所有图像是 GPT Image 2 生成的自然史插画。它们用于帮助浏览形态和类群，不应替代专业分类或野外鉴定资料。', loading: '正在整理植物谱系', moreLink: '更多', footerDisclaimer: '本站内容仅供学习交流使用。转载内容版权归原著作权人所有，未经许可不得用于商业用途。如存在侵权内容，请联系站长，核实后将及时删除。访问本站即表示知悉并同意本声明。', footerLicense: '图像用于教育性浏览和形态参考，不替代标本、原始照片、专业植物学图版或野外鉴定资料。遵循 CC BY-NC-SA 4.0 协议，感谢 Sean Wong 的开源。'
    },
    en: {
      brandKicker: 'LIVING VASCULAR PLANTS', brandName: 'Flora Atlas', brandSubtitle: 'Vascular Plant Families',
      headerDescription: 'Trace living vascular plants from lycophytes to angiosperms across 596 connected taxonomy nodes.', searchLabel: 'SEARCH',
      taxonomyEyebrow: 'TAXONOMY EXPLORER', taxonomyTitle: 'Living branches of vascular plants',
      systemAll: 'All lineages', systemPteridophyta: 'Lycophytes and ferns', systemGymnosperms: 'Gymnosperms', systemAngiosperms: 'Angiosperms',
      treeLabel: 'LINEAGE CANVAS', treeTitle: 'Enter a branch from the root', fitTree: 'Fit', legendBranch: 'Major branch', legendFamily: 'Family', legendCluster: 'Collapsed',
      treeEmpty: 'This branch has no lower classifications to display.', canvasHint: 'Drag to browse and scroll to zoom. Select a branch to enter it or a family to view its representative.', familyFocus: 'FAMILY FOCUS',
      imageCaption: 'Representative natural-history plate', familySummary: 'Family introduction', observationLabel: 'Observation focus', representativeLabel: 'Representative species',
      factRepresentative: 'Representative', factPath: 'Taxonomic path', factGbif: 'GBIF record', locateFamily: 'Locate in lineage',
      galleryEyebrow: 'LIVING PLANT INDEX', galleryTitle: '480 family representatives', shuffleGallery: 'Shuffle gallery',
      galleryDisclaimer: 'Generated natural-history illustrations support browsing and are not field-identification references.', sourcesEyebrow: 'CLASSIFICATION SOURCES',
      sourcesTitle: 'Three systems, one walkable plant lineage', aboutEyebrow: 'ABOUT THE ATLAS', aboutTitle: 'Data, images, and use',
      aboutData: 'This atlas bundles the data/ dataset: 480 living vascular plant families organized through APG IV, PPG I, and the Yang gymnosperm framework.',
      aboutTree: 'The canvas starts with scannable high-level branches and expands as you enter them. The focus panel and representative slices are drawn from the same family records.',
      aboutImages: 'All plates are GPT Image 2 generated natural-history illustrations for browsing morphology, not a substitute for professional classification or field guides.', loading: 'Organizing the plant lineage', moreLink: 'More', footerDisclaimer: 'This site is for learning and exchange only. Copyright of reproduced content belongs to the original copyright holders; it may not be used commercially without permission. If any content infringes rights, please contact the webmaster; verified cases will be removed promptly. Accessing this site indicates acknowledgment and acceptance of this notice.', footerLicense: 'Images are for educational browsing and morphological reference only; they do not replace specimens, original photographs, professional botanical plates, or field identification resources. Licensed under CC BY-NC-SA 4.0. Thanks to Sean Wong for open-sourcing this work.'
    }
  };

  // 百度统计
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?bc97d1345447857f935b5aa21deb0125";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
  })();

  const state = {
    language: 'zh',
    taxonomy: null,
    nodeById: new Map(),
    familyByName: new Map(),
    representativeByFamilyId: new Map(),
    imageByFamilyName: new Map(),
    displayByFamilyId: new Map(),
    focusId: ROOT_ID,
    selectedFamilyId: null,
    activeSystem: 'all',
    gallery: {
      offset: 0,
      order: []
    },
    searchResults: [],
    tree: {
      svg: null,
      zoom: null,
      zoomLayer: null,
      baseLayer: null,
      content: null,
      layout: null
    }
  };

  const dom = {};

  document.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    bootstrap().catch(showFatalError);
  });

  function cacheDom() {
    [
      'taxon-search', 'clear-search', 'search-results', 'about-button', 'about-dialog', 'close-about', 'language-zh', 'language-en',
      'dataset-metrics', 'system-tabs', 'breadcrumb', 'lineage-tree', 'tree-canvas', 'tree-tooltip',
      'tree-empty', 'zoom-in', 'zoom-out', 'fit-tree', 'detail-system', 'detail-image',
      'detail-image-caption', 'detail-rank', 'detail-title', 'detail-latin', 'detail-description',
      'detail-observation', 'detail-representative-intro', 'detail-representative', 'detail-path', 'detail-occurrences', 'locate-family', 'specimen-gallery',
      'gallery-status', 'shuffle-gallery', 'source-list', 'loading-screen', 'tree-context'
    ].forEach(id => {
      dom[id] = document.getElementById(id);
    });
  }

  async function bootstrap() {
    if (typeof window.d3 === 'undefined') {
      throw new Error('D3 未能加载，无法绘制分类关系。');
    }

    const [taxonomy, representatives, manifest, displayMetadata] = await Promise.all([
      loadJson('data/taxonomy.json'),
      loadJson('data/family_representatives.json'),
      loadJson('data/images_manifest.json'),
      loadJson('data/display_metadata.json')
    ]);

    buildDataModel(taxonomy, representatives, manifest, displayMetadata);
    bindEvents();
    updateLanguageCopy();
    renderMetrics();
    renderSources();

    const defaultFamily = state.nodeById.get('family-Orchidaceae') || state.taxonomy.families[0];
    state.selectedFamilyId = defaultFamily?.id || null;
    renderDetail();
    renderTree();
    renderGallery();
    hideLoading();
  }

  async function loadJson(filename) {
    const response = await fetch(`${DATA_PREFIX}${filename}`);
    if (!response.ok) throw new Error(`无法读取 ${filename} (${response.status})`);
    return response.json();
  }

  function buildDataModel(taxonomy, representatives, manifest, displayMetadata) {
    const sourceNodes = [...taxonomy.nodes, ...taxonomy.families];
    const ids = new Set();

    sourceNodes.forEach(rawNode => {
      if (!rawNode.id || ids.has(rawNode.id)) {
        throw new Error('分类数据包含缺失或重复的节点 ID。');
      }
      ids.add(rawNode.id);
      state.nodeById.set(rawNode.id, { ...rawNode, children: [], familyCount: 0 });
    });

    for (const node of state.nodeById.values()) {
      if (!node.parent) continue;
      const parent = state.nodeById.get(node.parent);
      if (!parent) throw new Error(`${node.name} 缺少父级分类。`);
      parent.children.push(node);
    }

    const root = state.nodeById.get(ROOT_ID);
    if (!root) throw new Error('分类数据缺少维管植物根节点。');

    for (const node of state.nodeById.values()) {
      node.children.sort(compareNodes);
      if (node.rank === 'family') state.familyByName.set(node.name.toLowerCase(), node);
    }

    calculateFamilyCounts(root);

    representatives.representatives.forEach(record => {
      state.representativeByFamilyId.set(record.familyId, record);
    });
    Object.entries(manifest.images || {}).forEach(([familyName, image]) => {
      state.imageByFamilyName.set(familyName.toLowerCase(), image);
    });
    (displayMetadata.records || []).forEach(record => {
      state.displayByFamilyId.set(record.familyId, record);
    });

    state.taxonomy = taxonomy;
    resetGalleryOrder();
  }

  function compareNodes(a, b) {
    const rankDifference = rankValue(a.rank) - rankValue(b.rank);
    return rankDifference || a.name.localeCompare(b.name);
  }

  function rankValue(rank) {
    const index = RANK_ORDER.indexOf(rank);
    return index === -1 ? RANK_ORDER.length : index;
  }

  function calculateFamilyCounts(node) {
    if (!node.children.length) {
      node.familyCount = node.rank === 'family' ? 1 : 0;
      return node.familyCount;
    }
    node.familyCount = node.children.reduce((total, child) => total + calculateFamilyCounts(child), 0);
    return node.familyCount;
  }

  function bindEvents() {
    dom['system-tabs'].addEventListener('click', event => {
      const button = event.target.closest('[data-system]');
      if (!button) return;
      state.activeSystem = button.dataset.system;
      focusNode(GROUP_ROOTS[state.activeSystem]);
    });

    dom['zoom-in'].addEventListener('click', () => zoomBy(1.25));
    dom['zoom-out'].addEventListener('click', () => zoomBy(0.8));
    dom['fit-tree'].addEventListener('click', fitTree);
    dom['locate-family'].addEventListener('click', locateSelectedFamily);
    dom['shuffle-gallery'].addEventListener('click', showNextGallerySet);

    dom['taxon-search'].addEventListener('input', event => {
      const query = event.target.value.trim();
      dom['clear-search'].hidden = !query;
      renderSearchResults(query);
    });
    dom['taxon-search'].addEventListener('keydown', event => {
      if (event.key === 'Escape') clearSearch();
      if (event.key === 'Enter' && state.searchResults.length) {
        event.preventDefault();
        activateSearchResult(state.searchResults[0]);
      }
    });
    dom['clear-search'].addEventListener('click', clearSearch);
    dom['search-results'].addEventListener('click', event => {
      const button = event.target.closest('[data-result-index]');
      if (!button) return;
      activateSearchResult(state.searchResults[Number(button.dataset.resultIndex)]);
    });

    dom['about-button'].addEventListener('click', () => dom['about-dialog'].showModal());
    dom['language-zh'].addEventListener('click', () => setLanguage('zh'));
    dom['language-en'].addEventListener('click', () => setLanguage('en'));
    dom['close-about'].addEventListener('click', () => dom['about-dialog'].close());
    dom['about-dialog'].addEventListener('click', event => {
      if (event.target === dom['about-dialog']) dom['about-dialog'].close();
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.search-field')) closeSearchResults();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && dom['about-dialog'].open) dom['about-dialog'].close();
    });

    const observer = new ResizeObserver(() => {
      window.clearTimeout(state.resizeTimer);
      state.resizeTimer = window.setTimeout(() => renderTree(), 120);
    });
    observer.observe(dom['tree-canvas']);
  }

  function setLanguage(language) {
    if (language !== 'zh' && language !== 'en') return;
    state.language = language;
    updateLanguageCopy();
    renderMetrics();
    renderSources();
    renderDetail();
    renderTree();
    renderGallery();
  }

  function updateLanguageCopy() {
    const copy = UI_COPY[state.language];
    document.documentElement.lang = state.language === 'en' ? 'en' : 'zh-CN';
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const value = copy[node.dataset.i18n];
      if (value !== undefined) node.textContent = value;
    });
    dom['language-zh'].classList.toggle('is-active', state.language === 'zh');
    dom['language-en'].classList.toggle('is-active', state.language === 'en');
    dom['language-zh'].setAttribute('aria-pressed', String(state.language === 'zh'));
    dom['language-en'].setAttribute('aria-pressed', String(state.language === 'en'));
    dom['taxon-search'].placeholder = state.language === 'en'
      ? 'Family, representative species, or scientific name'
      : '科名、代表种或中文名';
    dom['about-button'].title = state.language === 'en' ? 'Data and methods' : '数据与方法';
    dom['about-button'].setAttribute('aria-label', dom['about-button'].title);
  }

  function renderMetrics() {
    const meta = state.taxonomy.meta;
    const labels = state.language === 'en' ? ['families', 'nodes', 'systems'] : ['科', '节点', '分类体系'];
    dom['dataset-metrics'].replaceChildren(
      metric(`${meta.totalFamilies}`, labels[0]),
      metric(`${meta.totalNodes}`, labels[1]),
      metric(`${Object.keys(meta.systems).length}`, labels[2])
    );
  }

  function metric(value, label) {
    const wrapper = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = value;
    wrapper.append(strong, document.createTextNode(label));
    return wrapper;
  }

  function renderSources() {
    const fragment = document.createDocumentFragment();
    state.taxonomy.meta.sources.forEach(source => {
      const item = document.createElement('article');
      item.className = 'source-item';
      const title = document.createElement('strong');
      title.textContent = source.id;
      const scope = document.createElement('span');
      scope.textContent = `${source.year} · ${source.scope}`;
      const detail = document.createElement('small');
      detail.textContent = state.language === 'en'
        ? `${source.orders} orders · ${source.families} families`
        : `${source.orders} 目 · ${source.families} 科`;
      item.append(title, scope, detail);
      fragment.append(item);
    });
    dom['source-list'].replaceChildren(fragment);
  }

  function renderTree() {
    const focus = state.nodeById.get(state.focusId) || state.nodeById.get(ROOT_ID);
    const displayTree = createDisplayTree(focus);
    renderBreadcrumb(focus);
    syncSystemTabs(focus);
    dom['tree-context'].textContent = `${displayName(focus)} · ${familyCountLabel(focus.familyCount)}`;

    const canvasBounds = dom['tree-canvas'].getBoundingClientRect();
    const width = Math.max(300, Math.floor(canvasBounds.width));
    const height = Math.max(470, Math.floor(canvasBounds.height));
    const svg = d3.select(dom['lineage-tree'])
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    svg.selectAll('*').remove();

    const root = d3.hierarchy(displayTree);
    if (root.descendants().length <= 1) {
      dom['tree-empty'].hidden = false;
      return;
    }
    dom['tree-empty'].hidden = true;

    const leaves = Math.max(root.leaves().length, 1);
    const isCompactCanvas = width < 560;
    const verticalSpacing = leaves > 45 ? 24 : leaves > 22 ? 31 : 43;
    const horizontalSpacing = isCompactCanvas ? 142 : 180;
    const treeLayout = d3.tree().nodeSize([verticalSpacing, horizontalSpacing]);
    treeLayout(root);

    const descendants = root.descendants();
    const minX = d3.min(descendants, node => node.x) || 0;
    const maxX = d3.max(descendants, node => node.x) || 0;
    const maxY = d3.max(descendants, node => node.y) || 0;
    const padding = isCompactCanvas
      ? { top: 34, right: 168, bottom: 34, left: 86 }
      : { top: 42, right: 235, bottom: 42, left: 120 };
    const contentWidth = padding.left + maxY + padding.right;
    const contentHeight = padding.top + (maxX - minX) + padding.bottom;

    const zoomLayer = svg.append('g').attr('class', 'zoom-layer');
    const baseLayer = zoomLayer.append('g')
      .attr('class', 'tree-base-layer')
      .attr('transform', `translate(${padding.left},${padding.top - minX})`);

    baseLayer.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal().x(link => link.y).y(link => link.x));

    const nodeGroups = baseLayer.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(descendants)
      .join('g')
      .attr('class', node => nodeClasses(node.data))
      .attr('transform', node => `translate(${node.y},${node.x})`)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', node => nodeAriaLabel(node.data));

    nodeGroups.append('circle')
      .attr('class', 'node-dot')
      .attr('r', node => nodeRadius(node.data));

    nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('x', node => node.children ? -11 : 11)
      .attr('y', -3)
      .attr('text-anchor', node => node.children ? 'end' : 'start')
      .text(node => truncate(displayName(node.data), 28));

    nodeGroups.append('text')
      .attr('class', 'node-caption')
      .attr('x', node => node.children ? -11 : 11)
      .attr('y', 12)
      .attr('text-anchor', node => node.children ? 'end' : 'start')
      .text(node => truncate(nodeCaption(node.data), 36));

    nodeGroups
      .on('click', (_, node) => handleTreeNode(node.data))
      .on('keydown', (event, node) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleTreeNode(node.data);
        }
      })
      .on('pointermove', (event, node) => showTooltip(event, node.data))
      .on('pointerleave', hideTooltip);

    const zoom = d3.zoom()
      .scaleExtent([0.28, 3.5])
      .on('zoom', event => zoomLayer.attr('transform', event.transform));
    svg.call(zoom).on('dblclick.zoom', null);

    state.tree = {
      svg,
      zoom,
      zoomLayer,
      baseLayer,
      layout: { width, height, contentWidth, contentHeight }
    };
    fitTree();
  }

  function createDisplayTree(focus) {
    const maxDepth = visibleDepthFor(focus);
    return cloneForDisplay(focus, 0, maxDepth);
  }

  function visibleDepthFor(node) {
    if (node.id === ROOT_ID) return 2;
    if (node.familyCount > 180) return 3;
    if (node.familyCount > 55) return 4;
    return 12;
  }

  function cloneForDisplay(source, depth, maxDepth) {
    if (source.children.length && depth >= maxDepth) {
      return {
        id: `cluster:${source.id}`,
        source,
        rank: 'cluster',
        isCluster: true,
        clusterFor: source.id,
        familyCount: source.familyCount,
        name: source.name,
        cnName: source.cnName,
        children: []
      };
    }
    return {
      ...source,
      source,
      children: source.children.map(child => cloneForDisplay(child, depth + 1, maxDepth))
    };
  }

  function nodeClasses(node) {
    const raw = node.source || node;
    const selected = raw.id === state.selectedFamilyId ? ' is-selected' : '';
    return `node-group node-${node.rank || raw.rank}${selected}`;
  }

  function nodeRadius(node) {
    if (node.isCluster) return 8;
    if (node.rank === 'family') return 5;
    return node.children?.length ? 7 : 5;
  }

  function nodeAriaLabel(node) {
    const raw = node.source || node;
    const action = node.isCluster || raw.children?.length
      ? (state.language === 'en' ? 'Enter branch' : '进入分支')
      : (state.language === 'en' ? 'View representative' : '查看代表种');
    return `${action}：${displayName(node)}`;
  }

  function nodeCaption(node) {
    const raw = node.source || node;
    if (node.isCluster) return state.language === 'en'
      ? `${raw.familyCount} families, click to expand`
      : `${raw.familyCount} 科，点击展开`;
    if (raw.rank === 'family') {
      return state.representativeByFamilyId.get(raw.id)?.representative?.scientificName
        || (state.language === 'en' ? 'Representative record' : '代表种资料');
    }
    return `${rankLabel(raw.rank)} · ${familyCountLabel(raw.familyCount)}`;
  }

  function handleTreeNode(node) {
    const raw = node.source || node;
    if (node.isCluster || raw.children?.length) {
      focusNode(node.clusterFor || raw.id);
      return;
    }
    if (raw.rank === 'family') {
      selectFamily(raw.id);
    }
  }

  function focusNode(id, options = {}) {
    const target = state.nodeById.get(id);
    if (!target) return;
    state.focusId = target.id;
    state.activeSystem = systemForNode(target);
    renderTree();
    if (options.scroll) {
      dom['tree-canvas'].scrollIntoView({ behavior: preferredScrollBehavior(), block: 'center' });
    }
  }

  function systemForNode(node) {
    const ids = new Set(pathToRoot(node).map(item => item.id));
    if (ids.has(GROUP_ROOTS.pteridophyta)) return 'pteridophyta';
    if (ids.has(GROUP_ROOTS.gymnosperms)) return 'gymnosperms';
    if (ids.has(GROUP_ROOTS.angiosperms)) return 'angiosperms';
    return 'all';
  }

  function syncSystemTabs() {
    dom['system-tabs'].querySelectorAll('[data-system]').forEach(button => {
      const active = button.dataset.system === state.activeSystem;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }

  function renderBreadcrumb(focus) {
    const fragment = document.createDocumentFragment();
    pathToRoot(focus).forEach(node => {
      const crumb = document.createElement('button');
      crumb.type = 'button';
      crumb.className = 'crumb';
      crumb.textContent = displayName(node);
      crumb.title = node.name;
      crumb.addEventListener('click', () => focusNode(node.id));
      fragment.append(crumb);
    });
    dom.breadcrumb.replaceChildren(fragment);
  }

  function pathToRoot(node) {
    const path = [];
    let current = node;
    while (current) {
      path.unshift(current);
      current = current.parent ? state.nodeById.get(current.parent) : null;
    }
    return path;
  }

  function zoomBy(factor) {
    if (!state.tree.svg || !state.tree.zoom) return;
    state.tree.svg.transition().duration(180).call(state.tree.zoom.scaleBy, factor);
  }

  function fitTree() {
    const { svg, zoom, layout } = state.tree;
    if (!svg || !zoom || !layout) return;
    const scale = Math.max(0.28, Math.min(1.15, Math.min(
      (layout.width - 36) / layout.contentWidth,
      (layout.height - 36) / layout.contentHeight
    )));
    const x = (layout.width - layout.contentWidth * scale) / 2;
    const y = (layout.height - layout.contentHeight * scale) / 2;
    svg.call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  }

  function showTooltip(event, node) {
    const raw = node.source || node;
    const bounds = dom['tree-canvas'].getBoundingClientRect();
    const x = Math.min(bounds.width - 250, Math.max(8, event.clientX - bounds.left + 14));
    const y = Math.min(bounds.height - 72, Math.max(8, event.clientY - bounds.top + 14));
    dom['tree-tooltip'].replaceChildren(
      element('strong', displayName(node)),
      element('span', nodeCaption(node))
    );
    dom['tree-tooltip'].style.left = `${x}px`;
    dom['tree-tooltip'].style.top = `${y}px`;
    dom['tree-tooltip'].setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    dom['tree-tooltip'].setAttribute('aria-hidden', 'true');
  }

  function selectFamily(familyId, options = {}) {
    const family = state.nodeById.get(familyId);
    if (!family || family.rank !== 'family') return;
    state.selectedFamilyId = familyId;
    renderDetail();
    renderTree();
    if (options.scroll) {
      dom['detail-title'].scrollIntoView({ behavior: preferredScrollBehavior(), block: 'center' });
    }
  }

  function renderDetail() {
    const family = state.nodeById.get(state.selectedFamilyId) || state.taxonomy.families[0];
    if (!family) return;
    const representative = state.representativeByFamilyId.get(family.id);
    const displayMeta = state.displayByFamilyId.get(family.id);
    const image = imageForFamily(family);
    const isEnglish = state.language === 'en';
    const display = isEnglish ? family.name : displayMeta?.familyCnName || displayName(family);
    const latin = family.name;
    const representativeScientificName = displayMeta?.scientificName || representative?.representative?.scientificName;
    const representativeLabel = isEnglish
      ? representativeScientificName || 'Representative species not provided'
      : displayMeta?.speciesCnName
      ? `${displayMeta.speciesCnName} · ${representativeScientificName}`
      : representativeScientificName || '未提供代表种';
    const occurrenceCount = representative?.representative?.occurrenceCount;
    const description = isEnglish
      ? displayMeta?.familyDescriptionEn || family.description || `${family.name} is included in the ${family.system} vascular plant backbone.`
      : displayMeta?.familyDescription || (family.description && !family.description.startsWith(family.name)
      ? family.description
      : `${family.name} 收录于 ${family.system} 的现生维管植物分类骨架。`);
    const observation = isEnglish
      ? displayMeta?.noteEn || `Observe the representative form of ${representativeScientificName || family.name}.`
      : displayMeta?.note || `观察 ${representativeScientificName || family.name} 的代表形态。`;
    const representativeIntroduction = isEnglish
      ? displayMeta?.representativeIntroductionEn || `${representativeScientificName || family.name} is the representative species for ${family.name}.`
      : displayMeta?.representativeIntroduction || `${representativeScientificName || family.name} 被选作 ${display} 的代表物种。`;

    dom['detail-system'].textContent = compactSystemName(family.system);
    dom['detail-rank'].textContent = rankLabel(family.rank);
    dom['detail-title'].textContent = display;
    dom['detail-latin'].textContent = latin;
    dom['detail-description'].textContent = description;
    dom['detail-observation'].textContent = observation;
    dom['detail-representative-intro'].textContent = representativeIntroduction;
    dom['detail-representative'].textContent = representativeLabel;
    dom['detail-path'].textContent = pathToRoot(family).map(displayName).join(' / ');
    dom['detail-occurrences'].textContent = Number.isFinite(occurrenceCount)
      ? (isEnglish ? `${Intl.NumberFormat('en-US').format(occurrenceCount)} occurrences` : `${Intl.NumberFormat('zh-CN').format(occurrenceCount)} 条记录`)
      : (isEnglish ? 'Recorded, count unavailable' : '已收录，未提供统计');
    dom['detail-image-caption'].textContent = isEnglish
      ? representativeScientificName || 'Representative natural-history plate'
      : displayMeta?.displayName || representativeScientificName || '代表性自然史插画';
    setImage(dom['detail-image'], image, imageForFamily(family, true), isEnglish ? `${display} representative natural-history plate` : `${display} 的代表性自然史插画`);
  }

  function imageForFamily(family, fallbackOnly = false) {
    const representative = state.representativeByFamilyId.get(family.id);
    const manifestImage = state.imageByFamilyName.get(family.name.toLowerCase());
    const relativePath = fallbackOnly ? manifestImage : representative?.image || manifestImage;
    if (!relativePath) return '';
    return relativePath.startsWith('assets/') ? `${ASSET_PREFIX}${relativePath}` : `${DATA_PREFIX}${relativePath}`;
  }

  function setImage(imageElement, source, fallback, alt) {
    imageElement.alt = alt;
    imageElement.onerror = () => {
      imageElement.onerror = null;
      if (fallback && imageElement.src !== new URL(fallback, window.location.href).href) {
        imageElement.src = fallback;
      } else {
        imageElement.removeAttribute('src');
      }
    };
    if (source) imageElement.src = source;
  }

  function locateSelectedFamily() {
    const family = state.nodeById.get(state.selectedFamilyId);
    if (!family) return;
    focusNode(family.parent || ROOT_ID, { scroll: true });
  }

  function galleryItems() {
    return state.taxonomy.families;
  }

  function resetGalleryOrder() {
    const count = galleryItems().length;
    state.gallery.offset = 0;
    state.gallery.order = Array.from({ length: count }, (_, index) => index);
    for (let index = state.gallery.order.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [state.gallery.order[index], state.gallery.order[randomIndex]] = [state.gallery.order[randomIndex], state.gallery.order[index]];
    }
  }

  function showNextGallerySet() {
    const source = galleryItems();
    const pageSize = Math.min(8, source.length);
    if (!pageSize) return;
    if (state.gallery.offset + pageSize >= source.length) {
      resetGalleryOrder();
    } else {
      state.gallery.offset += pageSize;
    }
    renderGallery();
  }

  function renderGallery() {
    const source = galleryItems();
    const count = Math.min(8, source.length);
    if (state.gallery.order.length !== source.length) resetGalleryOrder();
    const selected = Array.from({ length: count }, (_, index) => {
      return source[state.gallery.order[(state.gallery.offset + index) % source.length]];
    });
    const fragment = document.createDocumentFragment();
    selected.forEach(family => fragment.append(createFamilyCard(family)));
    dom['specimen-gallery'].replaceChildren(fragment);
    dom['gallery-status'].textContent = state.language === 'en'
      ? `Random selection ${selected.length} / ${source.length} families`
      : `随机展示 ${selected.length} / ${source.length} 个科级代表`;
  }

  function createFamilyCard(family) {
    const displayMeta = state.displayByFamilyId.get(family.id);
    const representative = state.representativeByFamilyId.get(family.id)?.representative;
    const scientificName = displayMeta?.scientificName || representative?.scientificName || family.name;
    const familyLabel = state.language === 'en'
      ? family.name
      : displayMeta?.familyCnName ? `${displayMeta.familyCnName} · ${family.name}` : family.name;
    return createGalleryCard({
      family,
      label: compactSystemName(family.system),
      title: state.language === 'en' ? family.name : displayMeta?.displayName || `${family.name} 代表种`,
      scientificName: `${scientificName} · ${familyLabel}`,
      note: state.language === 'en'
        ? displayMeta?.representativeIntroductionEn || `${family.name} representative plate.`
        : displayMeta?.note || `${family.name} 的科级代表图像。`,
      source: imageForFamily(family)
    });
  }

  function createGalleryCard({ family, label, title, scientificName, note, source }) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'specimen-card';
    card.setAttribute('aria-label', state.language === 'en' ? `View ${title}` : `查看 ${title}`);

    const image = document.createElement('img');
    image.loading = 'lazy';
    image.alt = state.language === 'en' ? `${title} natural-history plate` : `${title} 的自然史插画`;
    const fallback = family ? imageForFamily(family) : '';
    setImage(image, source || fallback, fallback, image.alt);

    const copy = document.createElement('span');
    copy.className = 'specimen-card-copy';
    copy.append(
      element('small', label),
      element('strong', title),
      element('em', scientificName),
      element('span', note)
    );
    card.append(image, copy);
    card.addEventListener('click', () => {
      if (family) selectFamily(family.id, { scroll: true });
    });
    return card;
  }

  function renderSearchResults(query) {
    if (!query) {
      closeSearchResults();
      return;
    }
    const normalized = query.toLocaleLowerCase();
    const matches = [];
    for (const node of state.nodeById.values()) {
      const representative = state.representativeByFamilyId.get(node.id)?.representative;
      const displayMeta = state.displayByFamilyId.get(node.id);
      const haystack = [
        node.name,
        node.cnName,
        node.rank,
        representative?.scientificName,
        displayMeta?.familyCnName,
        displayMeta?.speciesCnName,
        displayMeta?.displayName
      ].filter(Boolean).join(' ').toLocaleLowerCase();
      if (haystack.includes(normalized)) matches.push({ type: 'node', node });
    }

    state.searchResults = deduplicateSearchResults(matches).slice(0, 7);
    const fragment = document.createDocumentFragment();
    state.searchResults.forEach((match, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result';
      button.dataset.resultIndex = String(index);
      button.setAttribute('role', 'option');
      const main = document.createElement('span');
      const title = document.createElement('strong');
      const secondary = document.createElement('small');
      const displayMeta = state.displayByFamilyId.get(match.node.id);
      const label = match.node.rank === 'family'
        ? (state.language === 'en' ? match.node.name : displayMeta?.familyCnName || displayName(match.node))
        : displayName(match.node);
      title.textContent = label;
      secondary.textContent = `${rankLabel(match.node.rank)} · ${match.node.name}`;
      main.append(title, secondary);
      button.append(main, element('em', state.language === 'en' ? 'TAXON' : '分类'));
      fragment.append(button);
    });
    dom['search-results'].replaceChildren(fragment);
    dom['search-results'].classList.toggle('is-open', state.searchResults.length > 0);
    dom['taxon-search'].setAttribute('aria-expanded', String(state.searchResults.length > 0));
  }

  function deduplicateSearchResults(matches) {
    const seen = new Set();
    return matches.filter(match => {
      const key = `node:${match.node.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => {
      const aFamily = a.node.rank === 'family' ? 0 : 1;
      const bFamily = b.node.rank === 'family' ? 0 : 1;
      return aFamily - bFamily;
    });
  }

  function activateSearchResult(result) {
    if (!result) return;
    if (result.node.rank === 'family') {
      selectFamily(result.node.id, { scroll: true });
      focusNode(result.node.parent || ROOT_ID);
    } else {
      focusNode(result.node.id, { scroll: true });
    }
    clearSearch();
  }

  function clearSearch() {
    dom['taxon-search'].value = '';
    dom['clear-search'].hidden = true;
    closeSearchResults();
    dom['taxon-search'].focus();
  }

  function closeSearchResults() {
    state.searchResults = [];
    dom['search-results'].replaceChildren();
    dom['search-results'].classList.remove('is-open');
    dom['taxon-search'].setAttribute('aria-expanded', 'false');
  }

  function displayName(node) {
    const raw = node.source || node;
    return state.language === 'en' ? raw.name || 'Unnamed taxon' : raw.cnName || raw.name || '未命名分类单元';
  }

  function rankLabel(rank) {
    const labels = state.language === 'en' ? RANK_LABELS_EN : RANK_LABELS;
    return labels[rank] || (state.language === 'en' ? rank : '分类单元');
  }

  function familyCountLabel(count) {
    return state.language === 'en' ? `${count} ${count === 1 ? 'family' : 'families'}` : `${count} 科`;
  }

  function compactSystemName(system) {
    return String(system || '分类体系')
      .replace(' (2016)', '')
      .replace(' (2022)', '')
      .replace('Integrated backbone', '综合骨架');
  }

  function truncate(value, maxLength) {
    return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
  }

  function preferredScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function element(tagName, text) {
    const node = document.createElement(tagName);
    node.textContent = text;
    return node;
  }

  function hideLoading() {
    dom['loading-screen'].classList.add('is-hidden');
  }

  function showFatalError(error) {
    console.error(error);
    const panel = dom['loading-screen'];
    panel.classList.remove('is-hidden');
    const title = element('p', '图谱暂时无法载入');
    const detail = element('p', error.message || '请检查本地数据服务。');
    const retry = element('button', '重新载入');
    retry.type = 'button';
    retry.className = 'fit-button';
    retry.addEventListener('click', () => window.location.reload());
    panel.replaceChildren(Object.assign(document.createElement('div'), { className: 'loading-error' }));
    panel.firstElementChild.append(title, detail, retry);
  }
})();
