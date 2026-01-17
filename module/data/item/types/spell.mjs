import { ItemConversion } from "../item.mjs";
import { convertModuleLength } from "../../../utils.mjs";
import { UNITS } from "../../../settings.mjs";

export class SpellConversion extends ItemConversion {
  get needsConversion() {
    return super.needsConversion || this.targetConversion || this.rangeConversion;
  }

  /* -------------------------------------------- */

  get targetConversion() {
    const { template } = this.document.system.target;
    return !this.hasUnits(template, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { range, target } = this.document.system;

    if (this.rangeConversion) convertedData.add("system.range", convertModuleLength(range));

    if (this.targetConversion)
      convertedData.add(
        "system.target.template",
        convertModuleLength(target.template, {
          exceptions: ["count"],
        })
      );

    return convertedData;
  }
}
