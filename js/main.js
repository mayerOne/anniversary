// === 基础路径检测 ===
function getBasePath() {
    var p = window.location.pathname;
    if (p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('index.html')) {
        return '';
    }
    // 在 /pages/xxx.html 等子目录中，返回 ..
    if (p.lastIndexOf('/pages/') !== -1) {
        return '..';
    }
    return '';
}

var BASE = getBasePath();

// === 通用工具 ===
function loadJSON(url) {
    return fetch(url).then(function(r) {
        if (!r.ok) throw new Error('Failed to load ' + url);
        return r.json();
    });
}

function $(sel, ctx) { return (ctx || document).querySelector(sel); }

function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// === 导航栏 ===
function initNav(title) {
    var pages = [
        { label: '首页', href: BASE + '/index.html' },
        { label: '时间线', href: BASE + '/pages/timeline.html' },
        { label: '照片墙', href: BASE + '/pages/gallery.html' },
        { label: '足迹', href: BASE + '/pages/map.html' },
        { label: '情书', href: BASE + '/pages/letters.html' },
        { label: '大转盘', href: BASE + '/pages/scratch.html' }
    ];

    // Fix: if BASE is empty (at root), remove leading / to make relative
    // If BASE is '..', keep as '../index.html' etc.
    if (BASE === '') {
        pages = [
            { label: '首页', href: './index.html' },
            { label: '时间线', href: './pages/timeline.html' },
            { label: '照片墙', href: './pages/gallery.html' },
            { label: '足迹', href: './pages/map.html' },
            { label: '情书', href: './pages/letters.html' },
            { label: '大转盘', href: './pages/scratch.html' }
        ];
    }

    var nav = document.createElement('nav');
    nav.className = 'nav';
    nav.innerHTML = `
        <div class="nav-title">❤ ${title || '我们的故事'}</div>
        <div class="nav-links">
            ${pages.map(function(p) {
                var isActive = location.pathname === p.href ||
                    (p.href.indexOf('index.html') !== -1 && (location.pathname.endsWith('/') || location.pathname.endsWith('/index.html'))) ||
                    location.pathname.endsWith(p.href);
                var isActive2 = false;
                // Match sub-pages
                if (p.href.indexOf('timeline') !== -1 && location.pathname.indexOf('timeline') !== -1) isActive2 = true;
                if (p.href.indexOf('gallery') !== -1 && location.pathname.indexOf('gallery') !== -1) isActive2 = true;
                if (p.href.indexOf('/map') !== -1 && location.pathname.indexOf('/map') !== -1) isActive2 = true;
                if (p.href.indexOf('letters') !== -1 && location.pathname.indexOf('letters') !== -1) isActive2 = true;
                if (p.href.indexOf('scratch') !== -1 && location.pathname.indexOf('scratch') !== -1) isActive2 = true;
                return '<a href="' + p.href + '" class="' + (isActive || isActive2 ? 'active' : '') + '">' + p.label + '</a>';
            }).join('')}
        </div>
    `;
    document.body.prepend(nav);
}

// === 音乐播放器（陈奕迅 - 红玫瑰） ===
function initMusic() {
    if (document.querySelector('.music-btn')) return;
    var btn = document.createElement('button');
    btn.className = 'music-btn';
    btn.textContent = '♪';
    btn.title = '播放/暂停 - 陈奕迅 · 红玫瑰';
    document.body.appendChild(btn);

    // 本地文件，网易云外链已封杀红玫瑰
    var audioSrc = BASE === '' ? './audio/red-rose.mp3' : BASE + '/audio/red-rose.mp3';
    var audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = 0.6;
    var playing = false;

    btn.addEventListener('click', function() {
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
        } else {
            audio.play().then(function() {
                btn.classList.add('playing');
            }).catch(function() {
                btn.title = '请将 red-rose.mp3 放入 audio 文件夹';
            });
        }
        playing = !playing;
    });
}

// === 页面初始化 ===
document.addEventListener('DOMContentLoaded', function() {
    var p = location.pathname;
    var isIndex = p === '/' || p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('index.html');
    if (!isIndex) {
        initNav();
        initMusic();
    }
});

// 导出到全局
window.initMusic = initMusic;
window.getBasePath = getBasePath;
