export default class Logout {
  async render() {
    return `
      <section class="logout-container">
        <h1>Keluar dari Akun</h1>
        <p>Apakah kamu yakin ingin logout?</p>
        <button id="confirmLogout" class="btn-logout">Logout</button>
      </section>
    `;
  }

  async afterRender() {
    const btnLogout = document.getElementById('confirmLogout');
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');

      alert('Logout berhasil!');
      window.location.hash = '/login';
    });
  }
}
