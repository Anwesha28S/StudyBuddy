import { useState } from 'react';

import QuizDashboard from './QuizDashboard';
import VideoChat from './VideoChat';
import StudyPlanner from './StudyPlanner';
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
    <div className="min-h-screen bg-[#07070b] text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-roboto">

  {/* Title Header */}
  <div className="mb-10 text-center">
    <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
      AI StudyBuddy Workspace
    </h1>
    <p className="text-lg text-zinc-400 mt-2">
      Convert any static lecture video link into an active workspace environment.
    </p>
  </div>

  {/* Input Link Form Controller */}
  <div className="flex flex-col sm:flex-row gap-3 bg-[#11111a] border border-purple-500/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.12)] mb-8">
    <input
      type="text"
      className="flex-1 p-3 text-sm bg-[#0b0b12] border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 text-white placeholder:text-zinc-500"
      placeholder="Paste lecture URL (e.g., https://www.youtube.com/watch?...)"
      value={videoUrl}
      onChange={(e) => setVideoUrl(e.target.value)}
      disabled={loading}
    />

    <button
      onClick={handleBuildWorkspace}
      disabled={loading || !videoUrl.trim()}
      className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-200  focus:border-purple-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition duration-150 shadow-lg shadow-purple-900/30"
    >
      {loading ? "Analyzing Video..." : "Generate Workspace"}
    </button>
  </div>

  {/* Main Workspace Layout Canvas */}
  {workspaceData ? (
    <div className="space-y-6">
      
      {/* Navigation Tab Bars */}
      <div className="flex border-b border-zinc-800">
        {["planner", "quiz", "chat"].map((tab) => (
          <button
            key={tab}
            className={`py-3 px-6 font-medium text-sm capitalize border-b-2 transition -mb-px ${
              activeTab === tab
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "chat" ? "Interactive Assistance" : `${tab} View`}
          </button>
        ))}
      </div>

      {/* Conditional View Renders */}
      <div className="bg-[#11111a] border border-purple-500/10 p-6 rounded-2xl shadow-[0_0_35px_rgba(147,51,234,0.08)]">
        {activeTab === "planner" && (
          <StudyPlanner plannerData={workspaceData.planner} />
        )}
        {activeTab === "quiz" && (
          <QuizDashboard quizData={workspaceData.quiz} />
        )}

        {activeTab === "chat" && (
          <VideoChat videoId={workspaceData.video_id} />
        )}
      </div>
    </div>
  ) : (
    /* Empty Prompt Invitation Slate */
    <div className="text-center py-20 border-2 border-dashed border-purple-500/20 rounded-2xl bg-[#11111a]/60 shadow-[0_0_40px_rgba(168,85,247,0.08)]">
      <h3 className="text-xl font-semibold text-purple-300 mt-4 mb-2">
        Your Workspace is Ready
      </h3>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto">
        Input a video file link above to automatically index context vectors and run evaluation assessments.
      </p>
    </div>
  )}
</div>
  );
}