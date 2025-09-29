import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { i18n } from "~/core/i18n";
import { useCreateUser } from "~/hooks/useCreateUser";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation("common");
  const { isPending, mutate } = useCreateUser();
  return (
    <div className="p-2">
      <h3>Welcome Home! {t("hello")}</h3>
      <p>Data från backend:en</p>
      <button
        onClick={() => {
          void i18n.changeLanguage(i18n.language === "sv" ? "en" : "sv");
        }}
      >
        Change Language
      </button>
      <button
        onClick={() => {
          mutate({ email: "test@example.com", username: "testuser" });
        }}
      >
        Create User
      </button>
      {isPending && <p>Loading...</p>}
    </div>
  );
}
