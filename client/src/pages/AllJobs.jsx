import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

export const allJobsLoader = async ({ request }) => {
  // Extracting search parameters using the searchParams property, then converting them 
  // into an array of key-value pairs using entries(), then using Object.fromEntries() to 
  // create an object with the parameter names as keys and their corresponding values. 
  const params = Object.fromEntries([...new URL(request.url).searchParams.entries(),]);
  // searchParams is a method of new URL constructor
  // console.log(params);

  try {
    const { data } = await customFetch.get("/jobs", { params });
    return { data, searchValues: {...params}};
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AllJobsContext = createContext();

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{data, searchValues}}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
