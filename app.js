'use strict'

const contatoConversa = document.getElementById('contato_info')
const usuarioInformacoes = document.getElementById("user_infos")
let numeroUsuarioAtual = null
let numeroContatoAtual = null


async function listarContatos(numeroUsuario) {
    const url = `https://api-whatsapp-3dav.onrender.com/v1/whatsapp/contacts/${numeroUsuario}`
    const response = await fetch(url)
    const dados = await response.json()
    mostrarContatos(dados.info.slice(1), numeroUsuario)
}

async function mostrarContatos(contatos, numeroUsuario) {
    const lista = document.getElementById('contatos')

    lista.replaceChildren()

    contatos.forEach(contato => {

        const div = document.createElement('div')
        div.classList.add('contato')

        const nome = document.createElement('p')
        nome.textContent = contato.name

        const img = document.createElement('img')
        img.src = contato.image

        div.append(img, nome)
        lista.appendChild(div)

        div.addEventListener('click', function () {
            numeroUsuarioAtual = numeroUsuario
            numeroContatoAtual = contato.number

            contatoConversa.style.display = 'block'
            usuarioInformacoes.style.display = 'none'
            conversasUsuarioContato(numeroUsuario, contato.number)
        })
    })
}


async function conversasUsuarioContato(numeroUsuario, numeroContato) {
    const url = `https://api-whatsapp-3dav.onrender.com/v1/whatsapp/chat/${numeroUsuario}/${numeroContato}`
    const response = await fetch(url)
    const dados = await response.json()

    mostrarConversa(dados.info[1])
}

async function mostrarConversa(conversa) {

    const informacaoContato = document.getElementById('foto_nome')
    informacaoContato.replaceChildren()

    const container = document.getElementById('conversa')

    const contatoImage = document.createElement('img')
    contatoImage.src = conversa.image

    const contatoNome = document.createElement('h3')
    contatoNome.textContent = conversa.name

    informacaoContato.append(contatoImage, contatoNome)


    container.replaceChildren()

    let mensagensParaListar

    if (Array.isArray(conversa.messages)) {
        mensagensParaListar = conversa.messages
    } else {
        mensagensParaListar = conversa
    }
    console.log(mensagensParaListar)

    mensagensParaListar.forEach(function (mensagem) {

        const mensagemCaixa = document.createElement('div')
        if (mensagem.sender === 'me') {
            mensagemCaixa.classList.add('mensagem_user')
        } else {
            mensagemCaixa.classList.add('mensagem_contact')
        }

        const p = document.createElement('p')
        p.textContent = mensagem.content

        const horario = document.createElement('span')
        horario.textContent = mensagem.time

        mensagemCaixa.append(p, horario)
        container.append(mensagemCaixa)
    })
}


async function pegarInformacoesUsuario(numeroUsuario) {
    const url = `https://api-whatsapp-3dav.onrender.com/v1/whatsapp/profile/${numeroUsuario}`
    const response = await fetch(url)
    const dados = await response.json()

    const background = document.getElementById('background')
    background.style.backgroundColor = dados.dados_do_perfil[0].background

    const buttonUser = document.getElementById('button_user')
    buttonUser.addEventListener('click', function () {
        contatoConversa.style.display = 'none'
        usuarioInformacoes.style.display = 'flex'
        usarInformacoesUsuarios(dados.dados_do_perfil[0])
    })
}

function usarInformacoesUsuarios(dadosUser) {
    console.log(dadosUser)
    const containerUser = document.getElementById('container_infos')

    containerUser.replaceChildren()

    const foto = document.createElement('img')
    foto.src = dadosUser.profileImage

    const divNomes = document.createElement('div')
    divNomes.classList.add('nomes')

    const nome = document.createElement('h2')
    nome.textContent = dadosUser.account

    const nickname = document.createElement('span')
    nickname.textContent = dadosUser.nickname

    const number = document.createElement('span')
    number.textContent = dadosUser.number

    divNomes.append(nome, nickname, number)
    containerUser.append(foto, divNomes)
}


async function opcoesUsuarios() {
    const url = `https://api-whatsapp-3dav.onrender.com/v1/whatsapp/users`
    const response = await fetch(url)
    const dados = await response.json()

    const usuarios = dados.informaçoes_dos_usuarios.filter(user => user.id)

    mostrarOpcoes(usuarios)

}

function mostrarOpcoes(listaUsuarios) {
    const container = document.getElementById('lista_usuarios')


    container.replaceChildren()

    const titulo = document.createElement('h2')
    titulo.textContent = 'Opções de Usuários'

    listaUsuarios.forEach(user => {

        const card = document.createElement('div')
        card.classList.add('card_usuario')

        const avatar = document.createElement('div')
        avatar.classList.add('avatar_usuario')
        avatar.style.backgroundColor = user.background
        avatar.style.backgroundImage = user.profile_image


        const info = document.createElement('div')
        info.classList.add('info_usuario')

        const nome = document.createElement('span')
        nome.classList.add('nome')
        nome.textContent = user.account

        const nick = document.createElement('span')
        nick.classList.add('nick')
        nick.textContent = user.nickname


        info.appendChild(nome)
        info.appendChild(nick)

        card.appendChild(avatar)
        card.appendChild(info)

        card.addEventListener('click', () => {
            listarContatos(user.number)
            pegarInformacoesUsuario(user.number)
        })

        container.append(card)
    })
}

const lupa = document.getElementById('lupa')
const barra = document.getElementById('barra')

lupa.addEventListener('click', () => {
    barra.style.display = "flex"
    barra.focus()
})

barra.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (barra.value === "") {
            conversasUsuarioContato(numeroUsuarioAtual, numeroContatoAtual)
        } else
            filtragemPalavra(numeroUsuarioAtual, numeroContatoAtual, barra.value)
    }
})

async function filtragemPalavra(numeroUsuario, numeroContato, palavra) {

    const url = `https://api-whatsapp-3dav.onrender.com/v1/whatsapp/chat?numero=${numeroUsuario}&contato=${numeroContato}&keyword=${palavra}`
    const response = await fetch(url)
    const dados = await response.json()
    mostrarConversa(dados.info[1].messages)

}



listarContatos("11987876567")
pegarInformacoesUsuario("11987876567")
opcoesUsuarios()