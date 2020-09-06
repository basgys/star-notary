import { ChangeEvent, useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";

import Input from "components/input";
import Button from "components/button";
import Dialogue, { DialogueTitle, DialogueContent } from 'components/dialogue';
import StarForm from "components/starForm";
import qs from "libs/qs";
import Star from "models/star";

interface Props {}

export const Bar = (props: Props & React.HTMLAttributes<any>) => {
  const router = useRouter()
  const [search, setSearch] = useState(qs.String("id"));
  const [starFormOpen, setStarFormOpen] = useState(false);

  const routeToStar = (starId: number) => {
    router.replace(
      {
        pathname: `/star/[id]`,
      },
      {
        pathname: `/star/${starId}`,
      },
      { shallow: true, }
    )
  }
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }
  const onLookup = () => {
    if (!search) return
    const id = parseInt(search)
    if (isNaN(id)) return
    routeToStar(id)
  }
  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.keyCode || e.charCode;
    const isEnter = (key === 13);
    if (isEnter) {
      onLookup()
    }
  }
  const openStarForm = () => setStarFormOpen(true);
  const closeStarForm = () => setStarFormOpen(false);
  const onStarCreated = (star: Star) => {
    closeStarForm();
    routeToStar(parseInt(star.id));
  }

  return (
    <div className="bar">
      <Link href="/">
        <a><h1 className="title bar__title">Star Notary</h1></a>
      </Link>
      <Input
        className="bar__search"
        value={search}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="Look up a star..."
      />
      <Button className="bar__action" onClick={onLookup}>Lookup</Button>
      <Button className="bar__action" action="primary" onClick={openStarForm}>Create</Button>

      <Dialogue open={starFormOpen}>
        <DialogueTitle>Create a star</DialogueTitle>
        <DialogueContent>
          <StarForm onCreated={onStarCreated} onCancel={closeStarForm} />
        </DialogueContent>
      </Dialogue>
    </div>
  )
};

export default Bar;