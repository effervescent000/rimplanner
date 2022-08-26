export const processSaveFile = ({ savegame }) => {
  // to avoid repeatedly looping through the entire object,
  // for now I'm just going to target sections I know I'll need to work with

  const world = savegame.game.world;

  return {
    factions: world.factionManager.allFactions.li,
    worldPawns: [
      ...world.worldPawns.pawnsAlive.li,
      ...world.worldPawns.pawnsForcefullyKeptAsWorldPawns.li,
    ],
  };
};
