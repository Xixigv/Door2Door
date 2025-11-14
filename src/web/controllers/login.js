document.addEventListener('DOMContentLoaded', async () => {
      // Check if user is already logged in
      const session = await auth.checkSession();
      if (session && session.loggedIn) {
        // User already authenticated, redirect to profile
        window.location.href = '/userProfile';
        return;
      }

      // Attach form submit handler
      const form = document.getElementById('loginForm');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn ? btn.innerText : null;
        try {
          if (btn) { btn.disabled = true; btn.innerText = 'Signing in...'; }
          const data = await auth.loginUser(email, password);
          // Fetch session to get role
          const session = await auth.checkSession();
          window.location.href = '/userProfile';
        } catch (err) {
          alert('Login error: ' + (err.message || err));
        } finally {
          if (btn) { btn.disabled = false; if (originalText) btn.innerText = originalText; }
        }
      });
    });