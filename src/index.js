import { fetchImage } from './js/api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  timeout: 5000,
  clickToClose: true,
  cssAnimationStyle: 'from-bottom',
  width: '400px',
  fontSize: '18px',
});

const btnLoad = document.querySelector('.load-more');
const select = document.querySelector('#search-form');
const galleryPlace = document.querySelector('.gallery');
const upBtn = document.querySelector('.scrollToTopBtn');

let q = '';
let page = 1;
const perPage = 40;

const mainClassReplace = (btn, mainClass) => {
  btn.classList.replace(mainClass, 'is-hidden');
};
const isHiddenReplace = (btn, mainClass) => {
  btn.classList.replace('is-hidden', mainClass);
};
mainClassReplace(btnLoad, 'load-more');
mainClassReplace(upBtn, 'scrollToTopBtn');

const searchImage = e => {
  e.preventDefault();
  galleryPlace.innerHTML = '';
  const searchTexte = e.currentTarget.elements.searchQuery.value;
  q = searchTexte.trim().toLowerCase().split(' ').join('+');
  if (q === '') {
    Notiflix.Notify.failure('Please, enter your request');
    return;
  }
  fetchImage(q, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        mainClassReplace(btnLoad, 'load-more');
        mainClassReplace(upBtn, 'scrollToTopBtn');
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (data.totalHits < perPage) {
        markup(data.hits);
        mainClassReplace(btnLoad, 'load-more');
        mainClassReplace(upBtn, 'scrollToTopBtn');
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        markup(data.hits);
        isHiddenReplace(btnLoad, 'load-more');
      }
    })
    .catch(onError)
    .finally(e.currentTarget.reset());
};

const loadMore = () => {
  page++;
  fetchImage(q, page)
    .then(data => {
      const numberOfPages = Math.ceil(data.totalHits / perPage);
      markup(data.hits);
      if (numberOfPages === page) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        mainClassReplace(btnLoad, 'load-more');
        btnLoad.removeEventListener('click', loadMore);
      }
    })
    .catch(error => onError(error));
};

const markup = results => {
  const arr = results
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
  galleryPlace.insertAdjacentHTML('beforeend', arr);
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
};

const onError = () => {
  Notiflix.Notify.failure(
    `'Oops! Something went wrong! Try reloading the page!'`
  );
};

const toUp = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

window.addEventListener('scroll', () => {
  isHiddenReplace(upBtn, 'scrollToTopBtn');
});
upBtn.addEventListener('click', toUp);
btnLoad.addEventListener('click', loadMore);
select.addEventListener('submit', searchImage);
