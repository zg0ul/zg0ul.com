"use client";

import dynamic from "next/dynamic";

// Dynamically import with ssr: false because react-pdf's pdfjs-dist uses
// Promise.withResolvers() which requires Node 22+. The Coolify server runs
// Node 20, so prerendering this page server-side crashes the build.
// This wrapper is a Client Component so we can use ssr: false here,
// while the parent page.tsx stays a Server Component to export metadata.
const ResumePage = dynamic(() => import("@/components/resume/ResumePage"), {
  ssr: false,
});

export default function ResumePageWrapper() {
  return <ResumePage />;
}
