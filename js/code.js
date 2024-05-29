const urlBase = 'http://ocean-life.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

// login
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("username_field").value;
    let password = document.getElementById("password_field").value;
    // var hash = md5(password);  // commended for debuging

    document.getElementById("loginResult").innerHTML = "";

    // var tmp = { login: login, password: hash }; // commended for debuging


    var tmp = { login: login, password: password }; // commended for debuging
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

//signup
function doSignup() {
    firstName = document.getElementById("signup_firstname_field").value;
    lastName = document.getElementById("signup_lastname_field").value;

    let username = document.getElementById("signup_username_field").value;
    let password = document.getElementById("signup_password_field").value;

    var hash = md5(password);

    document.getElementById("signupResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);

                userId = jsonObject.id;

                if (userId < 1) {
                    return;
                }

                firstName = jsonObject.FirstName;
                lastName = jsonObject.LastName;

                saveCookie();

                window.location.href = "login.html";
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("signupResult").innerHTML = err.message;
    }
}
// logout
function logout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}
// read and save cookie
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
    else {
        //		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}
// add contact
function addContact() {
    // Clear previous error highlights
    document.getElementById("contactfirstName").classList.remove("error");
    document.getElementById("contactlastName").classList.remove("error");
    document.getElementById("contactphoneNumber").classList.remove("error");
    document.getElementById("contactemail").classList.remove("error");

    let firstname = document.getElementById("contactfirstName").value.trim();
    let lastname = document.getElementById("contactlastName").value.trim();
    let phonenumber = document.getElementById("contactphoneNumber").value.trim();
    let emailaddress = document.getElementById("contactemail").value.trim();

    let valid = true;

    if (firstname === "") {
        document.getElementById("contactfirstName").classList.add("error");
        valid = false;
    }
    if (lastname === "") {
        document.getElementById("contactlastName").classList.add("error");
        valid = false;
    }
    if (phonenumber === "") {
        document.getElementById("contactphoneNumber").classList.add("error");
        valid = false;
    }
    if (emailaddress === "") {
        document.getElementById("contactemail").classList.add("error");
        valid = false;
    }

    if (!valid) {
        return;
    }

    let tmp = {
        FirstName: firstname,
        LastName: lastname,
        Phone: phonenumber,
        Email: emailaddress,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}
//search contact
function searchContacts() {
    const content = document.getElementById("searchInput");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contactTable");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}
// load
function loadContacts() {

    let srch = document.getElementById("searchInput").value;

    let tmp = {
        search: srch,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}
function showTable() {
    var x = document.getElementById("contactForm");
    var contacts = document.getElementById("contacts")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}
