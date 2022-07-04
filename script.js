let EnclosedForm = document.querySelector(".search-form");
let searchInput = document.querySelector(".search-input");
let submitBtn = document.querySelector(".submit-btn");
let galleryDiv = document.querySelector(".gallery");
let auth = "563492ad6f91700001000001dd9346d7e8204307bc1cf4609daa54d9";
let moreBtn = document.querySelector('.more');
let scrollupBtn = document.querySelector(".scrollup");
let page = 1;
let fetchLink;
let currentSearch;

moreBtn.addEventListener('click', loadMore);
searchInput.addEventListener('input', updateInput);
EnclosedForm.addEventListener('submit', (e) => {
  e.preventDefault();
  galleryDiv.innerHTML = '';
  searchPhotos(searchValue);
    // console.log(searchValue)
  currentSearch = searchValue;
})

function updateInput(e) {
    searchValue = e.target.value;
    searchValue.trim();
    if (searchValue == ' ') {
        submitBtn.setAttribute('disabled', '');
    } else {
        submitBtn.removeAttribute("disabled", "");
    }
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
      method: "GET",
      headers: {
          Accept: "application/json",
          Authorization: auth
      }
  });
  const data = await dataFetch.json();
  return data;
}

function generatePictures(data) {
  if (data.photos.length == 0) {
    galleryDiv.innerHTML += "<center><h1>No Photos Found !</h1></center>";
  } else {
    data.photos.forEach((img) => {
      const galleryImg = document.createElement("div");
      galleryImg.innerHTML = `<div class="single-img">
            <div>
                <p>Credit: <span class="img-credit">${img.photographer}</span></p>
                <div>
                    <a href="${img.src.original}" target="_blank"><button>View</button></a>
                </div>
            </div>
            <img src="${img.src.large}" alt="">
        </div>`;

      galleryDiv.appendChild(galleryImg);
    });
  }
}


async function getCurated() {

    const data = await fetchApi("https://api.pexels.com/v1/curated?per_page=6&page=1");
    
    generatePictures(data);

}

async function searchPhotos(query) {

  const data = await fetchApi(`https://api.pexels.com/v1/search?query=${query}+query&per_page=6&page=1`);

  generatePictures(data);
  searchInput.value = '';
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=6&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=6&page=${page}`;
  }
  // console.log(page)
  const data = await fetchApi(fetchLink);
  // console.log(data)
  generatePictures(data);
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 167) {
    scrollupBtn.style.display = "flex";
    scrollupBtn.addEventListener('click', () => {
      window.scrollTo(0, 0)
    })
  } else {
    scrollupBtn.style.display = "none";
  }
})


getCurated()