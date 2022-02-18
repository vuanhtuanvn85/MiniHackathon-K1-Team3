import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card, Statistic, Message, Dropdown, Label, Table, Button } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrateState } from './substrate-lib'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  const [field1Label, setField1Label] = useState('')
  const [field2Label, setField2Label] = useState('')
  const [field3Label, setField3Label] = useState('')
  const [field4Label, setField4Label] = useState('')
  const [field5Label, setField5Label] = useState('')
    
  const [poeTypeValue, setpoeTypeValue] = useState('')
  const [poeTypeNames, setPoeTypeNames] = useState([])
  const [poeProofs, setPoeProofs] = useState([])

  const initFormState = {
    poeTypeName: '',

  };

  const [formState, setFormState] = useState(initFormState);
  const { poeTypeName } = formState;
 
  const updatePoeTypeNames = () => {
    if (!api) { return; }
    const temp = api.query.poeAllInOne.poeTypes.entries((result) => {
      const poeTypeNames = result
      .map(type => ({ key: type[1][0].toHuman(), value: type[1][0].toHuman(), text: type[1][0].toHuman() }));
      setPoeTypeNames(poeTypeNames);
    });
  };


  const updateParamFields = () => {
    if (!api) { return; }
    const temp = api.query.poeAllInOne.poeTypes.entries((result) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i][1][0].toHuman() === poeTypeName) {
          setpoeTypeValue(result[i][0].toHuman()[0])
          setField1Label(result[i][1][2].toHuman())
          setField2Label(result[i][1][3].toHuman())
          setField3Label(result[i][1][4].toHuman())
          setField4Label(result[i][1][5].toHuman())
          setField5Label(result[i][1][6].toHuman())       
          }
        }
    });
  }


  const updateTable = () => {
    if (!api) { return; }
    const temp2 = api.query.poeAllInOne.proofs.entries(poeTypeValue, (result2) => {
      setPoeProofs(result2);
    });
  }

  useEffect(updatePoeTypeNames, [api]);
  useEffect(updateParamFields, [api, poeTypeName]);
  useEffect(updateTable, [api, poeTypeValue]);

  const onPoeTypeNameChange = (_, data) => {
    setFormState(formState => {
      let res;
      const { state, value } = data;
      if (state === 'poeTypeName') {
        res = { ...formState, [state]: value, inputParams: [] };
      }
      return res;
    });
  };

  return (
    <Grid.Column>
      <h1>Show Proofs</h1>
      <Form>
        <Form.Field>
          <Dropdown
            placeholder='Poe Type Name'
            fluid
            label='Poe Type Name'
            onChange={onPoeTypeNameChange}
            search
            selection
            state='poeTypeName'
            value={poeTypeName}
            options={poeTypeNames}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Poe type"
            state="poe_type"
            type="text"
            value={poeTypeValue}
          />
        </Form.Field>
        {poeProofs.length === 0 ? (
        <Label basic color="yellow">
          No proofs to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
          <Table.Row>
              <Table.Cell  width={1} textAlign="center">
                <strong>ID</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="left">
                <strong>{field1Label}</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="left">
                <strong>{field2Label}</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="left">
                <strong>{field3Label}</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="left">
                <strong>{field4Label}</strong>
              </Table.Cell>
              <Table.Cell width={3} textAlign="left">
                <strong>{field5Label}</strong>
              </Table.Cell>
            </Table.Row>
            {poeProofs.map(proof => (
              <Table.Row key={proof[1][0].toHuman()}>
                <Table.Cell width={1} textAlign="center">
                  <CopyToClipboard text={proof[0].toHuman()}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                </Table.Cell>
                <Table.Cell width={3} textAlign="left">
                  {proof[1][0].toHuman()}
                </Table.Cell>
                <Table.Cell width={3} textAlign="left">
                  {proof[1][1].toHuman()}
                </Table.Cell>
                <Table.Cell width={3} textAlign="left">
                  {proof[1][2].toHuman()}
                </Table.Cell>
                <Table.Cell width={3} textAlign="left">
                  {proof[1][3].toHuman()}
                </Table.Cell>
                <Table.Cell width={3} textAlign="left">
                  {proof[1][4].toHuman()}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}

export default function TemplateModule(props) {
  const { api } = useSubstrateState()
  return api.query.templateModule && api.query.templateModule.something ? (
    <Main {...props} />
  ) : null
}
