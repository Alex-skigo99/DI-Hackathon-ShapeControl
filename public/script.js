// consts
const urlApi = 'http://localhost:3001/api/';
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var currentUser; //{id, username}

// menu event lesteners
document.getElementById('nav_signup').addEventListener('click', doSignup);
document.getElementById('nav_login').addEventListener('click', doLogin);
// document.getElementById('nav_report').addEventListener('click', doReport);
document.getElementById('nav_new').addEventListener('click', doNew);
document.getElementById('nav_current').addEventListener('click', doCurrent);

// tools
function displayPage(page) {
    let htmlPartsId = ['signup', 'login', 'report', 'new', 'current'];
    htmlPartsId.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById(page).style.display = 'inline'
};

function displayStartMenu() {
    let htmlPartsId = ['nav_report', 'nav_new', 'nav_current'];
    htmlPartsId.forEach(id => document.getElementById(id).style.display = 'none');
};

function displayFullMenu() {
    let htmlPartsId = ['nav_report', 'nav_new', 'nav_current'];
    htmlPartsId.forEach(id => document.getElementById(id).style.display = 'inline');
};


async function getData(url) {
    try {
        let res = await fetch(url);
        if (res.status === 200) {
            let data = await res.json();
                return data
            }
            else throw `Response error. Status ${res.status}.`;
    } 
    catch (err) {
        console.log(err);
    }
};

async function postData(url, data) {
    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const result = await response.json();
        console.log('Success:', result);
        return result
      } catch (error) {
        console.error('Error:', error);
      }
};

async function getLastProgram() {
    let url = urlApi + 'programs?name=last&user=' + currentUser;
    return await getData(url);
};

async function getPrograms() {
    let url = urlApi + 'programs?name=all&user=' + currentUser;
    return await getData(url);
};

async function getProgram(name) {
    let url = urlApi + `programs?name=${name}&user=${currentUser}`;
    return await getData(url);
};

function setCurrentUser(user) {
    document.getElementById('nav_user').innerText = user.username;
    currentUser = user;
};

// ---------- pages ----------------

//--------------------------login
document.loginForm.addEventListener('submit', loginPost)

async function loginPost(e) {
    e.preventDefault();
    let loginUser = document.loginForm.username.value;
    let result = await postData(urlApi + 'login', {username: loginUser});
    console.log(result); //------
    if (!result.is_login) document.getElementById('err_login').innerText = 'User not found'
    else {
        setCurrentUser(result.user);
        doCurrent()
    }
}

function doLogin() {
    displayStartMenu();
    // document.getElementById('err_login').innerText = '';
    displayPage('login');
};

//-----------------------------signup
document.signupForm.addEventListener('submit', signupPost)

async function signupPost(e) {
    e.preventDefault();
    let username = document.signupForm.username.value;
    let age = document.signupForm.age.value;
    let gender = document.signupForm.gender.value;
    let password = '123';
    let result = await postData(urlApi + 'signup', {username, age, gender, password});
    console.log(result); //------
    if (!result.is_signup) document.getElementById('err_signup').innerText = 'This name exists! Input another name.'
    else {
        alert(`Wellcome, ${username}! You are signed up.`)
        setCurrentUser(result.user);
        doCurrent();
    }
};

function doSignup() {
    displayStartMenu();
    displayPage('signup');

};

//---------------------------- current ---------------

async function doCurrent() {
    displayFullMenu();
    let data = await getLastProgram();
    console.log('doCurrent -', data); //---------
    document.querySelector('#current .prog_name').innerText = data.prog_name;
    document.querySelector('#current .level').innerText = data.level;
    document.querySelector('#current .in_weight').innerText = data.in_weight;
    document.querySelector('#current .out_weight').value = data.out_weight;
    document.querySelector('#current .close_check').checked = data.is_close;
    let table = document.querySelector('#currentForm .table');
    table.innerHTML = '';
    data.days.forEach(row => {
        let training = row.is_training ? 'V' : '';
        let rowHtml = document.createElement('div');
        rowHtml.classList.add('row');
        rowHtml.innerHTML = `
            <input type="text" class="day" value="${row.day}" disabled>
            <input type="text" class="plan" value="${row.plan}" disabled>
            <input type="text" class="fact" value="${row.fact}">
            <input type="text" class="is_training" value="${training}"disabled>
            <input type="text" class="comment" value="${row.comment}">`;
        table.appendChild(rowHtml)
    });
    displayPage('current');
};

//---------------------------- new ---------------
document.newForm.addEventListener('submit', newProgramPost);

async function newProgramPost(e) {
    let body;
}

async function doNew() {
    displayFullMenu();
    let table = document.querySelector('#newForm .table');
    table.innerHTML = '';
    weekDays.forEach(day => {
        let rowHtml = document.createElement('div');
        rowHtml.classList.add('row');
        rowHtml.innerHTML = `
            <input type="text" class="day" value="${day}">
            <input type="text" class="plan">
            <input type="checkbox" class="is_training" checked="false">
            <input type="text" class="comment">`;
        table.appendChild(rowHtml)
    });
    displayPage('current');
};


// start
function start() {
    doLogin();
};

start();