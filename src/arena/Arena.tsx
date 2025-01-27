import { type FC, useCallback, useMemo, useState } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import { useSession } from "./hooks";
import DotAnimation from "./components/DotAnimation";
import MessageView from "./components/MessageView";

export const Arena: FC = () => {
  const params = useParams();
  const id = params.id!;

  const {
    round,
    participants,
    working,
    error,
    messages,
    nextRound,
  } = useSession(id);
  const nextParticipant = useMemo(
    () => participants[round % participants.length],
    [participants, round],
  );

  const [selectedParticipant, setSelectedParticipant] = useState<string>(
    nextParticipant.id,
  );
  const [details, setDetails] = useState("");

  const next = useCallback((facetId?: string) => {
    nextRound({
      facetId: facetId ?? selectedParticipant,
      details: details.length ? details : undefined,
    });
  }, [nextRound, selectedParticipant, details]);

  const onSelect = useCallback((e: SelectChangeEvent<HTMLSelectElement>) => {
    setSelectedParticipant(e.target.value as string);
  }, []);

  const onNext = useCallback(() => {
    next(selectedParticipant);
    setDetails("");
  }, [next, selectedParticipant, setDetails]);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Grid>
      <Grid container size={12}>
        <Grid size={4}>
          <Select
            value={selectedParticipant as any}
            fullWidth
            onChange={onSelect}
          >
            <MenuItem value={nextParticipant.id}>
              Next participant ({nextParticipant.name})
            </MenuItem>
            {participants.map((participant) => (
              <MenuItem key={participant.id} value={participant.id}>
                {participant.name} ({participant.role})
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Details"
            placeholder="Add any details..."
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={onNext}
            disabled={working !== false}
            sx={{ mt: 2 }}
          >
            Next
          </Button>
          <Box display="flex" flexDirection="row" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Round: {round}
            </Typography>
            <Typography variant="body2">
              Working: {error
                ? "Error"
                : working
                ? participants.find((p) => p.id === working)!.name
                : "No"}
            </Typography>
          </Box>
        </Grid>
        <Grid size={8}>
          {messages.length
            ? (
              <Grid container spacing={2}>
                {messages.map((message, i) => (
                  <Grid key={i} size={12} sx={{ m: 2 }}>
                    <MessageView message={message} />
                  </Grid>
                ))}
              </Grid>
            )
            : (
              <Grid size={12}>
                <Typography sx={{ m: 2 }}>No messages</Typography>
              </Grid>
            )}

          {working
            ? (
              <Grid size={12} sx={{ p: 2 }}>
                <Typography variant="h6">
                  {participants.find((p) => p.id === working)!.name}
                </Typography>
                <Typography>
                  Thinking<DotAnimation />
                </Typography>
              </Grid>
            )
            : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Arena;
