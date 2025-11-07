'use client';

import { useState } from 'react';
import TEMPLATES from './templates';

export default function Home() {
  const [studentName, setStudentName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  const sampleCourses = [
    { code: 'MATH101', name: 'Calculus I', semester: 'Fall 2022', grade: 'A', credits: 4 },
    { code: 'ENG101', name: 'English Composition', semester: 'Fall 2022', grade: 'A-', credits: 3 },
    { code: 'PHYS101', name: 'Physics I', semester: 'Spring 2023', grade: 'B+', credits: 4 },
    { code: 'HIST101', name: 'World History', semester: 'Spring 2023', grade: 'A', credits: 3 },
  ];

  // Get the template HTML string
  const getTemplateHTML = (templateKey, name, courses) => {
    switch (templateKey) {
      case 'default':
        return createProfessionalPortraitTemplate(name, courses);
      case 'portraitByYear':
        return createProfessionalPortraitByYearTemplate(name, courses);
      case 'portraitBySubject':
        return createPortraitBySubjectTemplate(name, courses);
      case 'landscapeByYear':
        return createProfessionalLandscapeByYearTemplate(name, courses);
      case 'landscapeBySubject':
        return createLandscapeBySubjectTemplate(name, courses);
      default:
        return createProfessionalPortraitTemplate(name, courses);
    }
  };

  const generatePDF = async () => {
    if (!studentName.trim()) {
      alert('Please enter a student name');
      return;
    }

    setIsLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas').then((mod) => mod.default);

      // Create a temporary container to render the template
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '210mm';
      container.style.backgroundColor = 'white';

      // Get the HTML template
      const templateHTML = getTemplateHTML(selectedTemplate, studentName, sampleCourses);
      container.innerHTML = templateHTML;
      document.body.appendChild(container);

      // Give it a moment to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Capture the HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Determine orientation
      const isLandscape = selectedTemplate.includes('landscape');
      const orientation = isLandscape ? 'landscape' : 'portrait';
      const pageWidth = isLandscape ? 297 : 210;
      const pageHeight = isLandscape ? 210 : 297;

      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      doc.save(`${studentName}-transcript.pdf`);
      document.body.removeChild(container);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get template HTML for preview
  const previewHTML = getTemplateHTML(
    selectedTemplate,
    studentName || '[Enter name above]',
    sampleCourses
  );

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
        disabled={isLoading}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.6 : 1,
          marginBottom: '40px',
        }}
      >
        {isLoading ? 'Generating PDF...' : 'Download Transcript PDF'}
      </button>

      {/* Live preview of transcript - using dangerouslySetInnerHTML */}
      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #ddd',
        }}
      >
        <h3>Preview:</h3>
        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '20px',
            backgroundColor: 'white',
            fontSize: '10px',
            lineHeight: '1.5',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            overflowY: 'auto',
            maxHeight: '600px',
            transform: 'scale(0.65)',
            transformOrigin: 'top left',
            width: '100%',
            marginLeft: '-35%',
          }}
          dangerouslySetInnerHTML={{ __html: previewHTML }}
        />
      </div>
    </div>
  );
}

// ============================================================
// TEMPLATE FUNCTIONS - Single source of truth for all templates
// ============================================================

// PROFESSIONAL PORTRAIT (Default)
function createProfessionalPortraitTemplate(studentName, courses) {
  const courseCount = courses.length;
  const courseTableSize = courseCount <= 6 ? '11px' : courseCount <= 8 ? '10px' : '9px';
  const rowPadding = courseCount <= 6 ? '6px' : courseCount <= 8 ? '5px' : '4px';
  const sectionGap = courseCount <= 6 ? '16px' : courseCount <= 8 ? '12px' : '10px';

  const courseRows = courses
    .map(
      (c) => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: ${rowPadding}; padding-left: 0; font-weight: 500; letter-spacing: 0.3px; color: #1a1a1a;">${c.code}</td>
      <td style="padding: ${rowPadding}; padding-left: 12px; color: #2a2a2a;">${c.name}</td>
      <td style="padding: ${rowPadding}; text-align: center; color: #555;">${c.semester}</td>
      <td style="padding: ${rowPadding}; text-align: center; font-weight: 600; color: #000; letter-spacing: 0.5px;">${c.grade}</td>
      <td style="padding: ${rowPadding}; text-align: center; color: #666;">${c.credits}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="width: 210mm; padding: 32px 35px; background-color: white; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: ${sectionGap}; padding-bottom: 14px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #000; line-height: 1.2;">Official Academic Transcript</h1>
        <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 500; color: #555; letter-spacing: 0.2px; text-transform: uppercase;">State University</p>
      </div>

      <div style="margin-bottom: ${sectionGap}; background-color: #f9f9f9; padding: 14px 16px; border-left: 3px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 16px 24px;">
        <div style="grid-column: 1 / -1;">
          <span style="font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.2px; color: #888;">Student Information</span>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Name</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">${studentName}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">ID</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">123456789</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Issued</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">GPA</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">3.85</p>
        </div>
      </div>

      <div style="margin-bottom: ${sectionGap};">
        <h2 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #000;">Course History</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: #fafafa; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background-color: #f0f0f0; border-bottom: 2px solid #000;">
              <th style="padding: 8px 0; padding-left: 0; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Code</th>
              <th style="padding: 8px 12px; padding-left: 12px; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 48%;">Course Title</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 16%;">Term</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Grade</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 12%;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>

      <div style="border-top: 1px solid #e0e0e0; padding-top: 12px; text-align: center; color: #777; font-size: 9px; line-height: 1.4;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 3px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// PROFESSIONAL PORTRAIT BY YEAR
function createProfessionalPortraitByYearTemplate(studentName, courses) {
  const coursesByYear = {};
  courses.forEach((c) => {
    if (!coursesByYear[c.semester]) coursesByYear[c.semester] = [];
    coursesByYear[c.semester].push(c);
  });

  const courseCount = courses.length;
  const courseTableSize = courseCount <= 6 ? '10px' : courseCount <= 8 ? '9px' : '8px';
  const rowPadding = courseCount <= 6 ? '5px' : courseCount <= 8 ? '4px' : '3px';

  let sections = '';
  Object.entries(coursesByYear).forEach(([semester, semesterCourses]) => {
    const rows = semesterCourses
      .map(
        (c) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: ${rowPadding}; padding-left: 0; font-weight: 500; color: #1a1a1a;">${c.code}</td>
        <td style="padding: ${rowPadding}; padding-left: 12px; color: #2a2a2a;">${c.name}</td>
        <td style="padding: ${rowPadding}; text-align: center; font-weight: 600; color: #000;">${c.grade}</td>
        <td style="padding: ${rowPadding}; text-align: center; color: #666;">${c.credits}</td>
      </tr>
    `
      )
      .join('');

    sections += `
      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 11px; margin: 0 0 8px 0; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px;">${semester}</h4>
        <table style="width: 100%; border-collapse: collapse; background-color: #fafafa;">
          <thead>
            <tr style="background-color: #f0f0f0; border-bottom: 2px solid #000;">
              <th style="padding: 6px 0; padding-left: 0; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; width: 15%;">Code</th>
              <th style="padding: 6px 12px; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; width: 55%;">Course Title</th>
              <th style="padding: 6px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; width: 15%;">Grade</th>
              <th style="padding: 6px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px; width: 15%;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  });

  return `
    <div style="width: 210mm; padding: 32px 35px; background-color: white; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #000;">Official Academic Transcript</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 500; color: #555; text-transform: uppercase;">State University</p>
      </div>

      <div style="margin-bottom: 16px; background-color: #f9f9f9; padding: 12px 14px; border-left: 3px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px;">
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">Name</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">${studentName}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">ID</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">123456789</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">Issued</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">GPA</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">3.85</p>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <h2 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #000;">Course History by Term</h2>
        ${sections}
      </div>

      <div style="border-top: 1px solid #e0e0e0; padding-top: 10px; text-align: center; color: #777; font-size: 9px; line-height: 1.4;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 2px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// PROFESSIONAL LANDSCAPE BY YEAR
function createProfessionalLandscapeByYearTemplate(studentName, courses) {
  const coursesByYear = {};
  courses.forEach((c) => {
    if (!coursesByYear[c.semester]) coursesByYear[c.semester] = [];
    coursesByYear[c.semester].push(c);
  });

  const courseCount = courses.length;
  const courseTableSize = courseCount <= 8 ? '10px' : courseCount <= 12 ? '9px' : '8px';
  const rowPadding = courseCount <= 8 ? '5px' : courseCount <= 12 ? '4px' : '3px';

  let sections = '';
  Object.entries(coursesByYear).forEach(([semester, semesterCourses]) => {
    const rows = semesterCourses
      .map(
        (c) => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: ${rowPadding}; padding-left: 0; font-weight: 500; color: #1a1a1a;">${c.code}</td>
        <td style="padding: ${rowPadding}; padding-left: 12px; color: #2a2a2a;">${c.name}</td>
        <td style="padding: ${rowPadding}; text-align: center; font-weight: 600; color: #000;">${c.grade}</td>
        <td style="padding: ${rowPadding}; text-align: center; color: #666;">${c.credits}</td>
      </tr>
    `
      )
      .join('');

    sections += `
      <div style="margin-bottom: 14px;">
        <h4 style="font-size: 10px; margin: 0 0 6px 0; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.4px;">${semester}</h4>
        <table style="width: 100%; border-collapse: collapse; background-color: #fafafa; font-size: ${courseTableSize};">
          <thead>
            <tr style="background-color: #f0f0f0; border-bottom: 2px solid #000;">
              <th style="padding: 5px 0; padding-left: 0; text-align: left; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.3px; width: 12%;">Code</th>
              <th style="padding: 5px 8px; text-align: left; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.3px; width: 58%;">Course Title</th>
              <th style="padding: 5px; text-align: center; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.3px; width: 15%;">Grade</th>
              <th style="padding: 5px; text-align: center; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.3px; width: 15%;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  });

  return `
    <div style="width: 297mm; padding: 24px 35px; background-color: white; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; font-size: 10px; line-height: 1.5; color: #1a1a1a; box-sizing: border-box; display: flex; flex-direction: column; min-height: 210mm;">
      <div style="text-align: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #000;">Official Academic Transcript</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 500; color: #555; text-transform: uppercase;">State University</p>
      </div>

      <div style="margin-bottom: 14px; background-color: #f9f9f9; padding: 10px 12px; border-left: 3px solid #000; display: flex; gap: 30px; align-items: center; flex-wrap: wrap;">
        <div>
          <p style="margin: 1px 0; font-size: 9px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">Name</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">${studentName}</p>
        </div>
        <div>
          <p style="margin: 1px 0; font-size: 9px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">ID</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">123456789</p>
        </div>
        <div>
          <p style="margin: 1px 0; font-size: 9px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">Issued</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p style="margin: 1px 0; font-size: 9px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.3px;">GPA</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 500; color: #1a1a1a;">3.85</p>
        </div>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 14px;">
        <h2 style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #000;">Course History by Term</h2>
        <div style="overflow-y: auto;">
          ${sections}
        </div>
      </div>

      <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; text-align: center; color: #777; font-size: 8px; line-height: 1.3;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 2px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// PORTRAIT BY SUBJECT (existing, not yet professionally upgraded)
function createPortraitBySubjectTemplate(studentName, courses) {
  const coursesBySubject = {};
  courses.forEach((c) => {
    const subject = c.code.replace(/\d+/g, '').toUpperCase() || 'Other';
    if (!coursesBySubject[subject]) coursesBySubject[subject] = [];
    coursesBySubject[subject].push(c);
  });

  let sections = '';
  Object.entries(coursesBySubject).forEach(([subject, subjectCourses]) => {
    const rows = subjectCourses
      .map(
        (c) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${c.code}</td>
        <td style="padding: 8px;">${c.name}</td>
        <td style="text-align: center; padding: 8px;">${c.semester}</td>
        <td style="text-align: center; padding: 8px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 8px;">${c.credits}</td>
      </tr>
    `
      )
      .join('');

    sections += `
      <div style="margin-bottom: 25px;">
        <h4 style="font-size: 12px; margin-bottom: 10px; font-weight: bold; color: #333;">${subject}</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 8px; font-weight: bold;">Code</th>
              <th style="text-align: left; padding: 8px; font-weight: bold;">Course Name</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Semester</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Grade</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  });

  return `
    <div style="width: 210mm; padding: 40px; background-color: white; font-family: serif; font-size: 12px; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="margin: 0 0 5px 0; font-size: 18px;">Official Academic Transcript</h2>
        <p style="margin: 0; color: #666;">State University</p>
      </div>
      <div style="margin-bottom: 30px; border-bottom: 1px solid #000; padding-bottom: 15px;">
        <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentName}</p>
        <p style="margin: 5px 0;"><strong>Student ID:</strong> 123456789</p>
        <p style="margin: 5px 0;"><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 14px; margin-bottom: 15px;">Course History by Subject</h3>
        ${sections}
      </div>
      <div style="border-top: 2px solid #000; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  `;
}

// LANDSCAPE BY SUBJECT (existing, not yet professionally upgraded)
function createLandscapeBySubjectTemplate(studentName, courses) {
  const coursesBySubject = {};
  courses.forEach((c) => {
    const subject = c.code.replace(/\d+/g, '').toUpperCase() || 'Other';
    if (!coursesBySubject[subject]) coursesBySubject[subject] = [];
    coursesBySubject[subject].push(c);
  });

  let sections = '';
  Object.entries(coursesBySubject).forEach(([subject, subjectCourses]) => {
    const rows = subjectCourses
      .map(
        (c) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 6px;">${c.code}</td>
        <td style="padding: 6px;">${c.name}</td>
        <td style="text-align: center; padding: 6px;">${c.semester}</td>
        <td style="text-align: center; padding: 6px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 6px;">${c.credits}</td>
      </tr>
    `
      )
      .join('');

    sections += `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 11px; margin-bottom: 8px; font-weight: bold; color: #333;">${subject}</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 6px; font-weight: bold;">Code</th>
              <th style="text-align: left; padding: 6px; font-weight: bold;">Course Name</th>
              <th style="text-align: center; padding: 6px; font-weight: bold;">Semester</th>
              <th style="text-align: center; padding: 6px; font-weight: bold;">Grade</th>
              <th style="text-align: center; padding: 6px; font-weight: bold;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  });

  return `
    <div style="width: 297mm; padding: 30px; background-color: white; font-family: serif; font-size: 11px; line-height: 1.5;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0 0 3px 0; font-size: 16px;">Official Academic Transcript</h2>
        <p style="margin: 0; color: #666;">State University</p>
      </div>
      <div style="margin-bottom: 25px; border-bottom: 1px solid #000; padding-bottom: 12px; display: flex; gap: 40px;">
        <div><p style="margin: 3px 0;"><strong>Student Name:</strong> ${studentName}</p>
        <p style="margin: 3px 0;"><strong>Student ID:</strong> 123456789</p></div>
        <div><p style="margin: 3px 0;"><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p></div>
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="font-size: 12px; margin-bottom: 12px;">Course History by Subject</h3>
        ${sections}
      </div>
      <div style="border-top: 2px solid #000; padding-top: 12px; text-align: center; color: #666; font-size: 9px;">
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  `;
}