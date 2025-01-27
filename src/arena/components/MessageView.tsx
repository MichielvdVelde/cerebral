import type { Message } from "../types";
import { type FC, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import Markdown from "react-markdown";
import MessageDetail from "./MessageDetail";

const MessageView: FC<{ message: Message }> = ({ message }) => {
  const [showDetail, setShowDetail] = useState(false);

  const showDetailDialog = useCallback(() => {
    setShowDetail(true);
  }, []);

  const closeDetail = useCallback(() => {
    setShowDetail(false);
  }, []);

  const timing = message.timing.end - message.timing.start;

  return (
    <>
      <MessageDetail
        message={message}
        open={showDetail}
        onClose={closeDetail}
      />
      <Box>
        <Typography variant="h6" sx={{ m: 1 }}>{message.name}</Typography>
        <Box>
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
        </Box>
        <Typography>
          <Markdown>{message.content.response}</Markdown>
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box display="flex" flexDirection="row">
            <Typography variant="caption" sx={{ mr: 2 }}>
              Duration: {timing.toLocaleString("en-US")}ms
            </Typography>
            <Typography variant="caption">
              Usage:{" "}
              <Tooltip
                title={
                  <Typography variant="caption">
                    Prompt: {message.usage.prompt.toLocaleString("en-US")}{" "}
                    tokens
                    <br />
                    Completion:{" "}
                    {message.usage.completion.toLocaleString("en-US")} tokens
                  </Typography>
                }
              >
                <span>
                  {(message.usage.prompt + message.usage.completion)
                    .toLocaleString("en-US")} tokens
                </span>
              </Tooltip>
            </Typography>
            <Typography variant="caption" sx={{ ml: "auto", mr: 2 }}>
              <Link onClick={showDetailDialog} sx={{ cursor: "pointer" }}>
                Details
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MessageView;
