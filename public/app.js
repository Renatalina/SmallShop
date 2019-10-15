const create = (tag) => document.createElement(tag)
const appendBody = (node) => document.body.appendChild(node)
const appendToParent = (parentNode, node) => parentNode.appendChild(node)

function showComment(commentsArr, cardComment, id) {
    cardComment.innerText = ''
    commentsArr.forEach(item => {
        let comments = appendToParent(cardComment, create('h6'))
        comments.classList.add('text-muted')
        comments.innerText = item.title
        let paragraph = appendToParent(cardComment, create('p'))
        paragraph.classList.add('text-muted')
        paragraph.innerText = item.comment
    })
    let button = appendToParent(cardComment, create('button'))
    button.classList.add('btn', 'btn-light')
    button.innerText = 'Add comment'
    button.onclick = () => {
        if (confirm("Do you want to add comment?")) {            
            updateComment(cardComment, id)          
        }
    }
}
function updateComment(cardComment, id) {    
    let inputTitle = appendToParent(cardComment, create('input'))
    inputTitle.classList.add('mb-1','rounded','shadow')
    inputTitle.width = '100%'
    inputTitle.placeholder='Title'
    let inputText = appendToParent(cardComment, create('input'))
    inputText.width = '100%'
    inputText.classList.add('mb-1','rounded','shadow')
    inputText.placeholder='Comment'
    let buttonSave = appendToParent(cardComment, create('button'))
    buttonSave.classList.add('btn','btn-success')
    buttonSave.innerText = 'Save'
    buttonSave.onclick = () => {
        let { value: titleValue } = inputTitle
        let { value: textValue } = inputText
        let product = ''
        fetch(`http://localhost:3000/goods/${id}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                product = data
                product.comments.push({ title: titleValue, comment: textValue })
                fetch(`http://localhost:3000/goods/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                })
                showComment(product.comments, cardComment, id)

            })
    }
}
function goods() {
    document.getElementsByTagName('form')[0].remove()

    fetch('http://localhost:3000/goods')
        .then(response => {
            return response.json()
        })
        .then(data => {
            let cardDeck = appendBody(create('div'))
            cardDeck.classList.add('card-deck')
            cardDeck.id = 'card-deck'
            data.forEach(response => {
                let card = appendToParent(cardDeck, create('div'))
                card.classList.add('card')

                let img = appendToParent(card, create('img'))
                img.classList.add('card-img-top')
                img.alt = response.titileGood
                img.src = response.img

                let cardBody = appendToParent(card, create('div'))
                cardBody.classList.add('card-body')
                let title = appendToParent(cardBody, create('h5'))
                title.innerText = response.titileGood
                title.classList.add('card-title')
                let discription = appendToParent(cardBody, create('p'))
                discription.innerText = response.discription
                discription.classList.add('card-text')

                let cardFooter = appendToParent(card, create('div'))
                cardFooter.classList.add('card-footer')
                cardFooter.id = 'card-footer'

                let divTitle = appendToParent(cardFooter, create('div'))
                divTitle.style.display = '-webkit-inline-box'
                let titileComment = appendToParent(divTitle, create('h5'))
                titileComment.innerText = 'Show comments'

                let iconShow = appendToParent(divTitle, create('img'))
                iconShow.style.height = '15px'
                iconShow.style.marginLeft = '1rem'
                iconShow.src = './img/angle-double-down-solid.svg'
                let cardComment = appendToParent(cardFooter, create('div'))
                cardComment.id = 'cardComment'

                iconShow.onclick = () => {

                    if (iconShow.getAttribute('src') == './img/angle-double-down-solid.svg') {
                        cardFooter.style.display = 'inline-block'
                        iconShow.src = './img/angle-double-up-solid.svg'
                        fetch(`http://localhost:3000/goods/${response.id}`)
                            .then(response => {
                                return response.json()
                            })
                            .then(data => {                               
                                    showComment(data.comments, cardComment, response.id)
                            })} else if (iconShow.getAttribute('src') == './img/angle-double-up-solid.svg') {
                                iconShow.src = './img/angle-double-down-solid.svg'
                                cardComment.innerText = ''
                            }
                    }
                })
        })
}


function registration() {
    if (document.getElementById('card-deck')) {
        document.getElementById('card-deck').remove()
    }
    let formDiv = appendBody(create('form'))
    formDiv.classList.add('form-group', 'w-500p', 'mt-5', 'ml-auto', 'mr-auto')
    formDiv.name = 'myForm'

    let loginInput = appendToParent(formDiv, create('input'))
    loginInput.placeholder = 'Pleas login'
    loginInput.classList.add('form-control', 'mb-2')
    loginInput.name = 'login'

    let surnameInput = appendToParent(formDiv, create('input'))
    surnameInput.placeholder = 'Pleas input surname'
    surnameInput.classList.add('form-control', 'mb-2')
    surnameInput.name = 'surname'

    let emailInput = appendToParent(formDiv, create('input'))
    emailInput.placeholder = 'Pleas input email'
    emailInput.classList.add('form-control', 'mb-2')
    emailInput.name = 'email'
    emailInput.type = 'email'

    let passwordInput = appendToParent(formDiv, create('input'))
    passwordInput.placeholder = 'Enter your password'
    passwordInput.classList.add('form-control', 'mb-2')
    passwordInput.name = 'password'
    passwordInput.type = 'password'

    let button = appendToParent(formDiv, create('button'))
    button.innerText = 'Submit Login'
    button.classList.add('btn', 'btn-success', 'w-100')


    formDiv.onsubmit = async (event) => {
        event.preventDefault()
        let { value: loginValue } = loginInput
        let { value: emailValue } = emailInput
        let { value: surnameValue } = surnameInput
        let { value: passwordValue } = passwordInput


        let arrUsers = []
        if (loginValue != '' && emailValue != '' && surnameValue != '' && passwordValue != '') {
            let data = { name: loginValue, surname: surnameValue, email: emailValue, password: passwordValue }
            if (JSON.parse(localStorage.getItem("users"))) {
                arrUsers = JSON.parse(localStorage.getItem("users"))
            }
            arrUsers.push(data)
            localStorage.setItem("users", JSON.stringify(arrUsers))
            fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            goods()
        } else {
            alert('Fill all fields')
        }
    }
}
function login() {
    if (document.getElementById('card-deck')) {
        document.getElementById('card-deck').remove()
    }
    let formDiv = appendBody(create('form'))
    formDiv.classList.add('form-group', 'w-500p', 'mt-5', 'ml-auto', 'mr-auto')
    formDiv.name = 'myForm'

    let loginInput = appendToParent(formDiv, create('input'))
    loginInput.placeholder = 'Pleas login'
    loginInput.classList.add('form-control', 'mb-2')
    loginInput.name = 'login'

    let passwordInput = appendToParent(formDiv, create('input'))
    passwordInput.placeholder = 'Enter your password'
    passwordInput.classList.add('form-control', 'mb-2')
    passwordInput.name = 'password'
    passwordInput.type = 'password'

    let button = appendToParent(formDiv, create('button'))
    button.innerText = 'Submit Login'
    button.classList.add('btn', 'btn-success', 'w-100')

    formDiv.onsubmit = async (event) => {
        event.preventDefault()
        let { value: loginValue } = loginInput
        let { value: passwordValue } = passwordInput


        let arrUsers = []
        if (JSON.parse(localStorage.getItem("users"))) {
            arrUsers = JSON.parse(localStorage.getItem("users"))

            arrUsers.forEach(user => {
                if (user.name == loginValue && user.password == passwordValue) {
                    // goods()
                    //закомментировала, что бы он два раза не вызывал функцию с товарами                
                }
            })
        }
        fetch(`http://localhost:3000/users?q=${loginValue}&&password=${passwordValue}`)
            .then(response => {
                return response.json()
            })
            .then(response => {
                response.length == 1 ? goods() : alert('You made mistakes, please try again')
            })

    }
}


let navBar = appendBody(create('ul'))
navBar.classList.add('nav', 'justify-content-end', 'bg-success')

let liMain = appendToParent(navBar, create('li'))
liMain.classList.add('nav-item')
let aMain = appendToParent(liMain, create('a'))
aMain.classList.add('nav-link', 'active')
aMain.innerText = 'Main'
aMain.onclick = (event) => {

}

let liGoods = appendToParent(navBar, create('li'))
liGoods.classList.add('nav-item')
let aGoods = appendToParent(liGoods, create('a'))
aGoods.classList.add('nav-link', 'active')
aGoods.innerText = 'Goods'
aGoods.onclick = (event) => {
    fetch('http://localhost:3000/goods')
        .then(response => {
            return response.json()
        })
        .then(data => { 
            goods()           
        })
}

let liRegistration = appendToParent(navBar, create('li'))
liRegistration.classList.add('nav-item')
let aRegistration = appendToParent(liRegistration, create('a'))
aRegistration.classList.add('nav-link', 'active')
aRegistration.innerText = 'Registration'
aRegistration.onclick = (event) => {
    document.getElementsByTagName('form').length >= 1 ? false : registration()
}

let liLogin = appendToParent(navBar, create('li'))
liLogin.classList.add('nav-item')
let aLogin = appendToParent(liLogin, create('a'))
aLogin.classList.add('nav-link', 'active')
aLogin.innerText = 'Login'
aLogin.onclick = (event) => {
    document.getElementsByTagName('form').length >= 1 ? false : login()
}





