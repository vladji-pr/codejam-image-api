
import Netlify from '../../node_modules/netlify-auth-providers/lib/netlify';

export default function authentification() {
  const loginBtn = document.querySelector('.login');
  const outputText = document.querySelector('.login-output');

  loginBtn.addEventListener('click', () => {
    const auth = new Netlify({});

    const req = auth.authenticate({ provider: 'github', scope: 'user' }, (err, data) => {
      if (err) {
        outputText.innerText = `Error Authenticating with GitHub: ${err}`;
      } else {
        outputText.innerText = `Authenticated with GitHub. Access Token: ${data.token}`;
      }
    });
    console.log('req', req);
  });
}
