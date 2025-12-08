if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + '.js', c).href),
    a[s] ||
      new Promise((a) => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (a[n]) return;
    let t = {};
    const r = (e) => s(e, n),
      p = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(c.map((e) => p[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '3e61ffe3a39466143a3d373422318526' },
        {
          url: '/_next/static/-p2fpUh17xcofBYuwe60f/_buildManifest.js',
          revision: '95827d94f12f255a0c4de3ace2c896b9',
        },
        {
          url: '/_next/static/-p2fpUh17xcofBYuwe60f/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js', revision: 'cb68bc606b8adb2f' },
        {
          url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js.map',
          revision: '6044c3cda550f8f0a4c878f41b4a12cf',
        },
        { url: '/_next/static/chunks/2130-9440918cc98b28a2.js', revision: '9440918cc98b28a2' },
        {
          url: '/_next/static/chunks/2130-9440918cc98b28a2.js.map',
          revision: 'b5b87bc321ddbec5a2350756f8667f4b',
        },
        { url: '/_next/static/chunks/2619-2fa8f07afac89bfa.js', revision: '2fa8f07afac89bfa' },
        {
          url: '/_next/static/chunks/2619-2fa8f07afac89bfa.js.map',
          revision: '80d5ddac088b07926c77ce5e889ee80d',
        },
        { url: '/_next/static/chunks/3155.dce1be846867b360.js', revision: 'dce1be846867b360' },
        {
          url: '/_next/static/chunks/3155.dce1be846867b360.js.map',
          revision: '528fb0a21353fba77de9326a7c7dfce7',
        },
        { url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js', revision: 'cb93e6eb70aa7b7c' },
        {
          url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js.map',
          revision: '750d46a935890c241ad7997202fda0d3',
        },
        { url: '/_next/static/chunks/3533.8aa1cc070d00734e.js', revision: '8aa1cc070d00734e' },
        {
          url: '/_next/static/chunks/3533.8aa1cc070d00734e.js.map',
          revision: 'a4a9f9836816367b32038235183a87c5',
        },
        { url: '/_next/static/chunks/4827-033f2b1d242675df.js', revision: '033f2b1d242675df' },
        {
          url: '/_next/static/chunks/4827-033f2b1d242675df.js.map',
          revision: 'ea24fc0d3249d27fa737842bd8693fa5',
        },
        { url: '/_next/static/chunks/4bd1b696-da8ec446eee1ed33.js', revision: 'da8ec446eee1ed33' },
        {
          url: '/_next/static/chunks/4bd1b696-da8ec446eee1ed33.js.map',
          revision: '625a8de220441c49ab3bb089cd48c956',
        },
        { url: '/_next/static/chunks/5139.d957c13d00a3b110.js', revision: 'd957c13d00a3b110' },
        {
          url: '/_next/static/chunks/5139.d957c13d00a3b110.js.map',
          revision: 'bd28b743403f3e5e5767dd0d37ce80cc',
        },
        { url: '/_next/static/chunks/52774a7f-3b2427fd8f665032.js', revision: '3b2427fd8f665032' },
        {
          url: '/_next/static/chunks/52774a7f-3b2427fd8f665032.js.map',
          revision: '07703f6288bd5a9d507a128da7710225',
        },
        { url: '/_next/static/chunks/5376-229e6f0615d10734.js', revision: '229e6f0615d10734' },
        {
          url: '/_next/static/chunks/5376-229e6f0615d10734.js.map',
          revision: 'f463b8f007e00e69abd0d8bbc213b298',
        },
        { url: '/_next/static/chunks/6002.6c4d8afe626502e7.js', revision: '6c4d8afe626502e7' },
        {
          url: '/_next/static/chunks/6002.6c4d8afe626502e7.js.map',
          revision: '77c7f78de86063f7a90300259b864d00',
        },
        { url: '/_next/static/chunks/7131-43fafd1ba78e67eb.js', revision: '43fafd1ba78e67eb' },
        {
          url: '/_next/static/chunks/7131-43fafd1ba78e67eb.js.map',
          revision: 'dbcbd99c62cf3e4bc0a1d8a8a9025a3b',
        },
        { url: '/_next/static/chunks/7210.400190c543ea84c5.js', revision: '400190c543ea84c5' },
        {
          url: '/_next/static/chunks/7210.400190c543ea84c5.js.map',
          revision: '44686ce2ae4a77f7bfbab353a2190434',
        },
        { url: '/_next/static/chunks/7602.2b4fb81c4701f905.js', revision: '2b4fb81c4701f905' },
        {
          url: '/_next/static/chunks/7602.2b4fb81c4701f905.js.map',
          revision: '757e2c4be669f60d9b8a12b8ecbe7495',
        },
        { url: '/_next/static/chunks/8598-742ff86fbe342b3f.js', revision: '742ff86fbe342b3f' },
        {
          url: '/_next/static/chunks/8598-742ff86fbe342b3f.js.map',
          revision: '10d266cea5be94bc7b3201b96c3534e4',
        },
        { url: '/_next/static/chunks/991.f263d50d4834ceac.js', revision: 'f263d50d4834ceac' },
        {
          url: '/_next/static/chunks/991.f263d50d4834ceac.js.map',
          revision: '82a41cc2ba63ee6363ec57eeaf393c55',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-cdaa0bd30451bca1.js',
          revision: 'cdaa0bd30451bca1',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-cdaa0bd30451bca1.js.map',
          revision: '2badb532ad9ec45ab839663c5208c7ab',
        },
        {
          url: '/_next/static/chunks/app/admin/layout-c3bf979d9ffa4659.js',
          revision: 'c3bf979d9ffa4659',
        },
        {
          url: '/_next/static/chunks/app/admin/layout-c3bf979d9ffa4659.js.map',
          revision: '11f2e111bcd0f079266b4eff9e549911',
        },
        {
          url: '/_next/static/chunks/app/admin/page-62ee6ee085045bcd.js',
          revision: '62ee6ee085045bcd',
        },
        {
          url: '/_next/static/chunks/app/admin/page-62ee6ee085045bcd.js.map',
          revision: '068e7edbf6acfd8a4f1fc69da12b28bc',
        },
        {
          url: '/_next/static/chunks/app/admin/programs/page-92309a9c69093b98.js',
          revision: '92309a9c69093b98',
        },
        {
          url: '/_next/static/chunks/app/admin/programs/page-92309a9c69093b98.js.map',
          revision: '77288aedd1cacff237e79ab8db52878a',
        },
        {
          url: '/_next/static/chunks/app/admin/reviews/page-82808e77b2305aef.js',
          revision: '82808e77b2305aef',
        },
        {
          url: '/_next/static/chunks/app/admin/reviews/page-82808e77b2305aef.js.map',
          revision: '55a6d1c041fa3c68d8f1d79f159ab704',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-0025262c032a9c49.js',
          revision: '0025262c032a9c49',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-0025262c032a9c49.js.map',
          revision: 'e426148a580074961a31dba2b4603597',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-0a5074755c8b7e2f.js',
          revision: '0a5074755c8b7e2f',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-0a5074755c8b7e2f.js.map',
          revision: 'b7448a72f3c948f7cf01072b57424546',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-b9f7e24feb7c8bcb.js',
          revision: 'b9f7e24feb7c8bcb',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/%5Bid%5D/route-b8a4ed13504f1a1d.js',
          revision: 'b8a4ed13504f1a1d',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/route-4a64749b4ed6e53c.js',
          revision: '4a64749b4ed6e53c',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/%5Bid%5D/route-527b1eea9fc3c7a4.js',
          revision: '527b1eea9fc3c7a4',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/route-91d746a3d50ad5f9.js',
          revision: '91d746a3d50ad5f9',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-f7af6b2cc0ea4e94.js',
          revision: 'f7af6b2cc0ea4e94',
        },
        {
          url: '/_next/static/chunks/app/api/admin/users/route-a99c1a9d8ff4b975.js',
          revision: 'a99c1a9d8ff4b975',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-2d0d01098dbc78ea.js',
          revision: '2d0d01098dbc78ea',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/dashboard/route-0b6dee5f495836d1.js',
          revision: '0b6dee5f495836d1',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/export/route-085a46651ddeb83d.js',
          revision: '085a46651ddeb83d',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-725d58f3e2e33bce.js',
          revision: '725d58f3e2e33bce',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-d787f87938969413.js',
          revision: 'd787f87938969413',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-b62551027757f6f3.js',
          revision: 'b62551027757f6f3',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-934f1fc16c0d74f0.js',
          revision: '934f1fc16c0d74f0',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-197127d5c21b730b.js',
          revision: '197127d5c21b730b',
        },
        {
          url: '/_next/static/chunks/app/api/audit-logs/route-123978e4212dc9c4.js',
          revision: '123978e4212dc9c4',
        },
        {
          url: '/_next/static/chunks/app/api/auth/2fa/route-bc77b78866700a02.js',
          revision: 'bc77b78866700a02',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-ec2134f60fcadd3c.js',
          revision: 'ec2134f60fcadd3c',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-d7aec4420544c52b.js',
          revision: 'd7aec4420544c52b',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-4e3d733061771e55.js',
          revision: '4e3d733061771e55',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-6bf42499fa01d1bd.js',
          revision: '6bf42499fa01d1bd',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-1ce4a440584e7121.js',
          revision: '1ce4a440584e7121',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-1f2700fa081ac0e6.js',
          revision: '1f2700fa081ac0e6',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-178f6565b5b889ed.js',
          revision: '178f6565b5b889ed',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-eea2e5629f8b8be9.js',
          revision: 'eea2e5629f8b8be9',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-921d36962e5fd182.js',
          revision: '921d36962e5fd182',
        },
        {
          url: '/_next/static/chunks/app/api/experiments/route-7b3ef3682e7b9250.js',
          revision: '7b3ef3682e7b9250',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-8833f344df529beb.js',
          revision: '8833f344df529beb',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/achievements/route-f5933a07a5975ec7.js',
          revision: 'f5933a07a5975ec7',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/leaderboard/route-3152f031dd635230.js',
          revision: '3152f031dd635230',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/points/route-a2294a568ba2ea82.js',
          revision: 'a2294a568ba2ea82',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-c26d2c73e7b506ff.js',
          revision: 'c26d2c73e7b506ff',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-e5f7620b5d9f2d25.js',
          revision: 'e5f7620b5d9f2d25',
        },
        {
          url: '/_next/static/chunks/app/api/integrations/api-keys/route-bbd94db48f7d6a64.js',
          revision: 'bbd94db48f7d6a64',
        },
        {
          url: '/_next/static/chunks/app/api/integrations/route-654de6aa799aa5eb.js',
          revision: '654de6aa799aa5eb',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-cf6e226790f35b91.js',
          revision: 'cf6e226790f35b91',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-9f7a1e5970985683.js',
          revision: '9f7a1e5970985683',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-4c6456ffa3cf69d9.js',
          revision: '4c6456ffa3cf69d9',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-cea9184e09f3fb5a.js',
          revision: 'cea9184e09f3fb5a',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-51957681e43575c0.js',
          revision: '51957681e43575c0',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-0aebaba2e6e2085f.js',
          revision: '0aebaba2e6e2085f',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-1cd7c0173680f472.js',
          revision: '1cd7c0173680f472',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-40a5307bb405df73.js',
          revision: '40a5307bb405df73',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-2f102e0293ceb963.js',
          revision: '2f102e0293ceb963',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-ee4d90dec0891b5c.js',
          revision: 'ee4d90dec0891b5c',
        },
        {
          url: '/_next/static/chunks/app/api/programs/search/route-4a23cb2e1538c44d.js',
          revision: '4a23cb2e1538c44d',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-38b440435d0de065.js',
          revision: '38b440435d0de065',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-96d3f0c941026014.js',
          revision: '96d3f0c941026014',
        },
        {
          url: '/_next/static/chunks/app/api/realtime/route-aac231b831da9f09.js',
          revision: 'aac231b831da9f09',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-0f524c7ef57a88dd.js',
          revision: '0f524c7ef57a88dd',
        },
        {
          url: '/_next/static/chunks/app/api/reports/route-702adfd4b62dbe76.js',
          revision: '702adfd4b62dbe76',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-0c6fe241eee3fe7a.js',
          revision: '0c6fe241eee3fe7a',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-a7d8e72d5153c6d8.js',
          revision: 'a7d8e72d5153c6d8',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-afd3f0f4da5aca2f.js',
          revision: 'afd3f0f4da5aca2f',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-c0d42809776b3179.js',
          revision: 'c0d42809776b3179',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-bebda908cfcc726a.js',
          revision: 'bebda908cfcc726a',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-3729b78e156fdd3a.js',
          revision: '3729b78e156fdd3a',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-137697dd57f94888.js',
          revision: '137697dd57f94888',
        },
        {
          url: '/_next/static/chunks/app/api/webhooks/route-eca74b979e83dd97.js',
          revision: 'eca74b979e83dd97',
        },
        {
          url: '/_next/static/chunks/app/applications/page-3e4730b9b6f7121a.js',
          revision: '3e4730b9b6f7121a',
        },
        {
          url: '/_next/static/chunks/app/applications/page-3e4730b9b6f7121a.js.map',
          revision: '5f9b0a46a90bf7965ce5f48e1bde6781',
        },
        {
          url: '/_next/static/chunks/app/auth/callback/route-08c007ec3d9a7ddc.js',
          revision: '08c007ec3d9a7ddc',
        },
        {
          url: '/_next/static/chunks/app/billing/page-f5e1f11cf278c273.js',
          revision: 'f5e1f11cf278c273',
        },
        {
          url: '/_next/static/chunks/app/billing/page-f5e1f11cf278c273.js.map',
          revision: '8643466897d3e05b0c55a39daaa1e9a8',
        },
        {
          url: '/_next/static/chunks/app/billing/success/page-4f3f33c44938b48e.js',
          revision: '4f3f33c44938b48e',
        },
        {
          url: '/_next/static/chunks/app/billing/success/page-4f3f33c44938b48e.js.map',
          revision: '108f6cab4011824014c2e2317e077068',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-9cd2aac7ba1b8c71.js',
          revision: '9cd2aac7ba1b8c71',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-9cd2aac7ba1b8c71.js.map',
          revision: '955d21c6d57d9a613899877d63e13480',
        },
        {
          url: '/_next/static/chunks/app/blog/page-67d6600ba7b1089f.js',
          revision: '67d6600ba7b1089f',
        },
        {
          url: '/_next/static/chunks/app/blog/page-67d6600ba7b1089f.js.map',
          revision: '20ca457f226ee8870ef8746d36216787',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-8f1a9a4d8f450e00.js',
          revision: '8f1a9a4d8f450e00',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-8f1a9a4d8f450e00.js.map',
          revision: 'aea58fe7e902bcd1c3e02b2ce323d9a6',
        },
        {
          url: '/_next/static/chunks/app/compare/page-66bf36f7ce4c52f0.js',
          revision: '66bf36f7ce4c52f0',
        },
        {
          url: '/_next/static/chunks/app/compare/page-66bf36f7ce4c52f0.js.map',
          revision: '19f54538e14f7f8ec22d3f682741222b',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-1d7f5fa31d844bfe.js',
          revision: '1d7f5fa31d844bfe',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-1d7f5fa31d844bfe.js.map',
          revision: 'ce82118e691702995103fc3496ecc7d1',
        },
        { url: '/_next/static/chunks/app/error-bd0b5d619db8cd9b.js', revision: 'bd0b5d619db8cd9b' },
        {
          url: '/_next/static/chunks/app/error-bd0b5d619db8cd9b.js.map',
          revision: '8974efc7816c9ddc694334a1ee80c6bd',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-a44967e1d5365d6a.js',
          revision: 'a44967e1d5365d6a',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-a44967e1d5365d6a.js.map',
          revision: '6022c2a48f344dc90e4277d66554651c',
        },
        {
          url: '/_next/static/chunks/app/global-error-8ad5fd15c98231e0.js',
          revision: '8ad5fd15c98231e0',
        },
        {
          url: '/_next/static/chunks/app/global-error-8ad5fd15c98231e0.js.map',
          revision: '482c75848523acc53cb8fdc7e420d43f',
        },
        {
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-17a0d778acb75d9a.js',
          revision: '17a0d778acb75d9a',
        },
        {
          url: '/_next/static/chunks/app/integrations/page-8338564850b99dcb.js',
          revision: '8338564850b99dcb',
        },
        {
          url: '/_next/static/chunks/app/integrations/page-8338564850b99dcb.js.map',
          revision: 'e468e7d3b024aafb7c52f581edf56170',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-919d764fe7944278.js',
          revision: '919d764fe7944278',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-919d764fe7944278.js.map',
          revision: '96a3927dec64bea1a5bac25af3bb9c7c',
        },
        {
          url: '/_next/static/chunks/app/layout-386c39547c592e35.js',
          revision: '386c39547c592e35',
        },
        {
          url: '/_next/static/chunks/app/layout-386c39547c592e35.js.map',
          revision: '820af4129bf82e01fa48d3485b42dc8f',
        },
        {
          url: '/_next/static/chunks/app/login/page-e001e39f349bb92a.js',
          revision: 'e001e39f349bb92a',
        },
        {
          url: '/_next/static/chunks/app/login/page-e001e39f349bb92a.js.map',
          revision: 'f5768ff2b95d72160642d96f373616bf',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-e8d4fd294ab090e2.js',
          revision: 'e8d4fd294ab090e2',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-e8d4fd294ab090e2.js.map',
          revision: 'e4805c4dc55a141383f95887aef0279a',
        },
        {
          url: '/_next/static/chunks/app/offline/page-14438418f0ded247.js',
          revision: '14438418f0ded247',
        },
        {
          url: '/_next/static/chunks/app/offline/page-14438418f0ded247.js.map',
          revision: 'a4fe8338436746ddaf7af6cd7b6b2ef7',
        },
        { url: '/_next/static/chunks/app/page-433ed25861a3c774.js', revision: '433ed25861a3c774' },
        {
          url: '/_next/static/chunks/app/page-433ed25861a3c774.js.map',
          revision: '1fd7ee80df15c1bd62bed860934efe9d',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-595babbffdd29887.js',
          revision: '595babbffdd29887',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-595babbffdd29887.js.map',
          revision: '71e445a553c9a5002da0eaf2d02282bf',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-6126895b10e29e79.js',
          revision: '6126895b10e29e79',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-6126895b10e29e79.js.map',
          revision: 'dc3c4eaa345941158bb172dce9b4b4e7',
        },
        {
          url: '/_next/static/chunks/app/programs/page-158130bd602d998e.js',
          revision: '158130bd602d998e',
        },
        {
          url: '/_next/static/chunks/app/programs/page-158130bd602d998e.js.map',
          revision: '5b7193e473897256af6867d6ab0f8695',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-a7c32215711b5af4.js',
          revision: 'a7c32215711b5af4',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-a7c32215711b5af4.js.map',
          revision: '77753d2cf45c67ada0e1d044f942da11',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-584bf998e20cc58b.js',
          revision: '584bf998e20cc58b',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-584bf998e20cc58b.js.map',
          revision: '16b0c2fe874ea9ebe099bc5dc426fef0',
        },
        {
          url: '/_next/static/chunks/app/rewards/page-3a9c6dee475cd846.js',
          revision: '3a9c6dee475cd846',
        },
        {
          url: '/_next/static/chunks/app/rewards/page-3a9c6dee475cd846.js.map',
          revision: '01f959db0cc4fb5e34611d770660b6b9',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-fa74b9259d931500.js',
          revision: 'fa74b9259d931500',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-5cab26f9fae46787.js',
          revision: '5cab26f9fae46787',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-5cab26f9fae46787.js.map',
          revision: 'd14d4953d6892f0c0eaf44359a509994',
        },
        {
          url: '/_next/static/chunks/app/settings/page-544fd021e8d6240c.js',
          revision: '544fd021e8d6240c',
        },
        {
          url: '/_next/static/chunks/app/settings/page-544fd021e8d6240c.js.map',
          revision: 'e95ae320207f7a8dd4b50392b34b1ee9',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-962adc4ef6849c3b.js',
          revision: '962adc4ef6849c3b',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-962adc4ef6849c3b.js.map',
          revision: '5279bbbebda5261e8ed8783b17a98a4e',
        },
        {
          url: '/_next/static/chunks/app/signup/page-8758d89de7e12221.js',
          revision: '8758d89de7e12221',
        },
        {
          url: '/_next/static/chunks/app/signup/page-8758d89de7e12221.js.map',
          revision: '65efc857def6d6677d8d1884d624cad7',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-307f9ef1637a6380.js',
          revision: '307f9ef1637a6380',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-0833ffd6808d476a.js', revision: '0833ffd6808d476a' },
        {
          url: '/_next/static/chunks/main-0833ffd6808d476a.js.map',
          revision: '50a4335250441cef164ddc8553975a72',
        },
        { url: '/_next/static/chunks/main-app-e0ac38a7808e8654.js', revision: 'e0ac38a7808e8654' },
        {
          url: '/_next/static/chunks/main-app-e0ac38a7808e8654.js.map',
          revision: '485a11101ac92e70b07b72109be694de',
        },
        {
          url: '/_next/static/chunks/pages/_app-b8bf72d3c35ea391.js',
          revision: 'b8bf72d3c35ea391',
        },
        {
          url: '/_next/static/chunks/pages/_app-b8bf72d3c35ea391.js.map',
          revision: '7e0cb78419491a186667ecc0dda1a56b',
        },
        {
          url: '/_next/static/chunks/pages/_error-ce0a3cb1e3698191.js',
          revision: 'ce0a3cb1e3698191',
        },
        {
          url: '/_next/static/chunks/pages/_error-ce0a3cb1e3698191.js.map',
          revision: 'a0388d981bc0471f4e0d028a63bd00b7',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-62459eb345e78631.js', revision: '62459eb345e78631' },
        {
          url: '/_next/static/chunks/webpack-62459eb345e78631.js.map',
          revision: 'b690e478842c1056e6c166932a7b1689',
        },
        { url: '/_next/static/css/08db370cb6bfb5f6.css', revision: '08db370cb6bfb5f6' },
        {
          url: '/_next/static/css/08db370cb6bfb5f6.css.map',
          revision: '56c893a9314cdd166aa0d560229be2aa',
        },
        { url: '/google9ee8e3822b3beb94.html', revision: '281552f13282f41f13f2fe056f29d403' },
        { url: '/icons/favicon-16x16.png', revision: 'f56892089e66757a90c87d5650458e1c' },
        { url: '/icons/favicon-32x32.png', revision: '8639602119e0f4111739b8cd74dbf0d3' },
        { url: '/icons/icon-128x128.png', revision: '0649424edfded91292e1ca1ddd97c93a' },
        { url: '/icons/icon-144x144.png', revision: '0bcb2fa9b5cf371553c26f088f77574e' },
        { url: '/icons/icon-152x152.png', revision: 'be68e147d0f131bb4263958297b91559' },
        { url: '/icons/icon-192x192.png', revision: '74891adb03f5b2e8867a80829c6728d2' },
        { url: '/icons/icon-384x384.png', revision: 'c2597a0186b0cf73f4797be78ec4aefa' },
        { url: '/icons/icon-512x512.png', revision: '4ef30aebf7f68d55c8e099043faae175' },
        { url: '/icons/icon-72x72.png', revision: 'c97f96f5943813864a8d362e5501b0bd' },
        { url: '/icons/icon-96x96.png', revision: '2730762556a00e48790c11e1464a2492' },
        { url: '/icons/maskable-icon-512x512.png', revision: '9b689a6f4c32e745236be77304b6af18' },
        { url: '/manifest.json', revision: '35ac306104ea3806a14f367067fc765d' },
        { url: '/version.json', revision: '9f2e54113ab8468022e28024e425c607' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: a, event: s, state: c }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, { status: 200, statusText: 'OK', headers: a.headers })
                : a,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET'
    ));
});
//# sourceMappingURL=sw.js.map
