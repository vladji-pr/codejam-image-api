
import Netlify from '../../node_modules/netlify-auth-providers/lib/netlify';

export default function authentification() {
  const loginBtn = document.querySelector('.login');
  const outputText = document.querySelector('.login-output');
  const header = document.querySelector('.header');

  const showInfo = (name, ava) => {
    loginBtn.hidden = true;
    const infoWrap = document.createElement('div');
    const nameBlock = document.createElement('p');
    const avaBlock = document.createElement('img');

    infoWrap.classList.add('infoWrap');
    avaBlock.classList.add('user-ava');

    nameBlock.innerHTML = `Hello, ${name}`;
    avaBlock.src = ava;
    avaBlock.alt = `${name} avatar`;

    infoWrap.append(nameBlock, avaBlock);
    header.append(infoWrap);
  };

  const request = async (dataToken) => {
    const resp = await fetch('https://api.github.com/user',
      {
        method: 'GET',
        headers: {
          Authorization: `token ${dataToken}`,
        },
      });
    const userData = await resp.json();
    console.log('userData', userData);
    const userName = userData.name;
    const userAva = userData.avatar_url;

    showInfo(userName, userAva);
  };

  loginBtn.addEventListener('click', () => {
    const auth = new Netlify({});

    auth.authenticate({ provider: 'github', scope: 'user' }, (err, data) => {
      if (err) {
        outputText.innerText = `Error Authenticating with GitHub: ${err}`;
      } else {
        request(data.token);
      }
    });
  });
}
