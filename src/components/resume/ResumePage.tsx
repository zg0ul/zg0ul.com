"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "motion/react";
import { MdOutlineFileDownload } from "react-icons/md";
import { usePageTracking } from "@/components/AnalyticsTracker";
// Document: wrapper that loads/parses the PDF file
// Page: renders a single page from the loaded PDF
// pdfjs: reference to the underlying PDF.js library (Mozilla's PDF rendering engine)
import { Document, Page, pdfjs } from "react-pdf";
// These CSS imports style the text selection overlay and clickable links/annotations
// within the rendered PDF pages. Without them, text selection and links look broken.
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF.js offloads heavy PDF parsing to a Web Worker (separate browser thread)
// to avoid blocking the main UI thread. This tells it to fetch the worker script
// from a CDN, version-matched to the installed pdfjs-dist package.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const RESUME_PDF_PATH = "/assets/pdf/zg0ul_Resume_Full.pdf";
const RESUME_DOWNLOAD_NAME = "zg0ul_Resume.pdf";

// Pulsing placeholder shown while the PDF is being fetched and parsed.
// Uses letter-size aspect ratio (8.5:11) so the skeleton matches the final layout.
const LoadingSkeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="bg-navy-700/50 animate-pulse rounded-lg"
        style={{ aspectRatio: "8.5/11", width: "100%" }}
      />
    ))}
  </div>
);

const ResumePage = () => {
  const { trackDownload, trackCustomEvent } = usePageTracking();
  // Total number of pages in the PDF — set once the Document finishes loading
  const [numPages, setNumPages] = useState<number | null>(null);
  // Current pixel width of the PDF container — used to make pages responsive
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the container's width using ResizeObserver so the PDF re-renders
  // at the correct width whenever the viewport or layout changes (responsive).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(container);
    return () => observer.disconnect(); // cleanup to prevent memory leaks
  }, []);

  // Called by <Document> once the PDF is fully loaded and parsed.
  // Memoized with useCallback to keep a stable reference across renders.
  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  // Programmatic download: creates a temporary <a> element to trigger the browser's
  // download dialog, then removes it. Also fires analytics tracking events.
  const handleDownload = () => {
    trackDownload(RESUME_DOWNLOAD_NAME, "resume");
    trackCustomEvent("resume_download", {
      format: "pdf",
      source: "resume_page",
      fileName: RESUME_DOWNLOAD_NAME,
    });

    const link = document.createElement("a");
    link.href = RESUME_PDF_PATH;
    link.download = RESUME_DOWNLOAD_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Resume downloaded!");
  };

  return (
    <section className="topPageMargin min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="section-title">My Resume</h1>
          <p className="section-description">
            View and download my professional resume
          </p>
        </div>

        {/* Resume Controls */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleDownload}
            variant="default"
            size="lg"
            className="cursor-pointer gap-2 transition-all duration-200 hover:scale-105"
          >
            <MdOutlineFileDownload className="h-5 w-5" />
            <span className="inline">Download</span>
          </Button>
        </div>

        {/* PDF Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full will-change-transform"
        >
          {/* This container's ref is observed by ResizeObserver to track width */}
          <div
            ref={containerRef}
            className="border-neon relative w-full overflow-hidden rounded-lg border bg-white shadow-xl transition-all duration-300 hover:shadow-2xl"
          >
            {/* Document loads the PDF file via the web worker and manages state */}
            <Document
              file={RESUME_PDF_PATH}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<LoadingSkeleton />}
              error={
                <div className="flex items-center justify-center p-12 text-red-500">
                  Failed to load PDF. Please try downloading instead.
                </div>
              }
            >
              {/* Dynamically render all pages stacked vertically.
                  Array.from creates an array of length numPages, then maps each
                  index to a <Page> component. Works with any page count. */}
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={containerWidth || undefined}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className={index > 0 ? "border-navy-300 border-t" : ""}
                  />
                ))}
            </Document>
          </div>
        </motion.div>

        <div className="h-16"></div>
      </div>
    </section>
  );
};

export default ResumePage;
