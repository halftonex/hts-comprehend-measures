export class Notification {
  constructor(type, total) {
    this.notification = null;
    this.type = type;
    this.total = total;
  }

  /* -------------------------------------------- */

  static success(name) {
    ui.notifications.success("HTCM.STATUS.Converted", {
      format: { name },
      console: false,
    });
  }

  /* -------------------------------------------- */

  static error(name, error) {
    console.log(error);
    ui.notifications.error("HTCM.STATUS.ConversionError", {
      format: { name },
    });
  }

  /* -------------------------------------------- */

  progress() {
    this.notification = ui.notifications.success("HTCM.STATUS.WorldConversion", {
      progress: true,
      localize: true,
    });
  }

  /* -------------------------------------------- */

  update(partial) {
    const type = game.i18n.localize(`${this.type}${partial > 1 ? "PL" : ""}`);

    this.notification.update({
      pct: Math.min(1, partial / this.total),
      message: "HTCM.STATUS.WorldConverted",
      format: { partial, type },
    });
  }
}
