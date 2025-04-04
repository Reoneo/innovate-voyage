import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const usePdfExport = () => {
  const profileRef = useRef(null);

  const exportAsPDF = useReactToPrint({
    content: () => profileRef.current,
    documentTitle: 'Profile',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  return { profileRef, exportAsPDF };
};
