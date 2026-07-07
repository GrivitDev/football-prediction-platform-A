import { Fixture } from '@/types/livescore';


interface Props {
  results: Fixture[];
}



export default function Results(
{
  results
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

🏁 Recent Results

</h2>



{
results.length === 0 ?


(

<p className="
text-muted-foreground
">

No completed matches

</p>

)


:

(

<div className="
space-y-3
">


{
results.map(
(match)=>(


<div

key={
match.fixtureId
}

className="
rounded-xl
border
border-border
p-4
"

>


<div className="
flex
items-center
justify-between
gap-4
">


<div className="
flex
items-center
gap-3
flex-1
">


<img

src={
match.homeTeamBadge
}

alt={
match.homeTeam
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

{match.homeTeam}

</span>


</div>



<div className="
text-center
">


<div className="
text-lg
font-bold
">

{match.homeScore}

-

{match.awayScore}

</div>


<p className="
text-xs
text-muted-foreground
">

FT

</p>


</div>



<div className="
flex
items-center
justify-end
gap-3
flex-1
">


<span className="
font-medium
">

{match.awayTeam}

</span>


<img

src={
match.awayTeamBadge
}

alt={
match.awayTeam
}

className="
h-7
w-7
object-contain
"

/>


</div>



</div>


</div>


))

}


</div>

)

}



</section>

);

}