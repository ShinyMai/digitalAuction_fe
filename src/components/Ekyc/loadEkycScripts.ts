// src/utils/loadEkycScripts.ts
const loadedScripts = new Set<string>();

export const loadEkycScripts = async (): Promise<void> => {
  const scripts = [
     "./lib/VNPTQRBrowserApp.js",
    "./lib/VNPTBrowserSDKAppV4.0.0.js",
    "/web-sdk-version-3.2.0.0.js",
  ];

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      if (loadedScripts.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = () => {
        loadedScripts.add(src);
        resolve();
      };
      script.onerror = () => {
        console.error(`Lỗi tải ${src}`);
        reject(new Error(`Lỗi tải ${src}`));
      };
      document.body.appendChild(script);
    });

  await Promise.all(scripts.map(loadScript));
};