import { Fixture } from '@/types/livescore';


interface Props {

  matches: Fixture[];

}



export default function LiveMatches(
{
  matches
}:Props
){


if(!matches.length){

  return null;

}



return (

<section className="
 rounded-2xl
 border
 border-border
 bg-card
 p-6
">


<div className="
 flex
 items-center
 justify-between
 mb-5
">

<h2 className="
 text-xl
 font-bold
">

🔴 Live Now

</h2>


<span className="
 text-sm
 text-muted-foreground
">

{matches.length} matches

</span>


</div>



<div className="
 space-y-4
">


{
matches.map(
(match)=>(


<div

key={match.fixtureId}

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
 h-8
 w-8
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
 text-xl
 font-bold
">

{match.homeScore}
 -
{match.awayScore}

</div>


<span className="
 text-xs
 text-red-500
">

{match.status}

</span>


</div>



<div className="
 flex
 items-center
 gap-3
 flex-1
 justify-end
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
 h-8
 w-8
 object-contain
"

/>


</div>



</div>


</div>


))

}


</div>


</section>

);

}