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

  const generatePDF = async () => {
    if (!studentName.trim()) {
      alert('Please enter a student name');
      return;
    }

    setIsLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas').then(mod => mod.default);
      
      // Create a temporary container to render the template
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '210mm';
      container.style.backgroundColor = 'white';
      
      // Get the template component
      const TemplateComponent = TEMPLATES[selectedTemplate].component;
      
      // We need to render React component to DOM - this is tricky
      // For now, let's use a fallback to hardcoded template logic
      const isLandscape = selectedTemplate.includes('landscape');
      
      // Create HTML content based on template
      let templateHTML = '';
      
      if (selectedTemplate === 'default') {
        templateHTML = createDefaultTemplate(studentName, sampleCourses);
      } else if (selectedTemplate === 'portraitByYear') {
        templateHTML = createPortraitByYearTemplate(studentName, sampleCourses);
      } else if (selectedTemplate === 'portraitBySubject') {
        templateHTML = createPortraitBySubjectTemplate(studentName, sampleCourses);
      } else if (selectedTemplate === 'landscapeByYear') {
        templateHTML = createLandscapeByYearTemplate(studentName, sampleCourses);
      } else if (selectedTemplate === 'landscapeBySubject') {
        templateHTML = createLandscapeBySubjectTemplate(studentName, sampleCourses);
      }
      
      container.innerHTML = templateHTML;
      document.body.appendChild(container);
      
      // Give it a moment to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Determine orientation
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
            fontSize: '10px',
            lineHeight: '1.5',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
            overflowY: 'auto',
            maxHeight: '600px',
          }}
        >
          <TemplateComponent studentName={studentName || '[Enter name above]'} sampleCourses={sampleCourses} />
        </div>
      </div>
    </div>
  );
}

// Template HTML generators
function createDefaultTemplate(studentName, courses) {
  const courseRows = courses.map(c => `
    <tr style="border-bottom: 1px solid #ddd;">
      <td style="padding: 8px;">${c.code}</td>
      <td style="padding: 8px;">${c.name}</td>
      <td style="text-align: center; padding: 8px;">${c.semester}</td>
      <td style="text-align: center; padding: 8px; font-weight: bold;">${c.grade}</td>
      <td style="text-align: center; padding: 8px;">${c.credits}</td>
    </tr>
  `).join('');

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
        <h3 style="font-size: 14px; margin-bottom: 15px;">Course History</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 8px; font-weight: bold;">Course Code</th>
              <th style="text-align: left; padding: 8px; font-weight: bold;">Course Name</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Semester</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Grade</th>
              <th style="text-align: center; padding: 8px; font-weight: bold;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>
      <div style="border-top: 2px solid #000; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  `;
}

function createPortraitByYearTemplate(studentName, courses) {
  const coursesByYear = {};
  courses.forEach(c => {
    if (!coursesByYear[c.semester]) coursesByYear[c.semester] = [];
    coursesByYear[c.semester].push(c);
  });

  let sections = '';
  Object.entries(coursesByYear).forEach(([semester, semesterCourses]) => {
    const rows = semesterCourses.map(c => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${c.code}</td>
        <td style="padding: 8px;">${c.name}</td>
        <td style="text-align: center; padding: 8px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 8px;">${c.credits}</td>
      </tr>
    `).join('');

    sections += `
      <div style="margin-bottom: 25px;">
        <h4 style="font-size: 12px; margin-bottom: 10px; font-weight: bold; color: #333;">${semester}</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 8px; font-weight: bold;">Code</th>
              <th style="text-align: left; padding: 8px; font-weight: bold;">Course Name</th>
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
        <h3 style="font-size: 14px; margin-bottom: 15px;">Course History by Year</h3>
        ${sections}
      </div>
      <div style="border-top: 2px solid #000; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  `;
}

function createPortraitBySubjectTemplate(studentName, courses) {
  const coursesBySubject = {};
  courses.forEach(c => {
    const subject = c.code.replace(/\d+/g, '').toUpperCase() || 'Other';
    if (!coursesBySubject[subject]) coursesBySubject[subject] = [];
    coursesBySubject[subject].push(c);
  });

  let sections = '';
  Object.entries(coursesBySubject).forEach(([subject, subjectCourses]) => {
    const rows = subjectCourses.map(c => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 8px;">${c.code}</td>
        <td style="padding: 8px;">${c.name}</td>
        <td style="text-align: center; padding: 8px;">${c.semester}</td>
        <td style="text-align: center; padding: 8px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 8px;">${c.credits}</td>
      </tr>
    `).join('');

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

function createLandscapeByYearTemplate(studentName, courses) {
  const coursesByYear = {};
  courses.forEach(c => {
    if (!coursesByYear[c.semester]) coursesByYear[c.semester] = [];
    coursesByYear[c.semester].push(c);
  });

  let sections = '';
  Object.entries(coursesByYear).forEach(([semester, semesterCourses]) => {
    const rows = semesterCourses.map(c => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 6px;">${c.code}</td>
        <td style="padding: 6px;">${c.name}</td>
        <td style="text-align: center; padding: 6px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 6px;">${c.credits}</td>
      </tr>
    `).join('');

    sections += `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 11px; margin-bottom: 8px; font-weight: bold; color: #333;">${semester}</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10px;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 6px; font-weight: bold;">Code</th>
              <th style="text-align: left; padding: 6px; font-weight: bold;">Course Name</th>
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
        <h3 style="font-size: 12px; margin-bottom: 12px;">Course History by Year</h3>
        ${sections}
      </div>
      <div style="border-top: 2px solid #000; padding-top: 12px; text-align: center; color: #666; font-size: 9px;">
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  `;
}

function createLandscapeBySubjectTemplate(studentName, courses) {
  const coursesBySubject = {};
  courses.forEach(c => {
    const subject = c.code.replace(/\d+/g, '').toUpperCase() || 'Other';
    if (!coursesBySubject[subject]) coursesBySubject[subject] = [];
    coursesBySubject[subject].push(c);
  });

  let sections = '';
  Object.entries(coursesBySubject).forEach(([subject, subjectCourses]) => {
    const rows = subjectCourses.map(c => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 6px;">${c.code}</td>
        <td style="padding: 6px;">${c.name}</td>
        <td style="text-align: center; padding: 6px;">${c.semester}</td>
        <td style="text-align: center; padding: 6px; font-weight: bold;">${c.grade}</td>
        <td style="text-align: center; padding: 6px;">${c.credits}</td>
      </tr>
    `).join('');

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