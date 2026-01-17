import { ActorConversion } from "../actor.mjs";
import { convertModuleTravelSpeed } from "../../../utils.mjs";
import { UNITS } from "../../../settings.mjs";

export class GroupConversion extends ActorConversion {
  get needsConversion() {
    return this.travelConversion;
  }

  /* -------------------------------------------- */

  get travelConversion() {
    const { travel } = this.document.system.attributes;
    return !this.hasUnits(travel, UNITS.TRAVEL);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { travel } = this.document.system.attributes;

    if (this.travelConversion)
      convertedData.add("system.attributes.travel", convertModuleTravelSpeed(travel));

    return convertedData;
  }
}
