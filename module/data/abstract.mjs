import { Notification } from "./notification.mjs";
import { defaultUnits } from "../utils.mjs";

export class DocumentConversion {
  constructor(data) {
    const subtypeClass = this.constructor.TYPE_REGISTRY.get(data?.type);
    if (subtypeClass && subtypeClass !== this.constructor) return new subtypeClass(data);

    this.document = data;
    this.converted = this.prepareConversionData();
  }

  /* -------------------------------------------- */

  static COLLECTION_NAME;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  get needsConversion() {
    return false;
  }

  /* -------------------------------------------- */

  static get worldNeedsConversion() {
    return game[this.COLLECTION_NAME].some((doc) => new this(doc).needsConversion);
  }

  /* -------------------------------------------- */
  /*  Subtype Factory                             */
  /* -------------------------------------------- */

  static TYPE_REGISTRY = new Map();

  /* -------------------------------------------- */

  static register(type, subtypeClass) {
    this.TYPE_REGISTRY.set(type, subtypeClass);
  }

  /* -------------------------------------------- */
  /*  Conversion                                  */
  /* -------------------------------------------- */

  static async worldConversion() {
    const { contents, documentName } = game[this.COLLECTION_NAME];

    const documents = contents.map((doc) => new this(doc)).filter((doc) => doc.needsConversion);
    const totalDocuments = documents.length;

    if (totalDocuments === 0) return;

    const notification = new Notification(`HTCM.TYPES.${documentName}`, totalDocuments);
    notification.progress();

    for (const [idx, doc] of documents.entries()) {
      await doc.update({ log: false });
      notification.update(idx + 1);
    }
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    return new ConvertedData();
  }

  /* -------------------------------------------- */

  updateSource({ log = true } = {}) {
    if (this.converted.isEmpty) return false;

    try {
      this.document.updateSource(this.converted.data);
    } catch (err) {
      Notification.error(this.document.name, err);
      return false;
    }

    if (log) Notification.success(this.document.name);

    return true;
  }

  /* -------------------------------------------- */

  async update({ log = true } = {}) {
    if (this.converted.isEmpty) return false;

    try {
      await this.document.update(this.converted.data);
    } catch (err) {
      Notification.error(this.document.name, err);
      return false;
    }

    if (log) Notification.success(this.document.name);

    return true;
  }

  /* -------------------------------------------- */
  /*  Controls & Options                          */
  /* -------------------------------------------- */

  headerControl(controls) {
    controls.push({
      label: "HTCM.ConvertButton",
      icon: "fa-solid fa-ruler-triangle",
      visible: () => this.needsConversion && !this.document?.inCompendium,
      onClick: async () => await this.update(),
    });
  }

  /* -------------------------------------------- */

  static contextOption(options) {
    options.push({
      name: "HTCM.ConvertButton",
      icon: '<i class="fa-solid fa-ruler-triangle"></i>',
      condition: (li) => this.getContextConversion(li)?.needsConversion ?? false,
      callback: async (li) => await this.getContextConversion(li)?.update(),
    });
  }

  /* -------------------------------------------- */
  /*  Helpers                                     */
  /* -------------------------------------------- */

  isType(type) {
    return this.document?.type === type;
  }

  /* -------------------------------------------- */

  hasUnits(data, units) {
    return units.map((u) => defaultUnits(u)).some((u) => data?.units === u);
  }

  /* -------------------------------------------- */

  isLenghtRange(data) {
    return !CONFIG.DND5E.rangeTypes[data?.units];
  }

  /* -------------------------------------------- */

  static getContextConversion(html) {
    const doc = game[this.COLLECTION_NAME]?.get(html.dataset?.entryId);
    return doc ? new this(doc) : null;
  }
}

/* -------------------------------------------- */
/*  Helpers                                     */
/* -------------------------------------------- */

class ConvertedData {
  #data = {};

  add(path, value) {
    if (value != null) foundry.utils.setProperty(this.#data, path, value);
  }

  get isEmpty() {
    return foundry.utils.isEmpty(this.#data);
  }

  get data() {
    return this.isEmpty ? undefined : this.#data;
  }
}
