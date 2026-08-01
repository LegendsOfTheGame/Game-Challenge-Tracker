import React, { useState } from 'react';


function ChallengeForm({ onSubmit, onCancel }) {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text && target) {
      onSubmit({
        text,
        target: parseInt(target),
        mode,
        unit: 'progress'
      });
    }
  };

  return (
    <div className="challenge-form">
      <h3>Add New Challenge</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Challenge Description:</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Deal 1000 damage with ordnance"
            required
          />
        </div>

        <div className="form-group">
          <label>Target Amount:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g., 1000"
            required
          />
        </div>

        <div className="form-group">
          <label>Mode:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="All">All Modes</option>
            <option value="BR">BR Only</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Challenge</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ChallengeForm;
