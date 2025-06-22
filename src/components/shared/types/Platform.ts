import { Model } from "./Model";

export type Platform = {
  id: number;
  name?: string;
  image_url?: string;
  models: Model[];
};