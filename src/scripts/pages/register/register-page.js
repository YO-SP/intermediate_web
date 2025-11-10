import Api from '../../data/api.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="auth-container">
        <h1>Daftar</h1>
        <form id="registerForm">
          <input id="nameRegister" type="text" placeholder="Nama" required>
          <input id="emailRegister" type="email" placeholder="Email" required>
          <input id="passwordRegister" type="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    document.getElementById("registerForm").addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById("nameRegister").value;
      const email = document.getElementById("emailRegister").value;
      const password = document.getElementById("passwordRegister").value;

      const result = await Api.register({ name, email, password });
      if (!result.error) {
        alert('Register Berhasil');
        window.location.hash = '/login';
      } else {
        alert(result.message);
      }
    });
  }
}
