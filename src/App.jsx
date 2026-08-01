import React, { useState, useEffect } from "react";
import ChallengeCard from "./components/ChallengeCard";
import ChallengeForm from "./components/ChallengeForm";
import "./App.css";

// localStorage key
const STORAGE_KEY = "apexTracker.challenges.v1";

const loadChallenges = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveChallenges = (challenges) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
};

// simple id helper
const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function App() {
  // "apex" | "ow2" | "settings"
  const [activeTab, setActiveTab] = useState("apex");

  // all games share one challenge list; we filter per game
  const [challenges, setChallenges] = useState([]);

  // sidebar selection
  const [selectedBucket, setSelectedBucket] = useState("daily"); // "daily" | "weekly"
  const [selectedWeekId, setSelectedWeekId] = useState("Week 1");

  // dynamic weeks per game
  const [weeksByGame, setWeeksByGame] = useState({
    apex: ["Week 1"],
    ow2: ["Week 1"],
  });

  useEffect(() => {
    const loaded = loadChallenges();
    setChallenges(loaded);
  }, []);

  const persistChallenges = (next) => {
    setChallenges(next);
    saveChallenges(next);
  };

  const handleAddChallenge = (data) => {
    if (activeTab === "settings") return; // no-op

    const game = activeTab; // "apex" or "ow2"
    const newChallenge = {
      id: generateId(),
      game,                      // which game this belongs to
      bucket: selectedBucket,    // "daily" or "weekly"
      weekId:
        selectedBucket === "weekly" ? selectedWeekId : null,
      text: data.text,
      mode: data.mode || null,
      current: 0,
      target: Number(data.target) || 1,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    persistChallenges([...challenges, newChallenge]);
  };

  const handleUpdateProgress = (challengeId, newValue) => {
    const next = challenges.map((c) =>
      c.id === challengeId
        ? { ...c, current: Math.min(newValue, c.target) }
        : c
    );
    persistChallenges(next);
  };

  const handleToggleComplete = (challengeId) => {
    const next = challenges.map((c) =>
      c.id === challengeId
        ? {
            ...c,
            completed: !c.completed,
            completedAt: !c.completed
              ? new Date().toISOString()
              : null,
          }
        : c
    );
    persistChallenges(next);
  };

  const handleDeleteChallenge = (challengeId) => {
    const next = challenges.filter((c) => c.id !== challengeId);
    persistChallenges(next);
  };

  const handleAddWeek = () => {
    const game = activeTab;
    if (game === "settings") return;

    setWeeksByGame((prev) => {
      const currentWeeks = prev[game] || [];
      const nextNumber = currentWeeks.length + 1;
      const name = `Week ${nextNumber}`;
      return {
        ...prev,
        [game]: [...currentWeeks, name],
      };
    });

    setSelectedBucket("weekly");
    setSelectedWeekId((prevId) => prevId || "Week 1");
  };

  // derive weeks for active game
  const activeWeeks = weeksByGame[activeTab] || [];

  // filter visible challenges
  const visibleChallenges = challenges.filter((c) => {
    if (c.game !== activeTab) return false;
    if (selectedBucket === "daily") {
      return c.bucket === "daily";
    }
    return c.bucket === "weekly" && c.weekId === selectedWeekId;
  });

  const completedCount = visibleChallenges.filter((c) => c.completed).length;
  const totalCount = visibleChallenges.length;
  const completionPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="app">
      <div className="container">
        {/* Top nav tabs */}
        <nav className="top-nav">
          <button
            className={activeTab === "apex" ? "tab active" : "tab"}
            onClick={() => setActiveTab("apex")}
          >
            Apex Legends
          </button>
          <button
            className={activeTab === "ow2" ? "tab active" : "tab"}
            onClick={() => setActiveTab("ow2")}
          >
            Overwatch 2
          </button>
          <button
            className={activeTab === "settings" ? "tab active" : "tab"}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </nav>

        {/* Settings tab – placeholder */}
        {activeTab === "settings" ? (
          <div className="settings-panel">
            <h2>Settings</h2>
            <p>Settings coming later.</p>
          </div>
        ) : (
          <div className="main-layout">
            {/* Left sidebar: Daily + Weeks */}
            <aside className="sidebar">
              <h3>{activeTab === "apex" ? "Apex" : "OW2"} Challenges</h3>
              <ul className="sidebar-list">
                <li
                  className={
                    selectedBucket === "daily" ? "sidebar-item active" : "sidebar-item"
                  }
                  onClick={() => {
                    setSelectedBucket("daily");
                    setSelectedWeekId(null);
                  }}
                >
                  Daily
                </li>

                {activeWeeks.map((week) => (
                  <li
                    key={week}
                    className={
                      selectedBucket === "weekly" && selectedWeekId === week
                        ? "sidebar-item active"
                        : "sidebar-item"
                    }
                    onClick={() => {
                      setSelectedBucket("weekly");
                      setSelectedWeekId(week);
                    }}
                  >
                    {week}
                  </li>
                ))}

                <li className="sidebar-item add-week" onClick={handleAddWeek}>
                  + Add Week
                </li>
              </ul>
            </aside>

            {/* Right: summary + controls + list */}
            <section className="content">
              <header className="header">
                <h1>Apex Challenge Tracker</h1>
                <div className="progress-summary">
                  <span>
                    Progress: {completedCount}/{totalCount} ({completionPercent}
                    %)
                  </span>
                </div>
              </header>

              <div className="actions">
                <ChallengeForm
                  onSubmit={handleAddChallenge}
                  onCancel={() => {}}
                />
              </div>

              <div className="challenges-list">
                {visibleChallenges.length === 0 ? (
                  <div className="empty-state">
                    <p>No challenges yet. Add one above.</p>
                  </div>
                ) : (
                  visibleChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onUpdateProgress={handleUpdateProgress}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteChallenge}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
