import Api from '../../data/api';
import { showFormattedDate } from '../../utils';
import { saveStory, getAllStories, deleteStory } from '../../../utils/db';

class HomePage {
  async render() {
    return `
      <section class="home-page container">
        <div>
          <h1>Beranda</h1>
          <h2>Daftar Cerita</h2>
          <div id="storiesContainer"></div>
        </div>

        <aside>
          <h2>Peta Cerita</h2>
          <div id="map" style="height: 500px;"></div>
        </aside>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#storiesContainer');
    let stories = [];

    try {
      const result = await Api.getStories(true);
      if (result.error) throw new Error(result.message);
      stories = result.listStory;

      stories.forEach((story) => saveStory(story));
    } catch (error) {
      console.warn('Gagal mengambil dari API, menampilkan data dari IndexedDB');
      stories = await getAllStories();
    }

    container.innerHTML = '';
    if (!stories.length) {
      container.innerHTML = '<p>Tidak ada cerita tersedia.</p>';
      return;
    }

    stories.forEach((story) => {
      container.innerHTML += `
        <article>
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p><small>Dibuat pada: ${showFormattedDate(story.createdAt)}</small></p>
          <img src="${story.photoUrl || ''}" alt="Foto ${story.name}" width="200">
          <button class="delete-btn" data-id="${story.id}">Hapus</button>
        </article>
      `;
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        await deleteStory(id);
        alert('Cerita dihapus dari IndexedDB');
        window.location.reload();
      });
    });

    this.showMap(stories);
  }

  showMap(stories) {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }
}

export default HomePage;


