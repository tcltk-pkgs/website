let packages = [];
let metrics = {};
let exploreTags = [];
let funFacts = [];

async function loadPackagesData() {
    try {
        showSkeleton();

        const response = await fetch('./packages.json');
        if (!response.ok) throw new Error('Erreur chargement');
        const data = await response.json();

        packages = data.map(pkg => {
            const primarySource = pkg.sources[0];
            let repoShortName = '';
            if (primarySource.url) {
                try {
                    const url = new URL(primarySource.url);
                    repoShortName = url.pathname.replace(/^\/|\/$/g, '');
                } catch (e) {
                    repoShortName = primarySource.url;
                }
            }

            return {
                name: pkg.name,
                description: pkg.description,
                github: repoShortName,
                tags: pkg.tags || [],
                license: primarySource.license || 'Unknown',
                sources: pkg.sources,
                lastCommit: '0 days ago',
                version: 'v1.0.0',
                addedAt: new Date().toISOString().split('T')[0],
                web: primarySource.web || primarySource.url
            };
        });

        calculateMetrics();
        generateExploreTags();
        generateFunFacts();
        renderInterface();

        hideSkeleton();

    } catch (error) {
        console.error('Erreur:', error);
        hideSkeleton();
        const skPkg = document.getElementById('skeletonPackages');
        if (skPkg) {
            skPkg.style.display = 'flex';
            skPkg.innerHTML = '<p style="color:var(--text-secondary);padding:20px;font-size:0.85rem;">Impossible de charger les données.</p>';
        }
    }
}

function calculateMetrics() {
    const allTags = {};
    const allAuthors = {};
    const allDomains = {};

    packages.forEach(pkg => {
        pkg.tags.forEach(tag => {
            allTags[tag] = (allTags[tag] || 0) + 1;
        });

        pkg.sources.forEach(src => {
            if (src.author) {
                if (!allAuthors[src.author]) {
                    allAuthors[src.author] = { count: 0, url: null };
                }
                allAuthors[src.author].count++;
            }
        });

        if (pkg.web) {
            try {
                const domain = new URL(pkg.web).hostname;
                allDomains[domain] = (allDomains[domain] || 0) + 1;
            } catch (e) {}
        }
    });

    const topTags = Object.entries(allTags)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const topAuthors = Object.entries(allAuthors)
        .map(([name, data]) => ({ name, count: data.count, url: data.url }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const domains = Object.entries(allDomains)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    metrics = {
        total: packages.length,
        authors: Object.keys(allAuthors).length,
        deleted: 0, unreachable: 0, alias: 0, versioned: 0,
        executables: 0, teacup: 0, lastYear: 0, lastMonth: 0,
        topTags, topAuthors, domains
    };
}

function generateExploreTags() {
    exploreTags = metrics.topTags.slice(0, 10).map(t => t.name);
}

function generateFunFacts() {
    funFacts = [
        `There are currently ${packages.length} packages in the registry!`,
        `Most popular tag: '${metrics.topTags[0]?.name}' with ${metrics.topTags[0]?.count} packages!`,
        `${metrics.authors} unique authors in the ecosystem!`,
        `${metrics.domains[0]?.name} hosts the most packages!`
    ];
}

function renderInterface() {
    renderExploreTags();
    renderRecentPackages();
    renderRecentVersions();
    renderMetrics();
    rotateFunFacts();
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    showSkeleton();
    loadPackagesData().then(() => {
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                requestAnimationFrame(() => {
                    const header = document.getElementById('header');
                    header.classList.toggle('scrolled', window.scrollY > 30);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        });
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
    });
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme;
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
}

function handleHashChange() {
    const hash = window.location.hash || '#/';
    if (hash.startsWith('#/pkg/')) {
        showPackageDetail(decodeURIComponent(hash.replace('#/pkg/', '')), false);
    } else if (hash === '#/search') {
        showPage('searchPage');
        initializeSearchPage();
    } else if (hash === '#/metrics') showPage('metricsPage');
    else if (hash === '#/about') showPage('aboutPage');
    else showPage('homePage');
}

function initializeSearchPage() {
    const lastSearch = localStorage.getItem('lastSearch') || '';
    const input = document.getElementById('searchInput2');
    
    if (lastSearch && input) {
        input.value = lastSearch;
        performSearch(lastSearch);
    } else {
        // Affiche tous les paquets par défaut
        displaySearchResults(packages, '');
        const countEl = document.getElementById('resultsCount');
        if (countEl) countEl.textContent = `${packages.length} packages`;
    }
}

function navigateTo(page) {
    const pages = { home: '#/', search: '#/search', metrics: '#/metrics', about: '#/about' };
    window.location.hash = pages[page] || '#/';
}

function showPage(pageId) {
    ['homePage', 'searchPage', 'packagePage', 'metricsPage', 'aboutPage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = id === pageId ? 'block' : 'none';
    });
    window.scrollTo(0, 0);
}

function goBack() { window.history.back(); }

function extractShortUrl(url, type) {
    try {
        const urlObj = new URL(url);
        if (type === 'repo') {
            const match = url.match(/name=([^&]+)/);
            if (match) return match[1];
            return urlObj.pathname.replace(/^\/|\/$/g, '');
        } else if (type === 'doc') {
            const parts = urlObj.pathname.split('/');
            return parts[parts.length - 1];
        }
    } catch (e) { return url; }
}

function showPackageDetail(pkgName, updateHash = true) {
    const pkg = packages.find(p => p.name === pkgName);
    if (!pkg) { console.error('Package not found:', pkgName); return; }

    const sourcesCards = pkg.sources.map((src, index) => {
        const hasDifferentWeb = src.web && src.web !== src.url;
        const shortRepo = extractShortUrl(src.url, 'repo');
        const shortDoc = hasDifferentWeb ? extractShortUrl(src.web, 'doc') : null;

        return `
        <div class="source-card ${index === 0 ? 'primary' : ''}">
            <div class="source-header">
                <div class="source-author">
                    <span class="author-label">author</span>
                    <span class="author-name">${src.author || 'unknown'}</span>
                </div>
                <span class="source-method">${src.method || 'unknown'}</span>
            </div>
            <div class="source-body">
                <div class="source-links">
                    <div class="source-url-row">
                        <span class="url-label">repository:</span>
                        <a href="${src.url}" target="_blank" class="source-url" title="${src.url}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                            ${shortRepo}
                        </a>
                    </div>
                    ${hasDifferentWeb ? `
                    <div class="source-web-row">
                        <span class="url-label">documentation:</span>
                        <a href="${src.web}" target="_blank" class="source-web" title="${src.web}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            ${shortDoc}
                        </a>
                    </div>` : ''}
                </div>
            </div>
            <div class="source-footer">
                <span class="source-license">${src.license || 'Unknown'}</span>
            </div>
        </div>`;
    }).join('');

    const container = document.getElementById('packageDetail');
    if (!container) return;

    container.innerHTML = `
        <div class="package-detail">
            <div class="detail-header">
                <h1>${pkg.name}</h1>
                <p class="detail-desc">${pkg.description}</p>
            </div>
            <div class="detail-section">
                <h3>available sources (${pkg.sources.length}):</h3>
                <div class="sources-grid">${sourcesCards}</div>
            </div>
            <div class="detail-tags">
                ${pkg.tags.map(t => `<span class="tag" onclick="searchByTag('${t}')">${t}</span>`).join('')}
            </div>
        </div>`;

    showPage('packagePage');
    if (updateHash) window.location.hash = `#/pkg/${encodeURIComponent(pkgName)}`;
}

function renderExploreTags() {
    const el = document.getElementById('exploreTags');
    if (el) el.innerHTML = exploreTags.map(tag =>
        `<span class="tag" onclick="searchByTag('${tag}')">${tag}</span>`
    ).join('');
}

function showSkeleton() {
    const skPkg = document.getElementById('skeletonPackages');
    const realPkg = document.getElementById('packagesScrollContainer');
    if (skPkg)  skPkg.style.display  = 'flex';
    if (realPkg) realPkg.style.display = 'none';
    const skVer = document.getElementById('skeletonVersions');
    const realVer = document.getElementById('recentVersions');
    if (skVer)  skVer.style.display  = 'flex';
    if (realVer) realVer.style.display = 'none';
    const tagsEl = document.getElementById('exploreTags');
    if (tagsEl) tagsEl.innerHTML = [0,1,2,3,4,5,6,7,8,9].map(i =>
        `<span class="skeleton-tag-sm" style="--i:${i}"></span>`
    ).join('');
}

function hideSkeleton() {
    const skPkg = document.getElementById('skeletonPackages');
    const realPkg = document.getElementById('packagesScrollContainer');
    if (skPkg)  skPkg.style.display  = 'none';
    if (realPkg) realPkg.style.display = 'block';
    const skVer = document.getElementById('skeletonVersions');
    const realVer = document.getElementById('recentVersions');
    if (skVer)  skVer.style.display  = 'none';
    if (realVer) realVer.style.display = 'flex';
}

function renderRecentPackages() {
    const el = document.getElementById('recentPackages');
    if (!el) return;
    const sorted = [...packages].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    const isMobile = window.innerWidth <= 768;
    const totalItems = sorted.length;
    const displayCount = isMobile ? Math.min(20, totalItems) : totalItems;
    const limited = sorted.slice(0, displayCount);
    const dup = [...limited, ...limited];
    
    el.innerHTML = dup.map(pkg => `
        <div class="package-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <span class="package-name">${pkg.name}</span>
            <span class="package-desc">${pkg.description}</span>
            <span class="package-date">${pkg.addedAt}</span>
        </div>`).join('');
    
    // Deux vitesses distinctes à ajuster selon le rendu visuel souhaité
    const pxPerSecondDesktop = 32;  // Vitesse PC (pixels/seconde)
    const pxPerSecondMobile = 25;   // Vitesse Mobile (plus petit = défilement plus lent)
    
    const pxPerSecond = isMobile ? pxPerSecondMobile : pxPerSecondDesktop;
    
    requestAnimationFrame(() => {
        const totalHeight = el.scrollHeight;
        const cycleHeight = totalHeight / 2;
        const duration = cycleHeight / pxPerSecond;
        
        el.style.animationDuration = `${duration}s`;
    });
}

function renderRecentVersions() {
    const el = document.getElementById('recentVersions');
    if (!el) return;
    const sorted = [...packages].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)).slice(0, 11);
    el.innerHTML = sorted.map(pkg => `
        <div class="version-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <span class="version-name">${pkg.name}</span>
            <span class="version-number">${pkg.version}</span>
        </div>`).join('');
}

function renderMetrics() {
    const ids = ['metricTotal', 'metricAuthors', 'metricDeleted', 'metricUnreachable',
                 'metricAlias', 'metricVersioned', 'metricExecutables', 'metricTeacup',
                 'metricYear', 'metricMonth'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const key = id.replace('metric', '').toLowerCase();
            el.textContent = (metrics[key] || 0).toLocaleString();
        }
    });

    const tagsTable = document.getElementById('tagsTable');
    if (tagsTable) tagsTable.innerHTML = metrics.topTags.map(tag => `
        <tr><td><a href="#/search" onclick="searchByTag('${tag.name}'); return false;">${tag.name}</a></td>
        <td class="num">${tag.count}</td></tr>`).join('');

    const authorsTable = document.getElementById('authorsTable');
    if (authorsTable) authorsTable.innerHTML = metrics.topAuthors.map(author => `
        <tr><td>${author.name}</td><td class="num">${author.count}</td></tr>`).join('');

    const domainsTable = document.getElementById('domainsTable');
    if (domainsTable) domainsTable.innerHTML = metrics.domains.map(domain => `
        <tr><td>${domain.name}</td><td class="num">${domain.count}</td></tr>`).join('');
}

function rotateFunFacts() {
    const el = document.getElementById('funFact');
    if (!el) return;
    let idx = Math.floor(Math.random() * funFacts.length);
    el.textContent = funFacts[idx];
    setInterval(() => {
        idx = (idx + 1) % funFacts.length;
        el.style.opacity = '0';
        setTimeout(() => { el.textContent = funFacts[idx]; el.style.opacity = '1'; }, 300);
    }, 5000);
}

function handleSearch(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const query = input.value.trim();
    performSearch(query);
    return false;
}

function searchByTag(tag) {
    navigateTo('search');
    const inp = document.getElementById('searchInput2');
    if (inp) inp.value = `tag:${tag}`;
    performSearch(`tag:${tag}`);
}

function performSearch(query) {
    // Mémorise la recherche
    if (query !== undefined) {
        localStorage.setItem('lastSearch', query);
    }
    
    showSearchSkeleton();
    let results = [...packages];
    
    const trimmedQuery = query ? query.trim().toLowerCase() : '';
    
    if (trimmedQuery) {
        if (trimmedQuery.startsWith('tag:')) {
            const t = trimmedQuery.replace('tag:', '');
            results = results.filter(p => p.tags.some(tag => tag.toLowerCase().includes(t)));
        } else {
            results = results.filter(p =>
                p.name.toLowerCase().includes(trimmedQuery) ||
                p.description.toLowerCase().includes(trimmedQuery) ||
                p.tags.some(t => t.toLowerCase().includes(trimmedQuery)) ||
                p.sources.some(s => s.author && s.author.toLowerCase().includes(trimmedQuery))
            );
        }
    }
    
    displaySearchResults(results, query || '');
    const countEl = document.getElementById('resultsCount');
    if (countEl) countEl.textContent = `${results.length}/${packages.length} packages`;
}

function displaySearchResults(results, query) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        if (query && query.trim() !== '') {
            countEl.textContent = `${results.length}/${packages.length} packages matching "${query}"`;
        } else {
            countEl.textContent = `${results.length} packages`;
        }
    }
    
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">No packages found.</p>';
        return;
    }
    
    container.innerHTML = results.map(pkg => `
        <div class="result-item" onclick="showPackageDetail('${pkg.name.replace(/'/g, "\\'")}')">
            <div class="result-header">
                <span class="result-name">${pkg.name}</span>
                <span class="result-github">${pkg.github}</span>
            </div>
            <p class="result-desc">${pkg.description}</p>
            <div class="result-meta">
                <span>${pkg.sources.length} source(s)</span>
                <span>license: ${pkg.license}</span>
            </div>
            <div class="result-tags">
                ${pkg.tags.map(t => `<span class="result-tag" onclick="event.stopPropagation(); searchByTag('${t}')">${t}</span>`).join('')}
            </div>
        </div>`).join('');
}

function showSearchSkeleton() {
    const container = document.getElementById('searchResults');
    if (!container) return;
    container.innerHTML = [0,1,2,3,4].map(i =>
        `<div class="skeleton-result" style="--i:${i}"></div>`
    ).join('');
}

function sortResults() {
    const sortBy = document.getElementById('sortSelect')?.value;
    const query = document.getElementById('searchInput2')?.value.trim() || '';
    
    let results = [...packages];
    
    if (query.startsWith('tag:')) {
        const t = query.replace('tag:', '').toLowerCase();
        results = results.filter(p => p.tags.some(tag => tag.toLowerCase().includes(t)));
    } else if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.description.toLowerCase().includes(lowerQuery)
        );
    }
    
    const sorts = {
        recent: (a, b) => new Date(b.addedAt) - new Date(a.addedAt),
        oldest: (a, b) => new Date(a.addedAt) - new Date(b.addedAt),
        az: (a, b) => a.name.localeCompare(b.name),
        za: (a, b) => b.name.localeCompare(a.name)
    };
    results.sort(sorts[sortBy] || sorts.az);
    displaySearchResults(results, query);
}


function toggleFilter(btn) { btn.classList.toggle('active'); }

window.toggleTheme = toggleTheme;
window.navigateTo = navigateTo;
window.showPackageDetail = showPackageDetail;
window.goBack = goBack;
window.handleSearch = handleSearch;
window.searchByTag = searchByTag;
window.sortResults = sortResults;
window.toggleFilter = toggleFilter;
window.showSearchSkeleton = showSearchSkeleton;