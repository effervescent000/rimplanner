import { HUMAN_CONSTANT, PAWN_CONSTANT, PLAYER_COLONY } from "~/constants/constants";
import { getFactionKey } from "./utils";

export const processSaveFile = ({ savegame }) => {
  // to avoid repeatedly looping through the entire object,
  // for now I'm just going to target sections I know I'll need to work with

  const world = savegame.game.world;
  const factions = world.factionManager.allFactions.li;
  const playerFactions = factions.filter(({ def }) => def === PLAYER_COLONY);
  const worldPawns = [...world.worldPawns.pawnsAlive.li];
  const playerPawns = savegame.game.maps.li.things.thing.filter(
    ({ $, faction, def }) =>
      $ &&
      $.Class === PAWN_CONSTANT &&
      faction &&
      def === HUMAN_CONSTANT &&
      playerFactions.some((playerFaction) => faction === getFactionKey(playerFaction))
  );
  const modList = savegame.meta.modIds.li;

  return {
    factions,
    playerFactions,
    worldPawns,
    playerPawns,
    modList,
  };
};
