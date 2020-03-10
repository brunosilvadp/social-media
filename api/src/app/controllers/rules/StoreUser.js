const Yup = require('yup');

class StoreUser {
  async create(body) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    return schema.isValid(body);
  }

  async update(body) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email()
    });

    return schema.isValid(body);
  }
}

module.exports = new StoreUser();
