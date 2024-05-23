import { ChartsContainer, StatsContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const statsQuery = {
  queryKey: ["stats"],
  queryFn: async () => {
    const response = await customFetch.get("/jobs/stats");
    return response.data;
  },
};

// statsLoader is a function that returns a function
export const statsLoader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
};

// Old setp without react-query
// export const statsLoader = async () => {
//   try {
//     const response = await customFetch.get("/jobs/stats");
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };

const Stats = () => {
  // const { defaultStats, monthlyApplications } = useLoaderData();
  const { data } = useQuery(statsQuery); // This does data fetching and caching
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />

      {monthlyApplications?.length > 0 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};
export default Stats;
