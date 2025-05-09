import { useParams } from "react-router";
import ReactToPrint from "react-to-print";
import React, { useContext, useRef, useState } from "react";
import { FiPrinter, FiMail } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Button } from "@windmill/react-ui";
import {
  TableCell,
  TableHeader,
  Table,
  TableContainer,
  WindmillContext,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from "@react-pdf/renderer";

//internal import
import useAsync from "@/hooks/useAsync";
import useError from "@/hooks/useError";
import Status from "@/components/table/Status";
import { notifyError, notifySuccess } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";
import OrderServices from "@/services/OrderServices";
import Invoice from "@/components/invoice/Invoice";
import Loading from "@/components/preloader/Loading";
import logoDark from "@/assets/img/logo/logo-dark.svg";
import logoLight from "@/assets/img/logo/lg.png";
import PageTitle from "@/components/Typography/PageTitle";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import useDisableForDemo from "@/hooks/useDisableForDemo";
import InvoiceForDownload from "@/components/invoice/InvoiceForDownload";

const OrderInvoice = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { id } = useParams();
  const printRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderById(id)
  );

  const { handleErrorNotification } = useError();
  const { handleDisableForDemo } = useDisableForDemo();

  // console.log("Data: ", data);

  const { currency, globalSetting, showDateFormat, getNumberTwo } =
    useUtilsFunction();

  const handleEmailInvoice = async (inv) => {
    // console.log("inv", inv);
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }

    // if (adminInfo?.role !== "Super Admin")
    //   return notifyError(
    //     "You don't have permission to sent email of this order!"
    //   );
    setIsSubmitting(true);
    try {
      const updatedData = {
        ...inv,
        date: showDateFormat(inv.createdAt),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };
      // console.log("updatedData", updatedData);

      // return setIsSubmitting(false);
      const res = await OrderServices.sendEmailInvoiceToCustomer(updatedData);
      notifySuccess(res.message);
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      handleErrorNotification(err, "handleEmailInvoice");
    }
  };
  // console.log("Global setting: ", globalSetting);

  return (
    <>
      <div
        ref={printRef}
        className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {!loading && (
          <div className="">
            <div className="flex  sm:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700 dark:text-gray-300">
              {/* <h1 className="font-bold font-serif text-xl uppercase">
                {t("InvoicePageTittle")}
                <p className="text-xs mt-1 text-gray-500">
                  {t("InvoiceStatus")}
                  <span className="pl-2 font-medium text-xs capitalize">
                    {" "}
                    <Status status={data.status} />
                  </span>
                </p>
              </h1>  */}
              <div className=" text-left mt-4">
                <h2 className="lg:flex  text-lg font-serif font-semibold  lg:mt-0 lg:ml-0 md:mt-0">
                  {/* {mode === "dark" ? (
                    <img src={logoDark} alt="kachabazar" width="110" />
                  ) : ( */}
                  <img src={logoLight} alt="ocentury" width="110" />
                  {/* )} */}
                </h2>
                <div className="text-sm  text-gray-500">
                  <>{globalSetting?.company_name}</>
                  <p className="whitespace-pre-wrap  break-words  lg:max-w-56 ">
                    {globalSetting?.address}
                    {globalSetting?.post_code}
                  </p>
                  <span></span>
                  <>Email: {globalSetting?.email}</>
                  <br />
                  <>Phone:{globalSetting?.contact}</>
                  <>
                    {globalSetting?.city} {globalSetting?.state}
                  </>
                </div>
              </div>
              <div className="flex flex-col ">
                {/* <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTo")}
                </span> */}
                <PageTitle> {t("InvoicePageTittle")} </PageTitle>
                <div className="flex flex-row flex-wrap justify-between gap-4 pt-4">
                  {/* Invoice Date */}
                  <div className="flex flex-col items-center">
                    <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500">
                      {t("InvoiceDate")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {showDateFormat(data?.createdAt)}
                    </span>
                  </div>

                  {/* Invoice Status */}
                  <div className="flex flex-col">
                    <span className="font-bold items-center font-serif text-sm uppercase text-gray-600 dark:text-gray-500">
                      {t("InvoiceStatus")}
                    </span>
                    <span className="text-xs mt-1 text-gray-500 flex ">
                      <Status status={data.status} />
                    </span>
                  </div>

                  {/* Invoice Number */}
                  <div className="flex flex-col">
                    <span className="font-bold items-center font-serif text-sm uppercase text-gray-600 dark:text-gray-500">
                      {t("InvoiceNo")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      #{data?.invoice}
                    </span>
                  </div>
                </div>
                <div className="mt-2 font-bold font-serif text-sm uppercase">
                  Ship To :
                </div>
                <span className="text-sm text-gray-500 block">
                  {data?.user_info?.name} <br />
                  {data?.user_info?.address}
                  <br />
                  {data.user_info?.city}, {data.user_info?.state},{" "}
                  {data.user_info?.country}. {data.user_info?.zipCode}
                  <br />
                  {data?.user_info?.landmark && (
                    <>
                      <strong>Landmark: </strong>
                      {data.user_info.landmark}
                      <br />
                    </>
                  )}
                  {data?.user_info?.email && (
                    <>
                      <strong>Email:</strong> {data.user_info.email}
                      <br />
                    </>
                  )}
                  {data?.user_info?.contact && (
                    <span>
                      <strong>Phone:</strong> {data.user_info.contact}
                    </span>
                  )}
                  <br />
                </span>
              </div>
            </div>
          </div>
        )}
        <div>
          {loading ? (
            <Loading loading={loading} />
          ) : error ? (
            <span className="text-center mx-auto text-red-500">{error}</span>
          ) : (
            <TableContainer className="my-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("Sr")}</TableCell>
                    <TableCell>Product Title</TableCell>
                    <TableCell className="text-center">
                      {t("Quantity")}
                    </TableCell>
                    <TableCell className="text-center">
                      {t("ItemPrice")}
                    </TableCell>
                    <TableCell className="text-center">{"GST"}</TableCell>
                    <TableCell className="text-right">{"Amount"}</TableCell>
                  </tr>
                </TableHeader>
                <Invoice
                  data={data}
                  currency={currency}
                  getNumberTwo={getNumberTwo}
                />
              </Table>
            </TableContainer>
          )}
        </div>

        {!loading && (
          <div className="border rounded-xl border-gray-100 p-8 py-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex sm:flex-row  flex-col justify-between">
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoicepaymentMethod")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {data.paymentMethod}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("ShippingCost")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {getNumberTwo(data.shippingCost)}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceDicount")}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {currency}
                  {getNumberTwo(data.discount)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  {t("InvoiceTotalAmount")}
                </span>
                <span className="text-xl font-serif font-bold text-red-500 dark:text-emerald-500 block">
                  {currency}
                  {getNumberTwo(data.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && !error && (
        <div className="mb-4 mt-3 flex md:flex-row flex-col items-center justify-end">
          {/* <PDFDownloadLink
            document={
              <InvoiceForDownload
                t={t}
                data={data}
                currency={currency}
                getNumberTwo={getNumberTwo}
                showDateFormat={showDateFormat}
              />
            }
            fileName="Invoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600  w-auto cursor-pointer">
                  Download Invoice
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>
              )
            }
          </PDFDownloadLink> */}

          <div className="flex md:mt-0 mt-3 gap-4 md:w-auto w-full">
            {/* {globalSetting?.email_to_customer && (
              <div className="flex justify-end md:w-auto w-full">
                {isSubmitting ? (
                  <Button
                    disabled={true}
                    type="button"
                    className="text-sm h-10 leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-2 ml-4 md:px-4 lg:px-6 py-4 md:py-3.5 lg:py-4 hover:text-white bg-emerald-400 hover:bg-emerald-500"
                  >
                    <img
                      src={spinnerLoadingImage}
                      alt="Loading"
                      width={20}
                      height={10}
                    />{" "}
                    <span className="font-serif ml-2 font-light">
                      {" "}
                      Processing
                    </span>
                  </Button>
                ) : (
                  <button
                    onClick={() => handleEmailInvoice(data)}
                    className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-teal-500 border border-transparent active:bg-teal-600 hover:bg-teal-600  md:w-auto w-full h-10 justify-center"
                  >
                    Email Invoice
                    <span className="ml-2">
                      <FiMail />
                    </span>
                  </button>
                )}
              </div>
            )} */}

            <div className="md:w-auto w-full">
              <ReactToPrint
                trigger={() => (
                  <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white bg-emerald-500 border border-transparent active:bg-emerald-600 hover:bg-emerald-600  md:w-auto w-full h-10 justify-center">
                    {t("PrintInvoice")}{" "}
                    <span className="ml-2">
                      <FiPrinter />
                    </span>
                  </button>
                )}
                content={() => printRef.current}
                documentTitle={data?.invoice}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderInvoice;
