import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHeader,
  TableFooter,
} from "@windmill/react-ui";
import ReactPaginate from "react-paginate"; // ← Import here
import { useTranslation } from "react-i18next";

import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import GeneralQueryTable from "@/components/generalquerytable/GeneralQueryTable";
import NotFound from "@/components/table/NotFound";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";

const GeneralQuery = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const { t } = useTranslation();

  const [queries, setQueries] = useState([]);
  const [totalQueries, setTotalQueries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState([]);
  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await AdminServices.getAllQuery(
          currentPage,
          resultsPerPage
        );
        setResult(res)
        setQueries(res.queries || []);
        setTotalQueries(res.totalQueries || 0);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching queries.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, [currentPage, resultsPerPage]);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  const totalPages = result?.totalPages ?? 1
  // const totalPages = Math.ceil(totalQueries / resultsPerPage);

  return (
    <>
      <PageTitle>{"General Query"}</PageTitle>
      <MainDrawer>
        <StaffDrawer />
      </MainDrawer>

      {loading ? (
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : queries.length > 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{"Name"}</TableCell>
                <TableCell>{"Jewellery Type"}</TableCell>
                <TableCell>{"Budget"}</TableCell>
                <TableCell>{"Phone"}</TableCell>
                <TableCell>{"Message"}</TableCell>
              </tr>
            </TableHeader>
            <GeneralQueryTable staffs={queries} lang={lang} />
          </Table>
          <TableFooter>
            <div className="flex justify-center p-4">
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"flex space-x-2"}
                pageClassName={"px-3 py-1 border rounded"}
                activeClassName={"bg-blue-500 text-white"}
                forcePage={currentPage - 1}
              />
            </div>
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no Queries right now." />
      )}
    </>
  );
};

export default GeneralQuery;
