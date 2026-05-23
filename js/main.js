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
        { label: '刮刮乐', href: BASE + '/pages/scratch.html' }
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
            { label: '刮刮乐', href: './pages/scratch.html' }
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
    btn.title = '加载中...';
    document.body.appendChild(btn);

    var audio = null;
    var playing = false;

    function tryFetchUrl(url) {
        return fetch(url).then(function(r) {
            return r.blob();
        }).then(function(blob) {
            return URL.createObjectURL(blob);
        });
    }

    function tryProxyApi(apiUrl) {
        return fetch(apiUrl).then(function(r) { return r.json(); }).then(function(data) {
            var u = data.url || (data.data && data.data.url);
            if (!u) throw new Error('No url');
            return u;
        });
    }

    function initAudio(url) {
        audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.6;
        btn.title = '播放 - 陈奕迅 · 红玫瑰';
        btn.classList.add('ready');
    }

    // 方案1: 直接 fetch NetEase API 重定向后的 blob
    tryFetchUrl('https://music.163.com/song/media/outer/url?id=65538.mp3').then(initAudio).catch(function() {
        // 方案2: 代理 API 获取真实地址
        tryProxyApi('https://api.uomg.com/api/wangyiyun?types=url&id=65538').then(function(url) {
            return tryFetchUrl(url);
        }).then(initAudio).catch(function() {
            // 方案3: 另一个代理
            tryProxyApi('https://api.qqsuu.cn/api/wyymusic?type=url&id=65538').then(function(url) {
                return tryFetchUrl(url);
            }).then(initAudio).catch(function() {
                btn.title = '音乐加载失败，请稍后重试';
            });
        });
    });

    btn.addEventListener('click', function() {
        if (!audio) return;
        if (playing) {
            audio.pause();
            btn.classList.remove('playing');
        } else {
            audio.play().then(function() {
                btn.classList.add('playing');
            }).catch(function() {});
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
