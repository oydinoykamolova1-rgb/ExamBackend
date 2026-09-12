// Client-side Mock Fallback Engine when backend API server is offline or deployed on static host (Vercel)

const MOCK_USERS = [
  { id: 1, fullName: 'System Admin', email: 'admin@exam.com', password: 'Admin123!', role: 'Admin', roleNum: 0 },
  { id: 2, fullName: 'John Teacher', email: 'teacher@exam.com', password: 'Teacher123!', role: 'Teacher', roleNum: 1 },
  { id: 3, fullName: 'Prof. Sarah Jenkins', email: 'sarah.teacher@exam.com', password: 'Teacher123!', role: 'Teacher', roleNum: 1 },
  { id: 4, fullName: 'Alex Student', email: 'student@exam.com', password: 'Student123!', role: 'Student', roleNum: 2 },
  { id: 5, fullName: 'Maria Garcia', email: 'maria.student@exam.com', password: 'Student123!', role: 'Student', roleNum: 2 },
  { id: 6, fullName: 'David Chen', email: 'david.student@exam.com', password: 'Student123!', role: 'Student', roleNum: 2 },
];

const INITIAL_EXAMS = [
  {
    id: 1,
    title: "C# Language & .NET Core Fundamentals",
    description: "Comprehensive test covering OOP, C# memory management, value types vs reference types, and async/await.",
    durationMinutes: 25,
    passPercentage: 70.0,
    isActive: true,
    createdById: 2,
    createdByName: "John Teacher",
    questions: [
      {
        id: 101,
        examId: 1,
        text: "Which keyword is used to prevent a class from being inherited in C#?",
        points: 2.0,
        type: 0, // SingleChoice
        answers: [
          { id: 1001, text: "sealed", isCorrect: true },
          { id: 1002, text: "static", isCorrect: false },
          { id: 1003, text: "abstract", isCorrect: false },
          { id: 1004, text: "private", isCorrect: false }
        ]
      },
      {
        id: 102,
        examId: 1,
        text: "What is the default access modifier for members declared inside a C# class?",
        points: 2.0,
        type: 0,
        answers: [
          { id: 1005, text: "public", isCorrect: false },
          { id: 1006, text: "internal", isCorrect: false },
          { id: 1007, text: "private", isCorrect: true },
          { id: 1008, text: "protected", isCorrect: false }
        ]
      },
      {
        id: 103,
        examId: 1,
        text: "Which of the following are Value Types in C#? (Select all that apply)",
        points: 3.0,
        type: 1, // MultipleChoice
        answers: [
          { id: 1009, text: "System.Int32 (int)", isCorrect: true },
          { id: 1010, text: "System.String (string)", isCorrect: false },
          { id: 1011, text: "System.DateTime (struct)", isCorrect: true },
          { id: 1012, text: "Custom Class (class)", isCorrect: false }
        ]
      },
      {
        id: 104,
        examId: 1,
        text: "What is the primary role of the Garbage Collector (GC) in .NET?",
        points: 2.0,
        type: 0,
        answers: [
          { id: 1013, text: "Automatic memory allocation & cleanup for reference objects on the heap", isCorrect: true },
          { id: 1014, text: "Compiling C# code into native assembly binaries", isCorrect: false },
          { id: 1015, text: "Encrypting strings stored in application configuration", isCorrect: false },
          { id: 1016, text: "Managing multi-thread locks and sync semaphores", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "React 18 & Modern Web Development",
    description: "Test your knowledge on React hooks, Virtual DOM, state management, component lifecycle, and JSX syntax.",
    durationMinutes: 20,
    passPercentage: 75.0,
    isActive: true,
    createdById: 2,
    createdByName: "John Teacher",
    questions: [
      {
        id: 201,
        examId: 2,
        text: "Which hook is used to handle side effects in React functional components?",
        points: 2.0,
        type: 0,
        answers: [
          { id: 2001, text: "useEffect", isCorrect: true },
          { id: 2002, text: "useState", isCorrect: false },
          { id: 2003, text: "useContext", isCorrect: false },
          { id: 2004, text: "useReducer", isCorrect: false }
        ]
      },
      {
        id: 202,
        examId: 2,
        text: "What is the key benefit of React Virtual DOM?",
        points: 2.0,
        type: 0,
        answers: [
          { id: 2005, text: "Minimizes actual DOM manipulation by batching updates", isCorrect: true },
          { id: 2006, text: "Replaces HTML standard with custom binary tags", isCorrect: false },
          { id: 2007, text: "Runs JavaScript directly inside the browser GPU", isCorrect: false },
          { id: 2008, text: "Prevents CSS style inheritance", isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Database Architecture & SQL Essentials",
    description: "Evaluates SQL queries, table indexing, normal forms (1NF, 2NF, 3NF), and ACID transaction properties.",
    durationMinutes: 30,
    passPercentage: 65.0,
    isActive: true,
    createdById: 3,
    createdByName: "Prof. Sarah Jenkins",
    questions: [
      {
        id: 301,
        examId: 3,
        text: "Which SQL clause is used to filter records after aggregation with GROUP BY?",
        points: 2.0,
        type: 0,
        answers: [
          { id: 3001, text: "HAVING", isCorrect: true },
          { id: 3002, text: "WHERE", isCorrect: false },
          { id: 3003, text: "ORDER BY", isCorrect: false },
          { id: 3004, text: "DISTINCT", isCorrect: false }
        ]
      }
    ]
  }
];

function getStoredExams() {
  const data = localStorage.getItem('mock_exams');
  if (!data) {
    localStorage.setItem('mock_exams', JSON.stringify(INITIAL_EXAMS));
    return INITIAL_EXAMS;
  }
  return JSON.parse(data);
}

function saveStoredExams(exams) {
  localStorage.setItem('mock_exams', JSON.stringify(exams));
}

function getStoredUsers() {
  const data = localStorage.getItem('mock_users');
  if (!data) {
    localStorage.setItem('mock_users', JSON.stringify(MOCK_USERS));
    return MOCK_USERS;
  }
  return JSON.parse(data);
}

function saveStoredUsers(users) {
  localStorage.setItem('mock_users', JSON.stringify(users));
}

function getStoredResults() {
  const data = localStorage.getItem('mock_results');
  return data ? JSON.parse(data) : [];
}

function saveStoredResults(results) {
  localStorage.setItem('mock_results', JSON.stringify(results));
}

export function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  // Auth: Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === body.email.toLowerCase() && u.password === body.password);
    
    const defaultUsers = {
      'admin@exam.com': { id: 1, fullName: 'System Admin', email: 'admin@exam.com', role: 'Admin' },
      'teacher@exam.com': { id: 2, fullName: 'John Teacher', email: 'teacher@exam.com', role: 'Teacher' },
      'sarah.teacher@exam.com': { id: 3, fullName: 'Prof. Sarah Jenkins', email: 'sarah.teacher@exam.com', role: 'Teacher' },
      'student@exam.com': { id: 4, fullName: 'Alex Student', email: 'student@exam.com', role: 'Student' },
      'maria.student@exam.com': { id: 5, fullName: 'Maria Garcia', email: 'maria.student@exam.com', role: 'Student' },
      'david.student@exam.com': { id: 6, fullName: 'David Chen', email: 'david.student@exam.com', role: 'Student' }
    };

    const targetUser = user || defaultUsers[body.email.toLowerCase()];

    if (!targetUser) {
      throw new Error('Invalid email or password');
    }

    return {
      token: `mock-jwt-token-${targetUser.id}-${Date.now()}`,
      userId: targetUser.id,
      fullName: targetUser.fullName,
      email: targetUser.email,
      role: targetUser.role
    };
  }

  // Auth: Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === body.email.toLowerCase())) {
      throw new Error('Email is already registered.');
    }

    const roleMap = { 0: 'Admin', 1: 'Teacher', 2: 'Student' };
    const roleStr = roleMap[body.role] || 'Student';

    const newUser = {
      id: Date.now(),
      fullName: body.fullName,
      email: body.email,
      password: body.password,
      role: roleStr,
      roleNum: body.role
    };

    users.push(newUser);
    saveStoredUsers(users);

    return {
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      userId: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role
    };
  }

  // Exams: GET my created (MUST BE CHECKED BEFORE /exams/:id)
  if (endpoint === '/exams/my-created' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const exams = getStoredExams();
    return exams.filter(e => e.createdById === currentUser.userId || currentUser.role === 'Admin');
  }

  // Exams: GET active exams
  if (endpoint === '/exams' && method === 'GET') {
    const exams = getStoredExams();
    return exams.filter(e => e.isActive).map(e => ({
      ...e,
      questionsCount: e.questions ? e.questions.length : 0
    }));
  }

  // Exams: Create
  if (endpoint === '/exams' && method === 'POST') {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const exams = getStoredExams();
    const newExam = {
      id: Date.now(),
      title: body.title,
      description: body.description || '',
      durationMinutes: parseInt(body.durationMinutes, 10),
      passPercentage: parseFloat(body.passPercentage),
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdById: currentUser.userId || 2,
      createdByName: currentUser.fullName || "Teacher",
      questions: []
    };
    exams.push(newExam);
    saveStoredExams(exams);
    return newExam;
  }

  // Exams: GET by numeric ID
  const examIdMatch = endpoint.match(/^\/exams\/(\d+)$/);
  if (examIdMatch && method === 'GET') {
    const id = parseInt(examIdMatch[1], 10);
    const exams = getStoredExams();
    const exam = exams.find(e => e.id === id);
    if (!exam) throw new Error('Exam not found');
    return exam;
  }

  // Exams: DELETE by numeric ID
  if (examIdMatch && method === 'DELETE') {
    const id = parseInt(examIdMatch[1], 10);
    let exams = getStoredExams();
    exams = exams.filter(e => e.id !== id);
    saveStoredExams(exams);
    return { message: 'Exam deleted successfully' };
  }

  // Questions: Add question
  if (endpoint === '/questions' && method === 'POST') {
    const exams = getStoredExams();
    const exam = exams.find(e => e.id === body.examId);
    if (!exam) throw new Error('Exam not found');
    
    const newQ = {
      id: Date.now(),
      examId: body.examId,
      text: body.text,
      points: body.points,
      type: body.type,
      answers: body.answers.map((a, idx) => ({ id: Date.now() + idx, text: a.text, isCorrect: a.isCorrect }))
    };

    if (!exam.questions) exam.questions = [];
    exam.questions.push(newQ);
    saveStoredExams(exams);
    return newQ;
  }

  // Questions: Delete question by numeric ID
  const questionIdMatch = endpoint.match(/^\/questions\/(\d+)$/);
  if (questionIdMatch && method === 'DELETE') {
    const qId = parseInt(questionIdMatch[1], 10);
    const exams = getStoredExams();
    exams.forEach(exam => {
      if (exam.questions) {
        exam.questions = exam.questions.filter(q => q.id !== qId);
      }
    });
    saveStoredExams(exams);
    return { message: 'Question deleted successfully' };
  }

  // Results: Submit
  if (endpoint === '/results/submit' && method === 'POST') {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const exams = getStoredExams();
    const exam = exams.find(e => e.id === body.examId);
    
    let earnedPoints = 0;
    let totalPoints = 0;

    if (exam && exam.questions) {
      exam.questions.forEach(q => {
        totalPoints += q.points;
        const studentAns = body.answers ? body.answers.find(a => a.questionId === q.id) : null;
        if (studentAns) {
          const selectedAnswerIds = (studentAns.selectedAnswerIds || studentAns.selectedOptionIds || []).map(String);
          const correctOptionIds = q.answers.filter(ans => ans.isCorrect).map(ans => String(ans.id));
          
          const isMatch = selectedAnswerIds.length === correctOptionIds.length &&
            selectedAnswerIds.every(id => correctOptionIds.includes(id));
          
          if (isMatch) {
            earnedPoints += q.points;
          }
        }
      });
    }

    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = percentage >= (exam ? exam.passPercentage : 70);

    const result = {
      id: Date.now(),
      examId: body.examId,
      examTitle: exam ? exam.title : "Exam",
      studentId: currentUser.userId || 4,
      studentName: currentUser.fullName || "Alex Student",
      score: earnedPoints,
      totalPoints: totalPoints,
      percentage: Math.round(percentage * 10) / 10,
      isPassed: isPassed,
      submittedAt: new Date().toISOString()
    };

    const results = getStoredResults();
    results.push(result);
    saveStoredResults(results);
    return result;
  }

  // Results: My Results
  if (endpoint === '/results/my-results' && method === 'GET') {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const results = getStoredResults();
    return results.filter(r => r.studentId === currentUser.userId);
  }

  // Results: Exam Results by Exam ID
  if (endpoint.startsWith('/results/exam/') && method === 'GET') {
    const examId = parseInt(endpoint.split('/')[3], 10);
    const results = getStoredResults();
    return results.filter(r => r.examId === examId);
  }

  // Results: Get result by numeric ID
  const resultIdMatch = endpoint.match(/^\/results\/(\d+)$/);
  if (resultIdMatch && method === 'GET') {
    const resId = parseInt(resultIdMatch[1], 10);
    const results = getStoredResults();
    const found = results.find(r => r.id === resId);
    if (!found) throw new Error('Result not found');
    return found;
  }

  // Users: Get all
  if (endpoint === '/users' && method === 'GET') {
    return getStoredUsers();
  }

  // Users: Update user
  const userIdMatch = endpoint.match(/^\/users\/(\d+)$/);
  if (userIdMatch && method === 'PUT') {
    const uId = parseInt(userIdMatch[1], 10);
    const users = getStoredUsers();
    const target = users.find(u => u.id === uId);
    if (target) {
      if (body.fullName) target.fullName = body.fullName;
      if (body.role !== undefined) {
        const roleMap = { 0: 'Admin', 1: 'Teacher', 2: 'Student' };
        target.role = roleMap[body.role] || target.role;
      }
      saveStoredUsers(users);
      return target;
    }
    throw new Error('User not found');
  }

  // Users: Delete user
  if (userIdMatch && method === 'DELETE') {
    const uId = parseInt(userIdMatch[1], 10);
    let users = getStoredUsers();
    users = users.filter(u => u.id !== uId);
    saveStoredUsers(users);
    return { message: 'User deleted successfully' };
  }

  // Fallback defaults
  if (endpoint.startsWith('/results')) return [];
  if (endpoint.startsWith('/users')) return getStoredUsers();
  if (endpoint.startsWith('/exams')) return getStoredExams();

  return { success: true };
}
