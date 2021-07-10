import { css } from "@emotion/react";
import { Container, Grid } from "@material-ui/core";
import ForumListView from "../components/ForumListView"
import ThreadView from "../components/ThreadView";

const MainView: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={2} css={css`
        height: 100vh;
        background-color: #ccc;
      `}>
        <ForumListView />
      </Grid>
      <Grid item xs={6} css={css`
        background-color: #bcb;

      `}>
        <Container>
          <ThreadView />
        </Container>
      </Grid>
    </Grid>
  );
}

export default MainView