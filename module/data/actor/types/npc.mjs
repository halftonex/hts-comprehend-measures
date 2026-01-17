import { ActorConversion } from "../actor.mjs";
import { convertModuleLength } from "../../../utils.mjs";
import { UNITS } from "../../../settings.mjs";

export class NpcConversion extends ActorConversion {
  get needsConversion() {
    return this.movementConversion || this.sensesConversion || this.inventoryConversion;
  }

  /* -------------------------------------------- */

  get movementConversion() {
    const { movement } = this.document._source.system.attributes;
    return !this.hasUnits(movement, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  get sensesConversion() {
    const { senses } = this.document._source.system.attributes;
    return !this.hasUnits(senses, UNITS.LENGTH);
  }

  /* -------------------------------------------- */

  prepareConversionData() {
    const convertedData = super.prepareConversionData();
    const { movement, senses } = this.document._source.system.attributes;

    if (this.movementConversion)
      convertedData.add("system.attributes.movement", convertModuleLength(movement));

    if (this.sensesConversion)
      convertedData.add("system.attributes.senses", convertModuleLength(senses));

    return convertedData;
  }
}
