import { AdapterWorkspace } from "@/components/workspace/adapter-workspace";

// This page is per-user and auth-gated, so it must never be statically cached.
export const dynamic = "force-dynamic";

export default function WorkspacePage() {
  return <AdapterWorkspace />;
}
