import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Route } from 'react-router-dom'
import { UserMessagesTable } from './UserMessagesTable'

const StyledMainPage = styled.div`
  text-align: center;
  min-height: 100vh;
`

const Header = styled.header`
  background-color: #001529;
  color: #ffffff;
  margin-bottom: 50px;
`

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  height: 64px;
  line-height: 64px;
  padding: 0 50px;

  @media (max-width: 600px) {
    padding: 0 20px;
  }
`

export const MainPage = () => {

  useEffect(() => {
    const w = window as any
    if (w.ethereum) {
      w.ethereum.autoRefreshOnNetworkChange = false
    }
  }, [])

  return (
    <StyledMainPage>
      <Header>
        <HeaderContainer>
          <span>AMB Transaction Monitor</span>
        </HeaderContainer>
      </Header>
      <div className="container">
        <Route
          exact
          path={['/', '/:searchMode/:searchParam']}
          children={
            <div>
              <UserMessagesTable />
            </div>
          }
        />
      </div>
    </StyledMainPage>
  )
}
