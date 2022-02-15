import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card, Statistic, Message } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0)
  const [digest, setDigest] = useState('');
  const [owner, setOwner] = useState('');
  const [block, setBlock] = useState(0);
  const [nameValue, setNameValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const [field1Value, setField1Value] = useState('')
  const [field2Value, setField2Value] = useState('')
  const [field3Value, setField3Value] = useState('')
  const [field4Value, setField4Value] = useState('')
  const [field5Value, setField5Value] = useState('')

  const bufferToDigest = () => {
    const hash = blake2AsHex(nameValue + field1Value + field2Value + field3Value + field4Value + field5Value, 256);
      setDigest(hash);
    };

  useEffect(() => {
    let unsubscribe
    api.query.poeAllInOne
      .poeTypes(digest, result => {
        // Our storage item returns a tuple, which is represented as an array.
        setOwner(result[7].toString());
        setBlock(result[8].toNumber());
      })
      .then(unsub => {
        unsubscribe = unsub;
      });
    return () => unsubscribe && unsubscribe();
  }, [digest, api.query.poeAllInOne]);


  // We can say a file digest is claimed if the stored block number is not 0
  function isCreated () {
    return block !== 0;
  }

  return (
    <Grid.Column width={8}>
      <h1>Create Poe Type</h1>
      <Form success={!!digest && !isCreated()} warning={isCreated()}>
        <Form.Field>
          <Input
            label="Name "
            state="name"
            type="text"
            onChange={(_, { value }) => {setNameValue(value); bufferToDigest();}}
          />
          {/* Show this message if the poe type is available to be created */}
          <Message success header="Poe type name is available" />
          {/* Show this message if the poe type is already created. */}
          <Message
            warning
            header="Poe type name is taken"
            list={[`Owner: ${owner}`, `Block: ${block}`]}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Description"
            state="description"
            type="text"
            onChange={(_, { value }) => {setDescriptionValue(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Field 1   "
            state="field_1"
            type="text"
            onChange={(_, { value }) => {setField1Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Field 2"
            state="field2_"
            type="text"
            onChange={(_, { value }) => {setField2Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Field 3"
            state="field_3"
            type="text"
            onChange={(_, { value }) => {setField3Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Field 4"
            state="field_4"
            type="text"
            onChange={(_, { value }) => {setField4Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label="Field 5"
            state="field_5"
            type="text"
            onChange={(_, { value }) => {setField5Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create Poe Type"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'poeAllInOne',
              callable: 'createPoeType',
              inputParams: [digest, nameValue, descriptionValue, field1Value, field2Value, field3Value, field4Value, field5Value],
              paramFields: [true, true, true, true, true, true, true, true],
            }}
          />
        </Form.Field>
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
