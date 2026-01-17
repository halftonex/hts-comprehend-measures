import { ItemConversion } from "../item.mjs";
import { convertModuleLength } from "../../../utils.mjs";
import { UNITS } from "../../../settings.mjs";

export class RaceConversion extends ItemConversion {
  get needsConversion() {
    return super.needsConversion || this.movementConversion || this.sensesConversion;
  }

  /* -------------------------------------------- */

  get movementConversion() {
    const { movement } = this.document.system;
    return !this.hasUnits(movement, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  get sensesConversion() {
    const { senses } = this.document.system;
    return !this.hasUnits(senses, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { movement, senses } = this.document.system;

    if (this.movementConversion)
      convertedData.add("system.movement", convertModuleLength(movement));

    if (this.sensesConversion) convertedData.add("system.senses", convertModuleLength(senses));

    return convertedData;
  }
}
