chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const extensions = 'https://developer.chrome.com/docs/extensions';

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
    // Revisa el texto de la acción para ver si esta 'ON' o 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // El siguiente estado siempre sera el opuesto
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Cambia el texto de la accion al siguiente estado
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    // Inyectar o remover CSS.
    if (nextState === "ON") {
      // Inyectar el archivo CSS cuando el usuario "enciende" la extension
       await chrome.scripting.insertCSS({
          files: ["focus-mode.css"],
          target: { tabId: tab.id },
        });
    } else if (nextState === "OFF") {
        // Remover el archivo CSS cuando el usuario "apaga" la extension
        await chrome.scripting.removeCSS({
          files: ["focus-mode.css"],
          target: { tabId: tab.id },
        });
    }

  }
});
