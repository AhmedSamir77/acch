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
  const [containers, setContainers] = useState([]); // Initialize containers as an empty array
  const [loading, setLoading] = useState(true);
  const [holdType, setHoldType] = React.useState("");
  const [ContainerId, setContainerId] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [expandedRow, setExpandedRow] = useState(null); // Track expanded row for each container
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  // Handle open and close of modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Retrieve containers from localStorage
  async function getContainers() {
    try {
      setLoading(true);
      let data = localStorage.getItem("containers");
      if (!data) {
        // Ensure data defaults to an empty array
        localStorage.setItem("containers", JSON.stringify([]));
        data = [];
      } else {
        data = JSON.parse(data);
      }
      setContainers(data); // Set containers from localStorage
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading stops even on error
    }
  }

  // Create a new container or update the existing one if the ID exists
  const createContainer = (newContainer) => {
    const updatedContainers = [...containers];
    const existingContainer = updatedContainers.find(
      (container) => container.container_id === newContainer.container_id
    );

    if (existingContainer) {
      // If container with same ID exists, add the new hold type to the existing types array
      if (
        !existingContainer.hold_types.some(
          (type) => type.hold === newContainer.hold
        )
      ) {
        existingContainer.hold_types.push({
          hold: newContainer.hold,
          date: newContainer.date,
        });
      }
    } else {
      // If no container exists, add a new container
      updatedContainers.push({
        container_id: newContainer.container_id,
        hold_types: [{ hold: newContainer.hold, date: newContainer.date }],
        date: newContainer.date,
      });
    }

    localStorage.setItem("containers", JSON.stringify(updatedContainers));
    setContainers(updatedContainers);
  };

  // Handle form submission for adding a new container
  const handleAddContainer = () => {
    const newContainer = {
      container_id: ContainerId, // Unique container ID
      hold: holdType,
      date: new Date().toLocaleString(), // Automatically set to current date and time
    };
    createContainer(newContainer);
    handleClose(); // Close the modal after adding
  };

  // Handle unhold operation, remove the entire container
  const handleUnhold = (containerId) => {
    const updatedContainers = containers.filter(
      (container) => container.container_id !== containerId
    );

    localStorage.setItem("containers", JSON.stringify(updatedContainers));
    setContainers(updatedContainers);
  };

  // Handle expanding or collapsing a row
  const handleRowClick = (containerId) => {
    setExpandedRow(expandedRow === containerId ? null : containerId);
  };

  const handleHoldTypeChange = (event) => {
    setHoldType(event.target.value);
  };

  const handleContainerId = (event) => {
    setContainerId(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
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
  const filteredContainers = containers.filter((container) =>
    container.container_id.toLowerCase().includes(searchTerm)
  );

  return (
    <>
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
            label="Search by Container ID"
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
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <TextField
              required
              id="container-id"
              label="Container ID"
              variant="outlined"
              sx={{ width: "100%", marginBottom: 3 }}
              value={ContainerId} // Unique container ID
              onChange={handleContainerId}
            />
            <FormControl fullWidth sx={{ width: "100%", marginBottom: 3 }}>
              <InputLabel id="hold-type-select-label">Hold Type</InputLabel>
              <Select
                labelId="hold-type-select-label"
                id="hold-type-select"
                value={holdType}
                label="Hold Type"
                onChange={handleHoldTypeChange}
              >
                <MenuItem value={"Money"}>Money</MenuItem>
                <MenuItem value={"Documents"}>Documents</MenuItem>
                <MenuItem value={"Equipment"}>Equipment</MenuItem>
              </Select>
            </FormControl>

            <Button onClick={handleAddContainer} variant="contained">
              Confirm
            </Button>
          </Box>
        </Modal>
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
                <StyledTableCell>Hold Types</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContainers && filteredContainers.length > 0 ? (
                filteredContainers.map((container, index) => (
                  <React.Fragment key={index}>
                    <StyledTableRow
                      onClick={() => handleRowClick(container.container_id)}
                    >
                      <TableCell>{container.container_id}</TableCell>
                      <TableCell>
                        {/* Display first hold type as a chip */}
                        {container.hold_types &&
                          container.hold_types.length > 0 &&
                          container.hold_types.map(
                            (el, index) => index < 2 && <Chip label={el.hold} />
                          )}
                      </TableCell>
                      <TableCell>{container.date}</TableCell>
                      <TableCell>
                        {/* Unhold button to remove the entire container */}
                        <Button
                          onClick={() => handleUnhold(container.container_id)}
                        >
                          Unhold All
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                    {/* Expand row to show all hold types */}
                    {expandedRow === container.container_id && (
                      <StyledTableRow>
                        <TableCell colSpan={4}>
                          <ul>
                            {container.hold_types.map((hold, index) => (
                              <li key={index}>
                                {hold.hold} - {hold.date}
                              </li>
                            ))}
                          </ul>
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
    </>
  );
}
