const html5QrCode =
    new Html5Qrcode("reader");

const mensagem =
    document.getElementById("mensagem");

const campoCodigo =
    document.getElementById(
        "codigoManual"
    );

const scannerContainer =
    document.getElementById(
        "scanner-container"
    );

let scannerAtivo = false;

const config = {

    fps:15,

    qrbox:{
        width:300,
        height:150
    },

    aspectRatio:1.777778
};

/* ==========================
   ABRIR PRODUTO
========================== */

function abrirProduto(codigo){

    console.log(
        "Código recebido:",
        codigo
    );

    const produto =
        bancoDeDadosProdutos[codigo];

    if(produto){

        mensagem.className =
            "sucesso";

        mensagem.innerHTML =
            `Produto encontrado:
             ${produto.nome}`;

        setTimeout(() => {

            window.location.href =
                produto.pagina;

        },500);

    }else{

        mensagem.className =
            "erro";

        mensagem.innerHTML = `
            Código não cadastrado.

            <br><br>

            <a
            href="https://precodahora.ba.gov.br/produtos?termo=${codigo}"
            target="_blank">

            Pesquisar no Preço da Hora

            </a>
        `;
    }
}

/* ==========================
   VALIDAÇÃO
========================== */

function buscarCodigoManual(){

    const codigo =
        campoCodigo.value.trim();

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

/* ==========================
   SCANNER USB
========================== */

let bufferScanner = "";
let ultimoEvento = Date.now();

document.addEventListener(
    "keydown",
    function(event){

        const agora =
            Date.now();

        if(
            agora - ultimoEvento > 100
        ){
            bufferScanner = "";
        }

        ultimoEvento = agora;

        if(
            /^[0-9]$/.test(event.key)
        ){

            bufferScanner +=
                event.key;
        }

        if(
            event.key === "Enter"
        ){

            if(
                bufferScanner.length >= 8
            ){

                campoCodigo.value =
                    bufferScanner;

                buscarCodigoManual();
            }

            bufferScanner = "";
        }
    }
);

/* ==========================
   ENTER NO CAMPO
========================== */

campoCodigo.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){

            event.preventDefault();

            buscarCodigoManual();
        }
    }
);

/* ==========================
   CÂMERA
========================== */

function onScanSuccess(
    decodedText
){

    fecharScanner();

    abrirProduto(
        decodedText
    );
}

function startScanner(){

    if(scannerAtivo)
        return;

    scannerAtivo = true;

    scannerContainer.style.display =
        "block";

    Html5Qrcode.getCameras()

    .then(cameras => {

        if(cameras.length){

            html5QrCode.start(

                {
                    facingMode:
                    "environment"
                },

                config,

                onScanSuccess

            );

        }else{

            alert(
                "Nenhuma câmera encontrada."
            );

            scannerAtivo = false;
        }

    })

    .catch(err => {

        console.error(err);

        alert(
            "Erro ao acessar câmera."
        );

        scannerAtivo = false;
    });
}

function fecharScanner(){

    if(!scannerAtivo){

        scannerContainer.style.display =
            "none";

        return;
    }

    html5QrCode.stop()

    .then(() => {

        scannerAtivo = false;

        scannerContainer.style.display =
            "none";

    })

    .catch(() => {

        scannerAtivo = false;

        scannerContainer.style.display =
            "none";
    });
}

/* ==========================
   BOTÕES
========================== */

document
.getElementById(
    "btn-iniciar"
)
.addEventListener(
    "click",
    startScanner
);

document
.getElementById(
    "btn-fechar-scanner"
)
.addEventListener(
    "click",
    fecharScanner
);

document
.getElementById(
    "btn-confirmar"
)
.addEventListener(
    "click",
    buscarCodigoManual
);
