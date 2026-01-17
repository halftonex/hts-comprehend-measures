import { ItemConversion } from "../item.mjs";
import { convertModuleLength } from "../../../utils.mjs";

export class WeaponConversion extends ItemConversion {
  get needsConversion() {
    return super.needsConversion || this.rangeConversion;
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { range } = this.document.system;

    if (this.rangeConversion) convertedData.add("system.range", convertModuleLength(range));

    return convertedData;
  }
}
