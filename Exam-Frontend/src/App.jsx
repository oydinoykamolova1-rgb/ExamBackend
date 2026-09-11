import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TakeExamPage from './pages/TakeExamPage';
import ExamResultPage from './pages/ExamResultPage';
import MyResultsPage from './pages/MyResultsPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminUsersPage from './pages/AdminUsersPage';

export default function App() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  // Navigation tabs: 'dashboard' | 'takingExam' | 'resultDetails' | 'results' | 'teacher' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Selected Exam for taking
  const [activeExamId, setActiveExamId] = useState(null);
  // Exam Result object for viewing
  const [activeResult, setActiveResult] = useState(null);

  if (!user) {
    return authView === 'login' ? (
      <LoginPage onNavigateRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onNavigateLogin={() => setAuthView('login')} />
    );
  }

  const handleStartExam = (examId) => {
    setActiveExamId(examId);
    setActiveTab('takingExam');
  };

  const handleExamSubmitted = (result) => {
    setActiveResult(result);
    setActiveTab('resultDetails');
  };

  const handleViewResultDetails = (result) => {
    setActiveResult(result);
    setActiveTab('resultDetails');
  };

  return (
    <div>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ paddingBottom: '4rem' }}>
        {activeTab === 'dashboard' && (
          <StudentDashboard onStartExam={handleStartExam} />
        )}

        {activeTab === 'takingExam' && activeExamId && (
          <TakeExamPage 
            examId={activeExamId} 
            onCancel={() => setActiveTab('dashboard')}
            onExamSubmitted={handleExamSubmitted}
          />
        )}

        {activeTab === 'resultDetails' && activeResult && (
          <ExamResultPage 
            result={activeResult} 
            onBackToExams={() => setActiveTab('dashboard')} 
          />
        )}

        {activeTab === 'results' && (
          <MyResultsPage onViewResultDetails={handleViewResultDetails} />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard />
        )}

        {activeTab === 'admin' && (
          <AdminUsersPage />
        )}
      </main>
    </div>
  );
}
