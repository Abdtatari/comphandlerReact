import {
  ClickAwayListener,
  MenuItem,
  MenuList,
  Popper,
  Grow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useRef, useState } from "react";
export default function TableDropdown({
  handleDelete,
  handleEdit,
  handleHistory,
  handleConfiguration,
  handleAccess,
  level,
}) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <IconButton
        sx={{ width: 20, height: 20 }}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MoreVertIcon />
      </IconButton>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper sx={{ zIndex: 10 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem onClick={handleHistory}>
                    {" "}
                    <Typography color={"primary"}>History</Typography>
                  </MenuItem>
                  {level == 2 ? (
                    <>
                      <MenuItem onClick={handleEdit}>
                        <Typography color={"primary"}>EDIT</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleConfiguration}>
                        {" "}
                        <Typography color={"primary"}>Configuration</Typography>
                      </MenuItem>
                    </>
                  ) : null}
                  <MenuItem onClick={handleDelete}>
                    {" "}
                    <Typography color={"error"}>DELETE</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
