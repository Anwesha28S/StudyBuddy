import { useState } from 'react';

import QuizDashboard from './QuizDashboard';
import VideoChat from './VideoChat';

export default function Dashboard() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('planner');
  const [workspaceData, setWorkspaceData] = useState(null);

  const handleBuildWorkspace = async () => {
    if (!videoUrl.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      if (!response.ok) throw new Error("Backend server execution failed");
      
      const data = await response.json();
      setWorkspaceData(data); // Expects { status, video_id, quiz, planner }
    } catch (err) {
      console.error("Workspace initialization failure:", err);
      alert("Failed to compile lecture data. Make sure your FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-roboto">
      
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-center text-slate-900 tracking-tight">AI StudyBuddy Workspace</h1>
        <p className="text-xl text-center text-slate-500 mt-1">Convert any  static lecture video link into an active workspace environment.</p>
      </div>

      {/* Input Link Form Controller */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shadow-sm mb-8">
        <input
          type="text"
          className="flex-1 p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          placeholder="Paste lecture URL (e.g., https://www.youtube.com/watch?...)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleBuildWorkspace}
          disabled={loading || !videoUrl.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium text-sm px-6 py-3 rounded-xl transition duration-150 shadow-sm"
        >
          {loading ? 'Analyzing Video...' : 'Generate Workspace'}
        </button>
      </div>

      {/* Main Workspace Layout Canvas */}
      {workspaceData ? (
        <div className="space-y-6">
          {/* Navigation Tab Bars */}
          <div className="flex border-b border-slate-200">
            {['planner', 'quiz', 'chat'].map((tab) => (
              <button
                key={tab}
                className={`py-3 px-6 font-medium text-sm capitalize border-b-2 transition -mb-px ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'chat' ? 'Interactive CoPilot' : `${tab} View`}
              </button>
            ))}
          </div>

          {/* Conditional View Renders */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
            
            {activeTab === 'quiz' && <QuizDashboard quizData={workspaceData.quiz} />}
            {activeTab === 'chat' && <VideoChat videoId={workspaceData.video_id} />}
          </div>
        </div>
      ) : (
        /* Empty Prompt Invitation Slate */
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <h3 className="text-lg font-semibold text-slate-700 mt-4 mb-1">Your Workspace is Ready</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Input a video file link above to automatically index context vectors and run evaluation assessments.
          </p>
        </div>
      )}
    </div>
  );
}