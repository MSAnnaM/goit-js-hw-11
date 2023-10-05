import axios from 'axios';

const KEY = '39797585-95f120e70fb7e422bd65b56f5';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImage(q, page, perPage) {
  return await axios
    .get(
      `?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    )
    .then(response => response.data);
}
