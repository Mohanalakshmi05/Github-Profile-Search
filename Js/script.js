    const input = document.querySelector('.input-field');
    const searchbtn = document.getElementById('search-btn');
    const username = document.querySelector('.username');
    const role = document.querySelector('.role');
    const profilepic = document.querySelector('.profilepic');
    const about = document.querySelector('.about-info');
    const Followers = document.querySelector(".followers-count");
    const Following = document.querySelector(".following-count");
    const repos = document.querySelector(".repo-count");
    const gists = document.querySelector(".gists-count");
    const Location = document.querySelector(".location-name");
    const Blog = document.querySelector(".gitblog");
    const Company = document.querySelector(".github-profile");
    const joinDate = document.querySelector(".dateofjoin");
    const repoLists = document.querySelector('.repo-list');
    const showerror = document.querySelector('.error-show');
    const spinner = document.getElementById('spinner');
    const githubBtn = document.querySelector('.github-link-btn');
const hero = document.querySelector(".hero");
const wrapper = document.querySelector(".wrapper-container");
    async function getGitUser(){
        let user = input.value.trim();
        if(user === '')return;
        spinner.classList.remove('d-none');
        try{
            const url = `https://api.github.com/users/${user}`;
            const response = await fetch(url);
            if(!response.ok){
                showerror.classList.remove('visually-hidden');
                wrapper.classList.add("d-none");
                return;
            }
            showerror.classList.add('visually-hidden');
            const data = await response.json();
            updateData(data)
            updateLinks(data);
            await getRepos(user);

            hero.classList.add("loaded");
            wrapper.classList.remove("d-none");
        }
        catch(err){
            showerror.classList.remove('visually-hidden');
            wrapper.classList.add("d-none");

        }
        finally{
            spinner.classList.add('d-none');
        }
        input.value = '';
        input.focus();

    }

    function updateData(data){
        username.textContent = data.name || data.login;
        role.textContent = data.login || data.name;
        profilepic.src = data.avatar_url;
        about.textContent = data.bio || "This user hasn't added a bio yet.";
        Followers.textContent = data.followers;
        Following.textContent = data.following;
        repos.textContent = data.public_repos;
        gists.textContent = data.public_gists;

    }

    function updateLinks(data){
        Location.textContent = data.location || 'Location not Updated';
        Blog.textContent = data.blog || 'Blog not Updated';
        Company.textContent = data.company || 'Company not Updated';
        githubBtn.href = data.html_url;
        const joindate= new Date(data.created_at);
        joinDate.textContent = joindate.toDateString();
    }

    async function getRepos(user){
        const response = await fetch(`https://api.github.com/users/${user}/repos`);
        const repos = await response.json();
        repoLists.innerHTML = '';
        for(let repo of repos.slice(0,3)){
            const div = document.createElement('div');
            div.classList.add('row','mt-2','repo-row');
            div.innerHTML = `<div class="col-lg-8">
                                <a class="repo-title" href="${repo.html_url}" target="_blank">${repo.name}</a>
                                <p class="repo-info">${repo.description || `Repo has no description`}</p> 
                            </div>
                            <div class="col-lg-4 text-center">
                                <i class="bi bi-star"></i>
                                <span class="rating">${repo.stargazers_count}</span>
                            </div>`;

            repoLists.append(div);
            
        }
    }


    searchbtn.addEventListener('click',getGitUser);
    input.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            getGitUser();
        }
    });