console.log("Olá, mundo!");

//FUNCÕES
//Só executa
function teste(){
    console.log("Funciona!");
}
teste();

console.log(teste);

// Com parâmetros
function teste2(parametro){
    console.log("O parametro é: ", parametro);
}
teste2("Arroz");

//com retorno
function media(n1, n2){
    var resultado = n1 + n2
    resultado = resultado / 2 
    return resultado
}

console.log(media(3,4));

var mediaFinal = media(8,6)
console.log("Média:", mediaFinal);´

//FUNÇÃO ANÔNIMA
//É uma função que não tem nome, e seu retorno é agurdado em uma variável

var mensagem = function (){
        console.log("OI, MEU CHAPA")
}

// Mostra o texto da função
console.log(mensagem);

// Apenas guarda o texto da função, sem executar
mensagem

// Executa a função
mensagem()


// ARROW FUNCTION - FUNÇÃO DE SETA

const multiplicar = (x,y) => {
    return x * y
}

console.log("Sua multiplicação deu: ", multiplicar(7,6));

// mais menos ainda
//quando só tem uma linha de retorno, o return pode ser omitido e fica uma linha só
const dobro = numero => numero * 2

console.log("O dobro é: ", dobro(4));
