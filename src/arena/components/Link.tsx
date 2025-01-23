import type { FC } from "react";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink, type LinkProps } from "react-router-dom";

const Link: FC<LinkProps> = (props) => (
  <MuiLink component={RouterLink} {...props} />
);

export default Link;
