const apiKey = "aFYcYWsKTrTkL7O0QC3DgGYRhlMecTQk";
let limit = Math.round(window.innerWidth / 315) * 5;
limit > 50 ? (limit = 50) : limit;
let offset = 0;
let URL = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${limit}`;

const lastSearch = JSON.parse(localStorage.getItem("Last searches")) || [];

const searchInput = document.querySelector("#input-search");
const listSearch = document.querySelector("#list-search");

const searchPreview = () => {
    listSearch.innerHTML = "";

    lastSearch.map((optionV) => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        const a = document.createElement("a");

        li.className += "element-search";
        img.src = "./img/logo-recent.png";
        a.innerText = optionV;

        li.append(img, a);
        listSearch.insertAdjacentElement("afterbegin", li);
    });

    document.querySelectorAll(".element-search").forEach((element) => {
        element.addEventListener("click", () => {
            searchInput.value = element.lastChild.text;
            newSearch();
        });
    });
};
const newSearch = (e) => {
    e ? e.preventDefault() : 0;

    const search = searchInput.value;

    lastSearch.push(search);
    lastSearch.length > 3 ? lastSearch.shift() : lastSearch;
    localStorage.setItem("Last searches", JSON.stringify(lastSearch));
    searchPreview();

    document.querySelector("#main-section").innerHTML = "";
    offset = 0;
    URL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=${limit}&q=${search}&lang=es`;
    principalFunction();
};

const newGIFS = (data) => {
    data.map((gif) => {
        let newGif = `<article class = \"GIF\">
            <div class="GIF-title-div">
                <a href="${gif.url}">${gif.title}</a>
            </div>
            <div class="GIF-image-div">
                <a href="${gif.url}">
                    <img src="${gif.images.original.url}">
                </a>
            </div>
            <div class=\"GIF-user-div\">`;
        if (gif.user) {
            newGif += `<a href="${gif.user.profile_url}" target="_blank">
                    <img src="${gif.user.avatar_url}" alt="user avatar">
                    <p>${gif.username}</p>
                </a>   
                <div>`;
            if (gif.user.website_url) {
                newGif += `<a href="${gif.user.website_url}" target="_blank">
                        <img src="../img/logotipo-web.png" alt="web page">
                    </a>`;
            }
            if (gif.user.instagram_url) {
                newGif += `<a href="${gif.user.instagram_url}" target="_blank">
                        <img src="../img/logotipo-de-instagram.png" alt="instagram">
                    </a>`;
            }
        }
        newGif += `  
                </div>
            </div>
        </article>`;
        document.querySelector("#main-section").innerHTML += newGif;
    });
};
const consumeGIFS = async (url) => {
    try {
        const response = await fetch(`${url}&offset=${offset}`);
        offset += limit;
        const { data } = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
};

const inViewPort = ([e]) => {
    const { isIntersecting } = e;
    if (isIntersecting) {
        principalFunction();
    }
};
const getObserver = (node) => {
    observer.observe(node);
};
const principalFunction = async () => {
    const response = await consumeGIFS(URL);
    newGIFS(response);

    const lastImage = document.querySelector("#main-section").lastChild;
    getObserver(lastImage);
};

const pageLoad = () => {
    searchInput.addEventListener("input", () => {
        document.querySelector("#search-btn").disabled = searchInput.value
            ? false
            : true;
    });
    searchInput.addEventListener("focus", () => {
        document.querySelector(".search-list").style.opacity = 100;
    });
    searchInput.addEventListener("blur", () => {
        document.querySelector(".search-list").style.opacity = 0;
    });

    document
        .querySelector("#form-search")
        .addEventListener("submit", newSearch);

    searchPreview();
    principalFunction();
};
const observer = new IntersectionObserver(inViewPort);
window.addEventListener("load", pageLoad);
