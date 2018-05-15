export default {
  resources: {},
  load({ url, name }) {
    const img = new Image();
    img.onload = () => {
      this.resources[name] = img;
    };
    img.src = url;
  },
  get(name) {
    if (Object.prototype.hasOwnProperty.call(this.resources, name)) {
      return this.resources[name];
    }

    return null;
  },
}