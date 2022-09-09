import { createCookie } from "@remix-run/node";

export const savedConfig = createCookie("savedConfig", { maxAge: 604800 });
