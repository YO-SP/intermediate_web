import AddStoryPage from '../pages/addStory/add-story-page';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page'
import LoginPage from '../pages/login/login-page'; 
import RegisterPage from '../pages/register/register-page'
import Logout from '../pages/logout/logout-page'


const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),           
  '/register': new RegisterPage(),     
  '/add-story': new AddStoryPage(),
  '/logout': new Logout()
};

export default routes;
