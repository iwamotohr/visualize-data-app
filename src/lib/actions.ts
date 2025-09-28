"use server";

import { client } from "./microcms";

export async function getVisualizerPresets() {
  const data = await client.getList({
    endpoint: "modeldata",
  });
  return data.contents;
}
