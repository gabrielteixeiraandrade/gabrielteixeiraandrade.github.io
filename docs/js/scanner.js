const html5QrCode = new Html5Qrcode("reader");

const reader = document.getElementById("reader");
const mensagem = document.getElementById("mensagem");

const config = {
    fps: 15,
    qrbox: {
        width: 300,
        height: 150
    },
    aspectRatio: 1.777778
};

function abrirProduto(codigo){

    const produto = bancoDeDadosProdutos[codigo];

    if(produto){

        mensagem.className = "sucesso";
        mensagem.innerText =
            "Produto encontrado: " +
            produto.nome;

        setTimeout(() => {

            window.location.href =
                produto.pagina;

        }, 500);

    }else{

        mensagem.className = "erro";
        mensagem.innerText =
            "Código não cadastrado.";
    }
}

function onScanSuccess(decodedText){

    html5QrCode.stop()
    .then(() => {

        abrirProduto(decodedText);

    })
    .catch(error => {

        console.error(error);

        abrirProduto(decodedText);

    });

}

function startScanner(){

    reader.style.display = "block";

    Html5Qrcode.getCameras()
    .then(cameras => {

        if(cameras.length){

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                onScanSuccess
            );

        }else{

            alert(
                "Nenhuma câmera encontrada."
            );
        }

    })
    .catch(error => {

        alert(
            "Erro ao acessar câmera."
        );

        console.error(error);

    });

}

function buscarCodigoManual(){

    const codigo =
        document
        .getElementById("codigoManual")
        .value
        .trim();

    if(codigo === ""){

        alert(
            "Digite um código."
        );

        return;
    }

    if(!/^\d+$/.test(codigo)){

        alert(
            "Somente números são permitidos."
        );

        return;
    }

    abrirProduto(codigo);

}

document
.getElementById("btn-iniciar")
.addEventListener(
    "click",
    startScanner
);

document
.getElementById("btn-confirmar")
.addEventListener(
    "click",
    buscarCodigoManual
);