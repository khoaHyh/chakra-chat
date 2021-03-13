import Authentication from './Authentication';

const Forms = ({ forms }) => {
  return forms.map((elem, i) => {
    return (
      <Authentication
        key={i}
        legend={forms[i].legend}
        action={forms[i].action}
        value={forms[i].value}
      />
    );
  });
};

export default Forms;
