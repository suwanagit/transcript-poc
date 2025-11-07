export default function LandscapeBySubject({ studentName, sampleCourses }) {
  // Group courses by subject (derived from course code prefix)
  const coursesBySubject = {};
  sampleCourses.forEach((course) => {
    // Extract subject from course code (e.g., "MATH" from "MATH101")
    const subject = course.code.replace(/\d+/g, '').toUpperCase() || 'Other';
    if (!coursesBySubject[subject]) {
      coursesBySubject[subject] = [];
    }
    coursesBySubject[subject].push(course);
  });

  return (
    <div
      style={{
        width: '297mm',
        padding: '30px',
        backgroundColor: 'white',
        fontFamily: 'serif',
        fontSize: '11px',
        lineHeight: '1.5',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 3px 0', fontSize: '16px' }}>Official Academic Transcript</h2>
        <p style={{ margin: '0', color: '#666' }}>State University</p>
      </div>

      <div style={{ marginBottom: '25px', borderBottom: '1px solid #000', paddingBottom: '12px', display: 'flex', gap: '40px' }}>
        <div>
          <p style={{ margin: '3px 0' }}>
            <strong>Student Name:</strong> {studentName}
          </p>
          <p style={{ margin: '3px 0' }}>
            <strong>Student ID:</strong> 123456789
          </p>
        </div>
        <div>
          <p style={{ margin: '3px 0' }}>
            <strong>Issue Date:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '12px', marginBottom: '12px' }}>Course History by Subject</h3>
        
        {Object.entries(coursesBySubject).map(([subject, courses]) => (
          <div key={subject} style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '11px', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              {subject}
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px', fontSize: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '6px', fontWeight: 'bold' }}>Code</th>
                  <th style={{ textAlign: 'left', padding: '6px', fontWeight: 'bold' }}>Course Name</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Semester</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Grade</th>
                  <th style={{ textAlign: 'center', padding: '6px', fontWeight: 'bold' }}>Credits</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
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
        ))}
      </div>

      <div style={{ borderTop: '2px solid #000', paddingTop: '12px', textAlign: 'center', color: '#666', fontSize: '9px' }}>
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  );
}