import { api } from "./api";
import type { components, paths } from "../types/openapi";

type ContactRequest = components["schemas"]["ContactFormRequest"];
type ContactPathParams =
    paths["/api/contact/{websiteId}"]["post"]["parameters"]["path"];

type SubmitContactArgs = {
    websiteId: ContactPathParams["websiteId"];
    body: ContactRequest;
};

export const contactApi = api.injectEndpoints({
    endpoints: (build) => ({
        submitContactForm: build.mutation<void, SubmitContactArgs>({
            query: ({ websiteId, body }) => ({
                url: `/api/contact/${websiteId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Contact"],
        }),
    }),
    overrideExisting: false,
});

export const { useSubmitContactFormMutation } = contactApi;

