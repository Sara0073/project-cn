document.addEventListener('DOMContentLoaded', () => {
  const output = document.getElementById('ai-output');
  const cmdInput = document.getElementById('nlp-command');
  const sendBtn = document.getElementById('send-command-btn');
  const mindmapEl = document.getElementById('mindmap-container');
  const goalInput = document.getElementById('goal-input');
  const breakdownBtn = document.getElementById('breakdown-goal-btn');
  const breakdownResult = document.getElementById('breakdown-result');

  if (sendBtn) {
    sendBtn.addEventListener('click', async () => {
      const command = (cmdInput.value || '').trim();
      if (!command) return;
      output.innerHTML += `<div><strong>You:</strong> ${command}</div>`;

      try {
        const res = await fetch('/ai_command', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ command })
        });
        const data = await res.json();
        output.innerHTML += `<div><strong>AI:</strong> ${data.response}</div>`;
        // Optional: auto-scroll
        output.scrollTop = output.scrollHeight;
      } catch (e) {
        output.innerHTML += `<div><strong>AI:</strong> Error processing command.</div>`;
      }
      cmdInput.value = '';
    });
  }

  // Mind map placeholder: you would wire in a real library here
  // For now we just show a simple console log
  if (mindmapEl) {
    mindmapEl.setAttribute('aria-label', 'Mind map placeholder');
  }

  if (breakdownBtn) {
    breakdownBtn.addEventListener('click', async () => {
      const goal = (goalInput.value || '').trim();
      if (!goal) return;
      breakdownResult.textContent = 'Breaking down...';
      try {
        const resp = await fetch('/breakdown_goal', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ goal })
        });
        const data = await resp.json();
        breakdownResult.innerHTML = `<ul>${(data.tasks || []).map(t => `<li>${t}</li>`).join('')}</ul>`;
      } catch (e) {
        breakdownResult.textContent = 'Error breaking down goal.';
      }
    });
  }
});