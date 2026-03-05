import { useEffect,useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function AdminConfrontos(){

const [eventos,setEventos] = useState([])
const [categorias,setCategorias] = useState([])
const [provas,setProvas] = useState([])
const [equipes,setEquipes] = useState([])
const [matches,setMatches] = useState([])

const [eventoId,setEventoId] = useState("")
const [categoriaId,setCategoriaId] = useState("")
const [provaId,setProvaId] = useState("")
const [fase,setFase] = useState("quartas")

const [team1,setTeam1] = useState("")
const [team2,setTeam2] = useState("")

useEffect(()=>{
fetchEventos()
},[])

useEffect(()=>{
if(eventoId){
fetchCategorias()
fetchProvas()
fetchEquipes()
}
},[eventoId])

useEffect(()=>{
if(provaId){
fetchMatches()
}
},[provaId])

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

setCategorias(data || [])

}

async function fetchProvas(){

const {data} = await supabase
.from("provas")
.select("*")
.eq("event_id",eventoId)

setProvas(data || [])

}

async function fetchEquipes(){

const {data} = await supabase
.from("teams")
.select("*")
.eq("event_id",eventoId)
.order("nome")

setEquipes(data || [])

}

async function fetchMatches(){

const { data, error } = await supabase
  .from("matches")
  .select(`
    id,
    fase,
    team1:team1_id (nome),
    team2:team2_id (nome)
  `)
  .eq("prova_id", provaId)

setMatches(data || [])

}

async function criarMatch(){

if(!team1 || !team2){
alert("Selecione as equipes")
return
}

await supabase
.from("matches")
.insert({
prova_id:provaId,
fase:fase,
team1_id:team1,
team2_id:team2
})

setTeam1("")
setTeam2("")

fetchMatches()

}

async function deletarMatch(id){

if(!confirm("Excluir confronto?")) return

await supabase
.from("matches")
.delete()
.eq("id",id)

fetchMatches()

}

return(

<div>

<h4>Confrontos Eliminatórios</h4>

<div className="d-flex gap-2 mb-4">

<select
className="form-select"
value={eventoId}
onChange={e=>setEventoId(e.target.value)}
>

<option>Evento</option>

{eventos.map(e=>(
<option key={e.id} value={e.id}>
{e.nome}
</option>
))}

</select>

<select
className="form-select"
value={categoriaId}
onChange={e=>setCategoriaId(e.target.value)}
>

<option>Categoria</option>

{categorias.map(c=>(
<option key={c.id} value={c.id}>
{c.nome}
</option>
))}

</select>

<select
className="form-select"
value={provaId}
onChange={e=>setProvaId(e.target.value)}
>

<option>Prova</option>

{provas.map(p=>(
<option key={p.id} value={p.id}>
{p.nome}
</option>
))}

</select>

<select
className="form-select"
value={fase}
onChange={e=>setFase(e.target.value)}
>

<option value="16avos">16 Avos</option>
<option value="oitavas">Oitavas</option>
<option value="quartas">Quartas</option>
<option value="semifinal">Semifinal</option>
<option value="final">Final</option>

</select>

</div>

<div className="card p-3 mb-4">

<h5>Criar confronto</h5>

<div className="d-flex gap-2">

<select
className="form-select"
value={team1}
onChange={e=>setTeam1(e.target.value)}
>

<option>Equipe 1</option>

{equipes.map(e=>(
<option key={e.id} value={e.id}>
{e.nome}
</option>
))}

</select>

<select
className="form-select"
value={team2}
onChange={e=>setTeam2(e.target.value)}
>

<option>Equipe 2</option>

{equipes.map(e=>(
<option key={e.id} value={e.id}>
{e.nome}
</option>
))}

</select>

<button
className="btn btn-success"
onClick={criarMatch}
>
Criar
</button>

</div>

</div>

<h5>Confrontos</h5>

<table className="table">

<thead>

<tr>
<th>Fase</th>
<th>Equipe A</th>
<th></th>
<th>Equipe B</th>
<th></th>
</tr>

</thead>

<tbody>

{matches.map(m => (

<tr key={m.id}>

<td>{m.fase}</td>

<td>{m.team1?.nome}</td>

<td>vs</td>

<td>{m.team2?.nome}</td>

<td>

<button
className="btn btn-danger btn-sm"
onClick={()=>deletarMatch(m.id)}
>
Excluir
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)

}