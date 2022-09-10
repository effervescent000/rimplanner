import { useState, useEffect } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { Nav } from "rsuite";

// HELPERS
import WarningsBuilder from "./helpers/warningsBuilder";
import { savedConfig } from "./cookies";

// COMPONENTS
import SaveFileDropzone from "~/components/save-file-dropzone";
import PawnRow from "~/components/pawn-display/pawn-display";
import WarningsWrapper from "./components/warnings/warnings-wrapper";

// STYLES
import tailwindStyles from "~/styles/tailwind.css";
import rsuiteStyles from "rsuite/dist/rsuite.min.css";
import commonStyles from "~/styles/common.css";
import { json } from "@remix-run/node";

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

const DEFAULT_SETTINGS = {
  savedConfig: { slaveryMode: false, growingSeason: 30, pctNutritionFromGrowing: 0.5 },
};

export const loader = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await savedConfig.parse(cookieHeader)) || DEFAULT_SETTINGS;
  return json(cookie.savedConfig);
};

export const action = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await savedConfig.parse(cookieHeader)) || DEFAULT_SETTINGS;
  const body = await request.formData();
  const config = JSON.parse(body.get("config"));
  cookie.savedConfig = config;
  return new Response(JSON.stringify({ data: "Saved settings to cookie" }), {
    headers: {
      "Set-Cookie": await savedConfig.serialize(cookie),
      "Content-Type": "application/json",
    },
  });
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const loadedConfig = useLoaderData();
  const fetcher = useFetcher();

  const [saveData, setSaveData] = useState({
    factions: [],
    playerFactions: [],
    worldPawns: [],
    mapPawns: [],
    colonists: [],
    prisoners: [],
    slaves: [],
    modList: [],
    growingZones: [],
    initialized: false,
  });
  const [warnings, setWarnings] = useState([]);
  const [config, setConfig] = useState(DEFAULT_SETTINGS.savedConfig);

  useEffect(() => {
    fetcher.submit({ config: JSON.stringify(config) }, { method: "POST" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (saveData.initialized) {
      console.log(saveData);
      const wb = new WarningsBuilder({
        saveData,
        config,
      });
      wb.calculateNutrition();
      setWarnings(wb.warnings);
    }
  }, [saveData, config]);

  useEffect(() => {
    try {
      setConfig(loadedConfig);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <PawnRow playerPawns={[...saveData.colonists, ...saveData.slaves]} config={config} />
            <WarningsWrapper warnings={warnings} config={config} />
          </div>

          <Nav
            appearance="tabs"
            activeKey={location.pathname}
            onSelect={(key) => navigate(key, { replace: true })}
          >
            <Nav.Item eventKey="work">Work priorities</Nav.Item>
            <Nav.Item eventKey="eval">Evaluation</Nav.Item>
            <Nav.Item eventKey="settings">Settings</Nav.Item>
          </Nav>
          <Outlet context={{ saveData, setSaveData, config, setConfig }} />
        </div>
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  );
}
