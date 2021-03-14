import Authentication from './Authentication';

const Forms = ({ forms, history }) => {
  return forms.map((elem, i) => {
    return (
      <Authentication
        key={i}
        legend={forms[i].legend}
        action={forms[i].action}
        value={forms[i].value}
        history={history}
      />
    );
  });
};

export default Forms;
