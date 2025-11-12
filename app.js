'use strict'



async function listarContatos(numeroUsuario) {
    const url = `https://api-whatsapp-2-b1z5.onrender.com/v1/whatsapp/${numeroUsuario}/contacts`
    const response = await fetch(url)
    const dados = await response.json()
    mostrarContatos(dados.contact)
}

async function mostrarContatos(lista) {
    const lista = document.getElementById('contatos')

    lista.replaceChildren()

    lista.forEach(contato => {
        const div = document.createElement('div')
        div.classList.add('contato')

        const nome = document.createElement('p')
        nome.textContent = contato.name

        const caixaFoto = document.createElement('div')
        caixaFoto.classList.add('foto')

        const img = document.createElement('img')
        img.src = contato.image

        div.append(caixaFoto, nome)
        caixaFoto.append(img)
        lista.appendChild(div)
    })
}


async function buscarConversasUsuarioContato(numeroContato) {
    const url = `https://api-whatsapp-2-b1z5.onrender.com/v1/whatsapp/conversation?numberUser=11987876567&numberContact=${numeroContato}`
    const response = await fetch(url)
    const dados = await response.json()
    mostrarConversa(dados.conversation[0])
}



listarContatos(numeroUsuario(11987876567))