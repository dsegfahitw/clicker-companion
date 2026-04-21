import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { GameLayout } from "@/components/game/GameLayout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Сторінку не знайдено</h2>
        <Link to="/" className="mt-6 inline-flex rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-primary">
          На головну
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" },
      { name: "theme-color", content: "#1e2a4a" },
      { title: "Українець: Шлях До Успіху" },
      { name: "description", content: "Український ідл-клікер: від робітника до олігарха. Прокачуй бізнес, навички, обирай чесно чи з хабарами." },
      { property: "og:title", content: "Українець: Шлях До Успіху" },
      { property: "og:description", content: "Український ідл-клікер: від робітника до олігарха." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <GameLayout />
  );
}
