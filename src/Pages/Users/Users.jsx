import React, { useEffect, useState } from "react";
import "./Users.module.css";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { BallTriangle } from "react-loader-spinner";
import Chip from "@mui/material/Chip"; // To display tags
import toast, { Toaster } from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";
import Cookies from "js-cookie";

import Navbar from "../../Components/Navbar/Navbar";
import {
  addHoldType,
  deleteContainer,
  disableHoldType,
  GetContainers,
} from "../../services/container";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Containers() {
  const isAdmin = Cookies.get("username") === "admin";
  const [containers, setContainers] = useState([]); // Initialize containers as an empty array
  const [loading, setLoading] = useState(true);
  const [holdType, setHoldType] = React.useState("");
  const [ContainerId, setContainerId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row for each container
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const [unholdConfirmOpen, setUnholdConfirmOpen] = useState(false);
  const [containerToUnhold, setContainerToUnhold] = useState(null);
  const [holdToUnhold, setHoldToUnhold] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState(null);
  // Handle open and close of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Retrieve containers from localStorage
  async function getContainers() {
    try {
      setLoading(true);
      const status = "all"; // Example status filter, modify as needed

      // Fetch containers data from the API using the service function
      const response = await GetContainers(status);

      // Assuming the response data contains a 'containers' field
      console.log(response.data);
      const containersData = response?.data || [];
      // Update the state with the containers data
      setContainers(containersData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading stops even on error
    }
  }

  // Create a new container or update the existing one if the ID exists
  const createContainer = async (newContainer) => {
    try {
      // Make the API call to add the hold type to the container
      const response = await addHoldType(
        newContainer.container_id,
        newContainer.hold
      );

      // Assuming the API response contains the updated container data
      getContainers();

      setContainerId(""); // Clear input field
      setHoldType(""); // Clear input field
      handleClose(); // Close the modal after adding
    } catch (error) {
      console.error("Error adding hold type to container:", error);
    }
  };

  const [error, setError] = useState({ containerId: false, holdType: false });

  // Handle form submission for adding a new container
  const handleAddContainer = () => {
    // Check if the container with the same ID and hold type already exists
    const existingContainer = containers.find(
      (container) =>
        container.container_id === ContainerId &&
        container.hold_types.some((type) => type.hold === holdType)
    );

    if (existingContainer) {
      // If container with the same ID and hold type exists, show error
      setError({
        containerId: false, // No error on container ID
        holdType: true, // Error on holdType
      });
      return; // Do not proceed if the container exists
    }

    if (!ContainerId.trim() || !holdType.trim()) {
      // Set errors if fields are empty
      setError({
        containerId: !ContainerId.trim(),
        holdType: !holdType.trim(),
      });
      return; // Do not proceed if fields are invalid
    }

    const newContainer = {
      container_id: ContainerId, // Unique container ID
      hold: holdType,
      date: new Date().toLocaleString(), // Automatically set to current date and time
    };

    createContainer(newContainer); // Proceed with creating the container

    // Clear errors after successful submission
    setError({ containerId: false, holdType: false });
  };

  // Handle unhold operation, remove the entire container
  const handleDeleteRequest = (containerId) => {
    setContainerToDelete(containerId); // Set the container ID to delete
    setConfirmOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = async () => {
    try {
      // Call the deleteContainer service function to delete the container from the backend
      await deleteContainer(containerToDelete?._id);

      // Remove the container from the local state after successful deletion
      getContainers();

      // Close the modal and clear the container to delete
      setConfirmOpen(false);
      setContainerToDelete(null);
    } catch (error) {
      console.error("Error deleting container:", error);
    }
  };

  // Handle expanding or collapsing a row
  const handleRowClick = (containerId) => {
    setExpandedRow(expandedRow === containerId ? null : containerId);
  };

  const handleHoldTypeChange = (event) => {
    setHoldType(event.target.value);
  };

  const handleContainerId = (event) => {
    const value = event.target.value.toUpperCase(); // Convert input to uppercase
    setContainerId(value);

    // Regex for validating 4 characters followed by 7 digits
    const regex = /^[A-Za-z]{4}\d{7}$/;

    // Check if the value matches the regex pattern
    if (regex.test(value)) {
      setError({ containerId: false });
    } else {
      setError({ containerId: true });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toUpperCase());
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // Run `getContainers` on mount
  useEffect(() => {
    getContainers();
  }, []);

  // Filter containers based on search term
  const filteredContainers = containers.filter((container) => {
    const upperSearchTerm = searchTerm.toUpperCase();

    // Convert the container's date to a Date object
    const containerDate = container.createdAt
      ? new Date(container.createdAt)
      : null;

    // If there's no valid date, skip the container
    if (!containerDate) return false;

    // Extract the components of the container's date
    const month = containerDate.getMonth() + 1; // months are 0-indexed, so add 1
    const day = containerDate.getDate();
    const year = containerDate.getFullYear();

    // Create different formatted date strings for matching
    const formattedMonth = `${month}`;
    const formattedMonthDay = `${month}/${day}`;
    const formattedMonthDayYear = `${month}/${day}/${year}`;

    // Normalize search term by removing any extra spaces and converting to uppercase
    const normalizedSearchTerm = searchTerm.trim().toUpperCase();

    // Check if the search term matches container_id or the various date formats
    return (
      container.containerNumber.toUpperCase().includes(normalizedSearchTerm) ||
      formattedMonth.includes(normalizedSearchTerm) ||
      formattedMonthDay.includes(normalizedSearchTerm) ||
      formattedMonthDayYear.includes(normalizedSearchTerm)
    );
  });

  const handleUnholdType = (container, holdType) => {
    setContainerToUnhold(container);
    setHoldToUnhold(holdType);
    setUnholdConfirmOpen(true); // Open the unhold confirmation modal
  };

  // Function to confirm the unhold action
  const handleConfirmUnhold = async () => {
    try {
      // Call the service function to disable the holdType in the container
      await disableHoldType(containerToUnhold._id, holdToUnhold);

      // Update the containers state after successful unholding
      getContainers();
      setUnholdConfirmOpen(false);
      setContainerToUnhold(null);
      setHoldToUnhold(null);
    } catch (error) {
      console.error("Error disabling hold type:", error);
      // Optionally, show a toast or message to indicate an error
    }
  };
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "100px", position: "relative" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <TextField
            label="Search by Container ID Or Date (MM/DD/YYYY)"
            variant="outlined"
            fullWidth
            onChange={handleSearch}
            value={searchTerm}
            style={{
              maxWidth: "80%",
              marginInlineEnd: "5px",
            }}
          />
          <Button onClick={handleOpen} variant="contained">
            <i className="fa-solid fa-plus"></i> Add New Container
          </Button>
        </div>

        {/* Modal to add a new container */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          aria-describedby="customized-dialog-description"
          PaperProps={{
            style: {
              borderRadius: 20, // Rounded corners
              background: "linear-gradient(135deg, #e0f7fa, #80deea)", // Gradient background
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Drop shadow
            },
          }}
          maxWidth="sm" // Adjust the modal width
          fullWidth
        >
          {/* Title */}
          <DialogTitle
            id="customized-dialog-title"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.75rem",
              color: "#004d40",
            }}
          >
            Enter Holding Reason For Container
          </DialogTitle>

          {/* Content */}
          <DialogContent
            sx={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Container ID Input */}
            <TextField
              required
              id="container-id"
              label="Container ID"
              variant="outlined"
              fullWidth
              value={ContainerId}
              onChange={handleContainerId}
              error={error.containerId}
              helperText={
                error.containerId
                  ? "Container ID must be 4 characters and 7 digits"
                  : ""
              }
              sx={{
                marginBottom: 3,
                marginTop: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
              inputProps={{
                maxLength: 11, // Optional: Limit the length of input
              }}
            />

            {/* Hold Type Select */}
            <FormControl
              fullWidth
              error={error.holdType}
              sx={{ marginBottom: 3 }}
            >
              <InputLabel id="hold-type-select-label">Hold Type</InputLabel>
              <Select
                labelId="hold-type-select-label"
                id="hold-type-select"
                value={holdType}
                onChange={handleHoldTypeChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
              >
                <MenuItem value={"حادث طلب شئون قانونية"}>
                  حادث طلب شئون قانونية
                </MenuItem>
                <MenuItem value={"طلب التوكيل"}>طلب التوكيل</MenuItem>
                <MenuItem value={"مصاريف علي العميل"}>
                  مصاريف علي العميل
                </MenuItem>
                <MenuItem value={"بوصلة جمرك"}>بوصلة جمرك</MenuItem>
                <MenuItem value={"بأمر النيابة العامة"}>
                  بأمر النيابة العامة
                </MenuItem>
                <MenuItem value={"تعليمات الحركة و التشغيل"}>
                  تعليمات الحركة و التشغيل
                </MenuItem>
                <MenuItem value={"تلوث"}>تلوث</MenuItem>
                <MenuItem value={"اشعاع"}>اشعاع</MenuItem>
                <MenuItem value={"تهريب"}>تهريب</MenuItem>
                <MenuItem value={"مباحث"}>مباحث</MenuItem>

                <MenuItem value={"خدمة تركيب سيل"}>خدمة تركيب سيل</MenuItem>
              </Select>
              {/* {error.holdType && (
                <Box
                  component="span"
                  sx={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginTop: 0.5,
                  }}
                >
                  Hold Type is required
                </Box>
              )} */}
              {error.holdType && (
                <Box
                  component="span"
                  sx={{
                    color: "red",
                    fontSize: "0.75rem",
                    marginTop: 0.5,
                  }}
                >
                  Container with this hold type already exists
                </Box>
              )}
            </FormControl>
          </DialogContent>

          {/* Actions */}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: "16px 24px",
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              color="secondary"
              sx={{
                width: "45%",
                borderRadius: "10px",
                fontWeight: "bold",
                color: "#004d40",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContainer}
              variant="contained"
              sx={{
                width: "45%",
                borderRadius: "10px",
                background: "#004d40",
                fontWeight: "bold",
                "&:hover": {
                  background: "#00695c",
                },
              }}
              disabled={!ContainerId.trim() || !holdType.trim()}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Display containers in table */}

      {
        <TableContainer
          className="container-fluid"
          component={Paper}
          sx={{ marginTop: "40px" }}
        >
          <Table aria-label="container table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Container ID</StyledTableCell>
                <StyledTableCell>
                  <span className="ms-2">Hold Types</span>
                </StyledTableCell>
                <StyledTableCell>
                  <span className="ms-2">Status</span> {/* New Column */}
                </StyledTableCell>
                <StyledTableCell>
                  <span className="ms-5">Date</span>
                </StyledTableCell>
                <StyledTableCell>
                  <span className="ms-4">Actions</span>
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredContainers && filteredContainers.length > 0 ? (
                filteredContainers.map((container, index) => (
                  <React.Fragment key={index}>
                    <StyledTableRow
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === container.containerNumber
                            ? null
                            : container.containerNumber
                        )
                      }
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          expandedRow === container.containerNumber
                            ? "#f5f5f5"
                            : "inherit",
                      }}
                    >
                      <TableCell>{container.containerNumber}</TableCell>
                      <TableCell>
                        {container.holdTypes &&
                          container.holdTypes.length > 0 &&
                          container.holdTypes.map(
                            (el, index) =>
                              index < 2 && (
                                <Chip
                                  label={el.type}
                                  sx={{
                                    fontSize: "1rem",
                                    padding: "5px",
                                  }}
                                />
                              )
                          )}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {/* New Status Column */}
                        <Chip
                          label={`${container?.holdTypes?.length} ${
                            container?.holdTypes?.length > 1
                              ? "Hold Types"
                              : "Hold Type"
                          }`}
                          color="primary"
                          sx={{
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(container.createdAt).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // For 12-hour format with AM/PM
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={!isAdmin}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            handleDeleteRequest(container);
                          }}
                          color="error"
                          variant="contained"
                        >
                          <i className="fa-solid fa-trash me-2"></i> Delete
                        </Button>
                      </TableCell>
                    </StyledTableRow>

                    <Dialog
                      open={confirmOpen}
                      onClose={() => setConfirmOpen(false)}
                      aria-labelledby="delete-dialog-title"
                      aria-describedby="delete-dialog-description"
                    >
                      <DialogTitle id="delete-dialog-title">
                        Confirm Deletion
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                          Are you sure you want to delete container ID:{" "}
                          {containerToDelete?.containerNumber}?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setConfirmOpen(false)}
                          variant="outlined"
                          color="primary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirmDelete}
                          variant="contained"
                          color="error"
                        >
                          Confirm
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {expandedRow === container.containerNumber && (
                      <StyledTableRow>
                        <TableCell colSpan={5}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "15px", // Space between hold type cards
                            }}
                          >
                            {container.holdTypes.map((hold, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  backgroundColor: hold.status
                                    ? "#e6f7e6"
                                    : "#fbeaea", // Green for active, red for disabled
                                  padding: "10px",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                <div style={{ flex: "1" }}>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      color: hold.status
                                        ? "#2e7d32"
                                        : "#d32f2f", // Color-coded for status
                                    }}
                                  >
                                    {hold.type} -{" "}
                                    {new Date(hold.dateAdded).toLocaleString(
                                      "en-US",
                                      {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      }
                                    )}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      color: "#555",
                                    }}
                                  >
                                    <strong>Added by:</strong>{" "}
                                    {hold?.addedBy?.username} <br />
                                    <strong>Disabled by:</strong>{" "}
                                    {hold?.updatedBy?.username || "N/A"} <br />
                                    <strong>Status:</strong>{" "}
                                    {hold.status ? "Active" : "Disabled"}
                                  </p>
                                </div>

                                <Button
                                  disabled={!hold.status}
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  sx={{
                                    fontSize: "0.8rem",
                                    padding: "4px 8px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent row click event
                                    handleUnholdType(container, hold.type);
                                  }}
                                >
                                  Unhold
                                </Button>
                              </div>
                            ))}

                            <Dialog
                              open={unholdConfirmOpen}
                              onClose={() => setUnholdConfirmOpen(false)}
                              aria-labelledby="unhold-dialog-title"
                              aria-describedby="unhold-dialog-description"
                            >
                              <DialogTitle id="unhold-dialog-title">
                                Confirm Unhold
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText id="unhold-dialog-description">
                                  Are you sure you want to unhold the container
                                  ID: {containerToUnhold?.containerNumber}? Hold
                                  type: {holdToUnhold}
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() => setUnholdConfirmOpen(false)}
                                  variant="outlined"
                                  color="primary"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleConfirmUnhold}
                                  variant="contained"
                                  color="error"
                                >
                                  Confirm
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </div>
                        </TableCell>
                      </StyledTableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow style={{ display: "flex", justifyContent: "center" }}>
                  <p>No Containers Found</p>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      }

      {/* Loader when loading containers */}
      {loading && (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#4fa94d"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
