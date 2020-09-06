export default class Star {
  id: string
  name: string
  owner: string
  onSale: boolean
  price?: string

  constructor(id: string, name: string, owner: string) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.onSale = false;
  }
}