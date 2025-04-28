const sheets = "sheets3.csv";


const banniereTexte = document.getElementById('banniereTexte');

const clone = banniereTexte.cloneNode(true);
banniereTexte.parentNode.appendChild(clone);

let position = 0;
const vitesse = 1.5;

function defiler() {
  position -= vitesse;
  banniereTexte.style.transform = `translateX(${position}px)`;
  clone.style.transform = `translateX(${position + banniereTexte.scrollWidth}px)`;

  if (position <= -banniereTexte.scrollWidth) {
    position = 0;
  }

  requestAnimationFrame(defiler);
}

defiler();


const response = await fetch(sheets);
const csvText = await response.text();


const nameElement = document.getElementById('name');


nameElement.addEventListener('mouseover', () => {
  nameElement.classList.add('blink');
});


nameElement.addEventListener('mouseleave', () => {
  nameElement.classList.remove('blink');
});

const sanitizeName = (name) => {
  const accentsMap = new Map([ ['á', 'a'], ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['ã', 'a'], ['å', 'a'], ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'], ['í', 'i'], ['ì', 'i'], ['î', 'i'], ['ï', 'i'], ['ó', 'o'], ['ò', 'o'], ['ô', 'o'], ['ö', 'o'], ['õ', 'o'], ['ø', 'o'], ['ú', 'u'], ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ý', 'y'], ['ÿ', 'y'], ['ñ', 'n'], ['ç', 'c'] ]);
  let sanitized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  sanitized = Array.from(sanitized).map(char => accentsMap.get(char) || char).join('');
  return sanitized.replace(/[^A-Za-z0-9_\-]/g, '_');
};


/**
 * Convertit une chaîne CSV en objet JSON en utilisant ES6
 * @param {string} csvString - La chaîne CSV à convertir
 * @returns {Array} - Tableau d'objets représentant les données CSV
 */
const csvToJson = (csvString) => {
  try {
    const lines = [];
    let currentLine = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvString.length; i++) {
      const char = csvString[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
        currentLine += char;
      } else if (char === '\n' && !insideQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '') continue;
      
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      values.push(currentValue);
      
      const obj = {};
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        value = value.replace(/\r/g, '');

        if (value.includes('\n')) {
          value = value.split('\n').map(line => `<p>${line.trim()}</p>`).join('');
        }
        
        obj[header] = value;
      });
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la conversion CSV en JSON:", error);
    return [];
  }
};




const bgColors = ["transparent"];

const json = csvToJson(csvText);
console.log(json);

const $projets = document.querySelector(".projets");

const addBlinkEffect = (imgElement) => {
  imgElement.classList.add('blink');
}

const removeBlinkEffect = (imgElement) => {
  imgElement.classList.remove('blink');
}


const addGrowEffect = (imgElement) => {
  imgElement.classList.add('img-hover');
}


const removeGrowEffect = (imgElement) => {
  imgElement.classList.remove('img-hover');
}

const logo = document.createElement('img');
logo.src = 'logo.jpg';
logo.alt = 'Logo';
logo.style.position = 'fixed';
logo.style.top = '50px'; 
logo.style.left = '50px'; 
logo.style.width = '100px'; 
logo.style.height = 'auto';
logo.style.zIndex = '1000'; 


logo.addEventListener('mouseover', () => {
  logo.style.filter = 'invert(100%)';
  logo.style.transition = 'filter 0.5s ease'; 
});


logo.addEventListener('mouseleave', () => {
  logo.style.filter = 'invert(0%)';
});



logo.addEventListener('click', () => {
  window.location.href = 'a-propos.html';
});

document.body.appendChild(logo);

let vitesseX = 2; 
let vitesseY = 2; 

function deplacerLogo() {
  const rect = logo.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  
  if (rect.left <= 0 || rect.right >= screenWidth) {
    vitesseX = -vitesseX;
  }

  
  if (rect.top <= 0 || rect.bottom >= screenHeight) {
    vitesseY = -vitesseY;
  }

  
  logo.style.left = (rect.left + vitesseX) + 'px';
  logo.style.top = (rect.top + vitesseY) + 'px';

  requestAnimationFrame(deplacerLogo);
}


deplacerLogo();

// parcourir le json et créer les éléments
json.forEach((item) => {
  const div = document.createElement("div");
  $projets.appendChild(div);
  gsap.set(div,{backgroundColor: e => gsap.utils.random(bgColors)});
  gsap.from(div, {
    x: e=> gsap.utils.random(-1000,1000),
    y : e  => gsap.utils.random(-1000,-20),
    opacity:0, duration: 0.5 });

  const img = document.createElement("img");
  img.src = `img/${sanitizeName(item.titre)}.jpg`;
  div.appendChild(img);

 addBlinkEffect(img);

   
   img.addEventListener('mouseover', () => {
    removeBlinkEffect(img);  
    addGrowEffect(img);      
  });


  img.addEventListener('mouseleave', () => {
    addBlinkEffect(img);      
    removeGrowEffect(img);    
  });

  const titre = document.createElement("h1");
  titre.textContent = item.titre;
  div.appendChild(titre);

  const categories = document.createElement("div");
  categories.textContent = item.catégories;
  div.appendChild(categories);

  const description = document.createElement("p");
  description.textContent = item.description;
  div.appendChild(description);

  div.addEventListener("click", () => {
    const header = document.querySelector("header");
    header.classList.add("fixed");

    const projets = document.querySelector(".projets");
    projets.classList.add("fixed");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    const wrap = document.createElement("div");
    wrap.classList.add("wrap");
    overlay.appendChild(wrap);

    const fiche = document.createElement("div");
    fiche.classList.add("fiche");
    wrap.appendChild(fiche);

    const close = document.createElement("div");
    close.textContent = "×";
    close.classList.add("close");
    overlay.appendChild(close);

    close.addEventListener("click", () => {
      gsap.to(overlay, {opacity: 0, duration: 1, onComplete: () => overlay.remove()});
      header.classList.remove("fixed");
      projets.classList.remove("fixed");
    });

    const img = document.createElement("img");
    img.src = `img/${sanitizeName(item.titre)}.jpg`;
    fiche.appendChild(img);

    const titre = document.createElement("h1");
    titre.textContent = item.titre;
    fiche.appendChild(titre);

    const desc = document.createElement("div");
    desc.innerHTML = item.modale;
    fiche.appendChild(desc);

    if (item.images !== "") {
      const images = item.images.split(","); 
      const gallery = document.createElement("div");
      gallery.classList.add("gallery");
    
      
      console.log("Images:", images);
    
      images.forEach((image) => {
        const imgElement = document.createElement("img");
        const name = sanitizeName(item.titre);
        const imagePath = `img/${name}/${image.trim()}`; 
    
        
        console.log("Image Path:", imagePath);
    
        imgElement.src = imagePath;
    
        
        imgElement.onload = () => {
          console.log("Image loaded successfully:", imagePath);
        };
        imgElement.onerror = () => {
          console.error("Image not found:", imagePath);
        };
    
        gallery.appendChild(imgElement);
      });
      fiche.appendChild(gallery);
    }
  
    gsap.from(overlay, {opacity: 0, duration: 0.4});
  });

  

});

