import LeagueSelector from '@/components/livescore/LeagueSelector';


export default function LivescorePage(){

  return (

    <main className="
      min-h-screen
      bg-background
      py-10
    ">

      <div className="
        mx-auto
        max-w-7xl
        px-4
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          Live Scores
        </h1>


        <p className="
          mt-2
          text-muted-foreground
        ">
          Select a league to view matches,
          standings and results.
        </p>


        <div className="
          mt-8
        ">

          <LeagueSelector />

        </div>


      </div>

    </main>

  );

}