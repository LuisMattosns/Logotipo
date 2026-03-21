const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let textos = [
  { texto: "ALFHARI", x: 350, y: 180, tamanho: 70, angulo: 0, cor: "#00ffaa", estilo: "neon", icone: "nenhum", fonte: "Arial" },
  { texto: "CLUBE", x: 350, y: 260, tamanho: 40, angulo: 0, cor: "#00ffaa", estilo: "normal", icone: "nenhum", fonte: "Arial" }
]

let textoAtivo = 0
let dragging = false
let modoExportacao = false

function gerarLogo(){

textos[0].texto = document.getElementById("nome").value || ""
textos[1].texto = document.getElementById("nome2").value || ""

let bg = document.getElementById("bgcolor").value

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.fillStyle = bg
ctx.fillRect(0,0,canvas.width,canvas.height)

textos.forEach((t, index)=>{
if(t.texto.trim() !== ""){
desenharTexto(t, index === textoAtivo)
}
})

}

function desenharTexto(t, ativo){

ctx.save()

ctx.translate(t.x, t.y)
ctx.rotate(t.angulo)

ctx.textAlign = "center"
ctx.textBaseline = "middle"
ctx.font = "bold " + t.tamanho + "px " + t.fonte

ctx.shadowBlur = 0

if(t.estilo === "neon"){
ctx.shadowColor = t.cor
ctx.shadowBlur = 20
}

ctx.fillStyle = t.cor
ctx.fillText(t.texto,0,0)

// ÍCONES
let yIcon = -t.tamanho

if(t.icone === "estrela") desenharEstrela(0,yIcon)
if(t.icone === "diamante") desenharDiamante(0,yIcon)
if(t.icone === "triangulo") desenharTriangulo(0,yIcon)
if(t.icone === "circulo") desenharCirculo(0,yIcon)
if(t.icone === "lampada") desenharLampada(0,yIcon)
if(t.icone === "coroa") desenharCoroa(0,yIcon)

if(ativo && !modoExportacao){
let largura = ctx.measureText(t.texto).width
ctx.strokeStyle = "#fff"
ctx.strokeRect(-largura/2, -t.tamanho/2, largura, t.tamanho)
}

ctx.restore()
}

// ================= ÍCONES =================

function desenharCirculo(x,y){
ctx.beginPath()
ctx.arc(x,y,12,0,Math.PI*2)
ctx.fill()
}

function desenharTriangulo(x,y){
ctx.beginPath()
ctx.moveTo(x,y-12)
ctx.lineTo(x-12,y+12)
ctx.lineTo(x+12,y+12)
ctx.closePath()
ctx.fill()
}

function desenharDiamante(x,y){
ctx.beginPath()
ctx.moveTo(x,y-12)
ctx.lineTo(x-12,y)
ctx.lineTo(x,y+12)
ctx.lineTo(x+12,y)
ctx.closePath()
ctx.fill()
}

function desenharEstrela(x,y){
ctx.beginPath()
ctx.arc(x,y,12,0,Math.PI*2)
ctx.fill()
}

function desenharLampada(x,y){
ctx.beginPath()
ctx.arc(x,y,10,0,Math.PI*2)
ctx.fill()
ctx.fillRect(x-3,y+10,6,6)
}

function desenharCoroa(x,y){
ctx.beginPath()
ctx.moveTo(x-12,y+10)
ctx.lineTo(x-6,y-10)
ctx.lineTo(x,y+5)
ctx.lineTo(x+6,y-10)
ctx.lineTo(x+12,y+10)
ctx.closePath()
ctx.fill()
}

// ================= CONTROLES =================

function baixarLogo(){
modoExportacao = true
gerarLogo()

let link = document.createElement("a")
link.download = "logo.png"
link.href = canvas.toDataURL()
link.click()

modoExportacao = false
gerarLogo()
}

document.getElementById("cor").addEventListener("input",(e)=>{
textos[textoAtivo].cor = e.target.value
gerarLogo()
})

document.getElementById("estilo").addEventListener("change",(e)=>{
textos[textoAtivo].estilo = e.target.value
gerarLogo()
})

document.getElementById("fonte").addEventListener("change",(e)=>{
textos[textoAtivo].fonte = e.target.value
gerarLogo()
})

document.getElementById("icone").addEventListener("change",(e)=>{
textos[textoAtivo].icone = e.target.value
gerarLogo()
})

// resto do touch/mouse continua igual (mantém o que já te mandei)

gerarLogo()
