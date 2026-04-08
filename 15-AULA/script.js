//VAMO Q VAMO
console.log("VAMO Q VAMO")


//LAÇOS DE REPETIÇÃO

//FOR = PARA
//i = variáviel de controle
//i < 5 = duração dp laço
// i++ = aumenta de 1 em 1
/*
for(var i = 0; i < 5; i++ ){
    console.log("Estou aqui no laço")
}

console.log("Acabou o laço")

//while = ENQUANTO
var c = 1

//(coloca a condição pra entrar no loop)
while(c < 10){
    console.log("Oi, meu chapa")
    // Se não tiver algo pra tirar do loop
    // ele fica aqui pra sempre
    c++
}

console.log("Finalizei o loop denovo")

// ARRAY
var array = ["Neymar", 10, true, 5.0]

console.log(array)

// mostrar um elemento específico
console.log(array[2])

array[2] = "jogador"

//mostra todo o array
console.log(array)

*/

// COMENTEI TUDO

/*/ Lista de times top (mais ou menos)
var times = ["BRASIL", "REAL Madrid", "Gama", "Santos", "Paysandu"]

for(var i = 0; i < 3; i++){
    console.log("o time atual é:", times[i])
}

// length - descobre o tamanho do array
console.log(times.length);

console.log('--------------------------')
//faz a repetiçao até o fim do array
//idenpedente do tamanho, com o .length
for(var i = 0; i < times.length; i++){
    console.log("O time atual é:", times[i])
}

console.log('--------------------------')
// FOR ESPECIFICO DE ARRAY
// index - guarda o valor do indice
// in - usa o valor do indice pra mostrar o elemento
// times - define o array
for(var index in times){
    console.log(times[index])
}

// of - já sabe o valor do elemento
for(var index of times){
    console.log(times[index])
}


*/



// FUNÇÕES PRA INTERAGIR COM UM ARRAY
var frutas = ["Maçã", "Pêra", "Banana"]

//mostra o array
console.log(frutas);




// push() - ADICIONA NO FINAL DO ARRAY
frutas.push("Uva")

// mostra o array
console.log(frutas);


// unshift - diciona o inicio do array
frutas.unshift("Laranja")

//mostra o array
console.log(frutas);

//PRAREMOÇãO DE ELEMENTOS
// pop - remove o último elemento
var frutasTiradas = frutas.pop()
console.log("Frutas removida:", frutasTiradas)

// Shift - remove o primeiro elemento
var exPrimeiraFruta = frutas.shift()
console.log("Ex primeira fruta:", exPrimeiraFruta);


// descobrir o index de um elemento
var index = frutas.indexOf("Pêra")
console.log("O index dele é:", index);

//descobrir se há um valor específivo no array
console.log("Tem pitumba?", frutas.includes("Pitu"))
console.log("Tem maçã?", frutas.includes("Maçã"))

//ordena os elementos
frutas.sort()
console.log(frutas)

//inverte a ordem dos elementos do array
frutas.reverse()
console.log(frutas)

//convertendo o array pra string
//converte todo o array
console.log("Convertido:", frutas.toString());

//junta um array, ou converte colocando um separador
console.log("Convertido:", frutas.join(" - "));


// SLICE - copia parte do array
var copiaParte = frutas.slice(0, 2)
console.log("Cópia", copiaParte)

// SPLICE
// PRA REMOVER
var removidos = frutas.splice(1,1)
console.log("Após remoção:",frutas)

// PRA ADICIONAR
frutas.splice(1,0, "Pitaya", "Melancia", "Morango")
console.log("Após adição:", frutas)
