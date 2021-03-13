import Credentials from "./Credentials";

const Forms = ({ forms }) => {
  return forms.map((elem, i) => {
    return (
      <Credentials
        key={i}
        legend={forms[i].legend}
        action={forms[i].action}
        value={forms[i].value}
      />
    );
  });
};

export default Forms;
