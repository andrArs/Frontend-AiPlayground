import { AIPlaygroundApiClient } from "../Base/BaseApiClient";
import { RunCreateModel } from "../Models/RunCreateModel";
import { RunGetModel } from "../Models/RunGetModel";
import { RunModel } from "../Models/RunModel";

export const RunsApiClient = {
  urlPath: "runs",

  async runAsync(model: RunCreateModel): Promise<RunModel[]> {
    return AIPlaygroundApiClient.post<RunModel[]>(this.urlPath, model).then(
      (response) => response.data
    );
  },

    async getAllAsync(): Promise<RunGetModel[]> {
    return AIPlaygroundApiClient.get<RunGetModel[]>(this.urlPath).then(
      (response) => response.data
    );
  },

  async rateAsync(id: number, rating: number): Promise<void> {
    return AIPlaygroundApiClient.patch<void>(`${this.urlPath}/${id}`, {
      user_rating:rating,
    }).then((response) => response.data);
  },
};