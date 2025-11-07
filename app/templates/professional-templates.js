/**
 * Professional Academic Transcript Templates
 * Ready to replace the template functions in page.js
 * Follows the same pattern as createDefaultTemplate()
 */

// ============================================================
// PORTRAIT: Professional Default (Single Column Layout)
// ============================================================
function createProfessionalPortraitTemplate(studentName, courses) {
  // Calculate dynamic spacing based on course count
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
      <!-- HEADER -->
      <div style="text-align: center; margin-bottom: ${sectionGap}; padding-bottom: 14px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #000; line-height: 1.2;">Official Academic Transcript</h1>
        <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 500; color: #555; letter-spacing: 0.2px; text-transform: uppercase;">State University</p>
      </div>

      <!-- STUDENT INFO -->
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

      <!-- COURSE HISTORY -->
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

      <!-- FOOTER -->
      <div style="border-top: 1px solid #e0e0e0; padding-top: 12px; text-align: center; color: #777; font-size: 9px; line-height: 1.4;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 3px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// ============================================================
// LANDSCAPE: Professional Default (Horizontal Layout)
// ============================================================
function createProfessionalLandscapeTemplate(studentName, courses) {
  // Calculate dynamic spacing based on course count
  const courseCount = courses.length;
  const courseTableSize = courseCount <= 8 ? '11px' : courseCount <= 12 ? '10px' : '9px';
  const rowPadding = courseCount <= 8 ? '7px' : courseCount <= 12 ? '5px' : '4px';
  const sectionGap = courseCount <= 8 ? '16px' : courseCount <= 12 ? '12px' : '10px';

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
    <div style="width: 297mm; padding: 28px 40px; background-color: white; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; font-size: 11px; line-height: 1.5; color: #1a1a1a; box-sizing: border-box; display: flex; flex-direction: column; min-height: 210mm;">
      <!-- HEADER -->
      <div style="text-align: center; margin-bottom: ${sectionGap}; padding-bottom: 12px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #000; line-height: 1.2;">Official Academic Transcript</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 500; color: #555; letter-spacing: 0.2px; text-transform: uppercase;">State University</p>
      </div>

      <!-- STUDENT INFO - HORIZONTAL -->
      <div style="margin-bottom: ${sectionGap}; background-color: #f9f9f9; padding: 12px 16px; border-left: 3px solid #000; display: flex; gap: 40px; align-items: center;">
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Student Name</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">${studentName}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Student ID</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">123456789</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">Issue Date</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <div>
          <p style="margin: 2px 0; font-size: 10px; text-transform: uppercase; color: #999; font-weight: 600; letter-spacing: 0.4px;">GPA</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: 500; color: #1a1a1a;">3.85</p>
        </div>
      </div>

      <!-- COURSE HISTORY - FLEX GROW -->
      <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: ${sectionGap};">
        <h2 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #000;">Course History</h2>
        <table style="width: 100%; border-collapse: collapse; background-color: #fafafa; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <thead>
            <tr style="background-color: #f0f0f0; border-bottom: 2px solid #000;">
              <th style="padding: 8px 0; padding-left: 0; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 10%;">Code</th>
              <th style="padding: 8px 12px; padding-left: 12px; text-align: left; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 50%;">Course Title</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 15%;">Term</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 10%;">Grade</th>
              <th style="padding: 8px; text-align: center; font-size: ${courseTableSize}; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 0.5px; width: 10%;">Credits</th>
            </tr>
          </thead>
          <tbody>
            ${courseRows}
          </tbody>
        </table>
      </div>

      <!-- FOOTER -->
      <div style="border-top: 1px solid #e0e0e0; padding-top: 10px; text-align: center; color: #777; font-size: 9px; line-height: 1.4;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 3px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// ============================================================
// PORTRAIT BY YEAR: Professional (Grouped by Semester)
// ============================================================
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
      <!-- HEADER -->
      <div style="text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.3px; color: #000;">Official Academic Transcript</h1>
        <p style="margin: 5px 0 0 0; font-size: 12px; font-weight: 500; color: #555; text-transform: uppercase;">State University</p>
      </div>

      <!-- STUDENT INFO -->
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

      <!-- COURSE HISTORY BY YEAR -->
      <div style="margin-bottom: 16px;">
        <h2 style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #000;">Course History by Term</h2>
        ${sections}
      </div>

      <!-- FOOTER -->
      <div style="border-top: 1px solid #e0e0e0; padding-top: 10px; text-align: center; color: #777; font-size: 9px; line-height: 1.4;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 2px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

// ============================================================
// LANDSCAPE BY YEAR: Professional (Horizontal, Grouped by Semester)
// ============================================================
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
      <!-- HEADER -->
      <div style="text-align: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 2px solid #000;">
        <h1 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #000;">Official Academic Transcript</h1>
        <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 500; color: #555; text-transform: uppercase;">State University</p>
      </div>

      <!-- STUDENT INFO - HORIZONTAL -->
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

      <!-- COURSE HISTORY BY YEAR -->
      <div style="flex: 1; display: flex; flex-direction: column; margin-bottom: 14px;">
        <h2 style="margin: 0 0 10px 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #000;">Course History by Term</h2>
        <div style="overflow-y: auto;">
          ${sections}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; text-align: center; color: #777; font-size: 8px; line-height: 1.3;">
        <p style="margin: 0;">This document is an official academic record certified by State University.</p>
        <p style="margin: 2px 0 0 0;">Unauthorized reproduction or distribution is prohibited. ${new Date().getFullYear()} © State University</p>
      </div>
    </div>
  `;
}

export {
  createProfessionalPortraitTemplate,
  createProfessionalLandscapeTemplate,
  createProfessionalPortraitByYearTemplate,
  createProfessionalLandscapeByYearTemplate,
};
