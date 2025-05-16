import React from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import StaffTable from "@/components/staff/StaffTable";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import StorePartTable from "@/components/storepartnerytable/StorePartTable";
import TelecallerTable from "@/components/telecallerTable/TelecallerTable";
import GeneralQueryTable from "@/components/generalquerytable/GeneralQueryTable";

const GeneralQuery = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(() =>
    AdminServices.getAllQuery()
  );
  console.log("query data", data);
  const {
    userRef,
    setRole,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    handleSubmitUser,
  } = useFilter(data.queries);

  console.log("dataTable", serviceData);

  const { t } = useTranslation();
 

  // handle reset filed
  const handleResetField = () => {
    setRole("");
    userRef.current.value = "";
  };
  return (
    <>
      <PageTitle>{"General Query"} </PageTitle>
      <MainDrawer>
        <StaffDrawer />
      </MainDrawer>

      {loading ? (
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <>
        

          <TableContainer className="mb-8 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>{"name"}</TableCell>
                  <TableCell>{"jewelleryType"}</TableCell>
                  <TableCell>{"budget"}</TableCell>
                  <TableCell>{"phone"}</TableCell>
                  <TableCell>{"message"}</TableCell>
                </tr>
              </TableHeader>

              <GeneralQueryTable staffs={serviceData} lang={lang} />
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={handleChangePage}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </>
      ) : (
        <NotFound title="Sorry, There are no Query right now." />
      )}
    </>
  );
};

export default GeneralQuery;
