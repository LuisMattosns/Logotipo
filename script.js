const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let textos = [
  { texto: "ALFHARI", x: 350, y: 180, tamanho: 70, angulo: 0, cor: "#00ffaa", estilo: "neon", icone: "nenhum", fonte: "Arial" },
  { texto: "CLUBE", x: 350, y: 260, tamanho: 40, angulo: 0, cor: "#00ffaa", estilo: "normal", icone: "nenhum", fonte: "Arial" }
]

let textoAtivo = 0
let dragging = false
let startDist = null

// ================= DESENHO =================

function gerarLogo(){

textos[0].texto = document.getElementById("nome").value || ""
textos[1].texto = document.getElementById("nome2").value || ""

let bg = document.getElementById("bgcolor").value

ctx.clearRect(0,0,canvas.width,canvas.height)
ctx.fillStyle = bg
ctx.fillRect(0,0,canvas.width,canvas.height)

textos.forEach((t,i)=>{
if(t.texto.trim() !== ""){
desenharTexto(t, i === textoAtivo)
}
})

}

function desenharTexto(t, ativo){

ctx.save()

ctx.translate(t.x, t.y)
ctx.rotate(t.angulo)

ctx.font = "bold " + t.tamanho + "px " + t.fonte
ctx.textAlign = "center"
ctx.textBaseline = "middle"

// reset sombra
ctx.shadowBlur = 0
ctx.shadowColor = "transparent"

// estilos
if(t.estilo === "neon"){
ctx.shadowColor = t.cor
ctx.shadowBlur = 20
}

ctx.fillStyle = t.cor
ctx.fillText(t.texto,0,0)

// 🔥 ÍCONES CORRIGIDOS
ctx.beginPath()
ctx.shadowBlur = 0 // evita bug visual

let y = -t.tamanho

if(t.icone === "circulo"){
ctx.arc(0,y,10,0,Math.PI*2)
ctx.fill()
}

if(t.icone === "triangulo"){
ctx.moveTo(0,y-10)
ctx.lineTo(-10,y+10)
ctx.lineTo(10,y+10)
ctx.closePath()
ctx.fill()
}

if(t.icone === "diamante"){
ctx.moveTo(0,y-10)
ctx.lineTo(-10,y)
ctx.lineTo(0,y+10)
ctx.lineTo(10,y)
ctx.closePath()
ctx.fill()
}

if(t.icone === "estrela"){
ctx.arc(0,y,10,0,Math.PI*2)
ctx.fill()
}

if(t.icone === "lampada"){
ctx.arc(0,y,8,0,Math.PI*2)
ctx.fill()
ctx.fillRect(-3,y+8,6,6)
}

if(t.icone === "coroa"){
ctx.moveTo(-12,y+10)
ctx.lineTo(-6,y-10)
ctx.lineTo(0,y+5)
ctx.lineTo(6,y-10)
ctx.lineTo(12,y+10)
ctx.closePath()
ctx.fill()
}

// caixa seleção
if(ativo){
let w = ctx.measureText(t.texto).width
ctx.strokeStyle = "#fff"
ctx.strokeRect(-w/2, -t.tamanho/2, w, t.tamanho)
}

ctx.restore()
}

// ================= DETECÇÃO =================

function getTextAt(x,y){

for(let i=textos.length-1;i>=0;i--){
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

// ================= MOUSE =================

canvas.addEventListener("mousedown",(e)=>{
let i = getTextAt(e.offsetX,e.offsetY)
if(i!==null){
textoAtivo = i
dragging = true
}
})

canvas.addEventListener("mouseup",()=> dragging=false)

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
t.tamanho += e.deltaY < 0 ? 5 : -5
t.tamanho = Math.max(20, Math.min(200, t.tamanho))

gerarLogo()
})

// ================= TOUCH =================

canvas.addEventListener("touchstart",(e)=>{

e.preventDefault()

const rect = canvas.getBoundingClientRect()

const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width)
const y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height)

let i = getTextAt(x,y)
if(i!==null){
textoAtivo = i
dragging = true
}

if(e.touches.length === 2){
startDist = getDist(e)
}

},{passive:false})

canvas.addEventListener("touchmove",(e)=>{

e.preventDefault()

const rect = canvas.getBoundingClientRect()

if(e.touches.length === 1 && dragging){

textos[textoAtivo].x =
(e.touches[0].clientX - rect.left) * (canvas.width / rect.width)

textos[textoAtivo].y =
(e.touches[0].clientY - rect.top) * (canvas.height / rect.height)

}

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
dragging=false
startDist=null
})

// distância pinch
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

document.getElementById("icone").addEventListener("change",(e)=>{
textos[textoAtivo].icone = e.target.value
gerarLogo()
})

// download
function baixarLogo(){
let link = document.createElement("a")
link.download = "logo.png"
link.href = canvas.toDataURL()
link.click()
}

gerarLogo()
