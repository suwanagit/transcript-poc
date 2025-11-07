'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [studentName, setStudentName] = useState('');
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
      const transcriptHTML = `
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
                ${sampleCourses.map(course => `
                  <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 8px;">${course.code}</td>
                    <td style="padding: 8px;">${course.name}</td>
                    <td style="text-align: center; padding: 8px;">${course.semester}</td>
                    <td style="text-align: center; padding: 8px; font-weight: bold;">${course.grade}</td>
                    <td style="text-align: center; padding: 8px;">${course.credits}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="border-top: 2px solid #000; padding-top: 15px; text-align: center; color: #666; font-size: 10px;">
            <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
          </div>
        </div>
      `;

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: transcriptHTML,
          filename: `${studentName}-transcript.pdf`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName}-transcript.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Academic Transcript Generator</h1>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
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
            padding: '40px',
            backgroundColor: 'white',
            fontFamily: 'serif',
            fontSize: '11px',
            lineHeight: '1.6',
            border: '1px solid #ddd',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>Official Academic Transcript</h2>
            <p style={{ margin: '0', color: '#666', fontSize: '11px' }}>State University</p>
          </div>

          <div style={{ marginBottom: '25px', borderBottom: '1px solid #000', paddingBottom: '12px' }}>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>
              <strong>Student Name:</strong> {studentName || '[Enter name above]'}
            </p>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>
              <strong>Student ID:</strong> 123456789
            </p>
            <p style={{ margin: '4px 0', fontSize: '11px' }}>
              <strong>Issue Date:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '12px', marginBottom: '12px' }}>Course History</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '6px', fontWeight: 'bold' }}>Course Code</th>
                  <th style={{ textAlign: 'left', padding: '6px', fontWeight: 'bold' }}>Course Name</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Semester</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Grade</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Credits</th>
                </tr>
              </thead>
              <tbody>
                {sampleCourses.map((course, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '6px' }}>{course.code}</td>
                    <td style={{ padding: '6px' }}>{course.name}</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>{course.semester}</td>
                    <td style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>{course.grade}</td>
                    <td style={{ textAlign: 'center', padding: '6px' }}>{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ borderTop: '2px solid #000', paddingTop: '12px', textAlign: 'center', color: '#666', fontSize: '9px' }}>
            <p style={{ margin: '0' }}>This is an official academic record. Unauthorized reproduction is prohibited.</p>
          </div>
        </div>
      </div>
    </div>
  );
}