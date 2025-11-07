/**
 * Professional Academic Transcript Template
 * Optimized for single-page A4 layout with dynamic scaling
 * Compatible with jsPDF + html2canvas
 */

function createProfessionalTranscript(studentName, courses) {
  // Calculate dynamic spacing based on course count
  // Aim to fit everything on one page for up to 8-10 courses
  const courseCount = courses.length;
  const courseTableSize = courseCount <= 6 ? '11px' : courseCount <= 8 ? '10px' : '9px';
  const rowPadding = courseCount <= 6 ? '6px' : courseCount <= 8 ? '5px' : '4px';
  const sectionGap = courseCount <= 6 ? '16px' : courseCount <= 8 ? '12px' : '10px';

  const courseRows = courses
    .map(
      (c) => `
    <tr style="border-bottom: 1px solid #e0e0e0; transition: background-color 0.2s;">
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
    <div style="
      width: 210mm;
      padding: 32px 35px;
      background-color: white;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1a1a1a;
      box-sizing: border-box;
      min-height: 297mm;
    ">
      
      <!-- HEADER SECTION -->
      <div style="
        text-align: center;
        margin-bottom: ${sectionGap};
        padding-bottom: 14px;
        border-bottom: 2px solid #000;
        letter-spacing: -0.5px;
      ">
        <h1 style="
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #000;
          line-height: 1.2;
        ">Official Academic Transcript</h1>
        <p style="
          margin: 6px 0 0 0;
          font-size: 12px;
          font-weight: 500;
          color: #555;
          letter-spacing: 0.2px;
          text-transform: uppercase;
          tracking: 1px;
        ">State University</p>
      </div>

      <!-- STUDENT INFO SECTION -->
      <div style="
        margin-bottom: ${sectionGap};
        background-color: #f9f9f9;
        padding: 14px 16px;
        border-left: 3px solid #000;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px 24px;
      ">
        <div style="grid-column: 1 / -1;">
          <span style="
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1.2px;
            color: #888;
          ">Student Information</span>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Name</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.2px;">${studentName}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">ID</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.2px;">123456789</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Issued</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.2px;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">GPA</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.2px;">3.85</p>
        </div>
      </div>

      <!-- COURSE HISTORY TABLE -->
      <div style="margin-bottom: ${sectionGap};">
        <h2 style="
          margin: 0 0 10px 0;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #000;
        ">Course History</h2>
        
        <table style="
          width: 100%;
          border-collapse: collapse;
          background-color: #fafafa;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        ">
          <thead>
            <tr style="
              background-color: #f0f0f0;
              border-bottom: 2px solid #000;
            ">
              <th style="
                padding: 8px 0;
                padding-left: 0;
                text-align: left;
                font-size: ${courseTableSize};
                font-weight: 700;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 12%;
              ">Code</th>
              <th style="
                padding: 8px 12px;
                padding-left: 12px;
                text-align: left;
                font-size: ${courseTableSize};
                font-weight: 700;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 48%;
              ">Course Title</th>
              <th style="
                padding: 8px;
                text-align: center;
                font-size: ${courseTableSize};
                font-weight: 700;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 16%;
              ">Term</th>
              <th style="
                padding: 8px;
                text-align: center;
                font-size: ${courseTableSize};
                font-weight: 700;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 12%;
              ">Grade</th>
              <th style="
                padding: 8px;
                text-align: center;
                font-size: ${courseTableSize};
                font-weight: 700;
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                width: 12%;
              ">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>

      <!-- FOOTER -->
      <div style="
        border-top: 1px solid #e0e0e0;
        padding-top: 12px;
        text-align: center;
        color: #777;
        font-size: 9px;
        line-height: 1.4;
        letter-spacing: 0.2px;
      ">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 3px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>

    </div>
  `;
}

export default createProfessionalTranscript;
