
const menu = document.getElementById("menu")
const botaoCarrinho = document.getElementById("botaoCarrinho")
const telaModal = document.getElementById("telaModal")
const telaModaltens = document.getElementById("telaModaltens")
const valorTotal = document.getElementById("valorTotal")
const enviarPedidoBotao = document.getElementById("enviarPedidoBotao")
const telaModalBotaoFechar = document.getElementById("telaModalBotaoFechar")
const contadorCarrinho = document.getElementById("contadorCarrinho")
const inputNome = document.querySelector("#inputNome")
const nomeAviso = document.querySelector("#nomeAviso")
const inputEndereco = document.getElementById("inputEndereco")
const enderecoAviso = document.querySelector("#enderecoAviso")
const spanHorarioFuncionamento = document.querySelector("#horarioFuncionamento")
const inputValorTotal = document.querySelector("#inputValorTotal")
const contratar = document.querySelector("#contratar")


//array
let carrinhos = []

//FUNCIONALIDADES
//AO CLICAR NO CARRINHO A TELA MODAL É EXIBIDA
botaoCarrinho.addEventListener('click', function () {
    atualizarTelaModalItens()
    telaModal.style.display = "flex"
})

//FECHA AO CLICAR FORA DA TELA MODAL
telaModal.addEventListener('click', function (event) {
    //se clicou fora da telaModal
    if (event.target === telaModal) {
        telaModal.style.display = 'none'
    }
})

//FECHA A TELA MODAL AO CLICAR NA OPÇÃO FECHAR
telaModalBotaoFechar.addEventListener('click', function () {
    telaModal.style.display = 'none'
})

//QUANDO CLICAR NO BOTÃO DE ADICIONAR PRODUTO NO CARRINHO
menu.addEventListener('click', function (event) {
    let clicouNoBotao = event.target.closest(".botaoAddNoCarrinho")//closest = mais proximo

    //se clicou
    if (clicouNoBotao) {

        //pegue os valores do produto
        let produtoNome = clicouNoBotao.getAttribute("data-name")
        let produtoPreco = parseFloat(clicouNoBotao.getAttribute("data-price")).toFixed(2)
        addNoCarrinho(produtoNome, produtoPreco)

    }
})

//FUNCAO ADD DADOS NO ARRAY CARRINHO
function addNoCarrinho(produtoNome, produtoPreco) {
    //primeiro verificar se nome do produto já existe na lista de carrinhos
    const produtoJaExiste = carrinhos.find(item => item.produtoNome === produtoNome)
    //se existe
    if (produtoJaExiste) {
        produtoJaExiste.quantidade += 1 //quantidade existente

    } else {
        carrinhos.push({
            produtoNome,
            produtoPreco,
            quantidade: 1//sempre será 1 em produtos recem lançados no carrino
        })
    }

    atualizarTelaModalItens()

}

function atualizarTelaModalItens() {
    telaModaltens.innerHTML = ""

    let valorTotalItem = 0
    let quantidade = 0

    carrinhos.forEach(item => {
        const novaDiv = document.createElement("div")

        novaDiv.innerHTML = `
        <div class="flex justify-between mb-4">
            
            <div>
                <p class="font-medium">0${item.quantidade}-${item.produtoNome}-R$ ${item.produtoPreco}</p>
               </div>
            <div>
                <button class="botaoAdicionar" data-name="${item.produtoNome}">
                    ( +1 )
                </button>
                <button class="botaoRemover px-4" data-name="${item.produtoNome}">
                    ( -1 )
                </button>
            </div>
            
        </div>
        `
        valorTotalItem += item.produtoPreco * item.quantidade

        quantidade += item.quantidade

        telaModaltens.appendChild(novaDiv)
    })
    //enviando para o contador carrinho a quantidade de itens
    contadorCarrinho.innerHTML = `${quantidade}`
    //enviando para o valor total o valor do pedido geral
    valorTotal.innerHTML = `${valorTotalItem.toLocaleString("pt-BR", {
        style: "currency", currency: "BRL"
    })}`
}

//pegando nome do produto ao clicar no botão remover
telaModaltens.addEventListener('click', function (event) {
    if (event.target.classList.contains("botaoAdicionar")) {
        const produto = event.target.getAttribute("data-name")
        adicionarProduto(produto)
    }

    if (event.target.classList.contains("botaoRemover")) {
        const nomeProduto = event.target.getAttribute("data-name")
        removerProduto(nomeProduto)
    }

})

function adicionarProduto(produto) {
    //ver se tem o produto dentro da lista carrinhos
    const index = carrinhos.findIndex(x => x.produtoNome === produto)

    if (index !== -1) {
        const produto = carrinhos[index]//pega o produto

        if (produto.quantidade >= 1) {
            produto.quantidade += 1
        }
        atualizarTelaModalItens()
    }
}

//função para excluir quantidade de produto ou excluir produto
function removerProduto(nomeProduto) {
    //verifica se nomeProduto existe dentro da lista
    const index = carrinhos.findIndex(posicaoX => posicaoX.produtoNome === nomeProduto)
    if (index !== -1) {//significa que o index é 0 ou outro numero ou seja o index existe!
        const produto = carrinhos[index]//pegando o produto pelo [index]
        if (produto.quantidade > 1) {
            produto.quantidade -= 1
            atualizarTelaModalItens()
            return
        } else {
            carrinhos.splice(index, 1)//exclui o index da lista
            atualizarTelaModalItens()
        }
    }

}

//verificar se algo foi digitado no input do endereço
inputEndereco.addEventListener('input', function (event) {
    let inputValor = event.target.value

    if (inputValor !== "") {
        inputEndereco.classList.remove("border-yellow-500")
        enderecoAviso.classList.add("hidden")
    }
})

//quando clicar em enviar pedido
enviarPedidoBotao.addEventListener("click", function (event) {
    const taAberto = horarioFuncionamento()

    if (!taAberto) {
        alert("ESTAMOS FECHADOS NO MOMENTO!")
        return//para sair do metodo parando a execução
    }

    if(inputNome.value===""){
        nomeAviso.classList.remove("hidden")
        inputNome.classList.add("border-yellow-500")
        return
    }

    //verificar se tem algo dentro do input
    if (inputEndereco.value === "") {//se o valor for em branco
        enderecoAviso.classList.remove("hidden")//faz aparecer a mensagem de aviso
        inputEndereco.classList.add("border-yellow-500")//add bordar em volta do input
        return
    }

    if (carrinhos.length === 0) {
        return//não faz nada
    }


    //enviar o pedido para api do whatsapp
    const carrinhoItens = carrinhos.map((itemAtual) => {
        return (
            `${itemAtual.quantidade} - ${itemAtual.produtoNome} R$ ${itemAtual.produtoPreco}`
        )
    }).join(" __ ")//escolhendo || para aparecer entre as strings

    const mensagem = encodeURIComponent(carrinhoItens)
    const telefone = "5599981402157"
    const endereco = inputEndereco.value
    const nome = inputNome.value


    const valorTotalCompra = valorTotal.innerText//obter conteudo do span

    //enviar para api do whatsapp com window.open
    window.open(`https://wa.me/${telefone}?text= ${mensagem} __ Total: ${valorTotalCompra} mais 3 reais (delivery) __ Cliente: ${nome} __ Endereço: ${endereco}`, "_blank")

    //apos enviar a mensagem vamos limpar o carrinho de produto
    carrinhos = [] //array vazio
    //agora vamos atualiar a tela modal de itens
    atualizarTelaModalItens()

})


//definir horario de funcionamento do estabelecimento
function horarioFuncionamento() {
    const data = new Date()
    const hora = data.getHours()


    return (hora >= 1 && hora < 23)

}

const taAberto = horarioFuncionamento()

if (taAberto) {
    spanHorarioFuncionamento.classList.remove("bg-red-600")
    spanHorarioFuncionamento.classList.add("bg-green-600")
} else {
    spanHorarioFuncionamento.classList.remove("bg-green-600")
    spanHorarioFuncionamento.classList.add("bg-red-600")
}

contratar.addEventListener("click", function (event){
    const telefone = 5599981402157
    const mensagem = "Olá tudo bem? quero contratar seu sistema para o meu negócio"
    window.open(`https://wa.me/${telefone}?text=${mensagem}`)
})
















