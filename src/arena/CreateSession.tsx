import { ChangeEvent, type FC, useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";
import { buildSession, Facet } from "./types";
import { useSessions } from "./hooks";
import facets from "./test";

export const CreateSession: FC = () => {
  const { createSession } = useSessions();
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [participants, setParticipants] = useState<Facet[]>([]);
  const navigate = useNavigate();

  const valid = useMemo(() => brief.length && participants.length, [
    brief,
    participants,
  ]);

  const create = useCallback(() => {
    if (!brief.length) {
      setError("Brief is required");
      return;
    } else if (!participants.length) {
      setError("Participants are required");
      return;
    }

    const session = buildSession(brief, participants);
    createSession(session);
    navigate(`/arena/session/${session.id}`);
  }, [brief, participants, createSession, navigate]);

  const onBriefChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setBrief(e.target.value);
  }, []);

  const addParticipant = useCallback((participant: Facet) => {
    setParticipants([...participants, participant]);
  }, [participants]);

  const removeParticipant = useCallback((participant: Facet) => {
    setParticipants(participants.filter((p) => p !== participant));
  }, [participants]);

  return (
    <Box>
      <Typography variant="h4" m="2">Create a session</Typography>
      {error ? <Alert severity="error" sx={{ m: 2 }}>{error}</Alert> : null}
      <TextField
        label="Brief"
        placeholder="Describe the goal of the session..."
        value={brief}
        onChange={onBriefChange}
        sx={{ mt: 2 }}
        multiline
        rows={4}
        fullWidth
      />
      <Box>
        <Typography variant="h6" sx={{ mt: 2 }}>Participants</Typography>
        <Box>
          <List>
            {facets.map((facet, i) => (
              <ListItem
                key={i}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={participants.includes(facet)}
                    onChange={() =>
                      participants.includes(facet)
                        ? removeParticipant(facet)
                        : addParticipant(facet)}
                  />
                }
              >
                <ListItemText primary={facet.name} secondary={facet.role} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box sx={{ mt: 2, ml: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={create}
          disabled={!valid}
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default CreateSession;
