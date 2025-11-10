import Api from '../../data/api'; 

export default class AddStoryPage {
  async render() {
    return `
      <section class="add-story-page container" aria-labelledby="add-story-title">
        <h1 id="add-story-title">Tambah Cerita Baru</h1>

        <div class="add-story-grid">
          <form id="addStoryForm" class="story-form" enctype="multipart/form-data" aria-describedby="form-desc">
            <p id="form-desc" class="sr-only">Form untuk menambahkan cerita baru, isi deskripsi, pilih foto, lalu klik peta untuk memilih lokasi (opsional).</p>

            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" required></textarea>

            <label for="photo">Foto (max 1MB)</label>
            <input id="photo" name="photo" type="file" accept="image/*" required />

            <div class="coords">
              <label for="lat">Latitude (klik peta)</label>
              <input id="lat" name="lat" type="text" readonly aria-readonly="true" placeholder="Klik peta untuk mendapatkan latitude" />

              <label for="lon">Longitude (klik peta)</label>
              <input id="lon" name="lon" type="text" readonly aria-readonly="true" placeholder="Klik peta untuk mendapatkan longitude" />
            </div>

            <div class="form-actions">
              <button id="submitBtn" type="submit">Kirim Cerita</button>
              <button id="cancelBtn" type="button">Batal</button>
            </div>

            <div id="formMessage" role="status" aria-live="polite"></div>
          </form>

          <div class="map-column">
            <h2 class="visually-hidden" id="mapTitle">Pilih lokasi di peta</h2>
            <div id="storyMap" style="height:400px;"></div>
            <p class="hint">Klik peta untuk memilih koordinat (opsional). Klik lagi untuk memindahkan marker.</p>

            <div id="preview" aria-hidden="true"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('addStoryForm');
    const photoInput = document.getElementById('photo');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formMessage = document.getElementById('formMessage');
    const preview = document.getElementById('preview');

    const map = L.map('storyMap').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let selectedMarker = null;
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);

      if (selectedMarker) {
        selectedMarker.setLatLng([lat, lng]);
      } else {
        selectedMarker = L.marker([lat, lng]).addTo(map);
      }
    });

    photoInput.addEventListener('change', () => {
      preview.innerHTML = '';
      const file = photoInput.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        formMessage.textContent = 'File harus berupa gambar.';
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        formMessage.textContent = 'Ukuran file maksimal 1 MB.';
        return;
      }
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      preview.appendChild(img);
      formMessage.textContent = '';
    });

    cancelBtn.addEventListener('click', () => {
      window.location.hash = '/';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formMessage.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      const description = document.getElementById('description').value.trim();
      const photo = photoInput.files[0];
      const lat = latInput.value || undefined;
      const lon = lonInput.value || undefined;

      if (!description) {
        formMessage.textContent = 'Deskripsi wajib diisi.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
        return;
      }

      if (!photo) {
        formMessage.textContent = 'Foto wajib dipilih.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
        return;
      }

      if (!photo.type.startsWith('image/')) {
        formMessage.textContent = 'File harus berupa gambar.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
        return;
      }

      if (photo.size > 1 * 1024 * 1024) {
        formMessage.textContent = 'Ukuran file maksimal 1 MB.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
        return;
      }
      
      try {
        const result = await Api.addStory({ description, photo, lat, lon });

        if (!result.error) {
          formMessage.textContent = 'Berhasil menambahkan cerita.';
          
          window.location.hash = '/';
        } else {
          formMessage.textContent = result.message || 'Gagal menambahkan cerita.';
        }
      } catch (err) {
        formMessage.textContent = 'Terjadi kesalahan jaringan.';
        console.error(err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Cerita';
      }
    });
  }
}
