import { DocumentConversion } from "../abstract.mjs";
import { convertModuleLength, convertModuleWeight, defaultUnits } from "../../utils.mjs";
import { UNITS } from "../../settings.mjs";

export class ItemConversion extends DocumentConversion {
  static COLLECTION_NAME = "items";

  /* -------------------------------------------- */

  static TYPE_REGISTRY = new Map();

  /* -------------------------------------------- */

  get isPhysical() {
    return "quantity" in this.document.system;
  }

  /* -------------------------------------------- */

  get needsConversion() {
    return this.weightConversion || this.activitiesConversion;
  }

  /* -------------------------------------------- */

  get weightConversion() {
    return this.isPhysical && !this.hasUnits(this.document.system.weight, ["weight"]);
  }

  /* -------------------------------------------- */

  get rangeConversion() {
    const { range } = this.document.system;
    return (
      (this.isType("weapon") || this.isType("spell")) &&
      this.isLenghtRange(range) &&
      !this.hasUnits(range, ["length", "distance"])
    );
  }

  /* -------------------------------------------- */

  get activitiesConversion() {
    const { activities } = this.document.system;
    if (!activities) return false;
    return activities.some((activity) => {
      const { range, target } = activity;

      const rangeConversion =
        range && this.isLenghtRange(range) && !this.hasUnits(range, UNITS.LENGTH);

      const targetConversion = target && !this.hasUnits(target.template, UNITS.LENGTH);

      return rangeConversion || targetConversion;
    });
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();

    if (this.weightConversion)
      convertedData.add("system.weight", convertModuleWeight(this.document.system.weight));

    if (this.activitiesConversion) {
      for (const activity of this.document.system.activities) {
        const { id, range, target } = activity;

        if (range && this.isLenghtRange(range) && !this.hasUnits(range, UNITS.LENGTH))
          convertedData.add(`system.activities.${id}.range`, convertModuleLength(range));

        if (target && !this.hasUnits(target.template, UNITS.LENGTH))
          convertedData.add(
            `system.activities.${id}.target.template`,
            convertModuleLength(target.template, {
              exceptions: ["count"],
            })
          );
      }
    }

    return convertedData;
  }
}
