import { Fixture } from '@/types/livescore';


interface Props {

 matches: Fixture[];

}



export default function TodayMatches(
{
 matches
}:Props
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

📅 Today's Matches

</h2>



{
matches.length === 0 ?

(

<p className="
 text-muted-foreground
">

No matches today

</p>

)

:

(

<div className="
 space-y-3
">


{
matches.map(
(match)=>(


<div

key={match.fixtureId}

className="
 flex
 items-center
 justify-between
 rounded-xl
 border
 border-border
 p-4
"

>


<div className="
 flex
 items-center
 gap-3
">


<img

src={
match.homeTeamBadge
}

className="
 h-7
 w-7
 object-contain
"

/>


<span>
{match.homeTeam}
</span>


</div>



<div className="
 text-sm
 font-semibold
">

{match.time}

</div>



<div className="
 flex
 items-center
 gap-3
">


<span>
{match.awayTeam}
</span>


<img

src={
match.awayTeamBadge
}

className="
 h-7
 w-7
 object-contain
"

/>


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