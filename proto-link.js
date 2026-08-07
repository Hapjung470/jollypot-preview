/* ============================================================
   졸리팟 v2.0 프로토타입 상호 연결 (인덱스 허브)
   - 각 화면을 실제 앱처럼 클릭 이동시키는 연결 레이어
   - 원본 마크업/로직 무수정: 이벤트 위임 1개 + 내부 컨트롤 양보 가드
   ============================================================ */
(function () {
  var CUR = (location.pathname.split('/').pop() || '').toLowerCase();

  // 하단 탭 backbone (모든 화면 공통)
  var TAB = {
    '홈': 'jollypot-v2-home-v14-24.html',
    '쇼핑': 'jollypot-v2-search-v2-2.html',
    '스크랩북': 'jollypot-v2-scrapbook-v11-16-9.html',
    '마이': 'jollypot-v2-profile-my-v2-14.html'
  };
  var PLUS = 'jollypot-v2-recipe-create-v12.html';

  // 화면별 forward 규칙 [selector, destination]
  var RULES = [];
  function add(sel, to) { RULES.push([sel, to]); }
  var p = CUR;

  if (p.indexOf('home') >= 0) {
    add('.hdr-search', 'jollypot-v2-search-v2-2.html');
    add('.fridge-home-card', 'jollypot-v2-fridge-v3-1-1.html');
    add('.fridge-home', 'jollypot-v2-fridge-v3-1-1.html');
    add('.product-card', 'jollypot-v2-product-detail-v3-3-1.html');
    add('.full-recipe-card', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.compact-card', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.continue-card', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.deck-card-slot', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.summary-cta', 'jollypot-v2-scrapbook-v11-16-9.html');
  }
  if (p.indexOf('search') >= 0) {
    add('.gcard', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.pcard', 'jollypot-v2-product-detail-v3-3-1.html');
    add('.col-card', 'jollypot-v2-collection-detail-v5-3-2.html');
    add('.ac-row', 'jollypot-v2-recipe-detail-v1-8.html');
  }
  if (/recipe-detail|recipe-upgraded/.test(p)) {
    add('.header .header-icon:first-of-type', 'jollypot-v2-home-v14-24.html');   // ← 뒤로가기
    add('.header .header-icon:last-of-type', 'jollypot-v2-search-v2-2.html'); // 🔍 검색
    add('.shopping-card', 'jollypot-v2-product-detail-v3-3-1.html'); // v1.4 이하 장보기 카드
  }
  if (p.indexOf('cook-mode') >= 0) {
    add('.review-submit', 'jollypot-v2-cook-review-v2-4.html');
    add('.done-home', 'jollypot-v2-home-v14-24.html');
  }
  if (p.indexOf('cook-review') >= 0) {
    add('.c-btn', 'jollypot-v2-cook-mode-v11-1.html');
  }
  if (p.indexOf('scrapbook') >= 0) {
    add('.col-card', 'jollypot-v2-collection-detail-v5-3-2.html');
  }
  if (p.indexOf('collection-detail') >= 0) {
    add('.recipe-grid-item', 'jollypot-v2-recipe-detail-v1-8.html');
    add('.recipe-list-item', 'jollypot-v2-recipe-detail-v1-8.html');
  }
  if (p.indexOf('product-detail') >= 0) {
    add('.bs-buy', 'jollypot-v2-order-complete-v3-3-11.html');
  }
  if (p.indexOf('order-complete') >= 0) {
    add('.hd-close', 'jollypot-v2-home-v14-24.html');
    add('.oc-bb-sub', 'jollypot-v2-search-v2-2.html');
    add('.oc-bb-main', 'jollypot-v2-profile-my-v2-14.html');
    add('.oc-sheet-more', 'jollypot-v2-recipe-detail-v1-8.html');
  }
  if (p.indexOf('fridge') >= 0) {
    add('.recipe-card', 'jollypot-v2-recipe-detail-v1-8.html');
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
