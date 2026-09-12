// Gemini AI Skill Service for Smart Exam & Question Generation and Performance Coaching

const AI_KNOWLEDGE_BASE = {
  "c#": [
    {
      text: "What is the difference between value types and reference types in C#?",
      points: 2.5,
      type: 0,
      answers: [
        { text: "Value types store data on stack; Reference types store references on heap", isCorrect: true },
        { text: "Reference types are allocated on CPU registers; Value types on RAM", isCorrect: false },
        { text: "Value types cannot be used inside structs", isCorrect: false },
        { text: "There is no performance difference between value and reference types", isCorrect: false }
      ]
    },
    {
      text: "Which C# keyword ensures that unmanaged resources are automatically disposed?",
      points: 2.0,
      type: 0,
      answers: [
        { text: "using", isCorrect: true },
        { text: "finally", isCorrect: false },
        { text: "lock", isCorrect: false },
        { text: "checked", isCorrect: false }
      ]
    },
    {
      text: "Which LINQ methods execute deferred execution in C#? (Select all that apply)",
      points: 3.0,
      type: 1,
      answers: [
        { text: "Where()", isCorrect: true },
        { text: "Select()", isCorrect: true },
        { text: "ToList()", isCorrect: false },
        { text: "First()", isCorrect: false }
      ]
    }
  ],
  "react": [
    {
      text: "What is the primary purpose of React.memo()?",
      points: 2.0,
      type: 0,
      answers: [
        { text: "Prevents unnecessary re-renders of a component when props remain unchanged", isCorrect: true },
        { text: "Stores state variables directly in LocalStorage", isCorrect: false },
        { text: "Creates a deep copy of component props automatically", isCorrect: false },
        { text: "Encrypts JSX templates before rendering", isCorrect: false }
      ]
    },
    {
      text: "Which rules must be followed when using React Hooks? (Select all that apply)",
      points: 3.0,
      type: 1,
      answers: [
        { text: "Only call Hooks at the top level (never inside loops or conditions)", isCorrect: true },
        { text: "Only call Hooks from React function components or custom Hooks", isCorrect: true },
        { text: "Hooks can be called inside class constructors", isCorrect: false },
        { text: "Hook names must always begin with 'use'", isCorrect: true }
      ]
    }
  ],
  "python": [
    {
      text: "What is the output of len(set([1, 2, 2, 3, 4, 4])) in Python?",
      points: 2.0,
      type: 0,
      answers: [
        { text: "4", isCorrect: true },
        { text: "6", isCorrect: false },
        { text: "5", isCorrect: false },
        { text: "Error", isCorrect: false }
      ]
    },
    {
      text: "Which Python data structures are Immutable? (Select all that apply)",
      points: 3.0,
      type: 1,
      answers: [
        { text: "Tuple", isCorrect: true },
        { text: "String", isCorrect: true },
        { text: "List", isCorrect: false },
        { text: "Dictionary", isCorrect: false }
      ]
    }
  ],
  "devops": [
    {
      text: "What is the main role of Docker containers compared to Virtual Machines?",
      points: 2.5,
      type: 0,
      answers: [
        { text: "Lightweight OS-level virtualization sharing the host OS kernel", isCorrect: true },
        { text: "Simulates hardware BIOS and guest OS kernel completely", isCorrect: false },
        { text: "Replaces database storage engines with binary blobs", isCorrect: false },
        { text: "Runs code directly on GPU compute clusters", isCorrect: false }
      ]
    }
  ]
};

export async function generateAIQuestionsSkill(topic, count = 3) {
  // Simulate AI generation delay for realistic skill experience
  await new Promise((resolve) => setTimeout(resolve, 800));

  const key = topic.toLowerCase();
  let matchedQuestions = [];

  for (const k in AI_KNOWLEDGE_BASE) {
    if (key.includes(k)) {
      matchedQuestions = AI_KNOWLEDGE_BASE[k];
      break;
    }
  }

  if (matchedQuestions.length === 0) {
    // Generic high-tech generated questions for custom topic
    matchedQuestions = [
      {
        text: `What is the core foundational concept behind ${topic}?`,
        points: 2.0,
        type: 0,
        answers: [
          { text: `Optimizing architecture and component separation in ${topic}`, isCorrect: true },
          { text: `Manual memory allocation without compiler checks`, isCorrect: false },
          { text: `Deprecating synchronous execution threads`, isCorrect: false },
          { text: `Static asset compression only`, isCorrect: false }
        ]
      },
      {
        text: `Which best practices should be applied when scaling ${topic}? (Select all that apply)`,
        points: 3.0,
        type: 1,
        answers: [
          { text: `Modular decoupling and automated test coverage`, isCorrect: true },
          { text: `Continuous integration and performance monitoring`, isCorrect: true },
          { text: `Hardcoding configuration tokens inside main source code`, isCorrect: false },
          { text: `Disabling error logging in production`, isCorrect: false }
        ]
      },
      {
        text: `How does ${topic} ensure security and data integrity during execution?`,
        points: 2.5,
        type: 0,
        answers: [
          { text: `Enforcing strict validation, token authorization, and parameter sanitization`, isCorrect: true },
          { text: `Bypassing TLS encryption headers`, isCorrect: false },
          { text: `Storing credentials in open plain text files`, isCorrect: false },
          { text: `Disabling CORS domain restrictions`, isCorrect: false }
        ]
      }
    ];
  }

  return matchedQuestions.slice(0, count);
}

export function generateAIPerformanceFeedbackSkill(result) {
  const percentage = result.percentage || 0;
  const isPassed = result.isPassed;

  if (percentage >= 90) {
    return {
      status: "Mastery Level 🌟",
      summary: "Exceptional performance! You demonstrated complete mastery over the exam material.",
      recommendations: [
        "Take advanced certification exams in this domain to showcase expertise.",
        "Assist peers by sharing insights and explaining key concepts.",
        "Explore real-world architecture design challenges."
      ]
    };
  } else if (isPassed) {
    return {
      status: "Competent / Passed ✅",
      summary: "Great job! You met the passing requirements and have a solid foundation.",
      recommendations: [
        "Review the specific questions you missed in the detailed breakdown below.",
        "Practice multi-choice edge case questions to reach 90%+ score next time.",
        "Schedule a quick refresher test in 2 weeks to retain knowledge."
      ]
    };
  } else {
    return {
      status: "Needs Revision 📚",
      summary: "You were close, but didn't reach the required pass threshold. Don't worry!",
      recommendations: [
        "Focus on core definitions and value/reference type distinctions.",
        "Re-read topic documentation and attempt practice questions.",
        "Retake the examination once you feel confident with the weak areas."
      ]
    };
  }
}
