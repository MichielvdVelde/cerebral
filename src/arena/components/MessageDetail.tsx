import type { Message } from "../types";
import { type FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Markdown from "react-markdown";

interface MessageDetailProps {
  open?: boolean;
  message: Message;
  onClose: () => void;
}

const MessageDetail: FC<MessageDetailProps> = (
  { open = false, onClose, message },
) => {
  const [mdEnabled, setMdEnabled] = useState(true);

  useEffect(() => {
    if (!open && !mdEnabled) {
      setMdEnabled(true);
    }
  }, [open, mdEnabled]);

  if (!open) {
    return null;
  }

  const mentions = Object.keys(message.mentions);
  const timing = message.timing.end - message.timing.start;

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Message by {message.name}</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="body2">Facet</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">
                {message.facet.name}
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">Role</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">{message.facet.role}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">Usage</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">
                Prompt: {message.usage.prompt} tokens
                <br />Completion: {message.usage.completion} tokens
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">Duration</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">
                {timing.toLocaleString("en-US")}ms
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">Mentions</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2">
                {mentions.length ? mentions.join(", ") : "None"}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  Thoughts
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <Markdown>{message.content.thinking}</Markdown>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  Response
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    <Markdown>{message.content.response}</Markdown>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid size={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  Template
                </AccordionSummary>
                <AccordionDetails sx={{ overflowX: "auto" }}>
                  <Grid container>
                    <Grid size={12} sx={{ marginBottom: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={mdEnabled}
                            onChange={(e) => setMdEnabled(e.target.checked)}
                            size="small"
                          />
                        }
                        label={`${mdEnabled ? "Disable" : "Enable"} Markdown`}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Divider />
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2">
                        {mdEnabled
                          ? <Markdown>{message.template}</Markdown>
                          : (
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-wrap" }}
                            >
                              {message.template}
                            </Typography>
                          )}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetail;
