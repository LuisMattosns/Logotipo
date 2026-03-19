const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let textos = [
  { texto: "ALFHARI", x: 350, y: 180, tamanho: 70, angulo: 0, cor: "#00ffaa", estilo: "neon", icone: "nenhum", fonte: "Arial" },
  { texto: "CLUBE", x: 350, y: 260, tamanho: 40, angulo: 0, cor: "#00ffaa", estilo: "normal", icone: "nenhum", fonte: "Arial" }
]

let textoAtivo = 0
let dragging = false

// 🔥 NOVO: controle de exportação
let modoExportacao = false

function gerarLogo(){

let bgcolor = document.getElementById("bgcolor").value

let cor1 = document.getElementById("bgcolor1")?.value
let cor2 = document.getElementById("bgcolor2")?.value
let anguloBg = document.getElementById("bgangle")?.value

textos[0].texto = document.getElementById("nome").value || ""
textos[1].texto = document.getElementById("nome2").value || ""

ctx.clearRect(0,0,canvas.width,canvas.height)

if(cor1 && cor2 && anguloBg){

let rad = anguloBg * Math.PI / 180

let x = Math.cos(rad)
let y = Math.sin(rad)

let grad = ctx.createLinearGradient(
  canvas.width/2 - x * canvas.width,
  canvas.height/2 - y * canvas.height,
  canvas.width/2 + x * canvas.width,
  canvas.height/2 + y * canvas.height
)

grad.addColorStop(0, cor1)
grad.addColorStop(0.5, cor1)
grad.addColorStop(0.5, cor2)
grad.addColorStop(1, cor2)

ctx.fillStyle = grad

}else{
ctx.fillStyle = bgcolor
}

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
ctx.shadowOffsetX = 0
ctx.shadowOffsetY = 0

if(t.estilo === "neon"){
ctx.shadowColor = t.cor
ctx.shadowBlur = 20
}

if(t.estilo === "shadow"){
ctx.shadowColor = "black"
ctx.shadowBlur = 10
ctx.shadowOffsetX = 5
ctx.shadowOffsetY = 5
}

if(t.estilo === "outline"){
ctx.strokeStyle = t.cor
ctx.lineWidth = 2
ctx.strokeText(t.texto,0,0)
}

if(t.estilo === "3d"){
ctx.fillStyle = "black"
ctx.fillText(t.texto,3,3)
}

ctx.fillStyle = t.cor
ctx.fillText(t.texto,0,0)

// 🔥 ÍCONES
let tamanhoIcone = 30
ctx.fillStyle = t.cor

if(t.icone === "estrela"){
  desenharEstrela(ctx, 0, -t.tamanho, 5, tamanhoIcone, tamanhoIcone/2)
}

if(t.icone === "círculo"){
  ctx.beginPath()
  ctx.arc(0, -t.tamanho, tamanhoIcone/2, 0, Math.PI * 2)
  ctx.fill()
}

if(t.icone === "triângulo"){
  ctx.beginPath()
  ctx.moveTo(0, -t.tamanho - tamanhoIcone)
  ctx.lineTo(-tamanhoIcone/2, -t.tamanho)
  ctx.lineTo(tamanhoIcone/2, -t.tamanho)
  ctx.closePath()
  ctx.fill()
}

if(t.icone === "diamante"){
  ctx.beginPath()
  ctx.moveTo(0, -t.tamanho - tamanhoIcone)
  ctx.lineTo(-tamanhoIcone/2, -t.tamanho)
  ctx.lineTo(0, -t.tamanho + tamanhoIcone)
  ctx.lineTo(tamanhoIcone/2, -t.tamanho)
  ctx.closePath()
  ctx.fill()
}

// 🔥 CORREÇÃO: NÃO DESENHAR BOX NA EXPORTAÇÃO
if(ativo && !modoExportacao){
let largura = ctx.measureText(t.texto).width
ctx.strokeStyle = "#ffffff"
ctx.lineWidth = 1
ctx.strokeRect(-largura/2, -t.tamanho/2, largura, t.tamanho)
}

ctx.restore()
}

function desenharEstrela(ctx, x, y, pontas, raioExterno, raioInterno){
let rot = Math.PI / 2 * 3
let step = Math.PI / pontas

ctx.beginPath()
ctx.moveTo(x, y - raioExterno)

for(let i = 0; i < pontas; i++){
  ctx.lineTo(
    x + Math.cos(rot) * raioExterno,
    y + Math.sin(rot) * raioExterno
  )
  rot += step

  ctx.lineTo(
    x + Math.cos(rot) * raioInterno,
    y + Math.sin(rot) * raioInterno
  )
  rot += step
}

ctx.closePath()
ctx.fill()
}

canvas.addEventListener("click",(e)=>{

let x = e.offsetX
let y = e.offsetY

textos.forEach((t, i)=>{

ctx.font = "bold " + t.tamanho + "px " + t.fonte
let largura = ctx.measureText(t.texto).width

if(
x > t.x - largura/2 &&
x < t.x + largura/2 &&
y > t.y - t.tamanho/2 &&
y < t.y + t.tamanho/2
){
textoAtivo = i
}

})

gerarLogo()

})

canvas.addEventListener("mousedown",()=> dragging = true)
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

if(e.deltaY < 0){
t.tamanho += 5
}else{
t.tamanho -= 5
}

if(t.tamanho < 20) t.tamanho = 20
if(t.tamanho > 200) t.tamanho = 200

gerarLogo()
})

document.addEventListener("keydown",(e)=>{

let t = textos[textoAtivo]

if(e.key === "ArrowLeft") t.angulo -= 0.1
if(e.key === "ArrowRight") t.angulo += 0.1

gerarLogo()

})

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
textos[textoAtivo].icone = e.target.value.toLowerCase()
gerarLogo()
})

// 🔥 CORREÇÃO AQUI
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

function logoAleatorio(){

let cores = ["#ac033b","#63e5ba","#ffaa00","#00aaff","#ff00ff","#55ff55","#ff5555","#5555ff","#ffff55","#55ffff"]
let estilos = ["normal","neon","shadow","3d","outline"]
let nomes = ["Nexora","Veltrix","Zenthix","Lumora","Axion","Vortex","Neonix","Aether","Solara","Cryptix","Zenith","NovaCore","Eclipse","Nebula","Quantum","Vortexa","Lumina","Aetheris","Solstice","Crypton"]

let cor = cores[Math.floor(Math.random() * cores.length)] || "#ffffff"
let estilo = estilos[Math.floor(Math.random() * estilos.length)]
let nome = nomes[Math.floor(Math.random() * nomes.length)]

document.getElementById("nome").value = nome
document.getElementById("cor").value = cor
document.getElementById("estilo").value = estilo

textos.forEach(t => {
  t.cor = cor
  t.estilo = estilo
  t.angulo = Math.random() * 2 - 1
  t.tamanho = 50 + Math.random()*80
})

let bgCores = ["#111","#055438","#0a1f52","#89114b","#1a1a1a","#2b2b2b","#3c3c3c","#4d4d4d","#5e5e5e","#6f6f6f"]
document.getElementById("bgcolor").value =
bgCores[Math.floor(Math.random()*bgCores.length)]

gerarLogo()
}

gerarLogo()