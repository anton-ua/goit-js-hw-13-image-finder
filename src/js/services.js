import axios from 'axios';
import imageTemplate from '../template/image.hbs';
import PNotify from '../../node_modules/pnotify/dist/es/PNotify';
import '../../node_modules/pnotify/dist/PNotifyBrightTheme.css';
import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';

class Services {
  constructor() {
    this.baseUrl = 'https://pixabay.com/api/';
    this.key = '15526062-e3b1fa36c29391c170e7a5624';
    this.searchWord = '';
    this.page = 1;
  }

  refs = {
    searchForm: document.querySelector('#search-form'),
    input: document.querySelector('.input'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.loadMore'),
  };

  async fetchCards(value) {
    const data = await axios
      .get(
        `${this.baseUrl}?image_type=photo&orientation=horizontal&key=${this.key}&q=${value}&&page=${this.page}&per_page=12`,
      )
      .then(res => {
        if (!res.data.hits.length) {
          throw 'Please, enter a correct word';
        }
        return res.data.hits;
      })
      .catch(err => {
        PNotify.error({
          text: err,
        });
      });
    if (!data) {
      return;
    }
    const res = data.map(elem => imageTemplate(elem)).join(' ');
    this.refs.gallery.insertAdjacentHTML('beforeend', res);
    this.refs.loadMore.style.display = 'block';
  }

  handleSubmit = e => {
    e.preventDefault();
    this.refs.gallery.innerHTML = '';
    this.page = 1;
    this.refs.loadMore.style.display = 'none';

    const formData = new FormData(e.target);
    formData.forEach(async value => {
      if (value.length < 1) {
        return;
      }
      this.searchWord = value;
      await this.fetchCards(this.searchWord);
    });
  };

  loadMore = async () => {
    this.page += 1;
    await this.fetchCards(this.searchWord);
    window.scrollTo({
      top: window.scrollY + document.documentElement.clientHeight - 100,
      behavior: 'smooth',
    });
  };

  lightBox = e => {
    if (e.target.nodeName !== 'IMG') {
      return;
    }
    basicLightbox.create(`<img width="" src="${e.target.srcset}">`).show();
  };
}

export default new Services();
