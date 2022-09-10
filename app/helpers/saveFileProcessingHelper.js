import {
  AQUATIC_GROWING_ZONE,
  COLONIST,
  GROWING_ZONE,
  HUMAN_CONSTANT,
  PAWN_CONSTANT,
  PLAYER_COLONY,
  SLAVE,
} from "~/constants/constants";

export const processSaveFile = ({ savegame }) => {
  const world = savegame.game.world;
  const factions = world.factionManager.allFactions.li;
  const playerFactions = factions.filter(({ def }) => def === PLAYER_COLONY);
  const worldPawns = world.worldPawns.pawnsAlive.li;
  const mapPawns = savegame.game.maps.li.things.thing.filter(
    ({ $, def, guest, kindDef }) =>
      $ &&
      $.Class === PAWN_CONSTANT &&
      def === HUMAN_CONSTANT &&
      ((kindDef !== COLONIST && kindDef !== SLAVE) || guest.hostFaction !== "null")
  );
  const colonists = savegame.game.maps.li.things.thing.filter(
    ({ $, def, guest, kindDef }) =>
      $ &&
      $.Class === PAWN_CONSTANT &&
      def === HUMAN_CONSTANT &&
      kindDef === COLONIST &&
      !guest.guestStatus
  );
  const slaves = savegame.game.maps.li.things.thing.filter(
    ({ $, def, guest, kindDef }) =>
      $ &&
      $.Class === PAWN_CONSTANT &&
      def === HUMAN_CONSTANT &&
      kindDef === COLONIST &&
      guest.guestStatus &&
      guest.guestStatus === SLAVE
  );
  const prisoners = savegame.game.maps.li.things.thing.filter(
    ({ $, def, guest }) =>
      $ &&
      $.Class === PAWN_CONSTANT &&
      def === HUMAN_CONSTANT &&
      guest.guestStatus &&
      guest.guestStatus === "Prisoner"
  );
  const modList = savegame.meta.modIds.li;
  const growingZones = savegame.game.maps.li.zoneManager.allZones.li.filter(
    ({ $ }) => $ && [GROWING_ZONE, AQUATIC_GROWING_ZONE].includes($.Class)
  );

  return {
    factions,
    playerFactions,
    worldPawns,
    mapPawns,
    colonists,
    prisoners,
    slaves,
    modList,
    growingZones,
    initialized: true,
  };
};
