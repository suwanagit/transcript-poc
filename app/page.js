'use client';

import { useState, useRef, useEffect } from 'react';
import TEMPLATES from './templates';

export default function Home() {
  const [studentName, setStudentName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const transcriptRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load jsPDF and html2canvas from CDN
    const loadScripts = async () => {
      if (typeof window !== 'undefined' && window.jsPDF && window.html2canvas) {
        setIsReady(true);
        return;
      }

      // Load html2canvas first
      const html2canvasScript = document.createElement('script');
      html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      html2canvasScript.async = true;

      // Load jsPDF after html2canvas
      const jsPDFScript = document.createElement('script');
      jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jsPDFScript.async = true;

      html2canvasScript.onload = () => {
        document.head.appendChild(jsPDFScript);
      };

      jsPDFScript.onload = () => {
        setTimeout(() => setIsReady(true), 200);
      };

      document.head.appendChild(html2canvasScript);
    };

    loadScripts();
  }, []);

  const sampleCourses = [
    { code: 'MATH101', name: 'Calculus I', semester: 'Fall 2022', grade: 'A', credits: 4 },
    { code: 'ENG101', name: 'English Composition', semester: 'Fall 2022', grade: 'A-', credits: 3 },
    { code: 'PHYS101', name: 'Physics I', semester: 'Spring 2023', grade: 'B+', credits: 4 },
    { code: 'HIST101', name: 'World History', semester: 'Spring 2023', grade: 'A', credits: 3 },
  ];

  const generatePDF = async () => {
    if (!studentName.trim()) {
      alert('Please enter a student name');
      return;
    }

    if (!isReady || !window.jsPDF || !window.html2canvas) {
      alert('PDF library is still loading. Please try again in a moment.');
      return;
    }

    setIsLoading(true);
    try {
      const element = transcriptRef.current;
      
      // Make element visible temporarily for rendering
      element.style.visibility = 'visible';
      element.style.position = 'relative';
      element.style.left = '0';
      
      // Get canvas from html2canvas
      const canvas = await window.html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      // Hide element again
      element.style.visibility = 'hidden';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Determine orientation
      const isLandscape = selectedTemplate.includes('landscape');
      const orientation = isLandscape ? 'landscape' : 'portrait';
      
      // Create PDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });
      
      const pageWidth = orientation === 'landscape' ? 297 : 210;
      const pageHeight = orientation === 'landscape' ? 210 : 297;
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      pdf.save(`${studentName}-transcript.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get the selected template component
  const TemplateComponent = TEMPLATES[selectedTemplate].component;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Academic Transcript Generator</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Template:
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            marginBottom: '20px',
          }}
        >
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name} - {template.description}
            </option>
          ))}
        </select>

        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Student Name:
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter student name"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={generatePDF}
        disabled={isLoading || !isReady}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: isReady ? '#0066cc' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading || !isReady ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          marginBottom: '40px',
        }}
      >
        {!isReady ? 'Loading PDF library...' : isLoading ? 'Generating PDF...' : 'Download Transcript PDF'}
      </button>

      {/* Transcript template for PDF generation */}
      <div 
        ref={transcriptRef} 
        style={{ 
          visibility: 'hidden', 
          position: 'absolute',
          left: '-9999px',
          width: '210mm',
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
        }}
      >
        <TemplateComponent studentName={studentName} sampleCourses={sampleCourses} />
      </div>

      {/* Live preview of transcript */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
        <h3>Preview:</h3>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '20px',
            backgroundColor: 'white',
            fontFamily: 'serif',
            fontSize: '11px',
            lineHeight: '1.6',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            overflowY: 'auto',
            maxHeight: '600px',
            transform: 'scale(0.7)',
            transformOrigin: 'top left',
            width: 'calc(100% / 0.7)',
          }}
        >
          <TemplateComponent studentName={studentName || '[Enter name above]'} sampleCourses={sampleCourses} />
        </div>
      </div>
    </div>
  );
}