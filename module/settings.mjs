export const MODULE_ID = "hts-comprehend-measures";

export const UNITS = {
  LENGTH: ["length", "distance"],
  DISTANCE: ["distance"],
  WEIGHT: ["weight"],
  VOLUME: ["volume"],
  TRAVEL: ["travel"],
};

export class Settings {
  static config() {
    if (CONFIG.DND5E.defaultUnits.distance)
      throw new Error('The "distance" property already exists in CONFIG.DND5E.defaultUnits.');
    CONFIG.DND5E.defaultUnits.distance = {
      imperial: "mi",
      metric: "km",
    };
  }

  /* -------------------------------------------- */

  static conversionDialog() {
    return foundry.applications.api.DialogV2.confirm({
      window: { title: "HT's Comprehend Measures" },
      content: game.i18n.localize("HTCM.DIALOG.Content"),
      buttons: [
        {
          action: "dontask",
          label: "HTCM.DIALOG.DontAsk",
          icon: "fa-regular fa-eye-slash",
          callback: () => {
            Settings.set("startupConversion", false);
            return false;
          },
        },
      ],
      modal: true,
    });
  }

  /* -------------------------------------------- */

  static register() {
    game.settings.register(MODULE_ID, "startupConversion", {
      name: "HTCM.SETTINGS.StartupConversion.Name",
      hint: "HTCM.SETTINGS.StartupConversion.Hint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    });
  }

  /* -------------------------------------------- */

  static get(key) {
    return game.settings.get(MODULE_ID, key);
  }

  /* -------------------------------------------- */

  static set(key, value) {
    game.settings.set(MODULE_ID, key, value);
  }
}
