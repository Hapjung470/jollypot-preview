/* ============================================================
   졸리팟 v2.0 프로토타입 상호 연결 (인덱스 허브)
   - 각 화면을 실제 앱처럼 클릭 이동시키는 연결 레이어
   - 원본 마크업/로직 무수정: 이벤트 위임 1개 + 내부 컨트롤 양보 가드
   ============================================================ */
(function () {
  var CUR = (location.pathname.split('/').pop() || '').toLowerCase();

  // 하단 탭 backbone (모든 화면 공통)
  var TAB = {
    '홈': 'home-v14-9-8.html',
    '쇼핑': 'search-v2-2.html',
    '스크랩북': 'scrapbook-v11-16-9.html',
    '마이': 'my-v2-14.html'
  };
  var PLUS = 'recipe-create-v12.html';

  // 화면별 forward 규칙 [selector, destination]
  var RULES = [];
  function add(sel, to) { RULES.push([sel, to]); }
  var p = CUR;

  if (p.indexOf('home') >= 0) {
    add('.hdr-search', 'search-v2-2.html');
    add('.fridge-home-card', 'fridge-v3-1-1.html');
    add('.fridge-home', 'fridge-v3-1-1.html');
    add('.product-card', 'product-detail-v3-3-1.html');
    add('.full-recipe-card', 'recipe-v1.4.html');
    add('.compact-card', 'recipe-v1.4.html');
    add('.continue-card', 'recipe-v1.4.html');
    add('.deck-card-slot', 'recipe-v1.4.html');
    add('.summary-cta', 'scrapbook-v11-16-9.html');
  }
  if (p.indexOf('search') >= 0) {
    add('.gcard', 'recipe-v1.4.html');
    add('.pcard', 'product-detail-v3-3-1.html');
    add('.col-card', 'collection-detail-v5-3-2.html');
    add('.ac-row', 'recipe-v1.4.html');
  }
  if (/recipe-v1|recipe-v3-24|recipe-upgraded/.test(p)) {
    add('.shopping-card', 'product-detail-v3-3-1.html');
  }
  if (p.indexOf('cook-mode') >= 0) {
    add('.review-submit', 'cook-review-v2-4.html');
    add('.done-home', 'home-v14-9-8.html');
  }
  if (p.indexOf('cook-review') >= 0) {
    add('.c-btn', 'cook-mode-v11-1.html');
  }
  if (p.indexOf('scrapbook') >= 0) {
    add('.col-card', 'collection-detail-v5-3-2.html');
  }
  if (p.indexOf('collection-detail') >= 0) {
    add('.recipe-grid-item', 'recipe-v1.4.html');
    add('.recipe-list-item', 'recipe-v1.4.html');
  }
  if (p.indexOf('product-detail') >= 0) {
    add('.bs-buy', 'order-complete-v3-3-11.html');
  }
  if (p.indexOf('order-complete') >= 0) {
    add('.hd-close', 'home-v14-9-8.html');
    add('.oc-bb-sub', 'search-v2-2.html');
    add('.oc-bb-main', 'my-v2-14.html');
    add('.oc-sheet-more', 'recipe-v1.4.html');
  }
  if (p.indexOf('fridge') >= 0) {
    add('.recipe-card', 'recipe-v1.4.html');
  }

  function kor(s) { return (s || '').replace(/[^가-힣]/g, ''); }
  function nav(to) {
    if (!to || to.toLowerCase() === CUR) return false;
    location.href = to;
    return true;
  }

  document.addEventListener('click', function (e) {
    // (1) 화면별 forward 규칙 — 내부 인터랙티브 컨트롤은 양보
    for (var i = 0; i < RULES.length; i++) {
      var hit = e.target.closest(RULES[i][0]);
      if (!hit) continue;
      var act = e.target.closest('button,a,input,textarea,select,[onclick]');
      if (act && hit.contains(act) && act !== hit) continue; // 내부 컨트롤 클릭 → 원래 동작 유지
      if (RULES[i][1].toLowerCase() === CUR) return;
      e.preventDefault();
      if (nav(RULES[i][1])) return;
    }

    // (2) 하단 탭 backbone — 네비 맥락 안에서만, 라벨 텍스트로 판별
    if (!e.target.closest('[class*="nav"]')) return;
    if (e.target.closest('[class*="plus"]')) { e.preventDefault(); nav(PLUS); return; }
    var node = e.target;
    for (var h = 0; node && h < 4; h++, node = node.parentElement) {
      var len = (node.textContent || '').replace(/\s/g, '').length;
      var k = kor(node.textContent);
      if (TAB[k] && len <= 8) { e.preventDefault(); nav(TAB[k]); return; }
    }
  }, false);
})();
