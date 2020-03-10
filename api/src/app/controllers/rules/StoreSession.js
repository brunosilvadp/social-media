const Yup = require('yup');

class StoreSession {
  async create(body) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required(),
      password: Yup.string().required(),
    });

    return schema.isValid(body);
  }
}

module.exports = new StoreSession();
