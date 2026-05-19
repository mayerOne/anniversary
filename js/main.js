// === 通用工具函数 ===
function loadJSON(url) {
    return fetch(url).then(r => {
        if (!r.ok) throw new Error('Failed to load ' + url);
        return r.json();
    });
}

function $(sel, ctx) { return (ctx || document).querySelector(sel); }

function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// === 导航栏 ===
function initNav(title) {
    const pages = [
        { label: '首页', href: '/' },
        { label: '时间线', href: '/pages/timeline.html' },
        { label: '照片墙', href: '/pages/gallery.html' },
        { label: '足迹', href: '/pages/map.html' },
        { label: '情书', href: '/pages/letters.html' },
        { label: '刮刮乐', href: '/pages/scratch.html' }
    ];

    const nav = document.createElement('nav');
    nav.className = 'nav';
    nav.innerHTML = `
        <div class="nav-title">❤ ${title || '我们的故事'}</div>
        <div class="nav-links">
            ${pages.map(p => {
                const isActive = location.pathname === p.href ||
                    (p.href === '/' && location.pathname === '/index.html') ||
                    (p.href !== '/' && location.pathname.endsWith(p.href));
                return `<a href="${p.href}" class="${isActive ? 'active' : ''}">${p.label}</a>`;
            }).join('')}
        </div>
    `;
    document.body.prepend(nav);
}

// === 音乐播放器（红玫瑰） ===
function initMusic() {
    const btn = document.createElement('button');
    btn.className = 'music-btn';
    btn.textContent = '♪';
    btn.title = '播放/暂停 - 红玫瑰';
    document.body.appendChild(btn);

    const audio = new Audio('https://music.163.com/song/media/outer/url?id=108106.mp3');
    audio.loop = true;
    let playing = false;

    btn.addEventListener('click', () => {
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
        } else {
            audio.play().then(() => {
                btn.classList.add('playing');
            }).catch(() => {});
        }
        playing = !playing;
    });
}

// === 页面初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    // 不在首页和密码页显示导航
    const isIndex = location.pathname === '/' ||
                    location.pathname === '/index.html' ||
                    location.pathname.endsWith('index.html');
    if (!isIndex) {
        initNav();
        initMusic();
    }
});
