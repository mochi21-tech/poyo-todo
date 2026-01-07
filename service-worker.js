// キャッシュの名前（更新したくなったら v2, v3 と変える）
const CACHE_NAME = "poyo-cache-v23";

// オフラインでも使いたいファイルを列挙
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./hanamaru.png",
  // ここに実際に使っている画像を追加していく
  "./asset/asset1.svg",
  "./asset/asset2.svg",
  "./asset/asset3.svg",
  "./asset/asset4.svg",
  "./asset/asset5.svg",
  "./asset/asset6.svg",
  "./asset/asset7.svg",
  "./asset/asset8.svg",
  "./asset/asset9.svg",
  "./asset/asset10.svg",
  "./asset/asset11.svg",
  "./asset/asset12.svg",
  "./asset/asset13.svg",
  "./asset/asset14.svg",
  "./asset/asset15.svg",
  "./asset/asset16.svg",
  "./asset/asset17.svg",
  "./asset/icon-192.png",
  "./asset/icon-512.png",
  "./asset/fullscreen-off.svg",
  "./asset/fullscreen-on.svg",
  "./asset/setting.svg",
  "./asset/guardian.svg",
];

// インストール時：まとめてキャッシュに入れる
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// 有効化時：古いキャッシュを消す
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

// 通信時：キャッシュ優先で返す（なければネット）
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // 完全オフラインで、かつキャッシュもないときの予備
        return caches.match("./index.html");
      });
    })
  );
});