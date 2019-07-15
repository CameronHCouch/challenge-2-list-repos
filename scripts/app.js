document.addEventListener("DOMContentLoaded", function() {
    console.log('document ready');
});

document.forms[0].onsubmit = function(e) {
    e.preventDefault();
    let username = e.target[0].value;
    let sortOption = 'updated';
    updateHeaderText(username)
    clearRepoList()
    fetch(`https://api.github.com/users/${username}/repos?sort=${sortOption}`)
        .then((res) => res.json())
        .then((data) => {
            buildListItems(data);
        })
}

function updateHeaderText(username) {
    let header = document.getElementById('repoHeader');
    header.innerText = username;
    header.setAttribute('href', `https://github.com/${username}/`);
}

function clearRepoList() {
    let repoList = document.getElementById('repo-list');
    while (repoList.firstChild) {
        repoList.removeChild(repoList.firstChild);
    }
}

function buildListItems(list) {
    for (let i = 0; i < list.length; i++) {
        buildListItem(list[i]);
    }
}

function buildListItem(listItem) {
    let repoList = document.getElementById('repo-list');
    let htmlItem = document.createElement('div');
    htmlItem.className = "repo";

    // build header ; worried about XSS using innerHTML; could be improved
    let itemHeader = document.createElement('h3');
    itemHeader.innerHTML = `<a href='${listItem.html_url}'>${listItem.name}</a>`;
    htmlItem.append(itemHeader);

    let description = document.createElement('p');
    description.innerHTML = `<strong>Description:</strong> ${listItem.description ? listItem.description: defaultSubscription()}`;
    htmlItem.append(description);

    let owner = document.createElement('p');
    owner.innerHTML = `<strong>Owner:</strong> ${listItem.owner.login}`
    htmlItem.append(owner);

    // stats section
    let stats = document.createElement('div');
    stats.className = "stats";
    
    let stars = document.createElement('div');
    stars.textContent = listItem.stargazers_count;
    stats.appendChild(stars);

    let watchers = document.createElement('div');
    watchers.textContent = listItem.watchers_count;
    stats.appendChild(watchers);

    htmlItem.append(stats);
    
    repoList.appendChild(htmlItem);
}

function defaultSubscription() {
    return 'This repo has no description.'
}

// <div class="row repo">
// <h3>
//     <a href="https://github.com/code-corgi/challenge-2-list-repos">
//         challenge-2-list-repos
//     </a>
// </h3>
// <p><strong>Description:</strong>
//     <span>Challenge 2 for the code-corgi platform</span>
// </p>
// <p><strong>Owner:</strong>
//     <span>code-corgi</span>
// </p>
// <div class="stats">
//     <div class="col-sm-1 stars">
//     <svg class="icon" aria-hidden="true" height="16" version="1.1" viewBox="0 0 14 16" width="14">
//         <use xlink:href="./svg/sprites.svg#star"></use>
//     </svg>
//         <span>1</span>
//     </div>
//     <div class="col-sm-1 forks">
//         <svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 10 16" width="10">
//             <use xlink:href="./svg/sprites.svg#fork"></use>
//         </svg>
//         <span>3</span>
//     </div>
// </div>
// </div>