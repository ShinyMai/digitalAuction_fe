const loadedScripts = new Set<string>();

export const loadEkycScripts = async (): Promise<void> => {
  const scripts = [
    "/lib/VNPTQRBrowserApp.js",
    "/lib/VNPTBrowserSDKAppV4.0.0.js",
    "/web-sdk-version-3.2.0.0.js",
  ];

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[src="${src}"]`
      );
      if (existingScript && loadedScripts.has(src)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = () => {
        loadedScripts.add(src);
        console.log(`Script loaded successfully: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`Lỗi tải ${src}`);
        reject(new Error(`Lỗi tải ${src}`));
      };

      if (existingScript) {
        existingScript.remove();
      }

      document.body.appendChild(script);
    });

  try {
    await Promise.all(scripts.map(loadScript));
    console.log("All EKYC scripts loaded successfully");
  } catch (error) {
    console.error("Failed to load EKYC scripts:", error);
    throw error;
  }
};
