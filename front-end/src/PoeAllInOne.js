import React, { useEffect, useState } from 'react'
import { Form, Input, Grid, Card, Statistic, Message, Dropdown } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

// Polkadot-JS utilities for hashing data.
import { blake2AsHex } from '@polkadot/util-crypto';
import { hexToString, u8aToString } from '@polkadot/util';

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

  const [poeTypeNames, setPoeTypeNames] = useState([]);

  const initFormState = {
    poeTypeName: '',
    callable: '',
    inputParams: []
  };

  const [formState, setFormState] = useState(initFormState);
  const { poeTypeName, callable, inputParams } = formState;

  const bufferToDigest = () => {
  const hash = blake2AsHex(nameValue, 256);
    setDigest(hash);
  };




 
  const updatePoeTypeNames = () => {
    if (!api) { return; }
    const apiType = api.rpc;
    console.log("apiType");
    console.log(apiType);
    console.log("poeTypes");
    const temp = api.query.poeAllInOne.poeTypes.entries((result) => {
      console.log("result");
      console.log(result);
      const poeTypeNames2 = result
      .map(pr => ({ key: u8aToString(pr[0]), value: pr[0], text: pr[0] }));
      console.log("poeTypeNames2");
      console.log(poeTypeNames2);

      setPoeTypeNames(poeTypeNames2);
    });
    console.log("Object.keys(apiType)");
    console.log(Object.keys(apiType));
    const poeTypeNames = Object.keys(apiType).sort()
      .filter(pr => Object.keys(apiType[pr]).length > 0)
      .map(pr => ({ key: pr, value: pr, text: pr }));
    console.log("poeTypeNames");
    console.log(poeTypeNames);

  };

  useEffect(updatePoeTypeNames, [api]);

  // useEffect(() => {
  //   let unsubscribe
  //   api.query.poeAllInOne
  //     .poeTypes(digest, result => {
  //       // Our storage item returns a tuple, which is represented as an array.
  //       setOwner(result[7].toString());
  //       setBlock(result[8].toNumber());
  //     })
  //     .then(unsub => {
  //       unsubscribe = unsub;
  //     });
  //   return () => unsubscribe && unsubscribe();
  // }, [digest, api.query.poeAllInOne]);


  // We can say a file digest is claimed if the stored block number is not 0
  function isCreated () {
    return block !== 0;
  }


  const onPoeTypeNameChange = (_, data) => {
    console.log(data.value);
    console.log('onPoeTypeNameChange');
    // setFormState(formState => {
    //   let res;
    //   const { state, value } = data;
    //   if (typeof state === 'object') {
    //     // Input parameter updated
    //     const { ind, paramField: { type } } = state;
    //     const inputParams = [...formState.inputParams];
    //     inputParams[ind] = { type, value };
    //     res = { ...formState, inputParams };
    //   } else if (state === 'poeTypeName') {
    //     res = { ...formState, [state]: value, callable: '', inputParams: [] };
    //   } else if (state === 'callable') {
    //     res = { ...formState, [state]: value, inputParams: [] };
    //   }
    //   return res;
    // });
  };

  return (
    <Grid.Column width={8}>
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
