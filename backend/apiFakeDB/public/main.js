const { M } = window;
function createContent(id, content) {
  const pretag = document.createElement('pre');
  pretag.textContent = JSON.stringify(content, undefined, 2);
  pretag.onclick = function clickPre() {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = pretag.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('Copy');
      textArea.remove();
      M.toast({ html: 'Copy to Clipboard!', displayLength: 2000, classes: 'green darken-1' });
    } catch (err) {
      M.toast({
        html: '<i class="material-icons">error </i>  Unable to copy to Clipboard!',
        displayLength: 2000,
        classes: 'red lighten-1 left',
      });
    }
  };
  const spantag = document.createElement('span');
  spantag.className = 'dropdown-content';
  spantag.id = id;
  spantag.textContent = 'Click on Json and copy to Clipboard!';
  spantag.appendChild(pretag);
  return spantag;
}

function createIElement(idTarget) {
  const itag = document.createElement('i');
  itag.textContent = 'info';
  itag.className = 'material-icons dropdown-button';
  itag.style = 'color: dodgerblue';
  itag.dataset.target = idTarget;
  itag.dataset.activates = idTarget;
  return itag;
}

const options = {
  hover: true, // Activate on hover
  container: '#resources',
  stopPropagation: true, // Stops event propagation
  constrainWidth: false, // Does not change width of dropdown to that of the activator
  closeOnClick: false,
  /* inDuration: 300,
  outDuration: 225,
  gutter: 0, // Spacing from edge
  belowOrigin: false, // Displays dropdown below the button
  alignment: 'left', // Displays dropdown with edge aligned to the left of button
  draggable: false */
};

(function init() {
  const { axios } = window;
  axios.get('/rutas')
    .then((response) => {
      const div = document.querySelector('#linksUrls');
      response.data.forEach((e) => {
        let tag;
        if (e.method === 'GET') {
          tag = document.createElement('a');
          tag.setAttribute('href', e.path);
          tag.innerText = `${window.location.origin}${e.path}`;
        } else {
          tag = document.createElement('span');
          tag.className = 'spanContainer';
          const id = `dropdown${e.path}`;

          const itag = createIElement(id);
          const ultag = createContent(id, e.parameters);

          tag.innerText = `${window.location.origin}${e.path}   `;
          tag.appendChild(ultag);
          tag.appendChild(itag);
        }
        const liTag = document.createElement('li');
        liTag.innerText = `[${e.method}] ${e.description}:   `;
        div.appendChild(liTag);
        liTag.appendChild(tag);
      });
      const elem = document.querySelectorAll('.dropdown-button');
      M.Dropdown.init(elem, options);
    })

    .catch((error) => {
      console.log(error); // eslint-disable-line no-console
    });
}());
