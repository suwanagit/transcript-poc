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
    // Load html2pdf from CDN
    const loadScript = () => {
      if (typeof window !== 'undefined' && window.html2pdf) {
        setIsReady(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      script.onload = () => {
        // Wait a bit then set ready
        setTimeout(() => setIsReady(true), 500);
      };
      script.onerror = () => {
        console.error('Failed to load html2pdf library');
        alert('Failed to load PDF library. Please refresh the page.');
      };
      document.head.appendChild(script);
    };

    loadScript();
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

    if (!isReady || !window.html2pdf) {
      alert('PDF library is still loading. Please wait a moment and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Get the element to render
      const element = transcriptRef.current.cloneNode(true);
      
      // Determine orientation
      const isLandscape = selectedTemplate.includes('landscape');
      
      const opt = {
        margin: 10,
        filename: `${studentName}-transcript.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          logging: false, 
          useCORS: true,
          backgroundColor: '#ffffff',
          allowTaint: true,
        },
        jsPDF: { 
          orientation: isLandscape ? 'landscape' : 'portrait', 
          unit: 'mm', 
          format: 'a4' 
        },
      };
      
      // Generate PDF using html2pdf
      await window.html2pdf().set(opt).from(element).save();
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