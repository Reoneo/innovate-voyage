
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
      
      // Before capturing, drastically reduce padding and margins
      const allElements = resumeElement.querySelectorAll('*');
      const originalStyles: Array<{element: HTMLElement, padding: string, margin: string, fontSize: string}> = [];
      
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        if (element.style) {
          originalStyles.push({
            element,
            padding: element.style.padding,
            margin: element.style.margin,
            fontSize: element.style.fontSize
          });
          
          // Reduce padding and margins
          if (window.getComputedStyle(element).padding !== '0px') {
            element.style.padding = '4px';
          }
          if (window.getComputedStyle(element).margin !== '0px') {
            element.style.margin = '2px';
          }
          
          // Reduce font sizes
          const computedStyle = window.getComputedStyle(element);
          const fontSize = parseInt(computedStyle.fontSize);
          if (fontSize > 16) {
            element.style.fontSize = '16px';
          } else if (fontSize > 14) {
            element.style.fontSize = '14px';
          } else if (fontSize > 12) {
            element.style.fontSize = '12px';
          }
        }
      });
      
      const canvas = await html2canvas(resumeElement, {
        scale: 1.5, // Decreased scale for better compression
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (document) => {
          // Make all links in the cloned document blue and underlined for better visibility in PDF
          const links = document.getElementsByTagName('a');
          for (let i = 0; i < links.length; i++) {
            links[i].style.color = '#0000EE';
            links[i].style.textDecoration = 'underline';
          }
          
          // Ensure social media links are visible and properly styled
          const socialLinks = document.querySelectorAll('[data-social-link]');
          socialLinks.forEach((link) => {
            (link as HTMLElement).style.color = '#0000EE';
            (link as HTMLElement).style.textDecoration = 'underline';
          });
          
          // Hide the blockchain tab content in the PDF
          const blockchainTab = document.querySelector('[data-tab="blockchain"]');
          if (blockchainTab) {
            (blockchainTab as HTMLElement).style.display = 'none';
          }
          
          // Scale and compress content for single page
          const content = document.getElementById('resume-pdf');
          if (content) {
            const contentContainer = content.querySelector('.p-8.md\\:p-12');
            if (contentContainer) {
              (contentContainer as HTMLElement).style.padding = '2px';
              
              // Scale down content 
              const gridContainer = contentContainer.querySelector('.grid');
              if (gridContainer) {
                (gridContainer as HTMLElement).style.gap = '8px';
              }
              
              // Reduce margins and paddings
              document.querySelectorAll('.mt-2, .mt-4, .mb-2, .mb-4, .my-2, .my-4, .py-2, .py-4').forEach((el) => {
                (el as HTMLElement).style.margin = '2px 0';
                (el as HTMLElement).style.padding = '2px 0';
              });
              
              // Reduce font sizes more aggressively
              document.querySelectorAll('h1, h2, h3, .text-2xl').forEach((el) => {
                (el as HTMLElement).style.fontSize = '14px';
                (el as HTMLElement).style.lineHeight = '16px';
              });
              
              document.querySelectorAll('p, .text-sm').forEach((el) => {
                (el as HTMLElement).style.fontSize = '9px';
                (el as HTMLElement).style.lineHeight = '11px';
              });
            }
          }
          
          // Add a professional layout styling for PDF
          const style = document.createElement('style');
          style.innerHTML = `
            .pdf-section {
              margin-bottom: 4px;
              page-break-inside: avoid;
            }
            .pdf-section-title {
              font-size: 11px;
              font-weight: bold;
              margin-bottom: 2px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 1px;
            }
            .pdf-content {
              font-size: 9px;
              line-height: 1.1;
            }
            body {
              font-family: 'Arial', sans-serif;
            }
            a {
              color: #0000EE !important;
              text-decoration: underline !important;
            }
          `;
          document.head.appendChild(style);
        }
      });
      
      // Restore original styles
      originalStyles.forEach(({element, padding, margin, fontSize}) => {
        element.style.padding = padding;
        element.style.margin = margin;
        element.style.fontSize = fontSize;
      });
      
      // Restore elements display after canvas capture
      if (tabsContainer) {
        (tabsContainer as HTMLElement).style.display = tabContainerDisplay;
      }
      
      if (tabsList) {
        (tabsList as HTMLElement).style.display = tabsListDisplay;
      }
      
      document.body.classList.remove('generating-pdf');
      
      // A4 dimensions in mm (Width: 210mm, Height: 297mm)
      const imgWidth = 210;
      
      // Force single page by calculating the scaling factor needed
      const aspectRatio = canvas.height / canvas.width;
      const imgHeight = imgWidth * aspectRatio;
      const maxHeight = 297; // A4 height
      
      // If image would be taller than A4, scale it down to fit
      const scaleFactor = imgHeight > maxHeight ? maxHeight / imgHeight : 1;
      const finalWidth = imgWidth * scaleFactor;
      const finalHeight = imgHeight * scaleFactor;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get image data from canvas
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with compression for smaller file
      
      // Add image to PDF, forcing it to fit on a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, finalWidth, finalHeight);
      
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
