import { createClient } from "microcms-js-sdk";

export interface Preset {
  id: string;
  title: string;
  modelUrl: string;
  scaleFactor?: number;
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.MICROCMS_API_KEY || "",
});
