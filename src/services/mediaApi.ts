import { api } from "./api";
import type { paths } from "../types/openapi";

type UploadMediaSchema = NonNullable<
    paths["/api/media/upload"]["post"]["requestBody"]
>["content"]["multipart/form-data"];
type MediaPathParams = NonNullable<
    paths["/media/{websiteId}/{filename}"]["get"]["parameters"]["path"]
>;

type UploadMediaArgs = Omit<UploadMediaSchema, "File"> & {
    File: Blob | File | string;
};

export const mediaApi = api.injectEndpoints({
    endpoints: (build) => ({
        uploadMedia: build.mutation<void, UploadMediaArgs>({
            query: ({ WebsiteId, File }) => {
                const formData = new FormData();
                formData.append("WebsiteId", WebsiteId);
                formData.append("File", File);

                return {
                    url: "/api/media/upload",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Media"],
        }),
        getMediaFile: build.query<Blob, MediaPathParams>({
            query: ({ websiteId, filename }) => ({
                url: `/media/${websiteId}/${filename}`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
            providesTags: ["Media"],
        }),
        deleteMediaFile: build.mutation<void, MediaPathParams>({
            query: ({ websiteId, filename }) => ({
                url: `/api/media/${websiteId}/${filename}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Media"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useUploadMediaMutation,
    useGetMediaFileQuery,
    useDeleteMediaFileMutation,
} = mediaApi;

