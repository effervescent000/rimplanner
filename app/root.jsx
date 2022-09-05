import { useState, useEffect } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { Nav } from "rsuite";

import tailwindStyles from "~/styles/tailwind.css";
import rsuiteStyles from "rsuite/dist/rsuite.min.css";
import commonStyles from "~/styles/common.css";

import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";

export const meta = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => [
  { rel: "stylesheet", href: rsuiteStyles },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: commonStyles },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [saveData, setSaveData] = useState({
    factions: [],
    playerFactions: [],
    worldPawns: [],
    mapPawns: [],
    playerPawns: [],
    modList: [],
    growingZones: [],
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
        <div className="page-wrapper">
          <div className="flex gap-10">
            <SaveFileDropzone setSaveData={setSaveData} />
            <PawnRow playerPawns={saveData.playerPawns} />
          </div>

          <Nav
            appearance="tabs"
            activeKey={location.pathname}
            onSelect={(key) => navigate(key, { replace: true })}
          >
            <Nav.Item eventKey="work">Work priorities</Nav.Item>
            <Nav.Item eventKey="eval">Evaluation</Nav.Item>
          </Nav>
          <Outlet context={{ saveData, setSaveData }} />
        </div>
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
