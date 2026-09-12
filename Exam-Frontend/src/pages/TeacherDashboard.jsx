import React, { useEffect, useState } from 'react';
import { fetchMyCreatedExamsApi, createExamApi, deleteExamApi, fetchExamByIdApi } from '../api/exams';
import { addQuestionApi, deleteQuestionApi } from '../api/questions';
import { fetchExamResultsApi } from '../api/results';
import Modal from '../components/Modal';
import { PlusCircle, Trash2, HelpCircle, Eye, Users, FileText, Check, X, Sparkles, Wand2 } from 'lucide-react';
import { generateAIQuestionsSkill } from '../api/aiSkillService';

export default function TeacherDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [error, setError] = useState('');

  // Create Exam Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPassScore, setNewPassScore] = useState(60);

  // Manage Questions Modal State
  const [selectedExam, setSelectedExam] = useState(null);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [qText, setQText] = useState('');
  const [qPoints, setQPoints] = useState(1);
  const [qType, setQType] = useState('0'); // 0: SingleChoice, 1: MultipleChoice
  const [answers, setAnswers] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]);

  // View Submissions Modal State
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [subExamTitle, setSubExamTitle] = useState('');

  useEffect(() => {
    loadMyExams();
  }, []);

  const loadMyExams = async () => {
    setLoading(true);
    try {
      const data = await fetchMyCreatedExamsApi();
      setExams(data);
    } catch (err) {
      setError(err.message || 'Failed to load teacher exams.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await createExamApi({
        title: newTitle,
        description: newDesc,
        durationMinutes: parseInt(newDuration, 10),
        passPercentage: parseFloat(newPassScore)
      });
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      loadMyExams();
    } catch (err) {
      alert(err.message || 'Failed to create exam.');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;
    try {
      await deleteExamApi(id);
      loadMyExams();
    } catch (err) {
      alert(err.message || 'Failed to delete exam.');
    }
  };

  // Questions Management
  const openQuestionsModal = async (examId) => {
    try {
      const fullExam = await fetchExamByIdApi(examId);
      setSelectedExam(fullExam);
      setIsQuestionsModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to load questions.');
    }
  };

  const handleAddAnswerField = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const handleRemoveAnswerField = (index) => {
    if (answers.length <= 2) {
      alert('A question must have at least 2 answer options.');
      return;
    }
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index, field, value) => {
    const updated = [...answers];
    updated[index][field] = value;

    // If single choice and setting true, uncheck others
    if (qType === '0' && field === 'isCorrect' && value === true) {
      updated.forEach((ans, i) => {
        if (i !== index) ans.isCorrect = false;
      });
    }

    setAnswers(updated);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;

    if (!answers.some((a) => a.isCorrect)) {
      alert('Please mark at least one answer as correct.');
      return;
    }

    try {
      await addQuestionApi({
        examId: selectedExam.id,
        text: qText,
        points: parseFloat(qPoints),
        type: parseInt(qType, 10),
        answers: answers
      });

      setQText('');
      setAnswers([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
      ]);
      openQuestionsModal(selectedExam.id);
      loadMyExams();
    } catch (err) {
      alert(err.message || 'Failed to add question.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteQuestionApi(questionId);
      openQuestionsModal(selectedExam.id);
      loadMyExams();
    } catch (err) {
      alert(err.message || 'Failed to delete question.');
    }
  };

  const handleGenerateAIQuestions = async () => {
    if (!selectedExam) return;
    setGeneratingAI(true);
    try {
      const generated = await generateAIQuestionsSkill(selectedExam.title, 3);
      for (const q of generated) {
        await addQuestionApi({
          examId: selectedExam.id,
          text: q.text,
          points: q.points,
          type: q.type,
          answers: q.answers
        });
      }
      await openQuestionsModal(selectedExam.id);
      loadMyExams();
    } catch (err) {
      alert(err.message || 'AI Question Generation failed.');
    } finally {
      setGeneratingAI(false);
    }
  };

  // View Submissions
  const openSubmissionsModal = async (exam) => {
    setSubExamTitle(exam.title);
    try {
      const data = await fetchExamResultsApi(exam.id);
      setSubmissions(data);
      setIsSubmissionsModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to fetch student results.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Teacher Exam Studio
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Create exams, manage questions, and view student submissions.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle size={18} />
          <span>Create New Exam</span>
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading teacher workspace...
        </div>
      ) : exams.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <FileText size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h3>No Exams Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Click "Create New Exam" above to start building your first test.
          </p>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle size={18} /> Create Exam
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-teacher">
                    {exam.questionsCount} Question{exam.questionsCount === 1 ? '' : 's'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    Pass: {exam.passPercentage}%
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {exam.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  {exam.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => openQuestionsModal(exam.id)}
                  style={{ flex: 1 }}
                >
                  <HelpCircle size={15} /> Questions
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => openSubmissionsModal(exam)}
                  style={{ flex: 1 }}
                >
                  <Users size={15} /> Submissions
                </button>

                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteExam(exam.id)}
                  title="Delete Exam"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Create Exam */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Exam">
        <form onSubmit={handleCreateExam}>
          <div className="form-group">
            <label className="form-label">Exam Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Advanced C# & Web API" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows={3}
              placeholder="Describe the topics covered..." 
              value={newDesc} 
              onChange={(e) => setNewDesc(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <input 
                type="number" 
                className="form-input" 
                min={1} max={1440} 
                value={newDuration} 
                onChange={(e) => setNewDuration(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pass Percentage (%)</label>
              <input 
                type="number" 
                className="form-input" 
                min={0} max={100} 
                value={newPassScore} 
                onChange={(e) => setNewPassScore(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Exam</button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Manage Questions */}
      <Modal 
        isOpen={isQuestionsModalOpen} 
        onClose={() => setIsQuestionsModalOpen(false)} 
        title={selectedExam ? `Questions (${selectedExam.questions.length}) - ${selectedExam.title}` : 'Questions'}
      >
        {selectedExam && (
          <div>
            {/* Gemini AI Question Generator Skill Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Sparkles size={16} /> Gemini AI Skill Generator
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Avtomatik tarzda ushbu imtihonga mos 3 ta yangi professional savollar yaratadi
                </div>
              </div>

              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={handleGenerateAIQuestions}
                disabled={generatingAI}
                style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', border: 'none', whiteSpace: 'nowrap', padding: '0.4rem 0.85rem' }}
              >
                <Wand2 size={15} />
                <span>{generatingAI ? 'AI Yaratmoqda...' : '⚡ AI Savol Yaratish'}</span>
              </button>
            </div>

            {/* Existing Questions List */}
            {selectedExam.questions.length > 0 && (
              <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)' }}>Current Questions</h4>
                {selectedExam.questions.map((q, idx) => (
                  <div key={q.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {idx + 1}. {q.text}
                      </div>
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDeleteQuestion(q.id)}
                        style={{ padding: '0.2rem 0.5rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {q.answers.map((a) => (
                        <span key={a.id} className={`badge ${a.isCorrect ? 'badge-pass' : 'badge-student'}`} style={{ textTransform: 'none' }}>
                          {a.isCorrect ? '✓ ' : ''}{a.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Question Form */}
            <form onSubmit={handleAddQuestion} style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
                Add New Question
              </h4>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter the question..." 
                  value={qText} 
                  onChange={(e) => setQText(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Points</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    className="form-input" 
                    value={qPoints} 
                    onChange={(e) => setQPoints(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Question Type</label>
                  <select 
                    className="form-input" 
                    value={qType} 
                    onChange={(e) => setQType(e.target.value)}
                  >
                    <option value="0">Single Choice</option>
                    <option value="1">Multiple Choice</option>
                  </select>
                </div>
              </div>

              {/* Answers */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label">Answer Options</label>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddAnswerField}>
                    <PlusCircle size={14} /> Add Option
                  </button>
                </div>

                {answers.map((ans, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder={`Option ${i + 1}`}
                      value={ans.text} 
                      onChange={(e) => handleAnswerChange(i, 'text', e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer', background: ans.isCorrect ? 'var(--success-bg)' : 'transparent', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
                      <input 
                        type={qType === '0' ? 'radio' : 'checkbox'} 
                        name="correctAnswer" 
                        checked={ans.isCorrect} 
                        onChange={(e) => handleAnswerChange(i, 'isCorrect', e.target.checked)} 
                      />
                      <span style={{ color: ans.isCorrect ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                        Correct
                      </span>
                    </label>

                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => handleRemoveAnswerField(i)}
                      style={{ padding: '0.4rem 0.6rem', color: '#f87171' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button type="submit" className="btn btn-primary">
                  Add Question to Exam
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Modal 3: View Submissions */}
      <Modal isOpen={isSubmissionsModalOpen} onClose={() => setIsSubmissionsModalOpen(false)} title={`Submissions for ${subExamTitle}`}>
        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No students have taken this exam yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {submissions.map((sub) => (
              <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{sub.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {new Date(sub.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: sub.isPassed ? 'var(--success)' : 'var(--danger)' }}>
                    {sub.percentage}% ({sub.score}/{sub.totalPoints})
                  </div>
                  <span className={`badge ${sub.isPassed ? 'badge-pass' : 'badge-fail'}`}>
                    {sub.isPassed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
