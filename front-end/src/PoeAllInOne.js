import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card, Statistic, Message, Dropdown, Label } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
  const [status, setStatus] = useState('')

  // The currently stored value
  const [digest, setDigest] = useState('');
  const [owner, setOwner] = useState('');
  const [block, setBlock] = useState(0);

  const [field1Label, setField1Label] = useState('')
  const [field2Label, setField2Label] = useState('')
  const [field3Label, setField3Label] = useState('')
  const [field4Label, setField4Label] = useState('')
  const [field5Label, setField5Label] = useState('')
  
  const [poeTypeValue, setpoeTypeValue] = useState('')
  const [field1Value, setField1Value] = useState('')
  const [field2Value, setField2Value] = useState('')
  const [field3Value, setField3Value] = useState('')
  const [field4Value, setField4Value] = useState('')
  const [field5Value, setField5Value] = useState('')

  const [poeTypeNames, setPoeTypeNames] = useState([])
  const [paramFields, setParamFields] = useState([])

  const initFormState = {
    poeTypeName: '',

  };

  const [formState, setFormState] = useState(initFormState);
  const { poeTypeName } = formState;

  const bufferToDigest = () => {
    const temp = field1Value + field2Value + field3Value + field4Value + field5Value;
    console.log(temp);
    const hash = blake2AsHex(temp, 256);
    console.log(hash);
    setDigest(hash);
  };
 
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
          console.log(field1Label);          
          }
        }
    });
  }


  useEffect(updatePoeTypeNames, [api]);
  useEffect(updateParamFields, [api, poeTypeName]);

  useEffect(() => {
    let unsubscribe
    api.query.poeAllInOne
      .proofs(poeTypeValue, digest, result => {
        // Our storage item returns a tuple, which is represented as an array.
        setOwner(result[5].toString());
        setBlock(result[6].toNumber());
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
      <h1>Create Proofs</h1>
      <Form success={!!digest && !isCreated()} warning={isCreated()}>
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
          {/* Show this message if the proof is available to be created */}
          <Message success header="Proof is available" />
          {/* Show this message if the proof is already created. */}
          <Message
            warning
            header="Proof is taken"
            list={[`Owner: ${owner}`, `Block: ${block}`]}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label={field1Label}
            state="field_1"
            type="text"
            onChange={(_, {value}) => {setField1Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label={field2Label}
            state="field2_"
            type="text"
            onChange={(_, { value }) => {setField2Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label={field3Label}
            state="field_3"
            type="text"
            onChange={(_, { value }) => {setField3Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label={field4Label}
            state="field_4"
            type="text"
            onChange={(_, { value }) => {setField4Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label={field5Label}
            state="field_5"
            type="text"
            onChange={(_, { value }) => {setField5Value(value); bufferToDigest();}}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create Proof"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'poeAllInOne',
              callable: 'createProof',
              inputParams: [poeTypeValue, digest, field1Value, field2Value, field3Value, field4Value, field5Value],
              paramFields: [true, true, true, true, true, true, true],
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
