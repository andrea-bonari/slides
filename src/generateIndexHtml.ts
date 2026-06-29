import CSS from './index.css' with { type: 'text' };

function buildBreadcrumb(urlBase: string): string {
  return urlBase
    .split('/')
    .filter(Boolean)
    .reduce<{ label: string; href: string }[]>((acc, part, i, arr) => {
      acc.push({ label: part, href: '/' + arr.slice(0, i + 1).join('/') });
      return acc;
    }, [])
    .map((crumb, i, arr) =>
      i < arr.length - 1
        ? `<a href="${crumb.href}">${crumb.label}</a>`
        : `<span>${crumb.label}</span>`
    )
    .join(' <span class="sep">/</span> ');
}

function buildCards(dirs: string[], urlBase: string): string {
  return dirs
    .map(name => {
      const href = `${urlBase}/${name}`;
      return `
        <a href="${href}" class="card">
          <span class="card-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.75 2.5h4.5l1.5 1.5h6.5a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-.75.75H1.75A.75.75 0 0 1 1 13.25V3.25A.75.75 0 0 1 1.75 2.5Z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="card-name">${name}</span>
          <span class="card-arrow">→</span>
        </a>`;
    })
    .join('\n');
}

export function generateIndexHtml(dirs: string[], urlBase: string): string {
  const isRoot = urlBase === '';
  const title = isRoot ? '/' : urlBase.split('/').filter(Boolean).pop()!;
  const breadcrumb = isRoot ? '' : buildBreadcrumb(urlBase);
  const cards = buildCards(dirs, urlBase);
  const count = `${dirs.length} ${dirs.length === 1 ? 'deck' : 'decks'}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${CSS}</style>
</head>
<body>
  <div class="container">
    ${isRoot ? '' : `<nav class="breadcrumb"><a href="/">home</a> <span class="sep">/</span> ${breadcrumb}</nav>`}
    <header>
      <h1>${title}</h1>
      <p class="count">${count}</p>
    </header>
    <div class="list">${cards}</div>
  </div>
</body>
</html>`;
}