
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePdfExport = () => {
  const profileRef = useRef<HTMLDivElement | null>(null);

  const exportAsPDF = useReactToPrint({
    documentTitle: 'Profile',
    onPrintError: (error) => console.error('Failed to print', error),
    // Use contentRef option instead of content
    contentRef: profileRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        html, body {
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .profile-content {
          break-inside: avoid;
          page-break-inside: avoid;
          max-height: 297mm; /* A4 height */
          overflow: hidden;
        }
      }
    `,
    // Using onBeforePrint instead of onBeforeGetContent
    onBeforePrint: () => {
      // Add a temporary class to ensure content fits on one page
      if (profileRef.current) {
        profileRef.current.classList.add('profile-content');
      }
    },
    onAfterPrint: () => {
      // Clean up temporary class
      if (profileRef.current) {
        profileRef.current.classList.remove('profile-content');
      }
    }
  });

  return { profileRef, exportAsPDF };
};
