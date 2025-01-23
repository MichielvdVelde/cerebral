import { FC, useMemo } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../app/hooks";
import { selectSessions } from "../slice";
import Link from "./Link";

const ArenaHome: FC = () => {
  const sessions = useAppSelector(selectSessions);
  const sessionsArray = useMemo(() => Object.values(sessions), [sessions]);

  return (
    <>
      <Typography variant="h4" sx={{ p: 2 }}>Sessions</Typography>
      <Box mt={2}>
        <List>
          {sessionsArray.length
            ? sessionsArray.map((session) => (
              <ListItem key={session.id}>
                <ListItemText
                  primary={session.brief}
                  secondary={`Round: ${session.round}`}
                />
                <Link to={`/arena/session/${session.id}`}>Join</Link>
              </ListItem>
            ))
            : <Typography>No sessions</Typography>}
        </List>
      </Box>
      <Box mt={2}>
        <Link to="/arena/create">Create a session</Link>
      </Box>
    </>
  );
};

export default ArenaHome;
