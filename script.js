class View {
    constructor(){
        this.app = document.getElementById('app')
        this.searchLine = this.createElement('div', 'search-line')
        this.searchInput = this.createElement('input', 'search-input')
        this.repoList = this.createElement('div', 'repo-list')
        this.savesRepos = this.createElement('div','save-repos')

        this.searchLine.append(this.searchInput);
        this.app.append(this.searchLine);
        this.app.append(this.repoList);
        this.app.append(this.savesRepos);


        this.repoList.addEventListener('click', this.handleRepoClick.bind(this));
    }

    handleRepoClick(event) {
        const repoElement = event.target.closest('.repo-input');
        if (!repoElement) return;

        const repoData = repoElement._data; 
        this.createSaveRepo(repoData);
        this.searchInput.value = '';
        this.repoList.innerHTML=''
    }

    createElement(elemTag,elemClass){
        const element = document.createElement(elemTag)
        if(elemClass) element.classList.add(elemClass)
        return element
    }

    createSaveRepo(repoData){
        const repo = this.createElement('li', 'repo-save')
        const name = this.createElement('div');
        const author = this.createElement('div');
        const stars = this.createElement('div');

        name.textContent = `Name: ${repoData.name}`;
        author.textContent = `Owner: ${repoData.owner.login}`
        stars.textContent = `Stars: ${repoData.stargazers_count}`

        const deleteBtn = this.createElement('button', 'delete-btn');
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        repo.remove();
        });

        repo.append(name)
        repo.append(author)
        repo.append(stars)
        repo.append(deleteBtn);

        this.savesRepos.append(repo)
    }

    createRepo(repoData){
        const repoElement = this.createElement('li', 'repo-input')

        const nameElement = this.createElement('div');
        nameElement.textContent = `${repoData.name}`;

        repoElement._data = repoData;

        repoElement.append(nameElement)
        this.repoList.append(repoElement)
    }

}

class Search {
    constructor(view){
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this),500))
    }
    
   async searchRepos(){
    try{
    const searchValue = this.view.searchInput.value.trim();
    this.clearRepos()
    if(searchValue){
        return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`).then((res)=>{
            if(res.ok){
                res.json().then((res)=>{
                    res.items.forEach(repo => {
                        this.view.createRepo(repo)
                    });
                })
            }else{

            }
        })
    }
} catch (error) {
    console.error('Ошибка: ', error);
    this.clearRepos();
}
    }

    clearRepos(){
        this.view.repoList.innerHTML=''
    }

    debounce(fn, debounceTime){
        let timer
    return function(){
        const fnCall = () => {fn.apply(this,arguments)}
    clearTimeout(timer)
    timer = setTimeout(fnCall,debounceTime)
    }
    };

}

new Search(new View())
