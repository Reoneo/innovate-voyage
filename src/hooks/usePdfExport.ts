
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/components/ui/use-toast';

export function usePdfExport() {
  const profileRef = useRef<HTMLDivElement>(null);

  const exportAsPDF = async () => {
    const resumeElement = document.getElementById('resume-pdf');
    if (!resumeElement) return;
    
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we generate your PDF...'
      });
      
      document.body.classList.add('generating-pdf');
      
      // Hide tab content during PDF generation
      const tabsContainer = resumeElement.querySelector('[role="tabpanel"]');
      let tabContainerDisplay = '';
      
      if (tabsContainer) {
        tabContainerDisplay = window.getComputedStyle(tabsContainer).display;
        (tabsContainer as HTMLElement).style.display = 'none';
      }
      
      // Hide the tabs list itself
      const tabsList = document.querySelector('[role="tablist"]');
      let tabsListDisplay = '';
      if (tabsList) {
        tabsListDisplay = window.getComputedStyle(tabsList).display;
        (tabsList as HTMLElement).style.display = 'none';
      }
      
      // Show the bio section if it exists but is currently hidden
      const bioSection = resumeElement.querySelector('[id^="bio-section"]');
      if (bioSection) {
        (bioSection as HTMLElement).style.display = 'block';
      }
      
      // Show work experience if it exists but is currently hidden
      const workExperience = resumeElement.querySelector('[id^="work-experience-section"]');
      if (workExperience) {
        (workExperience as HTMLElement).style.display = 'block';
      }
      
      // Show skills section if it exists but is currently hidden
      const skillsSection = resumeElement.querySelector('[id^="skills-section"]');
      if (skillsSection) {
        (skillsSection as HTMLElement).style.display = 'block';
      }
      
      // Create canvas at higher resolution (4x scale for high definition)
      const canvas = await html2canvas(resumeElement, {
        scale: 4, // Increased for higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (document) => {
          // Make all links in the cloned document blue and underlined
          const links = document.getElementsByTagName('a');
          for (let i = 0; i < links.length; i++) {
            links[i].style.color = '#0000EE';
            links[i].style.textDecoration = 'underline';
          }
          
          // Hide the blockchain tab content in the PDF
          const blockchainTab = document.querySelector('[data-tab="blockchain"]');
          if (blockchainTab) {
            (blockchainTab as HTMLElement).style.display = 'none';
          }
          
          // Add a professional layout styling for PDF
          const style = document.createElement('style');
          style.innerHTML = `
            .pdf-section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .pdf-section-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .pdf-content {
              font-size: 14px;
              line-height: 1.5;
            }
            .social-icon-pdf {
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-right: 5px;
            }
          `;
          document.head.appendChild(style);
          
          // Apply two-column layout based on the image
          const container = document.getElementById('resume-pdf');
          if (container) {
            container.style.display = 'grid';
            container.style.gridTemplateColumns = '8.6cm 8.6cm'; // Width from image (8.6cm per column)
            container.style.gridGap = '1.25cm'; // Spacing from image (1.25cm)
            container.style.width = '18.45cm'; // Total width (8.6 + 8.6 + 1.25)
          }
        }
      });
      
      // Restore elements display after canvas capture
      if (tabsContainer) {
        (tabsContainer as HTMLElement).style.display = tabContainerDisplay;
      }
      
      if (tabsList) {
        (tabsList as HTMLElement).style.display = tabsListDisplay;
      }
      
      document.body.classList.remove('generating-pdf');
      
      // A4 dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate aspect ratio to maintain proportions
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get image data from canvas
      const imgData = canvas.toDataURL('image/png', 1.0); // Higher quality
      
      // Split the image into pages if it's too long
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      while (heightLeft >= 0) {
        if (pageNumber > 1) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        position -= pageHeight;
        pageNumber++;
      }

      // Add hyperlinks to the PDF
      const links = resumeElement.getElementsByTagName('a');
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const rect = link.getBoundingClientRect();
        const scaleFactor = imgWidth / canvas.width;
        
        pdf.link(
          rect.left * scaleFactor,
          rect.top * scaleFactor,
          rect.width * scaleFactor,
          rect.height * scaleFactor,
          { url: link.href }
        );
      }
      
      // Get custom name if available
      const ownerAddress = resumeElement.querySelector('[data-owner-address]')?.getAttribute('data-owner-address');
      let customName = '';
      
      if (ownerAddress) {
        customName = localStorage.getItem(`user_name_${ownerAddress}`) || '';
      }
      
      // Generate filename with custom name if available
      const fileName = customName ? 
        `${customName.replace(/\s+/g, '-')}-blockchain-profile.pdf` : 
        'blockchain-profile.pdf';
      
      pdf.save(fileName);
      
      toast({
        title: 'PDF Generated',
        description: 'Your profile has been successfully downloaded!'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'There was an error generating your PDF',
        variant: 'destructive'
      });
      document.body.classList.remove('generating-pdf');
    }
  };

  return { profileRef, exportAsPDF };
}
