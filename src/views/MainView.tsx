import { css } from "@emotion/react";
import { Grid } from "@material-ui/core";
import ForumListView from "../components/ForumListView"

const MainView: React.FC = () => {
  return (
    <Grid container>
      <Grid item css={css`
        width: 20vw;

      `}>
        <ForumListView />
      </Grid>
    </Grid>
  );
}

export default MainView