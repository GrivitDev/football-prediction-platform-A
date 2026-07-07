import { Standing } from '@/types/livescore';


interface Props {

  table: Standing[];

}



export default function LeagueTable(
{
  table
}: Props
){


return (

<section className="
rounded-2xl
border
border-border
bg-card
p-6
">


<h2 className="
text-xl
font-bold
mb-5
">

🏆 League Table

</h2>



<div className="
overflow-x-auto
">


<table className="
w-full
text-sm
">


<thead>

<tr className="
border-b
border-border
text-muted-foreground
">


<th className="
text-left
py-3
">

#

</th>


<th className="
text-left
">

Team

</th>


<th>

P

</th>


<th>

W

</th>


<th>

D

</th>


<th>

L

</th>


<th>

GD

</th>


<th>

PTS

</th>


</tr>

</thead>



<tbody>


{
table.map(
(team)=>(


<tr

key={
team.position
}

className="
border-b
border-border/50
"

>


<td className="
py-3
font-semibold
">

{team.position}

</td>



<td>

<div className="
flex
items-center
gap-3
">


<img

src={
team.crest
}

alt={
team.team
}

className="
h-7
w-7
object-contain
"

/>


<span className="
font-medium
">

{team.team}

</span>


</div>

</td>



<td className="
text-center
">

{team.played}

</td>


<td className="
text-center
">

{team.won}

</td>


<td className="
text-center
">

{team.draw}

</td>


<td className="
text-center
">

{team.lost}

</td>


<td className="
text-center
">

{team.goalDifference}

</td>


<td className="
text-center
font-bold
">

{team.points}

</td>


</tr>


))

}


</tbody>


</table>


</div>


</section>

);

}