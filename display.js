async function getHeroes(){
    const response = await fetch("https://api.opendota.com/api/heroStats");
    return response.json();
}

async function displayByName(){
    const heroes = await getHeroes();
    var output = "";
    const groups = {};
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    heroes.forEach(hero => {
        const letter = hero.localized_name[0].toUpperCase();
        if(!groups[letter]){
            groups[letter] = [];
        }
        groups[letter].push(hero);
    });
    console.log(groups);
    var skipper = "<ul><li><a id='navtitle'>Jump to:</a></li>";
    for(const letter in groups){
        // console.log("beep");
        skipper += `<li><a href="#${letter}">${letter}</a></li>`;
    }
    skipper += "</ul>";
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = skipper;
    // navbar.style.display = 'block';
    for(const letter in groups){
        output += `<section id="${letter}"><div class="divider"><p>${letter}\n</p></div>`;
        groups[letter].forEach(hero => {
            // console.log(hero);
            output += formatOutput(hero);
        });
        output += "</section>"
    }
    const heroContainer = document.getElementById('heroContainer');
    heroContainer.innerHTML = output;
   // heroContainer.style.display = 'flex';
}

async function displayByRole(){
    const heroes = await getHeroes();
    var output = "";
    const groups = {};
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    heroes.forEach(hero => {
        hero.roles.forEach(role => {
            if(!groups[role]){
                groups[role] = [];
            }
            groups[role].push(hero);
        });
    });
    // console.log(groups);
    const roleNames = [];
    for(const role in groups){
        roleNames.push(role);
    }
    roleNames.sort((a, b) => a.localeCompare(b));
    var skipper = "<ul><li><a id='navtitle'>Filter:</a></li>";
    for(const role of roleNames){
        // console.log(`${role}`);
        skipper += `<li><a id="${role}Pointer" href="#" onclick="filterSections('${role}')">${role}</a></li>`;
    }
    skipper += "</ul>";
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = skipper;
    // navbar.style.display = 'block';
    for(const role of roleNames){
        output += `<section id="${role}"><div class="divider"><p>${role}\n</p></div>`;
        groups[role].forEach(hero => {
            // console.log(hero);
            output += formatOutput(hero);
        });
        output += "</section>"
    }
    const heroContainer = document.getElementById('heroContainer');
    heroContainer.innerHTML = output;
}

async function displayByAttribute(){
    const heroes = await getHeroes();
    var output = "";
    const groups = {};
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    heroes.forEach(hero => {
        const attribute = formatAttribute(hero.primary_attr);
        if(!groups[attribute]){
            groups[attribute] = [];
        }
        groups[attribute].push(hero);
    });
    // console.log(groups);
    const attributes = [];
    for(const attribute in groups){
        attributes.push(attribute);
    }
    attributes.sort((a, b) => a.localeCompare(b));
    var skipper = "<ul><li><a id='navtitle'>Filter:</a></li>";
    for(const attribute of attributes){
        skipper += `<li><a id="${attribute}Pointer" href="#" onclick="filterSections('${attribute}')">${attribute}</a></li>`;
    }
    skipper += "</ul>";
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = skipper;
    // navbar.style.display = 'block';
    for(const attribute of attributes){
        output += `<section id="${attribute}"><div class="divider"><p>${attribute}\n</p></div>`;
        groups[attribute].forEach(hero => {
            // console.log(hero);
            output += formatOutput(hero);
        });
        output += "</section>"
    }
    const heroContainer = document.getElementById('heroContainer');
    heroContainer.innerHTML = output;
}

function formatAttribute(attribute){
    switch(attribute){
        case "agi":
            return "Agility";
        case "int":
            return "Intelligence";
        case "str":
            return "Strength";
        case "all":
            return "Universal";
        default:
            return "Invalid Attribute";
    }
}

function formatOutput(hero){
    return `
        <div class="hero">
            <img src="${'https://cdn.akamai.steamstatic.com' + hero.img}"
                alt="${hero.localized_name}"
                onmouseover="showTooltip(event, '${hero.localized_name}', '${formatAttribute(hero.primary_attr)}', '${hero.roles.join(", ")}')" 
                onmouseout="hideTooltip()">
            <p>${hero.localized_name}</p>
        </div>
    `;
}

function showTooltip(event, name, attribute, roles){
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `Name: ${name}\nAttribute: ${attribute}\nRoles: ${roles}`;
    tooltip.style.display = 'inline';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip(){
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

var currentFilter = "";

function filterSections(sectionID){
    // e.preventDefault();
    
    // console.log("boop");

    const targetSection = document.querySelector(`#${sectionID}`);
    const allSections = document.querySelectorAll('.hero-container section');
    const targetPointer = document.querySelector(`#${sectionID}Pointer`);
    const allPointers = document.querySelectorAll('.navbar ul li a');

    // Hide all sections
    allSections.forEach(section => {
        // console.log("brap");
        section.style.display = 'none';
    });

    allPointers.forEach(pointer => {
        pointer.style.backgroundColor = '#333';
        pointer.style.color = 'white';
    });

    // If the target section was not visible, show it
    if (currentFilter !== sectionID) {
        targetPointer.style.backgroundColor = '#ddd';
        targetPointer.style.color = 'black';
        targetSection.style.display = 'flex';
        targetSection.scrollIntoView({ behavior: 'smooth' });
        currentFilter = sectionID;
    } else {
        // If it was visible, show all sections again
        allSections.forEach(section => {
            section.style.display = 'flex';
        });
        currentFilter = "";
    }
}

//search and display heroes based on input text
async function searchHeroes() {
    const input = document.getElementById('searchInput').value.toLowerCase();           //get search input
    const heroes = await getHeroes();                                                   //fetch the list of all heroes from the API
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));
    let output = "";                                                                   
    let matchCount = 0;                                                    

    //loop through each hero in the list
    for (let i = 0; i < heroes.length; i++) {
        const heroName = heroes[i].localized_name.toLowerCase();                        //get the current hero name

        if (heroName.indexOf(input) !== -1) {                                           //check if the search input is part of the hero's name
            output += formatOutput(heroes[i]);                                          
            matchCount++;                                                               //increment match count if hero matched
        }
    }

    if (output === "") {
        output = `<p>No heroes found with the name "${input}"</p>`;                     //display message if no hero matched
    }

    //display the final output (matching heroes or message) in the container
    const heroContainer = document.getElementById('heroContainer');                 
    heroContainer.innerHTML = output;                                                   //set its content to the outp    ut

    //adjust background based on match count
    if (matchCount <= 9) {                                                             
        document.body.classList.add("searching");                                       
    } else {
        document.body.classList.remove("searching");                                    
    }

}

// Initial display
displayByAttribute();
// console.log(currentFilter);
// searchHeroes();