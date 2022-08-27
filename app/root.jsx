import { useState, useEffect } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import tailwindStyles from "~/styles/tailwind.css";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => [{ rel: "stylesheet", href: tailwindStyles }];

export default function App() {
  const [saveData, setSaveData] = useState({
    factions: [],
    playerFactions: [],
    worldPawns: [],
    playerPawns: [],
  });

  useEffect(() => {
    console.log(saveData);
  }, [saveData]);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <Scripts />
      </head>
      <body>
        <Outlet context={{ saveData, setSaveData }} />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
