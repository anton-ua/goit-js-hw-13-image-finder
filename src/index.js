import './styles.css';
import services from './js/services';

services.refs.loadMore.style.display = 'none';

services.refs.searchForm.addEventListener('submit', services.handleSubmit);
services.refs.loadMore.addEventListener('click', services.loadMore);
services.refs.gallery.addEventListener('click', services.lightBox);
