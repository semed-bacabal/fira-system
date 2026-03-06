import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import { QRCodeSVG } from "qrcode.react"

export default function EquipeDetalhe(){

const { id } = useParams()

const [equipe,setEquipe] = useState(null)
const [membros,setMembros] = useState([])

const [nome,setNome] = useState("")
const [cpf,setCpf] = useState("")
const [dataNascimento,setDataNascimento] = useState("")
const [foto,setFoto] = useState(null)

const [escudo,setEscudo] = useState(null)
const [fotoTecnico,setFotoTecnico] = useState(null)

const [previewEscudo,setPreviewEscudo] = useState(null)
const [previewTecnico,setPreviewTecnico] = useState(null)

const [msgEscudo,setMsgEscudo] = useState("")
const [msgTecnico,setMsgTecnico] = useState("")
const [mensagem,setMensagem] = useState("")

useEffect(()=>{
fetchEquipe()
fetchMembros()
},[])

async function fetchEquipe(){

const { data } = await supabase
.from("teams")
.select("*")
.eq("id",id)
.single()

setEquipe(data)

}

async function fetchMembros(){

const { data } = await supabase
.from("team_members")
.select("*")
.eq("team_id",id)
.order("created_at",{ascending:false})

setMembros(data || [])

}

async function uploadEscudo(){

if(!escudo){
setMsgEscudo("Selecione uma imagem.")
return
}

const fileName = `escudo-${id}-${Date.now()}`

const { error } = await supabase.storage
.from("team-escudos")
.upload(fileName,escudo,{upsert:true})

if(error){
setMsgEscudo("Erro ao enviar escudo.")
return
}

const { data } = supabase.storage
.from("team-escudos")
.getPublicUrl(fileName)

await supabase
.from("teams")
.update({escudo_url:data.publicUrl})
.eq("id",id)

setMsgEscudo("Escudo atualizado!")

fetchEquipe()

setTimeout(()=>setMsgEscudo(""),3000)

}

async function uploadFotoTecnico(){

if(!fotoTecnico){
setMsgTecnico("Selecione uma imagem.")
return
}

const fileName = `tecnico-${id}-${Date.now()}`

const { error } = await supabase.storage
.from("team-tecnicos")
.upload(fileName,fotoTecnico,{upsert:true})

if(error){
setMsgTecnico("Erro ao enviar foto.")
return
}

const { data } = supabase.storage
.from("team-tecnicos")
.getPublicUrl(fileName)

await supabase
.from("teams")
.update({foto_tecnico:data.publicUrl})
.eq("id",id)

setMsgTecnico("Foto do técnico atualizada!")

setTimeout(()=>setMsgTecnico(""),3000)

}

async function adicionarMembro(e){

e.preventDefault()

if(membros.length >= 4){
setMensagem("Limite máximo de 4 participantes.")
return
}

if(!nome || !cpf || !dataNascimento || !foto){
setMensagem("Preencha todos os campos.")
return
}

const fileName = `${id}-${Date.now()}-${foto.name}`

const { error:uploadError } = await supabase.storage
.from("team-participantes")
.upload(fileName,foto,{upsert:true})

if(uploadError){
setMensagem("Erro ao enviar foto.")
return
}

const { data } = supabase.storage
.from("team-participantes")
.getPublicUrl(fileName)

const { error } = await supabase
.from("team_members")
.insert([
{
team_id:id,
nome,
cpf,
data_nascimento:dataNascimento,
foto_url:data.publicUrl
}
])

if(error){
setMensagem("Erro ao adicionar participante.")
return
}

setMensagem("Participante adicionado!")

setNome("")
setCpf("")
setDataNascimento("")
setFoto(null)

fetchMembros()

}

async function excluirMembro(idMembro){

await supabase
.from("team_members")
.delete()
.eq("id",idMembro)

fetchMembros()

}

function imprimirQRCode(){

const qrUrl = `${window.location.origin}/monitor/${equipe.qr_token}`

const janela = window.open("", "_blank")

janela.document.write(`
<html>
<head>
<style>
@page{size:50mm 50mm;margin:0}
body{margin:0;text-align:center;font-family:Arial}
.etiqueta{width:50mm;height:50mm;display:flex;flex-direction:column;justify-content:center;align-items:center}
img{width:30mm}
</style>
</head>
<body>
<div class="etiqueta">
<strong>${equipe.nome}</strong>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrUrl}">
</div>
</body>
</html>
`)

janela.document.close()

setTimeout(()=>{
janela.print()
janela.close()
},500)

}

if(!equipe) return <div className="container mt-5">Carregando...</div>

return(

<div className="container mt-5">

<h2 className="mb-3">{equipe.nome}</h2>

<p><strong>Evento:</strong> {equipe.evento}</p>

{/* QR CODE */}

{equipe.qr_token && (

<div className="card p-4 mb-4 text-center shadow-sm">

<h5>QR Code da Equipe</h5>

<QRCodeSVG
value={`${window.location.origin}/monitor/${equipe.qr_token}`}
size={180}
/>

<button
className="btn btn-dark mt-3"
onClick={imprimirQRCode}
>
Imprimir Etiqueta
</button>

</div>

)}

{/* ESCUDO */}

<div className="card p-3 mb-4 shadow-sm">

<h5>Escudo da Equipe</h5>

<input
type="file"
className="form-control mb-2"
accept="image/*"
onChange={(e)=>{

const file = e.target.files[0]

setEscudo(file)

if(file){
setPreviewEscudo(URL.createObjectURL(file))
}

}}
/>

{previewEscudo && (
<img
src={previewEscudo}
style={{width:"120px"}}
className="mb-2 rounded"
/>
)}

<button
className="btn btn-primary"
onClick={uploadEscudo}
>
Salvar Escudo
</button>

{msgEscudo && (
<div className="alert alert-info mt-2">
{msgEscudo}
</div>
)}

</div>

{/* FOTO TECNICO */}

<div className="card p-3 mb-4 shadow-sm">

<h5>Foto do Técnico</h5>

<input
type="file"
className="form-control mb-2"
accept="image/*"
onChange={(e)=>{

const file = e.target.files[0]

setFotoTecnico(file)

if(file){
setPreviewTecnico(URL.createObjectURL(file))
}

}}
/>

{previewTecnico && (
<img
src={previewTecnico}
style={{width:"120px"}}
className="mb-2 rounded"
/>
)}

<button
className="btn btn-primary"
onClick={uploadFotoTecnico}
>
Salvar Foto
</button>

{msgTecnico && (
<div className="alert alert-info mt-2">
{msgTecnico}
</div>
)}

</div>

{/* PARTICIPANTES */}

<h4 className="mb-3">Participantes ({membros.length}/4)</h4>

<form onSubmit={adicionarMembro} className="card p-3 mb-4 shadow-sm">

<input
className="form-control mb-2"
placeholder="Nome"
value={nome}
onChange={(e)=>setNome(e.target.value)}
/>

<input
className="form-control mb-2"
placeholder="CPF"
value={cpf}
onChange={(e)=>setCpf(e.target.value)}
/>

<input
type="date"
className="form-control mb-2"
value={dataNascimento}
onChange={(e)=>setDataNascimento(e.target.value)}
/>

<input
type="file"
className="form-control mb-2"
accept="image/*"
onChange={(e)=>setFoto(e.target.files[0])}
/>

<button className="btn btn-success">
Adicionar Participante
</button>

</form>

{mensagem && (
<div className="alert alert-info">
{mensagem}
</div>
)}

{/* LISTA MEMBROS */}

{membros.map(m=>(
<div key={m.id} className="card p-2 mb-2 shadow-sm">

{m.foto_url && (
<img
src={m.foto_url}
width="80"
className="rounded mb-2"
/>
)}

<strong>{m.nome}</strong>

<br/>

CPF: {m.cpf}

<br/>

Nascimento: {m.data_nascimento}

<br/>

<button
className="btn btn-danger btn-sm mt-2"
onClick={()=>excluirMembro(m.id)}
>
Excluir
</button>

</div>
))}

</div>

)

}