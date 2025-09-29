import { i18n } from "./core/i18n";
import { ApiClientProvider } from "./core/providers/ApiClientProvider";
import { QueryClientProvider } from "./core/providers/QueryClientProvider";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  return (
    <ApiClientProvider>
      <QueryClientProvider>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </QueryClientProvider>
    </ApiClientProvider>
  );
};
