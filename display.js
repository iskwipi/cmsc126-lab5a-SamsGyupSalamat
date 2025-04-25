async function getHeroes(){
    const response = await fetch("https://api.opendota.com/api/heroStats");
    return response.json();
}

async function displayByName(){
    const heroes = await getHeroes();
    var output = "";
    const groups = {};
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name))
    heroes.forEach(hero => {
        const letter = hero.localized_name[0].toUpperCase();
        if(!groups[letter]){
            groups[letter] = [];
        }
        groups[letter].push(hero);
    });
    // console.log(groups);
    for(const letter in groups){
        output += `<div class="divider"><p>${letter}\n</p></div>`;
        groups[letter].forEach(hero => {
            // console.log(hero);
            output += formatOutput(hero);
        });
    }
    const heroContainer = document.getElementById('heroContainer');
    heroContainer.innerHTML = output;
   // heroContainer.style.display = 'flex';
}

async function displayByRole(){
    const heroes = await getHeroes();
    var output = "";
    const groups = {};
    heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name))
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
    for(const role of roleNames){
        output += `<div class="divider"><p>${role}\n</p></div>`;
        groups[role].forEach(hero => {
            // console.log(hero);
            output += formatOutput(hero);
        });
    }
    const heroContainer = document.getElementById('heroContainer');
    heroContainer.innerHTML = output;
   // heroContainer.style.display = 'flex';
}

function formatOutput(hero){
    return `
        <div class="hero">
            <img src="${'https://cdn.akamai.steamstatic.com' + hero.img}"
                alt="${hero.localized_name}"
                onmouseover="showTooltip(event, '${hero.localized_name}', '${hero.roles.join(", ")}')" 
                onmouseout="hideTooltip()">
            <p>${hero.localized_name}</p>
        </div>
    `;
}

function showTooltip(event, name, roles){
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `Name: ${name}\nRoles: ${roles}`;
    tooltip.style.display = 'inline';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip(){
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}
displayByName()
function sortByName() {
    const sortedHeroes = heroes.sort((a, b) => a.name.localeCompare(b.name));
    displayHeroes(sortedHeroes);
}

function sortByRole() {
    const sortedHeroes = heroes.sort((a, b) => a.role.localeCompare(b.role));
    displayHeroes(sortedHeroes);
}

// Initial display
// displayHeroes(heroes);