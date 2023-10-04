import { fetchImage } from './js/api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

const btnLoad = document.querySelector('.load-more')
const select = document.querySelector('#search-form');
const galleryPlace = document.querySelector('.gallery');
console.log(select);
let q = '';



btnLoad.classList.replace('load-more', 'is-hidden');

const searchImage = e => {
    e.preventDefault();
    let page = 1;
  const searchTexte = e.currentTarget.elements.searchQuery.value    ;
    q = searchTexte.trim().toLowerCase().split(' ').join('+');
    fetchImage(q, page).then(data => { 
        if (q === '') {
            Notiflix.Notify.failure('Please');
            return
        }
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        markup(data.hits);

    }).catch(error=> console.log(error))
};


const markup = (results) => {
    const arr = results.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
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
</div></a>`
    }).join('');
    galleryPlace.insertAdjacentHTML('afterbegin', arr);
    const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay:250,
});
}
    
select.addEventListener('submit', searchImage);