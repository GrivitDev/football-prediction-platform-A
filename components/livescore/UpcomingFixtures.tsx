import { Fixture } from '@/types/livescore';


interface Props {

fixtures: Fixture[];

}



export default function UpcomingFixtures(
{
fixtures
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

⚽ Upcoming Fixtures

</h2>



{
fixtures.length === 0 ?


(

<p className="
text-muted-foreground
">

No upcoming matches

</p>

)


:

(

<div className="
space-y-3
">


{
fixtures.map(
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
">


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
text-center
">

<p className="
font-semibold
">

{match.time}

</p>


<p className="
text-xs
text-muted-foreground
">

Upcoming

</p>


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


</div>


))

}


</div>

)

}


</section>

);

}