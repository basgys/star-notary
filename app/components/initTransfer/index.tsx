import Input from "components/input";
import Button from "components/button";
import Field from "layouts/field";
import Buttons from "components/buttongroup";
import { useContract } from "hooks/useContract";
import { useAccount } from "hooks/useAccount";

import StarNotary from "contracts/StarNotary.json";
import { useState } from "react";
import Star from "models/star";

interface Props {
  starId: string
  onInitiated: (to: string) => void
  onCancel: () => void
}

export const InitTransfer = (props: Props & React.HTMLAttributes<any>) => {
  const starNotary = useContract(StarNotary);
  const account = useAccount();
  const [to, setTo] = useState("");

  const init = () => {
    starNotary.instance?.methods.approveExchange(to, props.starId).send({
      from: account,
    }).then(() => {
      props.onInitiated(to);
    });
  }

  return (
    <div className="init-transfer">
      <Field>
        <label>To <Input type="text" value={to} onChange={(e: any) => setTo(e.target.value)} /></label>
      </Field>

      <Buttons justify="right" align="baseline">
        <Button button onClick={props.onCancel}>Cancel</Button>
        <Button button onClick={init} action="primary">Transfer</Button>
      </Buttons>
    </div>
  )
};

export default InitTransfer;