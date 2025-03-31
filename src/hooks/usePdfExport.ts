
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
      
      // Create a clone of the resume element to modify for PDF export
      const resumeClone = resumeElement.cloneNode(true) as HTMLElement;
      
      // Show the bio section if it exists but is currently hidden
      const bioSection = resumeClone.querySelector('[id^="bio-section"]');
      if (bioSection) {
        (bioSection as HTMLElement).style.display = 'block';
      }
      
      // Show work experience if it exists but is currently hidden
      const workExperience = resumeClone.querySelector('[id^="work-experience-section"]');
      if (workExperience) {
        (workExperience as HTMLElement).style.display = 'block';
      }
      
      // Show skills section if it exists but is currently hidden
      const skillsSection = resumeClone.querySelector('[id^="skills-section"]');
      if (skillsSection) {
        (skillsSection as HTMLElement).style.display = 'block';
      }
      
      // Make all links more visible for PDF
      const links = resumeClone.querySelectorAll('a');
      links.forEach(link => {
        link.style.color = '#0000EE';
        link.style.textDecoration = 'underline';
      });
      
      // Make all social links more visible for PDF
      const socialLinks = resumeClone.querySelectorAll('[data-social-link]');
      socialLinks.forEach(link => {
        (link as HTMLElement).style.color = '#0000EE';
        (link as HTMLElement).style.textDecoration = 'underline';
      });
      
      // Create a new wrapper element and append the clone to it
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '-9999px';
      wrapper.style.left = '-9999px';
      wrapper.style.width = '21cm'; // A4 width
      wrapper.style.backgroundColor = '#ffffff';
      wrapper.style.padding = '10mm';
      wrapper.appendChild(resumeClone);
      
      // Add professional PDF styling
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `
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
        body {
          font-family: 'Arial', sans-serif;
        }
        a {
          color: #0000EE !important;
          text-decoration: underline !important;
        }
        [data-social-link] {
          display: inline-block !important;
          margin: 5px !important;
        }
      `;
      wrapper.appendChild(styleElement);
      
      // Add the wrapper to the body for rendering
      document.body.appendChild(wrapper);
      
      // Force all elements to be visible
      const allElements = wrapper.querySelectorAll('*');
      allElements.forEach(element => {
        const el = element as HTMLElement;
        if (el.style.display === 'none') {
          el.style.display = 'block';
        }
        if (el.style.visibility === 'hidden') {
          el.style.visibility = 'visible';
        }
      });

      // Use html2canvas to create a canvas from the wrapper
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        windowWidth: 794, // A4 width in pixels at 96 DPI
      });
      
      // Remove the wrapper after rendering
      document.body.removeChild(wrapper);
      document.body.classList.remove('generating-pdf');
      
      // A4 dimensions in mm
      const imgWidth = 210;
      const pageHeight = 297;
      
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Get image data from canvas
      const imgData = canvas.toDataURL('image/png');
      
      // Split the image into pages if it's too long
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      while (heightLeft > pageHeight) {
        position -= pageHeight;
        heightLeft -= pageHeight;
        
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        
        pageNumber++;
      }

      // Extract all links from the original element for proper coordinates
      const originalLinks = resumeElement.querySelectorAll('a');
      const linkMap = new Map();
      
      // Create a map of link href to elements
      originalLinks.forEach(link => {
        if (link.href) {
          const rect = link.getBoundingClientRect();
          if (!linkMap.has(link.href)) {
            linkMap.set(link.href, []);
          }
          linkMap.get(link.href).push({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          });
        }
      });
      
      // Add hyperlinks to the PDF
      linkMap.forEach((rects, url) => {
        rects.forEach(rect => {
          const scaleFactor = imgWidth / canvas.width;
          pdf.link(
            rect.left * scaleFactor,
            rect.top * scaleFactor,
            rect.width * scaleFactor,
            rect.height * scaleFactor,
            { url }
          );
        });
      });
      
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
