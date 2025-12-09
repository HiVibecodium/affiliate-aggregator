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
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (a[t]) return;
    let n = {};
    const r = (e) => s(e, t),
      p = { module: { uri: t }, exports: n, require: r };
    a[t] = Promise.all(c.map((e) => p[e] || r(e))).then((e) => (i(...e), n));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'faf40880d879c5442bb9495a492a4fa0' },
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
        { url: '/_next/static/chunks/2119.469be504368e0232.js', revision: '469be504368e0232' },
        {
          url: '/_next/static/chunks/2119.469be504368e0232.js.map',
          revision: '7ac7832e622b7fdbc28f72e2aaa94600',
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
        { url: '/_next/static/chunks/3155.79eb934ece616720.js', revision: '79eb934ece616720' },
        {
          url: '/_next/static/chunks/3155.79eb934ece616720.js.map',
          revision: '17a9380f41afa8c328148847c179bf97',
        },
        { url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js', revision: 'cb93e6eb70aa7b7c' },
        {
          url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js.map',
          revision: '750d46a935890c241ad7997202fda0d3',
        },
        { url: '/_next/static/chunks/3533.75a18f401b92c5d3.js', revision: '75a18f401b92c5d3' },
        {
          url: '/_next/static/chunks/3533.75a18f401b92c5d3.js.map',
          revision: '7ad91257d0d95830936569b7a23781e1',
        },
        { url: '/_next/static/chunks/4827-cacfa630abe6d0ea.js', revision: 'cacfa630abe6d0ea' },
        {
          url: '/_next/static/chunks/4827-cacfa630abe6d0ea.js.map',
          revision: '9c15f95130663941adf4f82ed0c0b6e6',
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
        { url: '/_next/static/chunks/7131-34129078660c7228.js', revision: '34129078660c7228' },
        {
          url: '/_next/static/chunks/7131-34129078660c7228.js.map',
          revision: '33ccc80540a8fa753c1aa63ada73c07e',
        },
        { url: '/_next/static/chunks/7210.4c1bc63143f8bd83.js', revision: '4c1bc63143f8bd83' },
        {
          url: '/_next/static/chunks/7210.4c1bc63143f8bd83.js.map',
          revision: 'ec0f3db6147544595e9d782df9852bb2',
        },
        { url: '/_next/static/chunks/7602.4013d46fed43ebce.js', revision: '4013d46fed43ebce' },
        {
          url: '/_next/static/chunks/7602.4013d46fed43ebce.js.map',
          revision: '671027af81db4dace52708aac731b38d',
        },
        { url: '/_next/static/chunks/7856-70a7df5b828b9a78.js', revision: '70a7df5b828b9a78' },
        {
          url: '/_next/static/chunks/7856-70a7df5b828b9a78.js.map',
          revision: 'd9700268ed15efa04c01fafee01071c0',
        },
        { url: '/_next/static/chunks/991.b73c2199bad23ad6.js', revision: 'b73c2199bad23ad6' },
        {
          url: '/_next/static/chunks/991.b73c2199bad23ad6.js.map',
          revision: 'b4a4cb6da36187789d38714ab7aa6626',
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
          url: '/_next/static/chunks/app/analytics/page-99944fdb9a048a24.js',
          revision: '99944fdb9a048a24',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-99944fdb9a048a24.js.map',
          revision: '9fe536abc8b68d9d5a83968dece58d60',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-227f6fc382d9c2de.js',
          revision: '227f6fc382d9c2de',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/%5Bid%5D/route-0f614b69012f50e0.js',
          revision: '0f614b69012f50e0',
        },
        {
          url: '/_next/static/chunks/app/api/admin/programs/route-caacd033e4a280c5.js',
          revision: 'caacd033e4a280c5',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/%5Bid%5D/route-a8dabad7775e357a.js',
          revision: 'a8dabad7775e357a',
        },
        {
          url: '/_next/static/chunks/app/api/admin/reviews/route-d94d254495d95e5c.js',
          revision: 'd94d254495d95e5c',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-c19f2ee07a4d2b57.js',
          revision: 'c19f2ee07a4d2b57',
        },
        {
          url: '/_next/static/chunks/app/api/admin/users/route-ae268220906c7adb.js',
          revision: 'ae268220906c7adb',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-4bc70671157b447f.js',
          revision: '4bc70671157b447f',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/dashboard/route-901166e24552ad68.js',
          revision: '901166e24552ad68',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/export/route-8f885ebf2411ad07.js',
          revision: '8f885ebf2411ad07',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-1a300af44baf89b0.js',
          revision: '1a300af44baf89b0',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-ee8d4944706a4119.js',
          revision: 'ee8d4944706a4119',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-cd65da7e858c5d3c.js',
          revision: 'cd65da7e858c5d3c',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-01d7ad69302e6777.js',
          revision: '01d7ad69302e6777',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-aa912bafc048cef3.js',
          revision: 'aa912bafc048cef3',
        },
        {
          url: '/_next/static/chunks/app/api/audit-logs/route-979ac60424075198.js',
          revision: '979ac60424075198',
        },
        {
          url: '/_next/static/chunks/app/api/auth/2fa/route-fa36d0a398eb37d9.js',
          revision: 'fa36d0a398eb37d9',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-59e803953522bd8e.js',
          revision: '59e803953522bd8e',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-2c7e55438ec6113f.js',
          revision: '2c7e55438ec6113f',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-ce2d9fdfa2e32f2c.js',
          revision: 'ce2d9fdfa2e32f2c',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-71302326329efea4.js',
          revision: '71302326329efea4',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-018e4ebf08ea6184.js',
          revision: '018e4ebf08ea6184',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-d1def45623973473.js',
          revision: 'd1def45623973473',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-1653f27a7fd0e488.js',
          revision: '1653f27a7fd0e488',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-b64a2e2fbc6ebbc2.js',
          revision: 'b64a2e2fbc6ebbc2',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-2f2f7d4ddf89282f.js',
          revision: '2f2f7d4ddf89282f',
        },
        {
          url: '/_next/static/chunks/app/api/experiments/route-f42f1aaa924adfc0.js',
          revision: 'f42f1aaa924adfc0',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-6db10637b05c4a53.js',
          revision: '6db10637b05c4a53',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/achievements/route-bb531a54a003957e.js',
          revision: 'bb531a54a003957e',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/leaderboard/route-0c165779e74ebd0a.js',
          revision: '0c165779e74ebd0a',
        },
        {
          url: '/_next/static/chunks/app/api/gamification/points/route-65bc7c95b220bc1b.js',
          revision: '65bc7c95b220bc1b',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-987ce90009f07fde.js',
          revision: '987ce90009f07fde',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-435bf6090f3b85a1.js',
          revision: '435bf6090f3b85a1',
        },
        {
          url: '/_next/static/chunks/app/api/integrations/api-keys/route-e7db7ffc9a2fa3ea.js',
          revision: 'e7db7ffc9a2fa3ea',
        },
        {
          url: '/_next/static/chunks/app/api/integrations/route-e674c585592d3dd7.js',
          revision: 'e674c585592d3dd7',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-36db0708dec23f8a.js',
          revision: '36db0708dec23f8a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-705ed651b8757fbf.js',
          revision: '705ed651b8757fbf',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-4ec3e873f436d917.js',
          revision: '4ec3e873f436d917',
        },
        {
          url: '/_next/static/chunks/app/api/notifications/history/route-31dacf6f58c43ba2.js',
          revision: '31dacf6f58c43ba2',
        },
        {
          url: '/_next/static/chunks/app/api/notifications/settings/route-144972d97bada02f.js',
          revision: '144972d97bada02f',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-3f83f80c496b8e27.js',
          revision: '3f83f80c496b8e27',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-a86aca4e4022786a.js',
          revision: 'a86aca4e4022786a',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-d0e78a9392ce87f1.js',
          revision: 'd0e78a9392ce87f1',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-ee8c0134466f3116.js',
          revision: 'ee8c0134466f3116',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-d0e14e2b5d9dc0e8.js',
          revision: 'd0e14e2b5d9dc0e8',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-a9160ab5329d9ab3.js',
          revision: 'a9160ab5329d9ab3',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-777677eafca1edc3.js',
          revision: '777677eafca1edc3',
        },
        {
          url: '/_next/static/chunks/app/api/programs/search/route-ee9a86e702cccd45.js',
          revision: 'ee9a86e702cccd45',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-7907b6ff83c8035c.js',
          revision: '7907b6ff83c8035c',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-2dd2594e333f6c98.js',
          revision: '2dd2594e333f6c98',
        },
        {
          url: '/_next/static/chunks/app/api/realtime/route-26937f28bd5857a1.js',
          revision: '26937f28bd5857a1',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-afe999a10f17163e.js',
          revision: 'afe999a10f17163e',
        },
        {
          url: '/_next/static/chunks/app/api/reports/route-61864ae88caa7cd2.js',
          revision: '61864ae88caa7cd2',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-3c55daf0bf28cb9e.js',
          revision: '3c55daf0bf28cb9e',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-f1540961382a5ad8.js',
          revision: 'f1540961382a5ad8',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-df28b34fdc4250c8.js',
          revision: 'df28b34fdc4250c8',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-abf5d309efe152c2.js',
          revision: 'abf5d309efe152c2',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-1bb559e11403da15.js',
          revision: '1bb559e11403da15',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-9865907bdbad90e3.js',
          revision: '9865907bdbad90e3',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-7db0de33fccfdd34.js',
          revision: '7db0de33fccfdd34',
        },
        {
          url: '/_next/static/chunks/app/api/webhooks/route-dc96684d0f582288.js',
          revision: 'dc96684d0f582288',
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
          url: '/_next/static/chunks/app/auth/callback/route-697cb7b11b9a2ea9.js',
          revision: '697cb7b11b9a2ea9',
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
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-9c3c3bdb9e1d8cf9.js',
          revision: '9c3c3bdb9e1d8cf9',
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
          url: '/_next/static/chunks/app/layout-1b41443e2fc7b6c6.js',
          revision: '1b41443e2fc7b6c6',
        },
        {
          url: '/_next/static/chunks/app/layout-1b41443e2fc7b6c6.js.map',
          revision: 'a9161aca85a427d4dc4226a408147ec9',
        },
        {
          url: '/_next/static/chunks/app/login/page-2e69a038c7214bc4.js',
          revision: '2e69a038c7214bc4',
        },
        {
          url: '/_next/static/chunks/app/login/page-2e69a038c7214bc4.js.map',
          revision: 'b0b0d01e812b515242f49379d3387728',
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
        { url: '/_next/static/chunks/app/page-2c733a7f746303f1.js', revision: '2c733a7f746303f1' },
        {
          url: '/_next/static/chunks/app/page-2c733a7f746303f1.js.map',
          revision: '276ca8a27b3be1f0ed7d6d91e13b7aa4',
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
          url: '/_next/static/chunks/app/programs/page-31d5baa9ddee7211.js',
          revision: '31d5baa9ddee7211',
        },
        {
          url: '/_next/static/chunks/app/programs/page-31d5baa9ddee7211.js.map',
          revision: 'bd52dda923ceb2e7422b0547bf9d3b0b',
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
          url: '/_next/static/chunks/app/robots.txt/route-e058d39f92a61351.js',
          revision: 'e058d39f92a61351',
        },
        {
          url: '/_next/static/chunks/app/settings/notifications/page-bd6135ceb76b943e.js',
          revision: 'bd6135ceb76b943e',
        },
        {
          url: '/_next/static/chunks/app/settings/notifications/page-bd6135ceb76b943e.js.map',
          revision: 'bcb5cbe007624f417e504617c0ec6bda',
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
          url: '/_next/static/chunks/app/settings/page-2acbb4c15888bb61.js',
          revision: '2acbb4c15888bb61',
        },
        {
          url: '/_next/static/chunks/app/settings/page-2acbb4c15888bb61.js.map',
          revision: '8dc777b8d39ff063aae99c7b2df7aa65',
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
          url: '/_next/static/chunks/app/signup/page-f81f8439959121ec.js',
          revision: 'f81f8439959121ec',
        },
        {
          url: '/_next/static/chunks/app/signup/page-f81f8439959121ec.js.map',
          revision: '6ea1c374df6654e17147499eb4fdf8ee',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-dc9e7534bc804f53.js',
          revision: 'dc9e7534bc804f53',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-2e3713ed869befb2.js', revision: '2e3713ed869befb2' },
        {
          url: '/_next/static/chunks/main-2e3713ed869befb2.js.map',
          revision: 'bcc5cd9ee6b51c867a11705c960d2b95',
        },
        { url: '/_next/static/chunks/main-app-8f82173932ff08e8.js', revision: '8f82173932ff08e8' },
        {
          url: '/_next/static/chunks/main-app-8f82173932ff08e8.js.map',
          revision: '26c076dd5589df7f240c11712158079f',
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
        { url: '/_next/static/chunks/webpack-4f564c1f5c4eac04.js', revision: '4f564c1f5c4eac04' },
        {
          url: '/_next/static/chunks/webpack-4f564c1f5c4eac04.js.map',
          revision: '20197ec75a5d3fb7c9e5814e70895c93',
        },
        { url: '/_next/static/css/61b637d4d28e57b9.css', revision: '61b637d4d28e57b9' },
        {
          url: '/_next/static/css/61b637d4d28e57b9.css.map',
          revision: 'e3970bb6277bf432c663ff190bb5b726',
        },
        {
          url: '/_next/static/f-m1DL7gENaqx5JWgswMi/_buildManifest.js',
          revision: 'b61518b3da86f8c209cdd6daf6c65e15',
        },
        {
          url: '/_next/static/f-m1DL7gENaqx5JWgswMi/_ssgManifest.js',
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
