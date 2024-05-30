const urlBase = 'http://ocean-life.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []

//showpass
function showPasswordLogin() {
    var passwordField = document.getElementById("password_field");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}

// login
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("username_field").value;
    let password = document.getElementById("password_field").value;
    var hash = md5(password);  // commended for debuging

    document.getElementById("loginResult").innerHTML = "";

    var tmp = { login: login, password: hash }; // commended for debuging


    //var tmp = { login: login, password: password }; // commended for debuging
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
    let password = document.getElementById("password_field").value;

    let valid = true;
    var regexP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (regexP.test(password) == false) {
            console.log("PASSWORD IS NOT VALID");
            valid = false;
        }
        if(!valid)
        {
            return;
        }

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

    const regexP = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    const regexE = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;

    if (firstname === "") 
    {
        document.getElementById("contactfirstName").classList.add("error");
        valid = false;
    }
    if (lastname === "") 
    {
        document.getElementById("contactlastName").classList.add("error");        
        valid = false;
    }
    if (phonenumber === "") 
    {
        document.getElementById("contactphoneNumber").classList.add("error");
        valid = false;
    }else if(regexP.test(phonenumber) == false)
        {
            console.log("Phone number is not valid");
            valid = false;
        }

    if (emailaddress === "") 
    {
        document.getElementById("contactemail").classList.add("error");
        valid = false;
    } else if(regexE.test(emailaddress) == false)
        {
            console.log("Email Address is not valid");
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
                
                document.getElementById("tbody").innerHTML = "";

                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    document.getElementById("tbody").innerHTML = "<p> No Contacts Found. </p>";
                    return;
                } else {
                    let text = "<table border='1'>"
                    for (let i = 0; i < jsonObject.results.length; i++) {
                        ids[i] = jsonObject.results[i].ID;

                        text += "<tr id='row" + i + "'>"
                        text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                        text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                        text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                        text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                        text += "<td><button id='edit_button" + i + "' class='edit-button' onclick='editContact(" + i + ")'>Edit</button>";
                        text += "<button id='save_button" + i + "' class='edit-button' onclick='saveContact(" + i + ")' style='display:none;'>Save</button></td>";
                        text += "<td><button class='delete-button' onclick='deleteContact(" + ids[i] + ")'>Delete</button></td>";
                        text += "</tr>";
                    }
                    text += "</table>"
                    document.getElementById("tbody").innerHTML = text;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function showTable() {
    var x = document.getElementById("contactForm");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function editContact(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>";
}

function saveContact(id) {
    var firstName = document.getElementById("namef_text" + id).value;
    var lastName = document.getElementById("namel_text" + id).value;
    var email = document.getElementById("email_text" + id).value;
    var phone = document.getElementById("phone_text" + id).value;

    let tmp = {
        ID: ids[id],
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        //userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                document.getElementById("first_Name" + id).innerHTML = firstName;
                document.getElementById("last_Name" + id).innerHTML = lastName;
                document.getElementById("email" + id).innerHTML = email;
                document.getElementById("phone" + id).innerHTML = phone;
                document.getElementById("edit_button" + id).style.display = "inline-block";
                document.getElementById("save_button" + id).style.display = "none";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(contactId){
    if(confirm("Are you sure you want to delete this contact?")){
        var tmp = {
            ID: contactId};
        
        var jsonPayload = JSON.stringify(tmp);
        var url = urlBase + '/DeleteContact.' + extension;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                console.log("Contact delete successfully.");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    }
}

function showTable() {
    const form = document.getElementById("contactForm");
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}
