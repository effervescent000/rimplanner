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
import { getSession, commitSession } from "./sessions";

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

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("config")) {
    const data = { savedConfig: session.get("config") };
    return json(data);
  }
  return json({ savedConfig: null });
};

export const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const body = await request.formData();
  const config = body.get("config");
  session.set("savedConfig", config);
  return new Response("Saved settings to cookie", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { savedConfig } = useLoaderData();

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
  const [config, setConfig] = useState({
    slaveryMode: false,
  });

  useEffect(() => {
    fetcher.submit({ config: JSON.stringify(config) }, { method: "POST" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  useEffect(() => {
    if (saveData.initialized) {
      console.log(saveData);
      // eventually take these config values from state
      const wb = new WarningsBuilder({
        saveData,
        config: { ...config, pctNutritionFromPlants: 0.5, growingSeason: 30 },
      });
      wb.calculateNutrition();
      setWarnings(wb.warnings);
    }
  }, [saveData, config]);

  useEffect(() => {
    const parsedConfig = JSON.parse(savedConfig);
    if (parsedConfig) {
      setConfig(parsedConfig);
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
