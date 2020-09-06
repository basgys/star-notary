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
  onCreated: (s: Star) => void
  onCancel: () => void
}

export const StarForm = (props: Props & React.HTMLAttributes<any>) => {
  const starNotary = useContract(StarNotary);
  const account = useAccount();
  const [name, setName] = useState("");
  const [id, setID] = useState("");

  const createStar = () => {
    starNotary.instance?.methods.createStar(name, id).send({
      from: account,
    }).then(() => {
      setName("")
      setID("")
      props.onCreated(new Star(id, name, account!));
    });
  }

  return (
    <div className="star-form">
      <Field>
        <label>Star Name
          <Input
            type="text"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </label>
      </Field>
      <Field>
        <label>Star ID
          <Input
            type="number"
            value={id}
            onChange={(e: any) => setID(e.target.value)}
          />
        </label>
      </Field>

      <Buttons justify="right" align="baseline">
        <Button button onClick={props.onCancel}>Cancel</Button>
        <Button button onClick={createStar} action="primary">Create Star</Button>
      </Buttons>
    </div>
  )
};

export default StarForm;