
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
      
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
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
              (contentContainer as HTMLElement).style.padding = '8px';
              
              // Scale down content 
              const gridContainer = contentContainer.querySelector('.grid');
              if (gridContainer) {
                (gridContainer as HTMLElement).style.gap = '12px';
              }
              
              // Reduce margins and paddings
              document.querySelectorAll('.mt-2, .mt-4, .mb-2, .mb-4, .my-2, .my-4, .py-2, .py-4').forEach((el) => {
                (el as HTMLElement).style.margin = '4px 0';
                (el as HTMLElement).style.padding = '4px 0';
              });
              
              // Reduce font sizes
              document.querySelectorAll('h1, h2, h3, .text-2xl').forEach((el) => {
                (el as HTMLElement).style.fontSize = '18px';
                (el as HTMLElement).style.lineHeight = '22px';
              });
              
              document.querySelectorAll('p, .text-sm').forEach((el) => {
                (el as HTMLElement).style.fontSize = '12px';
                (el as HTMLElement).style.lineHeight = '16px';
              });
            }
          }
          
          // Add a professional layout styling for PDF
          const style = document.createElement('style');
          style.innerHTML = `
            .pdf-section {
              margin-bottom: 10px;
              page-break-inside: avoid;
            }
            .pdf-section-title {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 5px;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 2px;
            }
            .pdf-content {
              font-size: 12px;
              line-height: 1.3;
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
      
      // Restore elements display after canvas capture
      if (tabsContainer) {
        (tabsContainer as HTMLElement).style.display = tabContainerDisplay;
      }
      
      if (tabsList) {
        (tabsList as HTMLElement).style.display = tabsListDisplay;
      }
      
      document.body.classList.remove('generating-pdf');
      
      // A4 dimensions in mm
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get image data from canvas
      const imgData = canvas.toDataURL('image/png');
      
      // Add image to PDF - force single page by using compression
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297));
      
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
