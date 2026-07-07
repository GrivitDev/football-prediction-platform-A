import LeagueHeader from '@/components/livescore/LeagueHeader';
import LiveMatches from '@/components/livescore/LiveMatches';
import TodayMatches from '@/components/livescore/TodayMatches';
import LeagueTable from '@/components/livescore/LeagueTable';
import UpcomingFixtures from '@/components/livescore/UpcomingFixtures';
import Results from '@/components/livescore/Results';

import { getLeaguePage } from '@/services/livescore.service';



interface Props {

  params:{
    leagueCode:string;
  };

}



export default async function LeagueLivescorePage(
  {
    params,
  }:Props
){


  const data =
    await getLeaguePage(
      params.leagueCode
    );



  return (

    <main className="
      min-h-screen
      bg-background
      py-8
    ">


      <div className="
        mx-auto
        max-w-7xl
        px-4
        space-y-8
      ">


        <LeagueHeader
          leagueCode={
            data.leagueCode
          }
        />



        <LiveMatches
          matches={
            data.liveMatches ?? []
          }
        />



        <TodayMatches
          matches={
            data.todayMatches
          }
        />



        <LeagueTable
          table={
            data.table
          }
        />



        <UpcomingFixtures
          fixtures={
            data.fixtures
          }
        />



        <Results
          results={
            data.results
          }
        />


      </div>


    </main>

  );

}