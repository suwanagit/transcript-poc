export default function PortraitBySubject({ studentName, sampleCourses }) {
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
        width: '210mm',
        padding: '40px',
        backgroundColor: 'white',
        fontFamily: 'serif',
        fontSize: '12px',
        lineHeight: '1.6',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Official Academic Transcript</h2>
        <p style={{ margin: '0', color: '#666' }}>State University</p>
      </div>

      <div style={{ marginBottom: '30px', borderBottom: '1px solid #000', paddingBottom: '15px' }}>
        <p style={{ margin: '5px 0' }}>
          <strong>Student Name:</strong> {studentName}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Student ID:</strong> 123456789
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Issue Date:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>Course History by Subject</h3>
        
        {Object.entries(coursesBySubject).map(([subject, courses]) => (
          <div key={subject} style={{ marginBottom: '25px' }}>
            <h4 style={{ fontSize: '12px', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
              {subject}
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold' }}>Course Code</th>
                  <th style={{ textAlign: 'left', padding: '8px', fontWeight: 'bold' }}>Course Name</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Semester</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Grade</th>
                  <th style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>Credits</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>{course.code}</td>
                    <td style={{ padding: '8px' }}>{course.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px' }}>{course.semester}</td>
                    <td style={{ textAlign: 'center', padding: '8px', fontWeight: 'bold' }}>{course.grade}</td>
                    <td style={{ textAlign: 'center', padding: '8px' }}>{course.credits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '2px solid #000', paddingTop: '15px', textAlign: 'center', color: '#666', fontSize: '10px' }}>
        <p>This is an official academic record. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  );
}
