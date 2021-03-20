import { Layout } from "antd"
import { Content, Header } from "antd/lib/layout/layout"
import Sider from "antd/lib/layout/Sider"

const MainView: React.FC = () => {
  return (
    <Layout>
      <Sider width="20%" >

      </Sider>
      <Layout>
        <Header>
        </Header>
        <Content>

        </Content>
      </Layout>
    </Layout>
  );
}

export default MainView