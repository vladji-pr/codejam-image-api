
import Netlify from '../../node_modules/netlify-auth-providers/lib/netlify';

export default function authentification() {
  const loginBtn = document.querySelector('.login');
  const outputText = document.querySelector('.login-output');

  const request = async (dataToken) => {
    const resp = await fetch('https://api.github.com/user',
      {
        method: 'GET',
        headers: {
          Authorization: `token ${dataToken}`,
        },
      });
    console.log('resp', resp);
  }

  loginBtn.addEventListener('click', () => {
    const auth = new Netlify({});

    auth.authenticate({ provider: 'github', scope: 'user' }, (err, data) => {
      if (err) {
        outputText.innerText = `Error Authenticating with GitHub: ${err}`;
      } else {
        // outputText.innerText = `Authenticated with GitHub. Access Token: ${data.token}`;
        console.log('data.token', data.token);
        console.log('data', data);
        request(data.token);
      }
    });
  });
}
