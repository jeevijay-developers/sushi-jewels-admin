import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { FiZoomIn } from "react-icons/fi";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Tooltip from "@/components/tooltip/Tooltip";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ViewQueryMessage from "@/components/modal/ViewQueryMessage";
import AdminServices from "@/services/AdminServices";
import { toast } from "react-toastify";
import useAsync from "@/hooks/useAsync";

const GeneralQueryTable = ({ staffs, lang }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();
  console.log("staff",staffs);

  const { showDateFormat, showingTranslateValue } = useUtilsFunction();
  // State for access list modal
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Function to open the access list modal
  const handleAccessModalOpen = (staff) => {
    setSelectedStaff(staff);
    setIsAccessModalOpen(true);
  };

  // Function to close the access list modal
  const handleAccessModalClose = () => {
    setSelectedStaff(null);
    setIsAccessModalOpen(false);
  };
  const [staffStatus, setStaffStatus] = useState({});

  // Sync state with the latest `staffs` prop when it updates
  useEffect(() => {
    const initialStatus = staffs.reduce(
      (acc, staff) => ({ ...acc, [staff._id]: staff.status || "Hold" }),
      {}
    );
    setStaffStatus(initialStatus);
  }, [staffs]); // Re-run when `staffs` changes

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;

    // Optimistic UI update
    setStaffStatus((prev) => ({ ...prev, [id]: newStatus }));

    try {
      await AdminServices.updateTelecallerStatus(id, { status: newStatus });
      toast.success("Status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message);

      // Revert to previous state if update fails
      setStaffStatus((prev) => ({
        ...prev,
        [id]: staffs.find((staff) => staff._id === id)?.status || "Hold",
      }));
    }
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />
      {/* Access List Modal */}
      {isAccessModalOpen && (
        <ViewQueryMessage
          staff={selectedStaff}
          isOpen={isAccessModalOpen}
          onClose={handleAccessModalClose}
          showingTranslateValue={showingTranslateValue}
        />
      )}

      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => (
          <TableRow key={staff._id}>
            {/* <TableCell>
              <div className="flex items-center">
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50"
                  src={staff.image}
                  alt="staff"
                />
                <div>
                  <h2 className="text-sm font-medium">
                    {showingTranslateValue(staff?.name)}
                  </h2>
                </div>
              </div>
            </TableCell> */}

            <TableCell>
              <span className="text-sm">{staff.fullName}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.jewelleryType}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.budget}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.phone}</span>
            </TableCell>
            {/* <TableCell>
              <span className="text-sm ">{staff.message}</span>
            </TableCell> */}

            {/* <TableCell className="text-center">
              <ActiveInActiveButton
                id={staff?._id}
                staff={staff}
                option="staff"
                status={staff.status}
              />
            </TableCell> */}

            <TableCell>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleAccessModalOpen(staff)}
                  className="text-gray-400"
                >
                  view message
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title="view message"
                    bgColor="#059669"
                  />
                </button>
                {/* <EditDeleteButton
                  id={staff._id}
                  staff={staff}
                  isSubmitting={isSubmitting}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                  handleResetPassword={handleResetPassword}
                  title={showingTranslateValue(staff?.name)}
                /> */}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default GeneralQueryTable;
