import type { Metadata } from "next";
// @ts-ignore Next.js loads global CSS at runtime; no TypeScript declaration is required.
import "./globals.css";
import { WorkspaceProvider } from "@/lib/workspaceContext";

export const metadata: Metadata = {
  title: "Mini Workspace Explorer",
  description: "A browser-based file manager for folders and text files.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-sans">
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </body>
    </html>
  );
};

export default RootLayout;
