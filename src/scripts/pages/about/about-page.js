export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <p>Kami percaya bahwa setiap orang memiliki cerita unik yang layak didengar. Platform ini dibuat sebagai wadah bagi siapa saja untuk dengan mudah berbagi pengalaman, pemikiran, dan cerita mereka, baik itu kisah yang dibuat sendiri (fiksi) atau kejadian nyata.
        Kami memiliki visi untuk menjadikan ruang daring yang paling suportif dan inklusif untuk bertukar cerita dan inspirasi.<p>
      </section>

      
    <section class="about-page container">

    `;
  }
  async afterRender() {
   
  }
}
