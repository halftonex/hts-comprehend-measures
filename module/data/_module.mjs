/* -------------------------------------------- */
/*  Actor Imports                               */
/* -------------------------------------------- */

import { ActorConversion } from "./actor/actor.mjs";
import { GroupConversion } from "./actor/types/group.mjs";
import { NpcConversion } from "./actor/types/npc.mjs";

/* -------------------------------------------- */
/*  Item Imports                                */
/* -------------------------------------------- */

import { ItemConversion } from "./item/item.mjs";
import { ContainerConversion } from "./item/types/container.mjs";
import { RaceConversion } from "./item/types/race.mjs";
import { SpellConversion } from "./item/types/spell.mjs";
import { WeaponConversion } from "./item/types/weapon.mjs";

/* -------------------------------------------- */
/*  Scene Imports                               */
/* -------------------------------------------- */

import { SceneConversion } from "./scene/scene.mjs";

/* -------------------------------------------- */
/*  Actor Subtypes Registration                 */
/* -------------------------------------------- */

ActorConversion.register("group", GroupConversion);
ActorConversion.register("npc", NpcConversion);

/* -------------------------------------------- */
/*  Item Subtypes Registration                  */
/* -------------------------------------------- */

ItemConversion.register("container", ContainerConversion);
ItemConversion.register("race", RaceConversion);
ItemConversion.register("spell", SpellConversion);
ItemConversion.register("weapon", WeaponConversion);

/* -------------------------------------------- */
/*  Exports                                     */
/* -------------------------------------------- */

export { ActorConversion, ItemConversion, SceneConversion };
