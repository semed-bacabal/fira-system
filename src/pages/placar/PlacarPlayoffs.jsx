import { useEffect, useState } from "react"
import { supabase } from "../../services/supabaseClient"
import confetti from "canvas-confetti"

export default function PlacarPlayoffs(){

const [eventos,setEventos] = useState([])
const [categorias,setCategorias] = useState([])
const [provas,setProvas] = useState([])

const [eventoId,setEventoId] = useState("")
const [categoriaId,setCategoriaId] = useState("")
const [provaId,setProvaId] = useState("")
const [fase,setFase] = useState("")

const [matches,setMatches] = useState([])
const [animar,setAnimar] = useState(false)

const [campeao,setCampeao] = useState(null)

const fases = [
"oitavas",
"quartas",
"semifinal",
"final"
]

useEffect(()=>{
fetchEventos()
},[])

useEffect(()=>{
if(eventoId){
fetchCategorias()
fetchProvas()
}
},[eventoId])

/* REALTIME */
useEffect(()=>{

if(!provaId) return

let channel

async function iniciar(){

  await fetchMatches()

  channel = supabase
  .channel(`placar-playoffs-${provaId}`)

  .on(
    "postgres_changes",
    {
      event:"*",
      schema:"public",
      table:"matches",
      filter:`prova_id=eq.${provaId}`
    },
    ()=>{
      fetchMatches()
    }
  )

  .subscribe()

}

iniciar()

return ()=>{
if(channel){
supabase.removeChannel(channel)
}
}

},[provaId])

/* confetes por 20 segundos */
function explosaoCampeao(){

const duracao = 20000
const fim = Date.now() + duracao

function frame(){

confetti({
particleCount:6,
angle:60,
spread:70,
origin:{x:0}
})

confetti({
particleCount:6,
angle:120,
spread:70,
origin:{x:1}
})

if(Date.now() < fim){
requestAnimationFrame(frame)
}

}

frame()

}

async function fetchEventos(){

const {data} = await supabase
.from("events")
.select("*")
.order("nome")

setEventos(data || [])

}

async function fetchCategorias(){

const {data} = await supabase
.from("categories")
.select("*")
.eq("event_id",eventoId)
.order("nome")

setCategorias(data || [])

}

async function fetchProvas(){

const {data} = await supabase
.from("provas")
.select("*")
.eq("event_id",eventoId)
.order("nome")

setProvas(data || [])

}

async function fetchMatches(){

const {data,error} = await supabase
.from("matches")
.select(`
*,
team1:teams!team1_id(nome),
team2:teams!team2_id(nome)
`)
.eq("prova_id",provaId)

if(error){
console.log(error)
return
}

setMatches(data || [])

/* detectar campeão */
const final = data?.find(m => m.fase === "final")

if(final && final.score1 != null && final.score2 != null){

const vencedor =
final.score1 > final.score2
? final.team1?.nome
: final.team2?.nome

setCampeao(vencedor)

explosaoCampeao()

}else{
setCampeao(null)
}

setAnimar(true)

setTimeout(()=>{
setAnimar(false)
},700)

}

const confrontos = fase
? matches.filter(m => m.fase === fase)
: matches

return(

<div className="placar-container">

<h1 className="titulo-placar">
🏆 PLAYOFFS
</h1>

{campeao && (

<div className="banner-campeao">

<div className="trofeu">
🏆
</div>

<div className="titulo-campeao">
CAMPEÃO
</div>

<div className="nome-campeao">
{campeao}
</div>

</div>

)}

<div className="filtros">

<select
value={eventoId}
onChange={e=>setEventoId(e.target.value)}
>

<option value="">Evento</option>

{eventos.map(e=>(
<option key={e.id} value={e.id}>
{e.nome}
</option>
))}

</select>

<select
value={categoriaId}
onChange={e=>setCategoriaId(e.target.value)}
>

<option value="">Categoria</option>

{categorias.map(c=>(
<option key={c.id} value={c.id}>
{c.nome}
</option>
))}

</select>

<select
value={provaId}
onChange={e=>setProvaId(e.target.value)}
>

<option value="">Prova</option>

{provas.map(p=>(
<option key={p.id} value={p.id}>
{p.nome}
</option>
))}

</select>

<select
value={fase}
onChange={e=>setFase(e.target.value)}
>

<option value="">Todas Fases</option>

{fases.map(f=>(
<option key={f} value={f}>
{f.toUpperCase()}
</option>
))}

</select>

</div>

<div className={`confrontos ${animar ? "placar-update":""}`}>

{confrontos.map(match=>{

const vencedor1 =
match.score1 > match.score2

const vencedor2 =
match.score2 > match.score1

const campeaoFinal =
match.fase === "final" && (vencedor1 || vencedor2)

return(

<div key={match.id} className={`card-confronto ${campeaoFinal ? "campeao-card":""}`}>

<div className="fase">
{match.fase.toUpperCase()}
</div>

<div className={`linha ${vencedor1 ? "vencedor":""} ${campeaoFinal && vencedor1 ? "campeao":""}`}>

<div className="team">
{match.team1?.nome}
</div>

<div className="placar">
{match.score1 ?? "-"}
</div>

</div>

<div className={`linha ${vencedor2 ? "vencedor":""} ${campeaoFinal && vencedor2 ? "campeao":""}`}>

<div className="team">
{match.team2?.nome}
</div>

<div className="placar">
{match.score2 ?? "-"}
</div>

</div>

</div>

)

})}

</div>

</div>

)

}