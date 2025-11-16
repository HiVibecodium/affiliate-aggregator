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
        { url: '/_next/app-build-manifest.json', revision: '72ed43572087500abe88e6f6f4792074' },
        {
          url: '/_next/static/apb3xwqvPiFR6KIAWR5Mk/_buildManifest.js',
          revision: '3f3ae5f19db0cdab3c0be640487e9b95',
        },
        {
          url: '/_next/static/apb3xwqvPiFR6KIAWR5Mk/_ssgManifest.js',
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
        { url: '/_next/static/chunks/5905-ff8b570d8052afca.js', revision: 'ff8b570d8052afca' },
        {
          url: '/_next/static/chunks/5905-ff8b570d8052afca.js.map',
          revision: 'e4d6a3614ac584e8c5eb30ef0cd24c64',
        },
        { url: '/_next/static/chunks/8598-742ff86fbe342b3f.js', revision: '742ff86fbe342b3f' },
        {
          url: '/_next/static/chunks/8598-742ff86fbe342b3f.js.map',
          revision: '10d266cea5be94bc7b3201b96c3534e4',
        },
        { url: '/_next/static/chunks/9778-d2a0053db9cf5f77.js', revision: 'd2a0053db9cf5f77' },
        {
          url: '/_next/static/chunks/9778-d2a0053db9cf5f77.js.map',
          revision: '1b7f854b0b6d8ac34ed3fb73df0bc4ac',
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
          url: '/_next/static/chunks/app/analytics/page-f4220e4bcb9abb5a.js',
          revision: 'f4220e4bcb9abb5a',
        },
        {
          url: '/_next/static/chunks/app/analytics/page-f4220e4bcb9abb5a.js.map',
          revision: '87398466bd41b0014e3fb7dd9c1fa2c8',
        },
        {
          url: '/_next/static/chunks/app/api/admin/add-amazon-programs/route-45508b1bb4e59030.js',
          revision: '45508b1bb4e59030',
        },
        {
          url: '/_next/static/chunks/app/api/admin/stats/route-545bb81e94422e0b.js',
          revision: '545bb81e94422e0b',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/advanced/route-288212ee3262c9b4.js',
          revision: '288212ee3262c9b4',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/popular/route-74fb23946020c399.js',
          revision: '74fb23946020c399',
        },
        {
          url: '/_next/static/chunks/app/api/analytics/web-vitals/route-39d9179b0bf7b666.js',
          revision: '39d9179b0bf7b666',
        },
        {
          url: '/_next/static/chunks/app/api/applications/%5Bid%5D/route-afd190b49682c5c8.js',
          revision: 'afd190b49682c5c8',
        },
        {
          url: '/_next/static/chunks/app/api/applications/route-f0e7fc96d2c57b99.js',
          revision: 'f0e7fc96d2c57b99',
        },
        {
          url: '/_next/static/chunks/app/api/auth/sync/route-170f3a92e00fbd69.js',
          revision: '170f3a92e00fbd69',
        },
        {
          url: '/_next/static/chunks/app/api/billing/checkout/route-683a6728eebcdef6.js',
          revision: '683a6728eebcdef6',
        },
        {
          url: '/_next/static/chunks/app/api/billing/plans/route-876a2c331fa19b16.js',
          revision: '876a2c331fa19b16',
        },
        {
          url: '/_next/static/chunks/app/api/billing/portal/route-335d7bd3e00d6345.js',
          revision: '335d7bd3e00d6345',
        },
        {
          url: '/_next/static/chunks/app/api/billing/subscription/route-a9db3cad935bdb8a.js',
          revision: 'a9db3cad935bdb8a',
        },
        {
          url: '/_next/static/chunks/app/api/billing/webhooks/route-56f07c74cd1cafb8.js',
          revision: '56f07c74cd1cafb8',
        },
        {
          url: '/_next/static/chunks/app/api/comparisons/check/route-2a6f8cda5282102d.js',
          revision: '2a6f8cda5282102d',
        },
        {
          url: '/_next/static/chunks/app/api/cron/check-saved-searches/route-cbbdf7d79dd04e76.js',
          revision: 'cbbdf7d79dd04e76',
        },
        {
          url: '/_next/static/chunks/app/api/dashboard/analytics/route-139fa445b06bd88d.js',
          revision: '139fa445b06bd88d',
        },
        {
          url: '/_next/static/chunks/app/api/favorites/route-f2acf9e4e8c972db.js',
          revision: 'f2acf9e4e8c972db',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-cecb1ba0a9789297.js',
          revision: 'cecb1ba0a9789297',
        },
        {
          url: '/_next/static/chunks/app/api/import/bulk/route-da2b70bd8cce59f2.js',
          revision: 'da2b70bd8cce59f2',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/%5BmemberId%5D/route-8fab621889b9dcbb.js',
          revision: '8fab621889b9dcbb',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/%5BorgId%5D/members/route-8ac10ec95308c09b.js',
          revision: '8ac10ec95308c09b',
        },
        {
          url: '/_next/static/chunks/app/api/organizations/route-23321ac6d25107d4.js',
          revision: '23321ac6d25107d4',
        },
        {
          url: '/_next/static/chunks/app/api/programs/filters/route-df34ad8aeb1fe339.js',
          revision: 'df34ad8aeb1fe339',
        },
        {
          url: '/_next/static/chunks/app/api/programs/route-f3f83d53d3cc945c.js',
          revision: 'f3f83d53d3cc945c',
        },
        {
          url: '/_next/static/chunks/app/api/programs/stats/route-91e6894946e75877.js',
          revision: '91e6894946e75877',
        },
        {
          url: '/_next/static/chunks/app/api/referrals/route-d15042d2a0062a56.js',
          revision: 'd15042d2a0062a56',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/%5BreviewId%5D/helpful/route-cd52724125132511.js',
          revision: 'cd52724125132511',
        },
        {
          url: '/_next/static/chunks/app/api/reviews/%5BprogramId%5D/route-c4b708b3962dc8fb.js',
          revision: 'c4b708b3962dc8fb',
        },
        {
          url: '/_next/static/chunks/app/api/saved-searches/route-0b5418ef48a0f81d.js',
          revision: '0b5418ef48a0f81d',
        },
        {
          url: '/_next/static/chunks/app/api/seed/route-9c5c9acf5d645ac1.js',
          revision: '9c5c9acf5d645ac1',
        },
        {
          url: '/_next/static/chunks/app/api/track/click/route-c1ea92b2bcbdcbab.js',
          revision: 'c1ea92b2bcbdcbab',
        },
        {
          url: '/_next/static/chunks/app/api/version/route-8dba8b8e5c0940a3.js',
          revision: '8dba8b8e5c0940a3',
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
          url: '/_next/static/chunks/app/auth/callback/route-0735e2caae7b1e7a.js',
          revision: '0735e2caae7b1e7a',
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
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-3510259509e479c9.js',
          revision: '3510259509e479c9',
        },
        {
          url: '/_next/static/chunks/app/categories/%5Bslug%5D/page-3510259509e479c9.js.map',
          revision: '57963c323c946feb1bc1bc0df0420578',
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
        { url: '/_next/static/chunks/app/error-eabfd4bdeef1ddf5.js', revision: 'eabfd4bdeef1ddf5' },
        {
          url: '/_next/static/chunks/app/error-eabfd4bdeef1ddf5.js.map',
          revision: '6fc56b1572121aa7fd9ed7cd85c5efe5',
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
          url: '/_next/static/chunks/app/layout-85333e99fd24ce80.js',
          revision: '85333e99fd24ce80',
        },
        {
          url: '/_next/static/chunks/app/layout-85333e99fd24ce80.js.map',
          revision: '57aa263488d6c040c49512b47b9e8339',
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
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-c9dd5766b49a2d07.js',
          revision: 'c9dd5766b49a2d07',
        },
        {
          url: '/_next/static/chunks/app/networks/%5Bslug%5D/page-c9dd5766b49a2d07.js.map',
          revision: 'f920a75755552d7c0f3cc79737f0d1c2',
        },
        { url: '/_next/static/chunks/app/page-eb0faefd1801d4e3.js', revision: 'eb0faefd1801d4e3' },
        {
          url: '/_next/static/chunks/app/page-eb0faefd1801d4e3.js.map',
          revision: 'b3c038465e64949dc5bd125b7fe01388',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-3c06276e549e9b1e.js',
          revision: '3c06276e549e9b1e',
        },
        {
          url: '/_next/static/chunks/app/programs/%5Bid%5D/page-3c06276e549e9b1e.js.map',
          revision: '5d06fdda5c45c96f3ee1daf4cbcb221b',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-305c1f7c2f9c0f31.js',
          revision: '305c1f7c2f9c0f31',
        },
        {
          url: '/_next/static/chunks/app/programs/new/page-305c1f7c2f9c0f31.js.map',
          revision: '1eb043e9a7a8dc53fab826826ade8e67',
        },
        {
          url: '/_next/static/chunks/app/programs/page-b91c4b6179acc2a1.js',
          revision: 'b91c4b6179acc2a1',
        },
        {
          url: '/_next/static/chunks/app/programs/page-b91c4b6179acc2a1.js.map',
          revision: '925cdde0898ff664a79eb2e837f034c4',
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
          url: '/_next/static/chunks/app/robots.txt/route-a8ad1cb1be42520f.js',
          revision: 'a8ad1cb1be42520f',
        },
        {
          url: '/_next/static/chunks/app/settings/page-d6127fa239246ba8.js',
          revision: 'd6127fa239246ba8',
        },
        {
          url: '/_next/static/chunks/app/settings/page-d6127fa239246ba8.js.map',
          revision: '722ad2dd605834b8c40248e202373ed7',
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
          url: '/_next/static/chunks/app/sitemap.xml/route-d7473ce4c0b3555a.js',
          revision: 'd7473ce4c0b3555a',
        },
        { url: '/_next/static/chunks/framework-8837ac035ae3d80f.js', revision: '8837ac035ae3d80f' },
        {
          url: '/_next/static/chunks/framework-8837ac035ae3d80f.js.map',
          revision: '3085a3fe061fcc02d4327351b54c0ee6',
        },
        { url: '/_next/static/chunks/main-4c3e9041bcbf924a.js', revision: '4c3e9041bcbf924a' },
        {
          url: '/_next/static/chunks/main-4c3e9041bcbf924a.js.map',
          revision: '074611ce89326f9e6aad490c81ca9114',
        },
        { url: '/_next/static/chunks/main-app-3a09066758e19cc9.js', revision: '3a09066758e19cc9' },
        {
          url: '/_next/static/chunks/main-app-3a09066758e19cc9.js.map',
          revision: '86e7993f9928c5c814a9906b64acdaee',
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
        { url: '/_next/static/chunks/webpack-dd332ddcd87ad2cb.js', revision: 'dd332ddcd87ad2cb' },
        {
          url: '/_next/static/chunks/webpack-dd332ddcd87ad2cb.js.map',
          revision: '9527994db832bec3b9119b10405a0f05',
        },
        { url: '/_next/static/css/3827930edab1a50b.css', revision: '3827930edab1a50b' },
        {
          url: '/_next/static/css/3827930edab1a50b.css.map',
          revision: 'cd73f9434f72e41d1e5c38e722644fe8',
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
