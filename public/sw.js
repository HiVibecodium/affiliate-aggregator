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
        { url: '/_next/app-build-manifest.json', revision: '90b2c74d8bf782163d4e636f5d6664cf' },
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
        { url: '/_next/static/chunks/8919-f07ed310a8996942.js', revision: 'f07ed310a8996942' },
        {
          url: '/_next/static/chunks/8919-f07ed310a8996942.js.map',
          revision: 'ccf01b7d470ede570a722bb3f75eee34',
        },
        { url: '/_next/static/chunks/9778-cf9fac7fea9a39ff.js', revision: 'cf9fac7fea9a39ff' },
        {
          url: '/_next/static/chunks/9778-cf9fac7fea9a39ff.js.map',
          revision: 'cdcdf65284d7e3e191b878cf44e155a8',
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
          url: '/_next/static/chunks/app/analytics/page-cc9fcfd280df6508.js',
          revision: 'cc9fcfd280df6508',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-cc9fcfd280df6508.js.map',
          revision: 'e998a71d6a69f0581f436a84617e05e5',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-14d21a7543cca276.js',
          revision: '14d21a7543cca276',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-4929efb744f5f96f.js',
          revision: '4929efb744f5f96f',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-de5a3159ef48ce76.js',
          revision: 'de5a3159ef48ce76',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-31c44ebf08e353c4.js',
          revision: '31c44ebf08e353c4',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/realtime/route-adc3546c72309989.js',
          revision: 'adc3546c72309989',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-e698a037114d33e0.js',
          revision: 'e698a037114d33e0',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-e3a4b5481c384d70.js',
          revision: 'e3a4b5481c384d70',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-8f81cbeb9129d45b.js',
          revision: '8f81cbeb9129d45b',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-85f25cd06de98f39.js',
          revision: '85f25cd06de98f39',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-28ce1109faad72ff.js',
          revision: '28ce1109faad72ff',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-50b8445b99e6aa8d.js',
          revision: '50b8445b99e6aa8d',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-e51d53efbceb36d2.js',
          revision: 'e51d53efbceb36d2',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-76a70ab0d26ed9f7.js',
          revision: '76a70ab0d26ed9f7',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-fa0617274100090e.js',
          revision: 'fa0617274100090e',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-e15751e358e10913.js',
          revision: 'e15751e358e10913',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-1e8f5e4311b67d8b.js',
          revision: '1e8f5e4311b67d8b',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-c20edf8c8cc71f30.js',
          revision: 'c20edf8c8cc71f30',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-98cd6d3568180c7e.js',
          revision: '98cd6d3568180c7e',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-52435147360f3fc4.js',
          revision: '52435147360f3fc4',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-4d8364fd29d579fd.js',
          revision: '4d8364fd29d579fd',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-2f670b5526e55f59.js',
          revision: '2f670b5526e55f59',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-dcdeb862686c2d02.js',
          revision: 'dcdeb862686c2d02',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-684b067b9b366c6d.js',
          revision: '684b067b9b366c6d',
        },
        {
          url: '/_next/static/chunks/app/api/og/route-a0a8f2c0e279bd27.js',
          revision: 'a0a8f2c0e279bd27',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-dd3acf7173f60d73.js',
          revision: 'dd3acf7173f60d73',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-5f86b28c417a1b60.js',
          revision: '5f86b28c417a1b60',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-396ea6b73c9e195d.js',
          revision: '396ea6b73c9e195d',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-1bdb0f5c7253aa25.js',
          revision: '1bdb0f5c7253aa25',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-2eee471fa300c94e.js',
          revision: '2eee471fa300c94e',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-febc2939fa658414.js',
          revision: 'febc2939fa658414',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-d2ff8032d58d2aad.js',
          revision: 'd2ff8032d58d2aad',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-e4de376569b95161.js',
          revision: 'e4de376569b95161',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-d53119d482b77a29.js',
          revision: 'd53119d482b77a29',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-09058ec1bb4f937f.js',
          revision: '09058ec1bb4f937f',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-97312cbb360b7ad6.js',
          revision: '97312cbb360b7ad6',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-f3277d41d47833c4.js',
          revision: 'f3277d41d47833c4',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-67e5336cda0d6b39.js',
          revision: '67e5336cda0d6b39',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-469645e68cbe1899.js',
          revision: '469645e68cbe1899',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-2e4381ca962987e5.js',
          revision: '2e4381ca962987e5',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-8493f1efe6f360d7.js',
          revision: '8493f1efe6f360d7',
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
          url: '/_next/static/chunks/app/auth/callback/route-e76cf7f05f907156.js',
          revision: 'e76cf7f05f907156',
        },
        {
          url: '/_next/static/chunks/app/billing/page-d86921a0d9bbb887.js',
          revision: 'd86921a0d9bbb887',
        },
        {
          url: '/_next/static/chunks/app/billing/page-d86921a0d9bbb887.js.map',
          revision: '23c8e7ca703ceb876682c2c2c3f7a0d7',
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
          url: '/_next/static/chunks/app/billing/upgrade/page-9c98d65c4f9704b4.js',
          revision: '9c98d65c4f9704b4',
        },
        {
          url: '/_next/static/chunks/app/billing/upgrade/page-9c98d65c4f9704b4.js.map',
          revision: '6a6e6c7faa9631ab9815f16a2fd38245',
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
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-8a170f5d3836f10d.js',
          revision: '8a170f5d3836f10d',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-8a170f5d3836f10d.js.map',
          revision: '5d4c834d4285cde9afaac461766ca78d',
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
          url: '/_next/static/chunks/app/google9ee8e3822b3beb94.html/route-fd528db354990b9f.js',
          revision: 'fd528db354990b9f',
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
          url: '/_next/static/chunks/app/layout-8213ca49ce98f3b1.js',
          revision: '8213ca49ce98f3b1',
        },
        {
          url: '/_next/static/chunks/app/layout-8213ca49ce98f3b1.js.map',
          revision: 'ee688929339348b1e37a95af163735df',
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
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-90f56eb72ae1c589.js',
          revision: '90f56eb72ae1c589',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-90f56eb72ae1c589.js.map',
          revision: 'c65e563a4a24b5074696779b866a05cd',
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
          url: '/_next/static/chunks/app/programs/new/page-fbcb04126b6c1eec.js',
          revision: 'fbcb04126b6c1eec',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-fbcb04126b6c1eec.js.map',
          revision: '5dce743bc074a3487764d03abf898cde',
        },
        {
          url: '/_next/static/chunks/app/programs/page-5a231ab2b445e2d2.js',
          revision: '5a231ab2b445e2d2',
        },
        {
          url: '/_next/static/chunks/app/programs/page-5a231ab2b445e2d2.js.map',
          revision: 'ba9ae79d3f6af617ec32e1c314edafa9',
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
          url: '/_next/static/chunks/app/robots.txt/route-ef87763e631388a3.js',
          revision: 'ef87763e631388a3',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-a567e946cda18ac9.js',
          revision: 'a567e946cda18ac9',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-a567e946cda18ac9.js.map',
          revision: '5f7942ad59a68a545e4c0cca16c460d4',
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
          url: '/_next/static/chunks/app/settings/team/page-5316788626b98fa1.js',
          revision: '5316788626b98fa1',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-5316788626b98fa1.js.map',
          revision: '92e1ea3297519c38219263d3e77bbf73',
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
          url: '/_next/static/chunks/app/sitemap.xml/route-d21b2a76d57b52ed.js',
          revision: 'd21b2a76d57b52ed',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-170e01cc5c2f1c5c.js', revision: '170e01cc5c2f1c5c' },
        {
          url: '/_next/static/chunks/main-170e01cc5c2f1c5c.js.map',
          revision: 'f2aecb66a76efe2bb36bf1f97fadc848',
        },
        { url: '/_next/static/chunks/main-app-e5a797659bf982b7.js', revision: 'e5a797659bf982b7' },
        {
          url: '/_next/static/chunks/main-app-e5a797659bf982b7.js.map',
          revision: '077d8354bc69316adf94653f90064555',
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
        { url: '/_next/static/css/899b214439c1cf0e.css', revision: '899b214439c1cf0e' },
        {
          url: '/_next/static/css/899b214439c1cf0e.css.map',
          revision: 'f3dfb916e2ee504407a50f8a12ce6fca',
        },
        {
          url: '/_next/static/hzylQsFjUAgcSa3_wPM98/_buildManifest.js',
          revision: '23b0c3683044fb24e3a05d80baea632e',
        },
        {
          url: '/_next/static/hzylQsFjUAgcSa3_wPM98/_ssgManifest.js',
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
