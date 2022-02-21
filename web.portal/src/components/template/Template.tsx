import React, { FC } from "react";
import { Layout, Menu } from "antd";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBinoculars } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const { Header, Content, Footer } = Layout;

const StyledContent = styled(Content)`
  padding: 0px 50px;
`;

const StyledLayoutContent = styled.div`
  background: #fff;
  padding: 24px;
  min-height: calc(100vh - 135px);
`;

const StyledLogo = styled.div`
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
  color: white;
  font-weight: bold;
  line-height: normal;
  padding: 6px;
  text-align: center;
`;

export const Template: FC = ({ children }) => {
  return (
    <Layout className="layout">
      <Header>
        <StyledLogo>
          <FontAwesomeIcon icon={faBinoculars}/> Parody Police
        </StyledLogo>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="home"> <Link to="/">Home</Link></Menu.Item>
          <Menu.Item key="classify"><Link to="/classify">Classify Article</Link></Menu.Item>
        </Menu>
      </Header>
      <StyledContent>
        <StyledLayoutContent>
          {children}
        </StyledLayoutContent>
      </StyledContent>
      <Footer style={{ textAlign: "center" }}>
        Parody Police  &copy; 2020 Created by Chuksy Olisa
      </Footer>
    </Layout>
  );
};
