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
      d = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '18e7c9e3975b2c59757b43ccae5bf31e' },
        { url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js', revision: 'cb68bc606b8adb2f' },
        {
          url: '/_next/static/chunks/1646.cb68bc606b8adb2f.js.map',
          revision: '6044c3cda550f8f0a4c878f41b4a12cf',
        },
        { url: '/_next/static/chunks/1880-b8683304d96d82f1.js', revision: 'b8683304d96d82f1' },
        {
          url: '/_next/static/chunks/1880-b8683304d96d82f1.js.map',
          revision: '6c6aa8fc0bbb21b7fd135a461edecf4f',
        },
        { url: '/_next/static/chunks/2130-72e9ff949dfaad12.js', revision: '72e9ff949dfaad12' },
        {
          url: '/_next/static/chunks/2130-72e9ff949dfaad12.js.map',
          revision: 'beab1625385dbedfa2c714473c2fe4ea',
        },
        { url: '/_next/static/chunks/2619-d005563ba7b2d11a.js', revision: 'd005563ba7b2d11a' },
        {
          url: '/_next/static/chunks/2619-d005563ba7b2d11a.js.map',
          revision: '41d3117ed71fb55d01d3fedfc5563774',
        },
        { url: '/_next/static/chunks/3155.7ad5fdd9261270be.js', revision: '7ad5fdd9261270be' },
        {
          url: '/_next/static/chunks/3155.7ad5fdd9261270be.js.map',
          revision: '54daa08b7128424b3d88d57fd6aee619',
        },
        { url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js', revision: 'cb93e6eb70aa7b7c' },
        {
          url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js.map',
          revision: '750d46a935890c241ad7997202fda0d3',
        },
        { url: '/_next/static/chunks/3533.36349461aa143f41.js', revision: '36349461aa143f41' },
        {
          url: '/_next/static/chunks/3533.36349461aa143f41.js.map',
          revision: 'd5a91aeb8ec6a99fe07a03e79bd64d1e',
        },
        { url: '/_next/static/chunks/4827-deb47284451b45f3.js', revision: 'deb47284451b45f3' },
        {
          url: '/_next/static/chunks/4827-deb47284451b45f3.js.map',
          revision: 'eca9380496d2d55413a590df29394823',
        },
        { url: '/_next/static/chunks/4bd1b696-6968065ab7b92d86.js', revision: '6968065ab7b92d86' },
        {
          url: '/_next/static/chunks/4bd1b696-6968065ab7b92d86.js.map',
          revision: 'b12408ee2e0bc59bf82242467e9c2422',
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
        { url: '/_next/static/chunks/6002.c4f09486f99c1a28.js', revision: 'c4f09486f99c1a28' },
        {
          url: '/_next/static/chunks/6002.c4f09486f99c1a28.js.map',
          revision: 'e3aabf983323cbdf6fe92a7fbdf07f29',
        },
        { url: '/_next/static/chunks/7131-4fa764ee33317ce3.js', revision: '4fa764ee33317ce3' },
        {
          url: '/_next/static/chunks/7131-4fa764ee33317ce3.js.map',
          revision: '931c3430fb5132ff9782de48d98be02a',
        },
        { url: '/_next/static/chunks/7210.860fd268abee510a.js', revision: '860fd268abee510a' },
        {
          url: '/_next/static/chunks/7210.860fd268abee510a.js.map',
          revision: '0455d81e6a4707435619c774ee39c87c',
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
        { url: '/_next/static/chunks/991.ed0fa0b8f7abd048.js', revision: 'ed0fa0b8f7abd048' },
        {
          url: '/_next/static/chunks/991.ed0fa0b8f7abd048.js.map',
          revision: '0ed22ba8cae94de94cdf39c18af6e417',
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
          url: '/_next/static/chunks/app/admin/layout-6edb8e3fa333f800.js',
          revision: '6edb8e3fa333f800',
        },
        {
          url: '/_next/static/chunks/app/admin/layout-6edb8e3fa333f800.js.map',
          revision: '679932f31eef4e49a9a1d210ce457482',
        },
        {
          url: '/_next/static/chunks/app/admin/page-5930c9db970238ac.js',
          revision: '5930c9db970238ac',
        },
        {
          url: '/_next/static/chunks/app/admin/page-5930c9db970238ac.js.map',
          revision: '627101cbf63b036bc08de7991c61568f',
        },
        {
          url: '/_next/static/chunks/app/admin/programs/page-1e991b339b5ee1e2.js',
          revision: '1e991b339b5ee1e2',
        },
        {
          url: '/_next/static/chunks/app/admin/programs/page-1e991b339b5ee1e2.js.map',
          revision: '960e7352f9b101f6cc494fe9d8835f10',
        },
        {
          url: '/_next/static/chunks/app/admin/reviews/page-ef394dbd28855f46.js',
          revision: 'ef394dbd28855f46',
        },
        {
          url: '/_next/static/chunks/app/admin/reviews/page-ef394dbd28855f46.js.map',
          revision: '1fa0b6099e7d756e0d231bee05d4c9e9',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-465be381dfcc2832.js',
          revision: '465be381dfcc2832',
        },
        {
          url: '/_next/static/chunks/app/admin/users/page-465be381dfcc2832.js.map',
          revision: '797a69303a4cb413bbdf2a9672e9f852',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-7fa3e391751d9a78.js',
          revision: '7fa3e391751d9a78',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-7fa3e391751d9a78.js.map',
          revision: '2d0e247b7fcb207c4c2d87ff9541ecc3',
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
          url: '/_next/static/chunks/app/applications/page-011df965a52e95cb.js',
          revision: '011df965a52e95cb',
        },
        {
          url: '/_next/static/chunks/app/applications/page-011df965a52e95cb.js.map',
          revision: '01805402c2ee38a26ac2cbb456f02b96',
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
          url: '/_next/static/chunks/app/billing/upgrade/page-6cfa99b559b4248c.js',
          revision: '6cfa99b559b4248c',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-6cfa99b559b4248c.js.map',
          revision: '34cc961bbca062aa2f144d584af94463',
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
          url: '/_next/static/chunks/app/compare/page-e957e1caf48e9db1.js',
          revision: 'e957e1caf48e9db1',
        },
        {
          url: '/_next/static/chunks/app/compare/page-e957e1caf48e9db1.js.map',
          revision: 'cf6218cc36cce464b712d63cac1a4f63',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-1d7f5fa31d844bfe.js',
          revision: '1d7f5fa31d844bfe',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-1d7f5fa31d844bfe.js.map',
          revision: 'ce82118e691702995103fc3496ecc7d1',
        },
        { url: '/_next/static/chunks/app/error-cc3a66045a5dfba0.js', revision: 'cc3a66045a5dfba0' },
        {
          url: '/_next/static/chunks/app/error-cc3a66045a5dfba0.js.map',
          revision: '6471cfbfb093de6df6d10dfeed260747',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-0fc944efcb496712.js',
          revision: '0fc944efcb496712',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-0fc944efcb496712.js.map',
          revision: '50e60bc1905d4cb6da845813da561dd2',
        },
        {
          url: '/_next/static/chunks/app/global-error-c1dd398039ad7b37.js',
          revision: 'c1dd398039ad7b37',
        },
        {
          url: '/_next/static/chunks/app/global-error-c1dd398039ad7b37.js.map',
          revision: '3713999b089f637ebc2b18597add8527',
        },
        {
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-17a0d778acb75d9a.js',
          revision: '17a0d778acb75d9a',
        },
        {
          url: '/_next/static/chunks/app/integrations/page-6d6dfab43a82f770.js',
          revision: '6d6dfab43a82f770',
        },
        {
          url: '/_next/static/chunks/app/integrations/page-6d6dfab43a82f770.js.map',
          revision: 'd4919ddb88a1f24dc0708a634c891d32',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-21d12cd1b11fa936.js',
          revision: '21d12cd1b11fa936',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-21d12cd1b11fa936.js.map',
          revision: 'e33fdb0325e85c28f6a9bf617044cb08',
        },
        {
          url: '/_next/static/chunks/app/layout-0003e91441277b34.js',
          revision: '0003e91441277b34',
        },
        {
          url: '/_next/static/chunks/app/layout-0003e91441277b34.js.map',
          revision: '19134bfc9d2f391d151ae9cf302c7254',
        },
        {
          url: '/_next/static/chunks/app/login/page-b313cfb49c81fb6f.js',
          revision: 'b313cfb49c81fb6f',
        },
        {
          url: '/_next/static/chunks/app/login/page-b313cfb49c81fb6f.js.map',
          revision: 'f542642dea0601feca8ec2b072ba6cc8',
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
          revision: '26f5a87f3699945af15d068021379912',
        },
        { url: '/_next/static/chunks/app/page-01efa177c63e9018.js', revision: '01efa177c63e9018' },
        {
          url: '/_next/static/chunks/app/page-01efa177c63e9018.js.map',
          revision: '2678cd81195d80393abfdd6099f106c5',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-dfd21b51cf2f0a65.js',
          revision: 'dfd21b51cf2f0a65',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-dfd21b51cf2f0a65.js.map',
          revision: '7278f0fc0fa385c064061d98cd1219c7',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-90ac0b3eac749114.js',
          revision: '90ac0b3eac749114',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-90ac0b3eac749114.js.map',
          revision: 'fdd1439bde0fa8a2675735b79239f40b',
        },
        {
          url: '/_next/static/chunks/app/programs/page-49f16b7debc9d9de.js',
          revision: '49f16b7debc9d9de',
        },
        {
          url: '/_next/static/chunks/app/programs/page-49f16b7debc9d9de.js.map',
          revision: '08f0fe0021f7f2e499bc7fd29316462b',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-2892c6065afa0e68.js',
          revision: '2892c6065afa0e68',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-2892c6065afa0e68.js.map',
          revision: 'e1e78d3c79a056c4eb879f21ed988249',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-806866020e47a527.js',
          revision: '806866020e47a527',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-806866020e47a527.js.map',
          revision: '9dd53aa3166ac1854f53e476b3beb1f4',
        },
        {
          url: '/_next/static/chunks/app/rewards/page-f3191f4882b928ae.js',
          revision: 'f3191f4882b928ae',
        },
        {
          url: '/_next/static/chunks/app/rewards/page-f3191f4882b928ae.js.map',
          revision: '33029305ec1bd0c4c14fdf0625c914e8',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-fa74b9259d931500.js',
          revision: 'fa74b9259d931500',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-2d956e89763eb10b.js',
          revision: '2d956e89763eb10b',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-2d956e89763eb10b.js.map',
          revision: 'd765a35eb8a49d42815c3f76b7b0d8ea',
        },
        {
          url: '/_next/static/chunks/app/settings/page-5515151fc8110df4.js',
          revision: '5515151fc8110df4',
        },
        {
          url: '/_next/static/chunks/app/settings/page-5515151fc8110df4.js.map',
          revision: 'f4f342d5d8061dc11736aad8ed6f3fdd',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-dd0aec0e09c8b5a6.js',
          revision: 'dd0aec0e09c8b5a6',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-dd0aec0e09c8b5a6.js.map',
          revision: 'ced4f5326365151aeba0c16ebceb61c2',
        },
        {
          url: '/_next/static/chunks/app/signup/page-0128cd44cf8910ca.js',
          revision: '0128cd44cf8910ca',
        },
        {
          url: '/_next/static/chunks/app/signup/page-0128cd44cf8910ca.js.map',
          revision: 'e3eca79f150d92338bb755583dbf2547',
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
        { url: '/_next/static/chunks/main-8275fd74ee0cfdcb.js', revision: '8275fd74ee0cfdcb' },
        {
          url: '/_next/static/chunks/main-8275fd74ee0cfdcb.js.map',
          revision: 'cf5ee77f80c7427d6c84279369e2de7d',
        },
        { url: '/_next/static/chunks/main-app-b5979a5d951f942e.js', revision: 'b5979a5d951f942e' },
        {
          url: '/_next/static/chunks/main-app-b5979a5d951f942e.js.map',
          revision: 'dd44ddce744c93e9e929bc7c9b737283',
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
        { url: '/_next/static/chunks/webpack-00194734cc85945d.js', revision: '00194734cc85945d' },
        {
          url: '/_next/static/chunks/webpack-00194734cc85945d.js.map',
          revision: '76fb4099712382caed0c112efa70e2cb',
        },
        { url: '/_next/static/css/df44fef9e28192b8.css', revision: 'df44fef9e28192b8' },
        {
          url: '/_next/static/css/df44fef9e28192b8.css.map',
          revision: 'c80e2f59dba6805847a22bf58d17fe35',
        },
        {
          url: '/_next/static/mjXdWBcK60rlZuxuu6dbZ/_buildManifest.js',
          revision: '95827d94f12f255a0c4de3ace2c896b9',
        },
        {
          url: '/_next/static/mjXdWBcK60rlZuxuu6dbZ/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
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
