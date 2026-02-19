//  Copyright (c) 2026 Nicolas ROBERT.
//  Distributed under MIT license. Please see LICENSE for details.

let packages = [];
let metrics = {};
let exploreTags = [];
let funFacts = [];

function parseDate(dateStr) {
    if (!dateStr || dateStr === 'N/A') return null;
    const normalized = dateStr.replace(' ', 'T');
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return null;
    return date;
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}


const USE_CLOUDFLARE = true;

const REGISTRY_URL = USE_CLOUDFLARE 
  ? 'https://tcltk-registry.pages.dev/metadata/packages-meta.json'
  : 'https://cdn.jsdelivr.net/gh/tonuser/registry@latest/metadata/packages-meta.json';

function getFossilIcon() {
    return `<svg class="method-icon" width="32" height="32" viewBox="0 0 32 32" fill="currentColor"
        style="vertical-align: middle; display: inline-block;"
        xmlns="http://www.w3.org/2000/svg">
        <path d="m17 2.14c-0.638 0.212-0.842 0.997-1.1 1.55-0.123 0.351-0.637 0.355-0.863 0.663-0.906 0.787-1.64 1.75-2.26 2.78-0.978-0.532-2.22-1.1-3.31-0.586-0.852 0.512-0.493 1.68-0.0671 2.36 1 1.55 2.62 2.75 4.44 3.14 0.908 0.218 1.94-0.203 2.29-1.1 0.988-2.15 1.41-4.53 1.46-6.88-0.0389-0.634 0.0586-1.46-0.467-1.91 0.0074 0.0148-0.122-0.057-0.115-0.016zm-1.94 4.59c-0.121 0.692-0.225 1.39-0.273 2.09-0.169-0.301-0.662-0.559-0.701-0.826 0.353-0.398 0.681-0.822 0.975-1.26zm-3.74 4.62c-0.695 0.404-0.856 1.32-1.1 2.02-0.339 1.38-0.637 2.88-0.262 4.28 0.0923 0.457 0.627 0.351 0.776-0.0082 0.855-1.48 1.14-3.24 1.14-4.94-0.0495-0.413 0.00781-1.31-0.55-1.36zm-6.4 3.16c-0.0864 0.449 0.184 0.993 0.508 1.32 0.213-0.0706-0.017-0.496-0.0528-0.658-0.111-0.214-0.204-0.578-0.455-0.657zm-0.773 0.588c-0.0729 0.316 0.362 0.578 0.567 0.779 0.111 0.141 0.597 0.291 0.391-0.0429-0.226-0.315-0.549-0.696-0.958-0.736zm-0.188 0.801c-0.234-0.0664-0.333 0.16-0.0694 0.221 0.384 0.14 0.894 0.337 1.28 0.17-0.248-0.311-0.829-0.35-1.21-0.39zm1.54 0.16c-0.402 0.299-0.187 0.938-0.175 1.37 0.192 1.02 0.407 2.13 1.11 2.92 0.37 0.23 0.404-0.452 0.386-0.681-0.0953-1.22-0.366-2.49-1.1-3.49-0.0635-0.0523-0.135-0.124-0.224-0.117zm12.1 0.223c-0.326 0.32-0.599 0.856-0.523 1.31 0.359-0.152 0.469-0.69 0.583-1.04 0.0031-0.0638 0.066-0.288-0.0596-0.269zm0.748 0.576c-0.393 0.152-0.854 0.493-0.922 0.924 0.413 0.0307 0.778-0.428 0.997-0.754 0.0458-0.0745 0.0434-0.198-0.0744-0.17zm-8.9 0.705c-1.06 0.294-1.85 1.23-2.31 2.2-0.175 0.303-0.183 0.951 0.324 0.856 1.06-0.287 1.85-1.23 2.32-2.19 0.158-0.319 0.191-0.935-0.332-0.863zm9.04 0.115c-0.356 0.0697-0.88 0.0737-1.09 0.394 0.46 0.146 1.05-0.0279 1.45-0.299-0.0048-0.153-0.263-0.0744-0.356-0.0959zm-7.06 0.193c-0.346 0.167-0.0261 0.669 0.0684 0.925 0.556 1.03 1.28 2.06 2.3 2.66 0.387 0.195 0.436-0.314 0.278-0.554-0.499-1.16-1.3-2.23-2.35-2.95-0.0939-0.0459-0.195-0.0878-0.301-0.0814zm5.28 0.041c-0.969 0.311-1.66 1.18-2.21 2-0.125 0.262-0.527 0.812-0.127 0.998 0.847-0.151 1.43-0.919 1.97-1.54 0.258-0.402 0.717-0.877 0.575-1.39-0.0446-0.0628-0.131-0.0746-0.202-0.0689zm-6.43 0.146c-0.529 0.21-0.432 0.964-0.459 1.43 0.0607 1.32 0.321 2.72 1.12 3.8 0.194 0.361 0.715 0.3 0.777-0.118 0.319-1.35-0.0333-2.78-0.521-4.05-0.209-0.393-0.419-0.984-0.917-1.06zm17.9 2.88c-0.62 0.513-0.874 1.36-1.14 2.1-0.0417 0.261-0.265 0.667-0.0642 0.881 0.544-0.368 0.746-1.1 1.01-1.68 0.108-0.41 0.396-0.897 0.227-1.31-0.0104 2.8e-5 -0.0209-7.2e-5 -0.0313 1e-4zm-11.1 0.484c-0.0781 0.456 0.197 0.993 0.519 1.32 0.205-0.131-0.0514-0.531-0.0918-0.723-0.108-0.191-0.198-0.533-0.428-0.599zm-0.766 0.588c-0.104 0.291 0.338 0.557 0.518 0.747 0.0902 0.105 0.587 0.36 0.455 0.0273-0.216-0.334-0.559-0.725-0.973-0.774zm-0.189 0.799c-0.152-0.0478-0.363 0.0852-0.137 0.182 0.393 0.183 0.935 0.386 1.34 0.215-0.241-0.319-0.83-0.352-1.21-0.397zm1.57 0.246c-0.484 0.322-0.449 1.04-0.519 1.57-0.0186 0.704-0.0193 1.44 0.26 2.1-0.812-0.995-1.96-1.73-3.18-2.11-0.237-0.12-0.685 0.0046-0.462 0.33 0.706 1.02 1.84 1.67 2.97 2.14 0.227 0.0913 0.866 0.267 0.772-0.168-0.0684-0.0223 0.434 0.219 0.461-0.16 0.371-0.999 0.376-2.14 0.113-3.16-0.0752-0.192-0.149-0.536-0.41-0.534zm-6.02 0.385c-0.513 0.135-0.207 0.838-0.0758 1.18 0.552 1.16 1.33 2.32 2.5 2.94 0.407 0.237 0.645-0.265 0.496-0.601-0.408-1.35-1.31-2.57-2.47-3.37-0.136-0.0726-0.29-0.147-0.444-0.145zm15.1 0.596c-0.864 0.496-1.52 1.33-2.01 2.19-0.197 0.272 0.131 0.353 0.289 0.154 0.75-0.595 1.45-1.33 1.84-2.22 0.0135-0.0895-0.0173-0.148-0.115-0.129zm-14.7 1.82c-0.483 0.328-0.451 1.05-0.521 1.57 0.0036 0.782-0.0685 1.69 0.438 2.34 0.406 0.136 0.489-0.514 0.568-0.791 0.139-0.996 0.222-2.1-0.258-3.02-0.0474-0.0705-0.143-0.101-0.226-0.1zm-4.23 0.0684c-0.0916 0.448 0.18 0.994 0.504 1.32 0.211-0.0363 0.00487-0.445-0.0195-0.587-0.121-0.238-0.211-0.631-0.484-0.728zm16.4 0.553c-1.41 0.191-2.8 0.722-3.94 1.57-0.249 0.117-0.353 0.55 0.0327 0.524 1.38-0.0369 2.7-0.636 3.88-1.32 0.181-0.155 0.753-0.456 0.453-0.718-0.131-0.0628-0.285-0.0475-0.426-0.0507zm-17.2 0.041c-0.052 0.359 0.419 0.635 0.672 0.84 0.135 0.135 0.472 0.157 0.285-0.102-0.225-0.315-0.548-0.699-0.957-0.738zm-0.18 0.797c-0.151-0.0529-0.363 0.0954-0.135 0.184 0.396 0.174 0.935 0.389 1.34 0.213-0.244-0.316-0.829-0.353-1.21-0.396zm1.41 0.0566c-0.441 0.0851-0.00984 0.607 0.158 0.773 0.886 0.839 1.95 1.61 3.17 1.85 0.461 0.0532 0.254-0.497 0.0313-0.664-0.879-0.903-1.99-1.69-3.23-1.95-0.0407-0.00584-0.0821-0.00264-0.123-0.0028zm7.34 0.0977c-0.426 0.0542-1.05-0.0354-1.3 0.381 0.19 0.516 0.889 0.615 1.35 0.793 1.27 0.321 2.64 0.562 3.94 0.239 0.419-0.0948 0.205-0.544-0.101-0.627-1.19-0.589-2.58-0.767-3.89-0.786z"/>
        <path d="m9.22 7.04c-0.108-0.228 0.034-0.485 0.154-0.679 0.336-0.503 0.796-0.907 1.25-1.3 0.608-0.506 1.26-0.952 1.93-1.37 0.717-0.432 1.45-0.834 2.23-1.16 0.608-0.25 1.24-0.501 1.9-0.534 0.213-0.0075 0.515 0.0371 0.559 0.291 0.0026 0.356-0.246 0.65-0.458 0.912-0.458 0.531-1.01 0.975-1.56 1.4-0.659 0.483-1.34 0.934-2.06 1.33-0.59 0.33-1.2 0.628-1.83 0.877-0.571 0.214-1.17 0.44-1.79 0.399-0.124-0.0202-0.261-0.0568-0.334-0.169z"/>
    </svg>`;
}

function getGitHubIcon() {
    return `<svg class="method-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"
        style="vertical-align: middle; display: inline-block;"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`;
}

function updateFooterMetadata() {
    let generatedAt = localStorage.getItem('registryGeneratedAt');
    let version = localStorage.getItem('registryVersion');

    const isValidVersion = version && /^v?[\d.]+$/.test(version);
    
    if (!generatedAt) return;
    
    const date = new Date(generatedAt);
    const dateShort = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    const dateLong = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let versionStr = '';
    if (isValidVersion) {
        versionStr = version.startsWith('v') ? version : `v${version}`;
    }
    
    const footerLeft = document.querySelector('.footer-left');
    if (!footerLeft) return;
    
    const oldMeta = footerLeft.querySelector('.meta-version');
    if (oldMeta) oldMeta.remove();
    
    const metaSpan = document.createElement('span');
    metaSpan.className = 'meta-version';
    metaSpan.title = dateLong;
    
    if (versionStr) {
        metaSpan.innerHTML = `• ${versionStr} • <span class="date-full">${dateLong}</span><span class="date-short">${dateShort}</span>`;
    } else {
        metaSpan.innerHTML = `• <span class="date-full">${dateLong}</span><span class="date-short">${dateShort}</span>`;
    }
    
    footerLeft.appendChild(metaSpan);
}

async function loadPackagesData() {
    try {
        showSkeleton();

        const response = await fetch(REGISTRY_URL);
        if (!response.ok) throw new Error('Failed to load registry data');

        const data = await response.json();
        let metadata = null;
        let packagesData = data;

        if (Array.isArray(data) && data.length > 0 && data[0].generated_at) {
            metadata = data[0];
            packagesData = data.slice(1);

            if (metadata.version) {
                localStorage.setItem('registryVersion', String(metadata.version));
            }
            if (metadata.generated_at) {
                localStorage.setItem('registryGeneratedAt', metadata.generated_at);
            }
        } else {
            packagesData = Array.isArray(data) ? data : [];
        }

        const validPackages = packagesData.filter(pkg => pkg && pkg.name);

        packages = validPackages.map(pkg => {
            const primarySource = pkg.sources && pkg.sources[0] ? pkg.sources[0] : {};

            const cleanUrl = (url) => url ? url.trim() : '';

            let repoShortName = '';
            if (primarySource.url) {
                try {
                    const url = new URL(cleanUrl(primarySource.url));
                    repoShortName = url.pathname.replace(/^\/|\/$/g, '');
                } catch (e) {
                    repoShortName = cleanUrl(primarySource.url);
                }
            }

            let maxCommitDate = null;
            let minCommitDate = null;
            let hasCommits = false;

            if (pkg.sources && pkg.sources.length > 0) {
                pkg.sources.forEach(src => {
                    if (src.last_commit) {
                        const commits = Array.isArray(src.last_commit) ? src.last_commit : [src.last_commit];
                        commits.forEach(dateStr => {
                            if (dateStr && dateStr !== 'N/A') {
                                const date = new Date(dateStr);
                                if (!isNaN(date.getTime())) {
                                    hasCommits = true;
                                    if (!maxCommitDate || date > maxCommitDate) maxCommitDate = date;
                                    if (!minCommitDate || date < minCommitDate) minCommitDate = date;
                                }
                            }
                        });
                    }
                });
            }

            return {
                name: pkg.name,
                description: pkg.description || '',
                github: repoShortName,
                tags: pkg.tags || [],
                license: primarySource.license || 'Unknown',
                sources: (pkg.sources || []).map(src => ({
                    ...src,
                    url: cleanUrl(src.url),
                    web: cleanUrl(src.web),
                    author: src.author ? src.author.trim() : 'unknown',
                    license: src.license ? src.license.trim() : 'Unknown'
                })),

                lastCommit: primarySource.last_commit || null,
                lastCommitSha: primarySource.last_commit_sha || null,
                reachable: primarySource.reachable !== false,
                archived: primarySource.archived || false,
                lastTag: primarySource.last_tag || null,
                maxCommitDate: maxCommitDate,
                minCommitDate: minCommitDate,
                hasCommits: hasCommits,

                version: primarySource.last_tag || 'v1.0.0',
                addedAt: primarySource.added_at
                    ? primarySource.added_at.replace(' ', 'T')
                    : 'N/A',
                web: cleanUrl(primarySource.web) || cleanUrl(primarySource.url)
            };
        });

        calculateMetrics();
        generateExploreTags();
        generateFunFacts();
        renderInterface();
        updateFooterMetadata();
        hideSkeleton();

    } catch (error) {
        console.error('Erreur:', error);
        hideSkeleton();
        const skPkg = document.getElementById('skeletonPackages');
        if (skPkg) {
            skPkg.style.display = 'flex';
            skPkg.innerHTML = '<p style="color:var(--text-secondary);padding:20px;font-size:0.85rem;">Unable to load data from the registry.</p>';
        }
    }
}

function calculateMetrics() {
    const allTags = {};
    const allAuthors = {};
    const allDomains = {};

    packages.forEach(pkg => {
        if (pkg.tags) {
            pkg.tags.forEach(tag => {
                allTags[tag] = (allTags[tag] || 0) + 1;
            });
        }

        if (pkg.sources && pkg.sources.length > 0) {
            pkg.sources.forEach(src => {
                if (src.author) {
                    if (!allAuthors[src.author]) {
                        allAuthors[src.author] = { count: 0 };
                    }
                    allAuthors[src.author].count++;
                }

                if (src.url) {
                    try {
                        const url = new URL(src.url);
                        allDomains[url.hostname] = (allDomains[url.hostname] || 0) + 1;
                    } catch (e) {}
                }
            });
        }
    });

    const topTags = Object.entries(allTags)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const topAuthors = Object.entries(allAuthors)
        .map(([name, data]) => ({ name, count: data.count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const domains = Object.entries(allDomains)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); // 90 days


    const last90Days = packages.filter(p => {
        if (p.maxCommitDate) {
            return p.maxCommitDate > threeMonthsAgo;
        }
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => {
            if (!src.last_commit) return false;
            const commits = Array.isArray(src.last_commit) ? src.last_commit : [src.last_commit];
            return commits.some(dateStr => {
                if (!dateStr || dateStr === 'N/A') return false;
                const date = parseDate(dateStr);
                return date && date > threeMonthsAgo;
            });
        });
    }).length;


    const olderThanYear = packages.filter(p => {
        if (p.maxCommitDate) {
            return p.maxCommitDate < oneYearAgo;
        }
        if (!p.sources || p.sources.length === 0) return true;
        return p.sources.every(src => {
            if (!src.last_commit) return true;
            const commits = Array.isArray(src.last_commit) ? src.last_commit : [src.last_commit];
            const validDates = commits.filter(dateStr => dateStr && dateStr !== 'N/A');
            if (validDates.length === 0) return true;
            const maxDate = validDates.reduce((max, dateStr) => {
                const date = parseDate(dateStr);
                return (date && date > max) ? date : max;
            }, new Date(0));
            return maxDate < oneYearAgo;
        });
    }).length;

    const archived = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => src.archived === true);
    }).length;

    const unreachable = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return true;
        return p.sources.every(src => src.reachable === false);
    }).length;

    const versioned = packages.filter(p => {
        if (!p.sources || p.sources.length === 0) return false;
        return p.sources.some(src => src.last_tag || src.latest_release);
    }).length;

    metrics = {
        total: packages.length,
        authors: Object.keys(allAuthors).length,
        archived: archived,
        unreachable: unreachable,
        versioned: versioned,
        olderThanYear: olderThanYear,
        last90Days: last90Days,
        topTags: topTags,
        topAuthors: topAuthors,
        domains: domains
    };
}

function generateExploreTags() {
    exploreTags = metrics.topTags.slice(0, 10).map(t => t.name);
}

function generateFunFacts() {
    const unreachableCount = packages.filter(p => !p.reachable).length;
    const archivedCount = packages.filter(p => p.archived).length;

    funFacts = [
        `There are currently ${packages.length} packages in the registry!`,
        `Most popular tag: '${escapeHTML(metrics.topTags[0]?.name)}' with ${escapeHTML(metrics.topTags[0]?.count)} packages!`,
        `${escapeHTML(metrics.authors)} unique authors in the ecosystem!`,
        `${escapeHTML(metrics.domains[0]?.name)} hosts the most packages!`,
        `The Tcl programming language was created in 1988 by John Ousterhout.`,
        `Tcl/Tk powers 🚀 NASA's mission control systems!`,
        `Tk was the first cross-platform GUI toolkit!`,
        `Tcl stands for "Tool Command Language" - simple yet powerful!`,
        `From embedded systems to enterprise apps - Tcl does it all!`,
        `Join ${escapeHTML(metrics.authors)} developers building with Tcl/Tk!`,
        `Tcl can be embedded in C/C++ applications seamlessly!`,
        unreachableCount > 0 ? `${unreachableCount} packages are currently unreachable.` : null,
        archivedCount > 0 ? `${archivedCount} packages are archived.` : null
    ].filter(Boolean);
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
    } else if (hash.startsWith('#/search')) {
        showPage('searchPage');

        const queryMatch = hash.match(/[?&]q=([^&]+)/);
        const query = queryMatch ? decodeURIComponent(queryMatch[1]) : '';

        initializeSearchPage(query);
    } else if (hash === '#/metrics') {
        showPage('metricsPage');
    } else if (hash === '#/about') {
        showPage('aboutPage');
    } else {
        showPage('homePage');
        const homeInput = document.getElementById('searchInput');
        if (homeInput) homeInput.value = '';
    }
}

function initializeSearchPage(query) {
    const input = document.getElementById('searchInput2');

    if (query) {
        input.value = query;
        performSearch(query);
    } else {
        input.value = '';
        displaySearchResults(packages, '');
        const countEl = document.getElementById('resultsCount');
        if (countEl) countEl.textContent = `${packages.length} packages`;
    }
    sortResults();
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
    if (!url) return '';
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

        const method = (src.method || 'unknown').toLowerCase();
        let methodDisplay;
        let methodClass = 'source-method';

        if (method === 'fossil') {
            methodDisplay = getFossilIcon();
            methodClass = 'source-method icon-only';
        } else if (method === 'git') {
            methodDisplay = getGitHubIcon();
            methodClass = 'source-method icon-only';
        } else {
            methodDisplay = src.method || 'unknown';
        }

        let statusBadges = '';
        if (src.archived) {
            statusBadges += `<span class="status-badge archived">Archived</span>`;
        }
        if (src.reachable === false) {
            statusBadges += `<span class="status-badge unreachable">Unreachable</span>`;
        }

        let commitRow = '';
        const hasCommits = src.last_commit && (
            (Array.isArray(src.last_commit) && src.last_commit.length > 0) ||
            (typeof src.last_commit === 'string' && src.last_commit !== '')
        );

        if (hasCommits) {
            let dates = [];
            let shas = [];

            if (Array.isArray(src.last_commit)) {
                dates = src.last_commit;
                shas = src.last_commit_sha || [];
            } else {
                dates = [src.last_commit];
                shas = [src.last_commit_sha];
            }

            const rowsHtml = dates.map((dateStr, i) => {
                const date = dateStr ? dateStr.split(' ')[0] : 'N/A';
                const sha = shas[i] ? shas[i].substring(0, 7) : '-------';
                return `
                    <div class="terminal-row">
                        <span class="terminal-sha">${escapeHTML(sha)}</span>
                        <span class="terminal-date">${date}</span>
                    </div>
                `;
            }).join('');

            commitRow = `
            <div class="source-commit-row">
                <span class="url-label">last commit(s):</span>
                <div class="terminal-table">
                    <div class="terminal-header">
                        <span class="terminal-label">commit</span>
                        <span class="terminal-label">date</span>
                    </div>
                    ${rowsHtml}
                </div>
            </div>`;
        }

        const licenseRow = `
            <div class="source-license-row">
                <span class="url-label">license:</span>
                <span class="source-license-text">
                    <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="9"></line>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span>${escapeHTML(src.license) || 'Unknown'}</span>
                </span>
            </div>`;

        let versionRow = '';
        const hasValidVersion = src.latest_release &&
                               !['none', 'null', ''].includes(String(src.latest_release).toLowerCase().trim());
        if (hasValidVersion) {
            versionRow = `
            <div class="source-version-row">
                <span class="url-label">version:</span>
                    <span class="source-version-text">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                            <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                    <span>${escapeHTML(src.latest_release)}</span>
                </span>
            </div>`;
        }

        let tagRow = '';
        if (src.last_tag && src.last_tag !== src.latest_release) {
            tagRow = `
            <div class="source-tag-row">
                <span class="url-label">tag:</span>
                    <span class="source-tag-text">
                        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    <span>${escapeHTML(src.last_tag)}</span>
                </span>
            </div>`;
        }

        return `
        <div class="source-card ${index === 0 ? 'primary' : ''} ${src.reachable === false ? 'unreachable' : ''} ${src.archived ? 'archived' : ''}">
            <div class="source-header">
                <div class="source-author">
                    <span class="author-label">author/orgs</span>
                    <span class="author-name">${escapeHTML(src.author) || 'unknown'}</span>
                    ${statusBadges}
                </div>
                <span class="${methodClass}">${methodDisplay}</span>
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
                            <span style="margin-left: 6px;">${escapeHTML(shortRepo)}</span>
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
                            <span style="margin-left: 6px;">${escapeHTML(shortDoc)}</span>
                        </a>
                    </div>` : ''}
                    ${versionRow}
                    ${tagRow}
                    ${licenseRow}
                    ${commitRow}
                </div>
            </div>
        </div>`;
    }).join('');

    const container = document.getElementById('packageDetail');
    if (!container) return;

    let maintenanceWarning = '';
    if (pkg.archived && pkg.sources.length === 1) {
        maintenanceWarning = `<div class="maintenance-warning archived-warning">⚠️ This package is archived</div>`;
    } else if (pkg.reachable === false && pkg.sources.length === 1) {
        maintenanceWarning = `<div class="maintenance-warning unreachable-warning">⚠️ Repository currently unreachable</div>`;
    } else if (pkg.lastCommit) {
        const lastDate = Array.isArray(pkg.lastCommit) ? pkg.lastCommit[0] : pkg.lastCommit;
        if (lastDate) {
            const date = new Date(lastDate);
            const twoYearsAgo = new Date();
            twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
            if (date < twoYearsAgo) {
                maintenanceWarning = `<div class="maintenance-warning stale-warning">⚠️ Last update: ${lastDate.split(' ')[0]} (may be unmaintained)</div>`;
            }
        }
    }

    container.innerHTML = `
        <div class="package-detail">
            ${maintenanceWarning}
            <div class="detail-header">
                <h1>${escapeHTML(pkg.name)}</h1>
                <p class="detail-desc">${escapeHTML(pkg.description)}</p>
            </div>
            <div class="detail-section">
                <h3>available sources (${pkg.sources.length}):</h3>
                <div class="sources-grid">${sourcesCards}</div>
            </div>
            <div class="detail-tags">
                ${pkg.tags.map(t => `<span class="tag" onclick="searchByTag('${escapeHTML(t)}')">${escapeHTML(t)}</span>`).join('')}
            </div>
        </div>`;

    showPage('packagePage');
    if (updateHash) window.location.hash = `#/pkg/${encodeURIComponent(pkgName)}`;
}

function renderExploreTags() {
    const el = document.getElementById('exploreTags');
    if (el) el.innerHTML = exploreTags.map(tag =>
        `<span class="tag" onclick="searchByTag('${escapeHTML(tag)}')">${escapeHTML(tag)}</span>`
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

    const sorted = [...packages].sort((a, b) => {
        if (!a.addedAt || a.addedAt === 'N/A') return 1;
        if (!b.addedAt || b.addedAt === 'N/A') return -1;
        return new Date(b.addedAt) - new Date(a.addedAt);
    });

    const isMobile = window.innerWidth <= 768;
    const totalItems = sorted.length;
    const displayCount = isMobile ? Math.min(20, totalItems) : totalItems;
    const limited = sorted.slice(0, displayCount);
    const dup = [...limited, ...limited];

    el.innerHTML = dup.map(pkg => `
        <div class="package-item" onclick="showPackageDetail('${escapeHTML(pkg.name).replace(/'/g, "\\'")}')">
            <span class="package-name">${escapeHTML(pkg.name)}</span>
            <span class="package-desc">${escapeHTML(pkg.description)}</span>
            <span class="package-date">${pkg.addedAt ? pkg.addedAt.split(/[T ]/)[0] : 'N/A'}</span>
        </div>`).join('');

    const pxPerSecondDesktop = 32;
    const pxPerSecondMobile = 25;
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

    const sorted = [...packages]
        .filter(p => p.sources && p.sources.some(s => 
            (s.latest_release && !['none', 'null', ''].includes(String(s.latest_release).toLowerCase().trim())) ||
            (s.last_tag && s.last_tag !== '')
        ))
        .sort((a, b) => {
            const dateA = a.maxCommitDate || new Date(0);
            const dateB = b.maxCommitDate || new Date(0);
            return dateB - dateA;
        })
        .slice(0, 11);

    el.innerHTML = sorted.map(pkg => {
        const src = pkg.sources.find(s => 
            (s.latest_release && !['none', 'null', ''].includes(String(s.latest_release).toLowerCase().trim())) ||
            (s.last_tag && s.last_tag !== '')
        );

        let version = 'dev';
        if (src) {
            if (src.latest_release && !['none', 'null', ''].includes(String(src.latest_release).toLowerCase().trim())) {
                version = src.latest_release;
            } else if (src.last_tag) {
                version = src.last_tag;
            }
        }
        
        return `
        <div class="version-item" onclick="showPackageDetail('${escapeHTML(pkg.name).replace(/'/g, "\\'")}')">
            <span class="version-name">${escapeHTML(pkg.name)}</span>
            <span class="version-number">${escapeHTML(version)}</span>
        </div>`;
    }).join('');
}

function renderMetrics() {
    const mapping = {
        'metricTotal': 'total',
        'metricAuthors': 'authors',
        'metricArchived': 'archived',
        'metricUnreachable': 'unreachable',
        'metricVersioned': 'versioned',
        'metricOlderYear': 'olderThanYear',
        'metric90Days': 'last90Days'
    };

    Object.entries(mapping).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el && metrics[key] !== undefined) {
            el.textContent = metrics[key].toLocaleString();
        }
    });

    const tagsTable = document.getElementById('tagsTable');
    if (tagsTable && metrics.topTags) {
        tagsTable.innerHTML = metrics.topTags.map(tag => `
            <tr>
                <td><a href="#/search" onclick="searchByTag('${escapeHTML(tag.name)}'); return false;">${escapeHTML(tag.name)}</a></td>
                <td class="num">${escapeHTML(tag.count)}</td>
            </tr>
        `).join('');
    }

    const authorsTable = document.getElementById('authorsTable');
    if (authorsTable && metrics.topAuthors) {
        authorsTable.innerHTML = metrics.topAuthors.map(author => `
            <tr>
                <td>${escapeHTML(author.name)}</td>
                <td class="num">${author.count}</td>
            </tr>
        `).join('');
    }

    const domainsTable = document.getElementById('domainsTable');
    if (domainsTable && metrics.domains) {
        domainsTable.innerHTML = metrics.domains.map(domain => `
            <tr>
                <td>${escapeHTML(domain.name)}</td>
                <td class="num">${domain.count}</td>
            </tr>
        `).join('');
    }
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

    if (!query) {
        window.location.hash = '#/search';
    } else {
        window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
    }
    return false;
}

function resetSearch() {
    const input = document.getElementById('searchInput2');
    const sortSelect = document.getElementById('sortSelect');
    
    if (input) {
        input.value = '';
        input.focus();
    }

    if (sortSelect) {
        sortSelect.value = 'az';
    }

    sortResults();
}

function searchByTag(tag) {
    window.location.hash = `#/search?q=${encodeURIComponent('tag:' + tag)}`;
    if (document.activeElement) document.activeElement.blur();
}

function performSearch(query) {
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

    displaySearchResults(results, query);

    const input = document.getElementById('searchInput2');
    if (input && query !== undefined) input.value = query;
}

function displaySearchResults(results, query) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        if (query && query.trim() !== '') {
            countEl.textContent = `${results.length}/${packages.length} packages matching "${escapeHTML(query)}"`;
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
        <div class="result-item" onclick="showPackageDetail('${escapeHTML(pkg.name).replace(/'/g, "\\'")}')">
            <div class="result-header">
                <span class="result-name">${escapeHTML(pkg.name)}</span>
                ${pkg.archived ? '<span class="mini-badge archived">archived</span>' : ''}
                ${!pkg.reachable ? '<span class="mini-badge unreachable">unreachable</span>' : ''}
            </div>
            <p class="result-desc">${escapeHTML(pkg.description)}</p>
            <div class="result-meta">
                <span>${pkg.sources.length} source(s)</span>
                <span>license: ${pkg.sources ? [...new Set(pkg.sources.map(s => escapeHTML(s.license)).filter(Boolean))].join(', ') : 'Unknown'}</span>
                ${pkg.hasCommits ? `<span>updated: ${pkg.maxCommitDate.toISOString().split('T')[0]}</span>` : '<span>updated: N/A</span>'}
            </div>
            <div class="result-tags">
                ${pkg.tags.map(t => `<span class="result-tag" onclick="event.stopPropagation(); searchByTag('${escapeHTML(t)}')">${escapeHTML(t)}</span>`).join('')}
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

const activeFilters = {
    reachable: false,
    archived: false,
    lib: false
};

function toggleFilter(filterName) {
    activeFilters[filterName] = !activeFilters[filterName];

    const btnId = 'btn' + filterName.charAt(0).toUpperCase() + filterName.slice(1);
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.classList.toggle('active', activeFilters[filterName]);
    }

    sortResults();
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
            p.description.toLowerCase().includes(lowerQuery) ||
            p.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
            p.sources.some(s => s.author && s.author.toLowerCase().includes(lowerQuery))
        );
    }

    if (activeFilters.reachable) {
        results = results.filter(p => 
            p.sources && p.sources.some(s => s.reachable !== false)
        );
    }
    
    if (activeFilters.archived) {
        results = results.filter(p => 
            p.sources && p.sources.some(s => s.archived === true)
        );
    }
    
    if (activeFilters.lib) {
        results = results.filter(p => 
            p.lib === true || (p.sources && p.sources.some(s => s.lib === true))
        );
    }

    // Tri
    const getMaxTime = (pkg) => {
        return (pkg.maxCommitDate instanceof Date && !isNaN(pkg.maxCommitDate)) 
            ? pkg.maxCommitDate.getTime() 
            : 0;
    };

    switch(sortBy) {
        case 'oldest':
            results.sort((a, b) => getMaxTime(a) - getMaxTime(b));
            break;
        case 'recent':
            results.sort((a, b) => getMaxTime(b) - getMaxTime(a));
            break;
        case 'az':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            results.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    
    displaySearchResults(results, query);
}


window.toggleTheme = toggleTheme;
window.navigateTo = navigateTo;
window.showPackageDetail = showPackageDetail;
window.goBack = goBack;
window.handleSearch = handleSearch;
window.resetSearch = resetSearch;
window.searchByTag = searchByTag;
window.sortResults = sortResults;
window.showSearchSkeleton = showSearchSkeleton;