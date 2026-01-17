import { DocumentConversion } from "../abstract.mjs";
import { ItemConversion } from "../item/item.mjs";
import { Notification } from "../notification.mjs";

export class ActorConversion extends DocumentConversion {
  static COLLECTION_NAME = "actors";

  /* -------------------------------------------- */

  static TYPE_REGISTRY = new Map();

  /* -------------------------------------------- */

  get inventoryConversion() {
    return (
      (this.isType("character") || this.isType("npc")) &&
      this.document.items.some((item) => new ItemConversion(item).needsConversion)
    );
  }

  /* -------------------------------------------- */

  updateItemsSource() {
    const results = this.document.items.map((item) =>
      new ItemConversion(item).updateSource({ log: false })
    );
    return results.some(Boolean);
  }

  /* -------------------------------------------- */

  async updateItems() {
    const results = await Promise.all(
      this.document.items.map((item) => new ItemConversion(item).update({ log: false }))
    );
    return results.some(Boolean);
  }

  /* -------------------------------------------- */

  updateSource({ log = true } = {}) {
    const actorResult = super.updateSource({ log: false });
    const itemsResult = this.inventoryConversion && this.updateItemsSource();
    const result = actorResult || itemsResult;
    if (result && log) Notification.success(this.document.name);
    return result;
  }

  /* -------------------------------------------- */

  async update({ log = true } = {}) {
    const actorResult = await super.update({ log: false });
    const itemsResult = this.inventoryConversion && (await this.updateItems());
    const result = actorResult || itemsResult;
    if (result && log) Notification.success(this.document.name);
    return result;
  }
}
