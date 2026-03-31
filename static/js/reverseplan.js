document.addEventListener('DOMContentLoaded', () => {
  const finalGoalInput = document.getElementById('final-goal');
  const targetDateInput = document.getElementById('target-date');
  const createBtn = document.getElementById('create-plan-btn');
  const planOutput = document.getElementById('plan-output');

  if (createBtn) {
    createBtn.addEventListener('click', async () => {
      const goal = finalGoalInput.value.trim();
      const date = targetDateInput.value;
      if (!goal || !date) {
        planOutput.innerHTML = '<p>Please provide both a final goal and a target date.</p>';
        return;
      }

      planOutput.innerHTML = '<p>Generating reverse plan…</p>';
      try {
        const resp = await fetch('/generate_reverse_plan', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ goal, target_date: date })
        });
        const data = await resp.json();
        if (data.success) {
          const plan = data.plan;
          let html = `<h3>${plan.final_goal}</h3>`;
          html += `<p>Target date: ${plan.target_date}</p><ul>`;
          plan.milestones.forEach(m => {
            html += `<li><strong>${m.name} (${m.date})</strong><ul>${m.tasks.map(t => `<li>${t}</li>`).join('')}</ul></li>`;
          });
          html += '</ul>';
          planOutput.innerHTML = html;
        } else {
          planOutput.innerHTML = `<p>Error: ${data.message}</p>`;
        }
      } catch (e) {
        planOutput.innerHTML = '<p>Error generating plan.</p>';
      }
    });
  }
});