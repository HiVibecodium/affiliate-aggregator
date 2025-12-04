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
        { url: '/_next/app-build-manifest.json', revision: '9c9469a3235f8c4f69faa5492852e6f3' },
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
        { url: '/_next/static/chunks/7131-d6e3be3d973f6ee1.js', revision: 'd6e3be3d973f6ee1' },
        {
          url: '/_next/static/chunks/7131-d6e3be3d973f6ee1.js.map',
          revision: '72a53c8dad27d286a6511d616f4be71a',
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
          url: '/_next/static/chunks/app/admin/page-2b81098ce86243d2.js',
          revision: '2b81098ce86243d2',
        },
        {
          url: '/_next/static/chunks/app/admin/page-2b81098ce86243d2.js.map',
          revision: '92cf479aac683da43bad8689c4b02932',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-13dda31cb19edf37.js',
          revision: '13dda31cb19edf37',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-13dda31cb19edf37.js.map',
          revision: 'e90f0123c9a38284b8b37f7269950ea4',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-6a16dcb4ea7a81a1.js',
          revision: '6a16dcb4ea7a81a1',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-f319c0211247d5a8.js',
          revision: 'f319c0211247d5a8',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-5425722f4a1535df.js',
          revision: '5425722f4a1535df',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-8ce70e77811c1e40.js',
          revision: '8ce70e77811c1e40',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-8fbae743061344dd.js',
          revision: '8fbae743061344dd',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-c8cd3140b95f8f1d.js',
          revision: 'c8cd3140b95f8f1d',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-fcc0a9d6447ed4a1.js',
          revision: 'fcc0a9d6447ed4a1',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-f76851b9c609d108.js',
          revision: 'f76851b9c609d108',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-e4483f0db4961ed5.js',
          revision: 'e4483f0db4961ed5',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-fa3f58fc9ebc8145.js',
          revision: 'fa3f58fc9ebc8145',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-b3ababbc672801f0.js',
          revision: 'b3ababbc672801f0',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-521f1cd4e5ed4791.js',
          revision: '521f1cd4e5ed4791',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-9f376072efe3517a.js',
          revision: '9f376072efe3517a',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-dbe99f7a617c7379.js',
          revision: 'dbe99f7a617c7379',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-edd8de661ebbc1e0.js',
          revision: 'edd8de661ebbc1e0',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-49f466421b5d7e20.js',
          revision: '49f466421b5d7e20',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-2b26aa5611ad1a85.js',
          revision: '2b26aa5611ad1a85',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-4f979ac89828e2e4.js',
          revision: '4f979ac89828e2e4',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-12e1aabc404d7d97.js',
          revision: '12e1aabc404d7d97',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-804d06a0b65875a4.js',
          revision: '804d06a0b65875a4',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-088e7b1b4a8949e8.js',
          revision: '088e7b1b4a8949e8',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-85d93e04a175d64a.js',
          revision: '85d93e04a175d64a',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-276babfbcc8701dd.js',
          revision: '276babfbcc8701dd',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-64c4c10998d85ab4.js',
          revision: '64c4c10998d85ab4',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-0a8b064d10b73fee.js',
          revision: '0a8b064d10b73fee',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-0d67c3c4ca9191a7.js',
          revision: '0d67c3c4ca9191a7',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-2ba637ee4f3073e5.js',
          revision: '2ba637ee4f3073e5',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-5dc80f4f8924ea6f.js',
          revision: '5dc80f4f8924ea6f',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-8b6b14bb07faad39.js',
          revision: '8b6b14bb07faad39',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-6ad3ba9fa918b1a8.js',
          revision: '6ad3ba9fa918b1a8',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-a1aed210044f5076.js',
          revision: 'a1aed210044f5076',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-e6b0a87afbd0c624.js',
          revision: 'e6b0a87afbd0c624',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-74095a33d7d39a2f.js',
          revision: '74095a33d7d39a2f',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-7395584415e87df0.js',
          revision: '7395584415e87df0',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-0ce50319f68a3d1d.js',
          revision: '0ce50319f68a3d1d',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-51067ed313fa2bb7.js',
          revision: '51067ed313fa2bb7',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-8771ebfdfc70a805.js',
          revision: '8771ebfdfc70a805',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-73fd5990b3a1c04a.js',
          revision: '73fd5990b3a1c04a',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-96032ce5d6feb1bd.js',
          revision: '96032ce5d6feb1bd',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-995821b06d53b5a9.js',
          revision: '995821b06d53b5a9',
        },
        {
          url: '/_next/static/chunks/app/applications/page-61405aa33cca7017.js',
          revision: '61405aa33cca7017',
        },
        {
          url: '/_next/static/chunks/app/applications/page-61405aa33cca7017.js.map',
          revision: 'baf01a91563fc10063da16c1645778b0',
        },
        {
          url: '/_next/static/chunks/app/auth/callback/route-f87cfc08567552ac.js',
          revision: 'f87cfc08567552ac',
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
          url: '/_next/static/chunks/app/billing/upgrade/page-6b17c12613e53146.js',
          revision: '6b17c12613e53146',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-6b17c12613e53146.js.map',
          revision: '70ca0de635b2294c2034270cc29ff265',
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
          url: '/_next/static/chunks/app/favorites/page-8edd0f1bd56817af.js',
          revision: '8edd0f1bd56817af',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-8edd0f1bd56817af.js.map',
          revision: 'd6f05a873b1ab6462cad769486f4e32b',
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
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-8b5bfefc5a72f2ea.js',
          revision: '8b5bfefc5a72f2ea',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-168f96306f73ddbc.js',
          revision: '168f96306f73ddbc',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-168f96306f73ddbc.js.map',
          revision: '05e76d82dea87590b843990a52262a88',
        },
        {
          url: '/_next/static/chunks/app/layout-985522b401e15658.js',
          revision: '985522b401e15658',
        },
        {
          url: '/_next/static/chunks/app/layout-985522b401e15658.js.map',
          revision: '1c45f70c30e96b87431c5b09fc90371a',
        },
        {
          url: '/_next/static/chunks/app/login/page-98949588dcf1a6d0.js',
          revision: '98949588dcf1a6d0',
        },
        {
          url: '/_next/static/chunks/app/login/page-98949588dcf1a6d0.js.map',
          revision: '761b94d37de9398ffe5c4f26616405b6',
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
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-e47366c31e4c880d.js',
          revision: 'e47366c31e4c880d',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-e47366c31e4c880d.js.map',
          revision: '78f26c6923948919ad0b6d3f1a23f673',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-31b7a3ddd5f795a2.js',
          revision: '31b7a3ddd5f795a2',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-31b7a3ddd5f795a2.js.map',
          revision: '5bcfa929f95bb92597c50789dc4eb621',
        },
        {
          url: '/_next/static/chunks/app/programs/page-7ee67ced22ce25d4.js',
          revision: '7ee67ced22ce25d4',
        },
        {
          url: '/_next/static/chunks/app/programs/page-7ee67ced22ce25d4.js.map',
          revision: '2eecd56144856b14b40b1f9f7f4a02de',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-eef9b81ca9952eda.js',
          revision: 'eef9b81ca9952eda',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-eef9b81ca9952eda.js.map',
          revision: '31b83be55be1e57366156c0bd083fb66',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-1021e9af56d16335.js',
          revision: '1021e9af56d16335',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-1021e9af56d16335.js.map',
          revision: '3709cf70d36269a21286d287b89b253a',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-c93cd8c7b6c750ed.js',
          revision: 'c93cd8c7b6c750ed',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-4e538be74e8ead7c.js',
          revision: '4e538be74e8ead7c',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-4e538be74e8ead7c.js.map',
          revision: 'aeae8e747e7e61ae75e345e163665af1',
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
          url: '/_next/static/chunks/app/settings/team/page-998dbc5f021f2e69.js',
          revision: '998dbc5f021f2e69',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-998dbc5f021f2e69.js.map',
          revision: '08187d75bc976d8b8acc04fd56955956',
        },
        {
          url: '/_next/static/chunks/app/signup/page-d5c6e7123204fa45.js',
          revision: 'd5c6e7123204fa45',
        },
        {
          url: '/_next/static/chunks/app/signup/page-d5c6e7123204fa45.js.map',
          revision: 'ccb97c4d69ffee478a8ad9d09319a523',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-aa640a7fe43a3243.js',
          revision: 'aa640a7fe43a3243',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-3750bd516c67fdb6.js', revision: '3750bd516c67fdb6' },
        {
          url: '/_next/static/chunks/main-3750bd516c67fdb6.js.map',
          revision: '826308411683fd64bf259cc3061a207e',
        },
        { url: '/_next/static/chunks/main-app-8be0320ed5656556.js', revision: '8be0320ed5656556' },
        {
          url: '/_next/static/chunks/main-app-8be0320ed5656556.js.map',
          revision: '1bed5024a2ec8751b3e71f772633c61f',
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
        { url: '/_next/static/css/03732869823cf726.css', revision: '03732869823cf726' },
        {
          url: '/_next/static/css/03732869823cf726.css.map',
          revision: '6e61c0c2a0742630d09d2771f80f9ce4',
        },
        {
          url: '/_next/static/uUBTHAiQ44-af0XjMdMtr/_buildManifest.js',
          revision: '2072d9d8d7c36cf5ae1ac4e8066875ce',
        },
        {
          url: '/_next/static/uUBTHAiQ44-af0XjMdMtr/_ssgManifest.js',
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
