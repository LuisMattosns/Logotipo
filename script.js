const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let textos = [
  { texto: "ALFHARI", x: 350, y: 180, tamanho: 70, angulo: 0, cor: "#00ffaa", estilo: "neon", icone: "nenhum", fonte: "Arial" },
  { texto: "CLUBE", x: 350, y: 260, tamanho: 40, angulo: 0, cor: "#00ffaa", estilo: "normal", icone: "nenhum", fonte: "Arial" }
]

let textoAtivo = 0
let dragging = false
let modoExportacao = false

// ================= FUNÇÕES =================

function gerarLogo(){

textos[0].texto = document.getElementById("nome").value || ""
textos[1].texto = document.getElementById("nome2").value || ""

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.fillStyle = "#111"
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

if(ativo && !modoExportacao){
let largura = ctx.measureText(t.texto).width
ctx.strokeStyle = "#fff"
ctx.strokeRect(-largura/2, -t.tamanho/2, largura, t.tamanho)
}

ctx.restore()
}

// ================= DETECÇÃO =================

function getTextAt(x,y){

for(let i = textos.length -1; i>=0; i--){
let t = textos[i]

ctx.font = "bold " + t.tamanho + "px " + t.fonte
let w = ctx.measureText(t.texto).width

if(
x > t.x - w/2 &&
x < t.x + w/2 &&
y > t.y - t.tamanho/2 &&
y < t.y + t.tamanho/2
){
return i
}
}
return null
}

// ================= DESKTOP =================

canvas.addEventListener("mousedown",(e)=>{
let i = getTextAt(e.offsetX, e.offsetY)
if(i !== null){
textoAtivo = i
dragging = true
}
})

canvas.addEventListener("mouseup",()=> dragging = false)

canvas.addEventListener("mousemove",(e)=>{
if(dragging){
textos[textoAtivo].x = e.offsetX
textos[textoAtivo].y = e.offsetY
gerarLogo()
}
})

canvas.addEventListener("wheel",(e)=>{
e.preventDefault()

let t = textos[textoAtivo]

t.tamanho += (e.deltaY < 0 ? 5 : -5)
t.tamanho = Math.max(20, Math.min(200, t.tamanho))

gerarLogo()
})

// ================= MOBILE TOUCH =================

let startDist = null

canvas.addEventListener("touchstart",(e)=>{

const rect = canvas.getBoundingClientRect()

const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width)
const y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)

let i = getTextAt(x,y)
if(i !== null){
textoAtivo = i
}

if(e.touches.length === 2){
startDist = getDist(e)
}

},{passive:false})

canvas.addEventListener("touchmove",(e)=>{

e.preventDefault()

const rect = canvas.getBoundingClientRect()

// mover
if(e.touches.length === 1){

textos[textoAtivo].x =
(e.touches[0].clientX - rect.left) * (canvas.width / rect.width)

textos[textoAtivo].y =
(e.touches[0].clientY - rect.top) * (canvas.height / rect.height)

}

// zoom
if(e.touches.length === 2){

let newDist = getDist(e)

if(startDist){
let diff = newDist - startDist
textos[textoAtivo].tamanho += diff * 0.2
}

startDist = newDist
}

gerarLogo()

},{passive:false})

canvas.addEventListener("touchend",()=>{
startDist = null
})

function getDist(e){
let dx = e.touches[0].clientX - e.touches[1].clientX
let dy = e.touches[0].clientY - e.touches[1].clientY
return Math.sqrt(dx*dx + dy*dy)
}

// ================= CONTROLES =================

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

gerarLogo()
