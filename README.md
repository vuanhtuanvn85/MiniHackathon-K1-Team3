# MiniHackathon-K1-Team3
**poe_types**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+id: u128  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+desc: Vec< u8 >  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+number_fields: u8  
  
**poe_fields**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+id: u128  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+poe_type_id: u128   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ordinal: u8  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+field_value: Vec< u8 >  
  
**poe_values**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+id: u128  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+poe_field_id: u128  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+poe_value: Vec< u8 >  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+owner: AccountId  