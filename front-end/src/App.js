import React, { createRef } from 'react'
import { Container, Dimmer, Loader, Grid, Sticky, Message, } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'

import AccountSelector from './AccountSelector'
import Balances from './Balances'
import BlockNumber from './BlockNumber'
import Events from './Events'
import Interactor from './Interactor'
import Metadata from './Metadata'
import NodeInfo from './NodeInfo'
import PoeType from './PoeType';
import PoeAllInOne from './PoeAllInOne';
import Padding from './Padding';
import ShowProofs from './ShowProofs';
import Transfer from './Transfer'
import Upgrade from './Upgrade'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Substrate')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row>
            <PoeType />
          </Grid.Row>
          <Grid.Row>
            <Padding />
          </Grid.Row>
          <Grid.Row>
            <Events />
          </Grid.Row>
          <Grid.Row>
            <Padding />
          </Grid.Row>
          <Grid.Row>
            <PoeAllInOne />
          </Grid.Row>
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <ShowProofs />
          </Grid.Row>
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <Padding />
          </Grid.Row>  
          <Grid.Row>
            <Interactor />
          </Grid.Row>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  )
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
