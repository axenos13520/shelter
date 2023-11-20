let petsInfoDictionaries = [];

fetch("./json/pets.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных.');
    }
    return response.json(); 
  })
  .then(data => {
    petsInfoDictionaries = data; 

    cardCount = petsInfoDictionaries.length;

    StartThis();
  })
  .catch(error => {
    console.error(error);
  });

function Clamp(min, max, value)
{
  return Math.max(min, Math.min(max, value));
}

let cardCount = 0;
let carouselCards = [];
let infiniteCarousel = true;

let swipable = true;

let transitionDuration = getComputedStyle(root).getPropertyValue("--carouselAnimationTime").replace('s', '');

let pets = document.querySelector(".pets");
let petsWrapper = document.querySelector(".pets__wrapper");
let petsWrapper2 = document.querySelector(".pets__wrapper2");

function TransformPets()
{
  let state = pets.getAttribute("state");

  ToggleElementState(pets);
  ToggleElementState(petsWrapper);
  ToggleElementState(petsWrapper2);

  if (state == 1)
  {
    
  }
  else
  {
  }
}

function TrySwipeCarousel(delta)
{
  if (swipable)
  {
    SwipeCarousel(delta);

    swipable = false;

    Sleep(transitionDuration).then(() => swipable = true);
  }
}

let swipeDelta = 0;
let currentX = 0;
let xOffset = 0;

function SwipeCarousel(delta)
{
  currentX -= [270, 290, Clamp(830, 990, window.innerWidth * 0.75) / 3][GetAdaptive()] * delta;

  for (let i = 0; i < carouselCards.length; ++i)
    carouselCards[i].style.transform = `translate(${currentX}px)`;

  swipeDelta += delta;

  if (infiniteCarousel && Math.abs(swipeDelta) >= cardCount)
  {
    Sleep(transitionDuration).then(() => {
      currentX = xOffset;
      swipeDelta = 0;
      
      for (let i = 0; i < carouselCards.length; ++i)
      {
        carouselCards[i].style.transitionDuration = "0s";
        carouselCards[i].style.transform = `translate(${currentX}px)`;
      }

      Sleep(0.05).then(() => {
        for (let i = 0; i < carouselCards.length; ++i)
          carouselCards[i].style.transitionDuration = transitionDuration + "s";
      })
    })
  }
}

function GeneratePetCard(index)
{
  let pet = petsInfoDictionaries[index];
  
  // Create a new div element
  
  const div = document.createElement("div");
  div.classList.add("pets__carousel__item");

  // Create a figure element
  const figure = document.createElement("figure");
  figure.classList.add("pets__carousel__figure");

  // Create an image element and set its source and alt attributes
  const img = document.createElement("img");
  img.src = pet.img;
  img.alt = pet.name;
  img.classList.add("pet-img");

  // Create a figcaption element and set its text content
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = pet.name;

  // Append the img and figcaption elements to the figure element
  figure.appendChild(img);
  figure.appendChild(figcaption);

  // Create a button element and set its type and class attributes
  const button = document.createElement("button");
  button.type = "button";
  button.onclick = () => { blackout.setAttribute("state", 1); document.getElementsByClassName("pet-pop-up")[0].setAttribute("state", 1); SetPopUpInfo(index); };
  button.classList.add("pets__carousel__btn");
  button.textContent = "Learn more";

  // Append the figure and button elements to the div element
  div.appendChild(figure);
  div.appendChild(button);

  return div;
}

function InitializeCarousel(carouselDiv, carouselCards, itemsCount)
{
  for (let i = 0; i < itemsCount * 3; ++i)
  {
    petCard = GeneratePetCard(i % itemsCount);
    
    carouselCards.push(petCard);

    carouselDiv.appendChild(petCard);
  }

  xOffset = [270, 290, Clamp(830, 990, window.innerWidth * 0.75) / 3][GetAdaptive()] * -itemsCount;
  currentX = xOffset;

  carouselDiv.style.gridTemplateColumns = "repeat(" + itemsCount * 3 + ", " + ["100", "50", "33.33"][GetAdaptive()] + "%)";
}

let popUpImg = document.getElementsByClassName("pet-pop-up__img")[0];
let popUpTitle = document.getElementsByClassName("pet-pop-up__title")[0];
let popUpSubtitle = document.getElementsByClassName("pet-pop-up__subtitle")[0];
let popUpDescription = document.getElementsByClassName("pet-pop-up__description")[0];
let popUpAge = document.getElementById("age");
let popUpInoculations = document.getElementById("inoculations");
let popUpDiseases= document.getElementById("diseases");
let popUpParasites = document.getElementById("parasites");

function SetPopUpInfo(petIndex)
{
  let pet = petsInfoDictionaries[petIndex];

  popUpImg.src = pet.img;
  popUpTitle.innerHTML = pet.name;
  popUpSubtitle.innerHTML = pet.type + " - " + pet.breed;
  popUpDescription.innerHTML = pet.description;
  popUpAge.innerHTML = pet.age;
  popUpInoculations.innerHTML = pet.inoculations;
  popUpDiseases.innerHTML = pet.diseases;
  popUpParasites.innerHTML = pet.parasites;
}

function StartThis()
{
  let carouselDiv = document.getElementsByClassName("pets__carousel__items")[0];
  
  InitializeCarousel(carouselDiv, carouselCards, cardCount);

  carouselCards.sort(() => Math.random() - 0.5);

  SwipeCarousel(0);
}