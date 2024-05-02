import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAllJobsContext } from "../pages/AllJobs";

const PageBtnContainer = () => {
  const {
    data: { numberOfPages, currentPage },
  } = useAllJobsContext();
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  // console.log(search); // search is params - ?search=&jobStatus=declined&sort=newest&page=1
  // console.log(pathname); // path is current page - dashboard/all-jobs

  // Create an array using total number of pages, _ is undefined/not wanted argument. The
  // created array should be size equal to numberOfPages and return array index plus 1 for
  // each array element. Pages is made into array in order to allow looping/mapping for displaying pagination numbers
  const pages = Array.from({ length: numberOfPages }, (_, index) => index + 1);
  // console.log(pages);

  // Change the page numbers
  const handlePageChange = (pageNumber) => {
    // Get the current params in the url, then modify the page number before sending a new
    // request to the server
    const searchParams = new URLSearchParams(search);
    searchParams.set("page", pageNumber);
    // Get all jobs again but with a different page number request
    navigate(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <Wrapper>
      {/* Previous button */}
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numberOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>

      {/* In between pagination page numbers */}
      <div className="btn-container">
        {pages.map((pageNumber) => (
          <button
            className={`btn page-btn ${pageNumber === currentPage && "active"}`}
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numberOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageBtnContainer;
