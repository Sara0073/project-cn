document.addEventListener('DOMContentLoaded', () => {
  const faceBtn = document.getElementById('face-recognition-btn');
  const touchBtn = document.getElementById('touch-id-btn');
  const facePreview = document.getElementById('face-preview');
  const biometricStatus = document.getElementById('biometric-status');
  const sendLinkBtn = document.getElementById('send-link-btn');
  const linkStatus = document.getElementById('link-status');
  const historyCard = document.getElementById('history-card');
  const resumeBtn = document.getElementById('resume-learning-btn');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const disabilityInputs = document.querySelectorAll('input[name="disability"]');

  if (faceBtn) {
    faceBtn.addEventListener('click', () => {
      biometricStatus.textContent = 'Opening camera...';
      facePreview.style.display = 'flex';
      facePreview.textContent = 'Camera Feed Placeholder';
      setTimeout(() => {
        biometricStatus.textContent = 'Face recognized. Welcome back!';
        showHistory();
      }, 1800);
    });
  }

  if (touchBtn) {
    touchBtn.addEventListener('click', () => {
      biometricStatus.textContent = 'Touch ID verification...';
      setTimeout(() => {
        biometricStatus.textContent = Math.random() > 0.25 ? 'Touch ID Verified!' : 'Touch ID Failed. Try again.';
        if (Math.random() > 0.25) showHistory();
      }, 1200);
    });
  }

  function showHistory() {
    historyCard.style.display = 'block';
  }

  if (sendLinkBtn) {
    sendLinkBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim() || 'Guest';
      const email = emailInput.value.trim();
      let disability = 'dyspraxia';
      const checked = Array.from(disabilityInputs).find(i => i.checked);
      if (checked) disability = checked.value;

      if (!email) {
        linkStatus.textContent = 'Please enter an email.';
        return;
      }

      linkStatus.style.color = '#555';
      linkStatus.textContent = 'Sending magic link...';

      try {
        const resp = await fetch('/send_login_link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, disability })
        });
        const data = await resp.json();
        if (data.success) {
          linkStatus.style.color = 'green';
          linkStatus.textContent = data.message;
          // Optionally show history on success
          showHistory();
        } else {
          linkStatus.style.color = 'red';
          linkStatus.textContent = data.message || 'Failed to send link.';
        }
      } catch (e) {
        linkStatus.style.color = 'red';
        linkStatus.textContent = 'Error sending link.';
      }
    });
  }
});