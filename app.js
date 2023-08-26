import {
    getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
    updatePassword, GoogleAuthProvider, signInWithPopup, doc, setDoc, collection, addDoc,
    query, where, updateDoc, onSnapshot, getDoc, serverTimestamp, orderBy, deleteDoc, ref,
    uploadBytes, uploadBytesResumable, getDownloadURL, auth, db, storage, reauthenticateWithCredential,
    EmailAuthProvider, getDocs
} from './firebase.js';


let userLogedIn = true;
onAuthStateChanged(auth, (user) => {
    if (user && userLogedIn) {
        const uid = user.uid;
        if (location.pathname != '/dashboard.html' && location.pathname != '/profile.html' && location.pathname != '/index.html' && location.pathname != '/') {
            window.location.replace('dashboard.html')
        }
        else if (location.pathname == '/dashboard.html') {
            getblogs();
            getName();
            window.addUserData = addUserData;
            window.login = login;
            window.editPost = editPost;
            window.deletePost = deletePost;
            window.publishBlog = publishBlog;
        } else if (location.pathname == '/profile.html') {
            getLoginUserData()
        } else if (location.pathname == '/' || location.pathname == '/index.html') {
            getAllBlogs();
            ifLogin();
            getName();
        }
    } else if (window.location.pathname != "/start-page.html" && window.location.pathname != "/login.html" && location.pathname != '/' && location.pathname != '/index.html') {
        window.location.replace('index.html')
    } else if (location.pathname == '/' || location.pathname == '/index.html') {
        getAllBlogs()
    }
});

let userUid;
if (localStorage.getItem("userUid")) {
    let user = localStorage.getItem("userUid");
    user = JSON.parse(user);
    userUid = user.uid;
}

const ifLogin = () => {
    const headerDiv = document.getElementById('header-div-txt');
    headerDiv.innerHTML = `
    <div class="name-hdr me-2"><a href="dashboard.html">Dashboard</a></div>
    ` + headerDiv.innerHTML;
    const headerBtn = document.getElementById('header-btn');
    headerBtn.innerHTML = `
    <button class="logout-btn-hdr font" mt-4 id="logout-btn">Logout</button>
    `
}

let signinBtn = document.getElementById('signin-button');

const addUserData = () => {
    loader.style.display = "flex";
    div.style.display = "none";
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let repeatPassword = document.getElementById("repeat-password");
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let name = firstName.value + " " + lastName.value;
    if (firstName.value.trim().length > "3") {
        if (lastName.value.trim().length > "1") {
            if (lastName.value.trim().length <= "20") {
                if (email.value.trim().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                    if (password.value.trim().match(/^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)) {
                        if (password.value.trim() == repeatPassword.value.trim()) {
                            userLogedIn = false;
                            createUserWithEmailAndPassword(auth, email.value, password.value)
                                .then(async (userCredential) => {
                                    const user = userCredential.user;
                                    try {
                                        await setDoc(doc(db, "users", user.uid), {
                                            name: name,
                                            email: email.value,
                                            uid: user.uid,
                                            image: false,
                                        });
                                        loader.style.display = "none";
                                        div.style.display = "block";
                                        localStorage.setItem("userUid", JSON.stringify(user));
                                        window.location.replace("dashboard.html")
                                    }
                                    catch (e) {
                                        console.log("Error", e)
                                    }
                                })
                                .catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    for (var i = 0; i < errorMessage.length; i++) {
                                        if (errorMessage.slice(i, i + 1) == "/") {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Oops...',
                                                text: `${errorMessage.slice(i + 1, errorMessage.length - 2)}`,
                                            })
                                            break

                                        }
                                    }
                                    email.value = "";
                                    password.value = "";
                                    repeatPassword.value = "";
                                    firstName.value = "";
                                    lastName.value = "";
                                });

                        } else {
                            password.style.borderColor = 'red';
                            repeatPassword.style.borderColor = 'red';
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Password is not equal to confirm password',
                            })
                        }
                    } else {
                        password.style.borderColor = 'red';
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Password should be atleast 8 charectors long or must contain one capital and one lower case letter',
                        })
                    }
                } else {
                    email.style.borderColor = 'red';
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Email should be like abc@gmail.com',
                    })
                }
            } else {
                lastName.style.borderColor = 'red';
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Last name can only contain 20 charectors',
                })
            }
        } else {
            lastName.style.borderColor = 'red';
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Last name should be atleast 1 charectors',
            })
        }
    } else {
        firstName.style.borderColor = 'red';
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'First name should be atleast 5 charectors',
        })
    }
}
signinBtn && signinBtn.addEventListener('click', addUserData);

let loginBtn = document.getElementById('login-button');

const login = () => {
    loader.style.display = "flex";
    div.style.display = "none";
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            loader.style.display = "none";
            div.style.display = "block";
            const user = userCredential.user;
            localStorage.setItem("userUid", JSON.stringify(user));
            window.location.replace("dashboard.html");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            for (var i = 0; i < errorMessage.length; i++) {
                if (errorMessage.slice(i, i + 1) == "/") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${errorMessage.slice(i + 1, errorMessage.length - 2)}`,
                    })
                    break

                }
            }

            email.value = "";
            password.value = "";
        });
}

loginBtn && loginBtn.addEventListener('click', login);

//Dashboard

const logoutBtn = document.getElementById("logout-btn");
const logout = () => {
    loader.style.display = "flex";
    div.style.display = "none";
    signOut(auth).then(() => {
        loader.style.display = "none";
        div.style.display = "block";
        localStorage.clear()
        window.location.replace("index.html")

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        for (var i = 0; i < errorMessage.length; i++) {
            if (errorMessage.slice(i, i + 1) == "/") {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${errorMessage.slice(i + 1, errorMessage.length - 2)}`,
                })
                break

            }
        }
    });
}

logoutBtn && logoutBtn.addEventListener('click', logout)

const getName = () => {
    const nameHdr = document.getElementById('name-hdr');
    const q = query(collection(db, "users"), where("uid", "==", userUid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            nameHdr.innerHTML = doc.data().name;
        });
    });
}


const publishBlog = async () => {
    let blogTitle = document.getElementById('blog-title');
    let blogBody = document.getElementById('blog-body');
    if (blogTitle.value.length >= '5') {
        if (blogBody.value.length >= '100') {
            try {
                const q = query(collection(db, "users"), where("uid", "==", userUid));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                        const docRef = await addDoc(collection(db, "blogs"), {
                            blogName: doc.data().name,
                            blogTitle: blogTitle.value,
                            blogBody: blogBody.value,
                            uid: userUid,
                            time: serverTimestamp(),
                        });
                        blogTitle.value = "";
                        blogBody.value = "";
                        console.log("Document written with ID: ", docRef.id);
                    });
                });


            } catch (e) {
                console.log('error', e)
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Body should be at least hundread charectors long',
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Title should be at least five charectors long',
        })
    }
}



const getblogs = () => {
    loader.style.display = 'flex';
    div.style.display = 'none';
    const myBlogsDiv = document.getElementById('my-blogs-div')
    const q = query(collection(db, "blogs"), where("uid", "==", userUid), orderBy('time', "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const blogs = [];
        myBlogsDiv.innerHTML = "";
        querySnapshot.forEach((doc) => {
            blogs.push(doc);
        });
        blogs.forEach(async (v, i) => {
            const time = v.data().time ? v.data().time.toDate() : new Date().toDateString()
            const docRef = doc(db, "users", v.data().uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                myBlogsDiv.innerHTML += `
                    <div class="blog-div mt-3">
                        <div class="blog-account-details">
                            <div class="blog-account-pic">
                            ${docSnap.data().image ? `<img src="${docSnap.data().image}" class="user-profile-image">` : `<i class="fa-solid fa-user profile-icon" style="color: #7749f8;"></i>`}
                            <!-- <i class="fa-solid fa-user profile-icon" style="color: #7749f8;"></i> -->
                            </div>
                            <div class="blog-account-name">
                                <div class="blog-title">${v.data().blogTitle}</div>
                                <div> <span class="name" id="blog-name">${v.data().blogName}</span> - <span class="name">${moment(`${time}`).format('LT')}</span>
                                </div>
                            </div>
                        </div>
                        <div class="blog-body">${v.data().blogBody}</div>
                        <div class="blog-footer">
                            <button type="button" class="button" onclick='editPost(this, "${this, v._key.path.segments[6]}")'>
                                Edit
                            </button>
                            <button class="button delete" onclick='deletePost("${v._key.path.segments[6]}")'>
                                Delete
                            </button>
                        </div>
                    </div>
            `;
            } else {
                console.log("No such document!");
            }
        })
        loader.style.display = 'none';
        div.style.display = 'block';

    });
}


let edit = true;
const editPost = async (e, docId) => {
    if (edit) {
        e.parentNode.parentNode.childNodes[3].setAttribute("contenteditable", true);
        e.parentNode.parentNode.childNodes[3].focus()
        e.innerHTML = 'Update';
        edit = false;
    } else {
        e.parentNode.parentNode.childNodes[3].setAttribute("contenteditable", false);
        e.innerHTML = 'Edit';
        edit = true;
        const docRef = doc(db, "blogs", docId);
        await updateDoc(docRef, {
            blogTitle: e.parentNode.parentNode.childNodes[1].childNodes[3].childNodes[1].innerText,
            blogBody: e.parentNode.parentNode.childNodes[3].innerText,
            time: serverTimestamp(),
            uid: userUid,
        });
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your Blog has been updated',
            timer: 1500
        })
    }


}

const deletePost = (docId) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await deleteDoc(doc(db, "blogs", `${docId}`));
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}


//Profile

const getLoginUserData = async () => {
    loader.style.display = 'flex';
    div.style.display = 'none';
    const name = document.getElementById("updatedName");
    const email = document.getElementById("updatedEmail");
    const oldPass = document.getElementById("old-pass");
    const newPass = document.getElementById("new-pass");
    const profileImg = document.getElementById("profile-img");

    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        name.value = docSnap.data().name;
        email.value = docSnap.data().email;
        if (docSnap.data().image) {
            profileImg.innerHTML = `<img src="${docSnap.data().image}" alt="" class="profile-img">`;
        }
        loader.style.display = 'none';
        div.style.display = 'block';
    } else {
        console.log("No such document!");
    }
}

const image = document.getElementById("update-image-input");
const profileImg = document.getElementById("profile-img");
let imageFile;
image && image.addEventListener('change', () => {
    imageFile = image.files[0];
    profileImg.innerHTML = `<img src="${URL.createObjectURL(image.files[0])}" alt="" class="profile-img">`

})

let updateImgBtn = document.getElementById('update-img-btn');

let uploadIamge = (imageFile) => {
    return new Promise((resolve, reject) => {
        const metadata = {
            contentType: imageFile.type,
        };

        const storageRef = ref(storage, `images/${userUid}/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    profileImg.innerHTML = `<img src="${downloadURL}" alt="" class="profile-img">`
                    resolve(downloadURL)
                    loader.style.display = "none";
                    div.style.display = "block";
                    // Swal.fire({
                    //     position: 'center',
                    //     icon: 'success',
                    //     title: 'Your profile has been updated',
                    //     timer: 1500
                    // })
                });
            }
        );
    })
}
const oldPass = document.getElementById("old-pass");
const newPass = document.getElementById("new-pass");

const updateUserPass = (oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        )
        reauthenticateWithCredential(user, credential).then(() => {
            if (newPassword.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,15}$/)) {
                updatePassword(user, newPassword).then(() => {
                    // Swal.fire({
                    //     position: 'center',
                    //     icon: 'success',
                    //     title: 'Your profile has been updated',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // })
                    newPass.value = '';
                    oldPass.value = '';
                    resolve('updated Pass');
                }).catch((error) => {
                    reject(error)
                });
            } else {
                loader.style.display = "none";
                div.style.display = "block";
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Password should be atleast 8 charectors long or must contain one capital and one lower case letter',
                })
            }


        }).catch((error) => {
            reject(error)
        });
    })
}

const updateInfo = async () => {
    loader.style.display = "flex";
    div.style.display = "none";
    const updatedName = document.getElementById("updatedName");
    const updatedEmail = document.getElementById("updatedEmail");
    const userData = {
        name: updatedName.value,
        email: updatedEmail.value,
    };
    if (imageFile) {
        await uploadIamge(imageFile)
            .then((res) => {
                userData.image = `${res}`
                loader.style.display = "none";
                div.style.display = "block";
            })
            .catch((error) => {
                loader.style.display = "none";
                div.style.display = "block";
                const errorCode = error.code;
                const errorMessage = error.message;
                for (var i = 0; i < errorMessage.length; i++) {
                    if (errorMessage.slice(i, i + 1) == "/") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${errorMessage.slice(i + 1, errorMessage.length - 2)}`,
                        })
                        break
                    }
                }
            })
    }
    if (oldPass.value) {
        await updateUserPass(oldPass.value.trim(), newPass.value.trim())
            .then((res) => {
                loader.style.display = "none";
                div.style.display = "block";
            })
            .catch((error) => {
                loader.style.display = "none";
                div.style.display = "block";
                const errorCode = error.code;
                const errorMessage = error.message;
                for (var i = 0; i < errorMessage.length; i++) {
                    if (errorMessage.slice(i, i + 1) == "/") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: `${errorMessage.slice(i + 1, errorMessage.length - 2)}`,
                        })
                        break
                    }
                }
            })
    }

    const userRef = doc(db, "users", userUid);
    await updateDoc(userRef, userData);
    if (imageFile || oldPass.value) {
    } else {
        loader.style.display = "none";
        div.style.display = "block";
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your profile has been updated',
            showConfirmButton: false,
            timer: 1500
        })
    }
}

updateImgBtn && updateImgBtn.addEventListener('click', updateInfo)


const getAllBlogs = async () => {
    loader.style.display = "flex";
    div.style.display = "none";
    const allBlogsDiv = document.getElementById('all-blogs-div');
    const querySnapshot = await getDocs(collection(db, "blogs"));
    let blogs = [];
    querySnapshot.forEach(async (doc) => {
        blogs.push(doc)
    });
    blogs.forEach(async (v, i) => {
        const time = v.data().time ? v.data().time.toDate() : new Date().toDateString()
        const docRef = doc(db, "users", v.data().uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            allBlogsDiv.innerHTML += `
                <div class="blog-div mt-3">
                    <div class="blog-account-details">
                        <div class="blog-account-pic">
                        ${docSnap.data().image ? `<img src="${docSnap.data().image}" class="user-profile-image">` : `<i class="fa-solid fa-user profile-icon" style="color: #7749f8;"></i>`}
                        <!-- <i class="fa-solid fa-user profile-icon" style="color: #7749f8;"></i> -->
                        </div>
                        <div class="blog-account-name">
                            <div class="blog-title">${v.data().blogTitle}</div>
                            <div> <span class="name" id="blog-name">${v.data().blogName}</span> - <span class="name">${moment(`${time}`).format('LT')}</span>
                            </div>
                        </div>
                    </div>
                    <div class="blog-body">${v.data().blogBody}</div>
                </div>
        `;
        } else {
            console.log("No such document!");
        }
        loader.style.display = "none";
        div.style.display = "block";
    })
}
