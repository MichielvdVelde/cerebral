import { type FC } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

const App: FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Link to="/arena">Arena</Link>
    </Box>
  );
};

export default App;
