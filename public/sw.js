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
        { url: '/_next/app-build-manifest.json', revision: 'f2caeaae7148e3bea1e6f06297002489' },
        { url: '/_next/static/chunks/1646.5229f6652ec807ea.js', revision: '5229f6652ec807ea' },
        {
          url: '/_next/static/chunks/1646.5229f6652ec807ea.js.map',
          revision: '55ed93ebbb19c5a7f05de0b3b65079f2',
        },
        { url: '/_next/static/chunks/2619-c7c56cfdc6036433.js', revision: 'c7c56cfdc6036433' },
        {
          url: '/_next/static/chunks/2619-c7c56cfdc6036433.js.map',
          revision: '68afea6f67821a3d49c6acd8c1e02342',
        },
        { url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js', revision: 'cb93e6eb70aa7b7c' },
        {
          url: '/_next/static/chunks/31c90465-cb93e6eb70aa7b7c.js.map',
          revision: '750d46a935890c241ad7997202fda0d3',
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
        { url: '/_next/static/chunks/52774a7f-21e526f54e3d88fc.js', revision: '21e526f54e3d88fc' },
        {
          url: '/_next/static/chunks/52774a7f-21e526f54e3d88fc.js.map',
          revision: 'af7aafed49899170f7dd474b2a101aef',
        },
        { url: '/_next/static/chunks/5376-229e6f0615d10734.js', revision: '229e6f0615d10734' },
        {
          url: '/_next/static/chunks/5376-229e6f0615d10734.js.map',
          revision: 'f463b8f007e00e69abd0d8bbc213b298',
        },
        { url: '/_next/static/chunks/5905-832c75bb17bbda5e.js', revision: '832c75bb17bbda5e' },
        {
          url: '/_next/static/chunks/5905-832c75bb17bbda5e.js.map',
          revision: '6c1fff3ab115bc1fc7af568b29e4131e',
        },
        { url: '/_next/static/chunks/8598-742ff86fbe342b3f.js', revision: '742ff86fbe342b3f' },
        {
          url: '/_next/static/chunks/8598-742ff86fbe342b3f.js.map',
          revision: '10d266cea5be94bc7b3201b96c3534e4',
        },
        { url: '/_next/static/chunks/9778-cf325041c250826f.js', revision: 'cf325041c250826f' },
        {
          url: '/_next/static/chunks/9778-cf325041c250826f.js.map',
          revision: '0bd3a9ff57f4a62927220c4a56e6f66b',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-20d5585d5f73b2d9.js',
          revision: '20d5585d5f73b2d9',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-20d5585d5f73b2d9.js.map',
          revision: '9a29d0b83202dc1897a71cb878567fe8',
        },
        {
          url: '/_next/static/chunks/app/admin/page-a701dfaf5a50f9b8.js',
          revision: 'a701dfaf5a50f9b8',
        },
        {
          url: '/_next/static/chunks/app/admin/page-a701dfaf5a50f9b8.js.map',
          revision: 'ab4561adb86055dc02cdb996ca1a06e5',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-da7d8116a1548a83.js',
          revision: 'da7d8116a1548a83',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-da7d8116a1548a83.js.map',
          revision: '731dede56f49d789b08f137b43ca8026',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-76bfe6bca55d8994.js',
          revision: '76bfe6bca55d8994',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-461fe4e16f4a61ca.js',
          revision: '461fe4e16f4a61ca',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-020760c2796351f1.js',
          revision: '020760c2796351f1',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-e3a8fcd51e0981cf.js',
          revision: 'e3a8fcd51e0981cf',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-e0a072e2acfe20e9.js',
          revision: 'e0a072e2acfe20e9',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-ad796ccad5da4ce7.js',
          revision: 'ad796ccad5da4ce7',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-f140efe7dd1e964c.js',
          revision: 'f140efe7dd1e964c',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-d39758c16bc45611.js',
          revision: 'd39758c16bc45611',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-9dcbe5978f7e76cc.js',
          revision: '9dcbe5978f7e76cc',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-41d4a7f0d4ab0582.js',
          revision: '41d4a7f0d4ab0582',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-4309937f5ea85212.js',
          revision: '4309937f5ea85212',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-b887d1bbe254d981.js',
          revision: 'b887d1bbe254d981',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-71972004dc4e29b6.js',
          revision: '71972004dc4e29b6',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-d06838c4e0b7e713.js',
          revision: 'd06838c4e0b7e713',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-7d3a4788c8df59ae.js',
          revision: '7d3a4788c8df59ae',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-e2f15c7adb065210.js',
          revision: 'e2f15c7adb065210',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-37a77ac26850dc03.js',
          revision: '37a77ac26850dc03',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-3d2647b399e15f88.js',
          revision: '3d2647b399e15f88',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-06c0286fe3ee9a14.js',
          revision: '06c0286fe3ee9a14',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-79f6c3da19994967.js',
          revision: '79f6c3da19994967',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-b8c5353751659ac5.js',
          revision: 'b8c5353751659ac5',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-251f6fbaf433d1b9.js',
          revision: '251f6fbaf433d1b9',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-f88088a9308daa28.js',
          revision: 'f88088a9308daa28',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-cb2d25d1d9c32a69.js',
          revision: 'cb2d25d1d9c32a69',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-bfd5bf122b589cca.js',
          revision: 'bfd5bf122b589cca',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-8f7ab2d447ec27e6.js',
          revision: '8f7ab2d447ec27e6',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-eb7e9e69ff807bbf.js',
          revision: 'eb7e9e69ff807bbf',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-ba5c97bc9871e860.js',
          revision: 'ba5c97bc9871e860',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-aefb70490f040257.js',
          revision: 'aefb70490f040257',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-37fce49b082d31b6.js',
          revision: '37fce49b082d31b6',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-593fb53ab8845af1.js',
          revision: '593fb53ab8845af1',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-587df0ddf47e3f1b.js',
          revision: '587df0ddf47e3f1b',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-81a9e15619493b3a.js',
          revision: '81a9e15619493b3a',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-0bcf913b82ff6879.js',
          revision: '0bcf913b82ff6879',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-1bdaca2ed11a9c89.js',
          revision: '1bdaca2ed11a9c89',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-903176baea3e4491.js',
          revision: '903176baea3e4491',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-f09d7d9e7a294aab.js',
          revision: 'f09d7d9e7a294aab',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-0fae10ac4c0d085c.js',
          revision: '0fae10ac4c0d085c',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-dd6c5149a0be9f21.js',
          revision: 'dd6c5149a0be9f21',
        },
        {
          url: '/_next/static/chunks/app/applications/page-10b7e46c82706169.js',
          revision: '10b7e46c82706169',
        },
        {
          url: '/_next/static/chunks/app/applications/page-10b7e46c82706169.js.map',
          revision: '90aaee3617ce07f985bdaf1e4032a1b7',
        },
        {
          url: '/_next/static/chunks/app/auth/callback/route-6106af36e045b9a1.js',
          revision: '6106af36e045b9a1',
        },
        {
          url: '/_next/static/chunks/app/billing/page-0d87f9cc83d6d182.js',
          revision: '0d87f9cc83d6d182',
        },
        {
          url: '/_next/static/chunks/app/billing/page-0d87f9cc83d6d182.js.map',
          revision: '42e2c34667b3701d051a68ecc6cc30ae',
        },
        {
          url: '/_next/static/chunks/app/billing/success/page-17c037e524704066.js',
          revision: '17c037e524704066',
        },
        {
          url: '/_next/static/chunks/app/billing/success/page-17c037e524704066.js.map',
          revision: '4baa30dff1d5145fe58f9d396b650143',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-5e27d47cd72a07b2.js',
          revision: '5e27d47cd72a07b2',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-5e27d47cd72a07b2.js.map',
          revision: 'fed7ffd2e8e6291f7f527be923a27d9b',
        },
        {
          url: '/_next/static/chunks/app/blog/page-9d0dca18fdebb04c.js',
          revision: '9d0dca18fdebb04c',
        },
        {
          url: '/_next/static/chunks/app/blog/page-9d0dca18fdebb04c.js.map',
          revision: '3e168a602d5e90af9d189e7cc4f4a68e',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-1b596b2a2078603c.js',
          revision: '1b596b2a2078603c',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-1b596b2a2078603c.js.map',
          revision: 'aea0d533a3057de3d9b9839621f9a05a',
        },
        {
          url: '/_next/static/chunks/app/compare/page-1cd51e51800035d1.js',
          revision: '1cd51e51800035d1',
        },
        {
          url: '/_next/static/chunks/app/compare/page-1cd51e51800035d1.js.map',
          revision: '535e273acb052ce83152417a6ec50bf9',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-64493a6460b58d49.js',
          revision: '64493a6460b58d49',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-64493a6460b58d49.js.map',
          revision: '82b4f1aad3174c048cad3a1c44acee68',
        },
        { url: '/_next/static/chunks/app/error-f504d5a44c29c9fb.js', revision: 'f504d5a44c29c9fb' },
        {
          url: '/_next/static/chunks/app/error-f504d5a44c29c9fb.js.map',
          revision: '40491e90d03b6a8e908231e22b6f3887',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-107b25e6eea57548.js',
          revision: '107b25e6eea57548',
        },
        {
          url: '/_next/static/chunks/app/favorites/page-107b25e6eea57548.js.map',
          revision: '3da95815e943ebed12854ac071723541',
        },
        {
          url: '/_next/static/chunks/app/global-error-60c5fbf80a5a76eb.js',
          revision: '60c5fbf80a5a76eb',
        },
        {
          url: '/_next/static/chunks/app/global-error-60c5fbf80a5a76eb.js.map',
          revision: '4899d1dda35208ff9648c37869ae4c59',
        },
        {
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-99c1f203ebcc9109.js',
          revision: '99c1f203ebcc9109',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-bdada6746bbe3729.js',
          revision: 'bdada6746bbe3729',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-bdada6746bbe3729.js.map',
          revision: '5de3c523f00204b9fdc9c41829051bf3',
        },
        {
          url: '/_next/static/chunks/app/layout-0cb5942e1a31b2e7.js',
          revision: '0cb5942e1a31b2e7',
        },
        {
          url: '/_next/static/chunks/app/layout-0cb5942e1a31b2e7.js.map',
          revision: 'cac95c68efeb655eb26322e925a44cc7',
        },
        {
          url: '/_next/static/chunks/app/login/page-f78be24d48aa9250.js',
          revision: 'f78be24d48aa9250',
        },
        {
          url: '/_next/static/chunks/app/login/page-f78be24d48aa9250.js.map',
          revision: '8cd7fc5c8d5755329bb9d67008b10fb8',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-cb0b811bdb55b8d9.js',
          revision: 'cb0b811bdb55b8d9',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-cb0b811bdb55b8d9.js.map',
          revision: 'dfbf7c50a0cf7ffdf6b5e30acee09d7a',
        },
        { url: '/_next/static/chunks/app/page-8fc9ff80d3b387b2.js', revision: '8fc9ff80d3b387b2' },
        {
          url: '/_next/static/chunks/app/page-8fc9ff80d3b387b2.js.map',
          revision: 'ccde013bf50d26ff7cc4905316e7e3e7',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-760f0fd4b633ee08.js',
          revision: '760f0fd4b633ee08',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-760f0fd4b633ee08.js.map',
          revision: 'a57c3e07b2efedd985d9f51872b0e11f',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-f467ab7c2c5e364e.js',
          revision: 'f467ab7c2c5e364e',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-f467ab7c2c5e364e.js.map',
          revision: '3120ddca3d139556bdb85899d3ed2e12',
        },
        {
          url: '/_next/static/chunks/app/programs/page-56f2d5122aed72eb.js',
          revision: '56f2d5122aed72eb',
        },
        {
          url: '/_next/static/chunks/app/programs/page-56f2d5122aed72eb.js.map',
          revision: '8ab1d8bda90d9a2a30896dec696a9da4',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-14c67d995a6b4d00.js',
          revision: '14c67d995a6b4d00',
        },
        {
          url: '/_next/static/chunks/app/programs/top-rated/page-14c67d995a6b4d00.js.map',
          revision: '58a15b8b1b4134a75ba378c0131fcada',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-c6a268a512fd6249.js',
          revision: 'c6a268a512fd6249',
        },
        {
          url: '/_next/static/chunks/app/referrals/page-c6a268a512fd6249.js.map',
          revision: 'bad5bc8381a612ca703d5060f800e884',
        },
        {
          url: '/_next/static/chunks/app/robots.txt/route-004936dd6168bc9d.js',
          revision: '004936dd6168bc9d',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-9ac1fa5d17042202.js',
          revision: '9ac1fa5d17042202',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-9ac1fa5d17042202.js.map',
          revision: 'dd397de0e07062fa785f09a4f2b9886e',
        },
        {
          url: '/_next/static/chunks/app/settings/page-c1efe22f44f493f5.js',
          revision: 'c1efe22f44f493f5',
        },
        {
          url: '/_next/static/chunks/app/settings/page-c1efe22f44f493f5.js.map',
          revision: '8fc7e64b7002ed83679a5dc84c057731',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-e36bf89fbcf95819.js',
          revision: 'e36bf89fbcf95819',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-e36bf89fbcf95819.js.map',
          revision: '16ace67a95b615a4bd527c4f00da3367',
        },
        {
          url: '/_next/static/chunks/app/signup/page-b8120757cf3d416c.js',
          revision: 'b8120757cf3d416c',
        },
        {
          url: '/_next/static/chunks/app/signup/page-b8120757cf3d416c.js.map',
          revision: '77af9c50abfe3e96c872400d174657f2',
        },
        {
          url: '/_next/static/chunks/app/sitemap.xml/route-36dd1e0353bf1756.js',
          revision: '36dd1e0353bf1756',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-502a3ecf444d6c40.js', revision: '502a3ecf444d6c40' },
        {
          url: '/_next/static/chunks/main-502a3ecf444d6c40.js.map',
          revision: '3579e83f92167a9122ac9501d351972d',
        },
        { url: '/_next/static/chunks/main-app-41794ba76fac267f.js', revision: '41794ba76fac267f' },
        {
          url: '/_next/static/chunks/main-app-41794ba76fac267f.js.map',
          revision: '8520f9c5657f18ddc946558cac016261',
        },
        {
          url: '/_next/static/chunks/pages/_app-8e641909675bca20.js',
          revision: '8e641909675bca20',
        },
        {
          url: '/_next/static/chunks/pages/_app-8e641909675bca20.js.map',
          revision: '48a63f1197eb5f98d6b0cc102f226bbd',
        },
        {
          url: '/_next/static/chunks/pages/_error-f5a7cd88df968bb2.js',
          revision: 'f5a7cd88df968bb2',
        },
        {
          url: '/_next/static/chunks/pages/_error-f5a7cd88df968bb2.js.map',
          revision: '9d1f96bad0dfe85457a21ab791715f91',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-05b133ad66bc60fc.js', revision: '05b133ad66bc60fc' },
        {
          url: '/_next/static/chunks/webpack-05b133ad66bc60fc.js.map',
          revision: 'ec144cd5235268a48394f870d9b9d42f',
        },
        { url: '/_next/static/css/cedbd9229cfa20e7.css', revision: 'cedbd9229cfa20e7' },
        {
          url: '/_next/static/css/cedbd9229cfa20e7.css.map',
          revision: 'c14c1c6636c027e5f082fdf1d105e305',
        },
        {
          url: '/_next/static/i7-oLQl5oHoHNb5kMvk4R/_buildManifest.js',
          revision: '59fa10cd243aafb1782d393f353ee206',
        },
        {
          url: '/_next/static/i7-oLQl5oHoHNb5kMvk4R/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        { url: '/google9ee8e3822b3beb94.html', revision: '281552f13282f41f13f2fe056f29d403' },
        { url: '/manifest.json', revision: '0945d6962a8220f6c2ec99118bc100dd' },
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
