import './style.css';

const address = document.querySelector('#address');
const startPage = document.querySelector('#startPage');
const webPage = document.querySelector('#webPage');
const pageDomain = document.querySelector('#pageDomain');
const tabs = document.querySelector('#tabs');
const panel = document.querySelector('#panel');
const panelTitle = document.querySelector('#panelTitle');
const panelLabel = document.querySelector('#panelLabel');
const panelContent = document.querySelector('#panelContent');
const bookmarks = JSON.parse(localStorage.getItem('potassium-bookmarks') || '[]');

function normalize(value) {
  if (!value.includes('.') && !value.startsWith('http')) return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  return value.match(/^https?:\/\//) ? value : `https://${value}`;
}
function visit(value) {
  const url = normalize(value);
  address.value = url;
  startPage.classList.add('hidden'); webPage.classList.remove('hidden');
  pageDomain.textContent = new URL(url).hostname;
}
function home() { address.value = 'potassium://newtab'; webPage.classList.add('hidden'); startPage.classList.remove('hidden'); }
function openPanel(label, title, content) { panelLabel.textContent = label; panelTitle.textContent = title; panelContent.innerHTML = content; panel.classList.remove('hidden'); }

document.querySelector('#addressForm').addEventListener('submit', (event) => { event.preventDefault(); address.value === 'potassium://newtab' ? home() : visit(address.value); });
document.querySelector('#searchForm').addEventListener('submit', (event) => { event.preventDefault(); visit(document.querySelector('#search').value); });
document.querySelector('#reload').addEventListener('click', () => { if (!webPage.classList.contains('hidden')) pageDomain.animate([{ opacity: .3 }, { opacity: 1 }], 350); });
document.querySelector('#back').addEventListener('click', home);
document.querySelector('#returnHome').addEventListener('click', home);
document.querySelector('#newTab').addEventListener('click', home);
document.querySelectorAll('.shortcut[data-url]').forEach((button) => button.addEventListener('click', () => visit(button.dataset.url)));
document.querySelector('#star').addEventListener('click', (event) => {
  if (address.value === 'potassium://newtab') return;
  const item = { title: pageDomain.textContent, url: address.value };
  if (!bookmarks.some((bookmark) => bookmark.url === item.url)) bookmarks.push(item);
  localStorage.setItem('potassium-bookmarks', JSON.stringify(bookmarks));
  event.currentTarget.textContent = '★';
});
document.querySelector('#showBookmarks').addEventListener('click', () => openPanel('YOUR SAVED PLACES', 'Bookmarks', bookmarks.length ? bookmarks.map((b) => `<a class="saved-link" href="${b.url}"><b>${b.title}</b><span>${b.url}</span></a>`).join('') : '<p class="empty">Bookmarks you add will live here.</p>'));
document.querySelector('#showHistory').addEventListener('click', () => openPanel('A QUIET RECORD', 'History', '<p class="empty">No pages visited in this session yet.</p>'));
document.querySelector('#showSettings').addEventListener('click', () => openPanel('POTASSIUM', 'Settings', '<div class="setting"><span>Enhanced tracking protection</span><b>On</b></div><div class="setting"><span>Default search</span><b>Google</b></div><div class="setting"><span>Theme</span><b>Midnight</b></div>'));
document.querySelector('#closePanel').addEventListener('click', () => panel.classList.add('hidden'));
document.querySelector('#addShortcut').addEventListener('click', () => openPanel('QUICK ACCESS', 'Add shortcut', '<p class="empty">Shortcut management is coming next.</p>'));
document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#search').focus(); } });
