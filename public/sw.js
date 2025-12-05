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
        { url: '/_next/app-build-manifest.json', revision: 'bdc78f9316ede542a1f44f02a97345cf' },
        {
          url: '/_next/static/PD-j_9unvh61uy19_x6wG/_buildManifest.js',
          revision: '0ed9b0bb70603b11a819dc3b42a124b3',
        },
        {
          url: '/_next/static/PD-j_9unvh61uy19_x6wG/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js', revision: 'cb68bc606b8adb2f' },
        {
          url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js.map',
          revision: '6044c3cda550f8f0a4c878f41b4a12cf',
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
        { url: '/_next/static/chunks/3596-636e16efb9011d69.js', revision: '636e16efb9011d69' },
        {
          url: '/_next/static/chunks/3596-636e16efb9011d69.js.map',
          revision: 'a76e84c5668267091b63cf4b0585f4de',
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
        { url: '/_next/static/chunks/7131-2349db9b3f269512.js', revision: '2349db9b3f269512' },
        {
          url: '/_next/static/chunks/7131-2349db9b3f269512.js.map',
          revision: '345224d02937adc938e45c8279a30890',
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
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-3c8a409081e5a8c1.js',
          revision: '3c8a409081e5a8c1',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/%5Bid%5D/route-9897f7067b1be4f5.js',
          revision: '9897f7067b1be4f5',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/route-5449a160498242e3.js',
          revision: '5449a160498242e3',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/%5Bid%5D/route-793d573118a90761.js',
          revision: '793d573118a90761',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/route-4e8d677a0412d66c.js',
          revision: '4e8d677a0412d66c',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-5e9f37ef0155ac33.js',
          revision: '5e9f37ef0155ac33',
        },
        {
          url: '/_next/static/chunks/app/api/admin/users/route-49a2d634095e204e.js',
          revision: '49a2d634095e204e',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-dd88352c31e1bcd8.js',
          revision: 'dd88352c31e1bcd8',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/dashboard/route-c0253e2c7714e42a.js',
          revision: 'c0253e2c7714e42a',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/export/route-2b32ccdc2c62c063.js',
          revision: '2b32ccdc2c62c063',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-2218321e4ac3c457.js',
          revision: '2218321e4ac3c457',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-ca78d3148f5451ce.js',
          revision: 'ca78d3148f5451ce',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-1bf1a129102eef97.js',
          revision: '1bf1a129102eef97',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-549014d18553ebc7.js',
          revision: '549014d18553ebc7',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-cc95f4ac994b19a0.js',
          revision: 'cc95f4ac994b19a0',
        },
        {
          url: '/_next/static/chunks/app/api/audit-logs/route-2196c0bccb493709.js',
          revision: '2196c0bccb493709',
        },
        {
          url: '/_next/static/chunks/app/api/auth/2fa/route-bea5cc2572ca6c8b.js',
          revision: 'bea5cc2572ca6c8b',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-d5672f30f6d4363f.js',
          revision: 'd5672f30f6d4363f',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-05be625bd027f10e.js',
          revision: '05be625bd027f10e',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-6a4233a6c35c06d5.js',
          revision: '6a4233a6c35c06d5',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-50dfa9e7aa9bd3ba.js',
          revision: '50dfa9e7aa9bd3ba',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-726dc3989f791ec1.js',
          revision: '726dc3989f791ec1',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-f51776493a7bdbe1.js',
          revision: 'f51776493a7bdbe1',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-399fe8de3b3659c9.js',
          revision: '399fe8de3b3659c9',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-97d1cfe5b3d91a55.js',
          revision: '97d1cfe5b3d91a55',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-a015361137902ed5.js',
          revision: 'a015361137902ed5',
        },
        {
          url: '/_next/static/chunks/app/api/experiments/route-ad1622d45acdb3cd.js',
          revision: 'ad1622d45acdb3cd',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-89ababf5812c4ba6.js',
          revision: '89ababf5812c4ba6',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/achievements/route-fb20531d1b542b1d.js',
          revision: 'fb20531d1b542b1d',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/leaderboard/route-a2afc28ae8b59504.js',
          revision: 'a2afc28ae8b59504',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/points/route-d6c91485e24d8be6.js',
          revision: 'd6c91485e24d8be6',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-c2b2e6a090bcd3fb.js',
          revision: 'c2b2e6a090bcd3fb',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-a304cade40e4066e.js',
          revision: 'a304cade40e4066e',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-a9ef3923d731a06a.js',
          revision: 'a9ef3923d731a06a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-5329a9214bab945f.js',
          revision: '5329a9214bab945f',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-39184df36ecc2c1c.js',
          revision: '39184df36ecc2c1c',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-fdbbd45fe7593686.js',
          revision: 'fdbbd45fe7593686',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-c10dba307afd3fff.js',
          revision: 'c10dba307afd3fff',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-c808ebe58e69e0ae.js',
          revision: 'c808ebe58e69e0ae',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-6357001e7a739bf9.js',
          revision: '6357001e7a739bf9',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-960045891152aea7.js',
          revision: '960045891152aea7',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-507838a0f7983b21.js',
          revision: '507838a0f7983b21',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-62353edb6166b007.js',
          revision: '62353edb6166b007',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-1f8890619459b0a4.js',
          revision: '1f8890619459b0a4',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-6e93eb10325f3532.js',
          revision: '6e93eb10325f3532',
        },
        {
          url: '/_next/static/chunks/app/api/realtime/route-a79569cb9bbdf864.js',
          revision: 'a79569cb9bbdf864',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-2cd98703209003e5.js',
          revision: '2cd98703209003e5',
        },
        {
          url: '/_next/static/chunks/app/api/reports/route-6fd613d16befd7f1.js',
          revision: '6fd613d16befd7f1',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-00cbbd25ef66b278.js',
          revision: '00cbbd25ef66b278',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-f17edba9ec3e7d1f.js',
          revision: 'f17edba9ec3e7d1f',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-4a0289695a90467d.js',
          revision: '4a0289695a90467d',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-706cad108e8d17b5.js',
          revision: '706cad108e8d17b5',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-f34aa33e6fdee99b.js',
          revision: 'f34aa33e6fdee99b',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-9fd70e87cd542d4a.js',
          revision: '9fd70e87cd542d4a',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-038696515420c8dd.js',
          revision: '038696515420c8dd',
        },
        {
          url: '/_next/static/chunks/app/api/webhooks/route-b5d333994ba79ed7.js',
          revision: 'b5d333994ba79ed7',
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
          url: '/_next/static/chunks/app/auth/callback/route-bee5cd1a8e9a2e67.js',
          revision: 'bee5cd1a8e9a2e67',
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
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-d23af1055fdfa080.js',
          revision: 'd23af1055fdfa080',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-d23af1055fdfa080.js.map',
          revision: '12d6158eb3653ce683f784c8d0da0213',
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
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-f55268525cd75280.js',
          revision: 'f55268525cd75280',
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
          url: '/_next/static/chunks/app/layout-6f4cc8d8b524acda.js',
          revision: '6f4cc8d8b524acda',
        },
        {
          url: '/_next/static/chunks/app/layout-6f4cc8d8b524acda.js.map',
          revision: '857d3feadc8b5e44de6c4d4a58aa0474',
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
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-f9680c18c21ec2c4.js',
          revision: 'f9680c18c21ec2c4',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-f9680c18c21ec2c4.js.map',
          revision: '5daab0aa27531d3667626aa49d9f8961',
        },
        {
          url: '/_next/static/chunks/app/offline/page-14438418f0ded247.js',
          revision: '14438418f0ded247',
        },
        {
          url: '/_next/static/chunks/app/offline/page-14438418f0ded247.js.map',
          revision: 'a4fe8338436746ddaf7af6cd7b6b2ef7',
        },
        { url: '/_next/static/chunks/app/page-1267ad2e12f4f1fd.js', revision: '1267ad2e12f4f1fd' },
        {
          url: '/_next/static/chunks/app/page-1267ad2e12f4f1fd.js.map',
          revision: '090a0243cef9495ccc639f4b57177c5f',
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
          url: '/_next/static/chunks/app/programs/new/page-0d2e2c59c2d69858.js',
          revision: '0d2e2c59c2d69858',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-0d2e2c59c2d69858.js.map',
          revision: 'eb3492a982ad89a9c43e5ff6dccf3fe3',
        },
        {
          url: '/_next/static/chunks/app/programs/page-70e0f89ff034e413.js',
          revision: '70e0f89ff034e413',
        },
        {
          url: '/_next/static/chunks/app/programs/page-70e0f89ff034e413.js.map',
          revision: 'f26301be0917ed847e7f268405f6175c',
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
          url: '/_next/static/chunks/app/rewards/page-8732acca45a452b0.js',
          revision: '8732acca45a452b0',
        },
        {
          url: '/_next/static/chunks/app/rewards/page-8732acca45a452b0.js.map',
          revision: 'e5ff286c3da91a10e5af81e94f263a0b',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-1cb86a6cecb40d94.js',
          revision: '1cb86a6cecb40d94',
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
          url: '/_next/static/chunks/app/sitemap.xml/route-2717ac67da08cdef.js',
          revision: '2717ac67da08cdef',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-23004673237921b5.js', revision: '23004673237921b5' },
        {
          url: '/_next/static/chunks/main-23004673237921b5.js.map',
          revision: '3c2df80185e2122f4b5d3f1c519f141b',
        },
        { url: '/_next/static/chunks/main-app-eaa645b507cd3374.js', revision: 'eaa645b507cd3374' },
        {
          url: '/_next/static/chunks/main-app-eaa645b507cd3374.js.map',
          revision: '6aa8cceb07d17e07ca51411c651c1610',
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
        { url: '/_next/static/css/ff663754616e4ebe.css', revision: 'ff663754616e4ebe' },
        {
          url: '/_next/static/css/ff663754616e4ebe.css.map',
          revision: '414c31e7010608a129f9ad9d2363d82d',
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
