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
      d = { module: { uri: t }, exports: n, require: r };
    a[t] = Promise.all(c.map((e) => d[e] || r(e))).then((e) => (i(...e), n));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'a71f9851d15b3bd4a13788774c2dbed7' },
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
        { url: '/_next/static/chunks/7131-8d0c4e5cb38f0a0d.js', revision: '8d0c4e5cb38f0a0d' },
        {
          url: '/_next/static/chunks/7131-8d0c4e5cb38f0a0d.js.map',
          revision: '7c49f2fe72dfd98865769b57cda4d5d0',
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
        { url: '/_next/static/chunks/8919-f640754526b1ffe9.js', revision: 'f640754526b1ffe9' },
        {
          url: '/_next/static/chunks/8919-f640754526b1ffe9.js.map',
          revision: '98f3e46b196f42af53d4d982eea4691a',
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
          url: '/_next/static/chunks/app/admin/page-62ee6ee085045bcd.js',
          revision: '62ee6ee085045bcd',
        },
        {
          url: '/_next/static/chunks/app/admin/page-62ee6ee085045bcd.js.map',
          revision: '068e7edbf6acfd8a4f1fc69da12b28bc',
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
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-5780e3751f27fe4c.js',
          revision: '5780e3751f27fe4c',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-4e5a4e4c3409ecaf.js',
          revision: '4e5a4e4c3409ecaf',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-d282e27582728ea6.js',
          revision: 'd282e27582728ea6',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-dd61ae4710d55091.js',
          revision: 'dd61ae4710d55091',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-5cfe9a49ecd78697.js',
          revision: '5cfe9a49ecd78697',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-4b49bdf01b339e51.js',
          revision: '4b49bdf01b339e51',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-f6a59555cceaf4c0.js',
          revision: 'f6a59555cceaf4c0',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-94a7a4edb46108c8.js',
          revision: '94a7a4edb46108c8',
        },
        {
          url: '/_next/static/chunks/app/api/audit-logs/route-cb4aaa987d0ae85c.js',
          revision: 'cb4aaa987d0ae85c',
        },
        {
          url: '/_next/static/chunks/app/api/auth/2fa/route-bbd1c3e1c0c145c3.js',
          revision: 'bbd1c3e1c0c145c3',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-b4ee2009dc8befee.js',
          revision: 'b4ee2009dc8befee',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-19642843dcf9f8f9.js',
          revision: '19642843dcf9f8f9',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-3de444be251ce9d3.js',
          revision: '3de444be251ce9d3',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-428328c056901d99.js',
          revision: '428328c056901d99',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-6f2cd9b5e2c119a3.js',
          revision: '6f2cd9b5e2c119a3',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-b5c7bb4f4e99b34b.js',
          revision: 'b5c7bb4f4e99b34b',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-155b88c02c94e103.js',
          revision: '155b88c02c94e103',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-3cd2bf7fe9f6bd3b.js',
          revision: '3cd2bf7fe9f6bd3b',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-464773427862820f.js',
          revision: '464773427862820f',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-add556b0aded533e.js',
          revision: 'add556b0aded533e',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-217086b06546c9bb.js',
          revision: '217086b06546c9bb',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-f0ff48c5addae35a.js',
          revision: 'f0ff48c5addae35a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-1e25e8078360a13a.js',
          revision: '1e25e8078360a13a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-764e8002cdef645a.js',
          revision: '764e8002cdef645a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-51c644dbb8034563.js',
          revision: '51c644dbb8034563',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-5b3d5343c7dad14b.js',
          revision: '5b3d5343c7dad14b',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-9ee83b1785dbddb0.js',
          revision: '9ee83b1785dbddb0',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-0617bab1b8d06ec5.js',
          revision: '0617bab1b8d06ec5',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-f104dc92ac24cbd3.js',
          revision: 'f104dc92ac24cbd3',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-9deaa428bf147231.js',
          revision: '9deaa428bf147231',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-fcdf4b2fdc6394d4.js',
          revision: 'fcdf4b2fdc6394d4',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-4de070befad73195.js',
          revision: '4de070befad73195',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-f4db8d4c23f890bf.js',
          revision: 'f4db8d4c23f890bf',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-ba063e9f2e34ca2d.js',
          revision: 'ba063e9f2e34ca2d',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-af2e1ada6c5e2700.js',
          revision: 'af2e1ada6c5e2700',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-6ee96c1d670829b9.js',
          revision: '6ee96c1d670829b9',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-6d512c35ccf1415a.js',
          revision: '6d512c35ccf1415a',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-7e3995632b02596d.js',
          revision: '7e3995632b02596d',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-a8a6e7fd54815d86.js',
          revision: 'a8a6e7fd54815d86',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-d3bd18c2444b6df0.js',
          revision: 'd3bd18c2444b6df0',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-efe4988b5c1c6fd8.js',
          revision: 'efe4988b5c1c6fd8',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-4802f6a0fee657d7.js',
          revision: '4802f6a0fee657d7',
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
          url: '/_next/static/chunks/app/auth/callback/route-4bbb85962a6cdf8a.js',
          revision: '4bbb85962a6cdf8a',
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
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-bd408c5dafd8138d.js',
          revision: 'bd408c5dafd8138d',
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
          url: '/_next/static/chunks/app/layout-56fec6162249424c.js',
          revision: '56fec6162249424c',
        },
        {
          url: '/_next/static/chunks/app/layout-56fec6162249424c.js.map',
          revision: 'c210a7912b44c7dd4d666393a21a91ff',
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
          url: '/_next/static/chunks/app/robots.txt/route-748918952494807c.js',
          revision: '748918952494807c',
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
          url: '/_next/static/chunks/app/sitemap.xml/route-7ff52e0cdefdc7dc.js',
          revision: '7ff52e0cdefdc7dc',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-0a4faa399a396e7c.js', revision: '0a4faa399a396e7c' },
        {
          url: '/_next/static/chunks/main-0a4faa399a396e7c.js.map',
          revision: 'c33303512fcaea39740897660c96b55a',
        },
        { url: '/_next/static/chunks/main-app-8be97a7f02f07eed.js', revision: '8be97a7f02f07eed' },
        {
          url: '/_next/static/chunks/main-app-8be97a7f02f07eed.js.map',
          revision: '943f5ea7a8722ae85840946c3b974d92',
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
        { url: '/_next/static/css/c5e02e2c1c894168.css', revision: 'c5e02e2c1c894168' },
        {
          url: '/_next/static/css/c5e02e2c1c894168.css.map',
          revision: '4e89ef2add021d15f96a8d9ed997d398',
        },
        {
          url: '/_next/static/xFSIvoqJpUjkGx0QGREpa/_buildManifest.js',
          revision: '55b2dff68841fee448333da717d0f9bd',
        },
        {
          url: '/_next/static/xFSIvoqJpUjkGx0QGREpa/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/google9ee8e3822b3beb94.html', revision: '281552f13282f41f13f2fe056f29d403' },
        { url: '/manifest.json', revision: '889d4a278c567cc715e4116788fd45dd' },
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
