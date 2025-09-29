import { ApiClientContext } from "../providers/ApiClientProvider";
import { useContext } from "react";

export const useApiClient = () => useContext(ApiClientContext);
