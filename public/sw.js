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
        { url: '/_next/app-build-manifest.json', revision: '53de325327c4d72def56c1f496393812' },
        { url: '/_next/static/chunks/1646.251205b6a714928d.js', revision: '251205b6a714928d' },
        {
          url: '/_next/static/chunks/1646.251205b6a714928d.js.map',
          revision: 'adc8152bdff90fbd0f08752435537982',
        },
        { url: '/_next/static/chunks/2619-90bfd2a431f72202.js', revision: '90bfd2a431f72202' },
        {
          url: '/_next/static/chunks/2619-90bfd2a431f72202.js.map',
          revision: '8d1664b169c03b176bd9fc52ae07bd25',
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
        { url: '/_next/static/chunks/5905-355bba1b2ebb6b9d.js', revision: '355bba1b2ebb6b9d' },
        {
          url: '/_next/static/chunks/5905-355bba1b2ebb6b9d.js.map',
          revision: '99db98d62bfc91107fdb1e9e90b59ce2',
        },
        { url: '/_next/static/chunks/8598-742ff86fbe342b3f.js', revision: '742ff86fbe342b3f' },
        {
          url: '/_next/static/chunks/8598-742ff86fbe342b3f.js.map',
          revision: '10d266cea5be94bc7b3201b96c3534e4',
        },
        { url: '/_next/static/chunks/9778-49d6a33a269f134c.js', revision: '49d6a33a269f134c' },
        {
          url: '/_next/static/chunks/9778-49d6a33a269f134c.js.map',
          revision: 'b33dc42976cfe88132093fd7cfe07c3b',
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
          url: '/_next/static/chunks/app/analytics/page-da96e72d9b9b2dd1.js',
          revision: 'da96e72d9b9b2dd1',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-da96e72d9b9b2dd1.js.map',
          revision: '3daab1a2748a478b0c41b2c559457e0f',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-8cd5f03b113e4972.js',
          revision: '8cd5f03b113e4972',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-ab727916d74dfdbf.js',
          revision: 'ab727916d74dfdbf',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-5e960e8c1bf40ae0.js',
          revision: '5e960e8c1bf40ae0',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-3e2145ce241a56cc.js',
          revision: '3e2145ce241a56cc',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-1627cdb49b466db3.js',
          revision: '1627cdb49b466db3',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-e1561834f593bf40.js',
          revision: 'e1561834f593bf40',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-2677c199a8654376.js',
          revision: '2677c199a8654376',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-526c73745ca13b76.js',
          revision: '526c73745ca13b76',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-94552ffac7900602.js',
          revision: '94552ffac7900602',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-11acfcf78f6aaebb.js',
          revision: '11acfcf78f6aaebb',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-1cb8cc92235886ae.js',
          revision: '1cb8cc92235886ae',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-0774a16c27f521d6.js',
          revision: '0774a16c27f521d6',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-777326ce34351dd5.js',
          revision: '777326ce34351dd5',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-32dbb3de4bda894f.js',
          revision: '32dbb3de4bda894f',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-2a6554953db115f5.js',
          revision: '2a6554953db115f5',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-868dfac8618a443b.js',
          revision: '868dfac8618a443b',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-ac732836f44fd974.js',
          revision: 'ac732836f44fd974',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-c58ecce0e812e0c9.js',
          revision: 'c58ecce0e812e0c9',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-fe87cdcd5e7526f2.js',
          revision: 'fe87cdcd5e7526f2',
        },
        {
          url: '/_next/static/chunks/app/api/invite/accept/route-be7762db9f4b7a10.js',
          revision: 'be7762db9f4b7a10',
        },
        {
          url: '/_next/static/chunks/app/api/invite/decline/route-f9a4691d6ffc182b.js',
          revision: 'f9a4691d6ffc182b',
        },
        {
          url: '/_next/static/chunks/app/api/invite/verify/route-cb45ed56ed709276.js',
          revision: 'cb45ed56ed709276',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-b4910054e29b2a56.js',
          revision: 'b4910054e29b2a56',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-0a6b2da94d612b2a.js',
          revision: '0a6b2da94d612b2a',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/route-25d029131f068fb3.js',
          revision: '25d029131f068fb3',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-4ff59698e2fe9ca2.js',
          revision: '4ff59698e2fe9ca2',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-48bc732b7b784240.js',
          revision: '48bc732b7b784240',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-c418307a6924147b.js',
          revision: 'c418307a6924147b',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-b761342633b7e671.js',
          revision: 'b761342633b7e671',
        },
        {
          url: '/_next/static/chunks/app/api/programs/suggestions/route-f18ddc93575f8b5d.js',
          revision: 'f18ddc93575f8b5d',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-7a6f359c184dec4f.js',
          revision: '7a6f359c184dec4f',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-8463d1bffba1e6cf.js',
          revision: '8463d1bffba1e6cf',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-40dba4e66e573567.js',
          revision: '40dba4e66e573567',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-3ab084a4bc535265.js',
          revision: '3ab084a4bc535265',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/unsubscribe/route-61e31ea731b9b544.js',
          revision: '61e31ea731b9b544',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-c71053fa4809e365.js',
          revision: 'c71053fa4809e365',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-6ad85410cdf4eb89.js',
          revision: '6ad85410cdf4eb89',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-b55c8c62ddc3671b.js',
          revision: 'b55c8c62ddc3671b',
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
          url: '/_next/static/chunks/app/auth/callback/route-3976605c066d5720.js',
          revision: '3976605c066d5720',
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
          url: '/_next/static/chunks/app/billing/success/page-91b5a301a0287c8f.js',
          revision: '91b5a301a0287c8f',
        },
        {
          url: '/_next/static/chunks/app/billing/success/page-91b5a301a0287c8f.js.map',
          revision: 'b3d207b37dd03888c778d89785ed48c3',
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
          url: '/_next/static/chunks/app/blog/page-4b2448cc08ba2ca9.js',
          revision: '4b2448cc08ba2ca9',
        },
        {
          url: '/_next/static/chunks/app/blog/page-4b2448cc08ba2ca9.js.map',
          revision: 'c64bdb441e2f1a855a5e4cbc28465dc1',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-e9f427eada83f475.js',
          revision: 'e9f427eada83f475',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-e9f427eada83f475.js.map',
          revision: 'fc04e307672779aded805e4621cd2704',
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
          url: '/_next/static/chunks/app/dashboard/page-9a217d65052fb0e4.js',
          revision: '9a217d65052fb0e4',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-9a217d65052fb0e4.js.map',
          revision: 'c6ba7ba569378440372d05208db019bd',
        },
        { url: '/_next/static/chunks/app/error-c73caf0cdd252f08.js', revision: 'c73caf0cdd252f08' },
        {
          url: '/_next/static/chunks/app/error-c73caf0cdd252f08.js.map',
          revision: '51aeb872f8a193d04363a827e53d8c67',
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
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-3a624794b1b90d62.js',
          revision: '3a624794b1b90d62',
        },
        {
          url: '/_next/static/chunks/app/invite/%5Btoken%5D/page-3a624794b1b90d62.js.map',
          revision: '6a682c0d7d28d4283b84e0f318d95b69',
        },
        {
          url: '/_next/static/chunks/app/layout-f039b9570dee95d2.js',
          revision: 'f039b9570dee95d2',
        },
        {
          url: '/_next/static/chunks/app/layout-f039b9570dee95d2.js.map',
          revision: '50d3c34e5b2a75bb03f52082be1fe900',
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
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-4aae035998f45b01.js',
          revision: '4aae035998f45b01',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-4aae035998f45b01.js.map',
          revision: '500ba4a62a1f76dc5636e11d8049d662',
        },
        { url: '/_next/static/chunks/app/page-eb0faefd1801d4e3.js', revision: 'eb0faefd1801d4e3' },
        {
          url: '/_next/static/chunks/app/page-eb0faefd1801d4e3.js.map',
          revision: 'b3c038465e64949dc5bd125b7fe01388',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-a23ef73ed8f75276.js',
          revision: 'a23ef73ed8f75276',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-a23ef73ed8f75276.js.map',
          revision: 'c78b596df782ab011477e16dcd90aba3',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-2534d4a7acb6abd7.js',
          revision: '2534d4a7acb6abd7',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-2534d4a7acb6abd7.js.map',
          revision: '087d9c68243e253c1b7a6da991ffa587',
        },
        {
          url: '/_next/static/chunks/app/programs/page-5f6e5e13505ca5b3.js',
          revision: '5f6e5e13505ca5b3',
        },
        {
          url: '/_next/static/chunks/app/programs/page-5f6e5e13505ca5b3.js.map',
          revision: '32af22781aabc507eda2f04eb21f7578',
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
          url: '/_next/static/chunks/app/robots.txt/route-e98a6466aff9bb48.js',
          revision: 'e98a6466aff9bb48',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-9e1dcfbd7ed386bd.js',
          revision: '9e1dcfbd7ed386bd',
        },
        {
          url: '/_next/static/chunks/app/settings/organization/page-9e1dcfbd7ed386bd.js.map',
          revision: 'f87d28da9b247e478c782b95fb9b5530',
        },
        {
          url: '/_next/static/chunks/app/settings/page-b5034e014ce0d780.js',
          revision: 'b5034e014ce0d780',
        },
        {
          url: '/_next/static/chunks/app/settings/page-b5034e014ce0d780.js.map',
          revision: 'faa2c419af4dee7e65a2367bfc37e36b',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-0b152950fc66a6ac.js',
          revision: '0b152950fc66a6ac',
        },
        {
          url: '/_next/static/chunks/app/settings/team/page-0b152950fc66a6ac.js.map',
          revision: '12e279d20095a2a478596eb0b83edf81',
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
          url: '/_next/static/chunks/app/sitemap.xml/route-a75eab8f7050982c.js',
          revision: 'a75eab8f7050982c',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-6c7b365a4b83badb.js', revision: '6c7b365a4b83badb' },
        {
          url: '/_next/static/chunks/main-6c7b365a4b83badb.js.map',
          revision: 'e0178d5ee983e7fb7833c6378b91bcf6',
        },
        { url: '/_next/static/chunks/main-app-d6f65097a4215e7b.js', revision: 'd6f65097a4215e7b' },
        {
          url: '/_next/static/chunks/main-app-d6f65097a4215e7b.js.map',
          revision: 'd63e1cd6ec35ce3e641c1d4b746eb4fa',
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
          url: '/_next/static/chunks/pages/_error-470ddfda3231f929.js',
          revision: '470ddfda3231f929',
        },
        {
          url: '/_next/static/chunks/pages/_error-470ddfda3231f929.js.map',
          revision: 'e6f1f25f8e686fa2ec37753eadc68b47',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        { url: '/_next/static/chunks/webpack-bda6cc85fff0b38d.js', revision: 'bda6cc85fff0b38d' },
        {
          url: '/_next/static/chunks/webpack-bda6cc85fff0b38d.js.map',
          revision: '471bf16a0b8ae4d2140e9c79797db43a',
        },
        { url: '/_next/static/css/7ab057c247b215b9.css', revision: '7ab057c247b215b9' },
        {
          url: '/_next/static/css/7ab057c247b215b9.css.map',
          revision: '9e66432784ffa594f8eb4e3aaa70b519',
        },
        {
          url: '/_next/static/l0Hl9GEy3fdqgM-00KTOC/_buildManifest.js',
          revision: '45ab776b08ec456047d13a0cb0521c41',
        },
        {
          url: '/_next/static/l0Hl9GEy3fdqgM-00KTOC/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
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
