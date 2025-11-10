import Api from '../../data/api.js';

export default class LoginPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Masuk</h1>
        <form id="loginForm">
          <input id="emailLogin" type="email" placeholder="Email" required>
          <input id="passwordLogin" type="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById("loginForm").addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('emailLogin').value;
      const password = document.getElementById('passwordLogin').value;

      const result = await Api.login({ email, password });
      if (!result.error) {
        alert('Login Berhasil');
        window.location.hash = '/';
      } else {
        alert(result.message);
      }
    });
  }
}
